// app/api/manga/[id]/route.js
import { fetchWithRetry } from "@/app/lib/jikan";
import { getNames } from "@/app/lib/utils";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const [mangaRes, charsRes] = await Promise.all([
      fetchWithRetry(`manga/${id}/full`),
      fetchWithRetry(`manga/${id}/characters`),
    ]);

    const manga = mangaRes?.data || {};
    const externalLinks = manga.external || [];

    const fetchEntryImage = async (mal_id, type) => {
      try {
        const detail = await fetchWithRetry(`${type.toLowerCase()}/${mal_id}`);
        return detail.data?.images || null;
      } catch {
        return null;
      }
    };

    const relations = manga.relations
      ? await Promise.all(
          manga.relations.map(async (relation) => {
            const updatedEntries = await Promise.all(
              relation.entry.map(async (entry) => {
                const images = await fetchEntryImage(
                  entry.mal_id,
                  entry.type || "manga"
                );
                return {
                  ...entry,
                  images: images,
                };
              })
            );
            return {
              relation: relation.relation,
              entry: updatedEntries,
            };
          })
        )
      : [];

    const characters =
      charsRes?.data?.map((char) => ({
        mal_id: char.character.mal_id,
        name: char.character.name,
        image:
          char.character.images?.jpg?.image_url || "/placeholder-character.jpg",
        role: char.role,
      })) || [];

    const alternativeTitles = {
      synonyms: manga.title_synonyms || [],
      japanese: manga.title_japanese || null,
      english: manga.title_english || null,
    };

    const information = {
      type: manga.type || "-",
      chapters: manga.chapters ?? "-",
      volumes: manga.volumes ?? "-",
      status: manga.status || "-",
      published: manga.published?.string || "-",
      authors: getNames(manga.authors),
      serialization: getNames(manga.serializations),
      genres: getNames(manga.genres),
      demographics: getNames(manga.demographics),
      score: manga.score ? manga.score.toFixed(2) : "-",
    };

    return Response.json({
      manga,
      characters,
      alternativeTitles,
      information,
      relations,
      externalLinks,
    });
  } catch (error) {
    console.error("Error in API route:", error);
    return Response.json(
      { error: "Failed to fetch manga data" },
      { status: 500 }
    );
  }
}

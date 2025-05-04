import { fetchWithRetry } from "@/app/lib/jikan";
import MangaDetailContent from "@/app/components/MangaDetails/MangaDetailsContent";
import { getNames } from "@/app/lib/utils";

export const revalidate = 3600;
export const dynamicParams = true;

async function getMangaData(id) {
  try {
    // Perbaikan: Tambahkan slash (/) sebelum 'full'
    const mangaRes = await fetchWithRetry(`manga/${id}/full`);
    const manga = mangaRes?.data || {};
    const relations = manga.relations || [];
    const externalLinks = manga.external || [];

    let characters = [];

    try {
      const charsRes = await fetchWithRetry(`manga/${id}/characters`);
      characters =
        charsRes?.data?.map((char) => ({
          mal_id: char.character.mal_id,
          name: char.character.name,
          image:
            char.character.images?.jpg?.image_url ||
            "/placeholder-character.jpg",
          role: char.role,
        })) || [];
    } catch (err) {
      console.warn("Failed to fetch characters:", err);
    }

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

    return {
      manga,
      characters,
      alternativeTitles,
      information,
      relations,
      externalLinks,
    };
  } catch (error) {
    console.error("Error fetching manga data:", error);
    return {
      manga: {},
      characters: [],
      alternativeTitles: {},
      information: {},
    };
  }
}

export default async function MangaDetailPage({ params }) {
  const { id } = await params;
  const initialData = await getMangaData(id);
  return <MangaDetailContent id={id} initialData={initialData} />;
}

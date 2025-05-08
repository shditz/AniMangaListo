import { fetchWithRetry } from "@/app/lib/jikan";
import { getNames, capitalizeFirstLetter } from "@/app/lib/utils";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const [animeRes, streamRes, charsRes, episodesRes, staffRes] =
      await Promise.all([
        fetchWithRetry(`anime/${id}/full`),
        fetchWithRetry(`anime/${id}/streaming`),
        fetchWithRetry(`anime/${id}/characters`),
        fetchWithRetry(`anime/${id}/episodes`),
        fetchWithRetry(`anime/${id}/staff`),
      ]);

    const animeFull = animeRes?.data || {};

    const fetchRelationDetails = async (entry) => {
      if (!entry?.type || !entry?.mal_id) {
        return {
          ...entry,
          images: { jpg: { image_url: "/placeholder.jpg" } },
          score: null,
        };
      }

      try {
        const res = await fetchWithRetry(`${entry.type}/${entry.mal_id}`);
        const imageUrl =
          res?.data?.images?.jpg?.large_image_url ||
          res?.data?.images?.jpg?.image_url ||
          res?.data?.images?.jpg?.small_image_url ||
          "/placeholder.jpg";

        return {
          ...entry,
          name: res?.data?.title || entry.name,
          images: res?.data?.images || {
            jpg: { image_url: "/placeholder.jpg" },
          },
          score: res?.data?.score ?? null,
        };
      } catch (error) {
        return {
          ...entry,
          images: { jpg: { image_url: "/placeholder.jpg" } },
          score: null,
        };
      }
    };

    const relations = animeFull.relations
      ? await Promise.all(
          animeFull.relations.map(async (relation) => ({
            relation: relation.relation,
            entry: await Promise.all(relation.entry.map(fetchRelationDetails)),
          }))
        )
      : [];

    const streamingData =
      streamRes?.data?.map((item) => ({
        name: item.name,
        url: item.url,
      })) || [];

    const MAX_CHARACTERS = 24;

    const characters =
      charsRes?.data
        ?.filter((char) => char.role && char.character)
        .slice(0, MAX_CHARACTERS)
        .map((char) => {
          const japaneseVoiceActor = char.voice_actors?.find(
            (va) => va.language === "Japanese"
          );
          const voiceActorData =
            japaneseVoiceActor?.person || char.voice_actors?.[0]?.person;

          return {
            mal_id: char.character.mal_id,
            name: char.character.name,
            image:
              char.character.images?.jpg?.image_url ||
              "/placeholder-character.jpg",
            role: char.role,
            voiceActor: voiceActorData?.name || null,
            voiceActorData: voiceActorData,
          };
        }) || [];

    const episodes =
      episodesRes?.data?.map((ep) => ({
        mal_id: ep.mal_id,
        number: ep.mal_id,
        title: ep.title,
        aired: ep.aired,
      })) || [];

    const staff =
      staffRes?.data
        ?.map((member) => ({
          mal_id: member.person.mal_id,
          name: member.person.name,
          positions: member.positions,
          images: member.person.images || {
            jpg: { image_url: "/placeholder-staff.jpg" },
          },
        }))
        .slice(0, 24) || [];

    const alternativeTitles = {
      synonyms: animeFull.title_synonyms || [],
      japanese: animeFull.title_japanese || null,
      english: animeFull.title_english || null,
    };

    const information = {
      type: animeFull.type || "-",
      episodes: animeFull.episodes ?? "-",
      status: animeFull.status || "-",
      aired: animeFull.aired?.string || "-",
      premiered: animeFull.season
        ? capitalizeFirstLetter(animeFull.season)
        : "-",
      broadcast: animeFull.broadcast?.string || "-",
      producers: getNames(animeFull.producers),
      licensors: getNames(animeFull.licensors),
      studios: getNames(animeFull.studios),
      source: animeFull.source || "-",
      genres: getNames(animeFull.genres),
      demographics: getNames(animeFull.demographics),
      duration: animeFull.duration || "-",
      rating: animeFull.rating || "-",
    };

    return Response.json({
      anime: {
        ...animeFull,

        images: animeFull.images || {
          jpg: { large_image_url: "/placeholder.jpg" },
        },
        score: animeFull.score || null,
      },
      streamingData,
      characters,
      episodes,
      staff,
      relations,
      alternativeTitles,
      information,
    });
  } catch (error) {
    console.error("Error in API route:", error);
    return Response.json(
      { error: "Failed to fetch anime data" },
      { status: 500 }
    );
  }
}

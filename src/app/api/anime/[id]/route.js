import { fetchWithRetry } from "@/app/lib/jikan";
import { getNames, capitalizeFirstLetter } from "@/app/lib/utils";

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const [animeRes, streamRes, charsRes, episodesRes, staffRes] =
      await Promise.all([
        fetchWithRetry(`anime/${id}`),
        fetchWithRetry(`anime/${id}/streaming`),
        fetchWithRetry(`anime/${id}/characters`),
        fetchWithRetry(`anime/${id}/episodes`),
        fetchWithRetry(`anime/${id}/staff`),
      ]);

    const anime = animeRes?.data || {};
    const streamingData =
      streamRes?.data?.map((item) => ({
        name: item.name,
        url: item.url,
      })) || [];

    const characters =
      charsRes?.data
        ?.filter((char) => char.role && char.character)
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
      staffRes?.data?.map((member) => ({
        mal_id: member.person.mal_id,
        name: member.person.name,
        positions: member.positions,
        images: member.person.images,
      })) || [];

    const alternativeTitles = {
      synonyms: anime.title_synonyms || [],
      japanese: anime.title_japanese || null,
      english: anime.title_english || null,
    };

    const information = {
      type: anime.type || "-",
      episodes: anime.episodes ?? "-",
      status: anime.status || "-",
      aired: anime.aired?.string || "-",
      premiered: anime.season ? capitalizeFirstLetter(anime.season) : "-",
      broadcast: anime.broadcast?.string || "-",
      producers: getNames(anime.producers),
      licensors: getNames(anime.licensors),
      studios: getNames(anime.studios),
      source: anime.source || "-",
      genres: getNames(anime.genres),
      demographics: getNames(anime.demographics),
      duration: anime.duration || "-",
      rating: anime.rating || "-",
    };

    return Response.json({
      anime,
      streamingData,
      characters,
      episodes,
      staff,
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

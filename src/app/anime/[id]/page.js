import { fetchWithRetry } from "@/app/lib/jikan";
import AnimeDetailContent from "@/app/components/AnimeDetails/AnimeDetailContent";
import { getNames, capitalizeFirstLetter } from "@/app/lib/utils";

export const revalidate = 3600;
export const dynamicParams = true;

async function getAnimeData(id) {
  try {
    const animeRes = await fetchWithRetry(`anime/${id}`);
    const anime = animeRes?.data || {};

    let streamingData = [];
    let characters = [];
    let episodes = [];
    let staff = [];

    try {
      const streamRes = await fetchWithRetry(`anime/${id}/streaming`);
      streamingData =
        streamRes?.data?.map((item) => ({
          name: item.name,
          url: item.url,
        })) || [];
    } catch (err) {
      console.warn("Failed to fetch streaming data:", err);
    }

    try {
      const charsRes = await fetchWithRetry(`anime/${id}/characters`);
      characters =
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
    } catch (err) {
      console.warn("Failed to fetch characters:", err);
    }

    try {
      const episodesRes = await fetchWithRetry(`anime/${id}/episodes`);
      episodes =
        episodesRes?.data?.map((ep) => ({
          mal_id: ep.mal_id,
          number: ep.mal_id,
          title: ep.title,
          aired: ep.aired,
        })) || [];
    } catch (err) {
      console.warn("Failed to fetch episodes:", err);
    }

    try {
      const staffRes = await fetchWithRetry(`anime/${id}/staff`);
      staff =
        staffRes?.data?.map((member) => ({
          mal_id: member.person.mal_id,
          name: member.person.name,
          positions: member.positions,
          images: member.person.images,
        })) || [];
    } catch (err) {
      console.warn("Failed to fetch staff:", err);
    }

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

    const result = {
      anime,
      streamingData,
      characters,
      episodes,
      staff,
      alternativeTitles,
      information,
    };

    return result;
  } catch (error) {
    console.error("Error fetching anime data:", error);
    return {
      anime: {},
      streamingData: [],
      characters: [],
      episodes: [],
      staff: [],
      alternativeTitles: {},
      information: {},
    };
  }
}

export default async function AnimeDetailPage({ params }) {
  const { id } = await params;
  const initialData = await getAnimeData(id);
  return <AnimeDetailContent id={id} initialData={initialData} />;
}

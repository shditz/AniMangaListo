import { fetchWithRetry } from "@/app/lib/jikan";
import AnimeDetailContent from "@/app/components/AnimeDetails/AnimeDetailContent";
import {
  getNames,
  formatNumber,
  capitalizeFirstLetter,
  delay,
} from "@/app/lib/utils";

// ISR Configuration
export const revalidate = 3600;
export const dynamicParams = true;

// Diperbaiki: Tambahkan error handling untuk generateStaticParams
export async function generateStaticParams() {
  try {
    await delay(3000); // Tambahkan delay awal

    const res = await fetch("https://api.jikan.moe/v4/top/anime?limit=20");
    if (!res.ok) return [];

    const data = await res.json();
    if (!data.data) return [];

    // Batasi hanya 20 halaman statis
    return data.data.slice(0, 20).map((anime) => ({
      id: anime.mal_id?.toString() || "0",
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Metadata generation
export async function generateMetadata({ params }) {
  const { id } = params;
  try {
    const animeData = await fetchWithRetry(`anime/${id}`);
    const anime = animeData?.data || {};

    return {
      title: `${anime.title || "Anime Details"} | AniMangaListo`,
      description: anime.synopsis || "Discover this amazing anime",
      openGraph: {
        title: anime.title || "Anime Details",
        description: anime.synopsis || "Discover this amazing anime",
        images: [anime.images?.jpg?.large_image_url || "/placeholder.jpg"],
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/anime/${id}`,
        siteName: "AniMangaListo",
      },
      twitter: {
        card: "summary_large_image",
        title: anime.title || "Anime Details",
        description: anime.synopsis || "Discover this amazing anime",
        images: [anime.images?.jpg?.large_image_url || "/placeholder.jpg"],
      },
    };
  } catch (error) {
    return {
      title: "Anime Details | AniMangaListo",
      description: "Discover this amazing anime",
    };
  }
}

async function getAnimeData(id) {
  try {
    // Sequential fetching dengan delay
    const animeRes = await fetchWithRetry(`anime/${id}`);
    await delay(1000);

    const streamRes = await fetchWithRetry(`anime/${id}/streaming`);
    await delay(1000);

    const charsRes = await fetchWithRetry(`anime/${id}/characters`);
    await delay(1000);

    const episodesRes = await fetchWithRetry(`anime/${id}/episodes`);
    await delay(1000);

    const staffRes = await fetchWithRetry(`anime/${id}/staff`);

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

    return {
      anime,
      streamingData,
      characters,
      episodes,
      staff,
      alternativeTitles,
      information,
    };
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
  const { id } = params;
  const initialData = await getAnimeData(id);

  return <AnimeDetailContent id={id} initialData={initialData} />;
}

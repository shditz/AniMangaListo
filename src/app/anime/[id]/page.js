// src/app/anime/[id]/page.js

import { Suspense } from "react";
import AnimeDetailContent from "@/app/components/AnimeDetails/AnimeDetailContent";
import { getNames, capitalizeFirstLetter } from "@/app/lib/utils";

export const revalidate = 3600;

function getBaseUrl() {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }
  return `https://${process.env.VERCEL_URL}`;
}

async function fetchWithProxy(endpoint, retries = 3) {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/jikan?endpoint=${encodeURIComponent(endpoint)}`;

  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        next: { revalidate: 3600 },
      });

      if (!res.ok) {
        if (res.status === 429) {
          console.warn("Rate limit exceeded, retrying...");
          await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
          continue;
        }
        throw new Error(`HTTP ${res.status}`);
      }

      return await res.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

async function getAnimeData(id) {
  try {
    const animeData = await fetchWithProxy(`anime/${id}`);
    const anime = animeData?.data || {};

    let streamingData = [];
    try {
      const streamData = await fetchWithProxy(`anime/${id}/streaming`);
      streamingData =
        streamData?.data?.map((item) => ({
          name: item.name,
          url: item.url,
        })) || [];
    } catch (err) {
      console.warn("Failed to fetch streaming data:", err);
    }

    let characters = [];
    try {
      const charsData = await fetchWithProxy(`anime/${id}/characters`);
      characters =
        charsData?.data
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

    let episodes = [];
    try {
      const episodesData = await fetchWithProxy(`anime/${id}/episodes`);
      episodes =
        episodesData?.data?.map((ep) => ({
          mal_id: ep.mal_id,
          number: ep.mal_id,
          title: ep.title,
          aired: ep.aired,
        })) || [];
    } catch (err) {
      console.warn("Failed to fetch episodes:", err);
    }

    let staff = [];
    try {
      const staffData = await fetchWithProxy(`anime/${id}/staff`);
      staff =
        staffData?.data?.map((member) => ({
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
    console.error("Error fetching anime data:", error.message);
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
  return (
    <Suspense fallback="Loading anime details...">
      <AnimeDetailContent id={id} initialData={initialData} />
    </Suspense>
  );
}

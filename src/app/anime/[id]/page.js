// src/app/anime/[id]/page.js

import { Suspense } from "react";
import AnimeDetailContent from "@/app/components/AnimeDetails/AnimeDetailContent";
import { getNames, capitalizeFirstLetter } from "@/app/lib/utils";
import { fetchWithRetry } from "@/app/lib/jikan";

export const revalidate = 3600;

async function getAnimeData(id) {
  try {
    const [animeRes, streamRes, charsRes, episodesRes, staffRes] =
      await Promise.all([
        fetchWithRetry(`anime/${id}/full`),
        fetchWithRetry(`anime/${id}/streaming`),
        fetchWithRetry(`anime/${id}/characters`),
        fetchWithRetry(`anime/${id}/episodes`),
        fetchWithRetry(`anime/${id}/staff`),
      ]);

    const anime = animeRes?.data || {};

    const MAX_CHARACTERS = 12;
    const MAX_EPISODES = 10;
    const MAX_STAFF = 8;

    const streamingData =
      streamRes?.data?.map((item) => ({
        name: item.name,
        url: item.url,
      })) || [];

    const characters =
      charsRes?.data
        ?.filter((char) => char.role && char.character)
        .slice(0, MAX_CHARACTERS)
        .map((char) => ({
          mal_id: char.character.mal_id,
          name: char.character.name,
          image:
            char.character.images?.jpg?.image_url ||
            "/placeholder-character.jpg",
          role: char.role,
          voiceActor:
            char.voice_actors?.find((va) => va.language === "Japanese")?.person
              ?.name || null,
        })) || [];

    const episodes =
      episodesRes?.data?.slice(0, MAX_EPISODES).map((ep) => ({
        mal_id: ep.mal_id,
        number: ep.mal_id,
        title: ep.title,
        aired: ep.aired,
      })) || [];

    const staff =
      staffRes?.data?.slice(0, MAX_STAFF).map((member) => ({
        mal_id: member.person.mal_id,
        name: member.person.name,
        positions: member.positions,
        images: member.person.images || {
          jpg: { image_url: "/placeholder-staff.jpg" },
        },
      })) || [];

    const information = {
      type: anime.type || "-",
      episodes: anime.episodes ?? "-",
      status: anime.status || "-",
      aired: anime.aired?.string || "-",
      premiered: anime.season ? capitalizeFirstLetter(anime.season) : "-",
      broadcast: anime.broadcast?.string || "-",
      producers: getNames(anime.producers),
      studios: getNames(anime.studios),
      source: anime.source || "-",
      genres: getNames(anime.genres),
      rating: anime.rating || "-",
    };

    return {
      anime,
      streamingData,
      characters,
      episodes,
      staff,
      information,
    };
  } catch (error) {
    console.error("Error fetching anime data:", error.message);
    throw error;
  }
}

export default async function AnimeDetailPage({ params }) {
  const { id } = await params;
  return (
    <Suspense>
      <AnimeDetailContent id={id} initialData={await getAnimeData(id)} />
    </Suspense>
  );
}

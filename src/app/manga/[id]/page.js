// src/app/manga/[id]/page.js

import { Suspense } from "react";
import MangaDetailContent from "@/app/components/MangaDetails/MangaDetailsContent";
import { getNames } from "@/app/lib/utils";

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

async function getMangaData(id) {
  try {
    const mangaData = await fetchWithProxy(`manga/${id}/full`);
    const manga = mangaData?.data || {};

    let characters = [];
    try {
      const charsData = await fetchWithProxy(`manga/${id}/characters`);
      characters =
        charsData?.data?.map((char) => ({
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

    const relations = manga.relations || [];
    const externalLinks = manga.external || [];

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
    console.error("Error fetching manga data:", error.message);
    return {
      manga: {},
      characters: [],
      alternativeTitles: {},
      information: {},
      relations: [],
      externalLinks: [],
    };
  }
}

export default async function MangaDetailPage({ params }) {
  const { id } = await params;
  const initialData = await getMangaData(id);
  return (
    <Suspense fallback="Loading manga details...">
      <MangaDetailContent id={id} initialData={initialData} />
    </Suspense>
  );
}

import { cache } from "react";

const fetchCharactersCached = cache(async (mal_id) => {
  const res = await fetch(
    `https://api.jikan.moe/v4/anime/${mal_id}/characters`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) return null;
  return res.json().catch(() => null);
});

export async function GET(request) {
  const vaMap = {};

  const batchSize = 5;
  const delayBetweenBatches = 200;

  try {
    const seasonAnimeRes = await fetch(
      "https://api.jikan.moe/v4/seasons/now?limit=25",
      { next: { revalidate: 3600 } }
    );

    if (!seasonAnimeRes.ok) return Response.json({ topVAs: [] });
    const seasonAnimeData = await seasonAnimeRes.json();

    for (let i = 0; i < seasonAnimeData.data.length; i += batchSize) {
      const batch = seasonAnimeData.data.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (anime) => {
          const charData = await fetchCharactersCached(anime.mal_id);
          if (charData?.data) processCharacters(charData.data, vaMap);
        })
      );

      if (i + batchSize < seasonAnimeData.data.length) {
        await new Promise((r) => setTimeout(r, delayBetweenBatches));
      }
    }

    const sorted = Object.values(vaMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return Response.json({
      topVAs: sorted,
      seasonInfo: {
        season: seasonAnimeData.data[0]?.season || "current",
        year: seasonAnimeData.data[0]?.year || new Date().getFullYear(),
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return Response.json({ topVAs: [] });
  }
}

function processCharacters(data, vaMap) {
  data.forEach((char) => {
    char.voice_actors?.forEach((va) => {
      if (va.language === "Japanese") {
        const key = `${va.person.mal_id}-${va.language}`;
        vaMap[key] = {
          ...va.person,
          count: (vaMap[key]?.count || 0) + 1,
          language: va.language,

          anime_roles: [
            ...(vaMap[key]?.anime_roles || []),
            {
              anime_id: char.anime_id,
              character: char.character.name,
              role: char.role,
            },
          ],
        };
      }
    });
  });
}

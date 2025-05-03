export const revalidate = 3600;

let cachedData = null;
let lastFetched = 0;

export async function GET() {
  const CACHE_TTL = 1000 * 60 * 60;

  if (cachedData && Date.now() - lastFetched < CACHE_TTL) {
    return new Response(JSON.stringify(cachedData), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
      },
    });
  }

  try {
    const response = await fetch(
      "https://api.jikan.moe/v4/recommendations/anime",
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const result = await response.json();
    const selectedEntries = result.data
      .slice(0, 20)
      .flatMap((rec) => rec.entry || []);

    cachedData = { recommendations: selectedEntries };
    lastFetched = Date.now();

    return new Response(JSON.stringify(cachedData), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
      },
    });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return new Response(JSON.stringify({ error: "Failed to load data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

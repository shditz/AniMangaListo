import { fetchWithRetry } from "@/app/lib/jikan";
let cachedData = null;
let lastFetched = 0;

export async function GET(request) {
  const CACHE_TTL = 1000 * 60 * 60; // 1 jam
  const shouldBypassCache = new URL(request.url).searchParams.get(
    "bypassCache"
  );

  if (
    cachedData &&
    Date.now() - lastFetched < CACHE_TTL &&
    shouldBypassCache !== "true"
  ) {
    return new Response(JSON.stringify(cachedData), {
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const response = await fetchWithRetry("recommendations/manga");

    if (!response || !response.data || !Array.isArray(response.data)) {
      throw new Error("Format data dari Jikan tidak valid.");
    }

    const selectedEntries = response.data
      .slice(0, 20)
      .flatMap((rec) => rec.entry || []);

    cachedData = {
      recommendations: selectedEntries,
    };
    lastFetched = Date.now();

    return new Response(JSON.stringify(cachedData), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching manga recommendations:", error.message);
    return new Response(
      JSON.stringify({
        error: "Terjadi kesalahan saat memuat rekomendasi manga.",
      }),
      { status: 500 }
    );
  }
}

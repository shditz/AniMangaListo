let cachedData = null;
let lastFetched = 0;

export async function GET(request) {
  const CACHE_TTL = 1000 * 60 * 60;
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
    const response = await fetch(
      "https://api.jikan.moe/v4/recommendations/manga"
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gagal mengambil data dari Jikan: ${errorText}`);
    }

    const result = await response.json();

    if (!result.data || !Array.isArray(result.data)) {
      throw new Error("Format data dari Jikan tidak valid.");
    }

    const selectedEntries = result.data
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

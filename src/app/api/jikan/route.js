import { Redis } from "@upstash/redis";

let redis;
if (
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
} else {
  console.warn("Redis configuration missing. Caching will be disabled.");
  redis = {
    get: (key) => Promise.resolve(null),
    set: (key, value) => Promise.resolve(),
  };
}

const JIKAN_BASE_URL = "https://api.jikan.moe/v4";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  let endpoint = searchParams.get("endpoint");

  const allowedChars = /^[a-zA-Z0-9\-/_?.=&]+$/;
  if (!endpoint || !allowedChars.test(endpoint)) {
    return Response.json({ error: "Invalid endpoint format" }, { status: 400 });
  }

  endpoint = decodeURIComponent(endpoint);
  const sanitizedEndpoint = endpoint
    .replace(/\?/g, "!")
    .replace(/&/g, "-")
    .replace(/=/g, "_");
  const cacheKey = `jikan:${sanitizedEndpoint}`;

  try {
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return new Response(JSON.stringify(cachedData), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    let data;
    let retries = 3;
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(`${JIKAN_BASE_URL}/${endpoint}`, {
          signal: AbortSignal.timeout(8000),
          headers: { "User-Agent": "MyAnimeApp/1.0" },
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        data = await response.json();
        break;
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
      }
    }

    try {
      await redis.set(cacheKey, data, { ex: 3600 });
    } catch (redisError) {
      console.error("Redis error:", redisError);
    }

    const safeData = JSON.parse(
      JSON.stringify(data, (key, value) => {
        if (value === undefined) return null;
        if (typeof value === "function") return undefined;
        if (typeof value === "bigint") return value.toString();
        return value;
      })
    );

    return new Response(JSON.stringify(safeData), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
        "CDN-Cache-Control": "public, s-maxage=1800",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return Response.json(
      {
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.message : null,
      },
      { status: 500 }
    );
  }
}

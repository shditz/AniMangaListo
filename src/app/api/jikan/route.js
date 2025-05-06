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
    incr: (key) => Promise.resolve(),
    expire: (key, ttl) => Promise.resolve(),
  };
}

const JIKAN_BASE_URL = "https://api.jikan.moe/v4";

const RATE_LIMIT = 50;
const RATE_LIMIT_WINDOW = 60;

export async function GET(request) {
  const ip = request.headers.get("x-forwarded-for") || "anonymous";
  const { searchParams } = new URL(request.url);
  let endpoint = searchParams.get("endpoint");

  console.log(`[REQUEST] IP: ${ip}, Endpoint: ${endpoint}`);

  const allowedChars = /^[a-zA-Z0-9\-/_?.=&]+$/;
  if (!endpoint || !allowedChars.test(endpoint)) {
    console.warn(`[INVALID ENDPOINT] IP: ${ip}, Invalid endpoint: ${endpoint}`);
    return Response.json({ error: "Invalid endpoint format" }, { status: 400 });
  }

  endpoint = decodeURIComponent(endpoint);

  const sanitizedEndpoint = endpoint
    .replace(/\?/g, "!")
    .replace(/&/g, "-")
    .replace(/=/g, "_");
  const cacheKey = `jikan:${sanitizedEndpoint}`;

  try {
    const rateLimitKey = `rate_limit:${ip}`;
    let requestCount;

    try {
      requestCount = await redis.get(rateLimitKey);
    } catch (err) {
      console.error("[RATE LIMIT ERROR] Redis get failed:", err);
      requestCount = null;
    }

    if (requestCount && parseInt(requestCount) >= RATE_LIMIT) {
      console.warn(
        `[RATE LIMIT EXCEEDED] IP: ${ip}, Requests: ${requestCount}`
      );
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        { status: 429 }
      );
    }

    try {
      await redis.incr(rateLimitKey);
      if (!requestCount) {
        await redis.expire(rateLimitKey, RATE_LIMIT_WINDOW);
      }
    } catch (err) {
      console.error("[RATE LIMIT ERROR] Redis incr/expire failed:", err);
    }

    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log(`[CACHE HIT] IP: ${ip}, Endpoint: ${sanitizedEndpoint}`);
      return new Response(JSON.stringify(cachedData), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    console.log(`[CACHE MISS] IP: ${ip}, Fetching from upstream: ${endpoint}`);

    let data;
    let retries = 3;
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(`${JIKAN_BASE_URL}/${endpoint}`, {
          signal: AbortSignal.timeout(8000),
          headers: { "User-Agent": "MyAnimeApp/1.0" },
        });

        if (!response.ok) {
          const errorMsg = `HTTP ${response.status}`;
          console.error(
            `[FETCH ERROR] IP: ${ip}, Status: ${errorMsg}, Retry: ${i + 1}`
          );
          throw new Error(errorMsg);
        }

        data = await response.json();
        break;
      } catch (error) {
        if (i === retries - 1) {
          console.error(`[FETCH FAILED] IP: ${ip}, Error: ${error.message}`);
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
      }
    }

    try {
      await redis.set(cacheKey, data, { ex: 3600 });
    } catch (redisError) {
      console.error("[REDIS ERROR]", redisError);
    }

    const safeData = JSON.parse(
      JSON.stringify(data, (key, value) => {
        if (value === undefined) return null;
        if (typeof value === "function") return undefined;
        if (typeof value === "bigint") return value.toString();
        return value;
      })
    );

    console.log(
      `[RESPONSE] IP: ${ip}, Status: 200, Endpoint: ${sanitizedEndpoint}`
    );

    return new Response(JSON.stringify(safeData), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
        "CDN-Cache-Control": "public, s-maxage=1800",
      },
    });
  } catch (error) {
    console.error(`[SERVER ERROR] IP: ${ip}, Error: ${error.message}`);
    return Response.json(
      {
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.message : null,
      },
      { status: 500 }
    );
  }
}

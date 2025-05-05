import { delay } from "./utils";

const JIKAN_BASE_URL = "https://api.jikan.moe/v4";
const RATE_LIMIT_DELAY = 1500;

export const fetchJikan = async (endpoint) => {
  await delay(RATE_LIMIT_DELAY);

  const res = await fetch(`${JIKAN_BASE_URL}/${endpoint}`, {
    next: {
      revalidate: 3600,
      tags: ["jikan-api"],
    },
  });

  if (res.status === 429) {
    const retryAfter = res.headers.get("Retry-After") || 5;
    await delay(retryAfter * 1000);
    return fetchJikan(endpoint);
  }

  if (!res.ok) {
    throw new Error(`Jikan API request failed: ${res.status}`);
  }

  return res.json();
};

export const fetchWithRetry = async (endpoint, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetchJikan(endpoint);
    } catch (error) {
      if (
        error.message.includes("429") ||
        error.message.includes("Failed to fetch")
      ) {
        if (i < retries - 1) {
          const backoff = 1000 * Math.pow(2, i);
          console.log(`Retrying ${endpoint} in ${backoff}ms...`);
          await delay(backoff);
          continue;
        }
      }
      throw error;
    }
  }
};

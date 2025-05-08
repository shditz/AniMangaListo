//src/lib/jikan.js

import { delay } from "./utils";

const JIKAN_BASE_URL = "https://api.jikan.moe/v4";
const RATE_LIMIT_DELAY = 500;

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

export const fetchWithRetry = async (endpoint, retries = 2) => {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(`${JIKAN_BASE_URL}/${endpoint}`, {
        next: { revalidate: 3600, tags: ["jikan-api"] },
      });

      if (res.status === 429) {
        const retryAfter = parseInt(res.headers.get("Retry-After")) || 1;
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
        continue;
      }

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      return await res.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};

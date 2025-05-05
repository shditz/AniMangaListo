import Link from "next/link";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const SectionManga = dynamic(() => import("../components/Manga/SectionManga"));
const RecommendationManga = dynamic(() =>
  import("../components/Manga/RecommendationManga")
);

const MangaCarousel = dynamic(() =>
  import("../components/Manga/MangaCarousel")
);

const Header2 = dynamic(() =>
  import("../components/Anime/RecommendationAnime/Header2")
);

export const revalidate = 3600;

async function fetchWithRetry(endpoint, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(`https://api.jikan.moe/v4/${endpoint}`, {
        next: { revalidate: 3600 },
      });
      if (res.ok) return res.json();

      if (res.status === 429) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }

      throw new Error(`Failed to fetch ${endpoint}: ${res.status}`);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

async function getMangaData() {
  const endpoints = [
    "manga?limit=10",
    "top/manga?limit=10&type=manga",
    "top/manga?limit=10&filter=publishing&type=manga",
    "top/manga?filter=upcoming&limit=10",
    "top/manga?filter=bypopularity&limit=10",
    "top/manga?filter=favorite&limit=20",
    "top/characters?limit=10",
  ];

  try {
    const results = await Promise.allSettled(
      endpoints.map((endpoint) => {
        const apiUrl = `${
          process.env.NEXT_PUBLIC_SITE_URL
        }/api/jikan?endpoint=${encodeURIComponent(endpoint)}`;

        return fetch(apiUrl, { next: { revalidate: 3600 } }).then((res) => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        });
      })
    );

    const getData = (index) =>
      results[index]?.status === "fulfilled"
        ? results[index].value?.data || []
        : [];

    return {
      allManga: getData(0),
      topManga: getData(1),
      topPublishing: getData(2),
      topUpcomingManga: getData(3),
      mostPopularManga: getData(4),
      mostFavoritedManga: getData(5).slice(0, 10),
      FavoritedCarousel: getData(5).slice(0, 20),
    };
  } catch (error) {
    console.error("Error fetching manga data:", error);
    return {};
  }
}

export default async function MangaPage() {
  const data = await getMangaData();

  return (
    <div className="overflow-x-hidden md:pt-12 pt-38">
      <section className="p-4 mb-8">
        {data.mostFavoritedManga?.length > 0 && (
          <MangaCarousel mangaList={data.FavoritedCarousel} />
        )}
      </section>
      <section className="md:pb-4 pl-2 md:pl-6 xl:pl-10 pb-2 p-1 pt-4">
        <h1 className="md:text-3xl text-2xl font-bold relative pl-3 inline-flex items-center group">
          Manga
          <span className="absolute left-0 top-0 bottom-0 w-1 bg-purple-700 rounded-full"></span>
        </h1>
      </section>

      <Suspense fallback="Load Manga Content..">
        <SectionManga
          allManga={data.allManga}
          topManga={data.topManga}
          topPublishing={data.topPublishing}
          topUpcomingManga={data.topUpcomingManga}
          mostPopularManga={data.mostPopularManga}
          mostFavoritedManga={data.mostFavoritedManga}
        />
      </Suspense>

      <section className="xl:p-4 md:p-0 p-2 md:pt-0">
        <Header2 title="Recommendation Manga" />
        <RecommendationManga limit={10} />
        <div className="flex justify-center mt-4">
          <Link
            href="/manga"
            className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-600 transition-colors bg-transparent"
          >
            <span>View More</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06L17.69 12l-5.72-5.72a.75.75 0 010-1.06z" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}

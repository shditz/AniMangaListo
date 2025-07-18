//src/app/page.js

import dynamic from "next/dynamic";
import { Suspense } from "react";
import ScrollAnimationWrapper from "./components/ScrollAnimationWrapper";
import Loading from "./Loading";
import NavButton from "./components/NavButtonClient";
import AdsenseAd from "./components/ads";

const AnimeCarousel = dynamic(() => import("./components/Anime/AnimeMusim"), {
  loading: () => <Loading />,
});
const NewEpisodesSection = dynamic(
  () => import("./components/Anime/NewEpisode"),
  { loading: () => <Loading /> }
);
const LatestCompleted = dynamic(
  () => import("./components/Anime/LatestCompleted"),
  { loading: () => <Loading /> }
);
const RecommendationAnime = dynamic(
  () => import("./components/Anime/RecommendationAnime"),
  { loading: () => <Loading /> }
);
const TopCharacters = dynamic(() => import("./components/TopCharacter"), {
  loading: () => <Loading />,
});
const Header2 = dynamic(
  () => import("./components/Anime/RecommendationAnime/Header2"),
  { loading: () => <Loading /> }
);
const TopVoiceActorsSection = dynamic(
  () => import("./components/VoiceActor/TopVoiceActorsSection"),
  { loading: () => <Loading /> }
);
const DynamicTrailerSection = dynamic(
  () => import("./components/Anime/DynamicTrailerSection"),
  { loading: () => <Loading /> }
);
const DynamicSection = dynamic(
  () => import("./components/Anime/DynamicSection"),
  { loading: () => <Loading /> }
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

async function getCombinedData() {
  const endpoints = [
    "seasons/now?limit=20",
    "watch/episodes",
    "anime?status=complete&order_by=end_date&sort=desc&limit=22&type=tv",
    "top/anime?limit=21",
    "top/anime?limit=17&type=movie",
    "top/anime?limit=21&filter=airing&type=tv",
    "seasons/now?limit=17",
    "top/characters?limit=10",
    "top/anime?filter=bypopularity&limit=17",
    "seasons/upcoming?limit=20",
    "top/anime?limit=20&filter=favorite",
  ];

  try {
    const results = await Promise.allSettled(
      endpoints.map((endpoint) => {
        const baseUrl =
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : process.env.NEXT_PUBLIC_SITE_URL;

        const apiUrl = `${baseUrl}/api/jikan?endpoint=${encodeURIComponent(
          endpoint
        )}`;

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
      currentSeason: getData(0),
      recentEpisodes: getData(1),
      latestCompleted: getData(2),
      topAnime: getData(3).slice(0, 10),
      topMovie: getData(4).slice(0, 11),
      topAiring: getData(5).slice(0, 11),
      allAnime: getData(6),
      seasonalAnime: getData(6).slice(0, 10),
      topCharacters: getData(7),
      mostPopular: getData(8).slice(0, 10),
      mostFavorited: getData(10).slice(0, 10),
      upcomingAnime: getData(9).slice(0, 12) || [],
      trailers: {
        popular: getData(8),
        topAnime: getData(3),
        seasonalAnime: getData(6),
        movieTl: getData(4),
        topAiringTl: getData(5),
        topUpcomingTl: getData(9),
        favorited: getData(10),
      },
    };
  } catch (error) {
    console.error("Error fetching combined data:", error);
    return {
      trailers: {},
    };
  }
}

export default async function Page() {
  const data = await getCombinedData();

  return (
    <div className="overflow-x-hidden md:pt-12 select-none pt-38">
      <ScrollAnimationWrapper>
        <Suspense fallback={<Loading />}>
          <section className="p-4 mb-8">
            {data.currentSeason?.length > 0 && (
              <AnimeCarousel animeList={data.currentSeason} />
            )}
          </section>
        </Suspense>
      </ScrollAnimationWrapper>

      <ScrollAnimationWrapper>
        <Suspense fallback={<Loading />}>
          <section className="xl:p-4 pt-0">
            <NewEpisodesSection data={data.recentEpisodes} />
          </section>
        </Suspense>
      </ScrollAnimationWrapper>

      <ScrollAnimationWrapper>
        <Suspense fallback={<Loading />}>
          <section className="xl:p-4 pt-0">
            <LatestCompleted data={data.latestCompleted} />
          </section>
        </Suspense>
      </ScrollAnimationWrapper>

      <ScrollAnimationWrapper>
        <Suspense fallback={<Loading />}>
          <section className="md:pb-4 pl-2 md:pl-6 xl:pl-10 pb-2 pt-4">
            <h1 className="md:text-3xl text-2xl font-bold relative pl-4 inline-flex items-center group">
              Anime
              <span className="absolute left-0 top-0 bottom-0 w-1 bg-purple-700 rounded-full"></span>
            </h1>
          </section>
        </Suspense>
      </ScrollAnimationWrapper>

      <ScrollAnimationWrapper>
        <Suspense fallback={<Loading />}>
          <DynamicSection
            mostPopularData={data.mostPopular || []}
            mostFavoritedData={data.mostFavorited || []}
            topAiringData={data.topAiring || []}
            topAnimeData={data.topAnime || []}
            topMovieData={data.topMovie || []}
            upcomingData={data.upcomingAnime || []}
            seasonalAnimeData={data.seasonalAnime || []}
          />
        </Suspense>
      </ScrollAnimationWrapper>

      <ScrollAnimationWrapper>
        <Suspense fallback={<Loading />}>
          <section className="md:pb-4 pb-2 pl-2 md:pl-6 xl:pl-10 pt-3">
            <h1 className="md:text-3xl text-2xl font-bold relative pl-3 inline-flex items-center group">
              Trailers Anime
              <span className="absolute left-0 top-0 bottom-0 w-1 bg-purple-700 rounded-full"></span>
            </h1>
          </section>
        </Suspense>
      </ScrollAnimationWrapper>

      <ScrollAnimationWrapper>
        <Suspense fallback={<Loading />}>
          <DynamicTrailerSection
            popular={data.trailers?.popular || []}
            topAnime={data.trailers?.topAnime || []}
            seasonalAnime={data.trailers?.seasonalAnime || []}
            movieTl={data.trailers?.movieTl || []}
            topAiringTl={data.trailers?.topAiringTl || []}
            topUpcomingTl={data.trailers?.topUpcomingTl || []}
            favorited={data.trailers?.favorited || []}
          />
        </Suspense>
      </ScrollAnimationWrapper>

      <ScrollAnimationWrapper>
        <Suspense fallback={<Loading />}>
          <section className="xl:p-4 md:p-0 p-2 md:pt-0">
            <Header2 title="Recommendation Anime" />
            <RecommendationAnime limit={10} />
            <div className="flex justify-center md:mt-4">
              <NavButton
                href="/ViewAll/recommendationAnime"
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
              </NavButton>
            </div>
          </section>
        </Suspense>
      </ScrollAnimationWrapper>

      <ScrollAnimationWrapper>
        <section className="relative w-full h-[300px]">
          <div
            className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 z-10"
            aria-hidden="true"
          />
          <img
            src="/bganime.jpg"
            alt="Anime Background"
            className="w-full h-full object-cover brightness-75"
          />
          <div className="absolute inset-0 flex items-center flex-col md:flex-row md:gap-25 lg:gap-50 xl:gap-100 px-8 md:px-16 z-20 text-white">
            <div className="max-w-[300px] mb-10 mt-4">
              <h2 className="md:text-3xl text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent animate-shimmer">
                AniMangaListo
              </h2>
              <p className="text-sm md:text-base opacity-90">
                Your Ultimate Anime & Manga Database. Explore thousands of
                titles with detailed information and reviews.
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-lg md:text-2xl font-semibold mb-10">
                Support{" "}
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent animate-shimmer">
                  {" "}
                  AniMangaListo
                </span>
              </h3>
            </div>

            <div className="text-right">
              <h3 className="text-lg md:text-2xl text-purple-400 font-semibold mb-4">
                Follow Us
              </h3>
              <div className="flex justify-end gap-4">
                <a
                  href="https://www.instagram.com/ry.shditz?igsh=b3RuMnBtM3J5a3Nk"
                  className="hover:text-pink-600 transition-colors"
                >
                  <svg
                    className="md:w-8 md:h-8 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                <a
                  href="https://x.com/ShDitzz"
                  className="hover:text-black transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="md:w-8 md:h-8 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231z" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/aditya.kurniwan.12"
                  className="hover:text-blue-600 transition-colors"
                >
                  <svg
                    className="md:w-8 md:h-8 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>
      </ScrollAnimationWrapper>

      <ScrollAnimationWrapper>
        <Suspense fallback={<Loading />}>
          <section className="xl:p-4 md:pt-0">
            <div className="pl-2 md:pl-6 xl:pl-6 p-4">
              <h1 className="md:text-2xl text-lg font-bold relative inline-block pb-2">
                Top Character
                <span className="absolute bottom-0 left-0 w-full h-1 bg-purple-700"></span>
              </h1>
            </div>
            <Suspense fallback="Load Character...">
              <TopCharacters data={data.topCharacters} />
            </Suspense>
          </section>
        </Suspense>
      </ScrollAnimationWrapper>
      <AdsenseAd />
      <ScrollAnimationWrapper>
        <Suspense fallback={<Loading />}>
          <TopVoiceActorsSection />
        </Suspense>

        <section className="flex justify-center gap-4 py-8">
          <NavButton
            href="/mangapage"
            className="inline-flex items-center px-6 py-3  text-base font-medium rounded-md  text-white bg-gradient-to-r from-purple-950 to-purple-600  hover:from-purple-600 hover:to-purple-950  transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
          >
            Explore All Manga
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 ml-2"
            >
              <path d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06L17.69 12l-5.72-5.72a.75.75 0 010-1.06z" />
            </svg>
          </NavButton>
          <button
            id="installPWAButton"
            className="hidden items-center px-6 py-3 text-base font-medium rounded-md text-white  bg-gradient-to-r from-purple-950 to-purple-600  hover:from-purple-600 hover:to-purple-950   transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
          >
            Install App
          </button>
        </section>
      </ScrollAnimationWrapper>
      <script
        dangerouslySetInnerHTML={{
          __html: `
      let deferredPrompt;

      // Fungsi untuk mendeteksi apakah user menggunakan desktop
      function isDesktop() {
        return !/Mobi|Android/i.test(navigator.userAgent);
      }

      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;

        if (isDesktop()) {
          document.getElementById('installPWAButton').classList.remove('hidden');
        }
      });

      document.getElementById('installPWAButton').addEventListener('click', () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('User accepted the install prompt');
            }
            deferredPrompt = null;
            document.getElementById('installPWAButton').classList.add('hidden');
          });
        }
      });

      window.addEventListener('appinstalled', () => {
        console.log('PWA was installed');
        document.getElementById('installPWAButton').classList.add('hidden');
      });
    `,
        }}
      />
    </div>
  );
}

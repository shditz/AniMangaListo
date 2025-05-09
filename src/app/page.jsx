//src/app/page.js

import dynamic from "next/dynamic";
import { Suspense } from "react";
import ScrollAnimationWrapper from "./components/ScrollAnimationWrapper";
import Loading from "./Loading";
import NavButton from "./components/NavButtonClient";

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

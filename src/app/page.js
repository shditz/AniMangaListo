import Link from "next/link";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const AnimeCarousel = dynamic(() => import("./components/Anime/AnimeMusim"));
const NewEpisodesSection = dynamic(() =>
  import("./components/Anime/NewEpisode")
);
const LatestCompleted = dynamic(() =>
  import("./components/Anime/LatestCompleted")
);
const RecommendationAnime = dynamic(() =>
  import("./components/Anime/RecommendationAnime")
);
const SectionManga = dynamic(() => import("./components/Manga/SectionManga"));
const RecommendationManga = dynamic(() =>
  import("./components/Manga/RecommendationManga")
);
const TopCharacters = dynamic(() => import("./components/TopCharacter"));
const Header2 = dynamic(() =>
  import("./components/Anime/RecommendationAnime/Header2")
);
const TopVoiceActorsSection = dynamic(() =>
  import("./components/VoiceActor/TopVoiceActorsSection")
);
const DynamicTrailerSection = dynamic(() =>
  import("./components/Anime/DynamicTrailerSection")
);
const DynamicSection = dynamic(() =>
  import("./components/Anime/DynamicSection")
);

// Enable ISR - regenerate every hour
export const revalidate = 3600;

async function fetchData(endpoint) {
  const res = await fetch(`https://api.jikan.moe/v4/${endpoint}`, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });
  if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
  return res.json();
}

async function getCombinedData() {
  try {
    const [
      currentSeasonRes,
      recentEpisodesRes,
      latestCompletedRes,
      topAnimeRes,
      topMovieRes,
      topAiringRes,
      allAnimeRes,
      seasonalAnimeRes,
      allMangaRes,
      topMangaRes,
      topPublishingRes,
      topUpcomingMangaRes,
      mostPopularMangaRes,
      mostFavoritedMangaRes,
      topCharactersRes,
      popularTrailersRes,
      topAnimeTrailersRes,
      movieTlRes,
      topAiringTlRes,
      topUpcomingTlRes,
      favoritedTlRes,
    ] = await Promise.all([
      fetchData("seasons/now?limit=22"),
      fetchData("watch/episodes?type=tv"),
      fetchData(
        "anime?status=complete&order_by=end_date&sort=desc&limit=22&type=tv"
      ),
      fetchData("top/anime?limit=10"),
      fetchData("top/anime?limit=11&type=movie"),
      fetchData("top/anime?limit=11&filter=airing&type=tv"),
      fetchData("anime?type=tv&limit=10"),
      fetchData("seasons/now?limit=10"),
      fetchData("manga?limit=10"),
      fetchData("top/manga?limit=10&type=manga"),
      fetchData("top/manga?limit=10&filter=publishing&type=manga"),
      fetchData("top/manga?filter=upcoming&limit=10"),
      fetchData("top/manga?filter=bypopularity&limit=10"),
      fetchData("top/manga?filter=favorite&limit=10"),
      fetchData("top/characters?limit=10"),
      fetchData("top/anime?filter=bypopularity&limit=17"),
      fetchData("top/anime?limit=21"),
      fetchData("top/anime?limit=18&type=movie"),
      fetchData("top/anime?limit=21&filter=airing&type=tv"),
      fetchData("seasons/upcoming?limit=20"),
      fetchData("top/anime?limit=20&filter=favorite"),
    ]);

    return {
      currentSeason: currentSeasonRes.data,
      recentEpisodes: recentEpisodesRes.data,
      latestCompleted: latestCompletedRes.data,
      topAnime: topAnimeRes.data,
      topMovie: topMovieRes.data,
      topAiring: topAiringRes.data,
      allAnime: allAnimeRes.data,
      seasonalAnime: seasonalAnimeRes.data,
      allManga: allMangaRes.data,
      topManga: topMangaRes.data,
      topPublishing: topPublishingRes.data,
      topUpcomingManga: topUpcomingMangaRes.data,
      mostPopularManga: mostPopularMangaRes.data,
      mostFavoritedManga: mostFavoritedMangaRes.data,
      topCharacters: topCharactersRes.data,
      trailers: {
        popular: popularTrailersRes.data,
        topAnime: topAnimeTrailersRes.data,
        seasonalAnime: seasonalAnimeRes.data.slice(0, 17),
        movieTl: movieTlRes.data,
        topAiringTl: topAiringTlRes.data,
        topUpcomingTl: topUpcomingTlRes.data,
        favorited: favoritedTlRes.data,
      },
    };
  } catch (error) {
    console.error("Error fetching combined data:", error);
    return {};
  }
}

export default async function Home() {
  const data = await getCombinedData();

  return (
    <div className="overflow-x-hidden md:pt-12 pt-38">
      <section className="p-4 mb-8">
        {data.currentSeason && <AnimeCarousel animeList={data.currentSeason} />}
      </section>

      <section className="md:p-4 md:pt-0">
        <NewEpisodesSection data={data.recentEpisodes} />
      </section>

      <section className="md:p-4 md:pt-0">
        <LatestCompleted data={data.latestCompleted} />
      </section>

      <section className="md:pb-4 pl-10 pb-2 pt-4">
        <h1 className="md:text-3xl text-2xl font-bold relative pl-4 inline-flex items-center group">
          Anime
          <span className="absolute left-0 top-0 bottom-0 w-1 bg-purple-700 rounded-full"></span>
        </h1>
      </section>

      <Suspense fallback="Load Anime Content...">
        <DynamicSection
          mostPopularData={data.topAnime}
          mostFavoritedData={data.topAnime}
          topAiringData={data.topAiring}
          topAnimeData={data.topAnime}
          topMovieData={data.topMovie}
          allAnime={data.allAnime}
          upcomingData={data.seasonalAnime}
          seasonalAnimeData={data.seasonalAnime}
        />
      </Suspense>

      <section className="md:pb-4 pb-2 pl-10 pt-3">
        <h1 className="md:text-3xl text-2xl font-bold relative pl-3 inline-flex items-center group">
          Trailers Anime
          <span className="absolute left-0 top-0 bottom-0 w-1 bg-purple-700 rounded-full"></span>
        </h1>
      </section>

      <Suspense fallback="Load Trailers...">
        <DynamicTrailerSection
          popular={data.trailers.popular}
          topAnime={data.trailers.topAnime}
          seasonalAnime={data.trailers.seasonalAnime}
          movieTl={data.trailers.movieTl}
          topAiringTl={data.trailers.topAiringTl}
          topUpcomingTl={data.trailers.topUpcomingTl}
          favorited={data.trailers.favorited}
        />
      </Suspense>

      <section className="md:p-4 p-2 md:pt-0">
        <Header2 title="Recommendation Anime" />
        <RecommendationAnime limit={10} />
        <div className="flex justify-center md:mt-4">
          <Link
            href="/"
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

      <section className="md:pb-4 pb-2 p-10 pt-4">
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

      <section className="md:p-4 p-2 md:pt-0">
        <Header2 title="Recommendation Manga" />
        <RecommendationManga limit={10} />
        <div className="flex justify-center mt-4">
          <Link
            href="/"
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

      <section className="md:p-4 md:pt-0">
        <div className="pl-0 md:pl-6 p-4">
          <h1 className="md:text-2xl text-lg font-bold relative inline-block pb-2">
            Top Character
            <span className="absolute bottom-0 left-0 w-full h-1 bg-purple-700"></span>
          </h1>
        </div>
        <Suspense fallback="Load Character...">
          <TopCharacters data={data.topCharacters} />
        </Suspense>
      </section>

      <Suspense fallback="Load Voice Actors..">
        <TopVoiceActorsSection />
      </Suspense>
    </div>
  );
}

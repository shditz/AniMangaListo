//app/components/AnimeDetails/AnimeDetailContent.jsx

"use client";
import useSWR from "swr";
import TrailerPlayer from "./TrailerPlayer/TrailerPlayer";
import StreamModal from "./StreamModel";
import ContentTabs from "./ContentTabs";
import ShareButtons from "./Share";
import { formatNumber, capitalizeFirstLetter } from "@/app/lib/utils";
import { fetcher } from "@/app/lib/fetcher";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { parseTheme } from "@/app/lib/themeParser";
import OtherAnime from "@/app/components/Anime/OtherAnime";
import AnimeReviews from "../AnimeReview";
import Loading from "@/app/Loading";
import CommentForm from "../CommentForm";
import CommentSection from "../CommentSection";

export default function AnimeDetailContent({ id, initialData }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarkedAnimeId, setBookmarkedAnimeId] = useState(null);
  const timeoutRef = useRef();

  const { data, error, isLoading } = useSWR(`/api/anime/${id}`, fetcher, {
    fallbackData: initialData,
    revalidateOnFocus: true,
    refreshInterval: 300_000,
  });

  const {
    anime = {},
    alternativeTitles = {},
    information = {},
    streamingData = [],
    episodes = [],
    characters = [],
    staff = [],
    relations = [],
  } = data;

  useEffect(() => {
    if (!session?.user) return;
    let mounted = true;
    fetch("/api/bookmark")
      .then((res) => res.json())
      .then((data) => {
        if (mounted) setBookmarks(data);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [session]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleBookmark = useCallback(async () => {
    if (!session?.user) {
      router.push("/api/auth/signin");
      return;
    }
    try {
      const res = await fetch("/api/bookmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          malId: anime.mal_id,
          title: anime.title,
          imageUrl: anime.images.jpg.large_image_url,
          score: anime.score,
        }),
      });
      if (res.ok) {
        setBookmarkedAnimeId(anime.mal_id);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setBookmarkedAnimeId(null);
        }, 3000);
        const updated = await fetch("/api/bookmark").then((r) => r.json());
        setBookmarks(updated);
      }
    } catch (err) {
      console.error(err);
    }
  }, [session, anime, router]);

  const ThemeItem = ({ theme }) => {
    const [rawTitle, artist] = parseTheme(theme);
    const title = rawTitle.replace(/:/g, "");
    const searchYouTubeMV = () => {
      const cleanTitle = title
        .replace(/^\d+\.?\s*/, "")
        .replace(/^"([^"]+)"\s*/, "$1")
        .replace(/\s*$(?:eps\s*)?[^)]*(?:$[^)]*)?/g, "")
        .split("(")[0]
        .trim();
      const query = `${cleanTitle} ${artist}`;
      const encodedQuery = encodeURIComponent(query);
      window.open(
        `https://www.youtube.com/results?search_query= ${encodedQuery}`,
        "_blank"
      );
    };
    return (
      <div className="flex items-center justify-between bg-gray-900/50 p-2 rounded-md">
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-gray-400 text-xs">{artist || "Unknown Artist"}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            searchYouTubeMV();
          }}
          className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white text-xs px-2 py-1 rounded-lg"
        >
          <span>MV</span>
        </button>
      </div>
    );
  };

  const SkeletonThemeItem = () => (
    <div className="flex items-center justify-between bg-gray-800 p-2 rounded-md animate-pulse">
      <div>
        <div className="h-4 bg-gray-600 w-32 mb-1"></div>
        <div className="h-3 bg-gray-600 w-24 rounded"></div>
      </div>
      <div className="h-6 w-10 bg-gray-600 rounded"></div>
    </div>
  );

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-20">
        Failed Load Anime Data, Try Again.
      </div>
    );
  }

  const englishTitle = alternativeTitles.english || anime.title;
  const metaData = {
    title: anime.title || "Anime Details",
    description: anime.synopsis || "Discover this amazing anime",
    image: anime.images?.jpg?.large_image_url || "/placeholder.jpg",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/anime/${anime.mal_id}`,
    siteName: "AniMangaListo",
  };
  return (
    <div className="bg-gray-200 relative">
      <div
        style={{
          backgroundImage: `url(${
            anime.images?.jpg?.large_image_url || "/placeholder.jpg"
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
        className="absolute inset-0 select-none h-full w-full"
      />
      <div className="absolute inset-0 bg-black/80" />

      <div className="flex flex-col md:flex-row pt-14 relative z-10 backdrop-blur-sm text-white">
        <div className="w-full md:w-[200px] xl:w-1/5 p-4 space-y-4">
          <img
            src={anime.images?.jpg?.large_image_url || "/placeholder.jpg"}
            alt={anime.title}
            width="300"
            height="450"
            loading="lazy"
            className="w-full h-[280px] md:h-60 xl:h-96 object-cover rounded-lg select-none mb-4"
          />

          <StreamModal streamingData={streamingData} title={anime.title} />
          <div className="md:flex md:flex-col hidden">
            <div className="p-4  bg-black/30 rounded-lg backdrop-blur-sm">
              <h1 className="text-lg  font-semibold relative text-purple-400 inline-block mb-2">
                Alternative Title
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-700"></span>
              </h1>
              <div className="space-y-1  text-xs xl:text-sm">
                {alternativeTitles.synonyms?.length > 0 && (
                  <p>
                    <span className="font-medium text-purple-200">
                      Synonyms:
                    </span>{" "}
                    {alternativeTitles.synonyms.join(", ")}
                  </p>
                )}
                {alternativeTitles.japanese && (
                  <p>
                    <span className="font-medium text-purple-200">
                      Japanese:
                    </span>{" "}
                    {alternativeTitles.japanese}
                  </p>
                )}
                {alternativeTitles.english && (
                  <p>
                    <span className="font-medium text-purple-200">
                      English:
                    </span>{" "}
                    {alternativeTitles.english}
                  </p>
                )}
                {!alternativeTitles.synonyms?.length &&
                  !alternativeTitles.japanese &&
                  !alternativeTitles.english && (
                    <p className="text-gray-400">
                      No Alternative Titles Available
                    </p>
                  )}
              </div>
            </div>

            <div className="p-4 bg-black/30 rounded-lg mt-2 backdrop-blur-sm">
              <h1 className="text-lg  font-semibold relative text-purple-400 inline-block mb-2">
                Statistic
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-700"></span>
              </h1>
              <div className="space-y-1 text-xs xl:text-sm">
                <p>
                  <span className="font-medium text-purple-200">Score:</span>{" "}
                  {anime.score ? anime.score.toFixed(3) : "-"}
                  {anime.scored_by && (
                    <span className="text-gray-300 text-sm">
                      {" "}
                      ({formatNumber(anime.scored_by)} users)
                    </span>
                  )}
                </p>
                <p>
                  <span className="font-medium text-purple-200">Ranked:</span>{" "}
                  {anime.rank ? `#${formatNumber(anime.rank)}` : "-"}
                </p>
                <p>
                  <span className="font-medium text-purple-200">
                    Popularity:
                  </span>{" "}
                  {anime.popularity
                    ? `#${formatNumber(anime.popularity)}`
                    : "-"}
                </p>
                <p>
                  <span className="font-medium text-purple-200">Members:</span>{" "}
                  {formatNumber(anime.members) || "-"}
                </p>
                <p>
                  <span className="font-medium text-purple-200">
                    Favorites:
                  </span>{" "}
                  {formatNumber(anime.favorites) || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 pt-3 pr-2 p-3">
          <h1 className="xl:text-5xl text-2xl md:mt-0 -mt-8  font-bold mb-4">
            {anime.title}
          </h1>
          <div className="flex select-none xl:text-base text-xs flex-wrap gap-1 xl:gap-2 mb-4">
            {[
              { label: "★", value: anime.score },
              { value: anime.type },
              { label: "EPS", value: anime.episodes },
              { value: anime.duration },
              { label: "🤍", value: anime.favorites },
              {
                label: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-4 h-4 inline-block mr-1 -mt-1"
                  >
                    <defs>
                      <linearGradient
                        id="fireGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#FFA500" />
                        <stop offset="100%" stopColor="#FF4500" />
                      </linearGradient>
                    </defs>
                    <path
                      fill="url(#fireGradient)"
                      d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.176 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152-.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 0 1 1.925-3.546 3.75 3.75 0 0 1 3.255 3.718Z"
                    />
                  </svg>
                ),
                value: formatNumber(anime.popularity),
              },
            ].map((item, index) => (
              <span
                key={index}
                className="bg-gradient-to-r from-purple-600 via-purple-400 to-purple-600 px-2 py-1 rounded-lg"
              >
                {item.label} {item.value ?? "-"}
              </span>
            ))}
          </div>

          <div className="mb-2">
            <h3 className="xl:text-xl text-base font-semibold mb-2">
              Synopsis
            </h3>
            <p className="xl:text-base md:text-xs text-sm">
              {anime.synopsis || "No Synopsis Available"}
            </p>
          </div>

          <div className="xl:mb-6 select-none  mb-3">
            <div className="flex flex-wrap gap-2">
              {anime.genres?.length > 0 ? (
                anime.genres.map((genre) => (
                  <span
                    key={genre.mal_id}
                    className="bg-black border-1 xl:text-base md:text-xs text-sm border-purple-600 px-2 py-1 rounded-lg text-white"
                  >
                    {genre.name}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">No Genre Available</span>
              )}
            </div>
          </div>

          {bookmarkedAnimeId === anime.mal_id ? (
            <span className="text-purple-400 font-medium text-sm md:text-lg px-3 py-1 md:px-4 md:py-2">
              Bookmark Added!
            </span>
          ) : (
            !bookmarks.some((b) => b.malId === anime.mal_id) && (
              <button
                onClick={handleBookmark}
                className="flex gap-1 select-none bg-purple-500 items-center xl:text-base md:text-xs text-sm text-white px-3 py-2 rounded mb-4 hover:bg-purple-700 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                </svg>
                Bookmark
              </button>
            )
          )}

          <div className="mb-5">
            <h3 className="xl:text-base md:text-sm font-semibold mb-1">
              Background
            </h3>
            <div className="border-t border-purple-700 w-full mb-2"></div>
            <p className="xl:text-sm md:text-xs text-gray-300">
              {anime.background || "Not Available"}
            </p>
          </div>
          <ShareButtons
            title={metaData.title}
            description={metaData.description}
            imageUrl={metaData.image}
            url={metaData.url}
            siteName={metaData.siteName}
          />
        </div>

        <div className="w-full md:w-[280px] xl:w-1/4">
          <div>
            <TrailerPlayer youtubeId={anime.trailer?.youtube_id} />
          </div>
          <div className="md:hidden px-4 ">
            <div className="p-4 bg-black/30 rounded-lg backdrop-blur-sm">
              <h1 className="text-lg  font-semibold relative text-purple-400 inline-block mb-2">
                Alternative Title
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-700"></span>
              </h1>
              <div className="space-y-1  md:text-xs text-sm xl:text-sm">
                {alternativeTitles.synonyms?.length > 0 && (
                  <p>
                    <span className="font-medium text-purple-200">
                      Synonyms:
                    </span>{" "}
                    {alternativeTitles.synonyms.join(", ")}
                  </p>
                )}
                {alternativeTitles.japanese && (
                  <p>
                    <span className="font-medium text-purple-200">
                      Japanese:
                    </span>{" "}
                    {alternativeTitles.japanese}
                  </p>
                )}
                {alternativeTitles.english && (
                  <p>
                    <span className="font-medium text-purple-200">
                      English:
                    </span>{" "}
                    {alternativeTitles.english}
                  </p>
                )}
                {!alternativeTitles.synonyms?.length &&
                  !alternativeTitles.japanese &&
                  !alternativeTitles.english && (
                    <p className="text-gray-400">
                      No Alternative Titles Available
                    </p>
                  )}
              </div>
            </div>

            <div className="p-4 bg-black/30 rounded-lg mt-2 backdrop-blur-sm">
              <h1 className="text-lg  font-semibold relative text-purple-400 inline-block mb-2">
                Statistic
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-700"></span>
              </h1>
              <div className="space-y-1 md:text-xs text-sm xl:text-sm">
                <p>
                  <span className="font-medium text-purple-200">Score:</span>{" "}
                  {anime.score ? anime.score.toFixed(3) : "-"}
                  {anime.scored_by && (
                    <span className="text-gray-300 text-sm">
                      {" "}
                      ({formatNumber(anime.scored_by)} users)
                    </span>
                  )}
                </p>
                <p>
                  <span className="font-medium text-purple-200">Ranked:</span>{" "}
                  {anime.rank ? `#${formatNumber(anime.rank)}` : "-"}
                </p>
                <p>
                  <span className="font-medium text-purple-200">
                    Popularity:
                  </span>{" "}
                  {anime.popularity
                    ? `#${formatNumber(anime.popularity)}`
                    : "-"}
                </p>
                <p>
                  <span className="font-medium text-purple-200">Members:</span>{" "}
                  {formatNumber(anime.members) || "-"}
                </p>
                <p>
                  <span className="font-medium text-purple-200">
                    Favorites:
                  </span>{" "}
                  {formatNumber(anime.favorites) || "-"}
                </p>
              </div>
            </div>
          </div>
          <div className="xl:w-[450px] mb-2 px-4">
            <div className="p-4 bg-black/30 rounded-lg backdrop-blur-sm">
              <h1 className="text-lg font-semibold relative text-purple-400 inline-block mb-2">
                Information
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-700"></span>
              </h1>
              <div className="space-y-1 md:text-xs text-sm xl:text-sm">
                {Object.entries(information).map(([key, value]) => (
                  <p key={key}>
                    <span className="font-medium text-purple-200">
                      {capitalizeFirstLetter(key)}:
                    </span>{" "}
                    {value}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {isLoading || !anime?.theme ? (
            <div className="mt-4">
              <div className="p-4 bg-black/30 rounded-lg backdrop-blur-sm">
                <h1 className="text-lg font-semibold relative text-purple-400 inline-block mb-2">
                  Theme
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-700"></span>
                </h1>
                <div className="space-y-4">
                  <div>
                    <h2 className="text-sm font-medium text-purple-300 mb-1">
                      Opening Theme
                    </h2>
                    <ul className="space-y-2">
                      <li>
                        <SkeletonThemeItem />
                      </li>
                      <li>
                        <SkeletonThemeItem />
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h2 className="text-sm font-medium text-purple-300 mb-1">
                      Ending Theme
                    </h2>
                    <ul className="space-y-2">
                      <li>
                        <SkeletonThemeItem />
                      </li>
                      <li>
                        <SkeletonThemeItem />
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="pl-4 xl:pr-0 md:pr-4 pr-4 mb-4 ">
              <div className="p-4 bg-black/30 rounded-lg backdrop-blur-sm">
                <h1 className="text-lg font-semibold relative text-purple-400 inline-block mb-2">
                  Themes
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-700"></span>
                </h1>
                <div
                  className={`space-y-4 gap-4 ${
                    anime.theme.openings?.length > 0 &&
                    anime.theme.endings?.length > 0
                      ? "grid grid-cols-1 "
                      : "grid grid-cols-1"
                  }`}
                >
                  {anime.theme.openings?.length > 0 && (
                    <div>
                      <h2 className="text-sm font-medium text-purple-300 mb-1">
                        Opening Theme
                      </h2>
                      <ul className="space-y-2 text-sm">
                        {anime.theme.openings
                          .slice(0, 2)
                          .map((theme, index) => (
                            <li key={`opening-${index}`}>
                              <ThemeItem theme={theme} />
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}

                  {anime.theme.endings?.length > 0 && (
                    <div>
                      <h2 className="text-sm font-medium text-purple-300 mb-1">
                        Ending Theme
                      </h2>
                      <ul className="space-y-2 text-sm">
                        {anime.theme.endings.slice(0, 2).map((theme, index) => (
                          <li key={`ending-${index}`}>
                            <ThemeItem theme={theme} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(!anime.theme.openings ||
                    anime.theme.openings.length === 0) &&
                    (!anime.theme.endings ||
                      anime.theme.endings.length === 0) && (
                      <p className="text-gray-400 text-sm">
                        No Theme Available
                      </p>
                    )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ContentTabs
        episodes={episodes}
        characters={characters}
        staff={staff}
        relations={relations}
        animeTitle={englishTitle}
      />

      <div className="relative bg-black  z-10   py-2">
        <AnimeReviews animeId={id} />
      </div>

      <div className="relative bg-black z-10 py-2">
        <div className="mb-8">
          <CommentForm malId={parseInt(id)} animeTitle={anime.title} />
          <CommentSection malId={parseInt(id)} />
        </div>
      </div>

      <section className="relative w-full h-[300px]">
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 z-10"
          aria-hidden="true"
        />
        <img
          src="/bgdtanime.jpg"
          alt="Anime Background"
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 flex items-center flex-col md:flex-row md:gap-25 lg:gap-50 xl:gap-100 px-8 md:px-16 z-20 text-white">
          <div className="max-w-[300px] mb-10 mt-4">
            <h2 className="md:text-3xl text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent animate-shimmer">
              AniMangaListo
            </h2>
            <p className="text-sm md:text-base opacity-90">
              Your Ultimate Anime & Manga Database. Explore thousands of titles
              with detailed information and reviews.
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

      <div className="relative bg-black  z-10   py-2">
        <OtherAnime />
      </div>
    </div>
  );
}

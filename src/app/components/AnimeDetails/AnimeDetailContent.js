"use client";
import useSWR from "swr";
import Image from "next/image";
import TrailerPlayer from "./TrailerPlayer/TrailerPlayer";
import StreamModal from "./StreamModel";
import ContentTabs from "./ContentTabs";
import ShareButtons from "./Share";
import { formatNumber, capitalizeFirstLetter } from "@/app/lib/utils";
import { fetcher } from "@/app/lib/fetcher";
import { useEffect, useState } from "react";

export default function AnimeDetailContent({ id, initialData }) {
  const { data, error } = useSWR(`/api/anime/${id}`, fetcher, {
    fallbackData: initialData,
    revalidateOnFocus: true,
    refreshInterval: 300000,
  });

  const [crunchyrollId, setCrunchyrollId] = useState(null);

  useEffect(() => {
    if (!data || !data.anime?.mal_id) return;

    const fetchCrunchyrollId = async () => {
      try {
        const res = await fetch(`/api/anime/${data.anime.mal_id}/external`);

        if (!res.ok) {
          if (res.status === 404) {
            console.log("No external links found");
            return;
          }
          throw new Error(`HTTP Error: ${res.status}`);
        }

        const externalData = await res.json();

        const externalLinks = externalData?.data || [];

        const crLink = externalLinks.find(
          (link) => link?.name?.toLowerCase() === "crunchyroll"
        );

        const match = crLink?.url?.match(/\/([A-Z0-9]+)\//);
        setCrunchyrollId(match?.[1] || null);
      } catch (err) {
        console.error("Error fetching external links:", err);
        setCrunchyrollId(null);
      }
    };

    fetchCrunchyrollId();
  }, [data]);

  if (error)
    return (
      <div className="text-red-500 text-center py-20">
        Failed Load Anime Data, Try Load Again.
      </div>
    );

  const {
    anime = {},
    alternativeTitles = {},
    information = {},
    streamingData = [],
    episodes = [],
    characters = [],
    staff = [],
  } = data;

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
        className="absolute inset-0 h-full w-full"
      />
      <div className="absolute inset-0 bg-black/80" />

      <div className="flex flex-col md:flex-row pt-14 relative z-10 backdrop-blur-sm text-white">
        <div className="w-full  md:w-[200px] xl:w-1/5 p-4 space-y-4">
          <Image
            src={anime.images?.jpg?.large_image_url || "/placeholder.jpg"}
            alt={anime.title}
            width={300}
            height={450}
            className="w-full h-115 md:h-60 xl:h-96 object-cover rounded-lg mb-4"
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
          <div className="flex xl:text-base text-xs flex-wrap gap-1 xl:gap-2 mb-4">
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

          <div className="xl:mb-6   mb-3">
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

          <button className="flex gap-1 bg-purple-500 items-center xl:text-base md:text-xs text-sm text-white px-3 py-2 rounded mb-4 hover:bg-purple-700 transition-colors">
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

          <div className="xl:w-[450px] mt-2 mb-4 px-4">
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
        </div>
      </div>

      <ContentTabs
        episodes={episodes}
        characters={characters}
        staff={staff}
        crunchyrollId={crunchyrollId}
        animeTitle={englishTitle}
      />
    </div>
  );
}

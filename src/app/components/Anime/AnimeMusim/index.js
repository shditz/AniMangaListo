"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const formatNumber = (number) => {
  return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

function removeDuplicates(data, key = "mal_id") {
  const seen = new Set();
  return data.filter((item) => {
    const val = item[key];
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
}

export default function AnimeCarousel({ animeList }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentSeason, setCurrentSeason] = useState(null);
  const [windowWidth, setWindowWidth] = useState(0);
  const intervalRef = useRef();

  const uniqueAnimes = removeDuplicates(animeList || [], "mal_id");
  const totalSlides = uniqueAnimes.length;

  useEffect(() => {
    if (totalSlides <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, [totalSlides]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchCurrentSeason = async () => {
      try {
        const response = await fetch("https://api.jikan.moe/v4/seasons/now");
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          const season = data.data[0].season.toUpperCase();
          const year = data.data[0].year;
          setCurrentSeason(`ANIME ${season} ${year}`);
        }
      } catch (error) {
        console.error("Error fetching current season:", error);
      }
    };

    fetchCurrentSeason();
  }, []);

  const nextSlide = () => {
    clearInterval(intervalRef.current);
    startAutoPlay();
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    clearInterval(intervalRef.current);
    startAutoPlay();
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const startAutoPlay = () => {
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    }, 5000);
  };

  const handleSlideChange = (direction) => {
    direction === "next" ? nextSlide() : prevSlide();
  };

  if (!uniqueAnimes.length) {
    return (
      <div className="text-center text-gray-500 py-8">
        Tidak ada anime tersedia.
      </div>
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden mt-[-64px]"
      style={{ userSelect: "none" }}
    >
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translate3d(-${currentSlide * 100}%, 0, 0)`,
        }}
      >
        {uniqueAnimes.map((anime, index) => {
          const isMobile = windowWidth < 768;
          const synopsisPreview =
            anime.synopsis?.length > 300
              ? `${
                  isMobile
                    ? anime.synopsis.slice(0, 150)
                    : anime.synopsis.slice(0, 300)
                }...`
              : anime.synopsis;

          return (
            <div
              key={`${anime.mal_id}-${index}`}
              className="w-full overflow-hidden flex-shrink-0 relative"
            >
              <div className="w-full h-full">
                <img
                  src={anime.images.jpg.large_image_url}
                  alt={anime.title}
                  className={`w-full ${
                    windowWidth < 768 ? "h-[80vh]" : "h-screen"
                  } object-cover select-none transition-opacity duration-500`}
                  style={{
                    minWidth: "100vw",
                    backfaceVisibility: "hidden",
                    imageRendering: "optimizeQuality",
                  }}
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,rgba(0,0,0,0.1)_20%,rgba(0,0,0,0.3)_50%,rgba(0,0,0,0.7)_70%,rgba(0,0,0,0.9)_100%)]"></div>
                <div
                  className="absolute top-0 left-0 w-full h-1/10"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(0, 0, 0, 1), transparent)",
                  }}
                ></div>
                <div
                  className="absolute bottom-0 left-0 w-full h-1/3"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0, 0, 0, 1), transparent)",
                  }}
                ></div>

                {currentSeason && (
                  <div className="absolute top-1 left-6 md:top-30 pl-4 md:pl-8 md:left-10">
                    <span className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm md:text-base font-bold uppercase tracking-wider shadow-lg">
                      {currentSeason}
                    </span>
                  </div>
                )}
              </div>

              <div className="absolute inset-y-0 left-0 flex flex-col justify-center p-10 md:p-18 text-white">
                <div className="mb-3 space-y-1">
                  <h3 className="text-xl md:text-5xl font-bold pt-4 leading-tight max-w-8xl">
                    {anime.title}
                  </h3>
                  <div className="flex items-center font-bold gap-1 text-xs md:text-xl text-gray-100 md:text-gray-300 mt-2">
                    <span>({anime.title_english || anime.title}</span>
                    <span>/</span>
                    <span>{anime.title_japanese})</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3 font-semibold text-xs md:text-sm">
                    <div className="inline-flex items-center bg-gradient-to-r from-purple-600 via-purple-400 to-purple-600 px-1.5 md:px-3 py-0.5 md:py-1 rounded-md">
                      <span className="text-purple-100 font-semibold mr-1">
                        Studio:
                      </span>
                      <span className="truncate max-w-[100px]">
                        {anime.studios?.[0]?.name || "N/A"}
                      </span>
                    </div>

                    <div className="inline-flex items-center bg-gradient-to-r from-purple-600 via-purple-400 to-purple-600 px-1.5 md:px-3 py-0.5 md:py-1 rounded-md">
                      <span>{anime.type || "N/A"}</span>
                    </div>

                    <div className="inline-flex items-center bg-gradient-to-r from-purple-600 via-purple-400 to-purple-600 px-1.5 md:px-3 py-0.5 md:py-1 rounded-md">
                      <span className="text-purple-100 font-semibold mr-1">
                        Eps
                      </span>
                      <span>{anime.episodes || "N/A"}</span>
                    </div>
                    <div className="inline-flex items-center bg-gradient-to-r from-purple-600 via-purple-400 to-purple-600 px-1.5 md:px-3 py-0.5 md:py-1 rounded-md">
                      <span>{anime.duration || "N/A"}</span>
                    </div>

                    <div className="inline-flex items-center bg-gradient-to-r from-purple-600 via-purple-400 to-purple-600 px-1.5 md:px-3 py-0.5 md:py-1 rounded-md">
                      <span className="text-purple-100 font-semibold mr-1">
                        Airing:
                      </span>
                      <span>{anime.aired?.string || "N/A"}</span>
                    </div>
                  </div>

                  <div className="relative">
                    <p className="text-sm   text-white font-normal md:text-lg mt-1 pt-2 md:max-w-4xl line-clamp-3 md:line-clamp-5">
                      {synopsisPreview || "No synopsis available"}
                    </p>

                    {anime.synopsis?.length > 300 && (
                      <Link
                        href={`/anime/${anime.mal_id}`}
                        className="text-purple-500 hover:text-purple-500 md:text-lg text-sm font-semibold block"
                      >
                        Read More →
                      </Link>
                    )}
                  </div>
                </div>
                <div className=" flex flex-wrap items-center gap-1">
                  <span className="text-purple-500   font-bold">Genres:</span>
                  {anime.genres?.map((genre) => (
                    <span
                      key={genre.mal_id}
                      className="border-2 border-purple-400 bg-purple-800 text-white px-3 py-1 rounded-full text-xs md:text-sm font-semibold shadow-md"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                <div className="md:mb-4 mb-2 flex items-center gap-3 md:pt-3 pt-1">
                  <div className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4 md:w-7 md:h-7 text-yellow-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                      />
                    </svg>
                    <span className="text-base md:text-lg font-semibold text-purple-300">
                      {anime.score || "N/A"}
                    </span>
                    <span className="text-sm  md:text-lg text-gray-200 ml-1">
                      ({formatNumber(anime.members)} ratings)
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 md:w-6 md:h-6 text-red-500"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <span className="text-sm  md:text-lg text-gray-100">
                      {formatNumber(anime.favorites)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 md:gap-8 md:pt-2 ">
                  <Link
                    href={`/anime/${anime.mal_id}`}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-3 py-2 md:px-4 md:py-2 rounded-lg flex items-center gap-1 text-xs md:text-lg"
                  >
                    <span>Show Detail</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5 md:w-5 md:h-5"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                  <button className="text-purple-400 font-medium hover:bg-purple-600 hover:text-white flex items-center gap-1 text-sm md:text-lg px-3 py-1 md:px-4 md:py-2 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4 md:w-7 md:h-7"
                    >
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                    <span>Bookmark</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tombol Prev */}
      <div className="absolute top-1/2 transform -translate-y-1/2 left-1 z-10">
        <button
          onClick={() => handleSlideChange("prev")}
          className="rounded-full p-1 md:p-2 hover:bg-purple-400/20"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="w-8 h-8 md:w-10 md:h-10 text-white"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>

      {/* Tombol Next */}
      <div className="absolute top-1/2 transform -translate-y-1/2 right-1 z-10">
        <button
          onClick={() => handleSlideChange("next")}
          className="rounded-full p-1 md:p-2 hover:bg-purple-400/20"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="w-8 h-8 md:w-10 md:h-10 text-white"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Gallery Dots */}
      <div className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 md:space-x-2 z-10">
        {uniqueAnimes.map((_, index) => (
          <div
            key={`dot-${index}`} // 👈 Pastikan key unik
            className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${
              index === currentSlide ? "bg-purple-600" : "bg-gray-400"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}

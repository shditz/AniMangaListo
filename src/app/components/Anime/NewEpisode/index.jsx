//src/app/components/Anime/NewEpisode/index.jsx

"use client";

import { useState, useEffect } from "react";

import Header from "../ListAnime/Header";
import dynamic from "next/dynamic";
const NavButton = dynamic(() => import("../../NavButton"), {
  ssr: false,
});

async function fetchEpisodes() {
  const res = await fetch("https://api.jikan.moe/v4/watch/episodes", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch episodes");
  return res.json();
}

const NewEpisodesSection = ({ data: initialData }) => {
  const [data, setData] = useState(initialData || []);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(5);
  const [loading, setLoading] = useState(!initialData);
  const totalSlides = data.length;

  useEffect(() => {
    if (!initialData) {
      setLoading(true);
      fetchEpisodes()
        .then((res) => {
          setData(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [initialData]);

  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth < 768) {
        setCardsPerView(2);
      } else {
        setCardsPerView(5);
      }
    };

    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);

    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  const minSwipeDistance = 50;
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleSlideChange("next");
    } else if (isRightSwipe) {
      handleSlideChange("prev");
    }
  };

  const handleSlideChange = (direction) => {
    if (direction === "prev") {
      setCurrentSlide((prev) => {
        const newSlide = prev - cardsPerView;
        if (newSlide < 0) {
          const lastSlideStart =
            (Math.ceil(totalSlides / cardsPerView) - 1) * cardsPerView;
          return lastSlideStart;
        }
        return newSlide;
      });
    } else {
      setCurrentSlide((prev) => {
        const newSlide = prev + cardsPerView;
        if (newSlide >= totalSlides) {
          return 0;
        }
        return newSlide;
      });
    }
  };

  if (loading) {
    return (
      <section className="md:p-4 md:pt-0">
        <Header
          title="Latest Update"
          linkTitle="View More"
          linkHref="/ViewAll/anime/LatestUpdate"
        />
        <div className="grid md:grid-cols-5 grid-cols-2 gap-3 mt-4 px-2">
          {[...Array(cardsPerView)].map((_, i) => (
            <div
              key={i}
              className="h-[200px] md:h-[280px] rounded-lg bg-gray-800 animate-pulse"
            ></div>
          ))}
        </div>
      </section>
    );
  }

  if (!data.length) {
    return (
      <section className="md:p-4 md:pt-0">
        <Header
          title="Latest Update"
          linkTitle="View More"
          linkHref="/ViewAll/anime/LatestUpdate"
        />
        <p className="text-center py-8 text-gray-400">No episodes available</p>
      </section>
    );
  }

  return (
    <section className="md:p-4  md:pt-0">
      <Header
        title="Latest Update"
        linkTitle="View More"
        linkHref="/ViewAll/anime/LatestUpdate"
      />

      <div className="relative mt-4">
        <div
          className="overflow-hidden relative"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="absolute top-1/2 transform -translate-y-1/2 left-1 z-10">
            <button
              onClick={() => handleSlideChange("prev")}
              className="rounded-full p-1 md:p-2 hover:bg-purple-400/20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-8 h-8 md:w-10 md:h-10 text-white"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          </div>

          <div className="absolute top-1/2 transform -translate-y-1/2 right-1 z-10">
            <button
              onClick={() => handleSlideChange("next")}
              className="rounded-full p-1 md:p-2 hover:bg-purple-400/20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-8 h-8 md:w-10 md:h-10 text-white"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          <div
            className="flex transition-transform duration-300 ease-out"
            style={{
              width: `${(totalSlides / cardsPerView) * 100}%`,
              transform: `translateX(-${(currentSlide / totalSlides) * 100}%)`,
              willChange: "transform",
            }}
          >
            {data.map((anime, index) => {
              const latestEpisode = anime.episodes[0] || {};

              const episodeNumber = latestEpisode.title
                ? latestEpisode.title.match(/Episode (\d+)/)?.[1] || "N/A"
                : "N/A";

              return (
                <div
                  key={`${anime.entry.mal_id}-${index}`}
                  className="flex-shrink-0 w-[180] xl:w-[294.5px] md:w-[148px] left-2 px-2"
                >
                  <NavButton
                    href={`/anime/${anime.entry.mal_id}`}
                    className="cursor-pointer relative block group"
                  >
                    <div className="relative h-[200px] xl:h-[280px] rounded-lg overflow-hidden bg-gray-900">
                      <img
                        src={anime.entry.images.jpg.large_image_url}
                        alt={anime.entry.title}
                        className="object-cover"
                      />

                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors" />

                      <div className="absolute top-2 left-2 flex gap-2">
                        <div className="font-normal bg-purple-900/70 text-white text-xs xl:text-base px-2 py-1 rounded">
                          #{index + 1}
                        </div>
                      </div>

                      <div className="absolute top-2 right-2 flex gap-2">
                        <div className="font-normal bg-purple-900/70 text-white text-xs xl:text-base px-2 py-1 rounded">
                          Eps {episodeNumber}
                        </div>
                      </div>

                      <div className="absolute bottom-2 left-2 right-2">
                        <h3 className="font-medium text-sm xl:text-base text-white line-clamp-2">
                          {anime.entry.title}
                        </h3>
                      </div>
                    </div>
                  </NavButton>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewEpisodesSection;

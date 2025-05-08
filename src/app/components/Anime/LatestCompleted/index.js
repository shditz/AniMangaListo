"use client";

import { useState, useEffect } from "react";

import Link from "next/link";
import Header from "../ListAnime/Header";

function removeDuplicates(data, key = "mal_id") {
  const seen = new Set();
  return data.filter((item) => {
    const val = item[key];
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
}

const LatestCompleted = ({ data }) => {
  const uniqueData = removeDuplicates(data || [], "mal_id");

  const [currentSlide, setCurrentSlide] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(5);
  const totalSlides = uniqueData.length;

  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth < 768) {
        setCardsPerView(2);
      } else {
        setCardsPerView(5);
      }
      setCurrentSlide(0);
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

    if (isLeftSwipe) handleSlideChange("next");
    if (isRightSwipe) handleSlideChange("prev");
  };

  const handleSlideChange = (direction) => {
    if (direction === "prev") {
      setCurrentSlide((prev) => {
        const newSlide = prev - cardsPerView;
        if (newSlide < 0) {
          const lastSlideStart =
            (Math.ceil(totalSlides / cardsPerView) - 1) * cardsPerView;
          return Math.max(0, lastSlideStart);
        }
        return newSlide;
      });
    } else {
      setCurrentSlide((prev) => {
        const newSlide = prev + cardsPerView;
        return newSlide >= totalSlides ? 0 : newSlide;
      });
    }
  };

  if (!uniqueData.length) {
    return (
      <section className="md:p-4 p-2">
        <Header
          title="Latest Completed"
          linkTitle="View More"
          linkHref="/completed"
        />
        <p className="text-gray-500 text-center py-4">
          No completed anime found.
        </p>
      </section>
    );
  }

  return (
    <section className="md:p-4 md:pt-0">
      <Header
        title="Latest Completed"
        linkTitle="View More"
        linkHref="/completed"
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
              aria-label="Previous Slide"
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
              aria-label="Next Slide"
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
            {uniqueData.map((anime, index) => (
              <div
                key={`${anime.mal_id}-${index}`}
                className="flex-shrink-0 w-[195px] xl:w-[294px] md:w-[148px] left-2 px-2"
              >
                <Link
                  href={`/anime/${anime.mal_id}`}
                  className="cursor-pointer block group"
                >
                  <div className="relative h-[200px] xl:h-[280px] rounded-lg overflow-hidden bg-gray-900">
                    <img
                      src={anime.images.jpg.large_image_url}
                      alt={anime.title}
                      className="object-cover "
                    />

                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors" />

                    <div className="absolute top-2 left-2 flex gap-2">
                      <div className="font-normal bg-purple-900/70 text-white text-xs  xl:text-base px-2 py-1 rounded">
                        #{index + 1}
                      </div>
                    </div>

                    <div className="absolute top-2 right-2 flex gap-2">
                      <div className="font-normal bg-yellow-500 text-white text-xs xl:text-base px-2 py-1 rounded">
                        ★{anime.score || "???"}
                      </div>
                    </div>

                    <div className="absolute bottom-2 left-2 right-2">
                      <h3 className="font-medium text-sm xl:text-base text-white line-clamp-2">
                        {anime.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestCompleted;

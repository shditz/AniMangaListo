"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

function removeDuplicates(data, key = "mal_id") {
  const seen = new Set();
  return data.filter((item) => {
    const val = item[key];
    if (seen.has(val)) {
      return false;
    }
    seen.add(val);
    return true;
  });
}

const TrailerCarousel = ({ data, title }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);
  const [activeVideoId, setActiveVideoId] = useState(null);

  const filteredData = removeDuplicates(
    data.filter((anime) => anime.trailer?.youtube_id),
    "mal_id"
  );

  const totalSlides = filteredData.length;

  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth < 640) {
        setCardsPerView(1);
      } else if (window.innerWidth < 768) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(4);
      }
    };

    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  const handleSlideChange = (direction) => {
    setActiveVideoId(null);

    if (direction === "prev") {
      setCurrentSlide((prev) => {
        const newSlide = prev - cardsPerView;
        return newSlide < 0
          ? Math.max(0, totalSlides - cardsPerView)
          : newSlide;
      });
    } else {
      setCurrentSlide((prev) => {
        const newSlide = prev + cardsPerView;
        return newSlide >= totalSlides ? 0 : newSlide;
      });
    }
  };

  const handleThumbnailClick = (youtubeId) => {
    if (youtubeId) {
      setActiveVideoId((prev) => (prev === youtubeId ? null : youtubeId));
    }
  };

  if (filteredData.length === 0) {
    return (
      <div className="p-4">
        <h1 className="md:text-2xl text-xl font-bold relative inline-block pb-2">
          {title || "Trailers Anime"}
          <span className="absolute bottom-0 left-0 w-full h-1 bg-purple-700"></span>
        </h1>
        <p className="text-gray-400 mt-4">
          No trailers available for this category.
        </p>
      </div>
    );
  }

  return (
    <div className="xl:px-9 md:px-6 px-2">
      <div className="relative mt-4">
        <div className="overflow-hidden relative">
          {totalSlides > cardsPerView && (
            <>
              <button
                onClick={() => handleSlideChange("prev")}
                className="absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-purple-900/20 rounded-full md:p-3 p-1 hover:bg-purple-400/20 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6 text-white"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <button
                onClick={() => handleSlideChange("next")}
                className="absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-purple-900/20 rounded-full md:p-3 p-1 hover:bg-purple-400/20 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6 text-white"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          )}

          <div
            className="flex  gap-2 transition-transform duration-300 ease-out"
            style={{
              width: `${Math.ceil(totalSlides / cardsPerView) * 100}%`,
              transform: `translateX(-${(currentSlide / totalSlides) * 100}%)`,
            }}
          >
            {filteredData.map((anime, index) => {
              const youtubeId = anime.trailer?.youtube_id;
              const youtubeThumbnail = `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;

              return (
                <div
                  key={`${anime.mal_id}-${index}`}
                  className="px-0 xl:w-[356px] md:w-[400px] w-[350px]"
                >
                  <div
                    className="relative  h-[200px] xl:h-[220px] md:h-[215px] rounded-lg overflow-hidden bg-gray-900 cursor-pointer group"
                    onClick={() => handleThumbnailClick(youtubeId)}
                  >
                    {activeVideoId !== youtubeId ? (
                      <>
                        <Image
                          src={youtubeThumbnail}
                          alt={anime.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          priority
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-red-600 rounded-full p-2 shadow-lg">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-6 h-6 text-white"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>

                        <div className="absolute top-4 left-2">
                          <div className="bg-red-500 text-white text-xs md:text-sm px-2 py-1 rounded">
                            TRAILER
                          </div>
                        </div>

                        <div className="absolute bottom-4 left-2 right-2">
                          <h3 className="text-white font-medium text-sm md:text-base  line-clamp-2">
                            {anime.title}
                          </h3>
                        </div>
                      </>
                    ) : (
                      <>
                        <iframe
                          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                          title={anime.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        ></iframe>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveVideoId(null);
                          }}
                          className="absolute top-2 right-2 z-20 bg-black/50 rounded-full p-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-5 h-5 text-white"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrailerCarousel;

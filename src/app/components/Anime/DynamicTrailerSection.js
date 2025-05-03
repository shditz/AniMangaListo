"use client";
import { useState } from "react";
import TrailerCarousel from "./ListTrailer";
import Link from "next/link";

const DynamicTrailerSection = ({
  popular,
  topAnime,
  seasonalAnime,
  movieTl,
  topAiringTl,
  topUpcomingTl,
  favorited,
}) => {
  const [selectedType, setSelectedType] = useState("seasonalAnime");
  const [isOpen, setIsOpen] = useState(false);

  const typeOptions = [
    {
      value: "seasonalAnime",
      label: "Seasonal Anime Trailers",
      data: seasonalAnime || [],
      linkHref: "/",
    },
    {
      value: "topAnime",
      label: "Top Anime Trailers",
      data: topAnime || [],
      linkHref: "/",
    },
    {
      value: "topMovie",
      label: "Top Movie Trailers",
      data: movieTl || [],
      linkHref: "/",
    },
    {
      value: "topAiring",
      label: "Top Airing Trailers",
      data: topAiringTl || [],
      linkHref: "/",
    },

    {
      value: "topUpcoming",
      label: "Top Upcoming Trailers",
      data: topUpcomingTl || [],
      linkHref: "/",
    },
    {
      value: "popular",
      label: "Most Popular Trailers",
      data: popular || [],
      linkHref: "/",
    },

    {
      value: "favorited",
      label: "Most Favorited Trailers",
      data: favorited || [],
      linkHref: "/",
    },
  ];

  const selectedOption = typeOptions.find((opt) => opt.value === selectedType);

  return (
    <section className="mb-2">
      <div className="flex justify-between items-center mb-4">
        <div className="hidden md:flex flex-col xl:pl-10 xl:pr-10 md:pl-6 md:pr-6 w-full">
          <div className="flex flex-wrap gap-2">
            {typeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedType(opt.value)}
                className={`xl:px-4 px-3 py-2 rounded-t-lg transition-colors ${
                  selectedType === opt.value
                    ? "bg-purple-600 text-white text-lg font-semibold"
                    : "bg-gray-800/10  hover:text-white font-semibold text-gray-300 "
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="h-px bg-purple-400 w-full mt-1"></div>
        </div>

        <div className="md:hidden w-full flex flex-col space-y-4 px-4">
          <div>
            <h2 className="text-xl font-bold relative inline-block pb-2">
              {selectedOption.label}
              <span className="absolute bottom-0 left-0 w-full h-1 bg-purple-700"></span>
            </h2>
          </div>

          <div className="relative w-full">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="border border-purple-600 flex items-center justify-between w-full bg-gray-800/10 px-4 py-2 rounded-lg text-sm text-white"
            >
              <span>{selectedOption.label}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={`w-5 h-5 text-purple-400 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              >
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </button>

            {isOpen && (
              <div className="absolute z-10 mt-2 w-full bg-gray-900 rounded-lg shadow-lg border border-purple-600">
                {typeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSelectedType(opt.value);
                      setIsOpen(false);
                    }}
                    className={`px-4 py-2 block w-full text-left text-sm ${
                      selectedType === opt.value
                        ? "bg-purple-600 text-white"
                        : "text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <TrailerCarousel
        data={selectedOption.data}
        title={selectedOption.label}
      />

      <div className="flex justify-center md:mt-2">
        <Link
          href={selectedOption.linkHref}
          className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-600 transition-colors"
        >
          <span>View More</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06L17.69 12l-5.72-5.72a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
};

export default DynamicTrailerSection;

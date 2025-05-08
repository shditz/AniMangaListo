"use client";

import { useState } from "react";
import ListManga from "./ListManga";
import Link from "next/link";

const SectionManga = ({
  topManga,
  topPublishing,
  topUpcomingManga,
  mostPopularManga,
  mostFavoritedManga,
}) => {
  const [selectedType, setSelectedType] = useState("topManga");
  const [isOpen, setIsOpen] = useState(false);

  const typeOptions = [
    {
      value: "topManga",
      label: "Top Manga",
      data: topManga || [],
      linkHref: "/top-manga",
    },
    {
      value: "topPublishing",
      label: "Top Publishing",
      data: topPublishing || [],
      linkHref: "/publishing-manga",
    },
    {
      value: "topUpcoming",
      label: "Top Upcoming",
      data: topUpcomingManga || [],
      linkHref: "/tupcoming-manga",
    },
    {
      value: "mostPopularManga",
      label: "Most Popular",
      data: mostPopularManga || [],
      linkHref: "/popular-manga",
      metric: "popularity",
    },

    {
      value: "mostFavoritedManga",
      label: "Most Favorited",
      data: mostFavoritedManga || [],
      linkHref: "/favorited-manga",
      metric: "favorites",
    },
  ];

  const selectedOption = typeOptions.find((opt) => opt.value === selectedType);

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <div className="hidden md:flex flex-col md:pl-6 md:pr-6 xl:pl-10 xl:pr-10 w-full">
          <div className="flex space-x-4">
            {typeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedType(opt.value)}
                className={`px-4 py-2  rounded-t-lg ${
                  selectedType === opt.value
                    ? "bg-purple-600 md:text-base xl:text-lg font-semibold text-white"
                    : "bg-gray-800/10  md:text-sm xl:text-base font-semibold hover:text-white text-gray-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="h-px  bg-purple-400 w-full mt-1"></div>
        </div>

        <div className="md:hidden w-full flex flex-col space-y-4">
          <div>
            <h2 className="text-xl left-2  font-bold relative inline-block pb-2">
              {selectedOption.label}
              <span className="absolute bottom-0 left-0 w-full h-1 bg-purple-700"></span>
            </h2>
          </div>

          <div className="relative w-full">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="border border-purple-600 flex items-center justify-between w-full bg-gray-800/10 px-4 py-2 rounded-lg text-sm text-white"
            >
              <span className="text-left">{selectedOption.label}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={`w-5 h-5 text-purple-400 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              >
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </button>

            {isOpen && (
              <div className="absolute z-10 mt-2 w-full bg-black/80 rounded shadow-md">
                {typeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSelectedType(opt.value);
                      setIsOpen(false);
                    }}
                    className={`px-4 py-2 block w-full text-left text-sm text-white hover:bg-gray-700 ${
                      selectedType === opt.value
                        ? "bg-purple-600 text-white"
                        : ""
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

      <ListManga api={selectedOption.data} metric={selectedOption.metric} />

      <div className="flex justify-center mt-4">
        <Link
          href={selectedOption.linkHref}
          className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-600 transition-colors bg-transparent"
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

export default SectionManga;

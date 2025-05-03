"use client";

import { useState, useEffect } from "react";
import GenreSelector from "./Genre/GenreSelector";
import GenreFilterBar from "./Genre/GenreFilter";
import GenreAnimeGrid from "./Genre/GenreAnimeGrid";

const ADULT_GENRES = {
  HENTAI: 12,
  ECCHI: 9,
  EROTICA: 49,
};

export default function GenreSearchClient() {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [filters, setFilters] = useState({});
  const [showWarning, setShowWarning] = useState(false);
  const [genreNames, setGenreNames] = useState({});
  const [pendingAdultGenre, setPendingAdultGenre] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("https://api.jikan.moe/v4/genres/anime");

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();

        if (!data || !Array.isArray(data.data)) {
          throw new Error("Invalid data format from API");
        }

        const names = {};
        data.data.forEach((genre) => {
          if (genre.mal_id && genre.name) {
            names[genre.mal_id] = genre.name;
          }
        });

        setGenreNames(names);
      } catch (err) {
        console.error("Error fetching genres:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const handleGenreSelect = (id) => {
    if (selectedGenres.includes(id)) {
      setSelectedGenres((prev) => prev.filter((genreId) => genreId !== id));
      return;
    }

    if (Object.values(ADULT_GENRES).includes(id)) {
      setPendingAdultGenre(id);
      setShowWarning(true);
      return;
    }

    setSelectedGenres((prev) => [...prev, id]);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const closeWarning = () => {
    setShowWarning(false);
    setPendingAdultGenre(null);
  };

  const confirmAdultContent = () => {
    if (pendingAdultGenre) {
      setSelectedGenres((prev) => [...prev, pendingAdultGenre]);
    }
    closeWarning();
  };

  return (
    <div className="md:pl-10 pl-4 pr-4 md:pr-10">
      {isLoading && (
        <div className="text-center py-8 text-gray-300">
          <p>Loading genres...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8 text-red-400">
          <p>Error loading genres: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !error && (
        <>
          {showWarning && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md mx-4">
                <h3 className="text-xl font-bold mb-4 select-none">
                  ⚠️ Adult Content
                </h3>
                <p className="mb-4">
                  Genre{" "}
                  <span className="font-bold">
                    {genreNames[pendingAdultGenre]}
                  </span>{" "}
                  contains adult content,
                  <br />
                  Are you sure you want to continue?
                </p>
                <div className="flex gap-10">
                  <button
                    onClick={closeWarning}
                    className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition select-none"
                  >
                    Don't Continue
                  </button>
                  <button
                    onClick={confirmAdultContent}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition select-none"
                  >
                    I'm 18+
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="md:p-1 mb-6 bg-white dark:bg-gray-800/10 rounded-lg shadow-md">
            <h2 className="md:text-2xl text-lg font-semibold mb-3">
              Discover Anime by Genre
            </h2>

            <GenreSelector
              selectedGenres={selectedGenres}
              onGenreSelect={handleGenreSelect}
            />

            {selectedGenres.length > 0 && (
              <>
                <GenreFilterBar
                  filters={filters}
                  onFilterChange={handleApplyFilters}
                />
                <div className="mt-4">
                  <GenreAnimeGrid genreIds={selectedGenres} filters={filters} />
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

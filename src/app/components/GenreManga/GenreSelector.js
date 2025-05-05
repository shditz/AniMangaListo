"use client";

import { useState, useEffect } from "react";

export default function GenreSelectorManga({ selectedGenres, onGenreSelect }) {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWithRetry = async (url, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url);

        if (response.status === 429) {
          await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
          continue;
        }

        if (!response.ok)
          throw new Error(`Failed to fetch: ${response.status}`);
        return await response.json();
      } catch (err) {
        if (i === retries - 1) throw err;
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
      }
    }
  };

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const data = await fetchWithRetry(
          "https://api.jikan.moe/v4/genres/manga"
        );

        if (!data?.data) throw new Error("Invalid API response structure");
        const uniqueGenres = Array.from(
          new Map(
            data.data.filter((g) => g.mal_id !== 0).map((g) => [g.mal_id, g])
          ).values()
        );

        setGenres(uniqueGenres);
      } catch (err) {
        console.error("Genre fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadGenres();
  }, []);

  if (loading)
    return (
      <div className="text-center p-4 text-gray-400">
        Loading manga genres...
      </div>
    );
  if (error)
    return <div className="text-center p-4 text-red-400">Error: {error}</div>;

  return (
    <div className="grid grid-cols-3 md:grid-cols-5 xl:grid-cols-6 gap-2 p-2">
      {genres.map((genre) => (
        <button
          key={genre.mal_id}
          onClick={() => onGenreSelect(genre.mal_id)}
          className={`text-xs md:text-sm p-1.5 rounded transition-colors ${
            selectedGenres.includes(genre.mal_id)
              ? "bg-purple-600 border-2 border-purple-600 text-white"
              : "bg-black border-1 border-purple-600 hover:bg-purple-600"
          }`}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
}

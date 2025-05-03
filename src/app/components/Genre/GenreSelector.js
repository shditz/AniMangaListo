"use client";

import { useState, useEffect } from "react";

export default function GenreSelector({ selectedGenres, onGenreSelect }) {
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

        const data = await response.json();
        return data;
      } catch (err) {
        if (i === retries - 1) throw err;
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
      }
    }
  };

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchWithRetry(
          "https://api.jikan.moe/v4/genres/anime"
        );

        if (!data || !Array.isArray(data.data)) {
          throw new Error("Invalid data structure");
        }

        setGenres(data.data);
      } catch (err) {
        console.error("Error fetching genres:", err);
        setError(err.message);
        setGenres([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  if (loading)
    return <p className="text-center py-4 text-gray-400">Loading genres...</p>;
  if (error)
    return <p className="text-center py-4 text-red-400">Error: {error}</p>;
  if (genres.length === 0)
    return (
      <p className="text-center py-4 text-gray-400">No genres available</p>
    );

  return (
    <div className="grid grid-cols-3 md:grid-cols-5 xl:grid-cols-6 gap-1">
      {genres.map((genre) => (
        <button
          key={genre.mal_id}
          onClick={() => onGenreSelect(genre.mal_id)}
          className={`px-0 py-1 rounded-lg text-xs md:text-base ${
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

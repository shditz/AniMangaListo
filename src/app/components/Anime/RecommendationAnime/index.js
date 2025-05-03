"use client";

import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { useEffect, useState } from "react";

const fetcher = (url) => fetch(url).then((res) => res.json());

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function RecommendationAnime({ limit = 10 }) {
  const { data, error, isLoading } = useSWR("/api/recommendations", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  const [shuffledData, setShuffledData] = useState([]);

  useEffect(() => {
    if (data?.recommendations) {
      const shuffled = shuffleArray(data.recommendations);
      setShuffledData(shuffled);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="md:px-6 md:p-2">
        <div className="grid md:grid-cols-5 grid-cols-2 gap-3">
          {[...Array(limit)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 rounded animate-pulse h-[250px] xl:h-[350px]"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        Failed Load Recommendation Anime, try again.
      </div>
    );
  }

  if (!data?.recommendations || !Array.isArray(data.recommendations)) {
    return (
      <div className="text-center py-4 text-yellow-500">
        Data Not Available, try again.
      </div>
    );
  }

  const allRecommendations = shuffledData.slice(0, limit);

  return (
    <div className="relative">
      <div className="grid xl:grid-cols-5 md:grid-cols-5  grid-cols-2 gap-3 md:px-6">
        {allRecommendations.map((anime, index) => (
          <div key={`${anime.mal_id}-${index}`} className="shadow-xl">
            <Link
              href={`/anime/${anime.mal_id}`}
              className="cursor-pointer relative block group"
            >
              <div className="w-full relative h-[250px] xl:h-[350px]">
                <Image
                  src={anime.images.jpg.large_image_url}
                  alt={anime.title}
                  fill
                  loading="lazy"
                  className="object-cover transition-all duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="absolute font-normal top-2 left-2 bg-purple-900/70 text-white px-2 py-1 rounded">
                #{index + 1}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2 title-bg">
                <h3 className="text-white text-sm md:text-base font-normal truncate">
                  {anime.title}
                </h3>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

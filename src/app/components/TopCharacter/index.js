"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FavoriteIcon } from "../Anime/ListAnime/Icons";

const TopCharacters = ({ data }) => {
  const [internalData, setInternalData] = useState(
    Array.isArray(data) ? data : []
  );
  const [loading, setLoading] = useState(!data?.length);

  const uniqueData = Array.from(
    new Map(data?.map((v) => [v.mal_id, v])).values()
  );

  useEffect(() => {
    if (Array.isArray(data)) {
      const normalizedData = data.map((item) => item.node || item); // flatten data
      setInternalData(normalizedData);

      const cacheData = {
        timestamp: Date.now(),
        data: normalizedData,
      };
      localStorage.setItem("top-characters", JSON.stringify(cacheData));
    } else {
      const cachedData = JSON.parse(localStorage.getItem("top-characters"));
      if (
        cachedData &&
        Date.now() - cachedData.timestamp < 24 * 60 * 60 * 1000
      ) {
        setInternalData(cachedData.data);
      }
    }
  }, [data]);

  return (
    <div className="relative">
      <div className="grid md:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-3 px-2 md:px-6">
        {uniqueData.map((character, index) => (
          <div key={`${character.mal_id}-${index}`} className="shadow-xl">
            <Link
              href={`/character/${character.mal_id}`}
              className="cursor-pointer relative block group"
            >
              <div className="w-full relative h-[250px] md:h-[220px] sm:h-[350px]">
                <Image
                  src={character.images?.jpg?.image_url || "/placeholder.jpg"}
                  alt={character.name || "Unknown Character"}
                  fill
                  className="object-cover transition-all duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              <div className="absolute text-xs xl:text-base font-normal top-2 left-2 bg-purple-900/70 text-white px-2 py-1 rounded">
                #{index + 1}
              </div>

              <div className="absolute bg-pink-400 top-2 right-2 text-white text-xs xl:text-base px-2 py-1 rounded flex items-center gap-1">
                <FavoriteIcon className="text-white" />
                <span>{character.favorites || "???"}</span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-white text-base md:text-lg font-normal truncate">
                  {character.name || "Unknown Character"}
                </h3>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCharacters;

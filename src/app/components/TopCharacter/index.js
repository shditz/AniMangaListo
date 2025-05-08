"use client";

import { useEffect, useState } from "react";
import { FavoriteIcon } from "../Anime/ListAnime/Icons";
import dynamic from "next/dynamic";
const NavButton = dynamic(() => import("../NavButton"), {
  ssr: false,
});

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
      const normalizedData = data.map((item) => item.node || item);
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
            <NavButton
              href={`/character/${character.mal_id}`}
              className="cursor-pointer relative block group"
            >
              <div className="w-full relative h-[250px] md:h-[220px] xl:h-[350px] overflow-hidden">
                <img
                  src={character.images?.jpg?.image_url || "/placeholder.jpg"}
                  alt={character.name || "Unknown Character"}
                  loading="lazy"
                  decoding="async"
                  width="100%"
                  height="100%"
                  className="object-cover w-full h-full transition-all duration-300"
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
            </NavButton>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCharacters;

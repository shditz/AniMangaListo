"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PopularityIcon, FavoriteIcon } from "./Icons";

const ListAnime = ({ api, metric }) => {
  const [data, setData] = useState(Array.isArray(api) ? api : []);
  const [loading, setLoading] = useState(!api?.data);
  const uniqueData = Array.from(
    new Map(data?.map((v) => [v.mal_id, v])).values()
  );

  useEffect(() => {
    if (Array.isArray(api)) {
      setData(api);

      const cacheData = {
        timestamp: Date.now(),
        data: api,
      };
      localStorage.setItem("list-anime", JSON.stringify(cacheData));
    } else {
      const cachedData = JSON.parse(localStorage.getItem("list-anime"));
      if (
        cachedData &&
        Date.now() - cachedData.timestamp < 24 * 60 * 60 * 1000
      ) {
        setData(cachedData.data);
      }
    }
  }, [api]);

  return (
    <div className="relative">
      <div className="grid xl:grid-cols-5 md:grid-cols-5 grid-cols-2 gap-3 px-2 md:px-6 xl:px-10">
        {uniqueData.map((anime, index) => (
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
                  className="object-cover transition-all duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="absolute text-sm md:text-base font-normal top-2 left-2 bg-purple-900/70 text-white px-2 py-1 rounded">
                #{index + 1}
              </div>
              <div className="absolute bg-yellow-500 top-2 right-2 text-white text-sm md:text-base px-2 py-1 rounded flex items-center gap-1">
                {metric === "popularity" ? (
                  <>
                    <PopularityIcon className="text-white" />
                    <span>{anime.popularity || "???"}</span>
                  </>
                ) : metric === "favorites" ? (
                  <>
                    <FavoriteIcon className="text-white" />
                    <span>{anime.favorites || "???"}</span>
                  </>
                ) : (
                  <>
                    <span>★</span>
                    <span>{anime.score || "???"}</span>
                  </>
                )}
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-2 title-bg">
                <h3 className="text-white text-base :text-lg font-normal truncate">
                  {anime.title}
                </h3>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListAnime;

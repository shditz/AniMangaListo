"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PopularityIcon, FavoriteIcon } from "../../Anime/ListAnime/Icons";

const ListManga = ({ api, metric }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(!api?.data);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      let fetchedData = [];

      if (Array.isArray(api)) {
        fetchedData = api;
      } else if (api?.data) {
        fetchedData = api.data;
      } else {
        const cachedData = JSON.parse(localStorage.getItem("list-manga"));
        if (
          cachedData &&
          Date.now() - cachedData.timestamp < 24 * 60 * 60 * 1000
        ) {
          fetchedData = cachedData.data;
        } else {
          throw new Error("No cached data available");
        }
      }

      const uniqueData = Array.from(
        new Map(fetchedData.map((v) => [v.mal_id, v])).values()
      );

      setData(uniqueData);
      setLoading(false);

      const cacheData = {
        timestamp: Date.now(),
        data: fetchedData,
      };
      localStorage.setItem("list-manga", JSON.stringify(cacheData));
    } catch (err) {
      setError(err.message || "Failed to load manga data");
      setLoading(false);
    }
  }, [api]);

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Load Manga..</div>;
  }

  if (error || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p className="text-xl font-semibold">Manga Data is Not Available</p>
        <p className="mt-2">There Are No Manga Currently Available.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid xl:grid-cols-5 md:grid-cols-5 grid-cols-2 gap-3 px-2 md:px-6 xl:px-10">
        {data.map((manga, index) => (
          <div key={`${manga.mal_id}-${index}`} className="shadow-xl">
            <Link
              href={`/manga/${manga.mal_id}`}
              className="cursor-pointer relative block group"
            >
              <div className="w-full relative h-[250px] md:h-[220px] xl:h-[350px] overflow-hidden">
                <img
                  src={manga.images?.jpg?.large_image_url || "/placeholder.jpg"}
                  alt={manga.title}
                  loading="lazy"
                  width="100%"
                  height="100%"
                  className="object-cover transition-all duration-300 w-full h-full"
                />
              </div>
              <div className="absolute text-sm md:text-base font-normal top-2 left-2 bg-purple-900/70 text-white px-2 py-1 rounded">
                #{index + 1}
              </div>
              <div className="absolute bg-yellow-500 top-2 right-2 text-white text-sm md:text-base px-2 py-1 rounded flex items-center gap-1">
                {metric === "popularity" ? (
                  <>
                    <PopularityIcon className="text-white" />
                    <span>{manga.popularity || "???"}</span>
                  </>
                ) : metric === "favorites" ? (
                  <>
                    <FavoriteIcon className="text-white" />
                    <span>{manga.favorites || "???"}</span>
                  </>
                ) : (
                  <>
                    <span>★</span>
                    <span>{manga.score || "???"}</span>
                  </>
                )}
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-2 title-bg">
                <h3 className="text-white text-base md:text-lg font-normal truncate">
                  {manga.title}
                </h3>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListManga;

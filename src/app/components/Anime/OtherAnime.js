"use client";
import { useEffect, useState, useRef } from "react";

import { fetcher } from "@/app/lib/fetcher";
import Link from "next/link";
import { motion, useInView } from "framer-motion";

const allowedTypes = ["TV", "Movie", "OVA"];

export default function OtherAnime() {
  const [randomAnime, setRandomAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const results = await Promise.allSettled(
          Array.from({ length: 20 }).map(() =>
            fetcher("https://api.jikan.moe/v4/random/anime")
          )
        );

        const successfulAnimes = results
          .filter((result) => result.status === "fulfilled")
          .map((result) => result.value.data)
          .filter(
            (anime) =>
              anime &&
              allowedTypes.includes(anime.type) &&
              anime.images?.jpg?.image_url
          )
          .slice(0, 10);

        setRandomAnime(successfulAnimes);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="text-purple-400 p-4 text-center">Loading Anime...</div>
    );

  if (error)
    return (
      <div className="text-red-500 p-4 text-center">
        Error loading recommendations: {error}
      </div>
    );

  return (
    <div className="p-4 bg-black/30">
      <h1 className="md:text-2xl text-xl md:left-0 right-1 font-bold relative inline-block mb-4 pb-2">
        Other Anime
        <span className="absolute bottom-0 left-0 w-full h-1 bg-purple-700"></span>
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 overflow-hidden">
        {randomAnime.map((anime, index) => (
          <AnimeCard key={anime.mal_id} anime={anime} index={index} />
        ))}
      </div>
    </div>
  );
}

function AnimeCard({ anime, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px",
  });

  return (
    <motion.div
      layout="position"
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.4,
        delay: index * 0.03,
        ease: "easeOut",
      }}
    >
      <Link
        href={`/anime/${anime.mal_id}`}
        className="relative group transition-transform duration-300 hover:scale-[1.02]"
      >
        <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded z-10 text-xs">
          {anime.type}
        </div>
        <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded z-10">
          <span className="text-sm font-semibold">
            ★ {anime.score || "N/A"}
          </span>
        </div>

        <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-700">
          <img
            src={anime.images?.jpg?.image_url || "/placeholder.jpg"}
            alt={anime.title}
            width={384}
            height={512}
            loading="lazy"
            className="object-cover w-full h-full"
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-2 title-bg">
          <h3 className="text-white text-base md:text-lg font-normal truncate">
            {anime.title}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
}

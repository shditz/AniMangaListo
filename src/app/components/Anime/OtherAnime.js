"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";

const CACHE_KEY = "other_anime_cache";
const TTL = 24 * 60 * 60 * 1000;

export default function OtherAnime() {
  const [randomAnime, setRandomAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (data && Array.isArray(data) && Date.now() - timestamp < TTL) {
            setRandomAnime(data);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("Failed:", err);
      }

      setLoading(true);

      try {
        const res = await fetch(
          "https://api.jikan.moe/v4/top/anime?filter=bypopularity&limit=10"
        );
        const result = await res.json();

        const filtered = result.data
          .filter((anime) => anime.images?.jpg?.image_url)
          .slice(0, 10);

        if (filtered.length > 0) {
          setRandomAnime(filtered);

          try {
            localStorage.setItem(
              CACHE_KEY,
              JSON.stringify({
                data: filtered,
                timestamp: Date.now(),
              })
            );
          } catch (err) {
            console.error("Failed to cache:", err);
          }
        } else {
          setError("Anime Not Found ");
        }
      } catch (err) {
        setError("Failed Load Anime");
        console.error("Error fetch:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return <div className="text-purple-400 p-4 text-center">Load Anime...</div>;

  if (error) return <div className="text-red-500 p-4 text-center">{error}</div>;

  return (
    <div className="p-4 bg-black/30">
      <h1 className="md:text-2xl text-xl font-bold relative inline-block mb-4 pb-2">
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
            src={anime.images?.jpg?.large_image_url || "/placeholder.jpg"}
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

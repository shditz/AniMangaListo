import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
import dynamic from "next/dynamic";
const NavButton = dynamic(() => import("../NavButton"), {
  ssr: false,
});

export default function AnimeCard({ anime, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px",
  });

  const imageUrl =
    anime.images?.jpg.large_image_url ||
    anime.images?.jpg.image_url ||
    "/placeholder.jpg";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.4,
        delay: index * 0.02,
        ease: "easeOut",
      }}
    >
      <NavButton
        href={`/anime/${anime.mal_id}`}
        className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow relative block"
      >
        <div className="relative md:h-[250px] xl:h-[350px] pb-[142%]">
          <img
            src={imageUrl}
            alt={anime.title}
            className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-500"
            onError={(e) => (e.target.src = "/placeholder.jpg")}
          />

          <div className="absolute inset-0 flex flex-col justify-between p-3 bg-gradient-to-t from-black/60 to-transparent">
            <div className="flex justify-end">
              <span className="bg-yellow-500 px-2 py-1 rounded text-xs md:text-sm text-white font-bold">
                ★ {anime.score?.toFixed(1) || "N/A"}
              </span>
            </div>

            <div className="space-y-1 text-white">
              {anime.genres?.length > 0 && (
                <p className="md:text-sm text-xs font-normal opacity-90 line-clamp-2">
                  {anime.genres
                    .slice(0, 10)
                    .map((g) => g.name)
                    .join(" • ")}
                </p>
              )}

              <h3 className="font-medium text-xs md:text-base leading-tight line-clamp-2">
                {anime.title}
              </h3>
            </div>
          </div>
        </div>
      </NavButton>
    </motion.div>
  );
}

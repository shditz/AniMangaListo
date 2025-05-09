"use client";
import Image from "next/image";
import dynamic from "next/dynamic";
const NavButton = dynamic(() => import("../NavButton"), { ssr: false });

const PaginationRecomAnime = ({ api, page = 1, itemsPerPage }) => {
  const start = (page - 1) * itemsPerPage;
  const slice = api.data.slice(start, start + itemsPerPage);

  return (
    <div className="grid xl:grid-cols-5 md:grid-cols-5 grid-cols-2 gap-3 px-2 md:px-6 xl:px-10">
      {slice.map((item, idx) => {
        const anime = item.entry[0];
        const rank = start + idx + 1;
        return (
          <div key={`${anime.mal_id}-${idx}`} className="shadow-xl">
            <NavButton
              href={`/anime/${anime.mal_id}`}
              className="relative block group"
            >
              <img
                src={anime.images.jpg.large_image_url}
                alt={anime.title}
                width="350"
                height="350"
                loading="lazy"
                decoding="async"
                className="object-cover w-full h-full"
              />
              <div className="absolute top-2 left-2 bg-purple-900/70 text-white px-2 rounded">
                #{rank}
              </div>
              <div className="absolute bottom-0 w-full p-2 bg-gradient-to-t from-black to-transparent">
                <h3 className="text-white truncate">{anime.title}</h3>
              </div>
            </NavButton>
          </div>
        );
      })}
    </div>
  );
};

export default PaginationRecomAnime;

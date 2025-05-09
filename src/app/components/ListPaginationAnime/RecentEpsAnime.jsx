"use client";

import dynamic from "next/dynamic";
const NavButton = dynamic(() => import("../NavButton"), { ssr: false });

const RecentEpsAnime = ({ api }) => {
  const page = api?.pagination?.current_page ?? 1;
  const perPage = api?.pagination?.items?.per_page ?? api?.data?.length ?? 1;

  return (
    <div className="grid xl:grid-cols-5 md:grid-cols-5 grid-cols-2 gap-3 px-2 md:px-6 xl:px-10">
      {api?.data?.map((item, index) => {
        const anime = item.entry;
        const episode = item.episodes[0];
        const rank = (page - 1) * perPage + index + 1;

        return (
          <div key={`${anime.mal_id}-${index}`} className="shadow-xl">
            <NavButton
              href={`/anime/${anime.mal_id}`}
              className="cursor-pointer relative block group"
            >
              <div className="w-full relative h-[250px] md:h-[220px] xl:h-[350px] overflow-hidden">
                <img
                  src={anime.images.jpg.large_image_url}
                  alt={anime.title}
                  width="350"
                  height="350"
                  loading="lazy"
                  decoding="async"
                  className="object-cover transition-all duration-300 w-full h-full"
                />
              </div>

              <div className="absolute text-sm md:text-base font-normal top-2 left-2 bg-purple-900/70 text-white px-2 py-1 rounded">
                #{rank}
              </div>

              {episode && (
                <div className="absolute bg-purple-900/70 top-2 right-2 text-white text-xs md:text-sm px-2 py-1 rounded">
                  {episode.title}
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                <h3 className="text-white text-base md:text-lg font-normal truncate">
                  {anime.title}
                </h3>
              </div>
            </NavButton>
          </div>
        );
      })}
    </div>
  );
};

export default RecentEpsAnime;

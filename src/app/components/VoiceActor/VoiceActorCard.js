"use client";

import dynamic from "next/dynamic";
const NavButton = dynamic(() => import("../NavButton"), {
  ssr: false,
});

export default function VoiceActorCard({ voiceActor, rank }) {
  return (
    <div className="shadow-xl">
      <NavButton
        href={`/people/${voiceActor.mal_id}`}
        className="cursor-pointer relative block group"
      >
        <div className="w-full relative h-[250px] md:h-[220px] xl:h-[350px] overflow-hidden">
          <img
            src={voiceActor.images?.jpg?.image_url || "/default-avatar.png"}
            alt={voiceActor.name || "Unknown Voice Actor"}
            loading="lazy"
            width="100%"
            height="100%"
            className="object-cover transition-all duration-300 w-full h-full"
          />
        </div>

        <div className="absolute text-sm xl:text-base font-normal top-2 left-2 bg-purple-900/70 text-white px-2 py-1 rounded">
          #{rank + 1}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="text-white text-base md:text-lg font-normal truncate">
            {voiceActor.name || "Unknown VA"}
          </h3>
        </div>
      </NavButton>
    </div>
  );
}

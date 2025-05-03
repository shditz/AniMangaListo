"use client";

import Image from "next/image";
import Link from "next/link";

export default function VoiceActorCard({ voiceActor, rank }) {
  return (
    <div className="shadow-xl">
      <Link
        href={`/people/${voiceActor.mal_id}`}
        className="cursor-pointer relative block group"
      >
        <div className="w-full relative h-[250px] sm:h-[350px]">
          <Image
            src={voiceActor.images?.jpg?.image_url || "/default-avatar.png"}
            alt={voiceActor.name || "Unknown Voice Actor"}
            fill
            className="object-cover transition-all duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <div className="absolute text-sm md:text-base font-normal top-2 left-2 bg-purple-900/70 text-white px-2 py-1 rounded">
          #{rank + 1}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="text-white text-base md:text-lg font-normal truncate">
            {voiceActor.name || "Unknown VA"}
          </h3>
        </div>
      </Link>
    </div>
  );
}

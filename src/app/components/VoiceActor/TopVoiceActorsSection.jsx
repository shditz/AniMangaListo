"use client";

import { useEffect, useState } from "react";
import VoiceActorCard from "./VoiceActorCard";

export default function TopVoiceActorsSection() {
  const [topVAs, setTopVAs] = useState([]);
  const [seasonName, setSeasonName] = useState("Current Season");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTopVAs() {
      try {
        const res = await fetch("/api/Voiceactors");
        if (!res.ok) throw new Error("Failed to fetch top voice actors");

        const data = await res.json();
        setTopVAs(data.topVAs || []);

        if (data.seasonInfo) {
          setSeasonName(
            `${data.seasonInfo.season} ${data.seasonInfo.year}`.replace(
              /\b\w/g,
              (l) => l.toUpperCase()
            )
          );
        }
      } catch (err) {
        console.error("Error fetching top voice actors:", err);
      } finally {
        setLoading(false);
      }
    }

    loadTopVAs();
  }, []);

  if (loading) {
    return (
      <section className="md:px-10 p-2">
        <div className="mb-4 mt-2">
          <h1 className="md:text-2xl text-lg md:left-0 right-0 font-bold relative inline-block pb-2">
            Top Voice Actors ({seasonName})
            <span className="absolute bottom-0 left-0 w-full h-1 bg-purple-700"></span>
          </h1>
        </div>
        <div className="grid xl:grid-cols-5 md:grid-cols-5  grid-cols-2 gap-3">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 rounded animate-pulse h-[250px] xl:h-[350px]"
            ></div>
          ))}
        </div>
      </section>
    );
  }

  if (topVAs.length === 0) return null;

  return (
    <section className="xl:px-10 md:px-6 p-2">
      <div className="mb-4 mt-2">
        <h1 className="md:text-2xl text-lg md:left-0 right-0 font-bold relative inline-block pb-2">
          Top Voice Actors ({seasonName})
          <span className="absolute bottom-0 left-0 w-full h-1 bg-purple-700"></span>
        </h1>
      </div>
      <div className="grid md:grid-cols-5 grid-cols-2 gap-3">
        {topVAs.map((va, index) => (
          <VoiceActorCard key={va.mal_id} voiceActor={va} rank={index} />
        ))}
      </div>
    </section>
  );
}

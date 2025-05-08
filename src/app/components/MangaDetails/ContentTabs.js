"use client";
import { useState, useEffect } from "react";
import CharacterCard from "./MangaChar";
import { capitalizeFirstLetter } from "@/app/lib/utils";

import dynamic from "next/dynamic";
const NavButton = dynamic(() => import("../NavButton"), {
  ssr: false,
});

export default function ContentTabs({ characters, relations }) {
  const [activeTab, setActiveTab] = useState("characters");
  const [charactersToShow, setCharactersToShow] = useState(12);
  const [relationsToShow, setRelationsToShow] = useState(12);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setCharactersToShow(12);
    setRelationsToShow(12);
    setShowAll(false);
  }, [activeTab]);

  const handleShowMore = () => {
    if (activeTab === "characters") {
      setCharactersToShow(showAll ? 12 : characters.length);
    } else if (activeTab === "relations") {
      const allRelations = relations.flatMap((r) =>
        r.entry.filter((e) => e?.mal_id)
      );
      setRelationsToShow(showAll ? 12 : allRelations.length);
    }
    setShowAll(!showAll);
  };

  const showMoreButtonText = () => {
    if (showAll) return "Show Less";
    return activeTab === "characters"
      ? "Show More Characters"
      : "Show More Relations";
  };

  const shouldShowButton = () => {
    if (activeTab === "characters") return characters.length > 12;
    if (activeTab === "relations") {
      const allRelations = relations.flatMap((r) =>
        r.entry.filter((e) => e?.mal_id)
      );
      return allRelations.length > 12;
    }
    return false;
  };

  const getRelationImage = (entry) => {
    return (
      entry?.images?.webp?.image_url ||
      entry?.images?.jpg?.image_url ||
      "/placeholder-relation.jpg"
    );
  };

  return (
    <div className="relative z-10 pt-4 select-none bg-black backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap gap-2 mb-2 justify-center">
          {["Characters", "Relations"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.toLowerCase()
                  ? "bg-purple-600 md:text-xs xl:text-lg font-semibold text-white"
                  : "font-semibold hover:text-white text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
          <div className="h-px bg-purple-400 w-full mt-1"></div>
        </div>

        <div className="py-6">
          {activeTab === "characters" && (
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-2 xl:gap-3">
              {characters.slice(0, charactersToShow).map((character) => (
                <CharacterCard
                  key={character.mal_id}
                  image={character.image}
                  name={character.name}
                  role={character.role}
                />
              ))}
            </div>
          )}

          {activeTab === "relations" && (
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-2 xl:gap-3">
              {relations.length > 0 ? (
                relations
                  .flatMap((relation) =>
                    relation.entry
                      .filter((entry) => entry?.mal_id)
                      .map((entry) => ({
                        ...entry,
                        relationType: relation.relation,
                      }))
                  )
                  .slice(0, relationsToShow)
                  .map((entry) => (
                    <NavButton
                      key={`${entry.relationType}-${entry.mal_id}`}
                      href={`/${entry.type}/${entry.mal_id}`}
                      className="relative group"
                    >
                      <div className="block hover:opacity-90 transition-opacity">
                        <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-700">
                          <img
                            src={getRelationImage(entry)}
                            alt={entry.name || "Relation image"}
                            className="object-cover w-full h-full"
                            onError={(e) =>
                              (e.currentTarget.src =
                                "/placeholder-relation.jpg")
                            }
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                            <h3 className="text-white font-semibold xl:text-base truncate">
                              {entry.name}
                            </h3>
                            <p className="text-purple-300 text-sm mt-1">
                              {capitalizeFirstLetter(entry.relationType)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </NavButton>
                  ))
              ) : (
                <div className="col-span-full text-center text-gray-400 py-4">
                  No relations available
                </div>
              )}
            </div>
          )}
          {shouldShowButton() && (
            <div className="text-center mt-6">
              <button
                onClick={handleShowMore}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {showMoreButtonText()}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CharacterCard from "@/app/components/AnimeDetails/Character";
import { FaRegCalendar } from "react-icons/fa";
import Link from "next/link";
import { capitalizeFirstLetter } from "@/app/lib/utils";
import dynamic from "next/dynamic";
const NavButton = dynamic(() => import("../../NavButton"), {
  ssr: false,
});

const ContentTabs = ({
  episodes,
  characters,
  staff,
  relations,
  animeTitle,
}) => {
  const [activeTab, setActiveTab] = useState("Episodes");
  const [episodesToShow, setEpisodesToShow] = useState(12);
  const [charactersToShow, setCharactersToShow] = useState(12);
  const [voiceActorsToShow, setVoiceActorsToShow] = useState(12);
  const [staffToShow, setStaffToShow] = useState(12);
  const [showAll, setShowAll] = useState(false);
  const [relationsToShow, setRelationsToShow] = useState(12);

  const voiceActors = characters.reduce((acc, character) => {
    if (character.voiceActorData) {
      acc.push({
        id: `${character.mal_id}-${character.voiceActorData.mal_id}`,
        name: character.voiceActor,
        character: character.name,
        role: character.role,
        image:
          character.voiceActorData.images?.jpg?.image_url ||
          "/placeholder-va.jpg",
      });
    }
    return acc;
  }, []);

  useEffect(() => {
    setEpisodesToShow(12);
    setCharactersToShow(12);
    setVoiceActorsToShow(12);
    setStaffToShow(12);
    setShowAll(false);
  }, [activeTab]);

  const handleShowMore = () => {
    switch (activeTab) {
      case "Episodes":
        setEpisodesToShow(showAll ? 12 : episodes.length);
        break;
      case "Characters":
        setCharactersToShow(showAll ? 12 : characters.length);
        break;
      case "Voice Actors":
        setVoiceActorsToShow(showAll ? 12 : voiceActors.length);
        break;
      case "Staff":
        setStaffToShow(showAll ? 12 : staff.length);
        break;
      case "Related":
        setRelationsToShow(
          showAll ? 12 : relations.flatMap((r) => r.entry).length
        );
        break;
    }
    setShowAll(!showAll);
  };

  const showMoreButtonText = () => {
    if (showAll) return "Show Less";
    switch (activeTab) {
      case "Episodes":
        return "Show More Episodes";
      case "Characters":
        return "Show More Characters";
      case "Voice Actors":
        return "Show More Voice Actors";
      case "Staff":
        return "Show More Staff";
      default:
        return "Show More";
    }
  };

  const shouldShowButton = () => {
    switch (activeTab) {
      case "Episodes":
        return episodes.length > 12;
      case "Characters":
        return characters.length > 12;
      case "Voice Actors":
        return voiceActors.length > 12;
      case "Staff":
        return staff.length > 12;
      case "Related":
        return relations.flatMap((r) => r.entry).length > 12;
      default:
        return false;
    }
  };

  const AnimatedItem = ({ children, index }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{
          duration: 0.3,
          delay: index * 0.03,
          ease: "easeOut",
        }}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <div className="relative z-10 select-none bg-black py-4">
      <div className="container px-3 md:px-4 xl:px-0 mx-auto">
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {["Episodes", "Characters", "Voice Actors", "Staff", "Related"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab
                    ? "bg-purple-600 md:text-xs xl:text-lg font-semibold text-white"
                    : "font-semibold hover:text-white text-gray-300"
                }`}
              >
                {tab}
              </button>
            )
          )}
          <div className="h-px bg-purple-400 w-full mt-1"></div>
        </div>

        {activeTab === "Episodes" && (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 xl:gap-3">
            {episodes.slice(0, episodesToShow).map((episode) => {
              const formattedDate = episode.aired
                ? new Date(episode.aired).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "-";

              const crunchyrollUrl = `https://www.crunchyroll.com/search?q=${encodeURIComponent(
                `${animeTitle} Episode ${episode.number}`
              )}`;

              return (
                <Link
                  key={episode.mal_id}
                  href={crunchyrollUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <h3 className="text-white text-sm xl:text-lg font-medium">
                    Episode {episode.number}: {episode.title}
                  </h3>
                  <div className="flex items-center gap-1 text-gray-400 text-sm mt-2">
                    <FaRegCalendar size={14} />
                    <span>{formattedDate}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === "Related" && (
            <motion.div
              key="related"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4"
            >
              {relations.length === 0 ? (
                <div className="col-span-full text-center text-gray-400 py-4">
                  No related anime found
                </div>
              ) : (
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
                  .map((entry, idx) => {
                    const imageUrl =
                      entry.images?.jpg?.image_url || "/placeholder.jpg";
                    return (
                      <AnimatedItem
                        key={`${entry.relationType}-${entry.mal_id}`}
                        index={idx}
                      >
                        <NavButton
                          href={`/${entry.type}/${entry.mal_id}`}
                          className="relative group"
                        >
                          <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-700">
                            <img
                              src={imageUrl}
                              alt={entry.name}
                              className="object-cover w-full h-full"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.jpg";
                              }}
                            />
                            {entry.score && (
                              <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded z-10">
                                <span className="text-sm font-semibold">
                                  ★ {entry.score.toFixed(1)}
                                </span>
                              </div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                              <h3 className="text-white font-semibold xl:text-base truncate">
                                {entry.name}
                              </h3>
                              <p className="text-purple-300 text-sm mt-1">
                                {capitalizeFirstLetter(entry.relationType)}
                              </p>
                            </div>
                          </div>
                        </NavButton>
                      </AnimatedItem>
                    );
                  })
              )}
            </motion.div>
          )}

          {activeTab === "Characters" && (
            <motion.div
              key="characters"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-6"
            >
              {characters.slice(0, charactersToShow).map((character, idx) => (
                <AnimatedItem key={character.mal_id} index={idx}>
                  <CharacterCard
                    image={character.image}
                    name={character.name}
                    role={character.role}
                    voiceActor={character.voiceActor}
                  />
                </AnimatedItem>
              ))}
            </motion.div>
          )}

          {activeTab === "Voice Actors" && (
            <motion.div
              key="voiceactors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-6"
            >
              {voiceActors.slice(0, voiceActorsToShow).map((va, idx) => {
                const roleType = va.role?.toLowerCase();
                return (
                  <AnimatedItem key={va.id} index={idx}>
                    <div className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors">
                      <NavButton
                        href="/va-detail"
                        className="relative aspect-square"
                      >
                        <img
                          src={va.image}
                          alt={va.name}
                          className="w-full h-70 object-cover"
                          onError={(e) => {
                            e.target.src = "/placeholder-va.jpg";
                          }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2">
                          <h3 className="text-white font-medium truncate text-sm">
                            {va.name}
                          </h3>
                        </div>
                        <div
                          className={`absolute top-0 right-0 m-2 px-2 py-1 rounded ${
                            roleType === "main"
                              ? "bg-green-500"
                              : "bg-yellow-500"
                          }`}
                        >
                          <span className="text-white text-xs font-medium">
                            as {va.character}
                          </span>
                        </div>
                      </NavButton>
                    </div>
                  </AnimatedItem>
                );
              })}
            </motion.div>
          )}

          {activeTab === "Staff" && (
            <motion.div
              key="staff"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-6"
            >
              {staff.slice(0, staffToShow).map((member, idx) => (
                <AnimatedItem key={member.mal_id} index={idx}>
                  <div className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors">
                    <div className="relative aspect-square">
                      <img
                        src={
                          member.images?.jpg?.image_url ||
                          "/placeholder-staff.jpg"
                        }
                        alt={member.name}
                        className="w-full h-70 object-cover"
                        onError={(e) => {
                          e.target.src = "/placeholder-staff.jpg";
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2">
                        <h3 className="text-white font-medium truncate text-sm">
                          {member.name}
                        </h3>
                      </div>
                      <div className="absolute top-0 right-0 m-2 px-2 py-1 rounded bg-orange-500">
                        <span className="text-white text-xs font-medium">
                          {member.positions?.[0] || "Staff"}
                        </span>
                      </div>
                    </div>
                  </div>
                </AnimatedItem>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {shouldShowButton() && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center mt-6"
          >
            <button
              onClick={handleShowMore}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {showMoreButtonText()}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ContentTabs;

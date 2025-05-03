"use client";

import { useState, useEffect } from "react";
import CharacterCard from "@/app/components/AnimeDetails/Character";
import { FaRegCalendar } from "react-icons/fa";

const ContentTabs = ({ episodes, characters, staff }) => {
  const [activeTab, setActiveTab] = useState("Episodes");
  const [episodesToShow, setEpisodesToShow] = useState(12);
  const [charactersToShow, setCharactersToShow] = useState(12);
  const [voiceActorsToShow, setVoiceActorsToShow] = useState(12);
  const [staffToShow, setStaffToShow] = useState(12);
  const [showAll, setShowAll] = useState(false);

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
      default:
        return false;
    }
  };

  return (
    <div className="relative z-10 bg-black py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {["Episodes", "Characters", "Voice Actors", "Staff"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab
                  ? "bg-purple-600 text-lg font-semibold text-white"
                  : "g-gray-800/10 font-semibold hover:text-white text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
          <div className="h-px   bg-purple-400 w-full mt-1"></div>
        </div>

        {activeTab === "Episodes" && (
          <div className="grid  grid-cols-1 md:grid-cols-3 gap-4">
            {episodes.slice(0, episodesToShow).map((episode) => {
              const formattedDate = episode.aired
                ? new Date(episode.aired).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "-";

              return (
                <div
                  key={episode.mal_id}
                  className="bg-gray-800 p-4 rounded-lg flex flex-col justify-between"
                >
                  <h3 className="text-white font-medium">
                    Episode {episode.number}: {episode.title}
                  </h3>
                  <div className="flex items-center gap-1 text-gray-400 text-sm mt-2">
                    <FaRegCalendar size={14} />
                    <span>{formattedDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "Characters" && (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            {characters.slice(0, charactersToShow).map((character) => (
              <CharacterCard
                key={character.mal_id}
                image={character.image}
                name={character.name}
                role={character.role}
                voiceActor={character.voiceActor}
              />
            ))}
          </div>
        )}

        {activeTab === "Voice Actors" && (
          <div className="grid  grid-cols-3 md:grid-cols-6 gap-6">
            {voiceActors.slice(0, voiceActorsToShow).map((va) => {
              const roleType = va.role?.toLowerCase();

              return (
                <div
                  key={va.id}
                  className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors"
                >
                  <div className="relative aspect-square">
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
                        roleType === "main" ? "bg-green-500" : "bg-yellow-500"
                      }`}
                    >
                      <span className="text-white text-xs font-medium">
                        as {va.character}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "Staff" && (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            {staff.slice(0, staffToShow).map((member) => (
              <div
                key={member.mal_id}
                className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors"
              >
                <div className="relative aspect-square">
                  <img
                    src={
                      member.images?.jpg?.image_url || "/placeholder-staff.jpg"
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
            ))}
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
  );
};

export default ContentTabs;

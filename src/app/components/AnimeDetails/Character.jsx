"use client";

import { useState, useEffect } from "react";

const CharacterCard = ({ image, name, role, voiceActor }) => {
  const [imgSrc, setImgSrc] = useState(image);
  const roleType = role?.toLowerCase();

  useEffect(() => {
    setImgSrc(image);
  }, [image]);

  return (
    <div className="bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-600 transition-colors shadow-lg relative h-full">
      <div className="relative aspect-square">
        <img
          src={imgSrc}
          alt={name}
          className="w-full h-70 object-cover"
          onError={() => setImgSrc("/placeholder-character.jpg")}
        />

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2">
          <h3 className="text-white font-medium truncate text-sm">{name}</h3>
        </div>

        <div
          className={`absolute top-0 right-0 m-2 px-2 py-1 rounded ${
            roleType === "main" ? "bg-green-500" : "bg-yellow-500"
          }`}
        >
          <span className="text-white text-xs font-medium capitalize">
            {role}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;

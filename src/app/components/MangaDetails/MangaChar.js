"use client";
import { useState, useEffect } from "react";

const CharacterCard = ({ image, name, role }) => {
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
          alt={name || "Character image"}
          width="200"
          height="300"
          loading="lazy"
          decoding="async"
          className="w-full h-[300px] md:h-75 object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder-character.jpg";
          }}
        />

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2">
          <h3 className="text-white font-medium truncate xl:text-sm">{name}</h3>
        </div>

        {roleType && (
          <div
            className={`absolute top-0 right-0 m-2 px-2 py-1 rounded ${
              roleType === "main" ? "bg-green-500" : "bg-yellow-500"
            }`}
          >
            <span className="text-white text-xs font-medium capitalize">
              {roleType}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterCard;

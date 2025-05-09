"use client";
import { useState } from "react";

export default function StreamModal({ streamingData, title }) {
  const [showModal, setShowModal] = useState(false);

  const getLogo = (name) => {
    const logos = {
      Crunchyroll: "/logos/crunchyroll.png",
      Netflix: "/logos/netflix.png",
      "Bilibili Global": "/logos/bilibili.png",
      "Disney Plus": "/logos/disneyplus.png",
      Hulu: "/logos/hu  lu.png",
      "Amazon Prime Video": "/logos/amazonprime.png",
      iQIYI: "/logos/iqiyi.png",
      "Muse Asia": "/logos/museasia.png",
      CatchPlay: "/logos/catchplay.png",
      "Aniplus TV": "/logos/aniplustv.jpg",
      "Bahamut Anime Crazy": "/logos/anigamer.jpeg",
      MeWatch: "/logos/mewatch.png",
      "Tubi TV": "/logos/tubitv.jpeg",
      "Aniplus Asia": "/logos/aniplusasia.png",
    };
    return logos[name] || "/logos/default.png";
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-purple-600 xl:text-base md:text-xs select-none hover:bg-purple-700 text-white font-bold py-2 px-4 rounded w-full "
      >
        Watch Episode
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-70 flex md:-top-10 -top-299 items-center md:justify-center z-50">
          <div className="bg-black/85 p-6 rounded-lg max-w-md w-full relative text-white">
            <h2 className="text-xl select-none mb-2 font-bold ">
              Choose a Streaming Platform to Watch
            </h2>
            <h3 className="mb-2 font-semibold">{title}</h3>
            <div className="border-t border-purple-700 w-full mb-2"></div>
            <div className="grid grid-cols-2 max-h-80 overflow-y-auto">
              {streamingData.length > 0 ? (
                streamingData.map((platform, index) => (
                  <a
                    key={index}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded hover:bg-purple-900 transition-all"
                  >
                    <img
                      src={getLogo(platform.name)}
                      alt={platform.name}
                      className="w-8 h-8 select-none object-contain"
                    />
                    <span>{platform.name}</span>
                  </a>
                ))
              ) : (
                <p className="text-gray-400">No Streaming Platfrom Available</p>
              )}
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-0 right-3 text-gray-400 hover:text-white text-3xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  );
}

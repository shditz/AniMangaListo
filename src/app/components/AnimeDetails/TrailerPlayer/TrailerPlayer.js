"use client";

import { useState } from "react";

export default function TrailerPlayer({ youtubeId }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="w-full md:w-[450px] p-4">
      {youtubeId ? (
        <>
          <div className="relative aspect-video group">
            <img
              src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
              alt="Trailer Thumbnail"
              className="w-full h-full object-cover rounded-lg"
            />

            <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity group-hover:bg-black/40">
              <button
                onClick={() => setIsPlaying(true)}
                className="p-2 rounded-full bg-red-500/90 hover:bg-red-600 transition-all transform hover:scale-110"
              >
                <svg
                  className="w-10 h-10 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>

              <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-br-lg rounded-tl-lg text-sm font-bold">
                TRAILER
              </div>
            </div>
          </div>

          {isPlaying && (
            <div className="fixed inset-0 mt-10 bg-black/60 z-50 flex items-center justify-center">
              <div className="relative w-full h-[590px] max-w-[1050px]">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                  title="Trailer Anime"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full aspect-video  rounded-lg"
                />

                <button
                  onClick={() => setIsPlaying(false)}
                  className="absolute -top-12 right-0 bg-black text-white px-1 py-1 rounded-full hover:bg-purple-700 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="aspect-video w-full bg-gray-700 flex items-center justify-center rounded-lg">
          <p className="text-gray-400">Not Trailers Available</p>
        </div>
      )}
    </div>
  );
}

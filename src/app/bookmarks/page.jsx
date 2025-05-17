//app/bookmarks

"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

export default function BookmarkPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMalId, setSelectedMalId] = useState(null);
  const [selectedAnimeTitle, setSelectedAnimeTitle] = useState("");

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const res = await fetch("/api/bookmark");
      if (!res.ok) throw new Error("Failed to fetch bookmarks");
      const data = await res.json();
      setBookmarks(data);
    } catch (error) {
      console.error("Fetch bookmarks error:", error);
    }
  };

  const handleDeleteClick = (malId, title) => {
    setSelectedMalId(malId);
    setSelectedAnimeTitle(title);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await fetch(`/api/bookmark?malId=${selectedMalId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setBookmarks((prev) =>
          prev.filter((anime) => anime.malId !== selectedMalId)
        );
      }
    } catch (error) {
      console.error("Delete bookmark error:", error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 text-white px-6 py-10 relative">
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-950 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Delete Bookmark</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete{" "}
              <span className="text-purple-400">{selectedAnimeTitle}</span> from
              your bookmarks?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 rounded-lg bg-purple-900 hover:bg-purple-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-900 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rest of the content */}
      <div className="flex justify-between mt-8 items-center mb-8">
        <h1 className="text-3xl font-bold">My Bookmarks</h1>
        <Link
          href="/users/dashboard"
          className="bg-purple-600 select-none hover:bg-purple-700 px-4 py-2 rounded-lg"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {bookmarks.length > 0 ? (
          <AnimatePresence>
            {bookmarks.map((anime) => (
              <motion.div
                key={anime.malId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.03 }}
                className="group relative overflow-hidden rounded-lg aspect-[2/3]"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(anime.malId, anime.title);
                  }}
                  className="absolute top-2 left-2 p-1.5 bg-purple-600/90 hover:bg-purple-700 rounded-full z-10"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>

                <img
                  src={anime.image}
                  alt={anime.title}
                  className="w-full select-none h-full object-cover"
                />
                <div className="absolute select-none inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 flex flex-col justify-end">
                  <h3 className="font-medium text-sm line-clamp-2">
                    {anime.title}
                  </h3>
                </div>
                <div className="absolute top-2 right-2 flex gap-2">
                  <div className="font-normal bg-yellow-500 text-white text-xs xl:text-base px-2 py-1 rounded">
                    ★{anime.score !== null ? anime.score.toFixed(1) : "N/A"}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-4 text-center flex justify-center items-center text-gray-400"
          >
            No bookmarks available.
          </motion.p>
        )}
      </div>
    </div>
  );
}

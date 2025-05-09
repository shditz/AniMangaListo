"use client";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const InputSearch = ({ isMobile = false, handleNavigation }) => {
  const searchRef = useRef();
  const containerRef = useRef();
  const router = useRouter();
  const [showInput, setShowInput] = useState(false);

  const handleSearch = (event) => {
    event.preventDefault();
    const keyword = searchRef.current.value.trim();
    if (keyword !== "") {
      const url = `/search/${encodeURIComponent(keyword)}?type=anime`;

      // Reset input setelah pencarian
      if (searchRef.current) searchRef.current.value = "";

      if (isMobile) setShowInput(false);

      if (typeof handleNavigation === "function") {
        handleNavigation(url);
      } else {
        router.push(url);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch(e);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        if (isMobile) {
          setShowInput(false); // Tutup input mobile
        } else {
          if (searchRef.current) {
            searchRef.current.value = ""; // Kosongkan input desktop
          }
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile]);

  return (
    <>
      {isMobile ? (
        <div className="flex justify-center mt-2 xl:hidden" ref={containerRef}>
          {!showInput && (
            <button
              onClick={() => setShowInput(true)}
              className="text-purple-300 p-2"
              aria-label="Open search"
            >
              <FaSearch className="w-5 h-5" />
            </button>
          )}

          <AnimatePresence>
            {showInput && (
              <motion.form
                onSubmit={handleSearch}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="relative w-3/4"
              >
                <input
                  type="text"
                  placeholder="Search..."
                  ref={searchRef}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className="px-10 py-2 w-full bg-gray-900/95 border border-purple-500 rounded-full text-purple-200 placeholder-purple-300 focus:outline-none focus:border-purple-600"
                />
                <button
                  type="submit"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  aria-label="Submit search"
                >
                  <FaSearch className="w-4 h-4 text-purple-300" />
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div
          className="hidden items-center relative group md:flex"
          ref={containerRef}
        >
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search..."
              ref={searchRef}
              onKeyDown={handleKeyDown}
              className="px-10 py-2 xl:px-12 xl:py-2 bg-transparent border border-purple-400 rounded-full focus:outline-none focus:border-purple-600 group-hover:border-purple-600 transition duration-300 text-sm xl:text-base md:w-50 xl:w-64 text-purple-200 placeholder-purple-300"
            />
            <button
              type="submit"
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
            >
              <FaSearch className="w-4 h-4 md:w-5 md:h-5 text-purple-300 transition duration-300 group-hover:text-purple-600" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default InputSearch;

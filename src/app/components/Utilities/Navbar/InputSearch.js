"use client";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { FaSearch } from "react-icons/fa";

const InputSearch = ({ isMobile = false }) => {
  const searchRef = useRef();
  const router = useRouter();

  const handleSearch = (event) => {
    event.preventDefault();
    const keyword = searchRef.current.value.trim();
    if (keyword !== "") {
      router.push(`/search/${encodeURIComponent(keyword)}?type=anime`);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch(event);
    }
  };

  if (isMobile) {
    return (
      <div className="flex justify-center mt-2 md:hidden">
        <form onSubmit={handleSearch} className="relative w-3/4">
          <input
            type="text"
            placeholder="Search..."
            ref={searchRef}
            onKeyDown={handleKeyDown}
            className="px-10 py-2 w-full bg-gray-900/95 border border-purple-500 rounded-full text-purple-200 placeholder-purple-300 focus:outline-none focus:border-purple-600"
          />
          <button
            type="submit"
            className="absolute left-3 top-1/2 transform -translate-y-1/2"
          >
            <FaSearch className="w-4 h-4 text-purple-300" />
          </button>
        </form>
      </div>
    );
  } else {
    return (
      <div className="hidden items-center relative group md:flex">
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
    );
  }
};

export default InputSearch;

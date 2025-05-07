import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion, useInView, AnimatePresence } from "framer-motion";

const AnimeItem = ({ item, type, index }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "0px 0px -80px 0px",
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.4,
        delay: index * 0.02,
        ease: "easeOut",
      }}
    >
      <Link href={`/${type}/${item.mal_id}`}>
        <div className="w-full relative h-[250px] xl:h-[350px] overflow-hidden group cursor-pointer">
          <Image
            src={
              type === "anime"
                ? item.images.jpg.large_image_url
                : item.images.jpg.image_url
            }
            alt={item.title}
            width={500}
            height={500}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
            <h3 className="text-white text-base md:text-lg font-normal truncate">
              {item.title}
            </h3>
          </div>
          <div className="absolute bg-yellow-500 top-2 right-2 text-white text-sm md:text-base px-2 py-1 rounded flex items-center gap-1">
            <span>★</span>
            <span>{item.score ? item.score.toFixed(2) : "N/A"}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const SearchResults = ({ data, type }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const scrollTargetRef = React.useRef(null);

  useEffect(() => {
    scrollTargetRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentPage, type]);

  useEffect(() => {
    setCurrentPage(1);
  }, [type]);

  const uniqueData = Array.from(
    new Map(data.map((item) => [item.mal_id, item])).values()
  );

  const totalPages = Math.ceil(uniqueData.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = uniqueData.slice(indexOfFirstItem, indexOfLastItem);

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 2; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="container mx-auto">
      <div ref={scrollTargetRef} className="absolute top-0" />

      <AnimatePresence mode="wait">
        {data && currentItems.length > 0 && (
          <motion.div
            key={`${type}-${currentPage}-loaded`}
            className="grid md:grid-cols-5 grid-cols-2 gap-2 md:gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentItems.map((item, index) => (
              <AnimeItem
                key={item.mal_id}
                item={item}
                type={type}
                index={index}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-2">
          <motion.button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`w-10 h-10 flex items-center justify-center border border-purple-900/80 rounded-lg transition ${
              currentPage === 1
                ? "text-gray-300 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
            aria-label="Go to previous page"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <FaArrowLeft />
          </motion.button>

          {getPageNumbers().map((pageNumber, index) =>
            pageNumber === "..." ? (
              <span key={index} className="mx-1 text-white">
                ...
              </span>
            ) : (
              <motion.button
                key={index}
                onClick={() => goToPage(pageNumber)}
                className={`w-10 h-10 flex items-center border border-purple-900/80 justify-center rounded-lg mx-1 transition ${
                  currentPage === pageNumber
                    ? "bg-purple-500 text-white font-bold"
                    : "text-white hover:bg-purple-600"
                }`}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {pageNumber}
              </motion.button>
            )
          )}

          <motion.button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`w-10 h-10 flex items-center justify-center border border-purple-900/80 rounded-lg transition ${
              currentPage === totalPages
                ? "text-gray-300 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
            aria-label="Go to next page"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <FaArrowRight />
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;

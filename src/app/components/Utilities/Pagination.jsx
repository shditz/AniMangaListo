"use client";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useState, useEffect } from "react";

const Pagination = ({ page, lastPage, setPage }) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handlePageClick = (newPage) => {
    if (
      isButtonDisabled ||
      newPage === page ||
      newPage < 1 ||
      newPage > lastPage ||
      isNaN(newPage)
    )
      return;

    setIsButtonDisabled(true);
    setPage(newPage);

    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 1000);
  };

  const generatePages = () => {
    const pages = [];

    if (lastPage <= 5) {
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, "...", lastPage);
      } else if (page >= lastPage - 2) {
        pages.push(1, "...", lastPage - 2, lastPage - 1, lastPage);
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", lastPage);
      }
    }

    return pages;
  };

  return (
    <div className="flex justify-center items-center py-4 gap-2 text-white text-base">
      {page > 1 && (
        <button
          onClick={() => handlePageClick(page - 1)}
          className="bg-black border border-purple-600 p-2 rounded hover:bg-purple-600 transition disabled:opacity-50"
          disabled={isButtonDisabled}
        >
          <FaArrowLeft />
        </button>
      )}

      {generatePages().map((p, idx) => (
        <span key={idx}>
          {p === "..." ? (
            <span className="px-2">...</span>
          ) : (
            <button
              onClick={() => handlePageClick(p)}
              className={`px-3 py-1 rounded border border-purple-600 bg-black transition ${
                p === page ? "bg-purple-600" : "hover:bg-purple-600"
              } disabled:opacity-50`}
              disabled={isButtonDisabled}
            >
              {p}
            </button>
          )}
        </span>
      ))}

      {page < lastPage && (
        <button
          onClick={() => handlePageClick(page + 1)}
          className="bg-black border border-purple-600 p-2 rounded hover:bg-purple-600 transition disabled:opacity-50"
          disabled={isButtonDisabled}
        >
          <FaArrowRight />
        </button>
      )}
    </div>
  );
};

export default Pagination;

"use client";
import useSWR from "swr";
import React, { useState, useEffect, useMemo } from "react";
import { fetcher } from "@/app/lib/fetcher";
import Link from "next/link";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion, useInView } from "framer-motion";

const reviewCache = new Map();

const AnimeReviews = ({ animeId }) => {
  const [page, setPage] = useState(1);
  const [preloadedPages, setPreloadedPages] = useState(new Set([1]));

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    `https://api.jikan.moe/v4/anime/${animeId}/reviews?page=${page}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      dedupingInterval: 60000,
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        if (error.status === 404) return;
        if (retryCount >= 3) return;
        setTimeout(() => revalidate({ retryCount }), 5000);
      },
    }
  );

  const preloadNextPage = () => {
    const nextPage = page + 1;
    if (!preloadedPages.has(nextPage)) {
      const url = `https://api.jikan.moe/v4/anime/${animeId}/reviews?page=${nextPage}`;
      fetcher(url).then((data) => {
        reviewCache.set(url, data);
        setPreloadedPages((prev) => new Set([...prev, nextPage]));
      });
    }
  };

  const allReviews = data?.data || [];
  const hasMore = data?.pagination?.has_next_page;

  const reviewsToShow = useMemo(() => allReviews.slice(0, 8), [allReviews]);

  if (isLoading && !data) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-48 bg-gray-800/50 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) return <div className="text-red-500 py-4">Failed Load Review</div>;

  if (!allReviews.length) {
    return (
      <div className="relative z-10 text-white">
        <h2 className="text-2xl flex justify-center font-bold -mb-10">
          User Reviews
        </h2>
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="bg-black border-2 border-purple-900 backdrop-blur-sm rounded-xl p-6 text-center">
            <p className="text-gray-300 text-lg">Nobody Reviews This Anime</p>
          </div>
        </div>
      </div>
    );
  }

  const ReviewItem = React.memo(({ review, index }) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, {
      once: true,
      margin: "-100px",
    });

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{
          duration: 0.4,
          delay: index * 0.03,
          ease: "easeOut",
        }}
        className="bg-gray-900/50 border-2 border-purple-900 backdrop-blur-sm rounded-xl p-4"
      >
        <div className="flex items-start gap-3 mb-3">
          <Link
            href={review.user.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={review.user.images.jpg.image_url}
              alt={review.user.username}
              width="48"
              height="48"
              loading="lazy"
              decoding="async"
              className="rounded-full w-12 h-12 object-cover hover:ring-2 hover:ring-purple-500 transition-all"
            />
          </Link>
          <div className="flex-1">
            <Link
              href={review.user.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-purple-300 hover:text-purple-400 transition-colors"
            >
              {review.user.username}
            </Link>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">
                {new Date(review.date).toLocaleDateString()}
              </span>
              <span className="text-yellow-400">★ {review.score}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {review.tags.map((tag, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-purple-900/50 text-purple-300 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
          {review.is_spoiler && (
            <span className="px-2 py-1 bg-red-900/50 text-red-300 rounded-full text-xs">
              Spoiler
            </span>
          )}
          {review.is_preliminary && (
            <span className="px-2 py-1 bg-blue-900/50 text-blue-300 rounded-full text-xs">
              Preliminary
            </span>
          )}
        </div>

        <p className="text-gray-300 text-sm line-clamp-5 mb-3">
          {review.review}
        </p>

        <div className="mt-2 text-xs">
          <Link
            href={review.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:underline"
          >
            View full review
          </Link>
        </div>
      </motion.div>
    );
  });

  return (
    <div className="relative z-10 text-white">
      <h2 className="text-2xl flex justify-center font-bold mb-4">
        User Reviews
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {reviewsToShow.map((review, index) => (
          <ReviewItem key={review.mal_id} review={review} index={index} />
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1 || isValidating}
          className="w-10 h-10 flex items-center justify-center border border-purple-900/80 rounded-lg transition hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isValidating && page !== 1 ? (
            <div className="w-4 h-4 border-2 border-transparent border-t-purple-400 rounded-full animate-spin" />
          ) : (
            <FaArrowLeft />
          )}
        </button>

        <button
          onMouseEnter={preloadNextPage}
          onClick={() => setPage((prev) => (hasMore ? prev + 1 : prev))}
          disabled={!hasMore || isValidating}
          className="w-10 h-10 flex items-center justify-center border border-purple-900/80 rounded-lg transition hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isValidating ? (
            <div className="w-4 h-4 border-2 border-transparent border-t-purple-400 rounded-full animate-spin" />
          ) : (
            <FaArrowRight />
          )}
        </button>
      </div>
    </div>
  );
};

export default AnimeReviews;

"use client";

import { useState, useEffect, useRef } from "react";
import useSWRInfinite from "swr/infinite";
import MangaCard from "./MangaCard";
import SkeletonLoader from "../Genre/Skelloader";
import { fetchWithRetry } from "@/app/lib/jikan";

const PAGE_SIZE = 20;

export default function GenreMangaGrid({ genreIds, filters }) {
  const seenIdsRef = useRef(new Set());
  const [uniqueManga, setUniqueManga] = useState([]);

  const allowedType = ["manga", "oneshot"];

  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.data?.length) return null;

    const params = new URLSearchParams({
      genres: genreIds.join(","),
      limit: String(PAGE_SIZE),
      page: String(pageIndex + 1),
      order_by: "score",
      sort: filters.score ? "asc" : "desc",
      ...(filters.type && { type: filters.type }),
      ...(filters.status && { status: filters.status }),
      ...(filters.score && { min_score: filters.score }),
    });

    return `manga?${params.toString()}`;
  };

  const fetcher = async (endpoint) => {
    try {
      const data = await fetchWithRetry(endpoint);
      return data;
    } catch (error) {
      console.error("Error fetching manga grid data:", error);
      throw new Error(
        `Failed to load manga list for genre ${genreIds.join(", ")}`
      );
    }
  };

  const { data, error, size, setSize, isValidating } = useSWRInfinite(
    getKey,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      shouldRetryOnError: true,
    }
  );

  useEffect(() => {
    seenIdsRef.current = new Set();
    setUniqueManga([]);
  }, [genreIds, filters]);

  useEffect(() => {
    if (!data) return;

    const processed = data
      .flatMap((page) => page?.data || [])
      .filter((manga) => {
        if (!manga.type || !allowedType.includes(manga.type.toLowerCase()))
          return false;

        if (seenIdsRef.current.has(manga.mal_id)) return false;
        seenIdsRef.current.add(manga.mal_id);
        return true;
      });

    setUniqueManga((prev) => [...prev, ...processed]);
  }, [data]);

  const isLoadingInitial = !data && !error;
  const isEmpty = data?.[0]?.data?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.data?.length < PAGE_SIZE);

  return (
    <div>
      {isLoadingInitial && <SkeletonLoader />}

      {!isLoadingInitial && (
        <>
          <div className="grid grid-cols-2 xl:grid-cols-6 md:grid-cols-5 gap-3">
            {uniqueManga.length > 0 ? (
              uniqueManga.map((manga) => (
                <MangaCard key={manga.mal_id} manga={manga} />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-300">
                No Manga Found Matching Filters.
              </div>
            )}
          </div>

          {!isReachingEnd && !isEmpty && (
            <button
              onClick={() => setSize(size + 1)}
              disabled={isValidating}
              className="mt-6 mb-4 w-full py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            >
              {isValidating ? "Loading..." : "Load More"}
            </button>
          )}
        </>
      )}

      {error && (
        <div className="text-red-500 text-center mt-4">
          Failed Load Data... Try Again
        </div>
      )}
    </div>
  );
}

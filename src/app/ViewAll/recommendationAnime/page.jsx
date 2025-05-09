"use client";
import React, { useEffect, useState } from "react";
import HeaderMenu from "@/app/components/Utilities/HeaderMenu";
import Pagination from "@/app/components/Utilities/Pagination";
import PaginationRecomAnime from "@/app/components/ListPaginationAnime/recommendationanime";
import Loading from "@/app/Loading";

const ITEMS_PER_PAGE = 20;

const RecomAnimePage = () => {
  const [page, setPage] = useState(1);
  const [recomAnime, setRecomAnime] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/recommendations/anime`,
          { signal: controller.signal }
        );
        const data = await res.json();
        setRecomAnime(data);
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      } finally {
        setLoading(false);
        scrollTo({ top: 0, behavior: "smooth" });
      }
    };
    fetchData();
    return () => controller.abort();
  }, []);

  const totalItems = recomAnime?.data?.length || 0;
  const lastPage = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  return (
    <>
      <HeaderMenu title="Recommendation Anime" />

      <Pagination page={page} lastPage={lastPage} setPage={setPage} />

      {!loading && recomAnime?.data ? (
        <PaginationRecomAnime
          api={recomAnime}
          page={page}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      ) : (
        <div className="text-white text-center py-6">
          <Loading />
        </div>
      )}

      <Pagination page={page} lastPage={lastPage} setPage={setPage} />
    </>
  );
};

export default RecomAnimePage;

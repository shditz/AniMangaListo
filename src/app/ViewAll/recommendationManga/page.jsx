"use client";
import React, { useEffect, useState } from "react";
import HeaderMenu from "@/app/components/Utilities/HeaderMenu";
import Pagination from "@/app/components/Utilities/Pagination";
import PaginationRecomManga from "@/app/components/ListPaginationManga/PaginationRecomManga";
import Loading from "@/app/Loading";

const ITEMS_PER_PAGE = 20;

const RecomMangaPage = () => {
  const [page, setPage] = useState(1);
  const [recomManga, setRecomManga] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/recommendations/manga`,
          { signal: controller.signal }
        );
        const data = await res.json();
        setRecomManga(data);
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

  const totalItems = recomManga?.data?.length || 0;
  const lastPage = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  return (
    <>
      <HeaderMenu title="Recommendation Manga" />

      <Pagination page={page} lastPage={lastPage} setPage={setPage} />

      {!loading && recomManga?.data ? (
        <PaginationRecomManga
          api={recomManga}
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

export default RecomMangaPage;

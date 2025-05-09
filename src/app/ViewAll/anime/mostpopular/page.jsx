"use client";
import React, { useEffect, useState } from "react";
import HeaderMenu from "@/app/components/Utilities/HeaderMenu";
import Pagination from "@/app/components/Utilities/Pagination";
import ListPaginationAnime from "@/app/components/ListPaginationAnime";
import Loading from "@/app/Loading";

const Page = () => {
  const [page, setPage] = useState(1);
  const [mostpopular, setmostpopular] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async (currentPage) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/top/anime?filter=bypopularity&page=${currentPage}`
      );
      const data = await response.json();
      setmostpopular(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);

      scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (!page || isNaN(page)) return;
    fetchData(page);
  }, [page]);

  const lastPage = mostpopular?.pagination?.last_visible_page || 1;

  return (
    <>
      <HeaderMenu title="Most Popular Anime" />

      <Pagination page={page} lastPage={lastPage} setPage={setPage} />

      {!loading && mostpopular?.data ? (
        <ListPaginationAnime api={mostpopular} />
      ) : (
        <div className="text-white text-center py-6">
          <Loading />
        </div>
      )}

      <Pagination page={page} lastPage={lastPage} setPage={setPage} />
    </>
  );
};

export default Page;

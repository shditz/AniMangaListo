"use client";
import React, { useEffect, useState } from "react";
import HeaderMenu from "@/app/components/Utilities/HeaderMenu";
import Pagination from "@/app/components/Utilities/Pagination";
import RecentEpsAnime from "@/app/components/ListPaginationAnime/RecentEpsAnime";
import Loading from "@/app/Loading";

const Page = () => {
  const [page, setPage] = useState(1);
  const [recentepisode, setrecentepisode] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async (currentPage) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/watch/episodes?page=${currentPage}`
      );
      const data = await response.json();
      setrecentepisode(data);
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

  const lastPage = recentepisode?.pagination?.last_visible_page || 1;

  return (
    <>
      <HeaderMenu title="Latest Update Anime" />

      <Pagination page={page} lastPage={lastPage} setPage={setPage} />

      {!loading && recentepisode?.data ? (
        <RecentEpsAnime api={recentepisode} />
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

"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import AnimeSearch from "@/app/components/Anime/AnimeSearch";
import MangaSearch from "@/app/components/Manga/MangaSearch";
import Link from "next/link";
import Header3 from "@/app/components/Header3";
import Loading from "@/app/Loading";

export default function Page({ params }) {
  const { keyword } = React.use(params);
  const decodedKeyword = decodeURIComponent(keyword);
  const searchParams = useSearchParams();
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const type = searchParams.get("type") || "anime";

  React.useEffect(() => {
    const fetchData = async () => {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${type}?q=${keyword}`;
      const response = await fetch(apiUrl);
      const result = await response.json();
      setData(result);
      setLoading(false);
    };
    fetchData();
  }, [type, keyword]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="overflow-x-hidden select-none md:pt-12 pt-16">
      <section className="p-4 mb-6">
        <div className="flex justify-center">
          <Header3 title={`Search Result for "${decodedKeyword}"`} />
        </div>
        <div className="flex gap-6 mb-4 border-b border-purple-500 w-full justify-center">
          <Link
            href={`/search/${encodeURIComponent(decodedKeyword)}?type=anime`}
            className={`px-4 py-2 rounded-t-lg ${
              type === "anime"
                ? "bg-purple-600 md:text-base xl:text-lg font-semibold text-white"
                : "bg-gray-800/10 md:text-sm xl:text-base font-semibold hover:text-white text-gray-300"
            }`}
          >
            Anime
          </Link>
          <Link
            href={`/search/${encodeURIComponent(decodedKeyword)}?type=manga`}
            className={`px-4 py-2 rounded-t-lg ${
              type === "manga"
                ? "bg-purple-600 md:text-base xl:text-lg font-semibold text-white"
                : "bg-gray-800/10 md:text-sm xl:text-base font-semibold hover:text-white text-gray-300"
            }`}
          >
            Manga
          </Link>
        </div>
        {type === "anime" ? (
          <AnimeSearch api={data} />
        ) : (
          <MangaSearch api={data} />
        )}
      </section>
    </div>
  );
}

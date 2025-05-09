"use client";

import { useState } from "react";

export default function GenreFilterBar({ filters, onFilterChange }) {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  return (
    <div className="flex flex-wrap justify-center gap-3 mt-4 mb-6">
      <select
        name="type"
        onChange={handleFilterChange}
        className="p-1.5 text-xs md:text-sm border border-purple-600 rounded bg-black dark:bg-black"
        defaultValue=""
      >
        <option value="">All Types</option>
        <option value="tv">TV</option>
        <option value="movie">Movie</option>
        <option value="ova">OVA</option>
        <option value="special">Special</option>
      </select>

      <select
        name="status"
        onChange={handleFilterChange}
        className="p-1.5 text-xs md:text-sm border border-purple-600 rounded bg-black dark:bg-black "
        defaultValue=""
      >
        <option value="">All Status</option>
        <option value="airing">Airing</option>
        <option value="complete">Completed</option>
        <option value="upcoming">Upcoming</option>
      </select>

      <select
        name="score"
        onChange={handleFilterChange}
        className="p-1.5 text-xs md:text-sm border border-purple-600 rounded bg-black dark:bg-black"
        defaultValue=""
      >
        <option value="">Min. Score</option>
        <option value="7">7.0+</option>
        <option value="8">8.0+</option>
        <option value="9">9.0+</option>
      </select>

      <select
        name="rating"
        onChange={handleFilterChange}
        className="p-1.5 text-xs md:text-sm border border-purple-600 rounded bg-black dark:bg-black"
        defaultValue=""
      >
        <option value="">All Ages</option>
        <option value="g">All Ages (G)</option>
        <option value="pg">Children (PG)</option>
        <option value="pg_13">Teens 13+ (PG-13)</option>
        <option value="r">Violence (R)</option>
        <option value="r_plus">Mild Nudity (R+)</option>
        <option value="rx">Explicit (RX)</option>
      </select>
    </div>
  );
}

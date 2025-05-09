"use client";

export default function GenreFilterManga({ filters, onFilterChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value !== "" ? value : null });
  };

  return (
    <div className="flex flex-wrap justify-center gap-3 rounded-lg shadow-md">
      <select
        name="type"
        onChange={handleChange}
        className="p-1.5 text-xs md:text-sm border border-purple-600 rounded bg-black dark:bg-black"
        defaultValue=""
      >
        <option value="">All Types</option>
        <option value="manga">Manga</option>
        <option value="oneshot">One-shot</option>
      </select>

      <select
        name="status"
        onChange={handleChange}
        className="p-1.5 text-xs md:text-sm border border-purple-600 rounded bg-black dark:bg-black"
        defaultValue=""
      >
        <option value="">All Status</option>
        <option value="publishing">Publishing</option>
        <option value="complete">Completed</option>
        <option value="hiatus">Hiatus</option>
        <option value="discontinued">Discontinued</option>
      </select>

      <select
        name="score"
        onChange={handleChange}
        className="p-1.5 text-xs md:text-sm border border-purple-600 rounded bg-black dark:bg-black"
        defaultValue=""
      >
        <option value="">Min Score</option>
        <option value="7">7+</option>
        <option value="8">8+</option>
        <option value="9">9+</option>
      </select>

      <select
        name="rating"
        onChange={handleChange}
        className="p-1.5 text-xs md:text-sm border border-purple-600 rounded bg-black dark:bg-black"
        defaultValue=""
      >
        <option value="">All Ratings</option>
        <option value="g">All Ages</option>
        <option value="pg">Teen</option>
        <option value="pg13">Teen 13+</option>
        <option value="r17">Mature 17+</option>
        <option value="r18">Explicit 18+</option>
      </select>
    </div>
  );
}

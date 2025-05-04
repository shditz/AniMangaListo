async function getAnimeList() {
  const res = await fetch("https://api.jikan.moe/v4/seasons/now");
  const data = await res.json();
  return data.data;
}

function isValidDate(dateString) {
  const date = new Date(dateString);
  return dateString && date.toString() !== "Invalid Date" ? date : new Date();
}

export default async function sitemap() {
  const baseUrl = "https://animangalisto.vercel.app";
  const animeList = await getAnimeList();

  const animeEntries = animeList.map((anime) => ({
    url: `${baseUrl}/anime/${anime.mal_id}`,
    lastModified: isValidDate(anime.updated_at),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/anime`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...animeEntries,
  ];
}

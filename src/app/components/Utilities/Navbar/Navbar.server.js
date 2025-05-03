// app/components/Navbar.server.jsx
import NavbarClient from "./Navbar.client";

export const revalidate = 3600;

const STATIC_LINKS = {
  anime: [
    { href: "/seasonal", text: "Seasonal Anime" },
    { href: "/top-anime", text: "Top Anime" },
    { href: "/top-movies", text: "Top Movie" },
    { href: "/top-airing", text: "Top Airing" },
    { href: "/top-Upcoming", text: "Top Upcoming" },
    { href: "/most-popular", text: "Most Popular" },
    { href: "/most-Favorited", text: "Most Favorited" },
    { href: "/recommendation-anime", text: "Recommendation Anime" },
  ],
  manga: [
    { href: "/top-manga", text: "Top Manga" },
    { href: "/top-publishing", text: "Top Publishing" },
    { href: "/top-upcoming", text: "Top Upcoming" },
    { href: "/most-popular", text: "Most Popular" },
    { href: "/most-favorited", text: "Most Favorited" },
    { href: "/recommendations/manga", text: "Recommendations" },
  ],
  staticLinks: [
    { href: "/genres", text: "Genre" },
    { href: "/bookmark", text: "Bookmark" },
  ],
};

const NavbarServer = () => {
  return <NavbarClient dropdownLinks={STATIC_LINKS} />;
};

export default NavbarServer;

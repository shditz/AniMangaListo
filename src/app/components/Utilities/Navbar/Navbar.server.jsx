import NavbarClient from "./Navbar.client";
import UserActionServer from "./UserActionserver";
import { getServerSession } from "next-auth";

export const revalidate = 3600;

const STATIC_LINKS = {
  anime: [
    { href: "/ViewAll/anime/seasonalanime", text: "Seasonal Anime" },
    { href: "/ViewAll/anime/topanime", text: "Top Anime" },
    { href: "/ViewAll/anime/topmovie", text: "Top Movie" },
    { href: "/ViewAll/anime/airinganime", text: "Top Airing" },
    { href: "/ViewAll/anime/topupcoming", text: "Top Upcoming" },
    { href: "/ViewAll/anime/mostpopular", text: "Most Popular" },
    { href: "/ViewAll/anime/mostfavorited", text: "Most Favorited" },
    { href: "/ViewAll/recommendationAnime", text: "Recommendations Anime" },
  ],
  manga: [
    { href: "/ViewAll/manga/topmanga", text: "Top Manga" },
    { href: "/ViewAll/manga/toppublishing", text: "Top Publishing" },
    { href: "/ViewAll/manga/topupcoming", text: "Top Upcoming" },
    { href: "/ViewAll/manga/mostpopular", text: "Most Popular" },
    { href: "/ViewAll/manga/mostfavorited", text: "Most Favorited" },
    { href: "/ViewAll/recommendationManga", text: "Recommendations Manga" },
  ],
  staticLinks: [
    { href: "/genres", text: "Genre" },
    { href: "/bookmark", text: "Bookmark" },
  ],
};

const NavbarServer = async () => {
  const session = await getServerSession();
  return (
    <NavbarClient
      dropdownLinks={STATIC_LINKS}
      userAction={<UserActionServer />}
    />
  );
};

export default NavbarServer;

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavbarServer from "./components/Utilities/Navbar/Navbar.server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AniMangaListo",
  description:
    "AniMangaListo is a comprehensive online platform tailored for anime enthusiasts of all levels — from newcomers exploring the world of Japanese animation to seasoned fans seeking their next favorite series. Our curated database features a wide variety of anime across multiple genres, including action, adventure, romance, fantasy, and slice of life, each accompanied by detailed descriptions, episode counts, user ratings, and personalized recommendations. Designed with a clean, intuitive interface and powerful search functionality, AniMangaListo enables users to effortlessly discover titles that align with their preferences and current mood. Enhance your viewing experience with our watchlist feature , which allows you to bookmark anime for future viewing — making it easier than ever to organize and track your anime journey. Whether you're looking for the latest seasonal releases or timeless classics, Anime List serves as your ultimate guide to navigating the vast and captivating world of anime.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <div>
          <NavbarServer />
        </div>
        {children}
      </body>
    </html>
  );
}

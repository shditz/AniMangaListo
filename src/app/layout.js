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
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" sizes="16x16" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/icon192x192.png"
        />
        <link rel="apple-touch-icon" href="/appleicon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5769271179468087"
          crossOrigin="anonymous"
        ></script>
      </head>
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

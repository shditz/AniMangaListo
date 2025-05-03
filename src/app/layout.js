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
  description: "Website List Anime Terlengkap",
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

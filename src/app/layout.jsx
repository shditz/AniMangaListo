import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavbarServer from "./components/Utilities/Navbar/Navbar.server";
import Script from "next/script";
import SessionProviderWrapper from "./SessionProviderWrapper";

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
    "AniMangaListo is a comprehensive online platform tailored for anime enthusiasts...",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js "
          data-cbid="d7aad07b-ee74-463b-b126-22f2ad15f86d"
          type="text/javascript"
          async
        ></script>
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
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-5WVEKNN1TJ "
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-5WVEKNN1TJ');
          `}
        </Script>

        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5769271179468087 "
          crossOrigin="anonymous"
        ></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <SessionProviderWrapper>
          <div>
            <NavbarServer />
          </div>
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}

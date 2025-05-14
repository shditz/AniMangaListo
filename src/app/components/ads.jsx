// components/AdsenseAd.jsx
import Script from "next/script";

export default function AdsenseAd() {
  return (
    <>
      {/* Load script sekali saja (bisa dipindah ke _app.js jika digunakan di banyak halaman) */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5769271179468087 "
        crossorigin="anonymous"
        strategy="afterInteractive"
      />

      {/* Iklan unit */}
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-format="fluid"
        data-ad-layout-key="-gw-3+1f-3d+2z"
        data-ad-client="ca-pub-5769271179468087"
        data-ad-slot="3849701972"
      ></ins>

      {/* Jalankan adsbygoogle.push setelah DOM tersedia */}
      <Script id="adsbygoogle-init" strategy="lazyOnload">
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </Script>
    </>
  );
}

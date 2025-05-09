import "../styles/globals.css";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((reg) => console.log("Service Worker Registered", reg))
        .catch((err) => console.error("SW Registration Failed", err));
    }
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;

// pages/_app.js
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((reg) => console.log("Service Worker Registered", reg))
        .catch((err) => console.log("SW registration failed: ", err));
    }
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;

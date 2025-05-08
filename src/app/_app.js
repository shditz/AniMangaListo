// pages/_app.js
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

// Tambahkan kode ini di luar fungsi MyApp
if (typeof window !== "undefined") {
  window.addEventListener("load", () => {
    const installBtn = document.getElementById("install-btn");

    let deferredPrompt;

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      installBtn.style.display = "block";
    });

    installBtn.addEventListener("click", async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      installBtn.style.display = "none";
      deferredPrompt = null;
      console.log("User choice:", outcome);
    });
  });
}

export default MyApp;

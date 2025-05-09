import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const timer = setTimeout(() => {
      const splash = document.querySelector(".splash");
      const main = document.querySelector(".main-content");

      if (splash && main) {
        splash.style.display = "none";
        main.style.display = "block";
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="splash">
        <div className="loader-container">
          <div className="logo">AmL</div>
          <div className="app-name">AniMangaListo</div>
          <div className="spinner"></div>
        </div>
      </div>

      <div className="main-content" style={{ display: "none" }}>
        <h1>Welcome to AniMangaListo!</h1>
        <p>Find your favorite anime and manga here.</p>
      </div>

      <style jsx>{`
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          background-color: #000;
        }

        .splash {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }

        .loader-container {
          text-align: center;
          color: white;
        }

        .logo {
          font-size: 4rem;
          color: #800080;
          animation: fadeInOut 2s infinite alternate;
        }

        .app-name {
          margin-top: 20px;
          color: #800080;
          font-size: 1.5rem;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top: 4px solid #800080;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 20px auto;
        }

        @keyframes fadeInOut {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .main-content {
          display: none;
          padding: 20px;
          text-align: center;
          color: black;
          background-color: white;
          min-height: 100vh;
        }
      `}</style>
    </>
  );
}

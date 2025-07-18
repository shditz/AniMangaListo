import dynamic from "next/dynamic";
import NavButton from "./components/NavButtonClient";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-700 via-purple-950 to-black flex flex-col justify-center items-center px-6 text-white">
      <div className="text-center max-w-lg">
        <h1 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 mb-4">
          404
        </h1>
        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
        <p className="text-gray-300 mb-8">
          Oops! The page you are looking for may have been removed, replaced, or
          is no longer available.
        </p>
        <NavButton
          href="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-black to-purple-600 rounded-lg font-semibold hover:from-purple-700 hover:to-black transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
        >
          Back to Home
        </NavButton>
      </div>

      <div className="mt-10 opacity-70">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-40 w-40 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    </div>
  );
}

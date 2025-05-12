// src/app/api/auth/signin/page.jsx
"use client";

import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

export default function SignInPage() {
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/");
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full filter blur-3xl opacity-30 animate-blob blob-glow-purple"></div>{" "}
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/30 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="relative w-full max-w-md backdrop-blur-xl bg-gray-900/70 border border-purple-800/30 rounded-3xl shadow-2xl p-10 z-10 transform transition-all duration-500 hover:scale-[1.01]">
        <div className="text-center mb-10 animate-fadeIn">
          <div className="mb-6 flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-16 h-16 object-contain"
              />
            </div>
            <h1 className="text-4xl font-extrabold bg-clip-text text-transparent animate-gradient-title">
              AniMangaListo
            </h1>
            <p className="text-gray-300 mt-2 text-sm">
              Heaven List of Anime & Manga
            </p>
          </div>

          <h2 className="text-2xl font-semibold text-gray-100 mt-6">
            Welcome 👋
          </h2>
          <p className="text-gray-400 mt-1 text-sm">Sign in to continue</p>
        </div>

        <div className="space-y-5 mt-8">
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="group w-full p-4 bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-pink-500/20 border border-white/20 hover:border-purple/50 backdrop-blur-sm"
          >
            <span className="relative flex items-center justify-center w-6 h-6 transition-transform group-hover:scale-110">
              <FcGoogle className="text-2xl" />
            </span>
            <span className="font-medium tracking-wide">
              Continue with Google
            </span>
          </button>
        </div>

        <div className="mt-10 text-center text-xs text-gray-500 animate-fadeIn animation-delay-300">
          <p className="leading-relaxed">
            By continuing, you agree to our{" "}
            <Link
              href="/terms"
              className="text-purple-400 hover:text-purple-300 hover:underline transition-colors"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-purple-400 hover:text-purple-300 hover:underline transition-colors"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
      <footer className="absolute bottom-4 text-center text-gray-600 text-sm">
        &copy; {new Date().getFullYear()} AniMangaListo • Anime & Manga List
      </footer>
    </div>
  );
}

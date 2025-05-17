"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CommentForm({ malId, animeTitle }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasCommented, setHasCommented] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [isRatingSelected, setIsRatingSelected] = useState(false);

  const checkExistingComment = async () => {
    if (!session?.user) return;

    try {
      const res = await fetch(
        `/api/comments?malId=${malId}&userId=${session.user.id}`
      );
      if (res.ok) {
        const data = await res.json();
        setHasCommented(data.length > 0);
      }
    } catch (err) {
      console.error("Failed to check existing comment:", err);
    }
  };

  useEffect(() => {
    checkExistingComment();
  }, [session, malId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ malId, content, rating, animeTitle }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to submit comment");
      }

      setContent("");
      setRating(5);
      setIsRatingSelected(false);
      setHasCommented(true);
      setShowThankYou(true);

      window.dispatchEvent(new Event("commentUpdated"));

      const handleCommentDeleted = () => {
        setHasCommented(false);
        setShowThankYou(false);
      };

      window.addEventListener("commentDeleted", handleCommentDeleted);

      setTimeout(() => {
        setShowThankYou(false);
        window.removeEventListener("commentDeleted", handleCommentDeleted);
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="p-4 bg-purple-900/20 rounded-lg text-center">
        <p className="text-purple-300">Please login to leave a comment</p>
      </div>
    );
  }

  if (hasCommented && showThankYou) {
    return (
      <div className="mb-8 animate-fadeIn">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
            Leave a Comment
          </span>
          <span className="ml-2 text-purple-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
        </h3>
        <div className="bg-gray-800/70 border-2 border-green-500/30 rounded-xl p-6 text-center backdrop-blur-sm shadow-lg">
          <div className="inline-flex p-3 bg-green-500/10 rounded-full mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-green-400 text-lg font-medium">
            Thanks for your comment!
          </p>
          <p className="text-gray-400 mt-2">
            Your comment will be displayed shortly.
          </p>
        </div>
      </div>
    );
  }

  if (hasCommented) {
    return null;
  }

  return (
    <div className="mb-3 animate-fadeIn">
      <div className="relative overflow-hidden mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 transform rotate-12 scale-150 blur-md"></div>
        <h3 className="relative z-10 text-2xl font-bold pl-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Leave a Comment
        </h3>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/30 text-red-300 rounded-lg flex items-start gap-3 border border-red-800/30">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="mt-0.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p>{error}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 backdrop-blur-sm bg-black/20 p-6 rounded-xl border border-white/5 shadow-xl"
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => {
                  setRating(num);
                  setIsRatingSelected(true);
                }}
                aria-label={`Rating ${num}`}
                className={`w-6 h-6 md:w-10 md:h-10 rounded-full transition-all duration-300 focus:outline-none ${
                  isRatingSelected && rating >= num
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                }`}
              >
                <span className="sr-only">Rating {num}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={
                    isRatingSelected && rating >= num ? "currentColor" : "none"
                  }
                  stroke={
                    isRatingSelected && rating >= num ? "none" : "currentColor"
                  }
                  strokeWidth={isRatingSelected && rating >= num ? "0" : "2"}
                  className="w-5 h-5 mx-auto"
                >
                  <path
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538.997l-3.976-3.857a1 1 0 00-1.156 0l-3.976 3.857c-.783.69-1.838-.076-1.538-.997l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.95-.69l1.519-4.674z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <span
                key={num}
                className={`text-xs ${
                  isRatingSelected && rating >= num
                    ? "text-yellow-400 font-medium"
                    : "text-gray-400"
                }`}
              >
                {num}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="block text-sm font-medium">
            Comment
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What do you think about this anime...?"
            className="w-full p-4 bg-gray-900/70 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none transition-all min-h-[120px]"
            rows={4}
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !isRatingSelected}
            className={`w-full py-3 px-6 ${
              isLoading || !isRatingSelected
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-purple-950 hover:from-purple-950 hover:to-purple-700"
            } rounded-lg font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Send...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Send Comment
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

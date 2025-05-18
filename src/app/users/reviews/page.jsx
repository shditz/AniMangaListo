// app/user/reviews/page.js

"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { motion, useInView } from "framer-motion";
import dynamic from "next/dynamic";
const NavButton = dynamic(() => import("../../components/NavButton"), {
  ssr: false,
});

const UserReviewsPage = () => {
  const { data: session } = useSession();
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const deleteComment = async (commentId) => {
    try {
      const res = await fetch(`/api/comments?commentId=${commentId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setComments(comments.filter((comment) => comment.id !== commentId));
      } else {
        throw new Error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  useEffect(() => {
    const fetchUserComments = async () => {
      if (!session?.user?.id) return;

      try {
        const res = await fetch(`/api/comments?userId=${session.user.id}`);
        const data = await res.json();
        setComments(data);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserComments();
  }, [session]);

  const CommentItem = ({ comment, index }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, {
      once: true,
      margin: "-100px",
      amount: 0.3,
    });

    const isOwner = comment.userId === session?.user?.id;

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        whileHover={{
          scale: 1.05,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: index * 0.03,
        }}
        className="bg-gray-900/50 border-2 border-purple-900 backdrop-blur-sm rounded-xl p-4 relative hover:z-10 cursor-pointer"
      >
        {isOwner && (
          <button
            onClick={() => deleteComment(comment.id)}
            className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Delete comment"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        )}

        <div className="flex flex-col gap-3">
          <h3 className="font-bold text-purple-300 line-clamp-1">
            {comment.animeTitle || `Anime ID: ${comment.malId}`}
          </h3>

          <div className="flex justify-between items-center">
            <span className="text-yellow-400 text-sm">
              ★ {comment.rating}/10
            </span>
            <span className="text-gray-400 text-sm">
              {comment.createdAt
                ? new Date(comment.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "N/A"}
            </span>
          </div>

          <p className="text-gray-300 text-sm line-clamp-4">
            {comment.content}
          </p>

          <NavButton
            href={`/anime/${comment.malId}`}
            className="mt-2 text-purple-400 hover:text-purple-300 text-sm transition-colors"
          >
            View Anime →
          </NavButton>
        </div>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-48 bg-gray-800/50 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 mt-12 ">
          <div className="flex justify-between items-center ">
            <h1 className="text-3xl font-bold text-white">My Reviews</h1>
            <p className="text-purple-300">{comments.length} total reviews</p>
            <NavButton
              href="/users/dashboard"
              className="bg-purple-600 select-none hover:bg-purple-700 px-4 py-2 rounded-lg"
            >
              Back to Dashboard
            </NavButton>
          </div>
        </header>

        {comments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No reviews yet</p>
            <NavButton
              href="/"
              className="mt-4 inline-block text-purple-400 hover:text-purple-300"
            >
              Browse Anime →
            </NavButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {comments.map((comment, index) => (
              <CommentItem key={comment.id} comment={comment} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserReviewsPage;

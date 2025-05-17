"use client";
import { useEffect, useState } from "react";
import { useSWRConfig } from "swr";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import React from "react";
import { useSession } from "next-auth/react";
export default function CommentSection({ malId }) {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { mutate } = useSWRConfig();
  const { data: session } = useSession();

  const deleteComment = async (commentId) => {
    try {
      const res = await fetch(`/api/comments?commentId=${commentId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        window.location.reload();
      } else {
        throw new Error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const CommentItem = React.memo(({ comment, index }) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, {
      once: true,
      margin: "-100px",
    });

    const isOwner = comment.userId === session?.user?.id;

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{
          duration: 0.4,
          delay: index * 0.03,
          ease: "easeOut",
        }}
        className="bg-gray-900/50 border-2 border-purple-900 backdrop-blur-sm rounded-xl p-4 relative"
      >
        {isOwner && (
          <button
            onClick={() => deleteComment(comment.id)}
            className="absolute top-2 right-2 text-gray-400 hover:text-red-400"
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
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        )}

        <div className="flex items-start gap-3 mb-3">
          <Link href={`/user/${comment.user.id}`}>
            <img
              src={comment.user.image || "/default-avatar.png"}
              alt={comment.user.name || "User"}
              width="48"
              height="48"
              loading="lazy"
              decoding="async"
              className="rounded-full md:w-12 md:h-12 w-8 h-8 object-cover hover:ring-2 hover:ring-purple-500 transition-all"
            />
          </Link>
          <div className="flex-1">
            <Link
              href={`/user/${comment.user.id}`}
              className="font-semibold text-purple-300 hover:text-purple-400 transition-colors"
            >
              <span className="md:text-base text-sm">
                {comment.user.name || comment.user.email.split("@")[0]}
              </span>
            </Link>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
              <span className="text-yellow-400">★ {comment.rating}</span>
            </div>
          </div>
        </div>

        <p className="text-gray-300 text-sm line-clamp-5 mb-3">
          {comment.content}
        </p>
      </motion.div>
    );
  });

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(`/api/comments?malId=${malId}`);
        const data = await res.json();
        setComments(data);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchComments();

    const handleCommentUpdate = () => {
      fetchComments();
      mutate(`/api/comments?malId=${malId}`);
    };

    window.addEventListener("commentUpdated", handleCommentUpdate);

    return () => {
      window.removeEventListener("commentUpdated", handleCommentUpdate);
    };
  }, [malId, mutate]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-48 bg-gray-800/50 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!comments.length) {
    return (
      <div className="relative z-10 text-white">
        <h2 className="text-2xl flex justify-center font-bold -mb-10">
          User Comments
        </h2>
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="bg-black border-2 border-purple-900 backdrop-blur-sm rounded-xl p-6 text-center">
            <p className="text-gray-300 text-lg">Nobody Commented This Anime</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative md:px-4 px-2 z-10 text-white">
      <h2 className="text-2xl flex justify-center font-bold mb-4">
        User Comments
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {comments.map((comment, index) => (
          <CommentItem key={comment.id} comment={comment} index={index} />
        ))}
      </div>
    </div>
  );
}

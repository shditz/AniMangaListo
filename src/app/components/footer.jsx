"use client";

import { motion } from "framer-motion";
import {
  FaFacebook,
  FaInstagram,
  FaDiscord,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";
import React from "react";
import Link from "next/link";

const XIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231z" />
  </svg>
);

const Footer = () => {
  const exploreRoutes = {
    Favorited: "/ViewAll/anime/mostfavorited",
    Popular: "/ViewAll/anime/mostpopular",
    "Latest Update": "/ViewAll/anime/LatestUpdate",
    "Top Anime": "/ViewAll/topanime",
    Upcoming: "/ViewAll/topupcoming",
  };

  const legalRoutes = {
    "Privacy Policy": "/privacy-policy",
    "Terms of Service": "/terms-of-service",
    "Cookie Policy": "/cookie-policy",
  };

  const socialMediaUrls = {
    Facebook: "https://www.facebook.com/aditya.kurniwan.12 ",
    Twitter: "https://x.com/ShDitzz ",
    Instagram: "https://www.instagram.com/ry.shditz?igsh=b3RuMnBtM3J5a3Nk ",
    Linkedin: "https://www.linkedin.com/in/aditya-kurniawan-20815934a/ ",
    Github: "https://github.com/qwershditz ",
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  const socialVariants = {
    hover: {
      scale: 1.2,
      rotate: 5,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
    tap: { scale: 0.95 },
  };

  return (
    <footer className="bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-pink-900/20 animate-gradient-x" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05),_transparent)] animate-pulse-slow" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern animate-pulse-slow"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(50%);
          }
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.15;
          }
        }
        .animate-gradient-x {
          animation: gradient-x 10s linear infinite;
        }
        .bg-grid-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          background-repeat: repeat;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
        >
          <motion.div
            variants={itemVariants}
            className="space-y-4 group"
            whileHover={{ y: -5 }}
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent animate-shimmer">
              AniMangaListo
            </h2>
            <motion.p
              className="text-gray-400 text-sm transition-colors duration-300"
              whileHover={{ x: 5, color: "#a855f7" }}
            >
              Your Ultimate Anime & Manga Database. Explore thousands of titles
              with detailed information and reviews.
            </motion.p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold pl-1 text-purple-400 mb-4 relative">
              <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-4 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full mr-2"></span>
              Explore
            </h3>
            <ul className="space-y-2">
              {Object.entries(exploreRoutes).map(([title, path], index) => (
                <motion.li
                  key={index}
                  whileHover={{
                    x: 10,
                    transition: { type: "spring", stiffness: 300 },
                  }}
                >
                  <Link
                    href={path}
                    className="group text-gray-300 hover:text-purple-400 transition-all duration-300 text-sm flex items-center relative overflow-hidden"
                  >
                    <span className="mr-2 absolute left-0 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0">
                      🌟
                    </span>
                    <span className="group-hover:translate-x-2 transition-transform duration-300">
                      {title}
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold pl-1 text-purple-400 mb-4 relative">
              <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-4 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full mr-2"></span>
              Legal
            </h3>
            <ul className="space-y-2">
              {Object.entries(legalRoutes).map(([title, path], index) => (
                <motion.li key={index}>
                  <Link
                    href={path}
                    className="relative text-gray-300 hover:text-purple-400 text-sm inline-block transition-all duration-300"
                  >
                    <span className="relative z-10">{title}</span>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold left-5 text-purple-400 mb-4 relative">
              <span className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-1 h-4 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full mr-2"></span>
              Social Media
            </h3>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: FaFacebook, platform: "Facebook", color: "#1877F2" },
                { icon: XIcon, platform: "Twitter", color: "#000000" },
                { icon: FaInstagram, platform: "Instagram", color: "#E4405F" },
                { icon: FaDiscord, platform: "Discord", color: "#5865F2" },
                { icon: FaGithub, platform: "Github", color: "#181717" },
                { icon: FaLinkedin, platform: "Linkedin", color: "#0A66C2" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={socialMediaUrls[social.platform]}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={socialVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="p-2.5 flex justify-center items-center rounded-full bg-opacity-20 hover:bg-opacity-40 backdrop-blur-sm transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-purple-500/30 max-w-[60px] mx-auto"
                  style={{
                    backgroundColor: social.color,
                    boxShadow: "0 0 10px rgba(0,0,0,0.3)",
                  }}
                  aria-label={`Follow us on ${social.platform}`}
                >
                  <social.icon className="text-white text-xl w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 80 }}
          className="border-t border-purple-900/50 mt-8 pt-8 text-center relative"
        >
          <div className="absolute -top-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
          <motion.p
            whileHover={{ scale: 1.05, color: "#a855f7" }}
            transition={{ type: "spring", stiffness: 300 }}
            className="cursor-default text-gray-400 text-sm inline-block relative z-10"
          >
            © {new Date().getFullYear()} AniMangaListo. All rights reserved.
            <span className="mx-1">•</span>
            Made with
            <span className="text-purple-400 animate-heartbeat mx-1">❤️</span>
            for anime lovers worldwide.
          </motion.p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

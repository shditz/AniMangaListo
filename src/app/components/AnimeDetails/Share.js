"use client";

import { useState } from "react";
import {
  FaLink,
  FaFacebook,
  FaWhatsapp,
  FaReddit,
  FaTwitter,
  FaTumblr,
} from "react-icons/fa";

const ShareButtons = ({ title, description, imageUrl, url, siteName }) => {
  const [isCopied, setIsCopied] = useState(false);

  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const encodedUrl = encodeURIComponent(url);
  const encodedImage = encodeURIComponent(imageUrl);

  const sharePlatforms = [
    {
      name: "Facebook",
      icon: <FaFacebook />,
      color: "bg-[#1877f2] hover:bg-[#166fe5]",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}%0A%0A${encodedDescription}&hashtag=%23AniMangaListo`,
    },

    {
      name: "Twitter",
      icon: <FaTwitter />,
      color: "bg-[#1da1f2] hover:bg-[#1991db]",
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}%0A%0A${encodedDescription}%0A%0A${encodedUrl}`,
    },

    {
      name: "WhatsApp",
      icon: <FaWhatsapp />,
      color: "bg-[#25d366] hover:bg-[#22c15e]",
      url: `https://wa.me/?text=${encodeURIComponent(
        `${siteName}\n\n${title}\n\n${description}\n\n${url}`
      )}`,
    },
    {
      name: "Reddit",
      icon: <FaReddit />,
      color: "bg-[#ff4500] hover:bg-[#e63d00]",
      url: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    },
    {
      name: "Tumblr",
      icon: <FaTumblr />,
      color: "bg-[#35465c] hover:bg-[#2d3b4e]",
      url: `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${encodedUrl}&caption=${encodedDescription}`,
    },
  ];

  const copyToClipboard = () => {
    const textToCopy = `${title}\n\n${description}\n\n${url}`;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="mb-6">
      <h3 className="text-base font-semibold mb-3">Share this Anime</h3>
      <div className="flex xl:text-sm text-xs flex-wrap gap-2">
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
        >
          <FaLink />
          {isCopied ? "Copied!" : "Copy Link"}
        </button>

        {sharePlatforms.map((platform) => (
          <a
            key={platform.name}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 ${platform.color} text-white px-4 py-2 rounded transition-colors`}
          >
            {platform.icon}
            {platform.name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default ShareButtons;

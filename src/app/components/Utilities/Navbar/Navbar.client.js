"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  FaBars,
  FaTimes,
  FaSearch,
  FaFacebook,
  FaInstagram,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";
import { debounce } from "lodash-es";

const DropdownChevron = ({ isActive }) => (
  <svg
    className={`w-4 h-4 ml-1 transition-transform ${
      isActive ? "rotate-180" : ""
    }`}
    viewBox="0 0 24 24"
    stroke="currentColor"
    fill="none"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const SocialIcon = ({ href, color, icon: Icon }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={color}>
    <Icon className="w-6 h-6" />
  </a>
);

const NavbarClient = ({ dropdownLinks }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileStates, setMobileStates] = useState({
    menu: false,
    search: false,
    dropdown: null,
  });

  const pathname = usePathname();
  const dropdownRefs = useRef({});
  const mobileMenuRef = useRef(null);
  const hoverTimeout = useRef(null);
  const showMobileMenuRef = useRef(mobileStates.menu);

  const navClasses = useMemo(
    () =>
      `fixed inset-x-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/20 backdrop-blur-lg py-2 shadow-md"
          : "bg-transparent backdrop-blur-none py-4"
      }`,
    [isScrolled]
  );

  const isActivePath = useCallback(
    (path) => isMounted && pathname === path,
    [isMounted, pathname]
  );

  const handleDropdownHover = useCallback((dropdownName, isEnter) => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }

    if (isEnter) {
      setActiveDropdown(dropdownName);
    } else {
      hoverTimeout.current = setTimeout(() => {
        const dropdownElement = dropdownRefs.current[dropdownName];
        if (!dropdownElement?.matches(":hover")) {
          setActiveDropdown(null);
        }
      }, 100);
    }
  }, []);

  const toggleMobileState = useCallback((state, value) => {
    setMobileStates((prev) => ({ ...prev, [state]: value }));
  }, []);

  useEffect(() => {
    showMobileMenuRef.current = mobileStates.menu;
  }, [mobileStates.menu]);

  useEffect(() => {
    setIsMounted(true);

    const handleScroll = debounce(() => {
      setIsScrolled(window.scrollY > 50);
      if (showMobileMenuRef.current) {
        toggleMobileState("menu", false);
        toggleMobileState("dropdown", null);
      }
    }, 100);

    window.addEventListener("scroll", handleScroll);
    return () => {
      handleScroll.cancel();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [toggleMobileState]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest('button[aria-label="Mobile menu"]')
      ) {
        toggleMobileState("menu", false);
        toggleMobileState("dropdown", null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [toggleMobileState]);

  const renderDropdownLinks = (type) =>
    dropdownLinks[type].map(({ href, text }) => (
      <Link
        key={href}
        href={href}
        className="block px-4 py-2 text-white hover:bg-purple-800/40"
        onClick={() => toggleMobileState("menu", false)}
      >
        {text}
      </Link>
    ));

  const SocialLinks = () => (
    <div className="flex space-x-4 justify-center">
      <SocialIcon href="#" color="text-blue-600" icon={FaFacebook} />
      <SocialIcon href="#" color="text-red-400" icon={FaInstagram} />
      <SocialIcon href="#" color="text-gray-400" icon={FaGithub} />
      <SocialIcon href="#" color="text-blue-600" icon={FaLinkedin} />
    </div>
  );

  if (!isMounted) {
    return (
      <header>
        <nav className={navClasses}>
          <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center w-full">
            <Link
              href="/"
              className="flex-shrink-0 text-white text-xl md:text-2xl font-bold"
            >
              AniMangaListo.
            </Link>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header className="relative">
      <nav className={navClasses}>
        <div className="max-w-7xl mx-auto px-4 md:px-5 xl:px-0 flex justify-between items-center w-full">
          <Link
            href="/"
            className="flex-shrink-0 text-white text-xl md:text-2xl font-bold"
          >
            AniMangaListo.
          </Link>

          <div className="hidden md:flex flex-1 justify-center md:space-x-5 xl:space-x-6 xl:text-lg dropdown-container">
            <Link
              href="/"
              className={`${
                isActivePath("/") ? "text-purple-500" : "text-white"
              } hover:text-purple-300 transition duration-300`}
            >
              Home
            </Link>

            <div
              className="relative dropdown-group"
              ref={(el) => (dropdownRefs.current.anime = el)}
              onMouseEnter={() => handleDropdownHover("anime", true)}
              onMouseLeave={() => handleDropdownHover("anime", false)}
            >
              <button className="flex items-center text-white hover:text-purple-500 transition duration-300 focus:outline-none">
                Anime
                <DropdownChevron isActive={activeDropdown === "anime"} />
              </button>
              <div
                className={`absolute mt-1 w-48 bg-black/80 backdrop-blur-md rounded-lg shadow-lg text-lg transition-all duration-300 origin-top ${
                  activeDropdown === "anime"
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
                onMouseEnter={() => setActiveDropdown("anime")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {renderDropdownLinks("anime")}
              </div>
            </div>
            <div
              className="relative dropdown-group"
              ref={(el) => (dropdownRefs.current.manga = el)}
              onMouseEnter={() => handleDropdownHover("manga", true)}
              onMouseLeave={() => handleDropdownHover("manga", false)}
            >
              <button className="flex items-center text-white hover:text-purple-500 transition duration-300 focus:outline-none">
                Manga
                <DropdownChevron isActive={activeDropdown === "manga"} />
              </button>
              <div
                className={`absolute mt-1 w-48 bg-black/80 backdrop-blur-md rounded-lg shadow-lg text-lg transition-all duration-300 origin-top ${
                  activeDropdown === "manga"
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
              >
                {renderDropdownLinks("manga")}
              </div>
            </div>
            {dropdownLinks.staticLinks.map(({ href, text }) => {
              if (text === "Genre") {
                return (
                  <div
                    key={href}
                    className="relative dropdown-group"
                    ref={(el) => (dropdownRefs.current.genre = el)}
                    onMouseEnter={() => handleDropdownHover("genre", true)}
                    onMouseLeave={() => handleDropdownHover("genre", false)}
                  >
                    <button className="flex items-center text-white hover:text-purple-500 transition duration-300 focus:outline-none">
                      Genre
                      <DropdownChevron isActive={activeDropdown === "genre"} />
                    </button>
                    <div
                      className={`absolute mt-1 w-48 bg-black/80 backdrop-blur-md rounded-lg shadow-lg text-lg transition-all duration-300 origin-top ${
                        activeDropdown === "genre"
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 -translate-y-2 pointer-events-none"
                      }`}
                      onMouseEnter={() => setActiveDropdown("genre")}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <Link
                        href="/genres"
                        className="block px-4 py-2 text-white hover:bg-purple-800/40"
                      >
                        Anime
                      </Link>
                      <Link
                        href="/genresmanga"
                        className="block px-4 py-2 text-white hover:bg-purple-800/40"
                      >
                        Manga
                      </Link>
                    </div>
                  </div>
                );
              } else {
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`${
                      isActivePath(href) ? "text-purple-500" : "text-white"
                    } hover:text-purple-300 transition duration-300`}
                  >
                    {text}
                  </Link>
                );
              }
            })}
          </div>

          <div className="hidden item-center relative group md:flex">
            <input
              type="text"
              placeholder="Search..."
              className="px-10 py-2 xl:px-12 xl:py-2 bg-transparent border border-purple-400 rounded-full focus:outline-none focus:border-purple-600 group-hover:border-purple-600 transition duration-300 text-sm xl:text-base md:w-50  xl:w-64 text-purple-200 placeholder-purple-300"
            />
            <FaSearch className="w-4 h-4 md:w-5 md:h-5 absolute left-3 bottom-3 text-purple-300 transition duration-300 group-hover:text-purple-600" />
          </div>

          <div className="flex items-center  md:hidden space-x-4">
            <button
              onClick={() => toggleMobileState("search", !mobileStates.search)}
              aria-label="Search"
            >
              <FaSearch className="text-white w-5 h-5" />
            </button>

            <button
              onClick={() => toggleMobileState("menu", !mobileStates.menu)}
              aria-label="Mobile menu"
            >
              {mobileStates.menu ? (
                <FaTimes className="text-white w-6 h-6" />
              ) : (
                <FaBars className="text-white w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {mobileStates.search && (
          <div className="flex justify-center mt-2 md:hidden">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 w-3/4 bg-gray-900/95 border border-purple-500 rounded-full text-purple-200 placeholder-purple-300 focus:outline-none"
            />
          </div>
        )}
      </nav>

      {mobileStates.menu && (
        <>
          <div
            className="fixed inset-0 bg-black/70 z-40 md:hidden transition-opacity duration-300 ease-out"
            onClick={() => toggleMobileState("menu", false)}
          />
          <div
            ref={mobileMenuRef}
            className={`fixed top-0 right-0 h-full w-3/4 bg-black/40 backdrop-blur-2xl shadow-xl transform transition-all duration-300 ease-out ${
              mobileStates.menu ? "translate-x-0" : "translate-x-full"
            } md:hidden flex flex-col z-50`}
          >
            <div className="p-4 pb-4 relative">
              <button
                onClick={() => toggleMobileState("menu", false)}
                className="text-red-100 absolute left-3 top-3"
                aria-label="Close menu"
              >
                <FaTimes className="w-6 h-6" />
              </button>

              <div className="mt-8 mb-3">
                <h2 className="text-2xl ml-6 font-bold text-purple-400">
                  AniMangaListo.
                </h2>
                <div className="w-full border-t border-purple-700 mt-4"></div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 space-y-4 dropdown-container pt-4">
              <Link
                href="/"
                className={`${
                  isActivePath("/") ? "text-purple-500" : "text-white"
                } text-base font-semibold hover:text-purple-300`}
                onClick={() => toggleMobileState("menu", false)}
              >
                Home
              </Link>

              <div className="flex flex-col pt-3 dropdown-group">
                <button
                  onClick={() =>
                    toggleMobileState(
                      "dropdown",
                      mobileStates.dropdown === "anime" ? null : "anime"
                    )
                  }
                  className="flex items-center justify-between font-semibold text-white text-base hover:text-purple-300"
                >
                  Anime
                  <DropdownChevron
                    isActive={mobileStates.dropdown === "anime"}
                  />
                </button>
                {mobileStates.dropdown === "anime" && (
                  <div className="ml-4 mt-2 space-y-3">
                    {dropdownLinks.anime.map(({ href, text }) => (
                      <Link
                        key={href}
                        href={href}
                        className="block text-gray-200 font-medium text-sm"
                        onClick={() => toggleMobileState("menu", false)}
                      >
                        {text}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col dropdown-group">
                <button
                  onClick={() =>
                    toggleMobileState(
                      "dropdown",
                      mobileStates.dropdown === "manga" ? null : "manga"
                    )
                  }
                  className="flex items-center justify-between text-white font-semibold text-base hover:text-purple-300"
                >
                  Manga
                  <DropdownChevron
                    isActive={mobileStates.dropdown === "manga"}
                  />
                </button>
                {mobileStates.dropdown === "manga" && (
                  <div className="ml-4 mt-2 space-y-3">
                    {dropdownLinks.manga.map(({ href, text }) => (
                      <Link
                        key={href}
                        href={href}
                        className="block text-gray-200 font-medium text-sm"
                        onClick={() => toggleMobileState("menu", false)}
                      >
                        {text}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {dropdownLinks.staticLinks.map(({ href, text }) => {
                if (text === "Genre") {
                  return (
                    <div
                      key={href}
                      className="flex flex-col pt-3 dropdown-group"
                    >
                      <button
                        onClick={() =>
                          toggleMobileState(
                            "dropdown",
                            mobileStates.dropdown === "genre" ? null : "genre"
                          )
                        }
                        className="flex items-center justify-between font-semibold text-white text-base hover:text-purple-300"
                      >
                        Genre
                        <DropdownChevron
                          isActive={mobileStates.dropdown === "genre"}
                        />
                      </button>
                      {mobileStates.dropdown === "genre" && (
                        <div className="ml-4 mt-2 space-y-3">
                          <Link
                            href="/genres"
                            className="block text-gray-200 font-medium text-sm"
                          >
                            Anime
                          </Link>
                          <Link
                            href="/genresmanga"
                            className="block text-gray-200 font-medium text-sm"
                          >
                            Manga
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                } else {
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`${
                        isActivePath(href) ? "text-purple-500" : "text-white"
                      } block rounded-md text-base font-medium`}
                      onClick={() => toggleMobileState("menu", false)}
                    >
                      {text}
                    </Link>
                  );
                }
              })}
            </div>

            <div className="p-6 pt-4 border-t border-purple-700">
              <SocialLinks />
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default NavbarClient;

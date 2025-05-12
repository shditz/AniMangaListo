"use client";

import dynamic from "next/dynamic";
const NavButton = dynamic(() => import("../../NavButton"), {
  ssr: false,
});
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

import {
  FaBars,
  FaTimes,
  FaSearch,
  FaFacebook,
  FaInstagram,
  FaGithub,
  FaLinkedin,
  FaArrowLeft,
} from "react-icons/fa";
import { debounce } from "lodash-es";
import InputSearch from "./InputSearch";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

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

const NavbarClient = ({ dropdownLinks, userAction }) => {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileStates, setMobileStates] = useState({
    menu: false,
    search: false,
    dropdown: null,
  });
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  const pathname = usePathname();
  const dropdownRefs = useRef({});
  const mobileMenuRef = useRef(null);
  const hoverTimeout = useRef(null);
  const showMobileMenuRef = useRef(mobileStates.menu);

  const { data: session } = useSession();
  const user = session?.user;

  const ProfilePhoto = useMemo(() => {
    if (!user?.image) return null;

    return (
      <NavButton
        href="/users/dashboard"
        className="rounded-full overflow-hidden w-10 h-10 border-2 border-purple-700 hover:border-purple-400 transition duration-300 ml-4"
      >
        <img
          src={user.image}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </NavButton>
    );
  }, [user]);

  const handleBack = () => {
    setIsNavigating(true);
    router.back();
  };

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
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia(
        "(display-mode: standalone)"
      ).matches;
      if (isStandalone) {
        setIsAppInstalled(true);
        setDeferredPrompt(null);
      }
    };

    checkIfInstalled();

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", checkIfInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", checkIfInstalled);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted install");
        } else {
          console.log("User dismissed install");
        }
        setDeferredPrompt(null);
        setIsAppInstalled(true);
      });
    }
  };

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

  const handleNavigation = useCallback(
    (href) => {
      if (pathname === href) return;
      setIsNavigating(true);
      router.push(href);
    },
    [router, pathname]
  );

  useEffect(() => {
    const handleCustomNavigation = (e) => {
      const { href } = e.detail;
      if (href && href !== pathname) {
        handleNavigation(href);
      }
    };

    window.addEventListener("startNavigation", handleCustomNavigation);

    return () => {
      window.removeEventListener("startNavigation", handleCustomNavigation);
    };
  }, [handleNavigation, pathname]);

  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  const renderDropdownLinks = (type) =>
    dropdownLinks[type].map(({ href, text }) => (
      <NavButton
        key={href}
        href={href}
        className="block px-4 py-2 text-white hover:bg-purple-800/40"
        onClick={(e) => {
          e.preventDefault();
          handleNavigation(href);
          toggleMobileState("menu", false);
        }}
      >
        {text}
      </NavButton>
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
            <NavButton
              href="/"
              className="flex-shrink-0 text-white text-xl md:text-2xl font-bold"
            >
              AniMangaListo.
            </NavButton>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <>
      {isNavigating && (
        <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-black/50 backdrop-blur-sm">
          <div className="loader"></div>
        </div>
      )}

      <header className="relative select-none">
        <nav className={navClasses}>
          <div className="max-w-7xl mx-auto px-4 md:px-5 xl:px-0 flex justify-between items-center w-full">
            {pathname !== "/" && (
              <button
                onClick={handleBack}
                className="absolute left-0 hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-purple-950/30 transition duration-300  z-10"
                aria-label="Back"
              >
                <FaArrowLeft className="w-5 h-5 text-white" />
                <span className="text-white font-medium hidden md:inline">
                  Back
                </span>
              </button>
            )}
            <NavButton
              href="/"
              className="flex-shrink-0 text-white text-xl md:text-2xl font-bold"
              onClick={(e) => {
                e.preventDefault();
                handleNavigation("/");
              }}
            >
              AniMangaListo.
            </NavButton>

            <div className="hidden xl:flex flex-1 justify-center md:space-x-5 xl:space-x-6 xl:text-lg dropdown-container">
              <NavButton
                href="/"
                className={`${
                  isActivePath("/") ? "text-purple-500" : "text-white"
                } hover:text-purple-300 transition duration-300`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation("/");
                }}
              >
                Home
              </NavButton>

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
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigation(href);
                        toggleMobileState("menu", false);
                      }}
                    >
                      <button className="flex items-center text-white hover:text-purple-500 transition duration-300 focus:outline-none">
                        Genre
                        <DropdownChevron
                          isActive={activeDropdown === "genre"}
                        />
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
                        <NavButton
                          href="/genres"
                          className="block px-4 py-2 text-white hover:bg-purple-800/40"
                        >
                          Anime
                        </NavButton>
                        <NavButton
                          href="/genresmanga"
                          className="block px-4 py-2 text-white hover:bg-purple-800/40"
                        >
                          Manga
                        </NavButton>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <NavButton
                      key={href}
                      href={href}
                      className={`${
                        isActivePath(href) ? "text-purple-500" : "text-white"
                      } hover:text-purple-300 transition duration-300`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigation(href);
                      }}
                    >
                      {text}
                    </NavButton>
                  );
                }
              })}
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden xl:flex item-center relative group">
                <InputSearch handleNavigation={router.push} />
              </div>

              {/* Tambahkan userAction di sini */}
              <div className="hidden xl:flex items-center gap-4 ml-auto">
                {userAction}
                {ProfilePhoto}
              </div>
              {/* Mobile Section */}
              <div className="flex items-center xl:hidden space-x-4">
                {/* Foto profil dan signin di sebelah kiri */}
                <div className="flex items-center gap-2">{ProfilePhoto}</div>

                {/* Icon search */}
                <button
                  onClick={() =>
                    toggleMobileState("search", !mobileStates.search)
                  }
                  aria-label="Search"
                >
                  <FaSearch className="text-white w-5 h-5" />
                </button>

                {/* Menu mobile */}
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
          </div>

          {mobileStates.search && (
            <InputSearch isMobile handleNavigation={handleNavigation} />
          )}
        </nav>
        {pathname !== "/" && (
          <div
            className={`xl:hidden fixed ${
              isScrolled ? "top-8" : "top-16"
            } left-0 z-40 transition-all duration-300 `}
          >
            <div className=" py-2">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/20 hover:bg-purple-950/40 transition duration-300"
                aria-label="Back"
              >
                <FaArrowLeft className="w-5 h-5 text-white" />
                <span className="text-white font-medium">Back</span>
              </button>
            </div>
          </div>
        )}
        {mobileStates.menu && (
          <>
            <div
              className="fixed inset-0 bg-black/70 z-40 xl:hidden transition-opacity duration-300 ease-out"
              onClick={() => toggleMobileState("menu", false)}
            />
            <div
              ref={mobileMenuRef}
              className={`fixed top-0 right-0 h-full w-3/4 bg-black/40 backdrop-blur-2xl shadow-xl transform transition-all duration-300 ease-out ${
                mobileStates.menu ? "translate-x-0" : "translate-x-full"
              } xl:hidden flex flex-col z-50`}
            >
              <div className="p-4 pb-4 relative">
                <button
                  onClick={() => toggleMobileState("menu", false)}
                  className="text-red-100 absolute left-3 top-3"
                  aria-label="Close menu"
                >
                  <FaTimes className="w-6 h-6" />
                </button>

                <div className="mt-8 mb-3 flex items-center justify-between ">
                  <h2 className="text-2xl font-bold text-purple-400">
                    AniMangaListo.
                  </h2>
                </div>
                <div className="w-full border-t border-purple-700 mt-4"></div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 space-y-4 dropdown-container pt-4">
                <NavButton
                  href="/"
                  className={`${
                    isActivePath("/") ? "text-purple-500" : "text-white"
                  } text-base font-semibold hover:text-purple-300`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation("/");
                    toggleMobileState("menu", false);
                  }}
                >
                  Home
                </NavButton>

                <div className="flex flex-col pt-3">
                  {user && (
                    <NavButton
                      href="/users/dashboard"
                      className={`${
                        isActivePath("/users/dashboard")
                          ? "text-purple-500"
                          : "text-white"
                      } text-base font-semibold hover:text-purple-300`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigation("/users/dashboard");
                        toggleMobileState("menu", false);
                      }}
                    >
                      Dashboard
                    </NavButton>
                  )}
                </div>
                <div className="flex flex-col  dropdown-group">
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
                        <NavButton
                          key={href}
                          href={href}
                          className="block text-gray-200 font-medium text-sm"
                          onClick={(e) => {
                            e.preventDefault();
                            handleNavigation(href);
                            toggleMobileState("menu", false);
                          }}
                        >
                          {text}
                        </NavButton>
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
                        <NavButton
                          key={href}
                          href={href}
                          className="block text-gray-200 font-medium text-sm"
                          onClick={(e) => {
                            e.preventDefault();
                            handleNavigation(href);
                            toggleMobileState("menu", false);
                          }}
                        >
                          {text}
                        </NavButton>
                      ))}
                    </div>
                  )}
                </div>

                {dropdownLinks.staticLinks.map(({ href, text }) => {
                  if (text === "Genre") {
                    return (
                      <div key={href} className="flex flex-col  dropdown-group">
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
                            <NavButton
                              href="/genres"
                              className="block text-gray-200 font-medium text-sm"
                              onClick={(e) => {
                                e.preventDefault();
                                handleNavigation(href);
                                toggleMobileState("menu", false);
                              }}
                            >
                              Anime
                            </NavButton>
                            <NavButton
                              href="/genresmanga"
                              className="block text-gray-200 font-medium text-sm"
                              onClick={(e) => {
                                e.preventDefault();
                                handleNavigation(href);
                                toggleMobileState("menu", false);
                              }}
                            >
                              Manga
                            </NavButton>
                          </div>
                        )}
                      </div>
                    );
                  } else {
                    return (
                      <NavButton
                        key={href}
                        href={href}
                        className={`${
                          isActivePath(href) ? "text-purple-500" : "text-white"
                        } block rounded-md text-base font-medium`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavigation(href);
                          toggleMobileState("menu", false);
                        }}
                      >
                        {text}
                      </NavButton>
                    );
                  }
                })}
                <div className="xl:hidden pt-4 border-t flex justify-center items-center border-purple-700 mt-4 px-6">
                  {userAction}
                </div>
                {!isAppInstalled && deferredPrompt && (
                  <div className="pt-4">
                    <button
                      onClick={handleInstallClick}
                      className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors duration-300 font-semibold"
                    >
                      Install App
                    </button>
                  </div>
                )}
              </div>

              <div className="p-6 pt-4 border-t border-purple-700">
                <SocialLinks />
              </div>
            </div>
          </>
        )}
      </header>
    </>
  );
};

export default NavbarClient;

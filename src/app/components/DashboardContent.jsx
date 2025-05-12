//app/components/DashboardContetn

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import EditProfile from "./EditProfile";

const DashboardContent = ({ user, trendingAnime }) => {
  const { data: session } = useSession();
  const currentUser = session?.user || user;
  const [showEdit, setShowEdit] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);

  const userReviews = [
    {
      id: 1,
      anime: "Attack on Titan",
      comment: "Development.",
      rating: 10,
      date: "2025-05-10",
    },
    {
      id: 2,
      anime: "Demon Slayer",
      comment: "Development",
      rating: 10,
      date: "2025-05-10",
    },
    {
      id: 3,
      anime: "Attack on Titan",
      comment: "Development.",
      rating: 10,
      date: "2025-05-10",
    },
    {
      id: 4,
      anime: "Demon Slayer",
      comment: "Development",
      rating: 10,
      date: "2025-05-10",
    },
  ];

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await fetch("/src/app/api/bookmark");
        if (!res.ok) throw new Error("Failed to fetch bookmarks");
        const data = await res.json();
        setBookmarks(data);
      } catch (error) {
        console.error("Fetch bookmarks error:", error);
      }
    };
    fetchBookmarks();
  }, []);

  const stats = {
    totalAnime: 1,
    completed: 1,
    review: 1,
    onHold: 1,
    dropped: 1,
    watching: 1,
    totalEpisodes: 1,
  };

  const achievements = [
    {
      id: 1,
      title: "Binge Watcher",
      description: "Completed 10 anime in a month",
      earned: true,
    },
    {
      id: 2,
      title: "Marathon Master",
      description: "Watched 50 episodes in a week",
      earned: true,
    },
    {
      id: 3,
      title: "Diverse Viewer",
      description: "Watched 15 different genres",
      earned: true,
    },
    {
      id: 4,
      title: "Mystery Solver",
      description: "Completed 5 mystery series",
      earned: true,
    },
    {
      id: 5,
      title: "Long Hauler",
      description: "Watched a 100+ episode series",
      earned: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br  from-gray-900 via-purple-950 to-gray-900 text-white">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-10">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-80 -right-40 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-52 left-80 w-80 h-80 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="mb-10 flex justify-center select-none items-center flex-col mt-10">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-purple-300 text-lg">
            Welcome back, {currentUser?.name}
          </p>
        </header>

        {/* Profile Section */}
        <section className="mb-12">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-purple-900/30">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-[150px] h-[150px] rounded-full overflow-hidden border-4 border-purple-500 shadow-lg">
                  <img
                    src={currentUser?.image || "https://placehold.co/250x250 "}
                    alt={currentUser?.name || "User"}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-purple-600 rounded-full p-2 shadow-lg">
                  <PencilIcon className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">
                  {currentUser?.name || "Anonymous"}
                </h2>
                <p className="text-purple-300 mb-4">
                  {currentUser?.email || "No email provided"}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 select-none gap-4 mb-4">
                  <StatCard
                    icon={<AnimeIcon />}
                    label="Total Anime"
                    value={stats.totalAnime}
                  />
                  <StatCard
                    icon={<CompletedIcon />}
                    label="Completed"
                    value={stats.completed}
                  />
                  <StatCard
                    icon={<ReviewsIcon />}
                    label="Reviews"
                    value={stats.review}
                  />
                  <StatCard
                    icon={<EpisodesIcon />}
                    label="Episodes Watched"
                    value={stats.totalEpisodes}
                  />
                </div>

                <div className="flex flex-wrap select-none gap-2">
                  <button
                    onClick={() => setShowEdit(true)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <EditIcon className="w-4 h-4" />
                    Edit Profile
                  </button>
                  {showEdit && (
                    <EditProfile
                      user={currentUser}
                      onClose={() => setShowEdit(false)}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 pt-20 lg:grid-cols-3 gap-8">
          {/* Left Column - Recent Activity & Watchlist */}
          <div className="space-y-8">
            <section className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-purple-900/30">
              <div className="flex select-none justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Reviews</h2>
                <button className="text-purple-300 hover:text-purple-100 transition-colors">
                  <ReviewsIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {userReviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-4 bg-gray-900/50 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <h3 className="font-medium text-purple-100 mb-1">
                      {review.anime}
                    </h3>
                    <p className="text-gray-300 text-sm line-clamp-2">
                      {review.comment}
                    </p>
                    <div className="flex items-center select-none mt-2 gap-3 ">
                      <span className="text-purple-300 text-sm">
                        {review.date}
                      </span>
                      <span className="text-yellow-400 text-sm">
                        {review.rating}/10
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-4 select-none w-full py-2 border border-purple-700 rounded-lg hover:bg-purple-900/30 transition-colors">
                View All Reviews
              </button>
            </section>

            <section className="bg-gray-800/50 select-none backdrop-blur-sm rounded-xl p-6 shadow-xl border border-purple-900/30">
              <div className="flex justify-between  items-center mb-4">
                <h2 className="text-xl font-bold">Bookmark</h2>
                <button className="text-purple-300 hover:text-purple-100 transition-colors">
                  <BookmarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {bookmarks.length > 0 ? (
                  bookmarks.slice(0, 4).map((anime) => (
                    <div
                      key={anime.malId}
                      className="group relative overflow-hidden rounded-lg aspect-[2/3]"
                    >
                      <img
                        src={anime.image}
                        alt={anime.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 flex flex-col justify-end">
                        <h3 className="font-medium text-sm line-clamp-2">
                          {anime.title}
                        </h3>
                      </div>
                      <div className="absolute top-2 right-2 flex gap-2">
                        <div className="font-normal bg-yellow-500 text-white text-xs xl:text-base px-2 py-1 rounded">
                          ★{anime.score || "???"}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 col-span-2">
                    No bookmarked anime yet.
                  </p>
                )}
              </div>
              <Link
                href="/bookmarks"
                className="mt-4 w-full py-2 border border-purple-700 rounded-lg hover:bg-purple-900/30 transition-colors block text-center"
              >
                View Full Bookmark
              </Link>
            </section>
          </div>

          <section className="bg-gray-800/50 select-none backdrop-blur-sm rounded-xl p-6 shadow-xl border border-purple-900/30">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">Trending Anime</h2>
                <FireIcon className="w-5 h-5 text-orange-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {trendingAnime.map((anime) => (
                <div
                  key={anime.mal_id}
                  className="group relative overflow-hidden rounded-lg h-78"
                >
                  <img
                    src={anime.images.jpg.large_image_url}
                    alt={anime.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent p-4 flex flex-col justify-end">
                    <h3 className="font-medium line-clamp-1">{anime.title}</h3>
                  </div>
                  <div className="absolute bg-yellow-500 top-2 right-2 text-white text-sm md:text-base px-2 py-1 rounded flex items-center gap-1">
                    <span> ★</span>
                    <span>{anime.score || "10"}</span>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/ViewAll/anime/topanime">
              <button className="mt-4 w-full py-2 border border-purple-700 rounded-lg hover:bg-purple-900/30 transition-colors flex items-center justify-center gap-2 group">
                <span>View All Trending</span>
              </button>
            </Link>
          </section>

          {/* Right Column - Stats & Achievements */}
          <div className="space-y-8">
            {/* Statistics */}
            <section className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-purple-900/30">
              <h2 className="text-xl select-none  font-bold mb-4">
                Statistics
              </h2>

              <div className="space-y-4 select-none">
                <StatBar
                  label="Completed"
                  value={Math.round((stats.completed / stats.totalAnime) * 100)}
                  color="bg-green-500"
                />
                <StatBar
                  label="Watching"
                  value={Math.round((stats.watching / stats.totalAnime) * 100)}
                  color="bg-purple-500"
                />
                <StatBar
                  label="On Hold"
                  value={Math.round((stats.onHold / stats.totalAnime) * 100)}
                  color="bg-yellow-500"
                />
                <StatBar
                  label="Dropped"
                  value={Math.round((stats.dropped / stats.totalAnime) * 100)}
                  color="bg-red-500"
                />
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex justify-between text-sm">
                  <span>Total Anime:</span>
                  <span className="font-medium">{stats.totalAnime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Episodes:</span>
                  <span className="font-medium">{stats.totalEpisodes}</span>
                </div>
              </div>
            </section>

            {/* Achievements */}
            <section className="bg-gray-800/50 select-none backdrop-blur-sm rounded-xl p-6 shadow-xl border border-purple-900/30">
              <h2 className="text-xl font-bold mb-4">Achievements</h2>

              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-3 rounded-lg transition-all ${
                      achievement.earned
                        ? "bg-purple-900/30 border border-purple-800"
                        : "bg-gray-900/30 border border-gray-800"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-1 p-2 rounded-full ${
                          achievement.earned
                            ? "bg-purple-800 text-yellow-300"
                            : "bg-gray-800 text-gray-500"
                        }`}
                      >
                        {achievement.earned ? (
                          <TrophyIcon className="w-4 h-4" />
                        ) : (
                          <LockIcon className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3
                          className={`font-medium ${
                            achievement.earned ? "text-white" : "text-gray-400"
                          }`}
                        >
                          {achievement.title}
                        </h3>
                        <p
                          className={`text-sm ${
                            achievement.earned
                              ? "text-purple-300"
                              : "text-gray-500"
                          }`}
                        >
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.earned && (
                        <div className="mt-1 text-purple-400">
                          <CheckIcon className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-4 w-full py-2 border border-purple-700 rounded-lg hover:bg-purple-900/30 transition-colors">
                View All Achievements
              </button>
            </section>
          </div>
        </div>

        {/* Anime Calendar Section */}
        <section className="mt-12 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-purple-900/30">
          <h2 className="text-xl select-none font-bold mb-4">Anime Calendar</h2>

          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="pb-3 px-2 font-medium text-purple-300">Day</th>
                  <th className="pb-3 px-2 font-medium text-purple-300">
                    Anime
                  </th>
                  <th className="pb-3 px-2 font-medium text-purple-300">
                    Time
                  </th>
                  <th className="pb-3 px-2 font-medium text-purple-300">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800 hover:bg-gray-700/30 transition-colors">
                  <td className="py-3 px-2">Monday</td>
                  <td className="py-3 px-2 font-medium">Attack on Titan</td>
                  <td className="py-3 px-2">20:00</td>
                  <td className="py-3 px-2">
                    <span className="px-2 py-1 rounded text-xs bg-purple-900/50 text-purple-300">
                      Scheduled
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-gray-800 hover:bg-gray-700/30 transition-colors">
                  <td className="py-3 px-2">Tuesday</td>
                  <td className="py-3 px-2 font-medium">Demon Slayer</td>
                  <td className="py-3 px-2">19:30</td>
                  <td className="py-3 px-2">
                    <span className="px-2 py-1 rounded text-xs bg-green-900/50 text-green-300">
                      Completed
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-gray-800 hover:bg-gray-700/30 transition-colors">
                  <td className="py-3 px-2">Thursday</td>
                  <td className="py-3 px-2 font-medium">My Hero Academia</td>
                  <td className="py-3 px-2">21:00</td>
                  <td className="py-3 px-2">
                    <span className="px-2 py-1 rounded text-xs bg-purple-900/50 text-purple-300">
                      Scheduled
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-700/30 transition-colors">
                  <td className="py-3 px-2">Saturday</td>
                  <td className="py-3 px-2 font-medium">One Piece</td>
                  <td className="py-3 px-2">18:00</td>
                  <td className="py-3 px-2">
                    <span className="px-2 py-1 rounded text-xs bg-yellow-900/50 text-yellow-300">
                      On Hold
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <button className="mt-4 select-none py-2 px-4 border border-purple-700 rounded-lg hover:bg-purple-900/30 transition-colors">
            Add New Schedule
          </button>
        </section>
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ icon, label, value }) => (
  <div className="bg-gray-900/50 p-3 rounded-lg flex items-center gap-3 hover:bg-gray-800 transition-colors">
    <div className="bg-purple-900/50 p-2 rounded-md">{icon}</div>
    <div>
      <p className="text-sm text-purple-300">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  </div>
);

const StatBar = ({ label, value, color }) => (
  <div>
    <div className="flex justify-between mb-1">
      <span className="text-sm">{label}</span>
      <span className="text-sm font-medium">{value}%</span>
    </div>
    <div className="w-full bg-gray-700 rounded-full h-2">
      <div
        className={`h-2 rounded-full ${color}`}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

// Custom SVG Icons
const AnimeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 text-purple-300"
  >
    <path
      d="M4 5.5C4 4.11929 5.11929 3 6.5 3H17.5C18.8807 3 20 4.11929 20 5.5V18.5C20 19.8807 18.8807 21 17.5 21H6.5C5.11929 21 4 19.8807 4 18.5V5.5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 7H12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 11H16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 15H16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CompletedIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 text-green-300"
  >
    <path
      d="M9 12L11 14L15 10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ReviewsIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 text-purple-300"
  >
    <path
      d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 9h10M7 13h7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const EpisodesIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 text-blue-300"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 19C8.13 19 5 15.87 5 12C5 8.13 8.13 5 12 5C15.87 5 19 8.13 19 12C19 15.87 15.87 19 12 19Z"
      fill="currentColor"
    />
    <path d="M12 7V12L15 14" fill="currentColor" />
  </svg>
);

const PencilIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 text-white"
  >
    <path
      d="M14.7 2.3C14.3 1.9 13.7 1.9 13.3 2.3L5.4 10.2C5.2 10.4 5 10.8 5 11.1V17.5C5 18.3 5.7 19 6.5 19H12.9C13.2 19 13.6 18.8 13.8 18.6L21.7 10.7C22.1 10.3 22.1 9.7 21.7 9.3L14.7 2.3Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 19V21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 19V21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18 19V21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EditIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
  >
    <path
      d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.5 2.5C18.8978 2.10218 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10218 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SettingsIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
  >
    <path
      d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6103 23 12.08 23C11.5497 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6103 1 12.08C1 11.5497 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BookmarkIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 text-purple-300"
  >
    <path
      d="M5 5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21L12 17L5 21V5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FireIcon = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={`w-5 h-5 ${className}`}
  >
    <defs>
      <linearGradient id="fireGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFA500" />
        <stop offset="100%" stopColor="#FF4500" />
      </linearGradient>
    </defs>
    <path
      fill="url(#fireGradient)"
      d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.176 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152-.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 0 1 1.925-3.546 3.75 3.75 0 0 1 3.255 3.718Z"
    />
  </svg>
);

const TrophyIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
  >
    <path
      d="M12 15C14.2091 15 16 13.2091 16 11V5H8V11C8 13.2091 9.79086 15 12 15Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 8V14C19 17 17 20 12 20C7 20 5 17 5 14V8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1 9H5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 9H23"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LockIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
  >
    <path
      d="M8 11V7C8 5.93913 8.42143 4.92172 9.17157 4.17157C9.92172 3.42143 10.9391 3 12 3C13.0609 3 14.0783 3.42143 14.8284 4.17157C15.5786 4.92172 16 5.93913 16 7V11"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 11V19C5 20.0609 5.42143 21.0783 6.17157 21.8284C6.92172 22.5786 7.93913 23 9 23H15C16.0609 23 17.0783 22.5786 17.8284 21.8284C18.5786 21.0783 19 20.0609 19 19V11"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4 text-yellow-300"
  >
    <path
      d="M20 6L9 17L4 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default DashboardContent;

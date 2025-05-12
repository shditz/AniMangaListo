//app/users/dashboard/page.jsx

import { authUserSession } from "@/app/lib/auth-libs";
import DashboardContent from "@/app/components/DashboardContent";

const getTrendingAnime = async () => {
  const response = await fetch("https://api.jikan.moe/v4/top/anime ");
  const data = await response.json();
  return data.data.slice(0, 8);
};

export const dynamic = "force-dynamic";

export default async function Page() {
  const user = await authUserSession();
  const trendingAnime = await getTrendingAnime();

  return <DashboardContent user={user} trendingAnime={trendingAnime} />;
}

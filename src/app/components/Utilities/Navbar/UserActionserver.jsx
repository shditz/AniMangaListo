//app/components/utilites/Navbar/UserActionserver.jsx

import { authUserSession } from "@/app/lib/auth-libs.js";
import UserAction from "./UserAction";

const UserActionServer = async () => {
  const user = await authUserSession();
  return <UserAction user={user || null} />;
};

export default UserActionServer;

// app/lib/auth-libs.js

import { getServerSession } from "next-auth";
import { authOption } from "../api/auth/[...nextauth]/route";

export const authUserSession = async () => {
  const session = await getServerSession(authOption);
  if (!session?.user) return null;

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
  };
};

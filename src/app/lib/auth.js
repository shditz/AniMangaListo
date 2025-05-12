// app/lib/auth.js
import { getServerSession } from "next-auth";
import { authOption } from "../api/auth/[...nextauth]/route";

export const auth = async () => {
  return await getServerSession(authOption);
};

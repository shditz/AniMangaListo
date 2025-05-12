//app/components/utilities/Navbar/UserAction.jsx

"use client";

import { signOut } from "next-auth/react";
import dynamic from "next/dynamic";
const NavButton = dynamic(() => import("../../NavButton"), {
  ssr: false,
});

export default function UserAction({ user }) {
  const isLoggedIn = Boolean(user?.email);

  return (
    <>
      {isLoggedIn ? (
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="hover:bg-purple-900/50 px-3 font-medium py-3 rounded-lg transition-colors duration-300"
        >
          Sign Out
        </button>
      ) : (
        <NavButton
          href="/api/auth/signin"
          className="hover:bg-purple-900/50 px-3 font-medium py-3 rounded-lg transition-colors duration-300"
        >
          Sign In
        </NavButton>
      )}
    </>
  );
}

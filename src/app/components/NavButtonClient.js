"use client";
import dynamic from "next/dynamic";

const NavButton = dynamic(() => import("./NavButton"), {
  ssr: false,
});

export default NavButton;

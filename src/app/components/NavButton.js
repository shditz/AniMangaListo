"use client";
import { useRouter } from "next/navigation";

export default function NavButton({ href, className, children }) {
  const router = useRouter();

  const handleClick = (e) => {
    e.preventDefault();

    window.dispatchEvent(
      new CustomEvent("startNavigation", { detail: { href } })
    );

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}

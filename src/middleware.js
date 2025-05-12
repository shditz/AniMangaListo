// middleware.js
export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/users/:path*", "/bookmark", "/api/auth/signin"],
};

// src/app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";

import GoogleProvider from "next-auth/providers/google";
import prisma from "@/app/lib/prisma";

export const authOption = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      try {
        if (session?.user) {
          const email = session.user.email.toLowerCase();
          const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email },
          });

          if (dbUser) {
            session.user = {
              id: dbUser.id,
              name: dbUser.name,
              email: dbUser.email,
              image: dbUser.image,
              expires: session.expires,
            };
          }
        }
        return session;
      } catch (error) {
        console.error("Session error:", error);
        return session;
      }
    },
    async signIn({ user, account, profile }) {
      try {
        const email = user.email?.toLowerCase();
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              email,
              name: user.name || profile?.name || profile?.login || "Anonymous",
              image: user.image || profile?.picture || profile?.avatar_url,
            },
          });
        }
        return true;
      } catch (error) {
        console.error("Sign-in error:", error);
        return false;
      }
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOption);

export { handler as GET, handler as POST };

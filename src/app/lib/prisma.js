//app/lib/prisma.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

export default prisma;

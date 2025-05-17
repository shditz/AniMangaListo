/*
  Warnings:

  - You are about to drop the `AnimeReview` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AnimeReview" DROP CONSTRAINT "AnimeReview_userId_fkey";

-- DropTable
DROP TABLE "AnimeReview";

-- CreateTable
CREATE TABLE "AnimeComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "malId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bookmarkedAnimeId" TEXT,

    CONSTRAINT "AnimeComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AnimeComment_userId_malId_key" ON "AnimeComment"("userId", "malId");

-- AddForeignKey
ALTER TABLE "AnimeComment" ADD CONSTRAINT "AnimeComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeComment" ADD CONSTRAINT "AnimeComment_bookmarkedAnimeId_fkey" FOREIGN KEY ("bookmarkedAnimeId") REFERENCES "BookmarkedAnime"("id") ON DELETE SET NULL ON UPDATE CASCADE;

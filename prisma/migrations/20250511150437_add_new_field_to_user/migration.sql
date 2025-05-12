/*
  Warnings:

  - You are about to drop the `Anime` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_anime_bookmark` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_anime_bookmark" DROP CONSTRAINT "user_anime_bookmark_anime_id_fkey";

-- DropForeignKey
ALTER TABLE "user_anime_bookmark" DROP CONSTRAINT "user_anime_bookmark_user_id_fkey";

-- DropTable
DROP TABLE "Anime";

-- DropTable
DROP TABLE "user_anime_bookmark";

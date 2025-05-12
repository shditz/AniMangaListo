-- CreateTable
CREATE TABLE "Anime" (
    "mal_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "score" DOUBLE PRECISION,
    "episodes" INTEGER,
    "type" TEXT,

    CONSTRAINT "Anime_pkey" PRIMARY KEY ("mal_id")
);

-- CreateTable
CREATE TABLE "user_anime_bookmark" (
    "user_id" TEXT NOT NULL,
    "anime_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_anime_bookmark_pkey" PRIMARY KEY ("user_id","anime_id")
);

-- AddForeignKey
ALTER TABLE "user_anime_bookmark" ADD CONSTRAINT "user_anime_bookmark_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_anime_bookmark" ADD CONSTRAINT "user_anime_bookmark_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "Anime"("mal_id") ON DELETE RESTRICT ON UPDATE CASCADE;

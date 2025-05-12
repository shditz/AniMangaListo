//app/src/app/api/bookmark/route.js

import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { auth } from "@/app/lib/auth";

export async function POST(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { malId, title, imageUrl, score } = await request.json();

  if (!malId || !title || !imageUrl) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const existing = await prisma.bookmarkedAnime.findFirst({
      where: {
        userId: session.user.id,
        malId: parseInt(malId),
      },
    });

    if (existing) {
      await prisma.bookmarkedAnime.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ status: "removed" });
    } else {
      await prisma.bookmarkedAnime.create({
        data: {
          userId: session.user.id,
          malId: parseInt(malId),
          title,
          image: imageUrl,
          score: score ? parseFloat(score) : null,
        },
      });
      return NextResponse.json({ status: "added" });
    }
  } catch (error) {
    console.error("Error handling bookmark:", error.message);
    return NextResponse.json(
      { error: "Failed to update bookmark", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const bookmarks = await prisma.bookmarkedAnime.findMany({
      where: { userId: session.user.id },
    });
    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error("Failed to fetch bookmarks:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const { searchParams } = new URL(request.url);
  const malId = searchParams.get("malId");

  if (!malId || isNaN(malId)) {
    return NextResponse.json(
      { error: "Invalid malId parameter" },
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    const deleteResult = await prisma.bookmarkedAnime.deleteMany({
      where: {
        userId: session.user.id,
        malId: parseInt(malId),
      },
    });

    if (deleteResult.count === 0) {
      return NextResponse.json(
        { error: "Bookmark not found" },
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return NextResponse.json(
      { status: "deleted" },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        error: "Failed to delete bookmark",
        details: error.message,
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

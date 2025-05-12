//app/api/bookmark/route.js
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function POST(request) {
  // lazy import
  const { auth } = await import("@/app/lib/auth");
  const prismaModule = await import("@/app/lib/prisma");
  const prisma = prismaModule.default;

  const session = await auth(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { malId, title, imageUrl, score } = body;

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
        malId: Number(malId),
      },
    });

    if (existing) {
      await prisma.bookmarkedAnime.delete({ where: { id: existing.id } });
      return NextResponse.json({ status: "removed" });
    } else {
      await prisma.bookmarkedAnime.create({
        data: {
          userId: session.user.id,
          malId: Number(malId),
          title,
          image: imageUrl,
          score: score != null ? parseFloat(score) : null,
        },
      });
      return NextResponse.json({ status: "added" });
    }
  } catch (e) {
    console.error("Error handling bookmark:", e);
    return NextResponse.json(
      { error: "Failed to update bookmark", details: e.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  const { auth } = await import("@/app/lib/auth");
  const prismaModule = await import("@/app/lib/prisma");
  const prisma = prismaModule.default;

  const session = await auth(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const bookmarks = await prisma.bookmarkedAnime.findMany({
      where: { userId: session.user.id },
    });
    return NextResponse.json(bookmarks);
  } catch (e) {
    console.error("Failed to fetch bookmarks:", e);
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  const { auth } = await import("@/app/lib/auth");
  const prismaModule = await import("@/app/lib/prisma");
  const prisma = prismaModule.default;

  const session = await auth(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const malId = searchParams.get("malId");
  if (!malId || isNaN(Number(malId))) {
    return NextResponse.json(
      { error: "Invalid malId parameter" },
      { status: 400 }
    );
  }

  try {
    const deleteResult = await prisma.bookmarkedAnime.deleteMany({
      where: {
        userId: session.user.id,
        malId: Number(malId),
      },
    });

    if (deleteResult.count === 0) {
      return NextResponse.json(
        { error: "Bookmark not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ status: "deleted" });
  } catch (e) {
    console.error("Database error:", e);
    return NextResponse.json(
      { error: "Failed to delete bookmark", details: e.message },
      { status: 500 }
    );
  }
}

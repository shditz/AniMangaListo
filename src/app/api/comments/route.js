import { auth } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { malId, content, rating, animeTitle } = await request.json();

    if (!malId || !content || !rating) {
      return new Response("Missing required fields", { status: 400 });
    }

    if (rating < 1 || rating > 10) {
      return new Response("Rating must be between 1-10", { status: 400 });
    }

    const existingComment = await prisma.animeComment.findFirst({
      where: {
        userId: session.user.id,
        malId: parseInt(malId),
      },
    });

    if (existingComment) {
      return new Response("Already commented", { status: 400 });
    }

    const comment = await prisma.animeComment.create({
      data: {
        userId: session.user.id,
        malId: parseInt(malId),
        animeTitle,
        content,
        rating: parseInt(rating),
      },
      include: {
        user: true,
      },
    });

    return new Response(JSON.stringify(comment), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const malId = searchParams.get("malId");
    const userId = searchParams.get("userId");

    const whereClause = {};

    if (malId) whereClause.malId = parseInt(malId);
    if (userId) whereClause.userId = userId;

    const comments = await prisma.animeComment.findMany({
      where: whereClause,
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    return new Response(JSON.stringify(comments), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await auth();
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("commentId");

    if (!commentId) {
      return new Response("Missing commentId", { status: 400 });
    }

    const comment = await prisma.animeComment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      return new Response("Comment not found", { status: 404 });
    }

    if (comment.userId !== session.user.id) {
      return new Response("Forbidden", { status: 403 });
    }

    await prisma.animeComment.delete({
      where: {
        id: commentId,
      },
    });

    return new Response(
      JSON.stringify({ message: "Comment deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error deleting comment:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

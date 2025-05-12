// app/api/users/route.js
export const dynamic = "force-dynamic";

export async function PUT(request) {
  try {
    const [{ getServerSession }, { authOption }, prismaModule] =
      await Promise.all([
        import("next-auth"),
        import("@/app/api/auth/[...nextauth]/route"),
        import("@/app/lib/prisma"),
      ]);

    const prisma = prismaModule.default;
    const session = await getServerSession(authOption);

    if (!session?.user?.email) {
      return Response.json({ status: 401, message: "Unauthorized" });
    }

    const { name, image } = await request.json();
    const email = session.user.email.toLowerCase();

    if (!name || name.trim().length < 3) {
      return Response.json({
        status: 400,
        message: "Name must be at least 3 characters",
      });
    }

    if (image && !isValidUrl(image)) {
      return Response.json({
        status: 400,
        message: "Invalid image URL",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        name: name.trim(),
        image: image || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    return Response.json({
      status: 200,
      data: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Update error:", error);
    return Response.json({
      status: 500,
      message: error.message || "An error occurred while updating the profile",
    });
  }
}

function isValidUrl(string) {
  if (string.startsWith("/uploads/")) return true;
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

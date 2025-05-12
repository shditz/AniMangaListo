import { IncomingForm } from "formidable";
import { promises as fs } from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file) {
    return Response.json({ status: 400, message: "No file uploaded" });
  }

  try {
    const buffer = await file.arrayBuffer();
    const filename = `${Date.now()}-${file.name}`;
    const uploadDir = path.join(process.cwd(), "public/uploads");

    // Ensure upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, Buffer.from(buffer));

    return Response.json({
      status: 200,
      imageUrl: `/uploads/${filename}`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json({
      status: 500,
      message: "Error uploading file",
    });
  }
}

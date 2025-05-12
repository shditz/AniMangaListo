import { auth } from "@/app/lib/auth";

export async function GET() {
  const session = await auth();
  return new Response(JSON.stringify(session), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

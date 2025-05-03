import { fetchWithRetry } from "@/app/lib/jikan";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  let endpoint = searchParams.get("endpoint");

  if (
    !endpoint ||
    typeof endpoint !== "string" ||
    !/^[a-zA-Z0-9\-\/?&=]+$/.test(endpoint)
  ) {
    return new Response(
      JSON.stringify({ error: "Invalid or missing endpoint" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  endpoint = decodeURIComponent(endpoint.trim());

  try {
    const data = await fetchWithRetry(endpoint);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "max-age=3600",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
        code: error.code || "API_FETCH_ERROR",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

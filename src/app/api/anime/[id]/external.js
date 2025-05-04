export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const jikanRes = await fetch(
      `https://api.jikan.moe/v4/anime/${id}/external`
    );

    if (jikanRes.status === 404) {
      return res.status(200).json({ data: [] });
    }

    if (!jikanRes.ok) {
      return res.status(jikanRes.status).json({
        error: "Jikan API Error",
        status: jikanRes.status,
        data: [],
      });
    }

    const jikanData = await jikanRes.json();
    res.status(200).json({ data: jikanData.data });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
      data: [],
    });
  }
}

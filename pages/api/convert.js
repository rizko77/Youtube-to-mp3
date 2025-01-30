export default async function handler(req, res) {
  // Memastikan hanya menerima permintaan GET
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { url } = req.query; // Mengambil URL dari query parameter
  if (!url) {
    return res.status(400).json({ error: "Invalid YouTube URL" });
  }

  try {
    // Mengirim permintaan ke API YTMP3.cc
    const apiUrl = `https://ytmp3.cc/api/conversion?url=${encodeURIComponent(url)}`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Memeriksa apakah respons dari API berhasil
    if (!response.ok) {
      return res.status(500).json({ error: data.error || "Failed to convert video" });
    }

    // Mengembalikan data yang diterima dari API
    res.status(200).json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

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
    // Mengirim permintaan ke API RapidAPI
    const apiUrl = 'https://youtube-to-mp315.p.rapidapi.com/dl';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-key': '68f068c7c9msh3a1b43774965920p1f1547jsnc65160483d69',
        'x-rapidapi-host': 'youtube-to-mp315.p.rapidapi.com',
      },
      body: JSON.stringify({ url: url }),
    });

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

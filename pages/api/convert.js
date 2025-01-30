import { spawn } from "child_process";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: "Invalid YouTube URL" });
  }

  // Mengambil metadata video menggunakan yt-dlp untuk mendapatkan judul
  const ytDlpInfo = spawn("yt-dlp", ["-e", url]); // "-e" untuk hanya mengambil judul video

  let videoTitle = "";

  // Mendapatkan judul video dari output yt-dlp
  ytDlpInfo.stdout.on("data", (data) => {
    videoTitle += data.toString();
  });

  ytDlpInfo.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  ytDlpInfo.on("close", (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: "Failed to fetch video title" });
    }

    // Menghilangkan karakter newline atau spasi berlebih
    videoTitle = videoTitle.trim();

    // Mendefinisikan nama file dengan judul video yang diperoleh
    const fileName = `${videoTitle}.mp3`;

    // Menyiapkan proses download
    const ytDlp = spawn("yt-dlp", ["-x", "--audio-format", "mp3", "-o", "-", url]);

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "audio/mpeg");

    ytDlp.stdout.pipe(res);
  });
}

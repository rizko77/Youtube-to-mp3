import { spawn } from "child_process";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "Invalid YouTube URL" });
  }

  const ytDlp = spawn("yt-dlp", ["--get-title", "--get-thumbnail", url]);

  let title = "";
  let thumbnail = "";

  ytDlp.stdout.on("data", (data) => {
    const lines = data.toString().trim().split("\n");
    title = lines[0];
    thumbnail = lines[1];
  });

  ytDlp.on("close", (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: "Error retrieving video info" });
    }

    res.status(200).json({ title, thumbnail });
  });
}

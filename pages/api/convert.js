import { spawn } from "child_process";

export default function handler(req, res) {
  if (req.method !== "GET") {
    console.error("Method Not Allowed");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { url } = req.query;
  if (!url) {
    console.error("Invalid YouTube URL");
    return res.status(400).json({ error: "Invalid YouTube URL" });
  }

  const ytDlpInfo = spawn("yt-dlp", ["-e", url]);

  let videoTitle = "";

  ytDlpInfo.stdout.on("data", (data) => {
    videoTitle += data.toString();
  });

  ytDlpInfo.stderr.on("data", (data) => {
    console.error(`yt-dlp info stderr: ${data}`);
  });

  ytDlpInfo.on("close", (code) => {
    if (code !== 0) {
      console.error(`yt-dlp info process exited with code: ${code}`);
      return res.status(500).json({ error: "Failed to fetch video title" });
    }

    videoTitle = videoTitle.trim();
    const fileName = `${videoTitle}.mp3`;

    const ytDlp = spawn("yt-dlp", ["-x", "--audio-format", "mp3", "-o", "-", url]);

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "audio/mpeg");

    ytDlp.stdout.pipe(res);

    ytDlp.stderr.on("data", (data) => {
      console.error(`yt-dlp conversion stderr: ${data}`);
    });

    ytDlp.on("close", (code) => {
      if (code !== 0) {
        console.error(`yt-dlp conversion process exited with code: ${code}`);
        return res.status(500).json({ error: "Failed to convert video" });
      }
    });
  });

  ytDlpInfo.on("error", (err) => {
    console.error(`Failed to start yt-dlp: ${err}`);
    return res.status(500).json({ error: "Internal Server Error" });
  });
}

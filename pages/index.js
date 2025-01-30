import { useState } from "react";
import { Helmet } from "react-helmet";
import Head from "next/head"; // import Head from next/head

export default function Home() {
  const [url, setUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // ✅ Tambahkan State menuOpen
  const [isConverting, setIsConverting] = useState(false); // State untuk status konversi
  const [progress, setProgress] = useState(0); // State untuk progress bar

  const handleInputChange = async (e) => {
    setUrl(e.target.value);

    if (e.target.value.includes("youtube.com") || e.target.value.includes("youtu.be")) {
      const response = await fetch("/api/get-video-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: e.target.value }),
      });

      if (response.ok) {
        const data = await response.json();
        setVideoInfo(data);
      } else {
        setVideoInfo(null);
      }
    } else {
      setVideoInfo(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    window.location.href = `/api/convert?url=${encodeURIComponent(url)}`;
    setIsConverting(true); // Mulai proses konversi
    setProgress(0); // Reset progress bar

    // Proses konversi (mimicking)
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval); // Stop proses ketika sudah selesai
          return 100;
        }
        return prevProgress + 10; // Update progress bar
      });
    }, 500); // Update setiap 500ms
  };





  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* SEO, Title, and Favicon */}
      <Head>
        <meta name="description" content="Yt2Audio - Convert YouTube videos to MP3 easily" />
        <meta name="keywords" content="YouTube, MP3, converter, download, audio, youtube to mp3, ytmp3, y2mate" />
        <meta name="author" content="rizko77, Rizko Imsar" />
        <title>Yt2Audio Converter</title>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      
      {/* ✅ Navbar */}
      <nav className="bg-gray-800 shadow-lg p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand di kiri */}
        <a href="/" className="text-2xl font-bold text-blue-400">Yt2Audio</a>

        {/* Toggle Button (Mobile) */}
        <button 
          onClick={() => setMenuOpen(!menuOpen)} 
          className="md:hidden text-white text-2xl focus:outline-none"
        >
          {menuOpen ? "✖" : "☰"}
        </button>

        {/* Menu untuk Desktop */}
        <div className="hidden md:flex space-x-6">
          <a href="/" className="text-white hover:text-blue-400 py-2 md:py-0">Home</a>
          <a href="/t2v" className="text-white hover:text-blue-400 py-2 md:py-0">Tentang</a>
          <a href="/about" className="text-white hover:text-blue-400 py-2 md:py-0">Yt2Video</a>
          <a href="https://github.com/rizko77" className="text-white hover:text-blue-400 py-2 md:py-0">GitHub</a>
        </div>
      </div>

      {/* Menu untuk Mobile (toggle) */}
      {menuOpen && (
              <div className="md:hidden bg-gray-800 p-4 space-y-4 text-center">
                <a href="/" className="text-white hover:text-blue-400 block py-2">Home</a>
                <a href="/t2v" className="text-white hover:text-blue-400 block py-2">Tentang</a>
                <a href="/about" className="text-white hover:text-blue-400 block py-2">Yt2Video</a>
                <a href="https://github.com/rizko77" className="text-white hover:text-blue-400 block py-2">GitHub</a>
              </div>
            )}
    </nav>


      {/* ✅ Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center px-4">
        <div className="mt-10 p-6 bg-gray-800 rounded-lg shadow-lg w-full max-w-lg text-center">
          <h1 className="text-3xl text-blue-500 font-semibold mb-4">Konverter YouTube to MP3</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={url}
              onChange={handleInputChange}
              placeholder="Masukkan URL YouTube..."
              className="w-full p-3 text-black rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-lg transition duration-300 hover:bg-blue-400">
              Convert to MP3
            </button>
          </form>

          {videoInfo && (
            <div className="mt-4">
              <h2 className="text-xl text-blue-400 font-medium">{videoInfo.title}</h2>
              <img src={videoInfo.thumbnail} className="mt-2 w-48 h-48 object-cover mx-auto rounded-lg shadow-md" alt="Video Thumbnail" />
            </div>
          )}

          {/* ✅ Progress Bar */}
          {isConverting && (
            <div className="mt-4">
              <p className="text-white text-lg">Proses konversi...</p>
              <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-white text-sm text-center mt-2">{progress}%</p>
            </div>
          )}
        </div>

        {/* ✅ Info Section */}
        <div className="mt-10 p-6 bg-gray-800 rounded-lg shadow-lg w-full max-w-lg text-center">
          <h2 className="text-2xl text-blue-400 mb-4">Tentang Yt2Audio</h2>
          <p className="text-white-400 text-sm leading-relaxed">
            YT2Audio adalah aplikasi web gratis yang memungkinkan pengguna mengonversi dan mengunduh video dari YouTube dalam format MP3 dengan cepat dan aman.
          </p>

          <h3 className="text-xl text-blue-400 font-medium mt-6">Cara Menggunakan</h3>
          <ul className="list-decimal pl-6 text-gray-300 text-left mt-4 space-y-2">
            <li><span className="font-semibold text-white">Cari Video:</span> Buka YouTube dan cari video yang ingin dikonversi.</li>
            <li><span className="font-semibold text-white">Salin URL:</span> Salin URL video dari browser.</li>
            <li><span className="font-semibold text-white">Masukkan URL:</span> Tempelkan URL ke dalam kolom input di atas.</li>
            <li><span className="font-semibold text-white">Klik Convert:</span> Tekan tombol "Convert to MP3".</li>
            <li><span className="font-semibold text-white">Download MP3:</span> Klik "Download MP3" setelah konversi selesai.</li>
          </ul>
        </div>
      </div>

      <br></br>

      {/* ✅ Footer - Tetap di Bawah */}
      <footer className="bg-gray-800 w-full py-6 text-center">
        <p className="text-white text-sm">
          Development by <a href="https://github.com/rizko77" className="text-blue-400 hover:underline" target="_blank">Rizko Imsar (rizko77)</a>
        </p>
        
        <div className="mt-2 space-x-4">
          <a href="#" className="text-white-400 hover:underline text-sm">Hak Cipta</a> | 
          <a href="#" className="text-whitw-400 hover:underline text-sm">Ketentuan Penggunaan</a>
        </div>
      </footer>
    </div>
  );
}

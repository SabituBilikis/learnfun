import { useState } from "react";
import { Link } from "react-router";
import learnFunLogo from "@/imports/Learn_fun.png";
import { speak } from "@/lib/speech";

export function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Interactive Phonics State
  const [selectedPhonicsLetter, setSelectedPhonicsLetter] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Interactive Number Counting State
  const [countedStars, setCountedStars] = useState(5);

  const googlePlayUrl = "https://play.google.com/store/apps/details?id=com.learnfunkids.app";

  const phonicsLetters = [
    { letter: "Aa", word: "Apple", sound: "/æ/", emoji: "🍎", phrase: "A is for Apple! Ah, ah, apple." },
    { letter: "Bb", word: "Ball", sound: "/b/", emoji: "⚽", phrase: "B is for Ball! Buh, buh, ball." },
    { letter: "Cc", word: "Cat", sound: "/k/", emoji: "🐱", phrase: "C is for Cat! Kuh, kuh, cat." },
    { letter: "Dd", word: "Duck", sound: "/d/", emoji: "🦆", phrase: "D is for Duck! Duh, duh, duck." }
  ];

  const handlePlayPhonics = async (index: number) => {
    setSelectedPhonicsLetter(index);
    setIsPlayingAudio(true);
    const item = phonicsLetters[index];
    await speak(item.phrase, { rate: 0.75, pitch: 1.3 });
    setIsPlayingAudio(false);
  };

  const handleStarClick = async (starIndex: number) => {
    const newCount = starIndex + 1;
    setCountedStars(newCount);
    await speak(`${newCount}! ${newCount === 1 ? "star" : "stars"}!`, { rate: 0.8, pitch: 1.35 });
  };

  const faqs = [
    {
      q: "Does Learn Fun work completely offline without Wi-Fi?",
      a: "Yes! Learn Fun is built offline-first from the ground up. Once installed from Google Play or loaded in your browser, all letter cards, human voice audio phonics, numbers 1–20, and mini-games function without any internet connection."
    },
    {
      q: "Are there any third-party ads, popups, or in-app purchases?",
      a: "Never. Learn Fun is 100% ad-free and free of subscriptions or hidden purchases. Toddlers can safely tap and explore without seeing commercial ads or encountering accidental paywalls."
    },
    {
      q: "What age range is Learn Fun designed for?",
      a: "Learn Fun is thoughtfully designed for toddlers and preschoolers aged 1 to 5 years old. The interface has high-contrast visuals, large touch targets, and intuitive audio feedback suited for little fingers."
    },
    {
      q: "How does the human-recorded voice phonics system work?",
      a: "Unlike robotic synthetic speech engines that can mispronounce early letter sounds, Learn Fun utilizes natural human voice recordings for phonics, helping children develop accurate articulation and phonemic awareness."
    },
    {
      q: "How does the star unlock and streak system motivate kids?",
      a: "Children earn cheerful stars when finishing interactive learning sessions. Star milestones and daily streaks gently unlock upcoming categories and games, celebrating consistency without stress."
    },
    {
      q: "How do parent controls and the security PIN work?",
      a: "The dedicated Parent Zone is protected behind a child-proof PIN security gate (math verification challenge or custom code), ensuring toddlers remain in the safe learning view while parents manage profiles and progress."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#1E1B4B] font-fredoka flex flex-col selection:bg-[#FFC800] selection:text-[#1E1B4B] scroll-smooth">
      {/* ── 1. Top Navigation Bar ──────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-sm">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={learnFunLogo}
            alt="Learn Fun Logo"
            className="h-10 md:h-12 w-auto object-contain mix-blend-multiply"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-gray-600">
          <a href="#overview" className="hover:text-[#2563EB] transition-colors">Overview</a>
          <a href="#phonics" className="hover:text-[#2563EB] transition-colors">Phonics</a>
          <a href="#numbers" className="hover:text-[#2563EB] transition-colors">Numbers & Math</a>
          <a href="#showcase" className="hover:text-[#2563EB] transition-colors">App Features</a>
          <a href="#pricing" className="hover:text-[#2563EB] transition-colors">100% Free</a>
          <a href="#faq" className="hover:text-[#2563EB] transition-colors">Parent FAQ</a>
          <a href="#resources" className="hover:text-[#2563EB] transition-colors">Resources</a>
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <a
            href={googlePlayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center hover:scale-105 active:scale-95 transition-transform"
          >
            <img src="/google-play-badge.svg" alt="Get it on Google Play" className="h-10 w-auto" />
          </a>
          <Link
            to="/play"
            className="flex items-center gap-1.5 px-4 md:px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white text-xs md:text-sm font-bold shadow-md shadow-blue-200 hover:from-[#1D4ED8] hover:to-[#1E40AF] hover:scale-105 active:scale-95 transition-all"
          >
            <span>Play Online</span>
            <span className="text-xs">›</span>
          </Link>
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            <span className="text-xl">{mobileMenuOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </header>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-6 py-4 flex flex-col gap-3 font-semibold text-sm shadow-lg z-40">
          <a href="#overview" onClick={() => setMobileMenuOpen(false)} className="py-1 text-gray-700 hover:text-blue-600">Overview</a>
          <a href="#phonics" onClick={() => setMobileMenuOpen(false)} className="py-1 text-gray-700 hover:text-blue-600">Phonics</a>
          <a href="#numbers" onClick={() => setMobileMenuOpen(false)} className="py-1 text-gray-700 hover:text-blue-600">Numbers & Math</a>
          <a href="#showcase" onClick={() => setMobileMenuOpen(false)} className="py-1 text-gray-700 hover:text-blue-600">App Features</a>
          <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="py-1 text-gray-700 hover:text-blue-600">100% Free</a>
          <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="py-1 text-gray-700 hover:text-blue-600">Parent FAQ</a>
          <a href="#resources" onClick={() => setMobileMenuOpen(false)} className="py-1 text-gray-700 hover:text-blue-600">Resources</a>
        </div>
      )}

      {/* ── 2. Centered Hero Section (Matching Reference SaaS Layout) ─── */}
      <section id="overview" className="relative pt-12 md:pt-20 pb-20 px-4 md:px-8 max-w-6xl mx-auto w-full text-center flex flex-col items-center">
        {/* Floating Accent Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-3/4 max-w-3xl h-96 bg-gradient-to-b from-blue-100/60 via-purple-100/40 to-transparent blur-3xl -z-10 rounded-full" />

        {/* Small Category Badge Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shadow-sm mb-6">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Offline-First Early Learning for Ages 1–5
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#1E1B4B] max-w-4xl leading-[1.15] tracking-tight">
          Simplify, Engage, and Inspire With Our Intuitive <span className="bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#0D9488] bg-clip-text text-transparent">Kids Learning App</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg text-gray-600 font-medium max-w-2xl mt-5 leading-relaxed">
          An ad-free, interactive learning world helping toddlers and preschoolers master ABCs, human audio phonics, numbers 1–20, shapes, colors, and mini-games.
        </p>

        {/* Dual Centered CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 w-full sm:w-auto">
          <Link
            to="/play"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white text-sm md:text-base font-extrabold shadow-lg shadow-blue-300 hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>GET STARTED</span>
            <span className="text-sm">›</span>
          </Link>
          <a
            href={googlePlayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          >
            <img src="/google-play-badge.svg" alt="Get it on Google Play" className="h-12 w-auto" />
          </a>
        </div>

        {/* ── Central Mockup Container with Curved Arch & Floating Badges ── */}
        <div className="relative mt-14 w-full max-w-4xl mx-auto flex flex-col items-center">
          {/* Curved Semicircular Backdrop Arch (Matching Reference Design) */}
          <div className="absolute bottom-0 w-[80%] max-w-xl h-56 sm:h-72 rounded-t-full bg-gradient-to-t from-[#2563EB] via-[#38BDF8] to-[#60A5FA] opacity-90 -z-10" />

          {/* Floating Pill Tag 1 - Top Left */}
          <div className="hidden md:flex absolute -top-4 left-4 lg:-left-6 items-center gap-2 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-purple-100 shadow-xl shadow-purple-900/5 text-xs font-bold text-[#7C3AED] hover:scale-105 transition-transform">
            <span className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-sm">🎙️</span>
            <span>Human Voice Phonics</span>
          </div>

          {/* Floating Pill Tag 2 - Top Right */}
          <div className="hidden md:flex absolute -top-2 right-4 lg:-right-6 items-center gap-2 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-emerald-100 shadow-xl shadow-emerald-900/5 text-xs font-bold text-emerald-700 hover:scale-105 transition-transform">
            <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-sm">📶</span>
            <span>100% Offline-First</span>
          </div>

          {/* Floating Pill Tag 3 - Bottom Left */}
          <div className="hidden md:flex absolute bottom-12 -left-4 lg:-left-12 items-center gap-2 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-amber-100 shadow-xl shadow-amber-900/5 text-xs font-bold text-amber-800 hover:scale-105 transition-transform">
            <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-sm">⭐</span>
            <span>Star Unlocks & Streaks</span>
          </div>

          {/* Floating Pill Tag 4 - Bottom Right */}
          <div className="hidden md:flex absolute bottom-12 -right-4 lg:-right-12 items-center gap-2 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-blue-100 shadow-xl shadow-blue-900/5 text-xs font-bold text-blue-700 hover:scale-105 transition-transform">
            <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-sm">🛡️</span>
            <span>100% Ad-Free & Safe</span>
          </div>

          {/* Floating App Icon Bubbles (Scattered around the mockup matching reference) */}
          <div className="hidden sm:flex absolute -top-10 left-1/4 w-10 h-10 rounded-2xl bg-blue-500 text-white items-center justify-center text-lg shadow-lg -rotate-12 animate-pulse [animation-duration:6s]">
            🔤
          </div>
          <div className="hidden sm:flex absolute -top-8 right-1/4 w-10 h-10 rounded-2xl bg-emerald-500 text-white items-center justify-center text-lg shadow-lg rotate-12 animate-pulse [animation-duration:5s]">
            🔢
          </div>
          <div className="hidden lg:flex absolute top-1/2 -left-16 w-11 h-11 rounded-2xl bg-amber-400 text-purple-950 items-center justify-center text-xl shadow-lg -rotate-6">
            🧩
          </div>
          <div className="hidden lg:flex absolute top-1/2 -right-16 w-11 h-11 rounded-2xl bg-pink-500 text-white items-center justify-center text-xl shadow-lg rotate-6">
            🎨
          </div>

          {/* Minimal White Browser Mockup with Uncropped Demo Video */}
          <div className="w-full rounded-2xl sm:rounded-3xl bg-white border border-gray-200/90 shadow-[0_25px_60px_-15px_rgba(30,27,75,0.18)] overflow-hidden">
            {/* Minimal Browser Header with Traffic Light Dots & Domain */}
            <div className="px-4 sm:px-5 py-3 sm:py-3.5 bg-white border-b border-gray-100 flex items-center gap-3 sm:gap-4 select-none">
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FF5F56] inline-block" />
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FFBD2E] inline-block" />
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27C93F] inline-block" />
              </div>
              <div className="truncate text-xs sm:text-sm font-medium text-gray-500 font-sans tracking-tight">
                https://learnfunkids.vercel.app
              </div>
            </div>

            {/* Video Viewport: Uncropped Natural Video Display */}
            <div className="relative bg-[#1A0050] overflow-hidden w-full">
              <video
                src="/learn-fun-demo.mp4"
                autoPlay
                loop
                muted
                playsInline
                controls
                preload="auto"
                className="w-full h-auto block object-contain"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          <p className="text-center text-[11px] sm:text-xs font-medium text-gray-500 mt-3">
            Real desktop and tablet browser experience showing interactive lesson modules, phonics, and touch-first interactions.
          </p>
        </div>
      </section>

      {/* ── 3. Trust & Core Values Bar (Matching Reference Partner Bar) ─── */}
      <section className="border-y border-gray-200/70 bg-white py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="shrink-0">
            <span className="text-xs font-black uppercase tracking-wider text-gray-400 block">
              BUILT FOR EARLY CHILDHOOD 💙
            </span>
            <span className="text-sm font-extrabold text-[#1E1B4B]">
              Core Commitments to Parents & Educators
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 sm:gap-6 text-xs sm:text-sm font-bold text-gray-700">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100">
              <span className="text-blue-600">✓</span> 100% Offline-First
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100">
              <span className="text-blue-600">✓</span> Zero Third-Party Ads
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100">
              <span className="text-blue-600">✓</span> Human Voice Audio
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100">
              <span className="text-blue-600">✓</span> Child-Proof PIN Gate
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100">
              <span className="text-blue-600">✓</span> Ages 1–5 Tailored
            </span>
          </div>
        </div>
      </section>

      {/* ── 4. Split Section 1: Phonics & Language (Media Left / Content Right) ─── */}
      <section id="phonics" className="py-20 px-4 md:px-8 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Media / Visual Graphic on Left */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Curved Blue Arch Backdrop */}
            <div className="absolute -bottom-4 w-64 sm:w-72 h-72 sm:h-80 rounded-t-full bg-gradient-to-t from-blue-600 via-sky-400 to-indigo-300 opacity-90 -z-10" />

            {/* Phonics Interactive Preview Card */}
            <div className="w-full max-w-sm rounded-3xl bg-white border border-gray-100 p-6 shadow-2xl shadow-blue-900/10 space-y-5 relative">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-xs font-black uppercase text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                  Interactive Audio Phonics
                </span>
                <span className="text-xs font-bold text-gray-400">Tap to Listen</span>
              </div>

              {/* Letter Card Selector Tabs */}
              <div className="grid grid-cols-4 gap-1.5">
                {phonicsLetters.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handlePlayPhonics(i)}
                    className={`py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                      selectedPhonicsLetter === i
                        ? "bg-[#7C3AED] text-white shadow-md scale-105"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {p.letter}
                  </button>
                ))}
              </div>

              {/* Active Letter Card Display */}
              <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-5 text-center border border-purple-100 space-y-2">
                <div className="text-5xl font-black text-[#7C3AED]">
                  {phonicsLetters[selectedPhonicsLetter].letter}
                </div>
                <div className="text-3xl animate-bounce [animation-duration:2s]">
                  {phonicsLetters[selectedPhonicsLetter].emoji}
                </div>
                <div className="text-sm font-bold text-[#1E1B4B]">
                  {phonicsLetters[selectedPhonicsLetter].word} • {phonicsLetters[selectedPhonicsLetter].sound}
                </div>
              </div>

              {/* Audio Soundwave Simulation & Play Button */}
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => handlePlayPhonics(selectedPhonicsLetter)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs transition-transform active:scale-90 ${
                    isPlayingAudio ? "bg-amber-400 text-purple-950 scale-105" : "bg-[#7C3AED] text-white hover:scale-105"
                  }`}
                  aria-label="Play sound"
                >
                  {isPlayingAudio ? "🔊" : "▶"}
                </button>
                <div className="flex-1 flex items-center gap-1 justify-center">
                  <span className={`w-1 h-3 bg-purple-400 rounded-full ${isPlayingAudio ? "animate-pulse" : ""}`} />
                  <span className={`w-1 h-6 bg-purple-600 rounded-full ${isPlayingAudio ? "animate-pulse" : ""}`} />
                  <span className={`w-1 h-8 bg-purple-700 rounded-full ${isPlayingAudio ? "animate-pulse" : ""}`} />
                  <span className={`w-1 h-5 bg-purple-500 rounded-full ${isPlayingAudio ? "animate-pulse" : ""}`} />
                  <span className={`w-1 h-7 bg-purple-600 rounded-full ${isPlayingAudio ? "animate-pulse" : ""}`} />
                  <span className={`w-1 h-4 bg-purple-400 rounded-full ${isPlayingAudio ? "animate-pulse" : ""}`} />
                  <span className={`w-1 h-2 bg-purple-300 rounded-full ${isPlayingAudio ? "animate-pulse" : ""}`} />
                </div>
                <span className="text-[11px] font-bold text-gray-500">
                  {isPlayingAudio ? "Speaking..." : "Human Voice"}
                </span>
              </div>

              {/* Circular Progress Badge (Matching 85% Downloading in Reference) */}
              <div className="absolute -bottom-4 -right-3 rounded-2xl bg-white border border-amber-200 p-2.5 shadow-xl flex items-center gap-2.5">
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-amber-500"
                      strokeDasharray="100, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-[9px] font-black text-amber-700">100%</span>
                </div>
                <div>
                  <div className="text-[11px] font-black text-[#1E1B4B]">Offline Audio</div>
                  <div className="text-[9px] text-gray-500 font-semibold">Zero Streaming Lag</div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content on Right (Matching Reference Bullet Style) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full">
              Phonics & Speech Foundation
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1E1B4B] leading-tight">
              Work smarter with clear, human-recorded voice phonics
            </h2>

            <p className="text-sm sm:text-base text-gray-600 font-medium leading-relaxed">
              Every letter of the alphabet comes with recorded human voice pronunciation, paired with recognizable visual vocabulary words to anchor early phonetic awareness.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-purple-200 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-lg shrink-0">
                  🎙️
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#1E1B4B]">Human Voice Clarity</h3>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium mt-0.5">
                    Real recorded voice clips rather than robotic text-to-speech, ensuring toddlers hear authentic articulation and phonics.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-blue-200 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-lg shrink-0">
                  🔤
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#1E1B4B]">A–Z Picture Associations</h3>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium mt-0.5">
                    Pairing letters with colorful, familiar objects (A for Apple, B for Ball) to reinforce vocabulary and letter memory.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-emerald-200 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg shrink-0">
                  👂
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#1E1B4B]">Independent Tap-to-Listen</h3>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium mt-0.5">
                    Large touch targets allow toddlers to repeat letter sounds as many times as they want without needing adult intervention.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/features/phonics"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2563EB] text-white text-xs sm:text-sm font-extrabold shadow-md shadow-blue-200 hover:bg-[#1D4ED8] hover:scale-105 active:scale-95 transition-all"
              >
                <span>LEARN MORE ABOUT PHONICS</span>
                <span>›</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Split Section 2: Numbers, Shapes & Colors (Content Left / Media Right) ─── */}
      <section id="numbers" className="py-20 px-4 md:px-8 bg-white border-y border-gray-200/70">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Content on Left */}
          <div className="lg:col-span-7 space-y-6 text-left order-2 lg:order-1">
            <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-3.5 py-1.5 rounded-full">
              Numbers & Early Cognition
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1E1B4B] leading-tight">
              Build confident number sense and shapes from 1 to 20
            </h2>

            <p className="text-sm sm:text-base text-gray-600 font-medium leading-relaxed">
              Counting isn't just reciting numbers—it's connecting symbols to real quantities. Learn Fun combines visual items, spoken counts, shapes, and colors.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm hover:border-amber-200 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg shrink-0">
                  🔢
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#1E1B4B]">Concrete Item Counting</h3>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium mt-0.5">
                    Count apples, stars, and balls with one-to-one touch confirmation so toddlers understand actual quantity relationships.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm hover:border-pink-200 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center text-lg shrink-0">
                  🔷
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#1E1B4B]">10 Shapes & 12 Colors</h3>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium mt-0.5">
                    Circles, squares, triangles, stars, and rich color palettes designed to strengthen early visual categorization skills.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm hover:border-purple-200 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-lg shrink-0">
                  🏆
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#1E1B4B]">Milestone Achievements</h3>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium mt-0.5">
                    Celebrate small wins with cheerful audio rewards and star points that motivate young minds to keep learning daily.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/features/numbers"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2563EB] text-white text-xs sm:text-sm font-extrabold shadow-md shadow-blue-200 hover:bg-[#1D4ED8] hover:scale-105 active:scale-95 transition-all"
              >
                <span>EXPLORE NUMBERS & MATH</span>
                <span>›</span>
              </Link>
            </div>
          </div>

          {/* Media Graphic on Right */}
          <div className="lg:col-span-5 relative flex justify-center order-1 lg:order-2">
            {/* Curved Sky-Blue Arch Backdrop */}
            <div className="absolute -bottom-4 w-64 sm:w-72 h-72 sm:h-80 rounded-t-full bg-gradient-to-t from-sky-500 via-blue-400 to-indigo-300 opacity-90 -z-10" />

            {/* Numbers & Shapes Showcase Card */}
            <div className="w-full max-w-sm rounded-3xl bg-white border border-gray-100 p-6 shadow-2xl shadow-blue-900/10 space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-xs font-black uppercase text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
                  Numbers 1–20
                </span>
                <span className="text-xs font-bold text-gray-400">Tap Stars to Count</span>
              </div>

              {/* Number Card Display */}
              <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-6 text-center border border-amber-100 space-y-3">
                <div className="text-5xl font-black text-amber-600">{countedStars}</div>
                {/* Clickable Star Counter */}
                <div className="flex items-center justify-center gap-2 text-2xl select-none">
                  {[0, 1, 2, 3, 4].map((idx) => (
                    <button
                      key={idx}
                      onClick={() => handleStarClick(idx)}
                      className={`transition-transform hover:scale-125 active:scale-95 ${
                        idx < countedStars ? "opacity-100 scale-105" : "opacity-30 grayscale"
                      }`}
                      aria-label={`Count star ${idx + 1}`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
                <div className="text-sm font-bold text-[#1E1B4B]">
                  {countedStars} {countedStars === 1 ? "Star" : "Stars"} Counted!
                </div>
              </div>

              {/* Shapes & Colors Swatch Preview */}
              <div className="grid grid-cols-4 gap-2 pt-1">
                <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-center hover:scale-105 transition-transform">
                  <div className="text-lg">🔵</div>
                  <div className="text-[10px] font-bold text-gray-600 mt-1">Circle</div>
                </div>
                <div className="p-2.5 rounded-xl bg-pink-50 border border-pink-100 text-center hover:scale-105 transition-transform">
                  <div className="text-lg">🔺</div>
                  <div className="text-[10px] font-bold text-gray-600 mt-1">Triangle</div>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-center hover:scale-105 transition-transform">
                  <div className="text-lg">🟩</div>
                  <div className="text-[10px] font-bold text-gray-600 mt-1">Square</div>
                </div>
                <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100 text-center hover:scale-105 transition-transform">
                  <div className="text-lg">⭐</div>
                  <div className="text-[10px] font-bold text-gray-600 mt-1">Star</div>
                </div>
              </div>

              {/* Reward Status */}
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌟</span>
                  <span className="text-xs font-extrabold text-amber-900">Session Complete</span>
                </div>
                <span className="text-xs font-black text-amber-700">+{countedStars} Stars</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Centered App Showcase Section (Symmetrical 3-Column Layout) ─── */}
      <section id="showcase" className="py-24 px-4 md:px-8 bg-[#EFF6FF]/60 border-b border-gray-200/70 w-full text-center space-y-14 relative overflow-hidden">
        {/* Subtle Decorative Sparkles matching reference */}
        <div className="hidden md:block absolute top-1/4 left-10 text-coral-400 text-2xl select-none opacity-60">✦</div>
        <div className="hidden md:block absolute top-1/3 right-10 text-blue-400 text-2xl select-none opacity-60">✦</div>
        <div className="hidden md:block absolute bottom-1/4 left-20 text-blue-400 text-xl select-none opacity-50">✳</div>
        <div className="hidden md:block absolute bottom-1/3 right-20 text-rose-400 text-xl select-none opacity-50">✳</div>

        <div className="max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-white border border-blue-100 px-3.5 py-1.5 rounded-full shadow-sm">
            All-In-One Toddler Platform
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1E1B4B]">
            Everything Your Child Needs in One Safe App
          </h2>
          <p className="text-sm md:text-base text-gray-600 font-medium">
            A comprehensive early learning ecosystem thoughtfully built for toddler hands and growing minds.
          </p>
        </div>

        {/* Symmetrical 3-Column Grid (Left Features, Center Device, Right Features) */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left Column: 3 Feature Cards */}
          <div className="md:col-span-4 space-y-4 text-left">
            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
                📶
              </div>
              <h3 className="text-base font-extrabold text-[#1E1B4B]">100% Offline-First</h3>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">
                Learn on road trips, airplane flights, or quiet afternoons without requiring Wi-Fi or mobile data.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-purple-200 hover:shadow-md transition-all space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg">
                🎙️
              </div>
              <h3 className="text-base font-extrabold text-[#1E1B4B]">Human Voice Phonics</h3>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">
                Authentic, gentle spoken pronunciations for every letter and vocabulary word to nurture natural speech.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-amber-200 hover:shadow-md transition-all space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg">
                🧩
              </div>
              <h3 className="text-base font-extrabold text-[#1E1B4B]">6 Interactive Mini-Games</h3>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">
                Memory Match, Balloon Pop, Shadow Matching, Drag & Drop, and Puzzles designed for fine motor development.
              </p>
            </div>
          </div>

          {/* Center Column: App Graphic with Curved Arch Backdrop */}
          <div className="md:col-span-4 relative flex justify-center py-4">
            {/* Semicircular Backdrop Arch */}
            <div className="absolute bottom-0 w-64 sm:w-72 h-80 sm:h-96 rounded-t-full bg-gradient-to-t from-[#2563EB] via-[#38BDF8] to-[#93C5FD] opacity-90 -z-10" />

            {/* Mobile Showcase Bezel Frame */}
            <div className="w-64 sm:w-72 rounded-[36px] bg-[#1E1B4B] p-3 shadow-2xl shadow-blue-900/20 border-4 border-white/80">
              <div className="rounded-[28px] bg-[#F3EEFF] p-4 space-y-4 overflow-hidden text-left">
                {/* Simulated App Top Bar */}
                <div className="flex items-center justify-between border-b border-purple-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
                      LF
                    </span>
                    <span className="text-xs font-black text-[#1E1B4B]">Learn Fun</span>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-100 px-2 py-0.5 rounded-full text-[11px] font-bold text-amber-900">
                    <span>⭐</span> 48
                  </div>
                </div>

                {/* Simulated Lesson Categories */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-3 rounded-xl bg-white border border-purple-100 shadow-sm">
                    <div className="text-2xl">🔤</div>
                    <div className="font-extrabold text-[#1E1B4B] mt-1 text-[11px]">Alphabet</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-purple-100 shadow-sm">
                    <div className="text-2xl">🔢</div>
                    <div className="font-extrabold text-[#1E1B4B] mt-1 text-[11px]">Numbers</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-purple-100 shadow-sm">
                    <div className="text-2xl">🔷</div>
                    <div className="font-extrabold text-[#1E1B4B] mt-1 text-[11px]">Shapes</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-purple-100 shadow-sm">
                    <div className="text-2xl">🐶</div>
                    <div className="font-extrabold text-[#1E1B4B] mt-1 text-[11px]">Animals</div>
                  </div>
                </div>

                {/* Simulated Streak Card */}
                <div className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 p-3 text-white text-center space-y-1 shadow-md">
                  <div className="text-xs font-black">🔥 5-Day Streak Active!</div>
                  <div className="text-[10px] text-purple-200">Consistency creates confidence</div>
                </div>

                {/* Action button inside mockup */}
                <Link
                  to="/play"
                  className="block w-full py-2 rounded-xl bg-amber-400 text-purple-950 text-center text-xs font-black shadow hover:bg-amber-300 transition-colors"
                >
                  Start Lesson Now
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Feature Cards */}
          <div className="md:col-span-4 space-y-4 text-left">
            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
                ⭐
              </div>
              <h3 className="text-base font-extrabold text-[#1E1B4B]">Star Rewards & Streaks</h3>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">
                Gentle encouragement through stars and milestone unlocks that celebrate learning efforts without frustration.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
                🔒
              </div>
              <h3 className="text-base font-extrabold text-[#1E1B4B]">Parent PIN Security Gate</h3>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">
                Settings and profile management are protected by a parent verification challenge to keep toddlers in the game.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-pink-200 hover:shadow-md transition-all space-y-2">
              <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center text-lg">
                🛡️
              </div>
              <h3 className="text-base font-extrabold text-[#1E1B4B]">Zero Commercial Ads</h3>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">
                No third-party trackers, no banner distractions, and no popups ensuring peace of mind for every family.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. 100% Free Transparency & Parents FAQ (Replacing SaaS Pricing) ─── */}
      <section id="pricing" className="py-20 px-4 md:px-8 bg-white border-b border-gray-200/70">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Transparency Heading */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full">
              100% Free Commitment
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1E1B4B]">
              Transparent, 100% Free Education for Every Child
            </h2>
            <p className="text-sm md:text-base text-gray-600 font-medium">
              No subscription tiers. No paywalled levels. No hidden charges. Just open early childhood education.
            </p>
          </div>

          {/* 4 Transparency Benefit Cards (Matching the 4-Column Pricing Card Layout) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-gray-50 border border-gray-200/80 space-y-4 text-left hover:border-blue-200 transition-colors">
              <span className="text-xs font-bold text-gray-500 uppercase">Browser Edition</span>
              <div className="text-3xl font-black text-[#1E1B4B]">$0 <span className="text-xs font-bold text-gray-400">/ forever</span></div>
              <ul className="text-xs text-gray-600 font-medium space-y-2.5">
                <li className="flex items-center gap-2"><span className="text-emerald-500 font-bold">✓</span> Instant web browser play</li>
                <li className="flex items-center gap-2"><span className="text-emerald-500 font-bold">✓</span> All 12 subject categories</li>
                <li className="flex items-center gap-2"><span className="text-emerald-500 font-bold">✓</span> No account or login required</li>
              </ul>
              <Link to="/play" className="block w-full py-2.5 rounded-xl bg-white border border-gray-200 text-[#1E1B4B] text-xs font-extrabold text-center hover:bg-gray-100 transition-colors">
                Play in Browser
              </Link>
            </div>

            <div className="p-6 rounded-3xl bg-blue-600 text-white space-y-4 text-left shadow-xl shadow-blue-600/20 relative hover:bg-blue-700 transition-colors">
              <div className="absolute top-4 right-4 bg-blue-400 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                Recommended
              </div>
              <span className="text-xs font-bold text-blue-200 uppercase">Android App</span>
              <div className="text-3xl font-black text-white">$0 <span className="text-xs font-bold text-blue-200">/ forever</span></div>
              <ul className="text-xs text-blue-100 font-medium space-y-2.5">
                <li className="flex items-center gap-2"><span>✓</span> Full 100% offline access</li>
                <li className="flex items-center gap-2"><span>✓</span> Human voice audio phonics</li>
                <li className="flex items-center gap-2"><span>✓</span> Zero cellular data consumption</li>
              </ul>
              <a href={googlePlayUrl} target="_blank" rel="noopener noreferrer" className="block w-full py-2.5 rounded-xl bg-white text-blue-700 text-xs font-extrabold text-center hover:bg-blue-50 transition-colors">
                Install on Android
              </a>
            </div>

            <div className="p-6 rounded-3xl bg-gray-50 border border-gray-200/80 space-y-4 text-left hover:border-blue-200 transition-colors">
              <span className="text-xs font-bold text-gray-500 uppercase">Parent Zone</span>
              <div className="text-3xl font-black text-[#1E1B4B]">$0 <span className="text-xs font-bold text-gray-400">/ forever</span></div>
              <ul className="text-xs text-gray-600 font-medium space-y-2.5">
                <li className="flex items-center gap-2"><span className="text-emerald-500 font-bold">✓</span> Child-proof PIN protection</li>
                <li className="flex items-center gap-2"><span className="text-emerald-500 font-bold">✓</span> Multiple child student profiles</li>
                <li className="flex items-center gap-2"><span className="text-emerald-500 font-bold">✓</span> Progress & streak tracking</li>
              </ul>
              <Link to="/play" className="block w-full py-2.5 rounded-xl bg-white border border-gray-200 text-[#1E1B4B] text-xs font-extrabold text-center hover:bg-gray-100 transition-colors">
                Explore Features
              </Link>
            </div>

            <div className="p-6 rounded-3xl bg-gray-50 border border-gray-200/80 space-y-4 text-left hover:border-blue-200 transition-colors">
              <span className="text-xs font-bold text-gray-500 uppercase">Full Curriculum</span>
              <div className="text-3xl font-black text-[#1E1B4B]">$0 <span className="text-xs font-bold text-gray-400">/ forever</span></div>
              <ul className="text-xs text-gray-600 font-medium space-y-2.5">
                <li className="flex items-center gap-2"><span className="text-emerald-500 font-bold">✓</span> ABCs, Phonics & Numbers 1–20</li>
                <li className="flex items-center gap-2"><span className="text-emerald-500 font-bold">✓</span> Shapes, Colors & Animals</li>
                <li className="flex items-center gap-2"><span className="text-emerald-500 font-bold">✓</span> 6 Interactive Mini-Games</li>
              </ul>
              <Link to="/play" className="block w-full py-2.5 rounded-xl bg-white border border-gray-200 text-[#1E1B4B] text-xs font-extrabold text-center hover:bg-gray-100 transition-colors">
                Start Learning
              </Link>
            </div>
          </div>

          {/* ── 2x2 FAQ Accordion / Grid ── */}
          <div id="faq" className="pt-8 space-y-8 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full">
                Parent Questions Answered
              </span>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-[#1E1B4B]">
                Frequently Asked Questions
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="rounded-2xl bg-gray-50 border border-gray-200/80 overflow-hidden text-left">
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full p-5 text-left font-extrabold text-xs sm:text-sm text-[#1E1B4B] flex items-center justify-between gap-3 hover:bg-gray-100 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="text-base text-blue-600 shrink-0">{activeFaq === idx ? "➖" : "➕"}</span>
                  </button>
                  {activeFaq === idx && (
                    <div className="px-5 pb-5 text-xs text-gray-600 font-medium leading-relaxed border-t border-gray-200 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Educational Resources Hub (Matching Reference Article Grid) ─── */}
      <section id="resources" className="py-20 px-4 md:px-8 max-w-6xl mx-auto w-full space-y-12 text-center">
        <div className="max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-3.5 py-1.5 rounded-full">
            Early Childhood Learning Guides
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1E1B4B]">
            Useful Resources for Parents & Educators
          </h2>
          <p className="text-sm md:text-base text-gray-600 font-medium">
            Explore our deep-dive learning guides on speech development, phonics, and early mathematical cognition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Resource Card 1 - Phonics */}
          <Link
            to="/features/phonics"
            className="group rounded-3xl bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col"
          >
            <div className="h-44 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 p-6 flex flex-col justify-between text-white relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10 blur-sm" />
              <span className="text-xs font-black uppercase tracking-wider bg-white/20 backdrop-blur-md px-3 py-1 rounded-full w-max">
                Speech & Phonics
              </span>
              <div className="text-4xl">🎙️</div>
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#1E1B4B] group-hover:text-blue-600 transition-colors">
                  Why Human Voice Audio Matters in Phonics Learning
                </h3>
                <p className="text-xs text-gray-600 font-medium mt-2 leading-relaxed">
                  Discover how authentic human speech articulation helps toddlers develop clean phonemic awareness faster than synthetic speech.
                </p>
              </div>
              <div className="pt-4 flex items-center text-xs font-bold text-blue-600 gap-1">
                <span>Read Full Guide</span>
                <span>›</span>
              </div>
            </div>
          </Link>

          {/* Resource Card 2 - Alphabet */}
          <Link
            to="/features/alphabet"
            className="group rounded-3xl bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col"
          >
            <div className="h-44 bg-gradient-to-br from-blue-500 via-sky-500 to-teal-400 p-6 flex flex-col justify-between text-white relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10 blur-sm" />
              <span className="text-xs font-black uppercase tracking-wider bg-white/20 backdrop-blur-md px-3 py-1 rounded-full w-max">
                Letter Mastery
              </span>
              <div className="text-4xl">🔤</div>
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#1E1B4B] group-hover:text-blue-600 transition-colors">
                  The Foundation of Early Letter Recognition & ABCs
                </h3>
                <p className="text-xs text-gray-600 font-medium mt-2 leading-relaxed">
                  Learn how uppercase and lowercase letter pairs combined with concrete vocabulary build preschool reading readiness.
                </p>
              </div>
              <div className="pt-4 flex items-center text-xs font-bold text-blue-600 gap-1">
                <span>Read Full Guide</span>
                <span>›</span>
              </div>
            </div>
          </Link>

          {/* Resource Card 3 - Numbers */}
          <Link
            to="/features/numbers"
            className="group rounded-3xl bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col"
          >
            <div className="h-44 bg-gradient-to-br from-amber-500 via-orange-500 to-pink-500 p-6 flex flex-col justify-between text-white relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10 blur-sm" />
              <span className="text-xs font-black uppercase tracking-wider bg-white/20 backdrop-blur-md px-3 py-1 rounded-full w-max">
                Early Numeracy
              </span>
              <div className="text-4xl">🔢</div>
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#1E1B4B] group-hover:text-blue-600 transition-colors">
                  Building Concrete Number Sense from 1 to 20
                </h3>
                <p className="text-xs text-gray-600 font-medium mt-2 leading-relaxed">
                  Why tactile visual item counting and shape identification form the bedrock of early mathematical confidence.
                </p>
              </div>
              <div className="pt-4 flex items-center text-xs font-bold text-blue-600 gap-1">
                <span>Read Full Guide</span>
                <span>›</span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ── 9. Final Call to Action Banner & Multi-Column Footer ─── */}
      <section className="py-16 px-4 md:px-8 max-w-5xl mx-auto w-full">
        <div className="p-8 md:p-14 rounded-3xl bg-gradient-to-r from-[#2563EB] via-[#1D4ED8] to-[#1E40AF] text-white text-center space-y-6 shadow-2xl shadow-blue-500/20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-blue-100 text-xs font-bold">
            <span>✨</span> Start Learning in Seconds
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black">
            Give Your Child the Joy of Independent Learning
          </h2>
          <p className="text-sm md:text-base text-blue-100 font-medium max-w-xl mx-auto leading-relaxed">
            Play online in your browser or install on Android. 100% free, offline-first, and completely ad-free.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/play"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-amber-400 text-purple-950 text-base font-black shadow-lg hover:bg-amber-300 hover:scale-105 active:scale-95 transition-all text-center flex items-center justify-center gap-2"
            >
              <span>🎮</span> Play Online Free
            </Link>
            <a
              href={googlePlayUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
            >
              <img src="/google-play-badge.svg" alt="Get it on Google Play" className="h-14 w-auto" />
            </a>
          </div>
        </div>
      </section>

      {/* ── Multi-Column SEO Footer ───────────────────────────── */}
      <footer className="mt-auto bg-white border-t border-gray-200 py-12 px-4 md:px-8 text-xs font-medium text-gray-500">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Column 1: Brand & Description */}
          <div className="md:col-span-5 space-y-3 text-left">
            <Link to="/" className="inline-block">
              <img
                src={learnFunLogo}
                alt="Learn Fun Logo"
                className="h-9 w-auto object-contain mix-blend-multiply"
              />
            </Link>
            <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
              Learn Fun is an offline-first early childhood educational app helping toddlers and preschoolers aged 1–5 master ABCs, human voice phonics, numbers 1–20, shapes, and colors without ads.
            </p>
            <p className="text-[11px] text-gray-400 pt-1">
              © 2026 Learn Fun Kids Educational App. All rights reserved.
            </p>
          </div>

          {/* Column 2: Interactive Modules */}
          <div className="md:col-span-3 space-y-2 text-left">
            <div className="font-extrabold text-sm text-[#1E1B4B]">Learning Modules</div>
            <ul className="space-y-1.5 pt-1">
              <li><Link to="/play" className="hover:text-blue-600 transition-colors">Play Online Game</Link></li>
              <li><Link to="/features/phonics" className="hover:text-blue-600 transition-colors">Human Audio Phonics</Link></li>
              <li><Link to="/features/alphabet" className="hover:text-blue-600 transition-colors">Alphabet & Letter Cards</Link></li>
              <li><Link to="/features/numbers" className="hover:text-blue-600 transition-colors">Numbers 1–20 & Counting</Link></li>
            </ul>
          </div>

          {/* Column 3: Safety & Legal */}
          <div className="md:col-span-4 space-y-2 text-left">
            <div className="font-extrabold text-sm text-[#1E1B4B]">Safety & Trust</div>
            <ul className="space-y-1.5 pt-1">
              <li><span className="text-emerald-600 font-bold">✓</span> 100% Free & No Subscriptions</li>
              <li><span className="text-emerald-600 font-bold">✓</span> Zero Third-Party Advertising</li>
              <li><span className="text-emerald-600 font-bold">✓</span> Child-Proof PIN Parent Gate</li>
              <li><a href="/privacy.html" className="text-blue-600 hover:underline">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

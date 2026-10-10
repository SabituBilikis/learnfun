import { useState } from "react";
import { Link } from "react-router";
import learnFunLogo from "@/imports/Learn_fun.png";

export function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const googlePlayUrl = "https://play.google.com/store/apps/details?id=com.learnfunkids.app";

  const faqs = [
    {
      q: "What age range is Learn Fun designed for?",
      a: "Learn Fun is specially crafted for toddlers and preschoolers aged 1 to 5 years old. The interface features large touch targets, vibrant colors, and simple navigation tailored for early childhood development."
    },
    {
      q: "Does Learn Fun work offline without Wi-Fi?",
      a: "Yes! Learn Fun is 100% offline-first. Once installed on Android or loaded in the web browser, children can learn ABCs, phonics, numbers, and mini-games anywhere without needing an active internet connection."
    },
    {
      q: "Are there any third-party ads or subscriptions?",
      a: "No. Learn Fun is completely ad-free and subscription-free. There are no popups, banners, or third-party ad networks, ensuring a safe learning environment for children."
    },
    {
      q: "How does the phonics and speech system work?",
      a: "Learn Fun features human-recorded audio pronunciations for letters and phonics sounds, backed by browser Web Speech synthesis fallback, helping children hear clear and accurate letter pronunciations."
    },
    {
      q: "How does the lesson unlocking system work?",
      a: "Children earn stars by completing interactive learning sessions. As they earn stars and maintain daily learning streaks, upcoming categories and advanced lessons unlock progressively."
    },
    {
      q: "How do parent controls and PIN settings work?",
      a: "Learn Fun includes a dedicated Parent Zone guarded by a child-proof PIN security gate (math question or custom PIN), allowing parents to manage student profiles, monitor progress, and configure settings safely."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F3EEFF] text-[#1E1B4B] font-fredoka flex flex-col selection:bg-[#FFC800] selection:text-[#1E1B4B]">
      {/* ── Top Navigation Bar ──────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-purple-100 px-4 md:px-8 py-3 flex items-center justify-between shadow-sm">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={learnFunLogo}
            alt="Learn Fun Logo"
            className="h-10 md:h-12 w-auto object-contain mix-blend-multiply"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-700">
          <a href="#categories" className="hover:text-[#7C3AED] transition-colors">What Kids Learn</a>
          <a href="#why-us" className="hover:text-[#7C3AED] transition-colors">Why Offline</a>
          <a href="#how-it-works" className="hover:text-[#7C3AED] transition-colors">How It Works</a>
          <a href="#faq" className="hover:text-[#7C3AED] transition-colors">Parents FAQ</a>
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
            className="flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white text-xs md:text-sm font-bold shadow-md shadow-purple-300 hover:scale-105 active:scale-95 transition-all"
          >
            <span>🚀</span> Play Free Online
          </Link>
        </div>
      </header>

      {/* ── Hero Section ──────────────────────────────────────── */}
      <section className="relative px-4 md:px-8 pt-10 md:pt-16 pb-16 max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 text-center md:text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold shadow-sm">
            <span>⭐</span> 100% Free & Offline Learning App for Toddlers
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#1E1B4B] leading-tight tracking-tight">
            Learn Fun – Offline Learning App for <span className="bg-gradient-to-r from-[#7C3AED] via-[#FF5252] to-[#10B981] bg-clip-text text-transparent">Toddlers & Preschoolers</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 font-medium max-w-xl mx-auto md:mx-0 leading-relaxed">
            Help little learners ages 1–5 explore ABCs, human audio phonics, numbers 1–20, shapes, colors, animals, and mini-games in a safe, ad-free environment.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-2">
            <Link
              to="/play"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white text-base font-extrabold shadow-lg shadow-purple-300 hover:scale-105 active:scale-95 transition-all text-center flex items-center justify-center gap-2"
            >
              <span>🎮</span> Play Now in Browser
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

          <div className="flex items-center justify-center md:justify-start gap-6 text-xs font-bold text-gray-500 pt-3">
            <span className="flex items-center gap-1.5">✅ No Ads</span>
            <span className="flex items-center gap-1.5">✅ Works Offline</span>
            <span className="flex items-center gap-1.5">✅ Ages 1–5</span>
          </div>
        </div>

        {/* Hero Card Visual */}
        <div className="flex-1 w-full max-w-md md:max-w-none">
          <div className="relative p-6 rounded-3xl bg-white border-4 border-purple-200 shadow-2xl shadow-purple-200/80 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🅰️</span>
                <div>
                  <h3 className="font-extrabold text-sm text-[#1E1B4B]">Alphabet & Phonics</h3>
                  <p className="text-xs text-gray-500">Human Voice Audio</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">Unlocked</span>
            </div>

            <div className="grid grid-cols-4 gap-2.5 py-2">
              {[
                { label: "A", sub: "Apple 🍎", color: "bg-red-100 text-red-700 border-red-200" },
                { label: "B", sub: "Ball ⚽", color: "bg-blue-100 text-blue-700 border-blue-200" },
                { label: "C", sub: "Cat 🐱", color: "bg-amber-100 text-amber-700 border-amber-200" },
                { label: "D", sub: "Dog 🐶", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
              ].map((card, i) => (
                <div key={i} className={`p-3 rounded-2xl border ${card.color} text-center font-black flex flex-col items-center justify-center shadow-sm hover:scale-105 transition-transform cursor-default`}>
                  <span className="text-xl">{card.label}</span>
                  <span className="text-[10px] font-bold mt-1 opacity-80">{card.sub}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-50 border border-purple-100 text-xs font-bold text-purple-900">
              <span className="flex items-center gap-1.5">⭐ Earn Stars & Daily Streaks</span>
              <span className="px-2 py-0.5 rounded-lg bg-amber-400 text-purple-950 font-black">100% Free</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── What Children Can Learn ──────────────────────────── */}
      <section id="categories" className="py-16 px-4 md:px-8 bg-white border-y border-purple-100">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-[#7C3AED] bg-purple-100 px-3 py-1 rounded-full">
              Learning Modules
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1E1B4B]">
              Interactive Learning Categories for Toddlers
            </h2>
            <p className="text-sm md:text-base text-gray-600 font-medium">
              Explore 12 interactive subjects designed to build early language, numerical, and cognitive skills.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🔤",
                title: "Alphabet & Letters",
                desc: "Discover A to Z with letter sound pronunciation, upper & lowercase letters, and picture words.",
                color: "bg-purple-50 border-purple-200 text-purple-900"
              },
              {
                icon: "🎙️",
                title: "Phonics & Sound Experience",
                desc: "Listen to real human-recorded phonics audio to master early letter sounds and pronunciation.",
                color: "bg-pink-50 border-pink-200 text-pink-900"
              },
              {
                icon: "🔢",
                title: "Numbers 1–20",
                desc: "Learn to count from 1 to 20 with visual object counting, numbers, and audio counting.",
                color: "bg-amber-50 border-amber-200 text-amber-900"
              },
              {
                icon: "🔷",
                title: "Shapes & Colors",
                desc: "Identify circles, squares, stars, and 12 vibrant colors through interactive color swatches.",
                color: "bg-blue-50 border-blue-200 text-blue-900"
              },
              {
                icon: "🐶",
                title: "Animals & Nature",
                desc: "Explore farm animals, wild animals, fruits, vehicles, school items, and body parts.",
                color: "bg-emerald-50 border-emerald-200 text-emerald-900"
              },
              {
                icon: "🧩",
                title: "Interactive Mini-Games",
                desc: "Play Memory Match, Drag & Drop, Find Object, Balloon Pop, Puzzles, and Shadow Matching.",
                color: "bg-orange-50 border-orange-200 text-orange-900"
              }
            ].map((cat, idx) => (
              <div key={idx} className={`p-6 rounded-3xl border-2 ${cat.color} space-y-3 shadow-sm hover:shadow-md transition-all`}>
                <div className="text-4xl">{cat.icon}</div>
                <h3 className="text-xl font-extrabold">{cat.title}</h3>
                <p className="text-sm opacity-90 leading-relaxed font-medium">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Learn Fun? ──────────────────────────────── */}
      <section id="why-us" className="py-16 px-4 md:px-8 max-w-6xl mx-auto w-full space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
            Parent & Educator Approved
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1E1B4B]">
            Why Parents Love Learn Fun
          </h2>
          <p className="text-sm md:text-base text-gray-600 font-medium">
            Designed to give toddlers a joyful, safe, and effective learning experience without distractions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: "📶",
              title: "100% Offline-First",
              desc: "Works completely offline without Wi-Fi or cellular data after initial setup."
            },
            {
              icon: "🛡️",
              title: "Safe & Ad-Free",
              desc: "Zero third-party ads, popups, or hidden purchases. Safe for toddlers to navigate alone."
            },
            {
              icon: "🎙️",
              title: "Human Voice Phonics",
              desc: "Recorded human voice audio ensures clean, clear, and child-friendly letter pronunciations."
            },
            {
              icon: "🔒",
              title: "Parent PIN Gate",
              desc: "Protected parent zone with security verifier PIN lock for profile management."
            }
          ].map((feature, i) => (
            <div key={i} className="p-6 rounded-3xl bg-white border border-purple-100 shadow-md space-y-3 text-center">
              <div className="text-4xl">{feature.icon}</div>
              <h3 className="text-lg font-extrabold text-[#1E1B4B]">{feature.title}</h3>
              <p className="text-xs md:text-sm text-gray-600 font-medium leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────── */}
      <section id="how-it-works" className="py-16 px-4 md:px-8 bg-purple-900 text-white">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-amber-300 bg-purple-800 px-3 py-1 rounded-full">
              Simple Step-by-Step Flow
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black">
              How Children Learn with Learn Fun
            </h2>
            <p className="text-sm md:text-base text-purple-200 font-medium">
              Encouraging independent exploration through bite-sized interactive lessons and rewards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Select a Category", desc: "Choose ABCs, Phonics, Numbers, Shapes, Animals, or Mini-Games." },
              { step: "02", title: "Tap & Listen", desc: "Interact with letter cards, human voice sounds, and visual items." },
              { step: "03", title: "Earn Star Rewards", desc: "Complete sessions to earn stars and build daily learning streaks." },
              { step: "04", title: "Progressive Unlock", desc: "Unlock new categories and advanced lessons as skills grow." }
            ].map((s, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-purple-800/80 border border-purple-700 space-y-3 relative overflow-hidden">
                <span className="text-4xl font-black text-amber-400 opacity-60">{s.step}</span>
                <h3 className="text-lg font-extrabold text-white">{s.title}</h3>
                <p className="text-xs md:text-sm text-purple-200 font-medium leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Parent FAQ ────────────────────────────────────────── */}
      <section id="faq" className="py-16 px-4 md:px-8 max-w-4xl mx-auto w-full space-y-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-[#7C3AED] bg-purple-100 px-3 py-1 rounded-full">
            Parent Questions Answered
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1E1B4B]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-2xl bg-white border border-purple-100 shadow-sm overflow-hidden">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-5 text-left font-extrabold text-sm md:text-base text-[#1E1B4B] flex items-center justify-between gap-4 hover:bg-purple-50/50 transition-colors"
              >
                <span>{faq.q}</span>
                <span className="text-lg text-[#7C3AED]">{activeFaq === idx ? "➖" : "➕"}</span>
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 text-xs md:text-sm text-gray-600 font-medium leading-relaxed border-t border-purple-50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Final Call to Action ──────────────────────────────── */}
      <section className="py-16 px-4 md:px-8 max-w-5xl mx-auto w-full">
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-[#7C3AED] via-[#6D28D9] to-[#5B21B6] text-white text-center space-y-6 shadow-2xl shadow-purple-300">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black">
            Start Your Child's Learning Journey Today
          </h2>
          <p className="text-sm md:text-base text-purple-100 font-medium max-w-xl mx-auto leading-relaxed">
            Play online in your browser or install on Android. 100% free, offline-first, and ad-free.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/play"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-400 text-purple-950 text-base font-black shadow-lg hover:bg-amber-300 hover:scale-105 active:scale-95 transition-all text-center"
            >
              🚀 Play Online Free
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

      {/* ── SEO Footer & Feature Navigation ───────────────────── */}
      <footer className="mt-auto bg-white border-t border-purple-100 py-10 px-4 md:px-8 text-xs font-medium text-gray-600">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <p className="font-bold text-sm text-[#1E1B4B]">Learn Fun Kids Educational App</p>
            <p>© 2026 Learn Fun. All rights reserved.</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 font-semibold text-[#7C3AED]">
            <Link to="/play" className="hover:underline">Play App</Link>
            <Link to="/features/phonics" className="hover:underline">Phonics Feature</Link>
            <Link to="/features/alphabet" className="hover:underline">Alphabet Feature</Link>
            <Link to="/features/numbers" className="hover:underline">Numbers Feature</Link>
            <a href="/privacy.html" className="hover:underline">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

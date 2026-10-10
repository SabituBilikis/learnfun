import { Link } from "react-router";
import learnFunLogo from "@/imports/Learn_fun.png";

export function FeaturePhonicsPage() {
  const googlePlayUrl = "https://play.google.com/store/apps/details?id=com.learnfunkids.app";

  return (
    <div className="min-h-screen bg-[#F3EEFF] text-[#1E1B4B] font-fredoka flex flex-col">
      <header className="bg-white border-b border-purple-100 px-4 md:px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={learnFunLogo} alt="Learn Fun Logo" className="h-9 w-auto object-contain mix-blend-multiply" />
        </Link>
        <Link to="/play" className="px-4 py-2 rounded-xl bg-[#7C3AED] text-white text-xs font-extrabold">
          Play Free Online
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-8 flex-1">
        <div className="space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-[#7C3AED] bg-purple-100 px-3 py-1 rounded-full">
            Educational Feature Deep Dive
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-[#1E1B4B]">
            Phonics & Sound Experience for Preschoolers
          </h1>
          <p className="text-base md:text-lg text-gray-600 font-medium leading-relaxed">
            Discover how Learn Fun helps toddlers aged 1–5 master letter sounds and early pronunciation using human-recorded audio recordings and interactive sound exploration.
          </p>
        </div>

        <section className="bg-white p-6 md:p-8 rounded-3xl border border-purple-100 space-y-4 shadow-sm">
          <h2 className="text-2xl font-bold text-[#1E1B4B]">Why Human-Recorded Audio Matters</h2>
          <p className="text-sm md:text-base text-gray-700 leading-relaxed font-medium">
            Early childhood phonetic learning relies heavily on clear, natural acoustic feedback. Unlike robotic text-to-speech engines that can mispronounce subtle letter sounds, Learn Fun utilizes human-recorded voice clips for phonics lessons.
          </p>
          <ul className="space-y-2 text-sm text-gray-700 font-medium">
            <li className="flex items-center gap-2">✅ <strong>A–Z Letter Sounds:</strong> Hear pure phonetic pronunciations for every letter.</li>
            <li className="flex items-center gap-2">✅ <strong>Word Associations:</strong> Connect sounds with familiar real-world objects (e.g. A for Apple).</li>
            <li className="flex items-center gap-2">✅ <strong>Offline Audio Playback:</strong> Audio assets load locally without buffering or Wi-Fi.</li>
          </ul>
        </section>

        <section className="bg-purple-900 text-white p-6 md:p-8 rounded-3xl space-y-4 shadow-md">
          <h2 className="text-2xl font-bold">Try Phonics in Learn Fun Today</h2>
          <p className="text-sm md:text-base text-purple-200 font-medium leading-relaxed">
            Start exploring phonics interactive lessons for free online in your browser or download the Android app.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link to="/play" className="px-6 py-3 rounded-xl bg-amber-400 text-purple-950 font-black text-sm">
              Play Phonics Game
            </Link>
            <a href={googlePlayUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-xl bg-white text-purple-950 font-black text-sm">
              Get on Google Play
            </a>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-purple-100 py-6 px-4 text-center text-xs text-gray-500 font-medium">
        <Link to="/" className="text-[#7C3AED] hover:underline">Back to Main Home</Link>
      </footer>
    </div>
  );
}

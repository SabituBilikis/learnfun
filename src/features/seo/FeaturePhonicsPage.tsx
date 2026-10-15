import { Link } from "react-router";
import { learnFunLogo } from "@/lib/branding";

export function FeaturePhonicsPage() {
  const googlePlayUrl = "https://play.google.com/store/apps/details?id=com.learnfunkids.app";

  return (
    <div className="min-h-screen bg-white text-[#1E1B4B] font-fredoka flex flex-col">
      <header className="bg-white border-b border-gray-100 px-4 md:px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={learnFunLogo} alt="Learn Fun Logo" className="h-12 w-auto object-contain mix-blend-multiply" />
        </Link>
        <Link to="/play" className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors text-white text-xs font-extrabold">
          Play Free Online
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-8 flex-1">
        <div className="space-y-4">
          <span className="block w-fit text-xs font-black uppercase tracking-widest text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full">
            Educational Feature Deep Dive
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-[#1E1B4B]">
            Phonics & Sound Experience for Preschoolers
          </h1>
          <p className="text-base md:text-lg text-gray-600 font-medium leading-relaxed">
            Discover how Learn Fun helps toddlers aged 1–5 explore letter sounds and early pronunciation through interactive sound activities.
          </p>
        </div>

        <section className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 space-y-4 shadow-sm">
          <h2 className="text-2xl font-bold text-[#1E1B4B]">Phonics Audio and Sound Exploration</h2>
          <p className="text-sm md:text-base text-gray-700 leading-relaxed font-medium">
            Learn Fun pairs letter-sound activities with visual vocabulary prompts. Selected phonics lessons use locally packaged audio, while supported devices can provide spoken feedback for other activities.
          </p>
          <ul className="space-y-2 text-sm text-gray-700 font-medium">
            <li className="flex items-center gap-2">✅ <strong>Letter-Sound Activities:</strong> Explore phonics with interactive prompts and audio support.</li>
            <li className="flex items-center gap-2">✅ <strong>Word Associations:</strong> Connect sounds with familiar real-world objects (e.g. A for Apple).</li>
            <li className="flex items-center gap-2">✅ <strong>Offline Audio Playback:</strong> Audio assets load locally without buffering or Wi-Fi.</li>
          </ul>
        </section>

        <section className="bg-white border border-gray-100 text-[#1E1B4B] p-6 md:p-8 rounded-3xl space-y-4 shadow-md">
          <h2 className="text-2xl font-bold">Try Phonics in Learn Fun Today</h2>
          <p className="text-sm md:text-base text-gray-600 font-medium leading-relaxed">
            Start exploring phonics interactive lessons for free online in your browser or download the Android app.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link to="/play" className="px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors text-white font-black text-sm">
              Play Phonics Game
            </Link>
            <a href={googlePlayUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:scale-105 transition-transform">
              <img src="/google-play-badge.svg" alt="Get it on Google Play" className="h-12 w-auto" />
            </a>
          </div>
        </section>
        <aside className="bg-white p-6 rounded-3xl border border-gray-100 text-base leading-relaxed"><h2 className="text-xl font-bold">Choosing an app for offline learning?</h2><p>Read our <a href="/blog/offline-learning-apps-for-toddlers" className="text-[#2563EB]">guide to free offline learning apps for ages 2?5</a> for activity ideas, app examples and practical checks.</p><a href="/blog" className="text-[#2563EB]">All parent guides</a></aside>
      </main>

      <footer className="bg-white border-t border-gray-100 py-6 px-4 text-center text-xs text-gray-500 font-medium">
        <Link to="/" className="text-[#2563EB] hover:text-[#1D4ED8]">Back to Main Home</Link>
      </footer>
    </div>
  );
}

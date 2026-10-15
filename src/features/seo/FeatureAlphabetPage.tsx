import { Link } from "react-router";
import { learnFunLogo } from "@/lib/branding";

export function FeatureAlphabetPage() {
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
            Alphabet & Letter Learning for Toddlers
          </h1>
          <p className="text-base md:text-lg text-gray-600 font-medium leading-relaxed">
            Help your toddler explore A to Z uppercase and lowercase letters, vocabulary words, and interactive picture association.
          </p>
        </div>

        <section className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 space-y-4 shadow-sm">
          <h2 className="text-2xl font-bold text-[#1E1B4B]">Interactive A–Z Vocabulary Building</h2>
          <p className="text-sm md:text-base text-gray-700 leading-relaxed font-medium">
            Learn Fun presents letter learning through visual engagement. Each letter card introduces upper and lowercase representations accompanied by vibrant illustrations and clear voice playback.
          </p>
          <ul className="space-y-2 text-sm text-gray-700 font-medium">
            <li className="flex items-center gap-2">✅ <strong>Full A–Z Coverage:</strong> 26 interactive letter modules.</li>
            <li className="flex items-center gap-2">✅ <strong>Visual Word Cards:</strong> Every letter pairs with child-friendly object illustrations.</li>
            <li className="flex items-center gap-2">✅ <strong>Progressive Lessons:</strong> Unlock subsequent letters by completing session milestones.</li>
          </ul>
        </section>

        <section className="bg-white border border-gray-100 text-[#1E1B4B] p-6 md:p-8 rounded-3xl space-y-4 shadow-md">
          <h2 className="text-2xl font-bold">Start Learning ABCs Online</h2>
          <p className="text-sm md:text-base text-gray-600 font-medium leading-relaxed">
            Play the alphabet module right now in your web browser or download the Android app.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link to="/play" className="px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors text-white font-black text-sm">
              Play Alphabet Game
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

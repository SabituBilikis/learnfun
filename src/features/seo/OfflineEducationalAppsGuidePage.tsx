import { Link } from "react-router";
import { learnFunLogo } from "@/lib/branding";

const googlePlayUrl = "https://play.google.com/store/apps/details?id=com.learnfunkids.app";

export function OfflineEducationalAppsGuidePage() {
  return (
    <div className="min-h-screen bg-white text-[#1E1B4B] font-fredoka flex flex-col">
      <header className="bg-white border-b border-gray-100 px-4 md:px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" aria-label="Learn Fun home">
          <img src={learnFunLogo} alt="Learn Fun" className="h-12 w-auto object-contain mix-blend-multiply" />
        </Link>
        <Link to="/play" className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors text-white text-xs font-extrabold">
          Play Free Online
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-10 flex-1">
        <article className="space-y-8">
          <header className="space-y-4">
            <span className="block w-fit text-xs font-black uppercase tracking-widest text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full">
              Parent guide
            </span>
            <h1 className="text-3xl md:text-5xl font-black leading-tight">
              Offline Educational Apps for Toddlers: A Parent&apos;s Checklist
            </h1>
            <p className="text-base md:text-lg text-gray-700 font-medium leading-relaxed">
              Before downloading a learning app for a toddler or preschooler, check what works without internet, what your child can tap, and whether the content fits your family&apos;s routine. This guide explains the questions worth asking before a trip, a quiet afternoon, or a first app download.
            </p>
            <p className="text-sm text-gray-500">Last reviewed: October 14, 2026</p>
          </header>

          <section className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-2xl font-bold">Start with what “offline” means</h2>
            <p className="text-gray-700 leading-relaxed">
              “Works offline” can mean different things. Some apps let families download a small selection of activities; others include their learning content on the device after installation. Before leaving Wi-Fi, open the app once, try a lesson with airplane mode on, and check whether the parts your child uses still open.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Learn Fun&apos;s Android app is designed to work offline after it has been installed. Learn Fun is also available on the web and can be installed as a web app on supported devices and browsers; browser play needs an initial connection to load.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">A checklist for choosing an offline learning app</h2>
            <ol className="space-y-4 list-decimal list-inside text-gray-700 leading-relaxed">
              <li><strong>Check the age range and learning focus.</strong> Look for a clear explanation of what children can explore, such as letters, sounds, counting, shapes, or colors. A smaller set of age-appropriate activities can be easier to choose than a long list of unrelated games.</li>
              <li><strong>Test offline access before you need it.</strong> Install the app at home, complete a short activity, then turn off Wi-Fi or enable airplane mode to see what remains available.</li>
              <li><strong>Read the store listing for ads, purchases, and subscriptions.</strong> A free download is not always the same as an app with no ads, no in-app purchases, or no subscription.</li>
              <li><strong>Look for parent controls.</strong> On a shared device, controls can help adults manage settings, profiles, and changes intended for parents.</li>
              <li><strong>Check the privacy information.</strong> Review the Google Play data-safety section and privacy policy before a child starts using an app.</li>
              <li><strong>Plan for short, shared use.</strong> A learning app works best as one part of a day that also includes conversation, books, movement, and imaginative play.</li>
            </ol>
          </section>

          <section className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 space-y-4 shadow-sm">
            <h2 className="text-2xl font-bold">What parents can check in Learn Fun</h2>
            <ul className="space-y-3 text-gray-700 leading-relaxed">
              <li><strong>Learning topics:</strong> alphabet activities, phonics, numbers 1–20, shapes, colors, animals, and mini-games for children ages 1–5.</li>
              <li><strong>Offline use:</strong> Android lessons, phonics audio, and mini-games are available after installation without Wi-Fi.</li>
              <li><strong>Cost and interruptions:</strong> Learn Fun is free, ad-free, and does not include subscriptions or in-app purchases.</li>
              <li><strong>Parent tools:</strong> local child profiles, progress, rewards, and a six-digit Parent PIN help adults manage the app on a shared device.</li>
              <li><strong>Where to use it:</strong> play on the web, install the web app on supported devices and browsers, or download the Android app from Google Play.</li>
            </ul>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/features/phonics" className="text-sm font-bold text-[#2563EB] hover:text-[#1D4ED8]">Explore phonics activities</Link>
              <Link to="/features/alphabet" className="text-sm font-bold text-[#2563EB] hover:text-[#1D4ED8]">Explore alphabet activities</Link>
              <Link to="/features/numbers" className="text-sm font-bold text-[#2563EB] hover:text-[#1D4ED8]">Explore number activities</Link>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Use apps as one part of learning time</h2>
            <p className="text-gray-700 leading-relaxed">
              Quality content and a clear family routine matter more than finding a single “perfect” app. The American Academy of Pediatrics recommends a family media plan that leaves room for sleep, movement, conversation, reading, and play. Co-playing can also give adults useful chances to ask questions and carry an activity away from the screen.
            </p>
            <p className="text-gray-700 leading-relaxed">
              For example, after a counting game, count snacks or steps together. After a letter-sound activity, look for an object at home that starts with the same sound. These small conversations help connect digital play with everyday experience.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Questions parents often ask</h2>
            <div className="space-y-4">
              <div><h3 className="text-lg font-bold">Do all educational apps work without internet?</h3><p className="text-gray-700 leading-relaxed">No. Offline support varies by app and sometimes by activity. Test the exact lessons your child will use before a trip.</p></div>
              <div><h3 className="text-lg font-bold">Is a web app the same as an Android app?</h3><p className="text-gray-700 leading-relaxed">Both can offer Learn Fun activities. The Android app is designed for offline use after installation. Web-app installation depends on the device and browser, and browser play needs an initial connection.</p></div>
              <div><h3 className="text-lg font-bold">How can I tell whether an app is truly free?</h3><p className="text-gray-700 leading-relaxed">Read the store listing and the app&apos;s own pricing information. Check separately for subscriptions, in-app purchases, ads, and locked levels.</p></div>
            </div>
          </section>

          <section className="bg-white border border-gray-100 text-[#1E1B4B] p-6 md:p-8 rounded-3xl space-y-4 shadow-md">
            <h2 className="text-2xl font-bold">Try Learn Fun before your next offline moment</h2>
            <p className="text-gray-600 leading-relaxed">Play in a browser now, or install Learn Fun from Google Play before a journey or a day with limited internet.</p>
            <div className="flex flex-wrap gap-4 items-center">
              <Link to="/play" className="px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors text-white font-black text-sm">Play Learn Fun Online</Link>
              <a href={googlePlayUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:scale-105 transition-transform"><img src="/google-play-badge.svg" alt="Get Learn Fun on Google Play" className="h-12 w-auto" /></a>
            </div>
          </section>

          <footer className="text-sm text-gray-600 space-y-2 border-t border-gray-100 pt-6">
            <h2 className="text-lg font-bold text-[#1E1B4B]">Sources for parents</h2>
            <p><a className="text-[#2563EB] hover:text-[#1D4ED8]" href="https://www.healthychildren.org/English/family-life/Media/Pages/How-to-Make-a-Family-Media-Use-Plan.aspx" target="_blank" rel="noopener noreferrer">American Academy of Pediatrics: How to Make a Family Media Plan</a></p>
            <p><a className="text-[#2563EB] hover:text-[#1D4ED8]" href="https://www.healthychildren.org/English/family-life/Media/Pages/why-co-viewing-is-important-tips-to-share-screen-time-with-your-kids.aspx" target="_blank" rel="noopener noreferrer">American Academy of Pediatrics: Why Co-Viewing Is Important</a></p>
          </footer>
        </article>
        <aside className="bg-white p-6 rounded-3xl border border-gray-100 text-base leading-relaxed"><h2 className="text-xl font-bold">Choosing an app for offline learning?</h2><p>Read our <a href="/blog/offline-learning-apps-for-toddlers" className="text-[#2563EB]">guide to free offline learning apps for ages 2?5</a> for activity ideas, app examples and practical checks.</p><a href="/blog" className="text-[#2563EB]">All parent guides</a></aside>
      </main>

      <footer className="bg-white border-t border-gray-100 py-6 px-4 text-center text-xs text-gray-500 font-medium">
        <Link to="/" className="text-[#2563EB] hover:text-[#1D4ED8]">Back to Learn Fun home</Link>
      </footer>
    </div>
  );
}

const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '../dist');

if (!fs.existsSync(distDir)) {
  console.error('Dist directory does not exist! Run vite build first.');
  process.exit(1);
}

const baseTemplate = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

const routes = [
  {
    path: '/',
    outputPath: path.join(distDir, 'index.html'),
    title: 'Learn Fun – Offline Learning App for Toddlers & Preschoolers Ages 1–5',
    description: 'Learn Fun is an offline-first educational app for toddlers and preschoolers. Help children learn ABCs, phonics, numbers 1-20, shapes, colors, and mini-games in a safe, ad-free environment.',
    canonical: 'https://learnfunkids.vercel.app/',
    h1: 'Learn Fun – Offline Learning App for Toddlers & Preschoolers',
    content: `
      <header>
        <nav>
          <a href="/">Learn Fun</a>
          <a href="/play">Play Online Free</a>
          <a href="https://play.google.com/store/apps/details?id=com.learnfunkids.app">Get on Google Play</a>
        </nav>
      </header>
      <main>
        <section>
          <h1>Learn Fun – Offline Learning App for Toddlers & Preschoolers</h1>
          <p>Help little learners ages 1–5 explore ABCs, phonics, numbers 1–20, shapes, colors, animals, and mini-games in a safe, ad-free environment.</p>
          <div style="margin: 24px 0; border-radius: 20px; overflow: hidden; background: #FFFFFF; border: 1px solid #E5E7EB; box-shadow: 0 20px 50px rgba(0,0,0,0.12);">
            <div style="padding: 12px 16px; display: flex; align-items: center; gap: 12px; background: #FFFFFF; border-bottom: 1px solid #F3F4F6;">
              <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #FF5F56;"></span>
              <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #FFBD2E;"></span>
              <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #27C93F;"></span>
              <span style="font-size: 13px; color: #6B7280; font-family: sans-serif;">https://learnfunkids.vercel.app</span>
            </div>
            <video src="/learn-fun-demo.mp4" autoplay loop muted playsinline controls style="width: 100%; height: auto; display: block; background: #1A0050;"></video>
          </div>
          <a href="/play">Play Now in Browser</a>
          <a href="https://play.google.com/store/apps/details?id=com.learnfunkids.app">Get on Google Play</a>
        </section>
        <section>
          <h2>Phonics & Speech Foundation</h2>
          <p>Explore letter sounds, visual vocabulary words, and selected human-recorded phonics clips in interactive lessons.</p>
          <a href="/features/phonics">Learn More About Phonics</a>
        </section>
        <section>
          <h2>Numbers 1–20 & Early Mathematical Cognition</h2>
          <p>Build confident number sense and shapes from 1 to 20 with concrete visual counting, 10 shapes, and 12 vibrant colors.</p>
          <a href="/features/numbers">Explore Numbers & Math</a>
        </section>
        <section>
          <h2>Everything Your Child Needs in One Safe App</h2>
          <ul>
            <li>100% Offline-First (No Wi-Fi Needed)</li>
            <li>Interactive Phonics Audio</li>
            <li>6 Interactive Mini-Games</li>
            <li>Star Rewards & Learning Streaks</li>
            <li>Child-Proof Parent PIN Security Gate</li>
            <li>Zero Commercial Ads or Popups</li>
          </ul>
        </section>
        <section>
          <h2>100% Free & Transparent Education</h2>
          <p>No subscriptions, no paywalled levels, no hidden in-app purchases. Always free for every family.</p>
        </section>
        <section>
          <h2>Useful Resources for Parents & Educators</h2>
          <ul>
            <li><a href="/features/phonics">Explore Phonics Audio in Learn Fun</a></li>
            <li><a href="/features/alphabet">The Foundation of Early Letter Recognition & ABCs</a></li>
            <li><a href="/features/numbers">Building Concrete Number Sense from 1 to 20</a></li>
          </ul>
        </section>
      </main>
      <footer>
        <a href="/play">Play App</a>
        <a href="/features/phonics">Phonics Feature</a>
        <a href="/features/alphabet">Alphabet Feature</a>
        <a href="/features/numbers">Numbers Feature</a>
        <a href="/privacy.html">Privacy Policy</a>
      </footer>
    `
  },
  {
    path: '/features/phonics',
    outputPath: path.join(distDir, 'features/phonics/index.html'),
    title: 'Phonics & Sound Experience for Preschoolers | Learn Fun',
    description: 'Explore phonics audio and letter-sound activities in Learn Fun. Help toddlers and preschoolers practise early pronunciation offline.',
    canonical: 'https://learnfunkids.vercel.app/features/phonics',
    h1: 'Phonics & Sound Experience for Preschoolers',
    content: `
      <main>
        <h1>Phonics & Sound Experience for Preschoolers</h1>
        <p>Discover how Learn Fun helps toddlers aged 1–5 explore letter sounds and early pronunciation through interactive sound activities.</p>
        <h2>Phonics Audio and Sound Exploration</h2>
        <p>Learn Fun pairs letter-sound activities with locally packaged audio for selected phonics lessons and visual vocabulary prompts.</p>
        <a href="/play">Play Phonics Game Online</a>
      </main>
    `
  },
  {
    path: '/features/alphabet',
    outputPath: path.join(distDir, 'features/alphabet/index.html'),
    title: 'Alphabet & Letter Learning for Toddlers | Learn Fun',
    description: 'Discover A to Z alphabet cards, uppercase and lowercase letters, and picture vocabulary words in Learn Fun.',
    canonical: 'https://learnfunkids.vercel.app/features/alphabet',
    h1: 'Alphabet & Letter Learning for Toddlers',
    content: `
      <main>
        <h1>Alphabet & Letter Learning for Toddlers</h1>
        <p>Help your toddler explore A to Z uppercase and lowercase letters, vocabulary words, and interactive picture association.</p>
        <h2>Interactive A–Z Vocabulary Building</h2>
        <p>Learn Fun presents all 26 letters through visual engagement, uppercase and lowercase pairs, and vocabulary prompts.</p>
        <a href="/play">Play Alphabet Game Online</a>
      </main>
    `
  },
  {
    path: '/features/numbers',
    outputPath: path.join(distDir, 'features/numbers/index.html'),
    title: 'Numbers 1–20 & Visual Counting for Preschoolers | Learn Fun',
    description: 'Learn numbers 1 through 20 with visual object counting, numbers, and audio counting in Learn Fun.',
    canonical: 'https://learnfunkids.vercel.app/features/numbers',
    h1: 'Numbers 1–20 & Visual Counting for Preschoolers',
    content: `
      <main>
        <h1>Numbers 1–20 & Visual Counting for Preschoolers</h1>
        <p>Build early numeracy skills with visual item counting, number recognition 1 through 20, and clear audio feedback.</p>
        <h2>Visual & Audio Counting Foundation</h2>
        <p>Learn Fun pairs numbers 1 to 20 with countable item emojis, audio counting, and progressive milestone rewards.</p>
        <a href="/play">Play Numbers Game Online</a>
      </main>
    `
  },
  {
    path: '/play',
    outputPath: path.join(distDir, 'play/index.html'),
    title: 'Learn Fun Play',
    description: 'Open the Learn Fun interactive learning app for children ages 1–5.',
    canonical: 'https://learnfunkids.vercel.app/play',
    robots: 'noindex, follow',
    content: `
      <main>
        <h1>Learn Fun Play</h1>
        <p>Open the interactive Learn Fun learning app.</p>
      </main>
    `
  }
];

routes.forEach(route => {
  const dir = path.dirname(route.outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const appSchema = {
        "@type": "SoftwareApplication",
        "@id": "https://learnfunkids.vercel.app/#app",
        "name": "Learn Fun",
        "url": "https://learnfunkids.vercel.app/",
        "operatingSystem": "Web, Android, PWA",
        "applicationCategory": "EducationalApplication",
        "educationalUse": "Early Childhood Education, Preschool Learning, Phonics, Number Recognition",
        "audience": {
          "@type": "EducationalAudience",
          "educationalRole": "student",
          "suggestedMinAge": "1",
          "suggestedMaxAge": "5"
        },
        "description": "Learn Fun is a free educational app for children ages 1–5 with alphabet, phonics, numbers, shapes, colors, animals, and interactive mini-games.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      };
  const websiteSchema = {
        "@type": "WebSite",
        "@id": "https://learnfunkids.vercel.app/#website",
        "url": "https://learnfunkids.vercel.app/",
        "name": "Learn Fun",
        "description": "Offline early learning app for toddlers and preschoolers aged 1-5."
      };
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": route.path === '/'
      ? [appSchema, websiteSchema]
      : [{
          "@type": "WebPage",
          "@id": `${route.canonical}#webpage`,
          "url": route.canonical,
          "name": route.title,
          "description": route.description,
          "isPartOf": { "@id": "https://learnfunkids.vercel.app/#website" }
        }]
  };

  let html = baseTemplate;
  html = html.replace(/<title>.*?<\/title>/, `<title>${route.title}</title>`);
  html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${route.description}" />`);
  html = html.replace(/<meta name="robots" content=".*?" \/>/, `<meta name="robots" content="${route.robots ?? "index, follow"}" />`);
  html = html.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${route.title}" />`);
  html = html.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${route.description}" />`);
  html = html.replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${route.canonical}" />`);
  html = html.replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${route.title}" />`);
  html = html.replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${route.description}" />`);
  
  if (!html.includes('<link rel="canonical"')) {
    html = html.replace('</head>', `  <link rel="canonical" href="${route.canonical}" />\n  </head>`);
  } else {
    html = html.replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${route.canonical}" />`);
  }

  // Inject prerendered content into root
  html = html.replace('<div id="root"></div>', `<div id="root">${route.content}</div>\n  <script type="application/ld+json">\n  ${JSON.stringify(jsonLd, null, 2)}\n  </script>`);

  fs.writeFileSync(route.outputPath, html, 'utf8');
  console.log(`Prerendered ${route.path} -> ${route.outputPath}`);
});

console.log('Prerendering completed successfully.');

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
          <p>Help little learners ages 1–5 explore ABCs, human audio phonics, numbers 1–20, shapes, colors, animals, and mini-games in a safe, ad-free environment.</p>
          <a href="/play">Play Now in Browser</a>
          <a href="https://play.google.com/store/apps/details?id=com.learnfunkids.app">Get on Google Play</a>
        </section>
        <section>
          <h2>What Children Can Learn</h2>
          <ul>
            <li><strong>Alphabet & Letters:</strong> A to Z letter sounds and vocabulary words.</li>
            <li><strong>Phonics:</strong> Human-recorded phonics audio for clear pronunciation.</li>
            <li><strong>Numbers 1–20:</strong> Visual item counting and numerical mastery.</li>
            <li><strong>Shapes & Colors:</strong> 10 basic shapes and 12 vibrant colors.</li>
            <li><strong>Animals & Vocabulary:</strong> Farm animals, wild animals, fruits, and vehicles.</li>
            <li><strong>Interactive Mini-Games:</strong> Memory match, drag & drop, balloon pop, puzzles, shadow match.</li>
          </ul>
        </section>
        <section>
          <h2>Why Parents Love Learn Fun</h2>
          <ul>
            <li>100% Offline-First Learning</li>
            <li>Safe & Ad-Free Environment</li>
            <li>Human Voice Recorded Phonics</li>
            <li>Progressive Star Unlock System</li>
            <li>Child-Proof Parent PIN Security</li>
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
    description: 'Explore human-recorded phonics audio and speech sounds in Learn Fun. Help toddlers and preschoolers learn letter pronunciations offline.',
    canonical: 'https://learnfunkids.vercel.app/features/phonics',
    h1: 'Phonics & Sound Experience for Preschoolers',
    content: `
      <main>
        <h1>Phonics & Sound Experience for Preschoolers</h1>
        <p>Discover how Learn Fun helps toddlers aged 1–5 master letter sounds and early pronunciation using human-recorded audio recordings and interactive sound exploration.</p>
        <h2>Human Voice Recorded Audio</h2>
        <p>Learn Fun uses real human voice clips for phonics lessons, ensuring clear and accurate phonetic pronunciations for every letter from A to Z.</p>
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
        <p>Learn Fun presents letter learning through visual engagement and real voice audio for all 26 letters of the alphabet.</p>
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
  }
];

routes.forEach(route => {
  const dir = path.dirname(route.outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": "https://learnfunkids.vercel.app/#app",
        "name": "Learn Fun",
        "url": "https://learnfunkids.vercel.app/",
        "operatingSystem": "Web, Android, PWA",
        "applicationCategory": "EducationalApplication",
        "educationalUse": "Early Childhood Education, Preschool Learning, Phonics, Mathematics",
        "audience": {
          "@type": "EducationalAudience",
          "educationalRole": "student",
          "suggestedMinAge": "1",
          "suggestedMaxAge": "5"
        },
        "description": route.description,
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://learnfunkids.vercel.app/#website",
        "url": "https://learnfunkids.vercel.app/",
        "name": "Learn Fun",
        "description": "Offline early learning app for toddlers and preschoolers aged 1-5."
      }
    ]
  };

  let html = baseTemplate;
  html = html.replace(/<title>.*?<\/title>/, `<title>${route.title}</title>`);
  html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${route.description}" />`);
  
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

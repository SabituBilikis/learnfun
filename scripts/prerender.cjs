(async () => {
  const fs = require("fs");
  const path = require("path");

  const distDir = path.resolve(__dirname, "../dist");

  if (!fs.existsSync(distDir)) {
    console.error("Dist directory does not exist! Run vite build first.");
    process.exit(1);
  }

  const baseTemplate = fs.readFileSync(path.join(distDir, "index.html"), "utf8");

  const routes = [
    {
      path: "/",
      outputPath: path.join(distDir, "index.html"),
      title: "Learn Fun – Offline Learning App for Toddlers & Preschoolers Ages 1–5",
      description:
        "Learn Fun is an offline-first educational app for toddlers and preschoolers. Help children learn ABCs, phonics, numbers 1-20, shapes, colors, and mini-games in a safe, ad-free environment.",
      canonical: "https://learnfunkids.vercel.app/",
      h1: "Learn Fun – Offline Learning App for Toddlers & Preschoolers",
    },
    {
      path: "/features/phonics",
      outputPath: path.join(distDir, "features/phonics/index.html"),
      title: "Phonics & Sound Experience for Preschoolers | Learn Fun",
      description:
        "Explore phonics audio and letter-sound activities in Learn Fun. Help toddlers and preschoolers practise early pronunciation offline.",
      canonical: "https://learnfunkids.vercel.app/features/phonics",
      h1: "Phonics & Sound Experience for Preschoolers",
    },
    {
      path: "/features/alphabet",
      outputPath: path.join(distDir, "features/alphabet/index.html"),
      title: "Alphabet & Letter Learning for Toddlers | Learn Fun",
      description:
        "Discover A to Z alphabet cards, uppercase and lowercase letters, and picture vocabulary words in Learn Fun.",
      canonical: "https://learnfunkids.vercel.app/features/alphabet",
      h1: "Alphabet & Letter Learning for Toddlers",
    },
    {
      path: "/features/numbers",
      outputPath: path.join(distDir, "features/numbers/index.html"),
      title: "Numbers 1–20 & Visual Counting for Preschoolers | Learn Fun",
      description:
        "Learn numbers 1 through 20 with visual object counting, numbers, and audio counting in Learn Fun.",
      canonical: "https://learnfunkids.vercel.app/features/numbers",
      h1: "Numbers 1–20 & Visual Counting for Preschoolers",
    },
    {
      path: "/guides/offline-educational-apps-toddlers",
      outputPath: path.join(distDir, "guides/offline-educational-apps-toddlers/index.html"),
      title: "Offline Educational Apps for Toddlers: A Parent’s Checklist | Learn Fun",
      description:
        "Use this parent checklist to compare offline educational apps for toddlers, including Wi-Fi access, ads, purchases, parent controls, and age fit.",
      canonical: "https://learnfunkids.vercel.app/guides/offline-educational-apps-toddlers",
    },
    {
      path: "/play",
      outputPath: path.join(distDir, "play/index.html"),
      title: "Learn Fun Play",
      description: "Open the Learn Fun interactive learning app for children ages 1–5.",
      canonical: "https://learnfunkids.vercel.app/play",
      robots: "noindex, follow",
      content: `
      <main>
        <h1>Learn Fun Play</h1>
        <p>Open the interactive Learn Fun learning app.</p>
      </main>
    `,
    },
  ];

  routes.push(...require("./blog-routes.cjs")(distDir));
  const { pathToFileURL } = require("node:url");
  const { JSDOM } = require("jsdom");
  const { renderPublicPage, playStoreUrl } = await import(
    pathToFileURL(path.resolve(__dirname, "../.prerender/prerender.js")).href
  );
  for (const route of routes) {
    const rendered = renderPublicPage(route.path);
    if (!rendered) continue;
    const document = new JSDOM(rendered).window.document;
    for (const link of document.querySelectorAll('a[href*="play.google.com"]')) {
      const target = new URL(link.href);
      if (
        target.hostname !== "play.google.com" ||
        target.searchParams.get("id") !== "com.learnfunkids.app"
      )
        continue;
      link.href = playStoreUrl(route.path);
    }
    route.content = document.body.innerHTML;
  }

  routes.forEach((route) => {
    const dir = path.dirname(route.outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const appSchema = {
      "@type": "SoftwareApplication",
      "@id": "https://learnfunkids.vercel.app/#app",
      name: "Learn Fun",
      url: "https://learnfunkids.vercel.app/",
      operatingSystem: "Web, Android, PWA",
      applicationCategory: "EducationalApplication",
      educationalUse: "Early Childhood Education, Preschool Learning, Phonics, Number Recognition",
      audience: {
        "@type": "EducationalAudience",
        educationalRole: "student",
        suggestedMinAge: "1",
        suggestedMaxAge: "5",
      },
      description:
        "Learn Fun is a free educational app for children ages 1–5 with alphabet, phonics, numbers, shapes, colors, animals, and interactive mini-games.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    };
    const websiteSchema = {
      "@type": "WebSite",
      "@id": "https://learnfunkids.vercel.app/#website",
      url: "https://learnfunkids.vercel.app/",
      name: "Learn Fun",
      description: "Offline early learning app for toddlers and preschoolers aged 1-5.",
    };
    const jsonLd = {
      "@context": "https://schema.org",
      "@graph":
        route.path === "/"
          ? [appSchema, websiteSchema]
          : [
              {
                "@type": "WebPage",
                "@id": `${route.canonical}#webpage`,
                url: route.canonical,
                name: route.title,
                description: route.description,
                isPartOf: { "@id": "https://learnfunkids.vercel.app/#website" },
              },
            ],
    };
    if (route.article) jsonLd["@graph"].push(route.article);

    let html = baseTemplate;
    if (route.article)
      html = html.replace(
        'property="og:type" content="website"',
        'property="og:type" content="article"',
      );
    html = html.replace(/<title>.*?<\/title>/, `<title>${route.title}</title>`);
    html = html.replace(
      /<meta name="description" content=".*?" \/>/,
      `<meta name="description" content="${route.description}" />`,
    );
    html = html.replace(
      /<meta name="robots" content=".*?" \/>/,
      `<meta name="robots" content="${route.robots ?? "index, follow"}" />`,
    );
    html = html.replace(
      /<meta property="og:title" content=".*?" \/>/,
      `<meta property="og:title" content="${route.title}" />`,
    );
    html = html.replace(
      /<meta property="og:description" content=".*?" \/>/,
      `<meta property="og:description" content="${route.description}" />`,
    );
    html = html.replace(
      /<meta property="og:url" content=".*?" \/>/,
      `<meta property="og:url" content="${route.canonical}" />`,
    );
    html = html.replace(
      /<meta name="twitter:title" content=".*?" \/>/,
      `<meta name="twitter:title" content="${route.title}" />`,
    );
    html = html.replace(
      /<meta name="twitter:description" content=".*?" \/>/,
      `<meta name="twitter:description" content="${route.description}" />`,
    );

    if (!html.includes('<link rel="canonical"')) {
      html = html.replace(
        "</head>",
        `  <link rel="canonical" href="${route.canonical}" />\n  </head>`,
      );
    } else {
      html = html.replace(
        /<link rel="canonical" href=".*?" \/>/,
        `<link rel="canonical" href="${route.canonical}" />`,
      );
    }

    // Inject prerendered content into root
    html = html.replace(
      '<div id="root"></div>',
      `<div id="root">${route.content}</div>\n  <script type="application/ld+json"${route.article ? " data-blog-schema" : ""}>\n  ${JSON.stringify(jsonLd, null, 2).replace(/</g, "\\u003c")}\n  </script>`,
    );

    fs.writeFileSync(route.outputPath, html, "utf8");
    console.log(`Prerendered ${route.path} -> ${route.outputPath}`);
  });

  // Vite generated the service worker before prerendering. Refresh only the
  // homepage revision so returning/offline clients receive the final HTML rather
  // than a stale shell. Keep the existing precache list and game routing intact.
  const crypto = require("node:crypto");
  const workerPath = path.join(distDir, "sw.js");
  const finalRevision = crypto
    .createHash("sha256")
    .update(fs.readFileSync(path.join(distDir, "index.html")))
    .digest("hex");
  const worker = fs.readFileSync(workerPath, "utf8");
  const homepageEntry = /url:"index\.html",revision:"[^"]+"/;
  if (!homepageEntry.test(worker)) throw new Error("Homepage service worker revision not found");
  fs.writeFileSync(
    workerPath,
    worker.replace(homepageEntry, 'url:"index.html",revision:"' + finalRevision + '"'),
  );
  console.log("Prerendering completed successfully.");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

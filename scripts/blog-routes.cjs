const path = require("node:path");
const articles = require("../src/features/blog/articles.json");
const origin = "https://learnfunkids.vercel.app";

// Page markup comes from the shared React server renderer.
module.exports = (distDir) => [
  {
    path: "/blog",
    outputPath: path.join(distDir, "blog/index.html"),
    title: "Parent Learning Blog | Learn Fun",
    description:
      "Practical guides for parents choosing educational apps and exploring playful early learning with toddlers and preschoolers.",
    canonical: origin + "/blog",
  },
  ...articles.map((post) => ({
    path: "/blog/" + post.slug,
    outputPath: path.join(distDir, "blog", post.slug, "index.html"),
    title: post.seoTitle,
    description: post.description,
    canonical: origin + "/blog/" + post.slug,
    article: {
      "@type": "Article",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.date,
      author: { "@type": "Organization", name: post.author, url: origin + "/blog" },
      publisher: { "@type": "Organization", name: "Learn Fun", url: origin },
      mainEntityOfPage: origin + "/blog/" + post.slug,
      inLanguage: "en",
    },
  })),
];

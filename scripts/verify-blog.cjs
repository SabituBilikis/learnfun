const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const { JSDOM } = require("jsdom");
const articles = require("../src/features/blog/articles.json");
const dist = path.resolve(__dirname, "../dist");
const origin = "https://learnfunkids.vercel.app";
const config = require("../vercel.json");
const publicPages = require("../src/lib/publicPages.json");
const crypto = require("node:crypto");
assert.equal(config.buildCommand, "npm run build");
assert.equal(config.outputDirectory, "dist");
const revision = crypto
  .createHash("sha256")
  .update(fs.readFileSync(path.join(dist, "index.html")))
  .digest("hex");
assert(
  fs
    .readFileSync(path.join(dist, "sw.js"), "utf8")
    .includes(`url:"index.html",revision:"${revision}"`),
  "Service worker must cache the final prerendered homepage",
);
const xml = new JSDOM(fs.readFileSync(path.join(dist, "sitemap.xml"), "utf8"), {
  contentType: "application/xml",
}).window.document;
assert.equal(xml.querySelector("parsererror"), null, "Sitemap must be valid XML");
const urls = [...xml.querySelectorAll("loc")].map((node) => node.textContent);
assert.deepEqual(
  [...urls].sort(),
  Object.keys(publicPages)
    .map((pathname) => origin + pathname)
    .sort(),
  "Sitemap must match the approved public page inventory",
);
assert.equal(new Set(urls).size, urls.length, "Duplicate sitemap URL");
assert.equal(xml.documentElement.namespaceURI, "http://www.sitemaps.org/schemas/sitemap/0.9");
for (const url of urls) {
  assert.equal(new URL(url).origin, origin);
  const pathname = new URL(url).pathname;
  const html = fs.readFileSync(path.join(dist, pathname, "index.html"), "utf8");
  const document = new JSDOM(html).window.document;
  assert.equal(document.querySelector('link[rel="canonical"]').href, url);
  assert.equal(document.querySelectorAll("h1").length, 1);
  assert(!document.querySelector('meta[name="robots"]').content.includes("noindex"));
  if (pathname === "/") {
    const cards = document.querySelectorAll("#resources > .grid > a");
    assert.equal(cards.length, 4, "Homepage resources must contain four cards");
    assert([...cards].some(card => card.getAttribute("href") === "/blog/offline-learning-apps-for-toddlers"), "The blog article must be a resource card");
    assert(!document.body.textContent.includes("New on the parent blog"), "Separate blog banner must be removed");
  }
  for (const image of document.querySelectorAll('img[src^="/"]')) {
    assert(
      fs.existsSync(path.join(dist, image.getAttribute("src"))),
      `Missing image: ${image.getAttribute("src")}`,
    );
  }
  for (const link of document.querySelectorAll('a[href*="play.google.com"]')) {
    const destination = new URL(link.href);
    assert.equal(destination.searchParams.get("utm_source"), "learnfun_website");
    const campaign =
      pathname === "/" ? "homepage" : pathname.slice(1).replaceAll("/", "_").replaceAll("-", "_");
    assert.equal(destination.searchParams.get("utm_campaign"), campaign);
    assert.deepEqual([...destination.searchParams.keys()].sort(), [
      "id",
      "utm_campaign",
      "utm_source",
    ]);
  }
  if (publicPages[pathname] === "feature") {
    assert(
      document.querySelector('a[href*="play.google.com"]'),
      "Full feature HTML must include the store CTA",
    );
    assert(document.querySelectorAll("h2").length >= 2, "Feature HTML must include its sections");
  }
}
for (const route of ["/blog", ...articles.map((post) => `/blog/${post.slug}`)]) {
  assert(urls.includes(origin + route), "Missing sitemap entry");
  for (const suffix of ["", "/"])
    assert.equal(
      config.rewrites.find((rule) => rule.source === route + suffix)?.destination,
      route + "/index.html",
    );
  // JSDOM does not execute scripts: assertions inspect only the initial HTML.
  const document = new JSDOM(fs.readFileSync(path.join(dist, route, "index.html"), "utf8")).window
    .document;
  assert(document.querySelector(".blog-main"), "Missing styled initial content");
  assert(
    [...document.querySelectorAll('link[rel="stylesheet"]')].some((link) => {
      const css = fs.readFileSync(path.join(dist, link.getAttribute("href")), "utf8");
      return css.includes(".blog-article");
    }),
    "Article CSS must be available before JavaScript",
  );
  for (const anchor of document.querySelectorAll('a[href^="#"]'))
    assert(document.getElementById(anchor.hash.slice(1)), "Broken contents link");
  if (route !== "/blog") {
    const post = articles.find((item) => route.endsWith(item.slug));
    assert.equal(document.title, post.seoTitle);
    assert.equal(document.querySelector('meta[name="description"]').content, post.description);
    assert.equal(document.querySelector('meta[property="og:type"]').content, "article");
    const body = new JSDOM(post.body).window.document;
    for (const element of body.querySelectorAll("p, h2, h3, li"))
      assert(document.body.textContent.includes(element.textContent), "Missing article content");
    const graph = JSON.parse(document.querySelector("script[data-blog-schema]").textContent)[
      "@graph"
    ];
    const schema = graph.find((item) => item["@type"] === "Article");
    assert.equal(schema.headline, post.title);
    assert.equal(schema.mainEntityOfPage, origin + route);
    assert.equal(schema.dateModified, post.date);
  }
}
console.log(
  `Verified ${urls.length} canonical sitemap URLs, blog rewrites, metadata, Article schema, stylesheet and complete article HTML without JavaScript.`,
);

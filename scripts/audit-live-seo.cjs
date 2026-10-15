// Read-only public HTTP audit. Never submits indexing requests or sends events.
const { JSDOM } = require("jsdom");
const pages = require("../src/lib/publicPages.json");
const origin = "https://learnfunkids.vercel.app";

async function main() {
  const failures = [];
  const sitemapResponse = await fetch(origin + "/sitemap.xml");
  if (sitemapResponse.status !== 200) failures.push("Sitemap is not HTTP 200");
  const sitemap = new JSDOM(await sitemapResponse.text(), { contentType: "application/xml" }).window
    .document;
  const urls = [...sitemap.querySelectorAll("loc")].map((node) => node.textContent);
  const robots = await fetch(origin + "/robots.txt");
  if (robots.status !== 200 || !(await robots.text()).includes(`Sitemap: ${origin}/sitemap.xml`))
    failures.push("robots.txt sitemap declaration is missing");
  for (const pathname of Object.keys(pages)) {
    const url = origin + pathname;
    if (!urls.includes(url)) failures.push(`Missing from sitemap: ${pathname}`);
    const response = await fetch(url, { redirect: "follow" });
    const document = new JSDOM(await response.text()).window.document;
    const canonical = document.querySelector('link[rel="canonical"]')?.href;
    const directives = `${response.headers.get("x-robots-tag") ?? ""} ${document.querySelector('meta[name="robots"]')?.content ?? ""}`;
    if (response.status !== 200) failures.push(`HTTP ${response.status}: ${pathname}`);
    if (canonical !== url)
      failures.push(`Wrong canonical: ${pathname} -> ${canonical ?? "missing"}`);
    if (/noindex/i.test(directives)) failures.push(`Noindex: ${pathname}`);
    if (document.querySelectorAll("h1").length !== 1) failures.push(`Expected one H1: ${pathname}`);
    if (
      pages[pathname] === "article" &&
      !document.body.textContent.includes("Try this before leaving home")
    )
      failures.push(`Article content missing from initial HTML: ${pathname}`);
    if (pages[pathname] === "feature" && !document.querySelector('a[href*="play.google.com"]'))
      failures.push(`Full feature page/CTA missing: ${pathname}`);
    console.log(`${response.status} ${pathname} | ${document.title} | canonical ${canonical}`);
  }
  const play = new JSDOM(await (await fetch(origin + "/play")).text()).window.document;
  if (!play.querySelector('meta[name="robots"]')?.content.includes("noindex"))
    failures.push("/play must remain noindex");
  if (failures.length) {
    console.error("Live deployment verification failed:\n" + failures.join("\n"));
    process.exitCode = 1;
  } else
    console.log(
      "Live public HTML and sitemap checks passed. This does not prove Google indexing or analytics collection.",
    );
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

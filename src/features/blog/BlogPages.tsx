import { useEffect } from "react";
import { Link } from "react-router";
import articles from "./articles.json";
import { learnFunLogo } from "@/lib/branding";

const origin = "https://learnfunkids.vercel.app";
const article = articles[0];

// Public editorial pages use document links so each navigation receives its
// prerendered head. This effect also covers entry from the React application.
function useMetadata(title: string, description: string, path: string, isArticle = false) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;
    const restores: (() => void)[] = [];
    const set = (selector: string, tag: string, attributes: Record<string, string>) => {
      let element = document.head.querySelector(selector);
      const previous = element?.outerHTML;
      if (!element) {
        element = document.createElement(tag);
        document.head.appendChild(element);
      }
      const current = element;
      Object.entries(attributes).forEach(([name, value]) => current.setAttribute(name, value));
      restores.push(() => {
        if (previous) current.outerHTML = previous;
        else current.remove();
      });
    };
    set('meta[name="description"]', "meta", { name: "description", content: description });
    set('link[rel="canonical"]', "link", { rel: "canonical", href: origin + path });
    for (const [property, content] of Object.entries({
      "og:title": title,
      "og:description": description,
      "og:url": origin + path,
      "og:type": isArticle ? "article" : "website",
    })) {
      set(`meta[property="${property}"]`, "meta", { property, content });
    }
    for (const [name, content] of Object.entries({
      "twitter:title": title,
      "twitter:description": description,
    })) {
      set(`meta[name="${name}"]`, "meta", { name, content });
    }
    return () => {
      document.title = previousTitle;
      restores.reverse().forEach((restore) => restore());
    };
  }, [title, description, path, isArticle]);
}

function BlogHeader() {
  return (
    <header className="blog-header">
      <a href="/" aria-label="Learn Fun home" className="blog-brand">
        <img src={learnFunLogo} alt="Learn Fun" />
      </a>
      <nav aria-label="Main navigation">
        <a href="/blog">Parent blog</a>
        <Link to="/play" className="blog-play-button">
          Play Free Online
        </Link>
      </nav>
    </header>
  );
}

export function BlogHubPage() {
  useMetadata(
    "Parent Learning Blog | Learn Fun",
    "Practical guides for parents choosing educational apps and exploring playful early learning with toddlers and preschoolers.",
    "/blog",
  );
  return (
    <div className="blog-page">
      <BlogHeader />
      <main className="blog-main">
        <h1>Learning guides for parents</h1>
        <p>Practical ideas for choosing apps and taking learning beyond the screen.</p>
        {articles.map((post) => (
          <article className="blog-card" key={post.slug}>
            <p className="blog-eyebrow">App guides · Ages 2–5</p>
            <h2>
              <a href={`/blog/${post.slug}`}>{post.title}</a>
            </h2>
            <p>{post.description}</p>
            <a href={`/blog/${post.slug}`}>Read the guide →</a>
          </article>
        ))}
        <p>
          Need a quick check before travelling? See our{" "}
          <a href="/guides/offline-educational-apps-toddlers">offline app checklist</a>.
        </p>
      </main>
    </div>
  );
}

export function OfflineLearningArticlePage() {
  useMetadata(article.seoTitle, article.description, `/blog/${article.slug}`, true);
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.description,
      datePublished: article.date,
      dateModified: article.date,
      author: { "@type": "Organization", name: article.author, url: origin + "/blog" },
      publisher: { "@type": "Organization", name: "Learn Fun", url: origin },
      mainEntityOfPage: origin + `/blog/${article.slug}`,
      inLanguage: "en",
    };
    const existing = document.querySelector("script[data-blog-schema]");
    const script = existing ?? document.createElement("script");
    script.setAttribute("type", "application/ld+json");
    script.setAttribute("data-blog-schema", "");
    script.textContent = JSON.stringify(schema);
    if (!existing) document.head.appendChild(script);
    return () => script.remove();
  }, []);
  return (
    <div className="blog-page">
      <BlogHeader />
      <main className="blog-main">
        <article className="blog-article">
          <a href="/blog" className="blog-back-link">← All parent guides</a>
          <p className="blog-eyebrow">App guides · Ages 2–5</p>
          <h1>{article.title}</h1>
          <p className="blog-byline">
            By {article.author} · Reviewed <time dateTime={article.date}>October 14, 2026</time>
          </p>
          <p className="blog-intro">{article.intro}</p>
          <nav aria-label="Article contents" className="blog-contents">
            <strong>In this guide</strong>
            <a href="#offline">Test offline access</a>
            <a href="#age-fit">Choose age-appropriate activities</a>
            <a href="#examples">App examples and limitations</a>
            <a href="#faq">Frequently asked questions</a>
          </nav>
          {/* Trusted, repository-authored editorial HTML; never user input. */}
          <div dangerouslySetInnerHTML={{ __html: article.body }} />
        </article>
      </main>
    </div>
  );
}

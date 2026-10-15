import publicPages from "./publicPages.json";
import { Capacitor } from "@capacitor/core";

export const PUBLIC_ORIGIN = "https://learnfunkids.vercel.app";
const PLAY_URL = "https://play.google.com/store/apps/details?id=com.learnfunkids.app";
export type MarketingEvent = "pageview" | "play_online_clicked" | "google_play_clicked";
export type Placement = "header" | "footer" | "navigation" | "content";
const placements = new Set<Placement>(["header", "footer", "navigation", "content"]);

export function publicPath(path: string): keyof typeof publicPages | null {
  const canonical = path.replace(/\/index\.html$/, "").replace(/\/$/, "") || "/";
  return Object.prototype.hasOwnProperty.call(publicPages, canonical)
    ? (canonical as keyof typeof publicPages)
    : null;
}

// Only these known provider domains can leave the browser. No referring paths,
// query strings, arbitrary campaign values or unknown hostnames are transmitted.
export function referralSource(referrer: string) {
  const unknown = { category: "direct_or_unknown", provider: "unknown", referrer: "" };
  if (!referrer) return unknown;
  try {
    const url = new URL(referrer);
    if (url.origin === PUBLIC_ORIGIN) return unknown;
    if (!["https:", "http:"].includes(url.protocol)) return unknown;
    const providers = [
      ["chatgpt.com", "ai_referral", "chatgpt"],
      ["chat.openai.com", "ai_referral", "chatgpt"],
      ["perplexity.ai", "ai_referral", "perplexity"],
      ["claude.ai", "ai_referral", "claude"],
      ["copilot.microsoft.com", "ai_referral", "copilot"],
      ["gemini.google.com", "ai_referral", "gemini"],
      ["google.com", "organic_search", "google"],
      ["google.co.uk", "organic_search", "google"],
      ["google.com.ng", "organic_search", "google"],
      ["bing.com", "organic_search", "bing"],
      ["duckduckgo.com", "organic_search", "duckduckgo"],
      ["search.yahoo.com", "organic_search", "yahoo"],
    ];
    for (const [domain, category, provider] of providers) {
      if (url.hostname === domain || url.hostname.endsWith(`.${domain}`)) {
        return { category, provider, referrer: `https://${domain}/` };
      }
    }
    return { category: "other_referral", provider: "other", referrer: "" };
  } catch {
    return unknown;
  }
}

export function playStoreUrl(path: string): string {
  const page = publicPath(path);
  if (!page) return PLAY_URL;
  const campaign =
    page === "/" ? "homepage" : page.slice(1).replaceAll("/", "_").replaceAll("-", "_");
  const url = new URL(PLAY_URL);
  url.searchParams.set("utm_source", "learnfun_website");
  url.searchParams.set("utm_campaign", campaign);
  return url.href;
}

export function marketingPayload(
  event: MarketingEvent,
  path: string,
  referrer: string,
  placement?: Placement,
) {
  const page = publicPath(path);
  if (!page || !["pageview", "play_online_clicked", "google_play_clicked"].includes(event))
    return null;
  const source = referralSource(referrer);
  return {
    name: event,
    domain: "learnfunkids.vercel.app",
    url: PUBLIC_ORIGIN + page,
    referrer: source.referrer,
    props: {
      page_type: publicPages[page],
      source_category: source.category,
      source_provider: source.provider,
      ...(placement && placements.has(placement) ? { placement } : {}),
    },
  };
}

export function sendMarketingEvent(event: MarketingEvent, path: string, placement?: Placement) {
  if (import.meta.env.VITE_PUBLIC_ANALYTICS_ENABLED !== "true" || import.meta.env.DEV) return;
  if (Capacitor.isNativePlatform()) return;
  if (
    window.location.origin !== PUBLIC_ORIGIN ||
    navigator.doNotTrack === "1" ||
    (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl
  )
    return;
  // Read the live location as well as React's path to reject stale callbacks.
  if (!publicPath(window.location.pathname)) return;
  const payload = marketingPayload(event, path, document.referrer, placement);
  if (!payload) return;
  try {
    // No vendor script, automatic route tracker, cookies, retries or offline queue.
    // Browsers still disclose IP/User-Agent to the provider; see the privacy notice.
    void fetch("https://plausible.io/api/event", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "text/plain" },
      credentials: "omit",
      referrerPolicy: "no-referrer",
      keepalive: true,
    }).catch(() => {
      /* Analytics failure must never interrupt navigation. */
    });
  } catch {
    /* Fetch may be unavailable or blocked. */
  }
}

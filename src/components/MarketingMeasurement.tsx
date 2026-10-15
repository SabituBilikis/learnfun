import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { Capacitor } from "@capacitor/core";
import {
  playStoreUrl,
  publicPath,
  sendMarketingEvent,
  type Placement,
} from "@/lib/marketingAnalytics";

export function MarketingMeasurement() {
  const location = useLocation();
  const lastVisit = useRef<string | null>(null);
  useEffect(() => {
    if (Capacitor.isNativePlatform()) return;
    const page = publicPath(location.pathname);
    if (!page) {
      lastVisit.current = null;
      return;
    }
    const visit = `${location.key}:${page}`;
    if (lastVisit.current !== visit) {
      sendMarketingEvent("pageview", page);
      lastVisit.current = visit;
    }

    const decorate = () => {
      if (publicPath(window.location.pathname) !== page) return;
      for (const link of document.querySelectorAll<HTMLAnchorElement>(
        'a[href*="play.google.com"]',
      )) {
        const destination = new URL(link.href, window.location.href);
        if (
          destination.hostname !== "play.google.com" ||
          destination.pathname !== "/store/apps/details" ||
          destination.searchParams.get("id") !== "com.learnfunkids.app"
        )
          continue;
        const tagged = playStoreUrl(page);
        if (link.href !== tagged) link.href = tagged;
      }
    };
    decorate();
    // Lazy pages may mount after this effect. Update links for normal clicks,
    // keyboard activation, copy-link and open-in-new-tab without intercepting them.
    const observer = new MutationObserver(decorate);
    observer.observe(document.getElementById("root") ?? document.body, {
      childList: true,
      subtree: true,
    });
    const click = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        ![0, 1].includes(event.button) ||
        publicPath(window.location.pathname) !== page
      )
        return;
      const link =
        event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!link) return;
      const destination = new URL(link.href, window.location.href);
      const placement: Placement = link.closest("header")
        ? "header"
        : link.closest("footer")
          ? "footer"
          : link.closest("nav")
            ? "navigation"
            : "content";
      if (
        destination.origin === window.location.origin &&
        (destination.pathname === "/play" || destination.pathname.startsWith("/play/"))
      ) {
        sendMarketingEvent("play_online_clicked", page, placement);
      } else if (
        destination.hostname === "play.google.com" &&
        destination.pathname === "/store/apps/details" &&
        destination.searchParams.get("id") === "com.learnfunkids.app"
      ) {
        sendMarketingEvent("google_play_clicked", page, placement);
      }
    };
    document.addEventListener("click", click, true);
    document.addEventListener("auxclick", click, true);
    return () => {
      observer.disconnect();
      document.removeEventListener("click", click, true);
      document.removeEventListener("auxclick", click, true);
    };
  }, [location.pathname, location.key]);
  return null;
}

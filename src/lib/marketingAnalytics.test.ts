import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Capacitor } from "@capacitor/core";
import {
  marketingPayload,
  playStoreUrl,
  publicPath,
  referralSource,
  sendMarketingEvent,
  PUBLIC_ORIGIN,
} from "./marketingAnalytics";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("public-only measurement", () => {
  it("accepts only published public paths, including their HTML aliases", () => {
    expect(publicPath("/blog/offline-learning-apps-for-toddlers/index.html")).toBe(
      "/blog/offline-learning-apps-for-toddlers",
    );
    for (const path of [
      "/play",
      "/play/parent",
      "/play/games",
      "/__audio-diagnostic",
      "/privacy.html",
      "/blog/child-name",
      "/toString",
    ])
      expect(marketingPayload("pageview", path, "")).toBeNull();
  });
  it("never sends referring paths, queries, unknown domains or personal values", () => {
    const payload = marketingPayload(
      "pageview",
      "/features/phonics",
      "https://chatgpt.com/c/private-conversation?name=child",
    );
    expect(payload?.referrer).toBe("https://chatgpt.com/");
    expect(payload?.props.source_category).toBe("ai_referral");
    expect(JSON.stringify(payload)).not.toMatch(/private-conversation|name=child/);
    expect(referralSource("https://private-child-name.example/path").referrer).toBe("");
    expect(referralSource("https://google.com.attacker.example").category).toBe("other_referral");
    expect(referralSource("https://gemini.google.com/app/private").category).toBe("ai_referral");
    expect(referralSource("https://www.google.com/search?q=child-name").category).toBe(
      "organic_search",
    );
  });
  it("tags store links with fixed page campaigns and no visitor identifier", () => {
    const url = new URL(playStoreUrl("/blog/offline-learning-apps-for-toddlers"));
    expect(Object.fromEntries(url.searchParams)).toEqual({
      id: "com.learnfunkids.app",
      utm_source: "learnfun_website",
      utm_campaign: "blog_offline_learning_apps_for_toddlers",
    });
    expect(playStoreUrl("/play/parent")).not.toContain("utm_");
  });
});

describe("collection safeguards", () => {
  beforeEach(() => {
    vi.stubEnv("DEV", false);
    vi.stubEnv("VITE_PUBLIC_ANALYTICS_ENABLED", "true");
    vi.stubGlobal("window", { location: new URL(PUBLIC_ORIGIN + "/") });
    vi.stubGlobal("navigator", { doNotTrack: "0", globalPrivacyControl: false });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ status: 202 }));
    vi.spyOn(Capacitor, "isNativePlatform").mockReturnValue(false);
  });
  it("sends one minimal request without cookies or HTTP referrer", () => {
    sendMarketingEvent("google_play_clicked", "/", "header");
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "https://plausible.io/api/event",
      expect.objectContaining({
        credentials: "omit",
        referrerPolicy: "no-referrer",
        keepalive: true,
      }),
    );
    const payload = JSON.parse(vi.mocked(fetch).mock.calls[0][1]!.body as string);
    expect(payload.url).toBe(PUBLIC_ORIGIN + "/");
    expect(payload.props.placement).toBe("header");
  });
  it.each(["disabled", "development", "native", "play", "preview", "dnt", "gpc"])(
    "sends nothing for %s",
    (reason) => {
      if (reason === "disabled") vi.stubEnv("VITE_PUBLIC_ANALYTICS_ENABLED", "false");
      if (reason === "development") vi.stubEnv("DEV", true);
      if (reason === "native") vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);
      if (reason === "play")
        vi.stubGlobal("window", { location: new URL(PUBLIC_ORIGIN + "/play/parent") });
      if (reason === "preview")
        vi.stubGlobal("window", { location: new URL("https://preview.vercel.app/") });
      if (reason === "dnt") vi.stubGlobal("navigator", { doNotTrack: "1" });
      if (reason === "gpc") vi.stubGlobal("navigator", { globalPrivacyControl: true });
      sendMarketingEvent("pageview", "/");
      expect(fetch).not.toHaveBeenCalled();
    },
  );
  it("ignores blocked analytics without throwing or retrying", () => {
    vi.mocked(fetch).mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(() => sendMarketingEvent("pageview", "/")).not.toThrow();
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});

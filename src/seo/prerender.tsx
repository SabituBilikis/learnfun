import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router";
import { LandingPage } from "@/features/landing/LandingPage";
import { FeaturePhonicsPage } from "@/features/seo/FeaturePhonicsPage";
import { FeatureAlphabetPage } from "@/features/seo/FeatureAlphabetPage";
import { FeatureNumbersPage } from "@/features/seo/FeatureNumbersPage";
import { OfflineEducationalAppsGuidePage } from "@/features/seo/OfflineEducationalAppsGuidePage";
import { BlogHubPage, OfflineLearningArticlePage } from "@/features/blog/BlogPages";
import publicPages from "@/lib/publicPages.json";

const pages = {
  "/": LandingPage,
  "/features/phonics": FeaturePhonicsPage,
  "/features/alphabet": FeatureAlphabetPage,
  "/features/numbers": FeatureNumbersPage,
  "/guides/offline-educational-apps-toddlers": OfflineEducationalAppsGuidePage,
  "/blog": BlogHubPage,
  "/blog/offline-learning-apps-for-toddlers": OfflineLearningArticlePage,
};

export function renderPublicPage(path: string): string | null {
  if (!Object.prototype.hasOwnProperty.call(publicPages, path)) return null;
  const Page = pages[path as keyof typeof pages];
  return renderToStaticMarkup(
    <StaticRouter location={path}>
      <Page />
    </StaticRouter>,
  );
}

export { playStoreUrl } from "@/lib/marketingAnalytics";

# Search visibility and measurement

Status: implementation prepared locally; analytics disabled by default. No production deployment or account setup has been performed. Initial live audit on October 14, 2026 found five sitemap URLs and homepage HTML at both blog URLs. The production branch/build must include the local blog changes before the article can be measured.

## Production output and deployment

`npm run build` typechecks, builds the client, builds an isolated server renderer, renders the actual public React pages, and validates the resulting HTML and sitemap. `.prerender/` is an ignored build artifact, never a hosting output. Vercel is explicitly configured to run this command and serve `dist`. Blog and feature routes map to their own generated HTML; the service worker must not replace them with a cached homepage. No Android source or user storage keys are changed.

Before an approved deployment, confirm the Vercel project's connected repository, production branch, root directory and environment variables in its account. Local configuration cannot establish which revision is currently deployed. After deployment run `npm run seo:audit-live`; it fails if the article, canonical, full feature HTML or sitemap entries are missing. `/play` stays noindex. The privacy policy has a self-canonical and intentional noindex, follow; it is excluded from the public content sitemap.

## Analytics setup (optional, paid service)

Plausible is a separate hosted analytics service. Registering a website there creates a private dashboard; it does not deploy this app. No account has been created and no subscription is assumed.

1. Create a Plausible site named `learnfunkids.vercel.app`, if this provider is chosen. Review pricing, processing terms, retention and dashboard permissions. Restrict access to the owner and designated reviewers. Record the configured retention period and deletion procedure before activation; do not assume indefinite storage is needed.
2. Review the public website measurement notice in `/privacy.html`. The learning app remains outside this measurement scope. Review consent requirements for the intended audience and jurisdictions before activation. Cookieless measurement still involves processing network information.
3. Add custom event goals with exact names `play_online_clicked` and `google_play_clicked`. Standard visits use Plausible's special `pageview` event, not a custom `page_view` goal. Do not enable vendor automatic outbound tracking, session replay or a second pageview tracker.
4. Set `VITE_PUBLIC_ANALYTICS_ENABLED=true` in the production build environment and rebuild only once the account and privacy configuration are ready. No Plausible API key belongs in the client. Development, previews, native sessions, Do Not Track and Global Privacy Control suppress collection.
5. With explicit deployment approval, test the deployed public site in the browser. Confirm each expected event appears in the dashboard. An HTTP 202 alone does not prove the vendor accepted/stored an event; check provider drop headers and real reports. Record the first verified collection date. Historical visits cannot be reconstructed.

The client calls the documented Plausible Events API directly; no vendor script or advertising integration is loaded. It sends an approved public URL, page type, fixed CTA placement, broad source category and allowlisted source provider. Queries, fragments, unknown referral domains, referring paths, link text, child names, ages, PINs, profiles, progress and localStorage values are not sent. No cookies, IDs, retries or offline event queues are added by this integration. IP address and browser request headers are still visible to the provider, which derives short-lived daily identifiers and approximate location as described in its data policy.

References: https://plausible.io/docs/events-api and https://plausible.io/data-policy

## Attribution and limitations

Only seven exact paths in `src/lib/publicPages.json` are eligible. The listener counts source-page clicks into Play and stops on entry to `/play`, including client-side navigation. It counts a navigation once, excluding query/hash-only changes; deliberate return visits count again. Public store links are tagged in generated HTML and after lazy React rendering, so copying/opening them in a new tab retains the fixed campaign.

Store campaigns use `utm_source=learnfun_website` and a fixed pathname-derived `utm_campaign`, for example `homepage`, `features_phonics` or `blog_offline_learning_apps_for_toddlers`. No per-visitor identifier or install-referrer SDK is added. Verify the available campaign breakdowns in Play Console. Store clicks, store visits, install intent clicks and completed acquisitions are separate measurements; never label a website click as an install.

Known ChatGPT, Perplexity, Claude, Copilot and Gemini domains are grouped as identifiable AI referrals. Known Google, Bing, DuckDuckGo and Yahoo search referrers are classified separately. This is conservative referrer-based attribution, not proof of an unpaid result: absent referrers remain unknown, and no ad-click parameters or personal campaign values are retained. Google AI results may have ordinary Google referrers. Search Console's available generative-AI reports provide a separate source of evidence. AI referrals are not counts of mentions, citations or all AI-assisted journeys. The integration deliberately does not retain attribution between document loads; when a visitor follows an internal link, source details may become unknown. No persistent attribution storage is added to resolve this.

Browser blockers and disabled JavaScript reduce measured traffic. Do not bypass blocking. Search Console, website analytics and Play Console have different definitions, coverage, timezone and delays; choose consistent report periods and annotate differences rather than forcing totals to match.

## Private dashboard: weekly review

Use `docs/seo-performance-dashboard.csv` as a private reporting worksheet. Blank values mean unavailable, not zero. Populate from authorized exports; do not publish account reports or API credentials in the repository. Report the last 28 complete days versus the preceding 28 days, with weekly snapshots and deployment annotations. Keep query exports separate from visitor events and report only relevant aggregate query data, excluding identifying terms.

| Dashboard panel | Source/access | Definition |
| --- | --- | --- |
| Google visibility | Search Console read access/export | Clicks, impressions, CTR, position and reported queries by public landing page |
| Index coverage | Search Console Page Indexing and URL Inspection | Actual indexed status and Google-selected canonical; sitemap count is not an indexed count |
| Organic website traffic | Plausible read access/export | Known search-source visits/pageviews; excludes unknown referrals |
| Content performance | Plausible | Homepage, blog, article, guide and feature-page views |
| Public CTA performance | Plausible goals/properties | Play Online and Google Play clicks by source page and placement; click count divided by pageviews is a click-to-view ratio, not an install conversion rate |
| AI referrals | Plausible source properties | Known AI-provider referrals and their outbound CTA clicks; a partial view only |
| Google AI visibility | Search Console, where available | Available generative-AI metrics, separately labelled; avoid adding overlapping totals |
| Store performance | Play Console read access/export | Listing visitors, clicks/CTR, available UTM breakdowns and separately reported completed acquisitions |
| Website performance | Public PageSpeed Insights; Search Console where available | Periodic mobile lab LCP/CLS and performance results, plus field Core Web Vitals when sufficient data exists; do not present lab results as real-user INP |

Search Console: confirm ownership and sitemap submission first. A verification tag does not prove either. Inspect the article URL after its live response is corrected. Account exports/read access are needed for queries, indexing and performance; they are not inferable from source code. Play Console and Plausible require separate access. Vercel project access is needed to diagnose the production revision/build mismatch. Never request passwords.

## Validation

Run `npm test`, `npm run build` and `npm run seo:verify`. Tests check allowlisting, sanitized payloads, native/Play exclusions, production-only collection, privacy signals, CTA attribution, duplicate prevention and cleanup after entry into Play. Production verification checks every public canonical, sitemap entry, Article schema, initial HTML content, styles, campaign links and image asset references. Network tests use mocks and do not send test visits to the live provider.

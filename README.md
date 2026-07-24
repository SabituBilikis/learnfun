# LearnFun

**Play. Learn. Grow.** — An offline-first educational PWA for children aged 1–5, teaching the alphabet, numbers, colors, shapes, animals, and more through interactive lessons, mini-games, and rewards.

Originally prototyped in [Figma Make](https://www.figma.com/design/de3F35DQi6TbDIE0f36UCn/Learn-Fun--Kids-educational-games-app); see `Product Requirements Document (PRD).md` for the full product spec.

## Getting started

```bash
npm install
npm run dev
```

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Typecheck + production build |
| `npm run cap:sync` | Build the web app and sync it into Android |
| `npm run cap:android` | Open the Android project in Android Studio |
| `npm run cap:android:debug` | Build a debug APK |
| `npm run cap:android:release` | Build a signed release bundle after signing is configured |
| `npm run preview` | Preview the production build |
| `npm run typecheck` | TypeScript strict check (no emit) |
| `npm run lint` | ESLint over `src` |
| `npm run format` | Prettier write |
| `npm test` | Run unit tests (Vitest) |

## Tech stack

React 18 · TypeScript (strict) · Vite 6 · Tailwind CSS v4 · Motion (Framer Motion) · Vitest + React Testing Library

## Android release

LearnFun now includes a Capacitor Android app. See `docs/android-play-release.md` for the Google Play release process.

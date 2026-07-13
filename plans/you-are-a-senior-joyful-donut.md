# LearnFun Design System — Implementation Plan

## Context

The user wants a complete design system showcase for LearnFun, a children's educational PWA for ages 1–5. The brief is highly specific: bright + cheerful, 24–32px rounded corners, friendly illustrations, large touch targets, playful animations, and no dark-mode aesthetic. The `create_make_theme` tool returned brutalist/swiss/editorial suggestions — these are entirely wrong for this brief. We honor the explicit brief aesthetic literally.

The deliverable is a **single-page design system showcase** in React that visually documents every token and component, like a living style guide. It is NOT a functional app — it's a Figma-style system reference rendered in code.

---

## Aesthetic Stance

**Committed direction:** Joyful children's toy-box — think Khan Academy Kids + Pok Pok + Duolingo ABC.

- **Ground:** Warm cream-white (`#FFFBF0`) — softer than pure white, feels like illustrated paper
- **Primary:** Vibrant coral-orange `#FF6B35` — warm, energetic, universally child-friendly
- **Secondary:** Sky blue `#4ECDC4` — cool counterbalance, fresh
- **Accent:** Sunny yellow `#FFE66D` — reward/highlight color
- **Success:** Mint green `#95E1A3`
- **Purple:** Soft lavender `#C084FC` — for categories like letters/numbers
- **Pink:** Bubblegum `#FF8FAB` — for animals/fun categories

**Fonts:**
- **Display/Headings:** `Nunito` — rounded letterforms, designed for children's interfaces, excellent legibility, extremely on-brand. Weight 800 (ExtraBold) for headings.
- **Body:** `Nunito` — same family, weight 600 (SemiBold) for labels, 400 (Regular) for descriptions. Avoids jarring font-mixing while maintaining hierarchy through weight alone.
- **No serif, no mono, no grotesque defaults.**

**Radius:** `--radius: 1.5rem` (24px) as base; XL = 2rem (32px) for cards and buttons.

---

## Files to Modify

1. **`src/styles/fonts.css`** — Add Google Fonts import for Nunito (weights 400, 600, 700, 800)
2. **`src/styles/theme.css`** — Update all `:root` color/radius tokens to LearnFun palette; preserve `.dark` block and `@theme inline`
3. **`src/app/App.tsx`** — Full design system showcase (single file, ~600–900 lines)

---

## Design System Sections (rendered top to bottom)

### 1. Header / Splash
- LearnFun logo wordmark with emoji mascot star ⭐
- Tagline "Play. Learn. Grow."
- Background: coral gradient blob

### 2. Color Palette
- Swatches grid: primary, secondary, accent, success, purple, pink, muted, background, foreground
- Each swatch shows hex + token name

### 3. Typography Scale
- Display XL (56px, Nunito 800)
- H1 (40px), H2 (32px), H3 (24px), H4 (20px)
- Body (16px), Caption (14px), Label (12px)
- Specimen text using child-friendly words: "Apple", "Banana", "123"

### 4. Spacing System
- 8px base grid: 4, 8, 12, 16, 24, 32, 40, 48, 64px visual rulers

### 5. Border Radius Tokens
- sm (8px), md (16px), lg (24px), xl (32px), full (9999px) — shown on colored tiles

### 6. Shadows
- Shadow none, sm, md, lg, xl — demonstrated on white cards

### 7. Button Variants
- Primary (coral, filled)
- Secondary (sky blue)
- Ghost (transparent + border)
- Danger (red)
- Icon-only (circle)
- Disabled state
- All in default + hover + active states (CSS :hover transitions)
- XL touch-target size (min 64px height)

### 8. Input Components
- Text input (with large rounded style, placeholder)
- Search input (with magnifier icon)
- PIN input (4-digit, for parent PIN)
- Toggle / switch

### 9. Category Cards
- 6 cards: Alphabet, Numbers, Colors, Shapes, Animals, Fruits
- Each: colored background, large emoji illustration, title, progress bar, "Start" button
- Horizontal scroll row with overflow visible

### 10. Lesson Cards
- Single lesson card (full-width): large illustration area, lesson title, tap-to-learn CTA, audio icon, breadcrumb (Category > Lesson)

### 11. Progress Indicators
- Linear progress bar (with animated fill, star at end)
- Circular progress ring (SVG-based)
- Stars row (0–5 filled/empty)
- XP bar with level badge

### 12. Reward Badges
- 6 badge designs: First Letter, Math Wizard, Color Explorer, Shape Master, Animal Friend, Fruit Fan
- Each: circular with emoji + border + gold/silver/bronze tier treatment
- Locked state (greyed + lock icon)

### 13. Navigation
- Bottom tab bar (Home, Learn, Games, Rewards, Parent)
- Active state: filled icon + colored pill background + label
- Safe area aware (padding-bottom)

### 14. Modals
- Lesson complete modal: confetti-style, star rating, "Next Lesson" / "Play Again" CTAs
- Parent area PIN modal: 4-dot PIN entry
- Settings modal: toggle list

### 15. Toasts
- Success toast (green, with checkmark + star burst)
- Error toast (red, gentle)
- Info toast (blue)
- Each auto-dismisses (shown static in design system)

### 16. Parent Dashboard Components
- Stat cards: Lessons Today, Streak, Time Spent, Stars Earned
- Progress chart (recharts BarChart — weekly activity, child-friendly colors)
- Subject completion grid (6 subjects, circular progress each)
- Recent activity list

---

## Implementation Details

### State
- React `useState` for modal open/close, active nav tab, progress demo values
- No external state management needed (showcase only)

### Animations
- CSS transitions for hover/active on buttons (`transition-all duration-150`)
- `motion/react` for modal entrance (scale + opacity)
- `motion/react` for toast slide-in from top

### Component Structure (all inline in App.tsx)
```
App
├── Header
├── Section (reusable wrapper with title + children)
├── ColorPalette
├── TypographyScale
├── SpacingSystem
├── RadiusTokens
├── ShadowTokens
├── ButtonVariants
├── InputComponents
├── CategoryCards
├── LessonCard
├── ProgressIndicators
├── RewardBadges
├── Navigation
├── ModalShowcase
├── ToastShowcase
└── ParentDashboard
```

### Recharts Usage
Parent dashboard uses `<BarChart>` from recharts for weekly activity. Colors use LearnFun palette variables.

---

## Token Updates (theme.css)

```css
:root {
  --background: #FFFBF0;
  --foreground: #2D1B69;          /* deep purple — child-friendly, not pure black */
  --card: #FFFFFF;
  --card-foreground: #2D1B69;
  --primary: #FF6B35;             /* coral orange */
  --primary-foreground: #FFFFFF;
  --secondary: #4ECDC4;           /* sky teal */
  --secondary-foreground: #FFFFFF;
  --muted: #F0EAD6;
  --muted-foreground: #8B7355;
  --accent: #FFE66D;              /* sunny yellow */
  --accent-foreground: #2D1B69;
  --destructive: #FF4757;
  --destructive-foreground: #FFFFFF;
  --border: rgba(45, 27, 105, 0.12);
  --ring: #FF6B35;
  --radius: 1.5rem;               /* 24px base */
}
```

---

## Verification

1. No TypeScript errors (all components typed inline)
2. All sections render without crash
3. Buttons have hover effects
4. Modals open/close with motion animation
5. recharts BarChart renders with LearnFun colors
6. Fonts load from Google Fonts (Nunito)
7. Color contrast: dark purple `#2D1B69` on cream `#FFFBF0` = ~10:1 ✓; white on coral `#FF6B35` = ~3.2:1 (large text AA ✓)

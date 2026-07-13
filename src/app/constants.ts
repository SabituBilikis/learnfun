import lettersData from "../data/letters.json";
import numbersData from "../data/numbers.json";
import categoriesData from "../data/categories.json";

// ── Design tokens (LearnFun system) ──────────────────────────────────────────
export const C = {
  red:    "#FF3B30",
  orange: "#FF9500",
  yellow: "#FFD700",
  green:  "#34C759",
  blue:   "#007AFF",
  purple: "#AF52DE",
  pink:   "#FF2D9B",
  teal:   "#00C7BE",
  navy:   "#1A0050",
  cream:  "#F3EEFF",
  muted:  "#E8DFFF",
  mutedFg:"#6B4FA0",
  white:  "#FFFFFF",
};

// ── Child profile ─────────────────────────────────────────────────────────────
// Placeholder until a real profile/parent-settings feature exists.
export const CHILD_NAME = "Lily";

// ── Lesson content (data-driven — see src/data/*.json) ────────────────────────
export interface LetterEntry { l: string; word: string; emoji: string; }
export const LETTERS: LetterEntry[] = lettersData;

// All 26 lesson entries so Next/Prev can navigate
export const LESSON_LETTERS = LETTERS; // reuse the same array

export const ALPHABET_LEARNED = 0; // A–Q complete, R current, S–Z upcoming

export const NUMBERS_LEARNED = 0; // 1–7 done, 8 current, 9–20 upcoming

// Letter card color cycles through this 8-color palette.
const LETTER_PALETTE      = [C.red, C.orange, "#F5C518", C.green, C.teal, C.blue, C.purple, C.pink];
const LETTER_DARK_PALETTE = ["#CC2A20", "#CC7600", "#C9A200", "#28A046", "#009B94", "#0056CC", "#8A3DB5", "#CC1F7A"];
export const LETTER_COLORS_FULL = LETTERS.map((_, i) => LETTER_PALETTE[i % LETTER_PALETTE.length]);
export const LETTER_DARKS       = LETTERS.map((_, i) => LETTER_DARK_PALETTE[i % LETTER_DARK_PALETTE.length]);

const NUMBERS_COUNT = numbersData.length;

// ── Category registry (canonical id/title/icon/color/entry-count) ─────────────
// Full entry content and per-lesson panel config live in categories.json and
// are loaded by modules/categories.tsx; this file only needs counts for the
// home-screen cards.
const CATEGORY_LESSON_COUNTS: Record<string, number> = Object.fromEntries(
  categoriesData.map((cat) => [cat.id, cat.entries.length]),
);

// ── Home-card data ─────────────────────────────────────────────────────────────
// `color`/`dark` here are the home-card tint and are allowed to differ from a
// category's in-lesson color (see categories.json) — both are pre-existing,
// intentional-looking choices from the original design, not something this
// refactor should silently unify.
export type CardState = "active" | "complete" | "new" | "locked";
export interface Category {
  id: string; emoji: string; title: string; subtitle: string;
  lessons: number; progress: number; color: string; dark: string;
  state: CardState; deco: string[];
}

export const CATEGORIES: Category[] = [
  { id:"alphabet", emoji:"🔤", title:"Alphabet",   subtitle:"A · B · C",        lessons:LETTERS.length,               progress:65,  color:C.red,    dark:"#CC2A20", state:"active",   deco:["A","B","C"]    },
  { id:"numbers",  emoji:"🔢", title:"Numbers",    subtitle:"1 · 2 · 3",        lessons:NUMBERS_COUNT,                progress:40,  color:C.orange, dark:"#CC7600", state:"active",   deco:["1","2","3"]    },
  { id:"shapes",   emoji:"🔷", title:"Shapes",     subtitle:"○ △ □ ◇",          lessons:CATEGORY_LESSON_COUNTS.shapes,   progress:80,  color:C.blue,   dark:"#0056CC", state:"active",   deco:["○","△","□"]    },
  { id:"colors",   emoji:"🎨", title:"Colors",     subtitle:"Red · Blue · Gold", lessons:CATEGORY_LESSON_COUNTS.colors,   progress:100, color:C.green,  dark:"#28A046", state:"complete", deco:["🔴","🔵","🟡"] },
  { id:"animals",  emoji:"🐶", title:"Animals",    subtitle:"Farm & Wild",       lessons:CATEGORY_LESSON_COUNTS.animals,  progress:25,  color:C.purple, dark:"#8A3DB5", state:"active",   deco:["🐱","🐮","🐷"] },
  { id:"fruits",   emoji:"🍎", title:"Fruits",     subtitle:"Yummy & Sweet",     lessons:CATEGORY_LESSON_COUNTS.fruits,   progress:0,   color:C.pink,   dark:"#CC1F7A", state:"new",      deco:["🍌","🍇","🍊"] },
  { id:"vehicles", emoji:"🚗", title:"Vehicles",   subtitle:"Vroom vroom!",      lessons:CATEGORY_LESSON_COUNTS.vehicles, progress:0,   color:C.teal,   dark:"#009B94", state:"new",      deco:["✈️","🚂","⛵"]  },
  { id:"school",   emoji:"🏫", title:"School",     subtitle:"Learn & Play",      lessons:CATEGORY_LESSON_COUNTS.school,   progress:0,   color:"#F5C518",dark:"#C9A200", state:"locked",   deco:["📚","✏️","📐"]  },
  { id:"home",     emoji:"🏠", title:"Home",       subtitle:"My House",          lessons:CATEGORY_LESSON_COUNTS.home,     progress:0,   color:C.orange, dark:"#CC7600", state:"locked",   deco:["🛋️","🪴","🛁"]  },
  { id:"body",     emoji:"🫀", title:"Body Parts", subtitle:"Head to Toe",       lessons:CATEGORY_LESSON_COUNTS.body,     progress:0,   color:"#FF6B9D",dark:"#CC4080", state:"locked",   deco:["👁️","👄","👂"]  },
  { id:"months",   emoji:"📅", title:"Months",     subtitle:"All 12 Months",     lessons:CATEGORY_LESSON_COUNTS.months,   progress:0,   color:C.blue,   dark:"#0056CC", state:"locked",   deco:["❄️","🌸","☀️"]  },
  { id:"days",     emoji:"📆", title:"Days",       subtitle:"Mon · Tue · Wed",   lessons:CATEGORY_LESSON_COUNTS.days,     progress:0,   color:C.purple, dark:"#8A3DB5", state:"locked",   deco:["☀️","🌙","⭐"]  },
];

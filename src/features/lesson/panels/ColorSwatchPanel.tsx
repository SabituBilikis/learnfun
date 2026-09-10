import { useState, useEffect } from "react";
import { motion } from "motion/react";
import type { CatEntry } from "../../../app/modules/categories";
import { speak } from "../../../lib/speech";
import { playChimeSound } from "../../../lib/soundEffects";
import { getEmojiName } from "../../../lib/emojiDictionary";

import { SmartEmoji } from "../../../components/icons/EraserIcon";

const COLOR_MATCHING_MAP: Record<string, Set<string>> = {
  red: new Set(["🔴", "🌹", "🎈", "🍓", "❤️", "🚒"]),
  orange: new Set(["🟠", "🍊", "🎃", "🦊", "🏀"]),
  yellow: new Set(["🟡", "🍋", "🐤", "☀️"]),
  green: new Set(["🟢", "🥦", "🎄", "🥑"]),
  blue: new Set(["🔵", "💎", "🫐", "🦋", "☁️"]),
  purple: new Set(["🟣", "🍇", "🦄", "💜", "🔮"]),
  pink: new Set(["🩷", "🍬", "🦩", "💗", "🐷"]),
  brown: new Set(["🟤", "🍫", "🪵", "🐕", "🧁"]),
  black: new Set(["⚫", "🐈", "🎩", "🖊️", "🦇", "🌑", "🎱"]),
  white: new Set(["⚪", "🕊️", "🧊", "🌨️", "🍚"]),
  gray: new Set(["🩶", "🪨", "🐺", "🌫️", "🦔"]),
  gold: new Set(["🥇", "👑", "💰"]),
};

function isItemCorrectColor(colorName: string, emoji: string): boolean {
  const color = colorName.toLowerCase();
  const allowed = COLOR_MATCHING_MAP[color];
  if (allowed) {
    return allowed.has(emoji);
  }
  return true;
}

export function ColorSwatchPanel({ entry, onCountChange }: {
  entry: CatEntry; onCountChange: (c: number) => void;
}) {
  const [found,    setFound]    = useState<boolean[]>(() => Array((entry.panelEmojis||[]).length).fill(false));
  const [wrongIdx, setWrongIdx] = useState<number | null>(null);
  const [done,     setDone]     = useState(false);

  useEffect(() => {
    setFound(Array((entry.panelEmojis||[]).length).fill(false));
    setWrongIdx(null);
    setDone(false); onCountChange(0);
  }, [entry.name]);

  const items = entry.panelEmojis || [];
  const colorNameLower = entry.name.toLowerCase();

  function tap(i: number) {
    const emoji = items[i];
    const objectName = getEmojiName(emoji);
    const correct = isItemCorrectColor(entry.name, emoji);

    if (!correct) {
      playChimeSound(false);
      setWrongIdx(i);
      setTimeout(() => setWrongIdx(null), 500);
      void speak(`You are wrong! ${objectName} is not ${colorNameLower}!`, { rate: 0.8, pitch: 1.25 });
      return;
    }

    playChimeSound(true);
    let currentCount = found.filter(Boolean).length;

    if (!found[i]) {
      const next = [...found];
      next[i] = true;
      setFound(next);
      currentCount = next.filter(Boolean).length;
      onCountChange(currentCount);
    }

    const totalCorrectRequired = items.filter(em => isItemCorrectColor(entry.name, em)).length;
    const isFirstCorrect = currentCount === 1;

    let correctMsg = isFirstCorrect
      ? `You are correct! ${objectName} is ${colorNameLower}!`
      : `You are correct! ${objectName} is also ${colorNameLower}!`;

    if (currentCount === totalCorrectRequired) {
      if (!done) {
        correctMsg += ` Awesome! You found all ${colorNameLower} things!`;
        setTimeout(() => setDone(true), 400);
      }
    }

    void speak(correctMsg, { rate: 0.75, pitch: 1.3 });
  }

  function reset() {
    setFound(Array(items.length).fill(false));
    setWrongIdx(null);
    setDone(false); onCountChange(0);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Big color swatch */}
      <motion.div className="flex items-center justify-center rounded-3xl"
        style={{ width:100, height:100, background:entry.color, border:"4px solid rgba(255,255,255,0.85)", boxShadow:`0 8px 24px ${entry.color}80` }}
        animate={{ scale:[1,1.06,1] }} transition={{ duration:2.5, repeat:Infinity }}>
        <span style={{ fontSize:44 }}><SmartEmoji emoji={entry.emoji} size={44} /></span>
      </motion.div>
      {/* Things that are this color */}
      <p className="font-fredoka font-bold text-[12px] text-white/70 text-center">
        Tap the {colorNameLower} things!
      </p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2, 56px)", gap:10 }}>
        {items.map((em, i) => {
          const isWrong = wrongIdx === i;
          return (
            <motion.button key={i} onClick={() => tap(i)}
              style={{
                width:56, height:56, borderRadius:16,
                background: isWrong ? "#FF3B30AA" : found[i] ? `${entry.color}DD` : "rgba(255,255,255,0.22)",
                border: `2.5px solid ${isWrong ? "#FF3B30" : found[i] ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.4)"}`,
                fontSize:28, display:"flex", alignItems:"center", justifyContent:"center",
                cursor: "pointer"
              }}
              whileHover={{ scale: 1.14 }} whileTap={{ scale: 0.86 }}
              animate={isWrong ? { x: [0, -8, 8, -6, 6, 0] } : found[i] ? { scale: [1, 1.25, 1] } : {}}
              transition={{ type: "spring", stiffness: 400 }}>
              <SmartEmoji emoji={em} size={28} />
            </motion.button>
          );
        })}
      </div>
      {done && (
        <motion.div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl"
          style={{ background:"rgba(52,199,89,0.28)", border:"2px solid rgba(255,255,255,0.7)" }}
          initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:"spring" }}>
          <span className="font-fredoka font-bold text-[13px] text-lf-white">🎉 You know {entry.name}!</span>
        </motion.div>
      )}
      {found.some(Boolean) && <button onClick={reset} className="font-nunito font-bold text-[11px] text-white/50 bg-transparent border-none cursor-pointer">↺ {done?"Again!":"Reset"}</button>}
    </div>
  );
}

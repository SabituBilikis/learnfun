import { useState, useEffect } from "react";
import { motion } from "motion/react";
import type { CatEntry } from "../../../app/modules/categories";
import { ShapeSvg } from "../../../components/icons/ShapeSvg";
import { speak } from "../../../lib/speech";
import { playChimeSound } from "../../../lib/soundEffects";
import { getEmojiName } from "../../../lib/emojiDictionary";

const SHAPE_MATCHING_MAP: Record<string, Set<string>> = {
  circle: new Set(["🌍", "🍩"]),
  square: new Set(["📦", "🎁"]),
  triangle: new Set(["🔺", "🏔️"]),
  rectangle: new Set(["📱", "🖥️"]),
  star: new Set(["⭐", "🌟"]),
  heart: new Set(["❤️", "🍓"]),
  diamond: new Set(["💎", "💠"]),
  oval: new Set(["🥚", "🪆"]),
  pentagon: new Set(["🏠", "⬠"]),
  hexagon: new Set(["🐝", "❄️"]),
};

function isItemCorrect(shapeName: string, emoji: string): boolean {
  const shape = shapeName.toLowerCase();
  const allowed = SHAPE_MATCHING_MAP[shape];
  if (allowed) {
    return allowed.has(emoji);
  }
  return true;
}

function getShapeArticle(shapeName: string): string {
  const name = shapeName.toLowerCase();
  const startsWithVowel = /^[aeiou]/i.test(name);
  return `${startsWithVowel ? "an" : "a"} ${name}`;
}

import { SmartEmoji } from "../../../components/icons/EraserIcon";

export function ShapeTapPanel({ entry, onCountChange }: {
  entry: CatEntry; onCountChange: (c: number) => void;
}) {
  const [revealed, setRevealed] = useState<boolean[]>(() => Array((entry.panelEmojis||[]).length).fill(false));
  const [wrongIdx, setWrongIdx] = useState<number | null>(null);
  const [done,     setDone]     = useState(false);

  useEffect(() => {
    setRevealed(Array((entry.panelEmojis||[]).length).fill(false));
    setWrongIdx(null);
    setDone(false); onCountChange(0);
  }, [entry.name]);

  const items = entry.panelEmojis || [];

  function tapShape() {
    playChimeSound(true);
    void speak(entry.fact ? `${entry.name}! ${entry.fact}` : `${entry.name}!`, { rate: 0.7, pitch: 1.3 });
  }

  function tapItem(i: number) {
    const emoji = items[i];
    const objectName = getEmojiName(emoji);
    const correct = isItemCorrect(entry.name, emoji);
    const shapeArticle = getShapeArticle(entry.name);

    if (!correct) {
      playChimeSound(false);
      setWrongIdx(i);
      setTimeout(() => setWrongIdx(null), 500);
      void speak(`You are wrong! ${objectName} is not ${shapeArticle}!`, { rate: 0.8, pitch: 1.25 });
      return;
    }

    playChimeSound(true);
    let currentCount = revealed.filter(Boolean).length;

    if (!revealed[i]) {
      const next = [...revealed];
      next[i] = true;
      setRevealed(next);
      currentCount = next.filter(Boolean).length;
      onCountChange(1 + currentCount);
    }

    const totalCorrectRequired = items.filter(em => isItemCorrect(entry.name, em)).length;
    const isFirstCorrect = currentCount === 1;

    let correctMsg = isFirstCorrect
      ? `You are correct! ${objectName} is ${shapeArticle}!`
      : `You are correct! ${objectName} is also ${shapeArticle}!`;

    if (currentCount === totalCorrectRequired) {
      if (!done) {
        correctMsg += ` Awesome! You found all things shaped like ${shapeArticle}!`;
        setTimeout(() => setDone(true), 400);
      }
    }

    void speak(correctMsg, { rate: 0.75, pitch: 1.3 });
  }

  function reset() {
    setRevealed(Array(items.length).fill(false));
    setWrongIdx(null);
    setDone(false); onCountChange(0);
  }

  const shapeType = entry.shapeType || "circle";
  const col       = entry.color;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Tappable SVG shape */}
      <motion.button onClick={tapShape}
        style={{ background:"none", border:"none", cursor:"pointer", padding:0 }}
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        animate={{ scale:[1,1.04,1] }}
        transition={{ duration:2.5, repeat:Infinity }}>
        <ShapeSvg type={shapeType} color={col} size={110} />
      </motion.button>
      
      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="flex flex-col items-center">
        <p className="font-fredoka font-bold text-[12px] text-white/80 text-center mb-2">Find things shaped like a {entry.name.toLowerCase()}!</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2, 56px)", gap:10 }}>
          {items.map((em, i) => {
            const isWrong = wrongIdx === i;
            return (
              <motion.button key={i} onClick={()=>tapItem(i)}
                style={{
                  width:56, height:56, borderRadius:16,
                  background: isWrong ? "#FF3B30AA" : revealed[i] ? `${col}DD` : "rgba(255,255,255,0.22)",
                  border:`2.5px solid ${isWrong ? "#FF3B30" : revealed[i] ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.4)"}`,
                  fontSize:28, display:"flex", alignItems:"center", justifyContent:"center",
                  cursor:"pointer"
                }}
                whileHover={{ scale:1.14 }} whileTap={{ scale:0.86 }}
                animate={isWrong ? { x: [0, -8, 8, -6, 6, 0] } : revealed[i] ? { scale:[1,1.25,1] } : {}}
                transition={{ type:"spring", stiffness:400 }}>
                <SmartEmoji emoji={em} size={28} />
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {done && (
        <motion.div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl mt-1"
          style={{ background:"rgba(52,199,89,0.28)", border:"2px solid rgba(255,255,255,0.7)" }}
          initial={{ scale:0 }} animate={{ scale:1 }}>
          <span className="font-fredoka font-bold text-[13px] text-lf-white">🎉 You know this shape!</span>
        </motion.div>
      )}
      {revealed.some(Boolean) && <button onClick={reset} className="font-nunito font-bold text-[11px] text-white/60 bg-transparent border-none cursor-pointer mt-1">↺ Explore again!</button>}
    </div>
  );
}

import { useState, useEffect } from "react";
import { LESSON_LETTERS, LETTER_COLORS_FULL, LETTER_DARKS } from "../constants";
import { cancelSpeech, speak } from "../../lib/speech";
import { LessonShell } from "../../features/lesson/LessonShell";
import { LessonMascot } from "../../features/lesson/LessonMascot";
import { IllustrationPanel } from "../../features/lesson/IllustrationPanel";
import { GiantLetter } from "../../features/lesson/GiantLetter";

export function LessonScreen({ letterIndex, onBack, onComplete, onNavigate }: {
  letterIndex: number;
  onBack: () => void;
  onComplete: () => void;
  onNavigate: (i: number) => void;
}) {
  const [playing,  setPlaying]  = useState(false);
  const [burst,    setBurst]    = useState(0);
  const [reacting, setReacting] = useState(false);

  const entry  = LESSON_LETTERS[letterIndex];
  const color  = LETTER_COLORS_FULL[letterIndex];
  const dark   = LETTER_DARKS[letterIndex];

  // Reset state when letter changes
  useEffect(() => {
    void cancelSpeech();
    setPlaying(false);
    setBurst(0);
    setReacting(false);
  }, [letterIndex]);

  const speakLetter = async () => {
    if (playing) return;
    setPlaying(true);
    setBurst(b => b + 1);
    setReacting(true);
    setTimeout(() => setReacting(false), 1400);
    try {
      const ok = await speak(entry.l, { rate: 0.65, pitch: 1.3 });
      if (ok) {
        await new Promise((resolve) => setTimeout(resolve, 350));
        await speak(`${entry.l} for ${entry.word.toLowerCase()}`, { rate: 0.7, pitch: 1.3, cancelPrevious: false });
      }
    } finally {
      setPlaying(false);
    }
  };

  return (
    <LessonShell
      color={color}
      dark={dark}
      letterBg={entry.l}
      emojiBg={entry.emoji}
      currentIndex={letterIndex}
      totalEntries={LESSON_LETTERS.length}
      playing={playing}
      burstCount={burst}
      onBack={onBack}
      onComplete={onComplete}
      onNavigate={onNavigate}
      onSpeak={speakLetter}
      mascotNode={<LessonMascot reacting={reacting} onClick={speakLetter} prompt="What is this?" />}
      mainNode={<GiantLetter letter={entry.l} color={color} onClick={speakLetter} pulsing={playing} />}
      panelNode={<IllustrationPanel emoji={entry.emoji} word={entry.word} />}
    />
  );
}

import { useState, useEffect } from "react";
import { LESSON_LETTERS, LETTER_COLORS_FULL, LETTER_DARKS } from "../constants";
import { speak } from "../../lib/speech";
import { LessonShell } from "../../features/lesson/LessonShell";
import { LessonMascot } from "../../features/lesson/LessonMascot";
import { IllustrationPanel } from "../../features/lesson/IllustrationPanel";
import { GiantLetter } from "../../features/lesson/GiantLetter";
import { AmbientSparkles } from "../../components/feedback/Sparkle";
import { C } from "../constants";

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
    setPlaying(false);
    setBurst(0);
    setReacting(false);
  }, [letterIndex]);

  const speakLetter = () => {
    if (playing) return;
    setPlaying(true);
    setBurst(b => b + 1);
    setReacting(true);
    const spoke = speak(entry.l, { rate: 0.65, pitch: 1.3, onEnd: () => setPlaying(false) });
    if (!spoke) setTimeout(() => setPlaying(false), 1300);
    setTimeout(() => setReacting(false), 1100);
  };

  return (
    <>
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
        mascotNode={<LessonMascot reacting={reacting} />}
        mainNode={<GiantLetter letter={entry.l} color={color} onClick={speakLetter} pulsing={playing} />}
        panelNode={<IllustrationPanel emoji={entry.emoji} word={entry.word} />}
      />
      <AmbientSparkles
        zIndex={5}
        spots={[
          { top:"6%",  left:"2%",   size:20, color:C.yellow },
          { top:"12%", right:"3%",  size:15, color:"rgba(255,255,255,0.8)" },
          { top:"80%", left:"3%",   size:18, color:C.yellow },
          { top:"75%", right:"4%",  size:14, color:"rgba(255,255,255,0.7)" },
        ]}
      />
    </>
  );
}

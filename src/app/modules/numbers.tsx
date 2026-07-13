import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { C } from "../constants";
import { BackButton, AmbientSparkles, ProgressTrack, StatPill, CTAButton, SoundRings } from "./primitives";
import { LessonShell } from "../../features/lesson/LessonShell";
import { speak } from "../../lib/speech";
import numbersData from "../../data/numbers.json";

// ── Data ─────────────────────────────────────────────────────────────────────
interface NumberEntry { n: number; word: string; emoji: string; color: string; dark: string; }
export const NUMBER_DATA: NumberEntry[] = numbersData;

// ── GiantNumber — the tappable numeral card ───────────────────────────────────
function GiantNumber({ entry, onClick, pulsing }: {
  entry: NumberEntry; onClick: () => void; pulsing: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-4 select-none">
      <div className="relative flex items-center justify-center">
        {/* Sound rings (reused) */}
        <SoundRings active={pulsing} />
        <motion.button
          onClick={onClick}
          className="relative z-10 flex items-center justify-center rounded-3xl"
          style={{
            width: "clamp(140px,18vw,210px)", height: "clamp(140px,18vw,210px)",
            background: "rgba(255,255,255,0.96)",
            border: `5px solid ${C.navy}`,
            boxShadow: `6px 8px 0 ${C.navy}`,
            cursor: "pointer",
          }}
          animate={pulsing ? { scale:[1,1.07,1] } : { scale:1 }}
          transition={{ duration:0.38, repeat: pulsing ? Infinity : 0 }}
          whileHover={{ scale:1.07 }}
          whileTap={{ scale:0.91 }}
        >
          <span style={{ fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:"clamp(60px,10vw,100px)", color:entry.color, lineHeight:1 }}>
            {entry.n}
          </span>
        </motion.button>
      </div>

      {/* Word pill */}
      <motion.div className="px-6 py-2 rounded-2xl"
        style={{ background:"rgba(255,255,255,0.22)", border:"2px solid rgba(255,255,255,0.55)", backdropFilter:"blur(6px)" }}
        animate={{ opacity:[0.85,1,0.85] }} transition={{ duration:2.4, repeat:Infinity }}>
        <span style={{ fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:"clamp(18px,2.5vw,28px)", color:"#FFFFFF", letterSpacing:1 }}>
          {entry.word}
        </span>
      </motion.div>

      {/* "Tap to hear" whisper */}
      {!pulsing && (
        <motion.span style={{ fontFamily:"'Nunito',sans-serif", fontSize:12, color:"rgba(255,255,255,0.55)" }}
          animate={{ opacity:[0.4,0.8,0.4] }} transition={{ duration:2.2, repeat:Infinity }}>
          🔊 Tap to hear
        </motion.span>
      )}
    </div>
  );
}


// ── NumberMascot — tweaks speech bubble for counting context ──────────────────
function NumberMascot({ reacting, count, n }: { reacting: boolean; count: number; n: number }) {
  const msg = reacting ? "I hear it! 🎉" : count === 0 ? "Count them! 🔢" : count === n ? "Amazing! 🌟" : `${count}... keep going!`;
  return (
    <div className="flex flex-col items-center gap-2">
      <motion.span className="select-none"
        style={{ fontSize:"clamp(52px,9vw,120px)", lineHeight:1, display:"block", filter:"drop-shadow(2px 4px 0 rgba(26,0,80,0.3))" }}
        animate={reacting
          ? { scale:[1,1.3,1], rotate:[-12,12,0] }
          : { y:[0,-10,0] }}
        transition={reacting
          ? { duration:0.45 }
          : { duration:2.8, repeat:Infinity, ease:"easeInOut" }}>
        🦊
      </motion.span>
      <motion.div className="relative px-4 py-2 rounded-2xl text-center"
        style={{ background:C.white, border:`2.5px solid ${C.navy}`, boxShadow:`3px 4px 0 ${C.navy}`, minWidth:88 }}
        animate={reacting ? { scale:[0.85,1.12,1] } : {}} transition={{ duration:0.35 }}>
        <div className="absolute" style={{ top:-11, left:"50%", transform:"translateX(-50%)", width:0, height:0, borderLeft:"9px solid transparent", borderRight:"9px solid transparent", borderBottom:`11px solid ${C.navy}` }} />
        <div className="absolute" style={{ top:-7, left:"50%", transform:"translateX(-50%)", width:0, height:0, borderLeft:"7px solid transparent", borderRight:"7px solid transparent", borderBottom:"9px solid white" }} />
        <motion.span key={msg} style={{ fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:"clamp(11px,1.4vw,16px)", color:reacting?C.red:C.navy, whiteSpace:"nowrap" }}
          initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.2 }}>
          {msg}
        </motion.span>
      </motion.div>
    </div>
  );
}

// Thin wrapper to surface tap count to parent
function CountingPanelTracked({ entry, onCountChange }: {
  entry: NumberEntry; onCountChange: (c: number) => void;
}) {
  const [tapped,    setTapped]    = useState<boolean[]>(() => Array(entry.n).fill(false));
  const [count,     setCount]     = useState(0);
  const [done,      setDone]      = useState(false);
  const [lastTapped,setLastTapped]= useState(-1);

  useEffect(() => { setTapped(Array(entry.n).fill(false)); setCount(0); setDone(false); setLastTapped(-1); onCountChange(0); }, [entry.n]);

  function tap(i: number) {
    if (tapped[i] || done) return;
    const next = [...tapped]; next[i] = true; setTapped(next);
    const c = count + 1; setCount(c); setLastTapped(i); onCountChange(c);
    speak(String(c), { rate: 0.75, pitch: 1.4 });
    if (c === entry.n) setTimeout(() => setDone(true), 350);
  }
  function reset() { setTapped(Array(entry.n).fill(false)); setCount(0); setDone(false); setLastTapped(-1); onCountChange(0); }

  const objSize = entry.n<=5?64:entry.n<=10?52:entry.n<=15?44:38;
  const fontSize= entry.n<=5?32:entry.n<=10?26:entry.n<=15?22:18;
  const cols    = entry.n<=5?entry.n:5;

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div className="flex items-center gap-2 px-4 py-2 rounded-2xl"
        style={{ background:"rgba(255,255,255,0.22)", border:"2.5px solid rgba(255,255,255,0.55)", minWidth:96, justifyContent:"center" }}
        key={count} animate={{ scale:[1,1.18,1] }} transition={{ duration:0.3 }}>
        <span style={{ fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:22, color:"#FFF" }}>{count}</span>
        <span style={{ fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:14, color:"rgba(255,255,255,0.6)" }}>/ {entry.n}</span>
      </motion.div>

      <div style={{ display:"grid", gridTemplateColumns:`repeat(${cols}, ${objSize}px)`, gap:entry.n<=10?8:6 }}>
        {Array.from({ length:entry.n }).map((_,i) => (
          <motion.button key={i} onClick={()=>tap(i)}
            style={{ width:objSize, height:objSize, borderRadius:Math.round(objSize*0.3), background:tapped[i]?`${entry.color}CC`:"rgba(255,255,255,0.18)", border:`2.5px solid ${tapped[i]?"rgba(255,255,255,0.85)":"rgba(255,255,255,0.35)"}`, fontSize, display:"flex", alignItems:"center", justifyContent:"center", cursor:tapped[i]?"default":"pointer", position:"relative" as const }}
            whileHover={!tapped[i]?{ scale:1.16 }:{}} whileTap={!tapped[i]?{ scale:0.88 }:{}}
            animate={i===lastTapped?{ scale:[1,1.28,1] }:{}} transition={{ type:"spring", stiffness:420, damping:14 }}>
            {tapped[i] ? entry.emoji : "❓"}
            {i===lastTapped && (
              <motion.span className="absolute pointer-events-none"
                style={{ top:-20, left:"50%", marginLeft:-12, fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:16, color:"#FFF", textShadow:"0 2px 6px rgba(0,0,0,0.4)" }}
                initial={{ opacity:1, y:0 }} animate={{ opacity:0, y:-18 }} transition={{ duration:0.65 }}>
                {count}!
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>

      {done && (
        <motion.div className="flex items-center gap-2 px-4 py-2 rounded-2xl"
          style={{ background:"rgba(52,199,89,0.28)", border:"2px solid rgba(255,255,255,0.7)" }}
          initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }}
          transition={{ type:"spring", stiffness:360, damping:16 }}>
          <span style={{ fontSize:18 }}>🎉</span>
          <span style={{ fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:14, color:"#FFF" }}>You counted to {entry.n}!</span>
        </motion.div>
      )}
      {count>0 && (
        <button onClick={reset} style={{ fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:11, color:"rgba(255,255,255,0.55)", background:"none", border:"none", cursor:"pointer" }}>
          ↺ {done ? "Count again!" : "Reset"}
        </button>
      )}
    </div>
  );
}

// ── NumberCard (category grid) ────────────────────────────────────────────────
export type NumState = "complete"|"current"|"upcoming";
function NumberCard({ entry, state, index, onTap }: {
  entry: NumberEntry; state: NumState; index: number; onTap?: () => void;
}) {
  const isComplete = state === "complete";
  const isCurrent  = state === "current";
  const isUpcoming = state === "upcoming";

  return (
    <motion.button
      onClick={isCurrent || isComplete ? onTap : undefined}
      className="flex flex-col items-center rounded-3xl overflow-hidden"
      style={{
        padding:"clamp(10px,2vw,16px) clamp(8px,1.5vw,12px)",
        background: isUpcoming ? C.muted : isComplete ? `${entry.color}22` : "#FFFFFF",
        border: `2.5px solid ${isComplete?entry.color:isCurrent?C.navy:C.muted}`,
        boxShadow: isCurrent ? `4px 5px 0 ${C.navy}` : isComplete ? `3px 4px 0 ${entry.color}66` : "none",
        cursor: isUpcoming ? "default" : "pointer",
        position:"relative",
        gap: 6,
      }}
      initial={{ opacity:0, scale:0.75 }} animate={{ opacity:1, scale:1 }}
      transition={{ delay: index * 0.02, type:"spring", stiffness:280, damping:22 }}
      whileHover={!isUpcoming ? { scale:1.06 } : {}}
      whileTap={!isUpcoming ? { scale:0.94 } : {}}
    >
      {isComplete && (
        <div className="absolute top-1.5 right-1.5 rounded-full flex items-center justify-center"
          style={{ width:18, height:18, background:entry.color }}>
          <Check size={9} color="#FFF" strokeWidth={3} />
        </div>
      )}
      {isCurrent && (
        <motion.div className="absolute top-1.5 right-1.5 rounded-full"
          style={{ width:8, height:8, background:C.orange }}
          animate={{ scale:[1,1.5,1], opacity:[1,0.5,1] }} transition={{ duration:1.2, repeat:Infinity }} />
      )}

      {/* Number */}
      <span style={{ fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:"clamp(22px,4vw,32px)", color:isUpcoming?C.mutedFg:entry.color, lineHeight:1 }}>
        {isUpcoming ? "?" : entry.n}
      </span>

      {/* Emoji */}
      <span style={{ fontSize:"clamp(20px,3.5vw,28px)", lineHeight:1, filter:isUpcoming?"grayscale(1) opacity(0.3)":"none" }}>
        {entry.emoji}
      </span>

      {/* Word */}
      <span style={{ fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:"clamp(9px,1.4vw,13px)", color:isUpcoming?C.mutedFg:C.navy, textAlign:"center", lineHeight:1.2 }}>
        {isUpcoming ? "Locked" : entry.word}
      </span>
    </motion.button>
  );
}

// ── NumberLessonScreen ────────────────────────────────────────────────────────
export function NumberLessonScreen({ numIndex, onBack, onComplete, onNavigate }: {
  numIndex: number; onBack: () => void; onComplete: () => void; onNavigate: (i: number) => void;
}) {
  const [playing,   setPlaying]  = useState(false);
  const [burst,     setBurst]    = useState(0);
  const [reacting,  setReacting] = useState(false);
  const [tapCount,  setTapCount] = useState(0);

  const entry = NUMBER_DATA[numIndex];

  useEffect(() => {
    setPlaying(false); setBurst(0); setReacting(false); setTapCount(0);
  }, [numIndex]);

  const speakNumber = () => {
    if (playing) return;
    setPlaying(true); setBurst(b => b + 1); setReacting(true);
    const spoke = speak(`${entry.n}. ${entry.word}`, {
      rate: 0.7, pitch: 1.25, onEnd: () => setPlaying(false),
    });
    if (!spoke) setTimeout(() => setPlaying(false), 1200);
    setTimeout(() => setReacting(false), 1000);
  };

  return (
    <>
      <LessonShell
        color={entry.color}
        dark={entry.dark}
        letterBg={entry.n.toString()}
        emojiBg={entry.emoji}
        currentIndex={numIndex}
        totalEntries={NUMBER_DATA.length}
        playing={playing}
        burstCount={burst}
        onBack={onBack}
        onComplete={onComplete}
        onNavigate={onNavigate}
        onSpeak={speakNumber}
        mascotNode={<NumberMascot reacting={reacting} count={tapCount} n={entry.n} />}
        mainNode={<GiantNumber entry={entry} onClick={speakNumber} pulsing={playing} />}
        panelNode={<CountingPanelTracked entry={entry} onCountChange={setTapCount} />}
      />
      <AmbientSparkles
        zIndex={5}
        spots={[
          { top:"6%",  left:"2%",  size:20, color:C.yellow },
          { top:"12%", right:"3%", size:15, color:"rgba(255,255,255,0.8)" },
          { top:"80%", left:"3%",  size:18, color:C.yellow },
          { top:"75%", right:"4%", size:14, color:"rgba(255,255,255,0.7)" },
        ]}
      />
    </>
  );
}

// ── NumbersPage (category page) ───────────────────────────────────────────────
export function NumbersPage({ onBack, onContinue, learnedCount }: { onBack: () => void; onContinue: () => void; learnedCount: number }) {

  return (
    <div className="flex flex-col h-screen" style={{ background:"linear-gradient(180deg,#FFF0D6 0%,#FFFFFF 55%)", fontFamily:"'Fredoka','Nunito',sans-serif" }}>

      {/* Hero banner */}
      <div className="relative overflow-hidden flex-shrink-0"
        style={{ background:`linear-gradient(135deg,${C.orange} 0%,#FF6B00 60%,${C.yellow} 100%)`, borderBottom:`3px solid ${C.navy}`, padding:"clamp(14px,2.5vw,24px) clamp(16px,3vw,40px)", boxShadow:`0 4px 0 ${C.navy}` }}>
        <div className="flex items-center justify-between">
          <div>
            <BackButton onClick={onBack} />
            <h1 style={{ fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:"clamp(22px,5vw,34px)", color:"#FFF", marginTop:8, lineHeight:1 }}>
              🔢 Numbers
            </h1>
            <p style={{ fontFamily:"'Nunito',sans-serif", fontSize:13, color:"rgba(255,255,255,0.75)", marginTop:4 }}>
              Learn to count from 1 to 20!
            </p>
          </div>
          <motion.span style={{ fontSize:"clamp(52px,10vw,80px)" }}
            animate={{ y:[0,-8,0], rotate:[0,-5,5,0] }} transition={{ duration:2.5, repeat:Infinity, ease:"easeInOut" }}>
            🔢
          </motion.span>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <ProgressTrack progress={Math.round((learnedCount / NUMBER_DATA.length) * 100)} color="rgba(255,255,255,0.9)" height={8} label={`${learnedCount} of ${NUMBER_DATA.length} numbers learned`} />
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <StatPill emoji="✅" value={String(learnedCount)} label="Learned"   valueColor={C.yellow} />
          <StatPill emoji="⭐" value="56"             label="Stars"    valueColor={C.yellow} />
          <StatPill emoji="🔢" value={String(NUMBER_DATA.length)} label="Total" valueColor="#FFF" />
        </div>
      </div>

      {/* Number grid */}
      <div className="flex-1 overflow-y-auto lf-carousel" style={{ padding:"clamp(14px,2.5vw,24px) clamp(16px,3vw,40px)" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(clamp(76px,12vw,110px), 1fr))", gap:"clamp(8px,1.5vw,14px)", marginBottom:24 }}>
          {NUMBER_DATA.map((entry, i) => {
            const state: NumState = i < learnedCount ? "complete" : i === learnedCount ? "current" : "upcoming";
            return (
              <NumberCard
                key={entry.n} entry={entry} state={state} index={i}
                onTap={onContinue}
              />
            );
          })}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="flex-shrink-0 px-5 pb-5 pt-2" style={{ borderTop:`2px solid ${C.muted}` }}>
        <CTAButton label={`Continue: ${NUMBER_DATA[learnedCount]?.word ?? "Twenty"} →`} color={C.orange} onClick={onContinue} />
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { C } from "../constants";
import { CTAButton, Sparkle } from "./primitives";
import { RainingConfetti } from "./lessonComplete";

// ── App icon ─────────────────────────────────────────────────────────────────
export function LearnFunIcon({ size = 72 }: { size?: number }) {
  const r = Math.round(size * 0.24);
  return (
    <div style={{
      width: size, height: size, borderRadius: r, flexShrink: 0,
      background: "linear-gradient(145deg,#7B2FF7 0%,#AF52DE 55%,#FF2D9B 100%)",
      border: `${Math.max(2, size * 0.04)}px solid ${C.navy}`,
      boxShadow: `${size*0.055}px ${size*0.075}px 0 ${C.navy}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,rgba(255,255,255,0.3) 0%,transparent 52%)", borderRadius: r }} />
      <span style={{ fontSize: size * 0.46, lineHeight:1, position:"relative", zIndex:1 }}>📚</span>
      <span style={{ position:"absolute", bottom: size*0.09, right: size*0.09, fontSize: size*0.24, lineHeight:1, zIndex:2 }}>⭐</span>
    </div>
  );
}

// ── Realistic phone frame ─────────────────────────────────────────────────────
function PhoneShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      position: "relative",
      width: 320, height: 660,
      borderRadius: 46,
      background: "#0A0A0A",
      border: `8px solid #1A1A2E`,
      boxShadow: "0 0 0 2px #2D2D4A, 14px 18px 0 rgba(26,0,80,0.55), 0 40px 80px rgba(0,0,0,0.5)",
      flexShrink: 0,
    }}>
      {/* Side buttons */}
      <div style={{ position:"absolute", right:-10, top:100, width:5, height:40, background:"#1A1A2E", borderRadius:"0 4px 4px 0" }} />
      <div style={{ position:"absolute", left:-10, top:80,  width:5, height:30, background:"#1A1A2E", borderRadius:"4px 0 0 4px" }} />
      <div style={{ position:"absolute", left:-10, top:120, width:5, height:50, background:"#1A1A2E", borderRadius:"4px 0 0 4px" }} />
      {/* Screen area */}
      <div style={{ position:"absolute", inset:4, borderRadius:40, overflow:"hidden", background:"#F3EEFF" }}>
        {/* Notch bar */}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:36, background:"#0A0A0A", zIndex:99, display:"flex", alignItems:"flex-end", justifyContent:"center", paddingBottom:6 }}>
          <div style={{ width:90, height:10, background:"#1A1A2E", borderRadius:8 }} />
        </div>
        {/* Home indicator */}
        <div style={{ position:"absolute", bottom:6, left:"50%", transform:"translateX(-50%)", width:80, height:4, background:"rgba(26,0,80,0.25)", borderRadius:4, zIndex:99 }} />
        {/* Content */}
        <div style={{ position:"absolute", inset:0, overflowY:"auto", overflowX:"hidden" }} className="lf-carousel">
          {children}
        </div>
      </div>
    </div>
  );
}

// Extra space around the phone for shadow (14px right, 18px bottom) and side buttons (10px left/right)
const PHONE_PAD = { top: 10, right: 30, bottom: 30, left: 16 };
const PHONE_W = 320;
const PHONE_H = 660;

function ScaledPhone({ children }: { children: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new ResizeObserver(() => {
      const parent = el.parentElement;
      if (!parent) return;
      const { height, width } = parent.getBoundingClientRect();
      const availH = height - PHONE_PAD.top - PHONE_PAD.bottom;
      const availW = width  - PHONE_PAD.left - PHONE_PAD.right;
      setScale(Math.min(1, availH / PHONE_H, availW / PHONE_W));
    });
    obs.observe(el.parentElement!);
    return () => obs.disconnect();
  }, []);

  const outerW = (PHONE_W + PHONE_PAD.left + PHONE_PAD.right) * scale;
  const outerH = (PHONE_H + PHONE_PAD.top  + PHONE_PAD.bottom) * scale;

  return (
    <div ref={wrapRef} style={{ width: outerW, height: outerH, flexShrink: 0 }}>
      <div style={{
        transformOrigin: "top left",
        transform: `scale(${scale})`,
        paddingTop:  PHONE_PAD.top,
        paddingLeft: PHONE_PAD.left,
      }}>
        <PhoneShell>{children}</PhoneShell>
      </div>
    </div>
  );
}

// ── Step sidebar info (desktop left column) ───────────────────────────────────
const PWA_META = [
  { step:"loading",  icon:"⏳", label:"Loading Screen",   color:"#6B1FD4", desc:"First impression. A branded loading experience with a smooth progress bar that sets the app's tone before anything else loads." },
  { step:"splash",   icon:"✨", label:"Splash Screen",    color:C.purple,  desc:"The welcome moment. Full-screen brand identity with the app icon, name, and tagline — gives children an exciting entry point." },
  { step:"welcome",  icon:"👋", label:"Welcome Screen",   color:C.blue,    desc:"Feature discovery. Shows four key benefits — offline access, speed, reminders, and safety — with a clear Install CTA." },
  { step:"prompt",   icon:"📲", label:"Install Prompt",   color:C.orange,  desc:"Browser-native style bottom sheet. App icon, ratings, permission summary, and two-button Install / Not Now choice." },
  { step:"installing",icon:"⚙️",label:"Installing",       color:C.teal,    desc:"Transparent progress. A shimmer progress bar and four-step checklist show exactly what's being cached and why." },
  { step:"offline",  icon:"📶", label:"Offline Ready",    color:C.green,   desc:"Trust signal. Confirms the app works without internet and lists the specific content already saved to the device." },
  { step:"success",  icon:"🎉", label:"Success Screen",   color:C.pink,    desc:"Celebration moment. Confetti, a mock home-screen showing the installed icon, star rating, and a Launch button." },
  { step:"empty",    icon:"🗂️", label:"Empty States",     color:C.red,     desc:"Graceful zero-states. Three tabbed screens — Lessons, Rewards, Games — each with orbiting illustrations and a nudge CTA." },
];

type PWAStep = "loading"|"splash"|"welcome"|"prompt"|"installing"|"offline"|"success"|"empty";
const PWA_STEPS = PWA_META.map(m => m.step) as PWAStep[];

// ── 1. Loading screen ─────────────────────────────────────────────────────────
function PWALoadingScreen({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  const msgs = ["Fetching lessons…","Caching sounds…","Loading mascot…","Almost ready!"];
  const msgIdx = Math.min(msgs.length - 1, Math.floor((pct / 100) * msgs.length));

  useEffect(() => {
    const iv = setInterval(() => setPct(p => { if (p >= 100) { clearInterval(iv); return 100; } return p + 2.2; }), 55);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => { if (pct >= 100) { const t = setTimeout(onDone, 500); return () => clearTimeout(t); } }, [pct]);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-8"
      style={{ background:"linear-gradient(160deg,#1A0050 0%,#4B0082 55%,#7B2FF7 100%)", minHeight:"100%", paddingTop:44 }}>
      {[C.yellow,C.pink,C.teal,C.orange].map((col,i)=>(
        <motion.div key={i} className="absolute pointer-events-none"
          style={{ top:`${14+i*17}%`, left:i%2===0?`${5+i*2}%`:undefined, right:i%2!==0?`${5+i*2}%`:undefined }}
          animate={{ y:[0,-10,0], opacity:[0.4,0.9,0.4] }}
          transition={{ duration:2.5+i*0.4, repeat:Infinity, ease:"easeInOut", delay:i*0.3 }}>
          <Sparkle size={16+i*2} color={col} />
        </motion.div>
      ))}
      <motion.div initial={{ opacity:0, scale:0.5 }} animate={{ opacity:1, scale:1 }}
        transition={{ type:"spring", stiffness:260, damping:18 }}>
        <motion.div animate={{ rotate:[0,-5,5,-3,0] }} transition={{ duration:2, repeat:Infinity, ease:"easeInOut" }}>
          <LearnFunIcon size={84} />
        </motion.div>
      </motion.div>
      <motion.div className="text-center" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
        <h1 style={{ fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:26, color:"#FFFFFF" }}>LearnFun</h1>
        <p style={{ fontFamily:"'Nunito',sans-serif", fontSize:13, color:"rgba(255,255,255,0.55)", marginTop:3 }}>Play · Learn · Grow</p>
      </motion.div>
      <div className="w-full max-w-xs flex flex-col gap-2">
        <div style={{ height:10, background:"rgba(255,255,255,0.14)", borderRadius:99, overflow:"hidden", border:"1.5px solid rgba(255,255,255,0.2)" }}>
          <motion.div style={{ height:"100%", background:"linear-gradient(90deg,#FFD700,#FF9500)", borderRadius:99, position:"relative", overflow:"hidden" }}
            animate={{ width:`${pct}%` }} transition={{ ease:"easeOut", duration:0.1 }}>
            <motion.div style={{ position:"absolute", inset:0, background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)" }}
              animate={{ x:["-100%","180%"] }} transition={{ duration:1.1, repeat:Infinity, ease:"linear" }} />
          </motion.div>
        </div>
        <div className="flex justify-between items-center">
          <motion.span key={msgIdx} initial={{ opacity:0, y:3 }} animate={{ opacity:1, y:0 }}
            style={{ fontFamily:"'Nunito',sans-serif", fontSize:12, color:"rgba(255,255,255,0.5)" }}>
            {msgs[msgIdx]}
          </motion.span>
          <span style={{ fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:13, color:C.yellow }}>{Math.round(Math.min(pct,100))}%</span>
        </div>
      </div>
      <button onClick={onDone} style={{ fontFamily:"'Nunito',sans-serif", fontSize:11, color:"rgba(255,255,255,0.28)", background:"none", border:"none", cursor:"pointer", marginTop:-12 }}>Skip →</button>
    </div>
  );
}

// ── 2. Splash screen ──────────────────────────────────────────────────────────
function PWASplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, []);
  const pills = [["📚","Lessons"],["🎮","Games"],["⭐","Rewards"],["📶","Offline"]];
  return (
    <div className="flex flex-col items-center justify-center h-full gap-7 px-8 text-center"
      style={{ background:"linear-gradient(160deg,#2D0082 0%,#6B1FD4 50%,#AF52DE 100%)", minHeight:"100%", paddingTop:44 }}>
      <motion.div initial={{ scale:0, rotate:-20 }} animate={{ scale:1, rotate:0 }}
        transition={{ type:"spring", stiffness:300, damping:18, delay:0.1 }}>
        <LearnFunIcon size={96} />
      </motion.div>
      <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}>
        <h1 style={{ fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:32, color:"#FFFFFF", letterSpacing:0.5 }}>LearnFun</h1>
        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
          style={{ fontFamily:"'Nunito',sans-serif", fontSize:14, color:"rgba(255,255,255,0.65)", marginTop:5 }}>
          The fun way for little ones to learn
        </motion.p>
      </motion.div>
      <motion.div className="flex flex-wrap justify-center gap-2"
        initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.55 }}>
        {pills.map(([e,l],i)=>(
          <motion.div key={l} initial={{ scale:0 }} animate={{ scale:1 }}
            transition={{ type:"spring", stiffness:320, damping:16, delay:0.6+i*0.08 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl"
            style={{ background:"rgba(255,255,255,0.13)", border:"1.5px solid rgba(255,255,255,0.22)" }}>
            <span style={{ fontSize:14 }}>{e}</span>
            <span style={{ fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:12, color:"rgba(255,255,255,0.88)" }}>{l}</span>
          </motion.div>
        ))}
      </motion.div>
      <motion.div animate={{ y:[0,-6,0] }} transition={{ duration:1.6, repeat:Infinity, ease:"easeInOut" }}
        style={{ fontSize:13, color:"rgba(255,255,255,0.35)", fontFamily:"'Nunito',sans-serif" }}>
        tap anywhere to continue
      </motion.div>
      <div className="absolute inset-0" onClick={onDone} style={{ cursor:"pointer" }} />
    </div>
  );
}

// ── 3. Welcome screen ─────────────────────────────────────────────────────────
function PWAWelcomeScreen({ onInstall, onSkip }: { onInstall: () => void; onSkip: () => void }) {
  const feats = [
    { e:"📱", t:"Any device",       d:"Phone, tablet, computer" },
    { e:"⚡", t:"Instant load",     d:"No waiting, ever"        },
    { e:"📶", t:"Works offline",    d:"No WiFi? No problem!"    },
    { e:"🔒", t:"Safe for kids",    d:"No ads, no tracking"     },
  ];
  return (
    <div className="flex flex-col" style={{ minHeight:"100%", background:"#FFFFFF", paddingTop:44 }}>
      <div className="flex flex-col items-center pt-8 pb-5 px-5"
        style={{ background:"linear-gradient(180deg,#F3EEFF 0%,#FFFFFF 100%)" }}>
        <motion.div initial={{ scale:0.6, opacity:0 }} animate={{ scale:1, opacity:1 }}
          transition={{ type:"spring", stiffness:280, damping:18 }}>
          <LearnFunIcon size={76} />
        </motion.div>
        <motion.div className="text-center mt-4" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}>
          <h1 style={{ fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:22, color:C.navy }}>Welcome to LearnFun! 👋</h1>
          <p style={{ fontFamily:"'Nunito',sans-serif", fontSize:13, color:C.mutedFg, marginTop:5, lineHeight:1.5 }}>
            Install for the best experience — free, fast, and built for kids.
          </p>
        </motion.div>
      </div>
      <div className="flex flex-col gap-2.5 px-4 py-3">
        {feats.map((f,i)=>(
          <motion.div key={f.t} className="flex items-center gap-3 rounded-2xl px-3.5 py-2.5"
            style={{ background:C.cream, border:`2px solid ${C.muted}` }}
            initial={{ opacity:0, x:-14 }} animate={{ opacity:1, x:0 }}
            transition={{ delay:0.12+i*0.07, type:"spring", stiffness:260, damping:20 }}>
            <span style={{ fontSize:22, flexShrink:0 }}>{f.e}</span>
            <div className="flex-1 min-w-0">
              <p style={{ fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:14, color:C.navy, lineHeight:1.2 }}>{f.t}</p>
              <p style={{ fontFamily:"'Nunito',sans-serif", fontSize:11, color:C.mutedFg }}>{f.d}</p>
            </div>
            <motion.div className="rounded-full flex items-center justify-center flex-shrink-0"
              style={{ width:20, height:20, background:C.green, border:`2px solid ${C.navy}` }}
              initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay:0.28+i*0.07, type:"spring" }}>
              <Check size={11} color="#FFF" strokeWidth={3} />
            </motion.div>
          </motion.div>
        ))}
      </div>
      <div className="px-4 pb-6 mt-auto flex flex-col gap-2.5">
        <motion.button onClick={onInstall}
          className="w-full rounded-2xl flex items-center justify-center gap-2"
          style={{ height:52, background:`linear-gradient(135deg,${C.purple},#5B0FD4)`, border:`3px solid ${C.navy}`, boxShadow:`3px 4px 0 ${C.navy}`, fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:17, color:"#FFF", cursor:"pointer" }}
          whileHover={{ scale:1.03 }} whileTap={{ scale:0.96 }}
          initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.44 }}>
          📲 Install App — It&apos;s Free!
        </motion.button>
        <button onClick={onSkip}
          style={{ fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:12, color:C.mutedFg, background:"none", border:"none", cursor:"pointer", padding:"6px 0" }}>
          Continue in browser →
        </button>
      </div>
    </div>
  );
}

// ── 4. Install prompt (browser bottom-sheet) ──────────────────────────────────
function PWAInstallPrompt({ onConfirm, onDeny }: { onConfirm: () => void; onDeny: () => void }) {
  const perms = ["Access content offline","Add shortcut to home screen","Send progress reminders"];
  return (
    <div className="flex flex-col" style={{ minHeight:"100%", background:"rgba(0,0,0,0.5)", paddingTop:44 }}>
      {/* Dimmed background hint */}
      <div className="flex-1 flex items-center justify-center opacity-25 pointer-events-none">
        <div className="text-center">
          <span style={{ fontSize:52 }}>📚</span>
          <p style={{ fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:18, color:"#FFF", marginTop:6 }}>LearnFun</p>
        </div>
      </div>
      {/* Sheet */}
      <motion.div className="rounded-t-3xl flex flex-col"
        style={{ background:"#FFFFFF", borderTop:`3px solid ${C.navy}` }}
        initial={{ y:280 }} animate={{ y:0 }} transition={{ type:"spring", stiffness:300, damping:28, delay:0.08 }}>
        <div className="flex justify-center pt-2.5 pb-1">
          <div style={{ width:36, height:4, borderRadius:4, background:"rgba(26,0,80,0.18)" }} />
        </div>
        {/* URL bar */}
        <div className="mx-4 mt-1 mb-2 flex items-center gap-2 rounded-xl px-3 py-1.5"
          style={{ background:C.cream, border:`1.5px solid ${C.muted}` }}>
          <span style={{ fontSize:12 }}>🔒</span>
          <span style={{ fontFamily:"'Nunito',sans-serif", fontSize:11, color:C.mutedFg, flex:1 }}>learnfun.app</span>
          <div style={{ width:6, height:6, borderRadius:9, background:C.green }} />
        </div>
        {/* App info row */}
        <div className="flex items-center gap-3 px-4 py-3">
          <LearnFunIcon size={54} />
          <div className="flex-1 min-w-0">
            <p style={{ fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:17, color:C.navy }}>LearnFun</p>
            <p style={{ fontFamily:"'Nunito',sans-serif", fontSize:11, color:C.mutedFg }}>learnfun.app · Free</p>
            <div className="flex items-center gap-0.5 mt-0.5">
              {"⭐⭐⭐⭐⭐".split("").map((s,i)=><span key={i} style={{ fontSize:11 }}>{s}</span>)}
              <span style={{ fontFamily:"'Nunito',sans-serif", fontSize:10, color:C.mutedFg, marginLeft:3 }}>4.9 · 12k</span>
            </div>
          </div>
        </div>
        <div style={{ height:1, background:C.muted, margin:"0 16px 12px" }} />
        <div className="px-4 pb-2">
          <p style={{ fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:13, color:C.navy, marginBottom:8 }}>Adding to Home Screen allows:</p>
          {perms.map((p,i)=>(
            <motion.div key={p} className="flex items-center gap-2.5 mb-2.5"
              initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.2+i*0.07 }}>
              <div className="rounded-full flex items-center justify-center flex-shrink-0"
                style={{ width:18, height:18, background:C.purple }}>
                <Check size={9} color="#FFF" strokeWidth={3} />
              </div>
              <span style={{ fontFamily:"'Nunito',sans-serif", fontSize:12, color:C.navy }}>{p}</span>
            </motion.div>
          ))}
        </div>
        <div className="flex gap-2.5 px-4 pb-8 pt-1">
          <button onClick={onDeny}
            className="flex-1 rounded-2xl flex items-center justify-center"
            style={{ height:48, background:C.muted, border:`2px solid ${C.navy}`, boxShadow:`2px 3px 0 ${C.navy}`, fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:15, color:C.navy, cursor:"pointer" }}>
            Not Now
          </button>
          <motion.button onClick={onConfirm}
            className="flex-1 rounded-2xl flex items-center justify-center gap-1.5"
            style={{ height:48, background:`linear-gradient(135deg,${C.purple},#5B0FD4)`, border:`2px solid ${C.navy}`, boxShadow:`2px 3px 0 ${C.navy}`, fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:15, color:"#FFF", cursor:"pointer" }}
            whileHover={{ scale:1.04 }} whileTap={{ scale:0.95 }}>
            <span style={{ fontSize:16 }}>📲</span> Install
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

// ── 5. Installing screen ──────────────────────────────────────────────────────
function PWAInstallingScreen({ onDone }: { onDone: () => void }) {
  const tasks = ["Downloading app shell","Caching 26 lessons","Saving game assets","Enabling offline mode"];
  const [pct, setPct]   = useState(0);
  const taskIdx = Math.min(tasks.length-1, Math.floor((pct/100)*tasks.length));
  useEffect(()=>{ const iv=setInterval(()=>setPct(p=>{ if(p>=100){clearInterval(iv);return 100;} return p+1.6; }),55); return ()=>clearInterval(iv); },[]);
  useEffect(()=>{ if(pct>=100){ const t=setTimeout(onDone,700); return ()=>clearTimeout(t); } },[pct]);
  return (
    <div className="flex flex-col items-center justify-center h-full gap-7 px-7"
      style={{ background:"linear-gradient(160deg,#F3EEFF,#FFFFFF)", minHeight:"100%", paddingTop:44 }}>
      <motion.div animate={{ rotate:[0,-5,5,-3,0] }} transition={{ duration:2, repeat:Infinity, ease:"easeInOut" }}>
        <LearnFunIcon size={80} />
      </motion.div>
      <div className="w-full max-w-xs flex flex-col gap-3 text-center">
        <h2 style={{ fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:22, color:C.navy }}>Installing LearnFun…</h2>
        <div style={{ height:14, background:C.muted, borderRadius:99, overflow:"hidden", border:`2.5px solid ${C.navy}`, boxShadow:`2px 3px 0 ${C.navy}` }}>
          <motion.div style={{ height:"100%", background:`linear-gradient(90deg,${C.purple},${C.pink})`, position:"relative", overflow:"hidden" }}
            animate={{ width:`${pct}%` }} transition={{ ease:"easeOut", duration:0.1 }}>
            <motion.div style={{ position:"absolute", inset:0, background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)", transform:"skewX(-18deg)" }}
              animate={{ x:["-100%","200%"] }} transition={{ duration:1, repeat:Infinity, ease:"linear" }} />
          </motion.div>
        </div>
        <div className="flex justify-between">
          <motion.span key={taskIdx} initial={{ opacity:0, y:3 }} animate={{ opacity:1, y:0 }}
            style={{ fontFamily:"'Nunito',sans-serif", fontSize:12, color:C.mutedFg }}>{tasks[taskIdx]}</motion.span>
          <span style={{ fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:12, color:C.purple }}>{Math.round(Math.min(pct,100))}%</span>
        </div>
        <div className="flex flex-col gap-2 mt-1 text-left">
          {tasks.map((t,i)=>{
            const done=i<taskIdx||(pct>=100); const cur=i===taskIdx&&pct<100;
            return (
              <motion.div key={t} className="flex items-center gap-2.5"
                initial={{ opacity:0, x:-6 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.1 }}>
                <motion.div className="rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ width:18, height:18, background:done?C.green:cur?C.yellow:C.muted, border:`2px solid ${C.navy}` }}
                  animate={cur?{ scale:[1,1.18,1] }:{}} transition={{ repeat:Infinity, duration:0.7 }}>
                  {done && <Check size={9} color="#FFF" strokeWidth={3} />}
                  {cur  && <motion.div style={{ width:6, height:6, background:C.navy, borderRadius:9 }} animate={{ opacity:[1,0,1] }} transition={{ duration:0.6, repeat:Infinity }} />}
                </motion.div>
                <span style={{ fontFamily:"'Nunito',sans-serif", fontSize:12, color:done||cur?C.navy:C.mutedFg, fontWeight:done||cur?700:400 }}>{t}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── 6. Offline ready ──────────────────────────────────────────────────────────
function PWAOfflineScreen({ onNext }: { onNext: () => void }) {
  const cached=[
    {e:"🔤",l:"Alphabet",n:"26 lessons"},{e:"🔢",l:"Numbers",n:"20 lessons"},
    {e:"🎨",l:"Colors",  n:"12 lessons"},{e:"🎮",l:"3 Games", n:"All levels"},
  ];
  return (
    <div className="flex flex-col" style={{ minHeight:"100%", background:"linear-gradient(180deg,#E8DFFF,#FFFFFF 60%)", paddingTop:44 }}>
      <div className="flex flex-col items-center pt-8 pb-5 px-5 text-center">
        <div className="relative mb-4">
          <motion.div className="rounded-full flex items-center justify-center"
            style={{ width:88, height:88, background:`linear-gradient(135deg,${C.green},${C.teal})`, border:`4px solid ${C.navy}`, boxShadow:`5px 6px 0 ${C.navy}` }}
            animate={{ scale:[1,1.07,1] }} transition={{ duration:2.2, repeat:Infinity, ease:"easeInOut" }}>
            <span style={{ fontSize:42 }}>📶</span>
          </motion.div>
          <motion.div className="absolute -bottom-1 -right-1 rounded-full flex items-center justify-center"
            style={{ width:30, height:30, background:C.green, border:`3px solid ${C.navy}` }}
            initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:"spring", stiffness:400, damping:14, delay:0.4 }}>
            <Check size={14} color="#FFF" strokeWidth={3} />
          </motion.div>
        </div>
        <motion.h1 initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
          style={{ fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:22, color:C.navy }}>Works Offline! 🎉</motion.h1>
        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}
          style={{ fontFamily:"'Nunito',sans-serif", fontSize:13, color:C.mutedFg, marginTop:5, lineHeight:1.5 }}>
          No internet? LearnFun keeps going. Your child never has to stop learning.
        </motion.p>
      </div>
      <div className="grid grid-cols-2 gap-2.5 px-4">
        {cached.map((c,i)=>(
          <motion.div key={c.l} className="rounded-2xl flex items-center gap-2.5 px-3 py-2.5"
            style={{ background:"#FFFFFF", border:`2px solid ${C.muted}`, boxShadow:`3px 3px 0 rgba(26,0,80,0.08)` }}
            initial={{ opacity:0, scale:0.85 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.14+i*0.07, type:"spring" }}>
            <span style={{ fontSize:22 }}>{c.e}</span>
            <div>
              <p style={{ fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:13, color:C.navy, lineHeight:1.2 }}>{c.l}</p>
              <p style={{ fontFamily:"'Nunito',sans-serif", fontSize:10, color:C.mutedFg }}>{c.n}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div className="mx-4 mt-3 rounded-2xl flex items-center gap-3 px-3.5 py-2.5"
        style={{ background:"rgba(52,199,89,0.10)", border:`2px solid ${C.green}` }}
        initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.48 }}>
        <span style={{ fontSize:20, flexShrink:0 }}>✈️</span>
        <p style={{ fontFamily:"'Nunito',sans-serif", fontSize:12, color:C.navy, lineHeight:1.4 }}>
          <strong>Try it!</strong> Switch to airplane mode — we&apos;ll still be here.
        </p>
      </motion.div>
      <div className="px-4 pb-7 mt-auto pt-4">
        <CTAButton label="Continue →" color={C.green} onClick={onNext} />
      </div>
    </div>
  );
}

// ── 7. Success screen ─────────────────────────────────────────────────────────
function PWASuccessScreen({ onNext }: { onNext: () => void }) {
  const dockApps = ["📷","🎵","🗺️","📞","⚙️","🌐","📧","🛒"];
  return (
    <div className="flex flex-col items-center" style={{ minHeight:"100%", background:"linear-gradient(160deg,#4B0082,#7B2FF7,#AF52DE)", paddingTop:44 }}>
      <RainingConfetti />
      <div className="relative z-10 flex flex-col items-center px-5 pt-8 gap-4 w-full">
        <motion.span style={{ fontSize:64 }}
          initial={{ scale:0, rotate:-20 }} animate={{ scale:1, rotate:0 }}
          transition={{ type:"spring", stiffness:300, damping:16, delay:0.1 }}>🎉</motion.span>
        <motion.div className="text-center" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
          <h1 style={{ fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:26, color:"#FFFFFF", textShadow:"0 3px 12px rgba(0,0,0,0.3)" }}>App Installed!</h1>
          <p style={{ fontFamily:"'Nunito',sans-serif", fontSize:13, color:"rgba(255,255,255,0.65)", marginTop:4 }}>LearnFun is now on your home screen</p>
        </motion.div>
        {/* Fake home-screen card */}
        <motion.div className="rounded-2xl overflow-hidden w-full"
          style={{ maxWidth:260, background:"rgba(0,0,0,0.45)", border:"2.5px solid rgba(255,255,255,0.25)", backdropFilter:"blur(12px)" }}
          initial={{ opacity:0, scale:0.82, y:18 }} animate={{ opacity:1, scale:1, y:0 }}
          transition={{ type:"spring", stiffness:260, damping:20, delay:0.3 }}>
          <div className="flex justify-between px-3.5 pt-2 pb-1">
            <span style={{ fontSize:10, color:"rgba(255,255,255,0.65)", fontFamily:"'Nunito',sans-serif", fontWeight:700 }}>9:41</span>
            <span style={{ fontSize:10, color:"rgba(255,255,255,0.65)" }}>●●●</span>
          </div>
          <div className="grid grid-cols-4 gap-2.5 px-3.5 pb-2">
            {dockApps.map((app,i)=>(
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div className="rounded-xl flex items-center justify-center"
                  style={{ width:44, height:44, background:"rgba(255,255,255,0.13)", fontSize:20 }}>{app}</div>
                <span style={{ fontSize:7, color:"rgba(255,255,255,0.4)", fontFamily:"'Nunito',sans-serif" }}>App</span>
              </div>
            ))}
          </div>
          {/* LearnFun icon highlighted */}
          <div className="flex flex-col items-center pb-4">
            <div className="relative">
              <motion.div animate={{ scale:[1,1.1,1] }} transition={{ duration:1.8, repeat:Infinity, ease:"easeInOut" }}>
                <LearnFunIcon size={52} />
              </motion.div>
              <motion.div className="absolute -top-1 -right-1 rounded-full flex items-center justify-center"
                style={{ width:18, height:18, background:C.green, border:"2px solid #FFF" }}
                initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:"spring", delay:0.65 }}>
                <Check size={9} color="#FFF" strokeWidth={3} />
              </motion.div>
              {/* Tap ripple */}
              <motion.div className="absolute rounded-full pointer-events-none"
                style={{ width:64, height:64, border:"2px solid rgba(255,215,0,0.6)", top:-6, left:-6 }}
                animate={{ scale:[1,1.7], opacity:[0.8,0] }} transition={{ duration:1.3, repeat:Infinity, ease:"easeOut", delay:0.9 }} />
            </div>
            <span style={{ fontSize:9, color:"rgba(255,255,255,0.88)", fontFamily:"'Fredoka',sans-serif", fontWeight:700, marginTop:4 }}>LearnFun</span>
          </div>
        </motion.div>
        {/* Stars */}
        <motion.div className="flex gap-2.5" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}>
          {[0,1,2].map(i=>(
            <motion.span key={i} style={{ fontSize:30 }}
              initial={{ scale:0, rotate:-30 }} animate={{ scale:1, rotate:0 }}
              transition={{ type:"spring", stiffness:380, damping:14, delay:0.55+i*0.1 }}>⭐</motion.span>
          ))}
        </motion.div>
        <div className="w-full pb-8 mt-1">
          <motion.button onClick={onNext}
            className="w-full rounded-2xl flex items-center justify-center gap-2"
            style={{ height:52, background:`linear-gradient(135deg,${C.yellow},${C.orange})`, border:`3px solid ${C.navy}`, boxShadow:`3px 4px 0 ${C.navy}`, fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:17, color:C.navy, cursor:"pointer" }}
            whileHover={{ scale:1.03 }} whileTap={{ scale:0.96 }}
            initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.7 }}>
            🚀 Start Learning!
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// ── 8. Empty states ───────────────────────────────────────────────────────────
type ETab = "lessons"|"rewards"|"games";
const EMPTY_CFG: Record<ETab,{ bg:string; color:string; icon:string; orbs:string[]; title:string; body:string; cta:string }> = {
  lessons:{ bg:"#F3EEFF", color:C.purple, icon:"📚", orbs:["🔤","🔢","🎨","🔷"],
    title:"Your adventure begins here!", body:"Pick a category below to start your very first lesson.", cta:"Start Learning" },
  rewards:{ bg:"#FFF8D6", color:C.orange, icon:"🏆", orbs:["⭐","🥇","🏅","✨"],
    title:"No rewards yet — but soon!", body:"Complete lessons and games to earn badges and stars!", cta:"Go to Lessons" },
  games:  { bg:"#E4F8E8", color:C.green,  icon:"🎮", orbs:["🃏","🧩","🎈","🎯"],
    title:"Games are waiting for you!", body:"Finish 3 lessons to unlock your first game!", cta:"Unlock Games" },
};
function EmptyStatePanel({ tab }: { tab: ETab }) {
  const c = EMPTY_CFG[tab];
  return (
    <div className="flex flex-col items-center justify-center text-center gap-4 px-5 py-8" style={{ background:c.bg, minHeight:320 }}>
      <div className="relative flex items-center justify-center" style={{ width:140, height:140 }}>
        {c.orbs.map((orb,i)=>{
          const ang=(i/c.orbs.length)*360, rad=(ang*Math.PI)/180, rx=54, ry=54;
          return (
            <motion.span key={i} className="absolute" style={{ fontSize:24, left:"50%", top:"50%", marginLeft:-12, marginTop:-12 }}
              animate={{ x:[Math.cos(rad)*rx,Math.cos(rad+0.5)*rx,Math.cos(rad)*rx], y:[Math.sin(rad)*ry,Math.sin(rad+0.5)*ry,Math.sin(rad)*ry] }}
              transition={{ duration:3+i*0.4, repeat:Infinity, ease:"easeInOut", delay:i*0.25 }}>{orb}</motion.span>
          );
        })}
        <motion.div className="rounded-full flex items-center justify-center"
          style={{ width:80, height:80, background:"#FFFFFF", border:`4px solid ${c.color}`, boxShadow:`4px 5px 0 rgba(26,0,80,0.16)`, fontSize:38 }}
          animate={{ y:[0,-5,0] }} transition={{ duration:2.2, repeat:Infinity, ease:"easeInOut" }}>{c.icon}</motion.div>
      </div>
      <h3 style={{ fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:17, color:C.navy, lineHeight:1.3 }}>{c.title}</h3>
      <p style={{ fontFamily:"'Nunito',sans-serif", fontSize:13, color:C.mutedFg, lineHeight:1.5, maxWidth:240 }}>{c.body}</p>
      <motion.button className="rounded-2xl px-6 flex items-center justify-center"
        style={{ height:44, background:c.color, border:`2.5px solid ${C.navy}`, boxShadow:`3px 3px 0 ${C.navy}`, fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:15, color:"#FFF", cursor:"pointer" }}
        whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}>{c.cta}</motion.button>
    </div>
  );
}
function PWAEmptyStates({ onDone }: { onDone: () => void }) {
  const tabs: ETab[] = ["lessons","rewards","games"];
  const labels: Record<ETab,string> = { lessons:"📚 Lessons", rewards:"🏆 Rewards", games:"🎮 Games" };
  const [active, setActive] = useState<ETab>("lessons");
  return (
    <div className="flex flex-col" style={{ minHeight:"100%", background:"#FFFFFF", paddingTop:44 }}>
      <div className="px-4 pt-6 pb-3">
        <h2 style={{ fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:19, color:C.navy }}>Empty States</h2>
        <p style={{ fontFamily:"'Nunito',sans-serif", fontSize:12, color:C.mutedFg, marginTop:2 }}>Friendly screens when there&apos;s nothing here yet</p>
      </div>
      <div className="flex gap-2 px-4 pb-3">
        {tabs.map(t=>(
          <button key={t} onClick={()=>setActive(t)}
            className="flex-1 rounded-2xl py-1.5 text-center"
            style={{ background:active===t?C.navy:C.muted, border:`2px solid ${C.navy}`, fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:11, color:active===t?"#FFF":C.navy, cursor:"pointer", boxShadow:active===t?`2px 2px 0 rgba(26,0,80,0.3)`:"none", transition:"all 0.15s" }}>
            {labels[t]}
          </button>
        ))}
      </div>
      <div className="mx-4 mb-4 rounded-3xl overflow-hidden flex-1" style={{ border:`2.5px solid ${C.muted}`, minHeight:300 }}>
        <motion.div key={active} initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.2 }}>
          <EmptyStatePanel tab={active} />
        </motion.div>
      </div>
      <div className="px-4 pb-7">
        <CTAButton label="🚀 Launch LearnFun!" color={C.purple} onClick={onDone} />
      </div>
    </div>
  );
}

// ── PWA flow orchestrator ─────────────────────────────────────────────────────
export function PWAFlow({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState<PWAStep>("loading");
  const idx  = PWA_STEPS.indexOf(step);
  const next = () => { const n = PWA_STEPS[idx+1]; if (n) setStep(n); else onDone(); };
  const prev = () => { const p = PWA_STEPS[idx-1]; if (p) setStep(p); };

  const screen = (
    <motion.div key={step} className="w-full h-full"
      initial={{ opacity:0, x:22 }} animate={{ opacity:1, x:0 }}
      transition={{ duration:0.2, ease:"easeOut" }} style={{ minHeight:"100%" }}>
      {step==="loading"    && <PWALoadingScreen   onDone={next} />}
      {step==="splash"     && <PWASplashScreen    onDone={next} />}
      {step==="welcome"    && <PWAWelcomeScreen   onInstall={next} onSkip={next} />}
      {step==="prompt"     && <PWAInstallPrompt   onConfirm={next} onDeny={next} />}
      {step==="installing" && <PWAInstallingScreen onDone={next} />}
      {step==="offline"    && <PWAOfflineScreen   onNext={next} />}
      {step==="success"    && <PWASuccessScreen   onNext={next} />}
      {step==="empty"      && <PWAEmptyStates     onDone={onDone} />}
    </motion.div>
  );

  const meta = PWA_META[idx];

  return (
    <div style={{ height:"100dvh", minHeight:"100vh", fontFamily:"'Fredoka','Nunito',sans-serif",
      background:"linear-gradient(145deg,#0D003A 0%,#1A0050 45%,#2D0082 100%)" }}>

      {/* ── DESKTOP: 2-column ─────────────────────────────── */}
      <div className="hidden md:flex h-full">
        {/* Left: context panel */}
        <div className="flex flex-col justify-between px-10 py-8 flex-1 min-w-0" style={{ maxWidth:480 }}>
          {/* Logo + exit */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <LearnFunIcon size={36} />
              <span style={{ fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:18, color:"rgba(255,255,255,0.85)" }}>LearnFun</span>
            </div>
            <button onClick={onDone}
              style={{ fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:12, color:"rgba(255,255,255,0.4)", background:"none", border:"none", cursor:"pointer" }}>
              ✕ Exit
            </button>
          </div>

          {/* Step info */}
          <div className="flex flex-col gap-5">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span style={{ fontSize:11, fontFamily:"'Nunito',sans-serif", fontWeight:700, color:"rgba(255,255,255,0.35)", letterSpacing:1.5, textTransform:"uppercase" }}>
                  Step {idx+1} of {PWA_STEPS.length}
                </span>
              </div>
              <motion.div key={step} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.25 }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ width:48, height:48, background:meta.color, border:`2.5px solid rgba(255,255,255,0.25)`, boxShadow:`3px 4px 0 rgba(0,0,0,0.35)`, fontSize:24 }}>
                    {meta.icon}
                  </div>
                  <h2 style={{ fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:"clamp(22px,3vw,30px)", color:"#FFFFFF", lineHeight:1.15 }}>
                    {meta.label}
                  </h2>
                </div>
                <p style={{ fontFamily:"'Nunito',sans-serif", fontSize:15, color:"rgba(255,255,255,0.62)", lineHeight:1.7, maxWidth:340 }}>
                  {meta.desc}
                </p>
              </motion.div>
            </div>

            {/* Step nav chips */}
            <div className="flex flex-wrap gap-1.5">
              {PWA_META.map((m,i)=>(
                <button key={m.step} onClick={()=>setStep(m.step as PWAStep)}
                  className="rounded-xl px-2.5 py-1"
                  style={{
                    background: m.step===step ? "rgba(255,255,255,0.16)" : "transparent",
                    border: `1.5px solid ${m.step===step ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.10)"}`,
                    fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:11,
                    color: m.step===step ? "#FFFFFF" : "rgba(255,255,255,0.38)",
                    cursor:"pointer", transition:"all 0.15s", whiteSpace:"nowrap",
                  }}>
                  {i+1}. {m.label}
                </button>
              ))}
            </div>

            {/* Prev / Next */}
            <div className="flex items-center gap-3">
              <motion.button onClick={prev} disabled={idx===0}
                className="flex items-center gap-1.5 rounded-2xl px-4 py-2.5"
                style={{ background: idx===0 ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.12)", border:"1.5px solid rgba(255,255,255,0.18)", fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:14, color: idx===0 ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.85)", cursor: idx===0 ? "default" : "pointer" }}
                whileHover={idx>0 ? { scale:1.04 } : {}} whileTap={idx>0 ? { scale:0.95 } : {}}>
                ← Prev
              </motion.button>
              <motion.button onClick={next}
                className="flex items-center gap-1.5 rounded-2xl px-5 py-2.5"
                style={{ background:meta.color, border:`2px solid rgba(255,255,255,0.25)`, boxShadow:`2px 3px 0 rgba(0,0,0,0.4)`, fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:14, color:"#FFF", cursor:"pointer" }}
                whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}>
                {idx===PWA_STEPS.length-1 ? "Launch App 🚀" : "Next →"}
              </motion.button>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between mb-1.5">
              <span style={{ fontFamily:"'Nunito',sans-serif", fontSize:11, color:"rgba(255,255,255,0.35)" }}>Flow progress</span>
              <span style={{ fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:11, color:"rgba(255,255,255,0.5)" }}>
                {Math.round(((idx+1)/PWA_STEPS.length)*100)}%
              </span>
            </div>
            <div style={{ height:5, background:"rgba(255,255,255,0.1)", borderRadius:99, overflow:"hidden" }}>
              <motion.div style={{ height:"100%", background:`linear-gradient(90deg,${meta.color},rgba(255,255,255,0.6))`, borderRadius:99 }}
                animate={{ width:`${((idx+1)/PWA_STEPS.length)*100}%` }} transition={{ duration:0.4, ease:"easeOut" }} />
            </div>
          </div>
        </div>

        {/* Right: phone frame */}
        <div className="flex items-center justify-center flex-1" style={{ padding:"16px 24px 16px 0", overflow:"visible" }}>
          <ScaledPhone>{screen}</ScaledPhone>
        </div>
      </div>

      {/* ── MOBILE: full-screen ───────────────────────────── */}
      <div className="md:hidden relative" style={{ height:"100dvh", minHeight:"100vh", overflow:"hidden" }}>
        {/* Thin step bar at top */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4"
          style={{ height:36, background:"rgba(26,0,80,0.85)", backdropFilter:"blur(8px)" }}>
          <span style={{ fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:12, color:"rgba(255,255,255,0.75)" }}>
            {meta.icon} {meta.label}
          </span>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {PWA_STEPS.map((s,i)=>(
                <button key={s} onClick={()=>setStep(s)}
                  style={{ width: s===step?18:6, height:6, borderRadius:99, background: i<=idx?"rgba(255,255,255,0.75)":"rgba(255,255,255,0.2)", border:"none", cursor:"pointer", transition:"width 0.25s, background 0.2s", padding:0 }} />
              ))}
            </div>
            <button onClick={onDone} style={{ fontFamily:"'Nunito',sans-serif", fontSize:11, color:"rgba(255,255,255,0.4)", background:"none", border:"none", cursor:"pointer", marginLeft:4 }}>✕</button>
          </div>
        </div>
        {/* Full-screen content */}
        <div style={{ position:"absolute", inset:0, overflowY:"auto" }} className="lf-carousel">
          {screen}
        </div>
        {/* Mobile prev/next overlay */}
        {step!=="loading" && step!=="splash" && step!=="installing" && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-between px-5 z-50 pointer-events-none">
            <motion.button onClick={prev} disabled={idx===0}
              className="pointer-events-auto rounded-full flex items-center justify-center"
              style={{ width:44, height:44, background:"rgba(26,0,80,0.65)", border:"1.5px solid rgba(255,255,255,0.22)", fontSize:18, cursor:idx===0?"default":"pointer", opacity:idx===0?0.3:1, backdropFilter:"blur(6px)" }}
              whileTap={idx>0?{scale:0.9}:{}}>←</motion.button>
            <motion.button onClick={next}
              className="pointer-events-auto rounded-full flex items-center justify-center"
              style={{ width:44, height:44, background:meta.color, border:`2px solid rgba(255,255,255,0.3)`, boxShadow:`2px 3px 0 rgba(0,0,0,0.4)`, fontSize:18, cursor:"pointer" }}
              whileHover={{ scale:1.08 }} whileTap={{ scale:0.92 }}>→</motion.button>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Timer, Minimize2, Maximize2, Coffee, Brain, Zap } from "lucide-react";

const MODES = {
  work:       { label: "تركيز",    minutes: 25, color: "#06b6d4", icon: Brain,  xp: 25 },
  shortBreak: { label: "استراحة", minutes: 5,  color: "#22c55e", icon: Coffee, xp: 0  },
  longBreak:  { label: "راحة كبيرة", minutes: 15, color: "#8b5cf6", icon: Zap,  xp: 0  },
};

function playAlarmSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Resume context if browser suspended it
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const now = ctx.currentTime;
    
    // Play a sequence of 3 pleasant chimes (C6 -> E6 -> G6)
    const tones = [1046.50, 1318.51, 1567.98]; 
    
    tones.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.15);
      
      gain.gain.setValueAtTime(0, now + idx * 0.15);
      gain.gain.linearRampToValueAtTime(0.3, now + idx * 0.15 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + idx * 0.15);
      osc.stop(now + idx * 0.15 + 0.35);
    });
  } catch (err) {
    console.error("Audio error:", err);
  }
}

function Ring({ pct, color, size = 120 }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e293b" strokeWidth={8} />
      <motion.circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={8} strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
        strokeDasharray={circ}
        animate={{ strokeDashoffset: circ * (1 - pct / 100) }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </svg>
  );
}

export default function StudyTimer() {
  const [mode, setMode] = useState("work");
  const [seconds, setSeconds] = useState(MODES.work.minutes * 60);
  const [running, setRunning] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [sessions, setSessions] = useState(() => Number(localStorage.getItem("ninja-timer-sessions") || 0));
  const [toast, setToast] = useState("");
  const intervalRef = useRef(null);
  const cfg = MODES[mode];
  const total = cfg.minutes * 60;
  const pct = Math.round(((total - seconds) / total) * 100);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }, []);

  const handleComplete = useCallback(() => {
    playAlarmSound();
    setRunning(false);
    if (mode === "work") {
      const newSessions = sessions + 1;
      setSessions(newSessions);
      localStorage.setItem("ninja-timer-sessions", newSessions);
      showToast(`✅ جلسة مكتملة! +${MODES.work.xp} XP 🔥`);
      if (newSessions % 4 === 0) {
        setMode("longBreak"); setSeconds(MODES.longBreak.minutes * 60);
      } else {
        setMode("shortBreak"); setSeconds(MODES.shortBreak.minutes * 60);
      }
    } else {
      showToast("☕ انتهت الاستراحة — عودة للتركيز!");
      setMode("work"); setSeconds(MODES.work.minutes * 60);
    }
  }, [mode, sessions, showToast]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) { clearInterval(intervalRef.current); handleComplete(); return 0; }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, handleComplete]);

  const switchMode = (m) => {
    setMode(m); setSeconds(MODES[m].minutes * 60); setRunning(false);
  };
  const reset = () => { setSeconds(total); setRunning(false); };

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-40"
      animate={minimized ? { scale: 1 } : { scale: 1 }}
    >
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="absolute bottom-full right-0 mb-3 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs font-bold text-slate-100 whitespace-nowrap shadow-xl">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div layout
        className={`bg-slate-900/95 border rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden transition-all`}
        style={{ borderColor: `${cfg.color}40`, boxShadow: `0 0 30px ${cfg.color}15` }}
        animate={{ width: minimized ? 80 : 220, height: minimized ? 80 : "auto" }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
      >
        {minimized ? (
          <motion.button whileHover={{ scale: 1.05 }} onClick={() => setMinimized(false)}
            className="w-full h-full flex flex-col items-center justify-center gap-1 cursor-pointer p-2">
            <div className="relative">
              <Ring pct={pct} color={cfg.color} size={52} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-black" style={{ color: cfg.color }}>{mm}:{ss}</span>
              </div>
            </div>
            {running && <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: cfg.color }} />}
          </motion.button>
        ) : (
          <div className="p-4 flex flex-col gap-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Timer className="w-4 h-4" style={{ color: cfg.color }} />
                <span className="text-xs font-extrabold text-slate-200">مؤقت الدراسة</span>
              </div>
              <button onClick={() => setMinimized(true)} className="text-slate-500 hover:text-slate-300 cursor-pointer p-1">
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mode tabs */}
            <div className="flex bg-slate-950 rounded-xl p-0.5 gap-0.5">
              {Object.entries(MODES).map(([k, v]) => (
                <button key={k} onClick={() => switchMode(k)}
                  className="flex-1 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                  style={mode === k ? { background: `${v.color}20`, color: v.color } : { color: "#64748b" }}>
                  {v.label}
                </button>
              ))}
            </div>

            {/* Ring + Time */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <Ring pct={pct} color={cfg.color} size={110} />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
                  <span className="text-2xl font-black font-mono" style={{ color: cfg.color }}>{mm}:{ss}</span>
                  <span className="text-[9px] text-slate-500">{cfg.label}</span>
                </div>
              </div>

              {/* Sessions counter */}
              <div className="flex items-center gap-1.5">
                {[0,1,2,3].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full transition-all"
                    style={{ background: i < (sessions % 4) ? cfg.color : "#1e293b" }} />
                ))}
                <span className="text-[10px] text-slate-500 mr-1">{sessions} جلسة</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={reset}
                className="p-2 rounded-xl border border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all cursor-pointer">
                <RotateCcw className="w-4 h-4" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setRunning(!running)}
                className="flex-1 py-2.5 rounded-xl font-extrabold text-sm text-white cursor-pointer flex items-center justify-center gap-2 transition-all"
                style={{ background: `linear-gradient(135deg, ${cfg.color}, #8b5cf6)`, boxShadow: `0 0 20px ${cfg.color}40` }}>
                {running ? <><Pause className="w-4 h-4" /> إيقاف</> : <><Play className="w-4 h-4" /> ابدأ</>}
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

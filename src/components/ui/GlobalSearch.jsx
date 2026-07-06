import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, BookOpen, Terminal, Layers, Command } from "lucide-react";
import { roadmapData } from "../../data/roadmapData";

// Build flat search index from roadmapData
function buildIndex() {
  const index = [];
  if (!roadmapData || !Array.isArray(roadmapData)) return index;
  roadmapData.forEach((phase) => {
    // Phase title
    index.push({ type: "phase", id: `phase-${phase.id}`, title: phase.title || phase.name || "", description: `المرحلة ${phase.id}`, targetId: `phase-${phase.id}` });
    // Resources
    (phase.resources || phase.items || []).forEach((res) => {
      if (res.name || res.title) {
        index.push({ type: "resource", id: `res-${phase.id}-${res.name || res.title}`, title: res.name || res.title, description: phase.title || phase.name || "", url: res.url || res.link, targetId: `phase-${phase.id}` });
      }
      // Sub-items / sub-resources
      (res.items || res.resources || []).forEach((sub) => {
        if (sub.name || sub.title) {
          index.push({ type: "resource", id: `sub-${phase.id}-${sub.name || sub.title}`, title: sub.name || sub.title, description: (res.name || res.title || "") + " — " + (phase.title || phase.name || ""), url: sub.url || sub.link, targetId: `phase-${phase.id}` });
        }
      });
    });
  });
  return index;
}

const INDEX = buildIndex();
const TYPE_CONFIG = {
  phase:    { icon: Layers,    label: "المراحل",   color: "text-cyan-400",   bg: "bg-cyan-500/10"   },
  resource: { icon: BookOpen,  label: "المصادر",   color: "text-purple-400", bg: "bg-purple-500/10" },
  command:  { icon: Terminal,  label: "الأوامر",   color: "text-emerald-400", bg: "bg-emerald-500/10" },
};

function highlight(text, query) {
  if (!query.trim()) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return parts.map((p, i) =>
    p.toLowerCase() === query.toLowerCase()
      ? <mark key={i} className="bg-cyan-500/30 text-cyan-300 rounded px-0.5">{p}</mark>
      : p
  );
}

function search(query) {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const results = INDEX.filter((item) =>
    item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
  ).slice(0, 15);

  const grouped = {};
  results.forEach((r) => {
    if (!grouped[r.type]) grouped[r.type] = [];
    if (grouped[r.type].length < 5) grouped[r.type].push(r);
  });
  return grouped;
}

export function useGlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); setIsOpen((v) => !v); }
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  return { isOpen, setIsOpen };
}

export function GlobalSearchTrigger({ onClick }) {
  return (
    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/60
        hover:border-slate-600 transition-all cursor-pointer text-slate-400 hover:text-slate-200 text-xs font-semibold"
    >
      <Search className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">بحث...</span>
      <kbd className="hidden sm:inline px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-500">Ctrl K</kbd>
    </motion.button>
  );
}

export default function GlobalSearch() {
  const { isOpen, setIsOpen } = useGlobalSearch();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({});
  const [cursor, setCursor] = useState(-1);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) { setTimeout(() => inputRef.current?.focus(), 50); setQuery(""); setResults({}); setCursor(-1); }
  }, [isOpen]);

  const handleQuery = useCallback((q) => {
    setQuery(q);
    setResults(search(q));
    setCursor(-1);
  }, []);

  const allResults = Object.values(results).flat();

  const handleSelect = (item) => {
    const el = document.getElementById(item.targetId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    if (item.url) window.open(item.url, "_blank", "noopener");
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(c + 1, allResults.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => Math.max(c - 1, -1)); }
    else if (e.key === "Enter" && cursor >= 0) { handleSelect(allResults[cursor]); }
    else if (e.key === "Escape") { setIsOpen(false); }
  };

  let globalIdx = 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-start justify-center pt-20 px-4 bg-slate-950/90 backdrop-blur-xl"
          onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
        >
          <motion.div initial={{ scale: 0.95, y: -20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: -20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="w-full max-w-2xl bg-slate-900/95 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800">
              <Search className="w-5 h-5 text-slate-500 flex-shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => handleQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="ابحث في الـ Roadmap، المصادر، الأوامر..."
                className="flex-1 bg-transparent text-base text-slate-200 placeholder-slate-500 focus:outline-none text-right"
              />
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-500">Esc</kbd>
                <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg text-slate-500 hover:text-slate-300 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto p-2">
              {!query.trim() ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                  <Command className="w-10 h-10 text-slate-700" />
                  <p className="text-sm font-bold text-slate-500">ابدأ الكتابة للبحث...</p>
                  <p className="text-xs text-slate-600">ابحث في المراحل، المصادر، والأدوات</p>
                </div>
              ) : allResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                  <Search className="w-10 h-10 text-slate-700" />
                  <p className="text-sm font-bold text-slate-400">لم يُعثر على نتائج لـ "{query}"</p>
                  <p className="text-xs text-slate-600">جرب كلمات مختلفة</p>
                </div>
              ) : (
                Object.entries(results).map(([type, items]) => {
                  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.resource;
                  const Icon = cfg.icon;
                  return (
                    <div key={type} className="mb-3">
                      <div className="flex items-center gap-2 px-3 py-1.5 mb-1">
                        <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                        <span className={`text-[10px] font-extrabold uppercase tracking-widest ${cfg.color}`}>{cfg.label}</span>
                        <span className="text-[10px] text-slate-600 ml-auto">{items.length} نتيجة</span>
                      </div>
                      {items.map((item) => {
                        const idx = globalIdx++;
                        const isActive = cursor === idx;
                        return (
                          <motion.button key={item.id} layout
                            onClick={() => handleSelect(item)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-right transition-all cursor-pointer mb-0.5 ${
                              isActive ? `${cfg.bg} border border-opacity-30` : "hover:bg-slate-800/60"
                            }`}
                          >
                            <div className={`w-7 h-7 rounded-lg ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                              <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                            </div>
                            <div className="flex-1 min-w-0 text-right">
                              <p className="text-xs font-bold text-slate-200 truncate">{highlight(item.title, query)}</p>
                              <p className="text-[10px] text-slate-500 truncate">{item.description}</p>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                          </motion.button>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-slate-800 flex items-center gap-4 text-[10px] text-slate-600">
              <span><kbd className="px-1 bg-slate-800 border border-slate-700 rounded text-[9px]">↑↓</kbd> تنقل</span>
              <span><kbd className="px-1 bg-slate-800 border border-slate-700 rounded text-[9px]">↵</kbd> فتح</span>
              <span className="mr-auto">{allResults.length} نتيجة</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

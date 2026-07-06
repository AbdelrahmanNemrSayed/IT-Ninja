import React, { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HardDrive, AlertTriangle, CheckCircle, Info } from "lucide-react";

const raidLevels = {
  raid0: {
    name: "RAID 0 — Striping",
    color: "amber",
    minDisks: 2,
    desc: "البيانات تُوزَّع على جميع الأقراص لأقصى سرعة. لا يوجد أي حماية — فقدان قرص واحد يُدمّر كل البيانات.",
    fault: 0,
    buildDisks: (count) => {
      const blocks = ["A", "B", "C", "D", "E", "F", "G", "H"];
      return Array.from({ length: count }, (_, i) =>
        blocks.filter((_, bi) => bi % count === i).map(b => ({ label: b, type: "data" }))
      );
    }
  },
  raid1: {
    name: "RAID 1 — Mirroring",
    color: "emerald",
    minDisks: 2,
    desc: "نسخة طبق الأصل من البيانات على كل قرص. سعة فعلية = 50% فقط. يتحمل فقدان حتى (n-1) قرص.",
    fault: 1,
    buildDisks: (count) => {
      const blocks = ["A", "B", "C", "D"];
      return Array.from({ length: count }, () =>
        blocks.slice(0, 4).map(b => ({ label: b, type: "mirror" }))
      );
    }
  },
  raid5: {
    name: "RAID 5 — Striping + Parity",
    color: "cyan",
    minDisks: 3,
    desc: "البيانات والـ Parity موزَّعة على جميع الأقراص. يتحمل فقدان قرص واحد فقط. الأكثر شيوعاً في الإنتاج.",
    fault: 1,
    buildDisks: (count) => {
      const stripes = [
        ["A", "B", "P"],
        ["C", "P", "D"],
        ["P", "E", "F"],
      ].slice(0, Math.min(3, count));
      return Array.from({ length: count }, (_, di) =>
        stripes.map(stripe => {
          const val = stripe[di % stripe.length];
          return { label: val, type: val === "P" ? "parity" : "data" };
        })
      );
    }
  },
  raid10: {
    name: "RAID 10 — Mirror + Stripe",
    color: "purple",
    minDisks: 4,
    desc: "يجمع بين سرعة RAID 0 وحماية RAID 1. يتطلب 4 أقراص على الأقل ويتحمل فقدان قرص من كل زوج.",
    fault: 2,
    buildDisks: (count) => {
      const pairs = Math.floor(count / 2);
      const blocks = ["A", "B", "C", "D", "E", "F"].slice(0, pairs * 2);
      return Array.from({ length: count }, (_, i) => {
        const pairIdx = Math.floor(i / 2);
        const label = blocks[pairIdx] || blocks[0];
        return [
          { label, type: "mirror" },
          { label: `${label}'`, type: "mirror" },
        ].slice(0, 2);
      }).flat(0);
    }
  }
};

const diskColorMap = {
  data: "bg-cyan-500/20 border-cyan-500/50 text-cyan-300",
  parity: "bg-amber-500/20 border-amber-500/50 text-amber-300",
  mirror: "bg-emerald-500/20 border-emerald-500/50 text-emerald-300",
  dead: "bg-rose-500/20 border-rose-500/60 text-rose-400 opacity-60",
};

const RAIDVisualizer = memo(function RAIDVisualizer() {
  const [selectedRAID, setSelectedRAID] = useState("raid5");
  const [diskCount, setDiskCount] = useState(3);
  const [failedDisk, setFailedDisk] = useState(null);

  const raid = raidLevels[selectedRAID];
  const minDisks = raid.minDisks;
  const effectiveDiskCount = Math.max(diskCount, minDisks);
  const disks = raid.buildDisks(effectiveDiskCount);

  const accentColors = {
    amber: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    emerald: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    cyan: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
    purple: "text-purple-400 border-purple-500/30 bg-purple-500/10",
  };
  const accentText = {
    amber: "text-amber-400",
    emerald: "text-emerald-400",
    cyan: "text-cyan-400",
    purple: "text-purple-400",
  };

  const isAlive = failedDisk === null;
  const canSurvive = failedDisk !== null && raid.fault >= 1;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-900/40 backdrop-blur-md border border-amber-500/20 rounded-2xl p-6 flex flex-col gap-6 shadow-lg relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="border-b border-slate-800 pb-4">
        <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-amber-400" />
          محاكي ومخطط RAID البصري التفاعلي (RAID Visualizer)
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          اختر مستوى RAID وعدد الأقراص وانقر على أي قرص لمحاكاة العطل ومعرفة مدى صمود النظام.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <span className="text-[11px] text-slate-400 font-bold">نوع RAID:</span>
          <div className="flex flex-wrap gap-2">
            {Object.entries(raidLevels).map(([key, val]) => (
              <button
                key={key}
                onClick={() => { setSelectedRAID(key); setFailedDisk(null); setDiskCount(val.minDisks); }}
                className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer border ${
                  selectedRAID === key
                    ? accentColors[val.color]
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {val.name.split("—")[0].trim()}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[11px] text-slate-400 font-bold">عدد الأقراص ({effectiveDiskCount}):</span>
          <input
            type="range"
            min={minDisks}
            max={8}
            value={effectiveDiskCount}
            onChange={(e) => { setDiskCount(parseInt(e.target.value)); setFailedDisk(null); }}
            className="w-36 accent-amber-400"
          />
        </div>
      </div>

      {/* RAID Info Badge */}
      <div className={`border rounded-xl p-4 flex flex-col gap-1.5 text-right ${accentColors[raid.color]}`}>
        <span className={`text-xs font-extrabold ${accentText[raid.color]}`}>{raid.name}</span>
        <p className="text-[11px] text-slate-400 leading-relaxed">{raid.desc}</p>
        <span className="text-[10px] font-bold text-slate-500 mt-1">
          الحماية: يتحمل عطل {raid.fault} {raid.fault === 0 ? "قرص (لا حماية)" : raid.fault === 1 ? "قرص" : "قرصين"}
        </span>
      </div>

      {/* Disk Visualizer */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-500">انقر على قرص لمحاكاة عطله</span>
          {failedDisk !== null && (
            <button
              onClick={() => setFailedDisk(null)}
              className="text-[10px] px-2 py-1 bg-slate-900 border border-slate-800 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              إعادة تشغيل الأقراص
            </button>
          )}
        </div>

        <div className="flex gap-3 flex-wrap justify-center">
          {Array.from({ length: effectiveDiskCount }, (_, diskIdx) => {
            const isDead = failedDisk === diskIdx;
            const diskData = disks[diskIdx] || [];

            return (
              <motion.div
                key={diskIdx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setFailedDisk(isDead ? null : diskIdx)}
                className={`relative cursor-pointer rounded-xl border-2 p-3 flex flex-col items-center gap-2 min-w-[70px] transition-all duration-300 ${
                  isDead
                    ? "border-rose-500 bg-rose-500/10 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                    : "border-slate-700 bg-slate-950 hover:border-slate-600"
                }`}
              >
                {isDead ? (
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                ) : (
                  <HardDrive className={`w-4 h-4 ${accentText[raid.color]}`} />
                )}
                <span className="text-[9px] font-bold text-slate-500">
                  Disk {diskIdx + 1}
                </span>
                <div className="flex flex-col gap-1 w-full">
                  {diskData.length > 0 ? diskData.map((block, bi) => (
                    <div
                      key={bi}
                      className={`text-center text-[9px] font-extrabold py-0.5 rounded border ${
                        isDead ? diskColorMap.dead : diskColorMap[block.type]
                      }`}
                    >
                      {block.label === "P" ? "PARITY" : block.label}
                    </div>
                  )) : (
                    <div className="text-center text-[9px] font-extrabold py-0.5 rounded border border-slate-800 text-slate-600">—</div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Status Banner */}
      <AnimatePresence>
        {failedDisk !== null && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`rounded-xl border p-4 flex items-center gap-3 text-right ${
              canSurvive
                ? "bg-emerald-500/10 border-emerald-500/30"
                : "bg-rose-500/10 border-rose-500/30"
            }`}
          >
            {canSurvive ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            )}
            <div>
              <p className={`text-xs font-extrabold mb-0.5 ${canSurvive ? "text-emerald-400" : "text-rose-400"}`}>
                {canSurvive ? "✅ النظام يعمل! — البيانات محمية" : "💥 فشل النظام! — البيانات ضاعت"}
              </p>
              <p className="text-[11px] text-slate-400">
                {canSurvive
                  ? `مستوى ${raid.name.split("—")[0].trim()} قادر على الاستمرار رغم عطل القرص ${failedDisk + 1}. يمكن استعادة البيانات عند استبداله.`
                  : `مستوى ${raid.name.split("—")[0].trim()} لا يتحمل هذا العطل. جميع البيانات مفقودة بشكل دائم!`}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-end border-t border-slate-900 pt-4">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-cyan-400">
          <div className="w-3 h-3 rounded bg-cyan-500/20 border border-cyan-500/50" /> Data Block
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400">
          <div className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/50" /> Parity Block
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400">
          <div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/50" /> Mirror Block
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-400">
          <div className="w-3 h-3 rounded bg-rose-500/20 border border-rose-500/50" /> Failed Disk
        </div>
      </div>
    </motion.section>
  );
});

export default RAIDVisualizer;

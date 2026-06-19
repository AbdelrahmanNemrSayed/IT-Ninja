import React, { memo } from "react";
import SubnetCalculator from "./SubnetCalculator";
import RaidCalculator from "./RaidCalculator";
import FirewallGenerator from "./FirewallGenerator";
import AutomationScriptHub from "./AutomationScriptHub";
import { 
  Youtube, 
  BookOpen, 
  Compass, 
  Globe, 
  Terminal, 
  ExternalLink, 
  Star, 
  Check, 
  TerminalSquare 
} from "lucide-react";

const accentColors = {
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    accentText: "text-emerald-300",
    badge: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25",
    checkbox: "text-emerald-500 focus:ring-emerald-500/30",
    glow: "hover:shadow-emerald-500/5 hover:border-emerald-500/40"
  },
  cyan: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    text: "text-cyan-400",
    accentText: "text-cyan-300",
    badge: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/25",
    checkbox: "text-cyan-500 focus:ring-cyan-500/30",
    glow: "hover:shadow-cyan-500/5 hover:border-cyan-500/40"
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
    accentText: "text-amber-300",
    badge: "bg-amber-500/10 text-amber-400 border border-amber-500/25",
    checkbox: "text-amber-500 focus:ring-amber-500/30",
    glow: "hover:shadow-amber-500/5 hover:border-amber-500/40"
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    text: "text-purple-400",
    accentText: "text-purple-300",
    badge: "bg-purple-500/10 text-purple-400 border border-purple-500/25",
    checkbox: "text-purple-500 focus:ring-purple-500/30",
    glow: "hover:shadow-purple-500/5 hover:border-purple-500/40"
  },
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
    accentText: "text-blue-300",
    badge: "bg-blue-500/10 text-blue-400 border border-blue-500/25",
    checkbox: "text-blue-500 focus:ring-blue-500/30",
    glow: "hover:shadow-blue-500/5 hover:border-blue-500/40"
  },
  red: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    text: "text-rose-400",
    accentText: "text-rose-300",
    badge: "bg-rose-500/10 text-rose-400 border border-rose-500/25",
    checkbox: "text-rose-500 focus:ring-rose-500/30",
    glow: "hover:shadow-rose-500/5 hover:border-rose-500/40"
  }
};

const getPlatformIcon = (platform) => {
  switch (platform.toLowerCase()) {
    case "youtube":
      return <Youtube className="w-4 h-4 text-red-550" />;
    case "coursera":
      return <BookOpen className="w-4 h-4 text-blue-450" />;
    case "cisco":
      return <Compass className="w-4 h-4 text-cyan-455" />;
    case "microsoft":
      return <Globe className="w-4 h-4 text-sky-455" />;
    default:
      return <Terminal className="w-4 h-4 text-slate-455" />;
  }
};

const RoadmapPhase = memo(function RoadmapPhase({
  phase,
  completedItems,
  starredResources,
  notebookNotes,
  activeFilter,
  toggleItem,
  togglePhaseMaster,
  toggleStar,
  updateNote
}) {
  const styles = accentColors[phase.accent] || accentColors.cyan;

  // Completion calculation for this phase
  const phaseItemIds = [
    ...phase.subtopics.map((t) => t.id),
    ...phase.resources.map((r) => r.id)
  ];
  const done = phaseItemIds.filter((id) => completedItems[id]).length;
  const total = phaseItemIds.length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;
  const isPhaseDone = percent === 100;

  // Filtering resources locally
  const filteredResources = phase.resources.filter((res) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "ar") return res.lang === "ar";
    if (activeFilter === "en") return res.lang === "en";
    if (activeFilter === "practice") return res.type === "practice";
    return true;
  });

  return (
    <section 
      id={phase.id}
      className="bg-slate-900/20 border border-slate-900 rounded-2xl p-6 flex flex-col gap-6 scroll-mt-28 relative shadow-md hover:border-slate-800 transition-all duration-300"
    >
      {/* Phase Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black font-mono text-lg shadow-lg ${styles.bg} ${styles.text}`}>
            {phase.phaseNumber}
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-100">{phase.title}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{phase.description}</p>
          </div>
        </div>

        {/* Phase Master Tracker */}
        <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-850 px-3.5 py-1.5 rounded-xl">
          <div className="flex items-center gap-2">
            <input 
              type="checkbox"
              id={`master-${phase.id}`}
              checked={isPhaseDone}
              onChange={() => togglePhaseMaster(phase)}
              className={`w-4 h-4 rounded border-slate-800 bg-slate-900 cursor-pointer focus:ring-offset-slate-950 ${styles.checkbox}`}
            />
            <label 
              htmlFor={`master-${phase.id}`}
              className="text-xs font-bold text-slate-350 cursor-pointer select-none"
            >
              تم إنجاز المرحلة
            </label>
          </div>
          <div className="w-px h-4 bg-slate-800" />
          <span className="font-mono text-xs font-semibold text-slate-400">{done}/{total}</span>
        </div>
      </div>

      {/* Sub-topics Checklist */}
      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">موضوعات الدراسة والتطبيق الأساسية:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-950/40 p-4 rounded-xl border border-slate-900/60">
          {phase.subtopics.map((topic) => {
            const isChecked = !!completedItems[topic.id];
            return (
              <div 
                key={topic.id}
                onClick={() => toggleItem(topic.id)}
                className={`flex items-center gap-3 p-2 rounded-lg border transition-all cursor-pointer ${
                  isChecked 
                    ? "bg-slate-900/40 border-slate-800/80 text-slate-300" 
                    : "bg-transparent border-slate-900 hover:border-slate-850 text-slate-400 hover:text-slate-300"
                }`}
              >
                <input 
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {}} 
                  className={`w-4 h-4 rounded border-slate-850 bg-slate-950 cursor-pointer focus:ring-offset-slate-950 ${styles.checkbox}`}
                />
                <span className={`text-xs font-semibold ${isChecked ? "line-through opacity-50" : ""}`}>
                  {topic.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subnet Calculator widget in networking phase */}
      {phase.id === "networks" && (
        <div className="my-1">
          <SubnetCalculator />
        </div>
      )}

      {/* RAID Calculator widget in virtualization phase */}
      {phase.id === "virtualization" && (
        <div className="my-1">
          <RaidCalculator />
        </div>
      )}

      {/* Firewall Generator widget in security phase */}
      {phase.id === "security" && (
        <div className="my-1">
          <FirewallGenerator />
        </div>
      )}

      {/* Automation script hub in scripting phase */}
      {phase.id === "specialization" && (
        <div className="my-1">
          <AutomationScriptHub />
        </div>
      )}

      {/* Learning Resources Preview Cards */}
      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">روابط ومصادر التعلم المعتمدة (عربي / إنجليزي):</h4>
        {filteredResources.length === 0 ? (
          <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-4 text-center text-xs text-slate-500">
            لا توجد مصادر دراسية تطابق خيار التصفية المختار.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResources.map((res) => {
              const isChecked = !!completedItems[res.id];
              return (
                <div 
                  key={res.id}
                  className={`flex flex-col justify-between border bg-slate-950/60 p-4 rounded-xl transition-all duration-300 relative group ${
                    isChecked 
                      ? "border-emerald-500/20 shadow-lg shadow-emerald-950/5" 
                      : "border-slate-850 hover:border-slate-700"
                  } ${styles.glow} hover:scale-[1.02]`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                        res.type === "practice" 
                          ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" 
                          : res.type === "course"
                          ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                          : "bg-slate-900 text-slate-400 border border-slate-850"
                      }`}>
                        {res.type === "practice" ? "عملي" : res.type === "course" ? "كورس" : "فيديو"}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        res.lang === "ar" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                      }`}>
                        {res.lang === "ar" ? "عربي 🇪🇬" : "إنجليزي 🇬🇧"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => toggleStar(res.id)}
                        className="p-1 rounded hover:bg-slate-900 text-slate-500 hover:text-amber-400 transition-colors cursor-pointer"
                        title="إضافة للمفضلة"
                      >
                        <Star className={`w-3.5 h-3.5 ${starredResources.includes(res.id) ? "fill-amber-400 text-amber-400" : ""}`} />
                      </button>
                      <button 
                        onClick={() => toggleItem(res.id)}
                        className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                          isChecked 
                            ? "bg-emerald-500 border-emerald-500 text-slate-950" 
                            : "border-slate-750 bg-slate-900/60 text-transparent hover:border-slate-650"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h5 className="font-extrabold text-sm text-slate-100 group-hover:text-cyan-400 transition-colors line-clamp-1">
                      {res.title}
                    </h5>
                    <div className="flex items-center gap-1 text-[11px] text-slate-450 font-semibold mt-1">
                      {getPlatformIcon(res.platform)}
                      <span>{res.platform}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mt-2 line-clamp-2">
                      {res.desc}
                    </p>
                  </div>

                  <div className="border-t border-slate-900 pt-3 flex justify-between items-center mt-auto">
                    <span className="text-[10px] text-slate-500 font-medium">خطوات المذاكرة</span>
                    <a 
                      href={res.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                    >
                      <span>زيارة المصدر</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Practical Lab Projects Block */}
      {phase.projects && phase.projects.length > 0 && (
        <div className="bg-slate-950/60 border border-amber-500/10 rounded-xl p-4 flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-amber-400 font-extrabold text-xs">
            <TerminalSquare className="w-4.5 h-4.5 text-amber-500" />
            <span>المشاريع والمختبرات التطبيقية (Practical Labs & Projects):</span>
          </div>
          <ul className="list-disc list-inside space-y-1">
            {phase.projects.map((proj, idx) => (
              <li key={idx} className="text-xs text-slate-350 leading-relaxed font-semibold pr-2">
                {proj}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Personal Notebook per Phase */}
      <div className="mt-4 border-t border-slate-900/60 pt-4">
        <details className="group">
          <summary className="flex items-center justify-between text-xs font-extrabold text-slate-400 hover:text-slate-200 cursor-pointer select-none">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>📝 ملاحظاتي الشخصية للمرحلة</span>
            </div>
            <span className="text-[10px] text-slate-500 font-bold group-open:hidden">عرض ▽</span>
            <span className="text-[10px] text-slate-500 font-bold hidden group-open:inline">إخفاء △</span>
          </summary>
          <div className="mt-3 flex flex-col gap-2">
            <textarea
              className="w-full bg-slate-950 border border-slate-850 rounded-xl p-3 text-xs text-slate-350 placeholder-slate-650 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 font-mono leading-relaxed"
              rows="3"
              placeholder="اكتب هنا ملخصك للمرحلة، أو الأوامر الهامة التي تريد تدوينها..."
              value={notebookNotes[phase.id] || ""}
              onChange={(e) => updateNote(phase.id, e.target.value)}
            />
            <div className="flex justify-between items-center text-[10px] text-slate-500">
              <span>تم الحفظ تلقائياً في المتصفح</span>
              <span>{(notebookNotes[phase.id] || "").length} حرف</span>
            </div>
          </div>
        </details>
      </div>
    </section>
  );
}, (prevProps, nextProps) => {
  // 1. Check if the phase itself is the same reference
  if (prevProps.phase !== nextProps.phase) return false;
  
  // 2. Check if activeFilter changed
  if (prevProps.activeFilter !== nextProps.activeFilter) return false;
  
  // 3. Check if the notebook note for this phase changed
  const prevNote = prevProps.notebookNotes[prevProps.phase.id] || "";
  const nextNote = nextProps.notebookNotes[nextProps.phase.id] || "";
  if (prevNote !== nextNote) return false;
  
  // 4. Check if starred status of any resource in this phase changed
  const phaseResourceIds = prevProps.phase.resources.map(r => r.id);
  
  // Check if any individual resource in this phase had its starred status toggled
  for (const resId of phaseResourceIds) {
    const wasStarred = prevProps.starredResources.includes(resId);
    const isStarred = nextProps.starredResources.includes(resId);
    if (wasStarred !== isStarred) return false;
  }
  
  // 5. Check if completion status of any subtopic or resource in this phase changed
  const phaseCheckboxes = [...prevProps.phase.subtopics.map(t => t.id), ...phaseResourceIds];
  for (const id of phaseCheckboxes) {
    if (!!prevProps.completedItems[id] !== !!nextProps.completedItems[id]) {
      return false;
    }
  }
  
  // If all are equal, skip re-render!
  return true;
});

export default RoadmapPhase;

import React, { useState, useEffect, useRef } from "react";
import { 
  roadmapData, 
  toolsData, 
  cheatSheetsData 
} from "./data/roadmapData";
import SubnetCalculator from "./components/SubnetCalculator";
import AutomationScriptHub from "./components/AutomationScriptHub";
import { 
  Trophy, 
  Youtube, 
  BookOpen, 
  ExternalLink, 
  Search, 
  CheckCircle, 
  Lock, 
  Menu, 
  X, 
  Upload, 
  Download, 
  Terminal, 
  Check, 
  Trash2, 
  ChevronRight, 
  Compass, 
  Briefcase, 
  Book,
  Wrench,
  Award,
  Globe,
  MonitorPlay,
  RotateCcw
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

export default function App() {
  const [completedItems, setCompletedItems] = useState(() => {
    const saved = localStorage.getItem("it_ninja_completed");
    return saved ? JSON.parse(saved) : {};
  });

  const [certProgress, setCertProgress] = useState(() => {
    const saved = localStorage.getItem("it_ninja_certs");
    return saved ? JSON.parse(saved) : { ccna: 0, linux: 0, security: 0, cloud: 0 };
  });

  const [activeFilter, setActiveFilter] = useState("all");
  const [cheatSearch, setCheatSearch] = useState("");
  const [cheatCategory, setCheatCategory] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState("");

  const sectionRefs = useRef({});

  useEffect(() => {
    localStorage.setItem("it_ninja_completed", JSON.stringify(completedItems));
  }, [completedItems]);

  useEffect(() => {
    localStorage.setItem("it_ninja_certs", JSON.stringify(certProgress));
  }, [certProgress]);

  // Compute Total Checkboxes and Progress
  const allCheckboxIds = [];
  roadmapData.forEach((phase) => {
    phase.subtopics.forEach((topic) => allCheckboxIds.push(topic.id));
    phase.resources.forEach((res) => allCheckboxIds.push(res.id));
  });

  const totalCheckboxes = allCheckboxIds.length;
  const completedCount = allCheckboxIds.filter((id) => completedItems[id]).length;
  const globalProgressPercent = totalCheckboxes > 0 ? Math.round((completedCount / totalCheckboxes) * 100) : 0;

  // Toggle item status
  const toggleItem = (id) => {
    setCompletedItems((prev) => {
      const updated = { ...prev };
      if (updated[id]) {
        delete updated[id];
      } else {
        updated[id] = true;
      }
      return updated;
    });
  };

  // Toggle all items in a phase (Master state)
  const isPhaseCompleted = (phase) => {
    const phaseItemIds = [
      ...phase.subtopics.map((t) => t.id),
      ...phase.resources.map((r) => r.id)
    ];
    return phaseItemIds.every((id) => completedItems[id]);
  };

  const togglePhaseMaster = (phase) => {
    const phaseItemIds = [
      ...phase.subtopics.map((t) => t.id),
      ...phase.resources.map((r) => r.id)
    ];
    const isCompleted = isPhaseCompleted(phase);

    setCompletedItems((prev) => {
      const updated = { ...prev };
      phaseItemIds.forEach((id) => {
        if (isCompleted) {
          delete updated[id];
        } else {
          updated[id] = true;
        }
      });
      return updated;
    });
  };

  const getPhaseCompletionStats = (phase) => {
    const ids = [
      ...phase.subtopics.map((t) => t.id),
      ...phase.resources.map((r) => r.id)
    ];
    const done = ids.filter((id) => completedItems[id]).length;
    const total = ids.length;
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;
    return { done, total, percent };
  };

  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setSidebarOpen(false);
  };

  // Filters logic
  const filterResource = (res) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "ar") return res.lang === "ar";
    if (activeFilter === "en") return res.lang === "en";
    if (activeFilter === "practice") return res.type === "practice";
    return true;
  };

  // Cert progress helper
  const handleCertChange = (key, value) => {
    setCertProgress((prev) => ({
      ...prev,
      [key]: Math.min(100, Math.max(0, value))
    }));
  };

  const resetAllProgress = () => {
    if (window.confirm("هل أنت متأكد من رغبتك في إعادة تعيين كافة خطوات التقدم والمذاكرة؟")) {
      setCompletedItems({});
      setCertProgress({ ccna: 0, linux: 0, security: 0, cloud: 0 });
    }
  };

  const exportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify({ completedItems, certProgress })
    );
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "it_ninja_backup.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.completedItems) setCompletedItems(parsed.completedItems);
        if (parsed.certProgress) setCertProgress(parsed.certProgress);
        alert("تم استيراد النسخة الاحتياطية بنجاح!");
      } catch (err) {
        alert("ملف النسخة الاحتياطية غير صالح.");
      }
    };
    reader.readAsText(file);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCommand(text);
    setTimeout(() => setCopiedCommand(""), 2000);
  };

  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case "youtube":
        return <Youtube className="w-4 h-4 text-red-500" />;
      case "coursera":
        return <BookOpen className="w-4 h-4 text-blue-400" />;
      case "cisco":
        return <Compass className="w-4 h-4 text-cyan-400" />;
      case "microsoft":
        return <Globe className="w-4 h-4 text-sky-400" />;
      default:
        return <Terminal className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      
      {/* Sticky Progress & Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        {/* Progress Bar */}
        <div className="w-full bg-slate-900 h-1.5 relative overflow-hidden">
          <div 
            className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-amber-500 h-full transition-all duration-500 ease-out"
            style={{ width: `${globalProgressPercent}%` }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg focus:outline-none"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-slate-950 text-lg shadow-md shadow-emerald-500/20">IT</span>
              <h1 className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">IT Ninja</h1>
            </div>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-900 border border-slate-800 text-slate-400">
              Roadmap Dashboard
            </span>
          </div>

          {/* Quick Global Stats */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold block">إجمالي الإنجاز</span>
              <span className="font-mono text-sm text-emerald-400 font-bold">{globalProgressPercent}%</span>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold block">المهام المكتملة</span>
              <span className="font-mono text-sm text-slate-200 font-bold">{completedCount}/{totalCheckboxes}</span>
            </div>
          </div>
        </div>

        {/* Quick Filters Sticky sub-bar */}
        <div className="bg-slate-900/60 border-t border-slate-900 py-2.5 px-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
              <span className="text-xs text-slate-400 font-bold flex-shrink-0">تصفية المصادر:</span>
              <button 
                onClick={() => setActiveFilter("all")}
                className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                  activeFilter === "all" 
                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-md" 
                    : "border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                الكل (All)
              </button>
              <button 
                onClick={() => setActiveFilter("ar")}
                className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                  activeFilter === "ar" 
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-md" 
                    : "border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                عربي فقط (Arabic Only)
              </button>
              <button 
                onClick={() => setActiveFilter("en")}
                className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                  activeFilter === "en" 
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-md" 
                    : "border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                إنجليزي فقط (English Only)
              </button>
              <button 
                onClick={() => setActiveFilter("practice")}
                className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                  activeFilter === "practice" 
                    ? "bg-purple-500/10 border-purple-500/30 text-purple-400 shadow-md" 
                    : "border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                معامل تطبيقية (Practice Labs)
              </button>
            </div>

            {/* Backup actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button 
                onClick={exportBackup}
                title="تصدير نسخة احتياطية من التقدم"
                className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>حفظ التقدم</span>
              </button>
              <label 
                title="استيراد نسخة احتياطية من التقدم"
                className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>رفع التقدم</span>
                <input type="file" accept=".json" onChange={importBackup} className="hidden" />
              </label>
              <button 
                onClick={resetAllProgress}
                title="إعادة تعيين كافة التقدم"
                className="text-xs px-2 py-1.5 rounded-lg border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="flex-grow flex w-full max-w-7xl mx-auto px-4 py-6 gap-6 relative">
        
        {/* Sidebar Navigation */}
        <aside className={`
          fixed inset-y-0 right-0 z-50 w-72 bg-slate-950 border-l border-slate-900 p-5 transform transition-transform duration-300 ease-in-out lg:relative lg:inset-auto lg:transform-none lg:w-64 lg:p-0 lg:border-l-0 lg:z-auto
          ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
        `}>
          <div className="sticky top-40 flex flex-col gap-4">
            <div className="flex items-center justify-between lg:hidden border-b border-slate-900 pb-3 mb-2">
              <span className="font-bold text-slate-400 text-sm">مراحل خريطة الطريق</span>
              <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="flex flex-col gap-1.5 max-h-[75vh] overflow-y-auto pr-1">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2 pr-2">أقسام الخطة الدراسية</div>
              {roadmapData.map((phase) => {
                const { percent } = getPhaseCompletionStats(phase);
                const isDone = percent === 100;
                
                return (
                  <button 
                    key={phase.id}
                    onClick={() => handleScrollTo(phase.id)}
                    className="flex flex-col gap-1 text-right p-2.5 rounded-lg border border-transparent hover:bg-slate-900/60 hover:border-slate-800 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                          isDone 
                            ? "bg-emerald-500/20 text-emerald-300" 
                            : "bg-slate-900 text-slate-400"
                        }`}>
                          {phase.phaseNumber}
                        </span>
                        <span className="text-xs font-bold text-slate-300 group-hover:text-cyan-400 transition-colors">
                          {phase.id === "itbasics" ? "أساسيات الـ IT" : phase.id === "networks" ? "الشبكات" : phase.id === "linux" ? "خوادم لينكس" : phase.id === "windows" ? "خوادم ويندوز" : phase.id === "virtualization" ? "الافتراضية" : phase.id === "security" ? "الأمن السيبراني" : phase.id === "specialization" ? "الأتمتة والسحابة" : phase.id === "kubernetes" ? "Kubernetes" : phase.id === "gitops" ? "GitOps & IaC" : phase.id === "sre" ? "SRE" : "Zero Trust"}
                        </span>
                      </div>
                      
                      {isDone ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <span className="font-mono text-[10px] text-slate-500">{percent}%</span>
                      )}
                    </div>
                    {/* Small progress line */}
                    <div className="w-full bg-slate-900 h-0.5 rounded-full mt-1.5 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          isDone ? "bg-emerald-400" : "bg-cyan-500"
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </button>
                );
              })}
              
              <div className="w-full h-px bg-slate-900 my-3" />
              
              <button 
                onClick={() => handleScrollTo("tools")}
                className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-slate-900 text-slate-300 hover:text-slate-100 text-right cursor-pointer text-xs font-bold"
              >
                <Wrench className="w-4 h-4 text-slate-400" />
                <span>أدوات مهندس السيرفرات المرجعية</span>
              </button>
              
              <button 
                onClick={() => handleScrollTo("certifications")}
                className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-slate-900 text-slate-300 hover:text-slate-100 text-right cursor-pointer text-xs font-bold"
              >
                <Award className="w-4 h-4 text-slate-400" />
                <span>متتبع الشهادات المهنية العالمية</span>
              </button>

              <button 
                onClick={() => handleScrollTo("courses-hub")}
                className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-slate-900 text-slate-300 hover:text-slate-100 text-right cursor-pointer text-xs font-bold"
              >
                <Book className="w-4 h-4 text-slate-400" />
                <span>جدول المسارات والمصادر الشامل</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-grow w-full lg:max-w-[calc(100%-17rem)] flex flex-col gap-10">
          
          {/* Dashboard Intro Hero Card */}
          <section className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full filter blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full filter blur-3xl pointer-events-none" />
            
            <div className="flex flex-col gap-3 relative z-10">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400 animate-bounce" />
                <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest">توجيهات ومحاكاة مدمجة</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black leading-tight bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                الخطة التفاعلية المهنية لمهندس السيرفرات والشبكات
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-3xl">
                مرحباً بك يا بطل! هذا لوحة التحكم التفاعلية المخصصة لتتبع تقدمك المذاكرة والتطبيق العملي. يمكنك وضع علامة صح على كل موضوع فرعي أو كورس تنهيه لحساب نسبة تقدمك تلقائياً والوصول فوراً إلى أفضل الروابط التعليمية المباشرة الموثوقة.
              </p>
            </div>
          </section>

          {/* Curriculum Phases */}
          {roadmapData.map((phase) => {
            const styles = accentColors[phase.accent] || accentColors.cyan;
            const { done, total, percent } = getPhaseCompletionStats(phase);
            const isPhaseDone = percent === 100;
            const filteredResources = phase.resources.filter(filterResource);

            return (
              <section 
                key={phase.id} 
                id={phase.id}
                className="bg-slate-900/30 border border-slate-900 rounded-2xl p-6 flex flex-col gap-6 scroll-mt-28 relative shadow-lg hover:border-slate-850 transition-all duration-300"
              >
                
                {/* Phase Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black font-mono text-lg shadow-lg ${styles.bg} ${styles.text}`}>
                      {phase.phaseNumber}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-lg text-slate-100">{phase.title}</h3>
                      <p className="text-xs text-slate-400">{phase.description}</p>
                    </div>
                  </div>

                  {/* Phase Master Tracker */}
                  <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-850 px-4 py-2 rounded-xl">
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox"
                        id={`master-${phase.id}`}
                        checked={isPhaseDone}
                        onChange={() => togglePhaseMaster(phase)}
                        className={`w-4.5 h-4.5 rounded border-slate-800 bg-slate-900 cursor-pointer focus:ring-offset-slate-950 ${styles.checkbox}`}
                      />
                      <label 
                        htmlFor={`master-${phase.id}`}
                        className="text-xs font-bold text-slate-300 cursor-pointer select-none"
                      >
                        اكتمال المرحلة
                      </label>
                    </div>
                    <div className="w-px h-5 bg-slate-800" />
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
                          className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all cursor-pointer ${
                            isChecked 
                              ? "bg-slate-900/40 border-slate-800/80 text-slate-300" 
                              : "bg-transparent border-slate-900 hover:border-slate-800 text-slate-400 hover:text-slate-350"
                          }`}
                        >
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}} // Controlled via parent click
                            className={`w-4 h-4 rounded border-slate-800 bg-slate-950 cursor-pointer focus:ring-offset-slate-950 ${styles.checkbox}`}
                          />
                          <span className={`text-xs font-medium ${isChecked ? "line-through opacity-60" : ""}`}>
                            {topic.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Embedded Widget logic if networking section */}
                {phase.id === "networks" && (
                  <div className="my-2">
                    <SubnetCalculator />
                  </div>
                )}

                {/* Embedded Automation Script Hub inside Advancement section */}
                {phase.id === "specialization" && (
                  <div className="my-2">
                    <AutomationScriptHub />
                  </div>
                )}

                {/* Learning Resources Preview Cards */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">أهم المصادر التعليمية والمختبرات المقترحة:</h4>
                  {filteredResources.length === 0 ? (
                    <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-6 text-center text-xs text-slate-500">
                      لا توجد مصادر دراسية تطابق خيار التصفية المختار.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredResources.map((res) => {
                        const isChecked = !!completedItems[res.id];
                        return (
                          <div 
                            key={res.id}
                            className={`flex flex-col justify-between border bg-slate-950/60 p-4.5 rounded-xl transition-all duration-300 relative group ${
                              isChecked 
                                ? "border-emerald-500/20 shadow-lg shadow-emerald-950/5" 
                                : "border-slate-850 hover:border-slate-700"
                            } ${styles.glow} hover:scale-[1.02]`}
                          >
                            <div className="flex items-start justify-between gap-3 mb-2">
                              {/* Platforms & Badges */}
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                                  res.type === "practice" 
                                    ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" 
                                    : res.type === "course"
                                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                                    : "bg-slate-900 text-slate-400 border border-slate-850"
                                }`}>
                                  {res.type === "practice" ? "معمل عملي" : res.type === "course" ? "شهادة/كورس" : res.type === "doc" ? "توثيق" : "فيديو"}
                                </span>
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                  res.lang === "ar" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                                }`}>
                                  {res.lang === "ar" ? "عربي 🇪🇬" : "إنجليزي 🇬🇧"}
                                </span>
                              </div>

                              {/* Card Checkbox */}
                              <button 
                                onClick={() => toggleItem(res.id)}
                                className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                                  isChecked 
                                    ? "bg-emerald-500 border-emerald-500 text-slate-950" 
                                    : "border-slate-700 bg-slate-900/60 text-transparent hover:border-slate-500"
                                }`}
                              >
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </button>
                            </div>

                            <div className="mb-4">
                              <h5 className="font-extrabold text-sm text-slate-100 group-hover:text-cyan-400 transition-colors line-clamp-1">
                                {res.title}
                              </h5>
                              <div className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold mt-1">
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
                                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
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
              </section>
            );
          })}

          {/* Cheat Sheets and Command Finder */}
          <section 
            id="tools" 
            className="bg-slate-900/30 border border-slate-900 rounded-2xl p-6 flex flex-col gap-6 scroll-mt-28"
          >
            <div className="border-b border-slate-800 pb-4">
              <h3 className="font-extrabold text-lg text-slate-100 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-purple-400" />
                مستودع بطاقات الأوامر السريعة والبحث الذكي (Cheat Sheets)
              </h3>
              <p className="text-xs text-slate-400">
                ابحث بشكل فوري وسريع عن الأكواد والسطور البرمجية المستخدمة في إدارة الأنظمة والشبكات.
              </p>
            </div>

            {/* Search and Category Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <input 
                  type="text" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-10 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20"
                  placeholder="ابحث عن أمر أو دالة (vlan, chmod, ip, Active Directory)..."
                  value={cheatSearch}
                  onChange={(e) => setCheatSearch(e.target.value)}
                />
                <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
              </div>
              
              <div className="flex gap-1 overflow-x-auto">
                {["all", "cisco", "linux", "powershell"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCheatCategory(cat)}
                    className={`text-xs px-3.5 py-2 rounded-xl font-bold uppercase transition-all ${
                      cheatCategory === cat
                        ? "bg-purple-500/10 border border-purple-500/30 text-purple-400 shadow-md"
                        : "bg-slate-950 border border-slate-900 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {cat === "all" ? "الكل" : cat === "cisco" ? "Cisco IOS" : cat === "linux" ? "Linux CLI" : "PowerShell"}
                  </button>
                ))}
              </div>
            </div>

            {/* Commands Table */}
            <div className="bg-slate-950 border border-slate-900 rounded-xl overflow-hidden">
              <div className="max-h-[300px] overflow-y-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-900/80 text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-850">
                      <th className="p-3 text-right">القسم</th>
                      <th className="p-3 text-right">الأمر (Command)</th>
                      <th className="p-3 text-right">الوصف الفني والوظيفة</th>
                      <th className="p-3 text-center w-24">إجراء</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cheatSheetsData
                      .filter((item) => {
                        const matchesCategory = cheatCategory === "all" || item.category === cheatCategory;
                        const matchesSearch = item.command.toLowerCase().includes(cheatSearch.toLowerCase()) || 
                                              item.desc.includes(cheatSearch);
                        return matchesCategory && matchesSearch;
                      })
                      .map((item, idx) => (
                        <tr 
                          key={idx} 
                          className="text-xs border-b border-slate-900/60 hover:bg-slate-900/30 transition-colors"
                        >
                          <td className="p-3 font-semibold text-slate-400">
                            {item.category === "cisco" ? "Cisco IOS" : item.category === "linux" ? "Linux" : "PowerShell"}
                          </td>
                          <td className="p-3 font-mono text-purple-400 font-bold select-all text-left" dir="ltr">
                            {item.command}
                          </td>
                          <td className="p-3 text-slate-300 leading-relaxed">
                            {item.desc}
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => copyToClipboard(item.command)}
                              className="text-[10px] font-bold px-2 py-1 rounded bg-slate-900 hover:bg-purple-500/10 border border-slate-800 hover:border-purple-500/30 text-slate-400 hover:text-purple-400 transition-all cursor-pointer"
                            >
                              {copiedCommand === item.command ? "تم النسخ!" : "نسخ الأمر"}
                            </button>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>

            {/* Essential Tools list */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">الأدوات والبرامج الأساسية لمحاكاة وإدارة السيرفرات والشبكات:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {toolsData.map((tool, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-900 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-extrabold text-sm text-slate-200">{tool.name}</span>
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                          tool.type === "local" ? "bg-cyan-500/10 text-cyan-400" : "bg-emerald-500/10 text-emerald-400"
                        }`}>
                          {tool.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4">{tool.desc}</p>
                    </div>
                    <div className="border-t border-slate-900 pt-3 flex justify-end">
                      <a 
                        href={tool.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                      >
                        <span>تحميل / زيارة</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Certifications Tracker */}
          <section 
            id="certifications" 
            className="bg-slate-900/30 border border-slate-900 rounded-2xl p-6 flex flex-col gap-6 scroll-mt-28"
          >
            <div className="border-b border-slate-800 pb-4">
              <h3 className="font-extrabold text-lg text-slate-100 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                متتبع الشهادات المهنية العالمية (IT Certifications Track)
              </h3>
              <p className="text-xs text-slate-400">
                راقب مدى استعدادك وجاهزيتك للتقدم للاختبارات الدولية بناءً على معدل دراستك للمنهج.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { key: "ccna", name: "Cisco CCNA 200-301", color: "cyan" },
                { key: "linux", name: "CompTIA Linux+", color: "amber" },
                { key: "security", name: "CompTIA Security+", color: "red" },
                { key: "cloud", name: "AWS Cloud Practitioner", color: "emerald" }
              ].map((cert) => {
                const styles = accentColors[cert.color];
                return (
                  <div key={cert.key} className="bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col gap-3 shadow-md">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-extrabold text-slate-200">{cert.name}</span>
                      <span className={`text-[10px] font-bold ${styles.text}`}>نسبة الجاهزية</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        step="5"
                        value={certProgress[cert.key]}
                        onChange={(e) => handleCertChange(cert.key, parseInt(e.target.value, 10))}
                        className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                      />
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-900 pt-2.5 mt-1.5">
                      <span className="font-mono text-sm text-slate-300 font-bold">{certProgress[cert.key]}%</span>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => handleCertChange(cert.key, certProgress[cert.key] + 10)}
                          className="px-2 py-0.5 rounded bg-slate-900 border border-slate-850 text-[10px] text-slate-400 hover:text-white"
                        >
                          +10%
                        </button>
                        <button 
                          onClick={() => handleCertChange(cert.key, 0)}
                          className="px-2 py-0.5 rounded bg-slate-900 border border-slate-850 text-[10px] text-rose-500 hover:bg-rose-500/10"
                        >
                          تصفير
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Course list table - "جدول المسارات والمصادر الشامل" */}
          <section 
            id="courses-hub" 
            className="bg-slate-900/30 border border-slate-900 rounded-2xl p-6 flex flex-col gap-6 scroll-mt-28"
          >
            <div className="border-b border-slate-800 pb-4">
              <h3 className="font-extrabold text-lg text-slate-100 flex items-center gap-2">
                <Book className="w-5 h-5 text-emerald-400" />
                جدول المسارات والمصادر الشامل (Courses & Path Hub)
              </h3>
              <p className="text-xs text-slate-400">
                مرجع كامل ومهيكل لجميع الكورسات والروابط المقترحة في خطة الطريق.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-900 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-900 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-850">
                      <th className="p-3.5 text-right w-28">المرحلة</th>
                      <th className="p-3.5 text-right">المصدر / الكورس</th>
                      <th className="p-3.5 text-right">اللغة</th>
                      <th className="p-3.5 text-right">الفائدة والوصف</th>
                      <th className="p-3.5 text-center w-28">الحالة</th>
                      <th className="p-3.5 text-center w-28">الرابط</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roadmapData.map((phase) => {
                      return phase.resources.map((res) => {
                        const isChecked = !!completedItems[res.id];
                        return (
                          <tr 
                            key={res.id} 
                            className="text-xs border-b border-slate-900/60 hover:bg-slate-900/20 transition-colors"
                          >
                            <td className="p-3 font-semibold text-slate-400">
                              {phase.title.split(":")[0]}
                            </td>
                            <td className="p-3 font-bold text-slate-200">
                              {res.title}
                            </td>
                            <td className="p-3">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                res.lang === "ar" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                              }`}>
                                {res.lang === "ar" ? "عربي 🇪🇬" : "إنجليزي 🇬🇧"}
                              </span>
                            </td>
                            <td className="p-3 text-slate-450 leading-relaxed max-w-sm line-clamp-2">
                              {res.desc}
                            </td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => toggleItem(res.id)}
                                className={`text-[10px] px-2 py-1 rounded border font-semibold transition-all cursor-pointer ${
                                  isChecked 
                                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                                    : "bg-slate-900 border-slate-850 text-slate-500"
                                }`}
                              >
                                {isChecked ? "✅ مكتمل" : "⏳ غير مكتمل"}
                              </button>
                            </td>
                            <td className="p-3 text-center">
                              <a 
                                href={res.url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center justify-center gap-1"
                              >
                                <span>الكورس</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </td>
                          </tr>
                        );
                      });
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

        </main>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 mt-16 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 IT Ninja Career Roadmap. تصميم وتطوير احترافي تفاعلي بالكامل.</p>
          <div className="flex items-center gap-4">
            <span className="text-[10px] bg-slate-900 border border-slate-850 px-2 py-0.5 rounded text-slate-400 font-bold">V2.0 React Edition</span>
            <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-emerald-400 font-bold">Tailwind v4 Powered</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

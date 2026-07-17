import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Terminal, Layers, FileCode, CheckCircle2,
  FolderPlus, GitMerge, Box, Database, Sparkles, Play
} from "lucide-react";

const COMMANDS_DATA = [
  // Linux Category
  {
    cmd: "mkdir projects",
    category: "linux",
    desc: "إنشاء مجلد (Directory) جديد باسم projects في مسار العمل الحالي.",
    visType: "folder",
    effectDesc: "📁 تم إنشاء مجلد جديد باسم projects في نظام الملفات.",
    effectNode: { name: "projects", type: "folder" }
  },
  {
    cmd: "touch app.js",
    category: "linux",
    desc: "إنشاء ملف فارغ جديد باسم app.js في مكان العمل الحالي.",
    visType: "file",
    effectDesc: "📄 تم إنشاء ملف فارغ جديد باسم app.js.",
    effectNode: { name: "app.js", type: "file" }
  },
  // Git Category
  {
    cmd: "git commit -m 'initial'",
    category: "git",
    desc: "حفظ التغييرات المسجلة (Staged) في كبسولة زمنية (Commit) جديدة في تاريخ المشروع.",
    visType: "commit",
    effectDesc: "🟢 تم إنشاء Commit جديدة برقم هاش عشوائي مضاف لشجرة المشروع.",
    effectNode: { name: "Commit [8f3a9d]", type: "commit" }
  },
  // Docker Category
  {
    cmd: "docker run -d nginx",
    category: "docker",
    desc: "تحميل وتشغيل خادم Nginx داخل حاوية (Container) معزولة في الخلفية.",
    visType: "container",
    effectDesc: "🐳 تم تشغيل حاوية Docker جديدة لخادم Nginx في الخلفية.",
    effectNode: { name: "Nginx Container (Running)", type: "container" }
  },
  // SQL Category
  {
    cmd: "SELECT * FROM users",
    category: "sql",
    desc: "جلب واسترجاع كافة صفوف وسجلات المستخدمين من جدول users بقاعدة البيانات.",
    visType: "table",
    effectDesc: "🗄️ تم الاستعلام واستعادة جدول المستخدمين من قاعدة البيانات.",
    effectNode: { name: "Table Users (3 rows)", type: "table" }
  }
];

export default function CommandVisualizer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedCmd, setSelectedCmd] = useState(COMMANDS_DATA[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState(["🖥️ جاهز لتشغيل محاكاة الأوامر..."]);
  const [visNodes, setVisNodes] = useState([]);

  const filteredCommands = COMMANDS_DATA.filter(item => {
    const matchesSearch = item.cmd.toLowerCase().includes(searchQuery.toLowerCase()) 
      || item.desc.includes(searchQuery);
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const runCommand = async () => {
    if (isRunning) return;
    setIsRunning(true);
    
    setTerminalOutput(prev => [...prev, `$ ${selectedCmd.cmd}`]);
    await new Promise(resolve => setTimeout(resolve, 1200));

    setTerminalOutput(prev => [
      ...prev,
      selectedCmd.effectDesc,
      `✅ تمت العملية بنجاح.`
    ]);

    // Add node to visual canvas
    setVisNodes(prev => {
      // Keep only last 3 nodes to prevent clutter
      const current = [...prev, selectedCmd.effectNode];
      if (current.length > 3) current.shift();
      return current;
    });

    setIsRunning(false);
  };

  return (
    <div id="command-visualizer" className="glass-card rounded-2xl p-6 flex flex-col gap-6 shadow-lg text-right scroll-mt-28">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 flex justify-between items-center flex-row-reverse flex-wrap gap-2">
        <div>
          <h3 className="font-extrabold text-sm text-slate-100 flex items-center justify-start gap-2 flex-row-reverse">
            <Terminal className="w-5 h-5 text-purple-400" />
            المعجم الرسومي التفاعلي للأوامر (Command Visualizer Hub)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            ابحث في الأوامر الأساسية لـ Linux, Git, Docker, SQL وشاهد تأثيرها الفوري كأشكال متحركة.
          </p>
        </div>

        {/* Categories toggler */}
        <div className="flex gap-1.5 flex-row-reverse">
          {["all", "linux", "git", "docker", "sql"].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[9px] font-black cursor-pointer uppercase transition-all ${
                activeCategory === cat 
                  ? "bg-purple-500 text-slate-950" 
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              {cat === "all" ? "الكل" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Commands List & Search */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="ابحث عن أمر..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-100 outline-none focus:border-purple-500/50 text-right"
            />
          </div>

          {/* List box */}
          <div className="bg-slate-950/60 border border-slate-850 rounded-xl p-2.5 h-64 overflow-y-auto flex flex-col gap-1.5">
            {filteredCommands.length > 0 ? (
              filteredCommands.map(item => (
                <button
                  key={item.cmd}
                  onClick={() => {
                    setSelectedCmd(item);
                    setVisNodes([]);
                  }}
                  className={`p-2.5 rounded-xl border text-right transition-all flex flex-col gap-1 cursor-pointer ${
                    selectedCmd.cmd === item.cmd
                      ? "bg-purple-500/10 border-purple-500/35 text-purple-400 font-bold"
                      : "bg-slate-900/40 border-slate-850 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span className="text-[10px] font-mono text-left leading-none" style={{ direction: "ltr" }}>
                    {item.cmd}
                  </span>
                  <span className="text-[8px] opacity-75">{item.desc.substring(0, 45)}...</span>
                </button>
              ))
            ) : (
              <div className="text-center text-[10px] text-slate-500 my-auto">لا توجد أوامر متطابقة.</div>
            )}
          </div>
        </div>

        {/* Right: Visual simulator */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Visual Effect Canvas */}
          <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col justify-between h-80 relative overflow-hidden">
            <div className="absolute inset-0 bg-radial-gradient from-purple-500/5 to-transparent pointer-events-none" />

            <div className="text-right z-10">
              <span className="text-[10px] text-slate-500 font-extrabold block">محاكاة التأثير الرسومي (Visual Effect)</span>
              <span className="text-xs font-black text-slate-200 block mt-1">{selectedCmd.cmd}</span>
            </div>

            {/* Nodes representation */}
            <div className="flex gap-4 items-center justify-center flex-wrap my-auto z-10 w-full">
              <AnimatePresence>
                {visNodes.map((node, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl flex flex-col items-center justify-center gap-1.5 w-24"
                  >
                    {node.type === "folder" && <FolderPlus className="w-5 h-5 text-purple-400" />}
                    {node.type === "file" && <FileCode className="w-5 h-5 text-purple-400" />}
                    {node.type === "commit" && <GitMerge className="w-5 h-5 text-purple-400" />}
                    {node.type === "container" && <Box className="w-5 h-5 text-purple-400" />}
                    {node.type === "table" && <Database className="w-5 h-5 text-purple-400" />}

                    <span className="text-[8px] font-black text-center text-slate-300 truncate w-full">{node.name}</span>
                  </motion.div>
                ))}
              </AnimatePresence>

              {visNodes.length === 0 && (
                <div className="text-[10px] text-slate-500 text-center font-medium my-auto">
                  اضغط "تشغيل الأمر" أدناه لمشاهدة التأثير البصري.
                </div>
              )}
            </div>

            {/* Interactive Run button */}
            <div className="z-10 flex justify-between items-center flex-row-reverse border-t border-slate-850 pt-3">
              <button
                onClick={runCommand}
                disabled={isRunning}
                className="bg-purple-500 hover:bg-purple-400 disabled:bg-slate-850 text-slate-950 font-black px-4 py-1.5 rounded-lg text-[10px] flex items-center gap-1.5 flex-row-reverse cursor-pointer transition-colors"
              >
                <Play className="w-3.5 h-3.5" /> تشغيل الأمر
              </button>

              <button
                onClick={() => {
                  setVisNodes([]);
                  setTerminalOutput(["🖥️ جاهز لتشغيل محاكاة الأوامر..."]);
                }}
                className="text-slate-500 hover:text-slate-350 text-[9px] font-bold cursor-pointer"
              >
                مسح الشاشة
              </button>
            </div>
          </div>

          {/* Terminal Console Output */}
          <div className="bg-black/90 border border-slate-850 rounded-xl p-4 h-80 flex flex-col justify-between text-left font-mono text-[9px]">
            <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[220px]" style={{ direction: "ltr" }}>
              {terminalOutput.map((log, idx) => (
                <div key={idx} className={log.startsWith("$") ? "text-slate-400" : log.includes("✅") ? "text-emerald-400" : "text-slate-200"}>
                  {log}
                </div>
              ))}
            </div>
            <div className="border-t border-slate-900 pt-2 text-[8px] text-slate-500 font-extrabold flex justify-between items-center">
              <span>SHELL: sh</span>
              <span>HOST: localhost</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

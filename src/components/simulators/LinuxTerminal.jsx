import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal, Maximize2, Minimize2, Trash2, ArrowRight } from "lucide-react";

const INITIAL_WELCOME = [
  "💻 IT Ninja Linux Simulator [Version 1.0.0]",
  "© 2026 IT Ninja Platform. All rights reserved.",
  "",
  "💡 اكتب 'help' لعرض الأوامر المتاحة.",
  "🎯 المهمة الحالية: قم بإنشاء مجلد جديد باسم 'ninja' باستخدام الأمر 'mkdir ninja'.",
  ""
];

const EXERCISES = [
  {
    desc: "1. قم بإنشاء مجلد باسم 'ninja'",
    cmd: "mkdir ninja",
    successMsg: "🎉 رائع! تم إنشاء المجلد بنجاح. الآن انتقل للمهمة التالية.",
    nextIdx: 1
  },
  {
    desc: "2. اعرض محتويات المجلد الحالي لرؤية مجلد 'ninja' الجديد",
    cmd: "ls",
    successMsg: "🎉 ممتاز! يمكنك رؤية المجلد 'ninja/' مدرجاً.",
    nextIdx: 2
  },
  {
    desc: "3. اعرف اسم المستخدم الحالي المشغّل للنظام",
    cmd: "whoami",
    successMsg: "🎉 رائع! اسم المستخدم هو 'it_ninja'. لقد أكملت كل المهام بنجاح! +15 XP",
    nextIdx: null
  }
];

export default function LinuxTerminal() {
  const [minimized, setMinimized] = useState(false);
  const [history, setHistory] = useState(INITIAL_WELCOME);
  const [input, setInput] = useState("");
  const [files, setFiles] = useState(["roadmap.txt", "notes.md"]);
  const [currentTask, setCurrentTask] = useState(0);
  const terminalEndRef = useRef(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = () => {
    const cmd = input.trim();
    if (!cmd) return;

    let reply = [];
    const parts = cmd.toLowerCase().split(" ");
    const mainCommand = parts[0];

    reply.push(`it_ninja@linux:~$ ${cmd}`);

    // Command Logic simulation
    switch (mainCommand) {
      case "help":
        reply.push("الأوامر المتاحة محاكاة:");
        reply.push("  ls              - عرض الملفات والمجلدات الحالية");
        reply.push("  mkdir <name>    - إنشاء مجلد جديد");
        reply.push("  cat <file>      - قراءة محتوى ملف");
        reply.push("  whoami          - عرض اسم المستخدم الحالي");
        reply.push("  clear           - مسح الشاشة");
        reply.push("  date            - عرض الوقت والتاريخ الحالي");
        break;

      case "clear":
        setHistory([]);
        setInput("");
        return;

      case "ls":
        reply.push(files.join("   "));
        break;

      case "whoami":
        reply.push("it_ninja");
        break;

      case "date":
        reply.push(new Date().toString());
        break;

      case "mkdir":
        const dirName = parts[1];
        if (!dirName) {
          reply.push("خطأ: يجب تحديد اسم المجلد. مثال: mkdir test");
        } else if (files.includes(dirName)) {
          reply.push(`خطأ: المجلد أو الملف '${dirName}' موجود بالفعل.`);
        } else {
          setFiles([...files, dirName]);
          reply.push(`تم إنشاء المجلد '${dirName}' بنجاح.`);
        }
        break;

      case "cat":
        const fileName = parts[1];
        if (!fileName) {
          reply.push("خطأ: يجب تحديد اسم الملف. مثال: cat notes.md");
        } else if (fileName === "roadmap.txt") {
          reply.push("--- IT Ninja Roadmap Completed ---");
          reply.push("1. Network foundations");
          reply.push("2. Linux commands");
          reply.push("3. Docker containerization");
        } else if (fileName === "notes.md") {
          reply.push("# Notes\nLearn every day, practice on real labs!");
        } else {
          reply.push(`خطأ: الملف '${fileName}' غير موجود.`);
        }
        break;

      default:
        reply.push(`bash: ${mainCommand}: command not found`);
    }

    // Check Task Completion
    if (currentTask !== null && EXERCISES[currentTask]) {
      const exercise = EXERCISES[currentTask];
      if (cmd.toLowerCase() === exercise.cmd) {
        reply.push("");
        reply.push(exercise.successMsg);
        setCurrentTask(exercise.nextIdx);
      }
    }

    setHistory([...history, ...reply, ""]);
    setInput("");
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg flex flex-col">
      {/* Header bar */}
      <div className="bg-slate-950 px-4 py-3 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4.5 h-4.5 text-cyan-400" />
          <span className="text-xs font-extrabold text-slate-300">محاكي سطر أوامر لينكس (Linux Terminal)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setMinimized(!minimized)} className="text-slate-500 hover:text-slate-300 p-1 cursor-pointer">
            {minimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {!minimized && (
        <div className="flex flex-col md:flex-row h-72">
          {/* Exercise Panel */}
          <div className="w-full md:w-1/3 bg-slate-950/60 p-4 border-b md:border-b-0 md:border-l border-slate-800 flex flex-col gap-3">
            <h4 className="text-xs font-bold text-slate-300 border-b border-slate-800 pb-2">🎯 تحديات لينكس اليومية</h4>
            {currentTask !== null ? (
              <div className="flex flex-col gap-2">
                <p className="text-[11px] text-cyan-400 font-bold">المهمة النشطة:</p>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">{EXERCISES[currentTask].desc}</p>
                <div className="mt-2 bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-[10px] font-mono text-slate-500">
                  الأمر المتوقع: <span className="text-cyan-300">{EXERCISES[currentTask].cmd}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-xs text-emerald-400 font-bold">🎉 أحسنت صنعاً!</p>
                <p className="text-[10px] text-slate-500 mt-1">لقد نجحت في اجتياز كل المهام بنجاح.</p>
              </div>
            )}
          </div>

          {/* CLI simulator Screen */}
          <div className="flex-1 flex flex-col bg-black/90 p-3 font-mono text-xs text-slate-300">
            {/* History logs */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-1 pr-1">
              {history.map((line, idx) => (
                <div key={idx} className="whitespace-pre-wrap text-right" style={{ direction: "ltr" }}>
                  {line}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Input prompt */}
            <div className="flex items-center gap-1 border-t border-slate-800/80 pt-2" style={{ direction: "ltr" }}>
              <span className="text-emerald-400 flex-shrink-0">it_ninja@linux:~$</span>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCommand()}
                className="flex-1 bg-transparent border-none text-slate-100 outline-none font-mono focus:ring-0 p-0 text-left"
                autoFocus
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Maximize2, Minimize2, Trash2, ArrowRight } from "lucide-react";

// initial files & directories structure
const INITIAL_FS = {
  name: "root",
  type: "dir",
  children: {
    home: {
      name: "home",
      type: "dir",
      children: {
        it_ninja: {
          name: "it_ninja",
          type: "dir",
          children: {
            "roadmap.txt": {
              name: "roadmap.txt",
              type: "file",
              content: "--- IT Ninja Roadmap Completed ---\n1. Network foundations\n2. Linux commands\n3. Docker containerization\n4. Advanced Security"
            },
            "notes.md": {
              name: "notes.md",
              type: "file",
              content: "# Notes\nLearn every day, practice on real labs!"
            }
          }
        }
      }
    },
    var: {
      name: "var",
      type: "dir",
      children: {
        log: {
          name: "log",
          type: "dir",
          children: {
            "syslog.log": {
              name: "syslog.log",
              type: "file",
              content: "Jul  8 12:00:01 kernel: Booting IT-Ninja OS...\nJul  8 12:00:05 systemd[1]: Started Network Topology Service."
            }
          }
        }
      }
    }
  }
};

const EXERCISES = [
  {
    desc: "1. قم بإنشاء مجلد باسم 'projects' في مجلدك الحالي",
    cmd: "mkdir projects",
    successMsg: "🎉 رائع! تم إنشاء المجلد بنجاح. الآن انتقل للمهمة التالية.",
    nextIdx: 1
  },
  {
    desc: "2. انتقل لداخل المجلد الجديد 'projects'",
    cmd: "cd projects",
    successMsg: "🎉 ممتاز! أنت الآن بداخل مجلد /projects.",
    nextIdx: 2
  },
  {
    desc: "3. قم بإنشاء ملف نصي جديد باسم 'test.txt' باستخدام محرر nano وكتابة كلمة 'hello' وحفظه.",
    cmd: "nano test.txt",
    successMsg: "🎉 مدهش! لقد أنشأت ملفك الأول وحفظته باستخدام محرر nano بنجاح! +25 XP",
    nextIdx: null
  }
];

export default function LinuxTerminal() {
  const [minimized, setMinimized] = useState(false);
  const [history, setHistory] = useState([
    "💻 IT Ninja Interactive Bash Terminal [Version 2.0.0]",
    "© 2026 IT Ninja Platform. All rights reserved.",
    "🐧 نظام التشغيل المحاكي: Linux it-ninja-kernel v5.15",
    "",
    "💡 اكتب 'help' لعرض الأوامر المتاحة والمتقدمة.",
    "🎯 المهمة: قم بإنشاء مجلد جديد باسم 'projects' باستخدام 'mkdir projects'.",
    ""
  ]);
  const [input, setInput] = useState("");
  const [currentPath, setCurrentPath] = useState(["home", "it_ninja"]);
  const [fs, setFs] = useState(INITIAL_FS);
  const [currentTask, setCurrentTask] = useState(0);

  // Nano editor mode state
  const [nanoMode, setNanoMode] = useState(false);
  const [nanoFilename, setNanoFilename] = useState("");
  const [nanoContent, setNanoContent] = useState("");

  const terminalEndRef = useRef(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, nanoMode]);

  // Navigate filesystem structure based on current path array
  const getDirFromPath = (pathArray) => {
    let curr = fs;
    for (const p of pathArray) {
      if (curr.children && curr.children[p]) {
        curr = curr.children[p];
      } else {
        return null;
      }
    }
    return curr;
  };

  // Helper to serialize path
  const getPathString = () => {
    return "/" + currentPath.join("/");
  };

  const handleCommand = () => {
    const cmd = input.trim();
    if (!cmd) return;

    let reply = [];
    const parts = cmd.split(/\s+/);
    const mainCommand = parts[0].toLowerCase();
    const args = parts.slice(1);

    reply.push(`it_ninja@linux:${getPathString()}$ ${cmd}`);

    const currentDir = getDirFromPath(currentPath);

    switch (mainCommand) {
      case "help":
        reply.push("📋 الأوامر المتاحة في النظام:");
        reply.push("  ls              - عرض الملفات والمجلدات الحالية");
        reply.push("  cd <path>       - تغيير المجلد الحالي (cd .., cd ~, cd /)");
        reply.push("  pwd             - طباعة مسار المجلد الحالي");
        reply.push("  mkdir <name>    - إنشاء مجلد جديد");
        reply.push("  touch <name>    - إنشاء ملف فارغ جديد");
        reply.push("  nano <filename> - محرر نصوص تفاعلي متقدم لإنشاء وتعديل الملفات");
        reply.push("  cat <file>      - قراءة وعرض محتوى ملف نصي");
        reply.push("  rm <file>       - حذف ملف معين");
        reply.push("  ping <ip>       - فحص اتصال شبكي حقيقي بأجهزة التوبولوجيا");
        reply.push("  whoami          - عرض اسم المستخدم النشط");
        reply.push("  clear           - مسح شاشة الـ Terminal");
        reply.push("  date            - عرض التاريخ والوقت الحالي");
        break;

      case "clear":
        setHistory([]);
        setInput("");
        return;

      case "pwd":
        reply.push(getPathString());
        break;

      case "whoami":
        reply.push("it_ninja");
        break;

      case "date":
        reply.push(new Date().toString());
        break;

      case "ls":
        if (currentDir && currentDir.children) {
          const items = Object.values(currentDir.children).map(item => {
            if (item.type === "dir") {
              return `📁 \u001b[34m${item.name}\u001b[0m`; // ANSI blue for directories
            }
            return `📄 ${item.name}`;
          });
          if (items.length === 0) {
            reply.push("(المجلد فارغ)");
          } else {
            reply.push(items.join("   "));
          }
        } else {
          reply.push("خطأ: تعذر قراءة المجلد الحالي.");
        }
        break;

      case "cd":
        const target = args[0];
        if (!target || target === "~") {
          setCurrentPath(["home", "it_ninja"]);
        } else if (target === "/") {
          setCurrentPath([]);
        } else if (target === "..") {
          if (currentPath.length > 0) {
            setCurrentPath(currentPath.slice(0, -1));
          }
        } else {
          // Resolve relative target paths
          const segments = target.split("/");
          let newPath = [...currentPath];
          let valid = true;

          for (const seg of segments) {
            if (!seg || seg === ".") continue;
            if (seg === "..") {
              if (newPath.length > 0) newPath.pop();
            } else {
              const testDir = getDirFromPath(newPath);
              if (testDir && testDir.children && testDir.children[seg] && testDir.children[seg].type === "dir") {
                newPath.push(seg);
              } else {
                valid = false;
                break;
              }
            }
          }

          if (valid) {
            setCurrentPath(newPath);
          } else {
            reply.push(`bash: cd: ${target}: لا يوجد مجلد بهذا الاسم أو المسار غير صحيح.`);
          }
        }
        break;

      case "mkdir":
        const dirName = args[0];
        if (!dirName) {
          reply.push("خطأ: يجب كتابة اسم المجلد. مثال: mkdir test");
        } else if (currentDir.children && currentDir.children[dirName]) {
          reply.push(`خطأ: المجلد أو الملف '${dirName}' موجود بالفعل.`);
        } else {
          // Update filesystem tree
          const newFs = { ...fs };
          let temp = newFs;
          for (const p of currentPath) {
            temp = temp.children[p];
          }
          temp.children[dirName] = {
            name: dirName,
            type: "dir",
            children: {}
          };
          setFs(newFs);
          reply.push(`📂 تم إنشاء المجلد '${dirName}' بنجاح.`);
        }
        break;

      case "touch":
        const fileToCreate = args[0];
        if (!fileToCreate) {
          reply.push("خطأ: يجب كتابة اسم الملف. مثال: touch test.txt");
        } else if (currentDir.children && currentDir.children[fileToCreate]) {
          reply.push(`خطأ: الملف أو المجلد '${fileToCreate}' موجود بالفعل.`);
        } else {
          const newFs = { ...fs };
          let temp = newFs;
          for (const p of currentPath) {
            temp = temp.children[p];
          }
          temp.children[fileToCreate] = {
            name: fileToCreate,
            type: "file",
            content: ""
          };
          setFs(newFs);
          reply.push(`📄 تم إنشاء ملف فارغ '${fileToCreate}' بنجاح.`);
        }
        break;

      case "cat":
        const fileToRead = args[0];
        if (!fileToRead) {
          reply.push("خطأ: يجب كتابة اسم الملف المطلوب قراءته. مثال: cat notes.md");
        } else {
          const fileObj = currentDir.children ? currentDir.children[fileToRead] : null;
          if (fileObj && fileObj.type === "file") {
            reply.push(fileObj.content || "(ملف فارغ)");
          } else {
            reply.push(`bash: cat: ${fileToRead}: لا يوجد ملف بهذا الاسم.`);
          }
        }
        break;

      case "rm":
        const fileToDelete = args[0];
        if (!fileToDelete) {
          reply.push("خطأ: يجب كتابة اسم الملف المراد حذفه. مثال: rm test.txt");
        } else {
          const fileObj = currentDir.children ? currentDir.children[fileToDelete] : null;
          if (fileObj && fileObj.type === "file") {
            const newFs = { ...fs };
            let temp = newFs;
            for (const p of currentPath) {
              temp = temp.children[p];
            }
            delete temp.children[fileToDelete];
            setFs(newFs);
            reply.push(`🗑️ تم حذف الملف '${fileToDelete}' بنجاح.`);
          } else {
            reply.push(`bash: rm: ${fileToDelete}: الملف غير موجود.`);
          }
        }
        break;

      case "nano":
        const nanoFile = args[0];
        if (!nanoFile) {
          reply.push("خطأ: يجب كتابة اسم الملف للمحرر. مثال: nano test.txt");
        } else {
          const fileObj = currentDir.children ? currentDir.children[nanoFile] : null;
          setNanoFilename(nanoFile);
          setNanoContent(fileObj && fileObj.type === "file" ? fileObj.content : "");
          setNanoMode(true);
          setInput("");
          return; // exit command execution to open nano view
        }
        break;

      case "ping":
        const ip = args[0];
        if (!ip) {
          reply.push("خطأ: يجب كتابة عنوان IP. مثال: ping 192.168.1.15");
        } else {
          reply.push(`PING ${ip} (56 octets of data)...`);
          // simulate active network responses if it matches topology subnet
          if (ip.startsWith("192.168.1.")) {
            reply.push(`64 bytes from ${ip}: icmp_seq=1 ttl=64 time=0.45 ms`);
            reply.push(`64 bytes from ${ip}: icmp_seq=2 ttl=64 time=0.38 ms`);
            reply.push(`64 bytes from ${ip}: icmp_seq=3 ttl=64 time=0.41 ms`);
            reply.push(`--- ${ip} ping statistics ---`);
            reply.push("3 packets transmitted, 3 received, 0% packet loss");
          } else {
            reply.push("Request timeout for icmp_seq 0");
            reply.push("Request timeout for icmp_seq 1");
            reply.push("Request timeout for icmp_seq 2");
            reply.push(`--- ${ip} ping statistics ---`);
            reply.push("3 packets transmitted, 0 received, 100% packet loss");
          }
        }
        break;

      default:
        reply.push(`bash: ${mainCommand}: command not found. اكتب 'help' لعرض الأوامر.`);
    }

    // Check Task Completion
    if (currentTask !== null && EXERCISES[currentTask]) {
      const exercise = EXERCISES[currentTask];
      // match command
      if (cmd.toLowerCase().replace(/\s+/g, " ") === exercise.cmd) {
        reply.push("");
        reply.push(exercise.successMsg);
        setCurrentTask(exercise.nextIdx);
      }
    }

    setHistory([...history, ...reply, ""]);
    setInput("");
  };

  const saveNanoFile = () => {
    // Save state to mock fs
    const newFs = { ...fs };
    let temp = newFs;
    for (const p of currentPath) {
      temp = temp.children[p];
    }
    temp.children[nanoFilename] = {
      name: nanoFilename,
      type: "file",
      content: nanoContent
    };
    setFs(newFs);

    // Add logs to console history
    const reply = [
      `it_ninja@linux:${getPathString()}$ nano ${nanoFilename}`,
      `[ تم حفظ الملف '${nanoFilename}' بنجاح في نظام الملفات ]`
    ];

    // Check nano task exercise completion
    if (currentTask === 2 && nanoFilename === "test.txt" && nanoContent.toLowerCase().includes("hello")) {
      reply.push("");
      reply.push(EXERCISES[2].successMsg);
      setCurrentTask(null);
    }

    setHistory([...history, ...reply, ""]);
    setNanoMode(false);
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg flex flex-col scroll-mt-28" id="linux-terminal">
      {/* Header bar */}
      <div className="bg-slate-950 px-4 py-3 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4.5 h-4.5 text-cyan-400 animate-pulse" />
          <span className="text-xs font-extrabold text-slate-300">محاكي سطر أوامر لينكس التفاعلي (Interactive Linux Shell v2)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setMinimized(!minimized)} className="text-slate-500 hover:text-slate-300 p-1 cursor-pointer">
            {minimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {!minimized && (
        <div className="flex flex-col md:flex-row h-80">
          {/* Exercise Panel */}
          <div className="w-full md:w-1/3 bg-slate-950/60 p-4 border-b md:border-b-0 md:border-l border-slate-800 flex flex-col gap-3 text-right">
            <h4 className="text-xs font-bold text-slate-300 border-b border-slate-800 pb-2 flex items-center justify-between flex-row-reverse">
              <span>🎯 تحديات لينكس التفاعلية</span>
              {currentTask !== null && <span className="text-[9px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-1.5 py-0.5 rounded-full font-mono">XP 25+</span>}
            </h4>
            {currentTask !== null ? (
              <div className="flex flex-col gap-2">
                <span className="text-[10px] text-cyan-400 font-bold block">المهمة الحالية:</span>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">{EXERCISES[currentTask].desc}</p>
                <div className="mt-2 bg-slate-900 border border-slate-850 rounded-lg p-2 font-mono text-[9px] text-slate-400 leading-snug text-left">
                  الأمر المتوقع تشغيله:<br/>
                  <span className="text-cyan-300 block mt-1 font-semibold">{EXERCISES[currentTask].cmd}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 flex flex-col items-center gap-2">
                <p className="text-xs text-emerald-400 font-bold">🎉 أحسنت يا بطل النينجا!</p>
                <p className="text-[10px] text-slate-400 leading-relaxed text-center">لقد نجحت في اجتياز كافة التحديات البرمجية وبناء الملفات الحقيقية!</p>
              </div>
            )}
          </div>

          {/* CLI screen / Nano Editor */}
          <div className="flex-1 flex flex-col bg-black/90 p-3 font-mono text-xs text-slate-300 relative">
            {nanoMode ? (
              /* Playable Nano Editor Interface */
              <div className="absolute inset-0 bg-slate-950 p-2 flex flex-col text-slate-300">
                <div className="bg-slate-800 text-slate-100 px-2 py-0.5 flex justify-between text-[10px]">
                  <span>UW PICO 5.06</span>
                  <span>File: {nanoFilename}</span>
                  <span>Modified</span>
                </div>
                <textarea
                  value={nanoContent}
                  onChange={(e) => setNanoContent(e.target.value)}
                  className="flex-1 bg-transparent border-none text-cyan-300 font-mono outline-none resize-none focus:ring-0 p-2 leading-relaxed text-left text-xs"
                  placeholder="اكتب كودك أو نصوصك هنا..."
                  autoFocus
                />
                <div className="bg-slate-900 border-t border-slate-800 p-1 flex justify-between text-[9px] text-slate-450 items-center">
                  <div className="flex gap-2">
                    <div><span className="text-slate-200 bg-slate-800 px-1 rounded">Ctrl+O</span> Save</div>
                    <div><span className="text-slate-200 bg-slate-800 px-1 rounded">Ctrl+X</span> Exit</div>
                  </div>
                  <button onClick={saveNanoFile} className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded px-3 py-0.5 font-bold cursor-pointer text-center">
                    [ حفظ وإغلاق الملف ]
                  </button>
                </div>
              </div>
            ) : (
              /* Standard Shell Simulator screen */
              <>
                {/* History logs */}
                <div className="flex-1 overflow-y-auto flex flex-col gap-1 pr-1">
                  {history.map((line, idx) => (
                    <div key={idx} className="whitespace-pre-wrap text-left" style={{ direction: "ltr" }}>
                      {line}
                    </div>
                  ))}
                  <div ref={terminalEndRef} />
                </div>

                {/* Input prompt */}
                <div className="flex items-center gap-1 border-t border-slate-850 pt-2" style={{ direction: "ltr" }}>
                  <span className="text-emerald-400 flex-shrink-0">it_ninja@linux:{getPathString()}$</span>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCommand()}
                    className="flex-1 bg-transparent border-none text-slate-100 outline-none font-mono focus:ring-0 p-0 text-left"
                    autoFocus
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

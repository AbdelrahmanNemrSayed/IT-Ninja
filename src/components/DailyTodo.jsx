import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckSquare, Plus, Trash2, RotateCcw, Flame, Target, ClipboardList } from "lucide-react";

const STORAGE_KEY = "ninja-daily-todo";

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

const QUICK_TASKS = [
  "مراجعة أوامر Linux لمدة 15 دقيقة",
  "حل تمرين Networking",
  "مشاهدة فيديو Docker",
  "قراءة مقال أمن معلومات",
  "تجربة أمر جديد في الـ Terminal",
  "مراجعة الـ Cheat Sheet",
  "حل سؤال اختبار",
  "كتابة script بـ Bash",
];

export default function DailyTodo() {
  const [data, setData] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      const today = getTodayKey();
      if (stored.date === today) return stored;
      return { date: today, tasks: [], streak: stored.streak || 0, completedYesterday: stored.date === getPreviousDay() };
    } catch { return { date: getTodayKey(), tasks: [], streak: 0 }; }
  });

  const [newTask, setNewTask] = useState("");
  const [showQuick, setShowQuick] = useState(false);

  function getPreviousDay() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  }

  const save = useCallback((updated) => {
    setData(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, []);

  const addTask = (text) => {
    const t = (text || newTask).trim();
    if (!t) return;
    save({ ...data, tasks: [...data.tasks, { id: Date.now(), text: t, done: false }] });
    setNewTask("");
    setShowQuick(false);
  };

  const toggle = (id) => {
    const tasks = data.tasks.map((t) => t.id === id ? { ...t, done: !t.done } : t);
    save({ ...data, tasks });
  };

  const remove = (id) => save({ ...data, tasks: data.tasks.filter((t) => t.id !== id) });

  const reset = () => save({ date: getTodayKey(), tasks: [], streak: data.streak });

  const doneTasks = data.tasks.filter((t) => t.done);
  const total = data.tasks.length;
  const pct = total > 0 ? Math.round((doneTasks.length / total) * 100) : 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 flex flex-col gap-5"
    >
      {/* Header */}
      <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-cyan-400" />
            قائمة مهام اليوم (Daily To-Do)
          </h3>
          <p className="text-xs text-slate-500 mt-1">{new Date().toLocaleDateString("ar-EG", { weekday: "long", day: "numeric", month: "long" })}</p>
        </div>
        <div className="flex items-center gap-2">
          {total > 0 && (
            <div className="text-right">
              <span className="text-lg font-black text-emerald-400">{pct}%</span>
              <p className="text-[10px] text-slate-500">مكتمل</p>
            </div>
          )}
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={reset}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all cursor-pointer"
            title="مسح القائمة">
            <RotateCcw className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div className="bg-slate-950 rounded-full h-1.5 overflow-hidden">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
            animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }} />
        </div>
      )}

      {/* Tasks list */}
      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
        <AnimatePresence initial={false}>
          {data.tasks.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-8 text-center gap-2">
              <Target className="w-8 h-8 text-slate-700" />
              <p className="text-sm font-bold text-slate-500">لا توجد مهام اليوم</p>
              <p className="text-xs text-slate-600">أضف مهامك أو اختر من الاقتراحات أدناه</p>
            </motion.div>
          )}
          {data.tasks.map((task) => (
            <motion.div key={task.id} layout
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${
                task.done
                  ? "bg-emerald-500/5 border-emerald-500/20 opacity-60"
                  : "bg-slate-950/50 border-slate-800 hover:border-slate-700"
              }`}
            >
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => toggle(task.id)}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 cursor-pointer transition-all ${
                  task.done ? "bg-emerald-500 border-emerald-500" : "border-slate-600 hover:border-cyan-500"
                }`}>
                {task.done && <CheckSquare className="w-3 h-3 text-white" />}
              </motion.button>
              <p className={`flex-1 text-xs font-medium text-right ${task.done ? "line-through text-slate-500" : "text-slate-200"}`}>
                {task.text}
              </p>
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => remove(task.id)}
                className="text-slate-700 hover:text-rose-400 transition-colors cursor-pointer flex-shrink-0">
                <Trash2 className="w-3.5 h-3.5" />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add task input */}
      <div className="flex gap-2">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="أضف مهمة جديدة..."
          className="flex-1 bg-slate-950/80 border border-slate-700/50 rounded-xl px-3 py-2.5 text-xs text-slate-200
            placeholder-slate-500 focus:outline-none focus:border-cyan-500/40 text-right transition-colors"
        />
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => addTask()}
          disabled={!newTask.trim()}
          className="px-3 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400
            hover:bg-cyan-500/30 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition-all">
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Quick suggestions */}
      <div>
        <button onClick={() => setShowQuick(!showQuick)}
          className="text-[11px] text-slate-500 hover:text-slate-300 font-bold cursor-pointer transition-colors flex items-center gap-1">
          <Flame className="w-3 h-3 text-orange-400" /> اقتراحات سريعة {showQuick ? "▲" : "▼"}
        </button>
        <AnimatePresence>
          {showQuick && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="flex flex-wrap gap-1.5 mt-2 overflow-hidden">
              {QUICK_TASKS.map((t, i) => (
                <motion.button key={i} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => addTask(t)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-400
                    hover:border-cyan-500/30 hover:text-cyan-400 transition-all cursor-pointer">
                  {t}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

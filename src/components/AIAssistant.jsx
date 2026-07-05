import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, X, Send, Bot, User, Loader2,
  Minimize2, Maximize2, Sparkles, ChevronDown
} from "lucide-react";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const SYSTEM_PROMPT = `أنت "Ninja AI" — مساعد ذكي متخصص في تقنية المعلومات (IT) مدمج في منصة IT Ninja التعليمية.

قواعدك:
- أجب باللغة العربية دائماً (إلا الأوامر والمصطلحات التقنية بالإنجليزية)
- تخصصك: Linux, Networking, Docker, Security, Cloud, DevOps, Servers
- اجعل إجاباتك دقيقة ومباشرة مع أمثلة عملية
- استخدم رموز markdown للكود: \`\`\`bash للأوامر
- إذا لم تعرف الإجابة، قل ذلك بصراحة
- اقترح مصادر من الـ Roadmap عند الاقتضاء
- حافظ على نبرة تحفيزية ومشجعة`;

const SUGGESTED_QUESTIONS = [
  "ما الفرق بين TCP و UDP؟",
  "كيف أنشئ Docker container من الصفر؟",
  "شرح RAID 5 ببساطة",
  "أوامر Linux الأساسية للمبتدئين",
];

async function callGemini(messages) {
  if (!GEMINI_API_KEY) throw new Error("NO_KEY");

  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }],
  }));

  const lastMsg = messages[messages.length - 1];

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [
          ...history,
          { role: "user", parts: [{ text: lastMsg.content }] },
        ],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
      }),
    }
  );

  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "عذراً، لم أفهم السؤال.";
}

// Simple markdown-to-jsx renderer for code blocks
function MessageContent({ text }) {
  const parts = text.split(/(```[\s\S]*?```)/g);
  return (
    <div className="text-sm leading-relaxed">
      {parts.map((part, i) => {
        if (part.startsWith("```")) {
          const lang = part.match(/```(\w*)/)?.[1] || "";
          const code = part.replace(/```\w*\n?/, "").replace(/```$/, "");
          return (
            <pre key={i} className="bg-slate-950 border border-slate-700 rounded-lg p-3 my-2 overflow-x-auto text-xs font-mono text-cyan-300 whitespace-pre-wrap">
              {lang && <span className="text-slate-500 block mb-1 text-[10px]">{lang}</span>}
              {code}
            </pre>
          );
        }
        // Bold text
        const bold = part.split(/(\*\*.*?\*\*)/g).map((s, j) =>
          s.startsWith("**") ? <strong key={j} className="text-slate-100">{s.slice(2, -2)}</strong> : s
        );
        return <span key={i}>{bold}</span>;
      })}
    </div>
  );
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "مرحباً! أنا **Ninja AI** 🥷\n\nاسألني أي سؤال في عالم الـ IT — Linux, Networking, Docker, Cloud, Security...",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [noKey, setNoKey] = useState(!GEMINI_API_KEY);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [messages, open, minimized]);

  useEffect(() => {
    if (open && !minimized) inputRef.current?.focus();
  }, [open, minimized]);

  const sendMessage = async (text) => {
    const content = (text || input).trim();
    if (!content || loading) return;
    setInput("");

    const userMsg = { role: "user", content };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      const reply = await callGemini(newMessages);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      const errMsg = err.message === "NO_KEY"
        ? "⚠️ لم يتم إعداد Gemini API Key بعد."
        : "⚠️ حدث خطأ في الاتصال. حاول مرة أخرى.";
      setMessages((prev) => [...prev, { role: "assistant", content: errMsg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating trigger button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600
              shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center justify-center cursor-pointer
              hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] transition-shadow"
            aria-label="افتح مساعد AI"
          >
            <Bot className="w-7 h-7 text-white" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950 animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={minimized
              ? { opacity: 1, scale: 1, y: 0, height: 56 }
              : { opacity: 1, scale: 1, y: 0, height: 520 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 left-6 z-50 w-96 bg-slate-900/95 border border-slate-700/50 rounded-2xl
              shadow-[0_25px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl overflow-hidden flex flex-col"
            style={{ maxHeight: minimized ? 56 : 520 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-900/50 flex-shrink-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-extrabold text-slate-100">Ninja AI</p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> مستعد للإجابة
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setMinimized(!minimized)} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all cursor-pointer">
                  {minimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-all cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {!minimized && (
              <>
                {/* No API Key warning */}
                {noKey && (
                  <div className="px-4 py-3 bg-amber-500/10 border-b border-amber-500/20">
                    <p className="text-xs text-amber-400 font-semibold mb-2">⚠️ مفتاح Gemini API غير موجود</p>
                    <p className="text-[10px] text-slate-400 mb-2">أضف <code className="text-cyan-400">VITE_GEMINI_API_KEY</code> في ملف .env</p>
                    <a
                      href="https://aistudio.google.com/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-cyan-400 underline"
                    >
                      احصل على مفتاح مجاني من Google AI Studio ←
                    </a>
                  </div>
                )}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-0">
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                        msg.role === "user"
                          ? "bg-cyan-500/20 border border-cyan-500/30 text-cyan-400"
                          : "bg-purple-500/20 border border-purple-500/30 text-purple-400"
                      }`}>
                        {msg.role === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                      </div>
                      <div className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-slate-200 ${
                        msg.role === "user"
                          ? "bg-cyan-500/15 border border-cyan-500/20 rounded-tr-sm"
                          : "bg-slate-800/80 border border-slate-700/50 rounded-tl-sm"
                      }`}>
                        <MessageContent text={msg.content} />
                      </div>
                    </motion.div>
                  ))}

                  {loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                        <Bot className="w-3.5 h-3.5 text-purple-400" />
                      </div>
                      <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl rounded-tl-sm px-3.5 py-2.5 flex items-center gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <motion.span key={i} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                            className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Suggested questions (only at start) */}
                  {messages.length === 1 && !loading && (
                    <div className="flex flex-col gap-1.5 mt-1">
                      <p className="text-[10px] text-slate-500 font-bold">💡 اقتراحات:</p>
                      {SUGGESTED_QUESTIONS.map((q, i) => (
                        <motion.button key={i} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                          onClick={() => sendMessage(q)}
                          className="text-right text-xs text-slate-300 bg-slate-800/50 border border-slate-700/50 rounded-xl px-3 py-2
                            hover:border-cyan-500/30 hover:text-cyan-300 transition-all cursor-pointer">
                          {q}
                        </motion.button>
                      ))}
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 border-t border-slate-800 flex-shrink-0">
                  <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-700/50 rounded-xl px-3 py-2
                    focus-within:border-cyan-500/40 transition-colors">
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                      placeholder="اسأل أي سؤال عن IT..."
                      className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-500 focus:outline-none text-right"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                      onClick={() => sendMessage()}
                      disabled={!input.trim() || loading}
                      className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center
                        disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <Send className="w-3.5 h-3.5 text-white" />
                    </motion.button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

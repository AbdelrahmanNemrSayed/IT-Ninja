import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, X, Send, Bot, User, Loader2,
  Minimize2, Maximize2, Sparkles, ChevronDown
} from "lucide-react";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const SYSTEM_PROMPT = `أنت "Ninja AI" 🥷 — المساعد الذكي الخبير والمتخصص في تقنية المعلومات (IT) والشبكات وأنظمة التشغيل، المدمج في منصة IT Ninja التعليمية الفخمة.

مهمتك هي تقديم إجابات مبهرة، منسقة، ومرتبة بشكل بصري جذاب للغاية. اتبع القواعد الصارمة التالية في كل رد:

1. التنسيق والهيكلة البصرية 📊:
   - قسم إجابتك إلى عناوين فرعية واضحة ونقاط مرتبة باستخدام Markdown.
   - استخدم الجداول (Tables) دائماً عند المقارنة بين شيئين أو عرض خصائص وميزات متقارنة (مثال: مقارنة بروتوكولات، مستويات RAID، إلخ).
   - ضع الأكواد والأوامر داخل كتل كود مظللة بالكامل مثل: \`\`\`bash للأوامر أو \`\`\`yaml للملفات.

2. استخدام الإيموجي التفاعلي والأيقونات 🌟:
   - استخدم الإيموجي والأيقونات التفاعلية في بداية العناوين والنقاط لتضفي الحيوية والتنظيم البصري على ردودك.
   - أمثلة للإيموجي حسب السياق:
     - 📡 للشبكات والاتصالات وبروتوكولات الإنترنت.
     - 🐧 لنظام لينكس والأوامر والـ Terminal.
     - 🔒 للأمان والسياسات وجدران الحماية والتشفير.
     - ☁️ للحوسبة السحابية وأدوات الـ DevOps والـ CI/CD.
     - 🐳 لـ Docker و Kubernetes وحاويات التطبيقات.
     - 💾 للتخزين وأنظمة RAID والأقراص الصلبة.
     - ⚙️ للأتمتة والسكربتات والـ Cron jobs.
     - 💡 للنصائح الذكية والممارسات الفضلى.
     - ⚠️ للتنبيهات والأخطاء الشائعة التي يجب تجنبها.

3. النبرة والأسلوب 🎯:
   - نبرة حماسية، تشجيعية، وتفاعلية تشبه معلم النينجا الحكيم (Sensei) الذي يوجه تلميذه نحو الاحتراف والتميز.
   - اجعل الشرح مبسطاً جداً ومقترناً بأمثلة عملية من بيئات العمل الحقيقية لمهندسي الأنظمة والشبكات.
   - إذا سألك المستخدم سؤالاً خارج سياق تقنية المعلومات، اعتذر منه بلطف وبأسلوب نينجا ذكي وأرشده لطرح أسئلة في الشبكات والأنظمة.`;

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
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [
          ...history,
          { role: "user", parts: [{ text: lastMsg.content }] },
        ],
        generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
      }),
    }
  );

  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "عذراً، لم أفهم السؤال.";
}

// Rich markdown-to-jsx renderer supporting tables, lists, headers and bold inline styles
function MessageContent({ text }) {
  if (!text || typeof text !== "string") return null;
  // 1. Split by code blocks first
  const blocks = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="text-sm leading-relaxed text-right flex flex-col gap-2.5">
      {blocks.map((block, index) => {
        if (block.startsWith("```")) {
          const lang = block.match(/```(\w*)/)?.[1] || "";
          const code = block.replace(/```\w*\n?/, "").replace(/```$/, "");
          return (
            <pre key={index} className="bg-slate-950 border border-slate-850 rounded-xl p-4 my-1 overflow-x-auto text-xs font-mono text-cyan-300 text-left whitespace-pre scrollbar-thin" dir="ltr">
              {lang && <span className="text-slate-500 block mb-1.5 text-[9px] font-bold uppercase tracking-wider">{lang}</span>}
              {code}
            </pre>
          );
        }

        // 2. Parse tables, lists, and paragraphs in non-code block text
        const lines = block.split("\n");
        const renderedElements = [];
        let currentTable = null;

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();

          // A. Table parsing
          if (line.startsWith("|")) {
            const cells = line.split("|").map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
            
            // Check if it is a separator line (e.g., |---|---|)
            const isSeparator = cells.every(c => c.startsWith("-") || c === "");
            
            if (isSeparator) {
              continue; // Skip separator line
            }

            if (!currentTable) {
              currentTable = { headers: cells, rows: [] };
            } else {
              currentTable.rows.push(cells);
            }
            
            // If the next line is not a table line, render the accumulated table
            const nextLine = lines[i + 1]?.trim() || "";
            if (!nextLine.startsWith("|")) {
              const tableToRender = currentTable;
              currentTable = null;
              
              renderedElements.push(
                <div key={`table-${i}`} className="overflow-x-auto my-3 border border-slate-800 rounded-xl bg-slate-950/40">
                  <table className="w-full text-right text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800">
                        {tableToRender.headers.map((h, hIdx) => (
                          <th key={hIdx} className="p-3 font-extrabold text-slate-200">{parseInlineStyles(h)}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tableToRender.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="border-b border-slate-850 hover:bg-slate-900/30 transition-colors">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-3 text-slate-350">{parseInlineStyles(cell)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            }
            continue;
          }

          // B. List parsing
          if (line.startsWith("- ") || line.startsWith("* ")) {
            const content = line.substring(2);
            renderedElements.push(
              <div key={`li-${i}`} className="flex items-start justify-end gap-2 flex-row-reverse text-right pr-2">
                <span className="text-cyan-400 mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span className="text-slate-300 text-xs">{parseInlineStyles(content)}</span>
              </div>
            );
            continue;
          }

          // C. Numbered List parsing
          if (/^\d+\.\s/.test(line)) {
            const num = line.match(/^(\d+)\.\s/)[1];
            const content = line.replace(/^\d+\.\s/, "");
            renderedElements.push(
              <div key={`ol-${num}-${i}`} className="flex items-start justify-end gap-2 flex-row-reverse text-right pr-2">
                <span className="text-cyan-400 text-xs font-mono font-bold">{num}.</span>
                <span className="text-slate-300 text-xs">{parseInlineStyles(content)}</span>
              </div>
            );
            continue;
          }

          // D. Headers
          if (line.startsWith("### ")) {
            renderedElements.push(<h4 key={`h3-${i}`} className="font-extrabold text-slate-100 text-xs mt-3 flex items-center gap-1.5 flex-row-reverse justify-end">{parseInlineStyles(line.substring(4))}</h4>);
            continue;
          }
          if (line.startsWith("## ")) {
            renderedElements.push(<h3 key={`h2-${i}`} className="font-black text-slate-100 text-sm mt-4 border-b border-slate-850 pb-1 flex items-center gap-1.5 flex-row-reverse justify-end">{parseInlineStyles(line.substring(3))}</h3>);
            continue;
          }

          // E. Normal Paragraph
          if (line) {
            renderedElements.push(<p key={`p-${i}`} className="text-slate-300 text-xs leading-relaxed">{parseInlineStyles(line)}</p>);
          }
        }

        return <React.Fragment key={index}>{renderedElements}</React.Fragment>;
      })}
    </div>
  );
}

// Helper to parse inline bold and inline-code
function parseInlineStyles(text) {
  // Handle inline code first `code`
  let parts = text.split(/(`[^`]+`)/g).map((part, idx) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={`code-${idx}`} className="bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-[10px] font-mono text-cyan-300 font-bold mx-0.5" dir="ltr">
          {part.slice(1, -1)}
        </code>
      );
    }
    
    // Handle bold inside the remaining text
    const boldParts = part.split(/(\*\*[^*]+\*\*)/g).map((bPart, bIdx) => {
      if (bPart.startsWith("**") && bPart.endsWith("**")) {
        return (
          <strong key={`bold-${bIdx}`} className="text-white font-extrabold">
            {bPart.slice(2, -2)}
          </strong>
        );
      }
      return bPart;
    });

    return <React.Fragment key={idx}>{boldParts}</React.Fragment>;
  });

  return parts;
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

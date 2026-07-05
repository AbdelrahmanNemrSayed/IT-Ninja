import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Download, Share2, Check, Sparkles, Star } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const PHASE_BADGES = {
  1: { emoji: "🌐", color: "#06b6d4", name: "Network Foundations" },
  2: { emoji: "🖥️", color: "#8b5cf6", name: "Server Mastery" },
  3: { emoji: "🐧", color: "#22c55e", name: "Linux Ninja" },
  4: { emoji: "🔒", color: "#ef4444", name: "Security Expert" },
  5: { emoji: "☁️", color: "#3b82f6", name: "Cloud Engineer" },
  6: { emoji: "🐳", color: "#06b6d4", name: "Docker Captain" },
  7: { emoji: "⚙️", color: "#f59e0b", name: "DevOps Master" },
  8: { emoji: "📊", color: "#ec4899", name: "Monitoring Pro" },
  9: { emoji: "🤖", color: "#8b5cf6", name: "Automation Wizard" },
  10: { emoji: "🏆", color: "#f59e0b", name: "IT Ninja Elite" },
};

function generateCertificateDataURL({ username, phaseName, phaseEmoji, phaseColor, date }) {
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 620;
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, 900, 620);

  // Border gradient frame
  const grad = ctx.createLinearGradient(0, 0, 900, 620);
  grad.addColorStop(0, phaseColor);
  grad.addColorStop(0.5, "#8b5cf6");
  grad.addColorStop(1, phaseColor);
  ctx.strokeStyle = grad;
  ctx.lineWidth = 3;
  ctx.strokeRect(12, 12, 876, 596);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.strokeRect(20, 20, 860, 580);

  // Top decoration dots
  ctx.fillStyle = phaseColor;
  ctx.globalAlpha = 0.15;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(80 + i * 180, 310, 200, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // IT NINJA header
  ctx.font = "bold 13px monospace";
  ctx.fillStyle = phaseColor;
  ctx.textAlign = "center";
  ctx.letterSpacing = "0.3em";
  ctx.fillText("⚡ IT NINJA PLATFORM", 450, 70);

  // Certificate title
  ctx.font = "bold 36px sans-serif";
  ctx.fillStyle = "#f1f5f9";
  ctx.fillText("شهادة إتمام", 450, 140);

  // Divider line
  ctx.strokeStyle = phaseColor;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.4;
  ctx.beginPath();
  ctx.moveTo(150, 162);
  ctx.lineTo(750, 162);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Phase emoji
  ctx.font = "80px serif";
  ctx.textAlign = "center";
  ctx.fillText(phaseEmoji, 450, 270);

  // This certifies
  ctx.font = "16px sans-serif";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText("هذا يُشهد بأن", 450, 320);

  // Username
  ctx.font = "bold 42px sans-serif";
  ctx.fillStyle = "#f1f5f9";
  ctx.fillText(username, 450, 375);

  // Completion text
  ctx.font = "16px sans-serif";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText("قد أتمّ بنجاح مرحلة", 450, 415);

  // Phase name
  ctx.font = "bold 26px sans-serif";
  ctx.fillStyle = phaseColor;
  ctx.fillText(phaseName, 450, 455);

  // Stars decoration
  ctx.font = "20px serif";
  ctx.fillStyle = "#f59e0b";
  ["⭐", "⭐", "⭐"].forEach((s, i) => ctx.fillText(s, 390 + i * 60, 495));

  // Date
  ctx.font = "13px monospace";
  ctx.fillStyle = "#475569";
  ctx.fillText(date, 450, 540);

  // Bottom bar
  ctx.fillStyle = phaseColor;
  ctx.globalAlpha = 0.1;
  ctx.fillRect(12, 575, 876, 21);
  ctx.globalAlpha = 1;

  return canvas.toDataURL("image/png");
}

export default function CertificateGenerator({ phaseNumber = 1, phaseTitle = "", completedCount = 0, totalCount = 10 }) {
  const { user, profile } = useAuth();
  const [generated, setGenerated] = useState(false);
  const [dataURL, setDataURL] = useState("");
  const [copied, setCopied] = useState(false);

  const phaseData = PHASE_BADGES[phaseNumber] || PHASE_BADGES[1];
  const username = profile?.username || user?.email?.split("@")[0] || "IT Ninja";
  const progressPct = Math.round((completedCount / totalCount) * 100);
  const canGenerate = progressPct >= 80;

  const generate = useCallback(() => {
    const url = generateCertificateDataURL({
      username,
      phaseName: phaseData.name,
      phaseEmoji: phaseData.emoji,
      phaseColor: phaseData.color,
      date: new Date().toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" }),
    });
    setDataURL(url);
    setGenerated(true);
  }, [username, phaseData]);

  const download = () => {
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = `IT-Ninja-Certificate-${phaseData.name.replace(/\s/g, "-")}.png`;
    link.click();
  };

  const share = async () => {
    const text = `🎉 أتممت مرحلة "${phaseData.name}" على منصة IT Ninja!\n\n#ITNinja #التعلم_التقني #DevOps`;
    if (navigator.share) {
      await navigator.share({ title: "IT Ninja Certificate", text });
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 flex flex-col gap-5"
    >
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-400" />
          مولّد الشهادات الرقمية (Digital Certificates)
        </h3>
        <p className="text-xs text-slate-500 mt-1">أنجز 80%+ من المرحلة لتحصل على شهادتك</p>
      </div>

      {/* Phase cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {Object.entries(PHASE_BADGES).map(([num, badge]) => (
          <motion.div key={num} whileHover={{ scale: 1.04 }}
            className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-center cursor-default"
          >
            <div className="text-3xl mb-1.5">{badge.emoji}</div>
            <p className="text-[10px] font-bold text-slate-400 leading-tight">{badge.name}</p>
          </motion.div>
        ))}
      </div>

      {/* Generate section */}
      <div className="bg-slate-950/60 border border-slate-700/40 rounded-xl p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-200">شهادة المرحلة الحالية</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {phaseData.emoji} {phaseTitle || phaseData.name}
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black" style={{ color: phaseData.color }}>{progressPct}%</span>
            <p className="text-[10px] text-slate-500">من الإتمام</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-slate-900 rounded-full h-2 overflow-hidden">
          <motion.div className="h-full rounded-full" style={{ background: phaseData.color }}
            initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 0.8 }} />
        </div>

        {canGenerate ? (
          !generated ? (
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={generate}
              className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white cursor-pointer
                bg-gradient-to-r from-yellow-500 to-orange-500 shadow-[0_0_20px_rgba(234,179,8,0.3)]
                hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] transition-shadow"
            >
              <Sparkles className="w-4 h-4" /> توليد الشهادة
            </motion.button>
          ) : (
            <div className="flex flex-col gap-3">
              {/* Certificate preview */}
              <div className="rounded-xl overflow-hidden border border-slate-700">
                <img src={dataURL} alt="شهادة" className="w-full" />
              </div>
              <div className="flex gap-2">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={download}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm
                    bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" /> تحميل PNG
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={share}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm
                    bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                  {copied ? "تم النسخ!" : "مشاركة"}
                </motion.button>
              </div>
            </div>
          )
        ) : (
          <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3">
            <Star className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <p className="text-xs text-slate-500">أكمل <strong className="text-slate-300">{80 - progressPct}%</strong> أخرى لفتح الشهادة</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

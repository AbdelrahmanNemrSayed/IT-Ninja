import React from "react";
import { Trophy, Sparkles } from "lucide-react";
import { badgeNames } from "../utils/constants";

export default function CelebrationModal({ celebratedPhase, setCelebratedPhase }) {
  if (!celebratedPhase) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 max-w-md w-full text-center relative shadow-2xl">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-slate-900">
          <Trophy className="w-12 h-12 text-slate-950 stroke-[2.5]" />
        </div>
        <div className="mt-14 flex flex-col gap-3">
          <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> إنجاز جديد مذهل! <Sparkles className="w-3.5 h-3.5" />
          </span>
          <h3 className="text-xl font-black text-slate-100">تهانينا! لقد أكملت {celebratedPhase.shortTitle}</h3>
          <p className="text-xs text-slate-400">
            لقد أنجزت كافة المتطلبات والمصادر التعليمية لهذه المرحلة بنجاح. تم الفوز بشارة:
          </p>
          
          <div className="my-3 p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col items-center gap-2.5">
            <span className="text-4xl">🏆</span>
            <div>
              <h4 className="font-extrabold text-sm text-slate-100">{(badgeNames[celebratedPhase.id] || {}).title}</h4>
              <p className="text-[10px] text-slate-500 font-bold mt-1 font-mono">{(badgeNames[celebratedPhase.id] || {}).sub}</p>
            </div>
          </div>

          <button 
            onClick={() => setCelebratedPhase(null)}
            className="mt-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-450 hover:to-cyan-450 font-bold text-slate-950 text-xs shadow-md shadow-emerald-500/10 cursor-pointer"
          >
            متابعة التعلم
          </button>
        </div>
      </div>
    </div>
  );
}

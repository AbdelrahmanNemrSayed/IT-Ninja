import React from "react";
import { ArrowUp } from "lucide-react";

export default function Footer({ showScrollTop }) {
  return (
    <>
      <footer className="bg-slate-950 border-t border-slate-900 py-6 mt-16 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 IT Ninja Career Roadmap. تصميم وتطوير احترافي تفاعلي بالكامل.</p>
          <div className="flex items-center gap-4">
            <span className="text-[10px] bg-slate-900 border border-slate-850 px-2 py-0.5 rounded text-slate-455 font-bold">React Edition V3.0</span>
            <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-emerald-450 font-bold">Tailwind CSS Powered</span>
          </div>
        </div>
      </footer>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 left-6 z-50 p-3 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/50 shadow-lg shadow-black/60 hover:scale-110 active:scale-95 transition-all cursor-pointer group"
          title="العودة للأعلى"
          aria-label="العودة للأعلى"
        >
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}
    </>
  );
}

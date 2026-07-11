import React from "react";
import { ArrowUp } from "lucide-react";

export default function Footer({ showScrollTop }) {
  return (
    <>
      <footer className="bg-slate-950 border-t border-slate-900 py-6 mt-16 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© 2026 IT Ninja Career Roadmap. تصميم وتطوير احترافي تفاعلي بالكامل.</p>
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

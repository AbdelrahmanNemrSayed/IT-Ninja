import React, { useState, memo } from "react";
import { interviewQuestions, troubleshootingLog } from "../data/referenceData";
import { BookOpen, Search } from "lucide-react";

const ReferenceHub = memo(function ReferenceHub() {
  const [refTab, setRefTab] = useState("interview");
  const [interviewRole, setInterviewRole] = useState("all");
  const [interviewSearch, setInterviewSearch] = useState("");
  const [troubleshootSearch, setTroubleshootSearch] = useState("");

  return (
    <section 
      id="reference-hub" 
      className="bg-slate-900/20 border border-slate-900 rounded-2xl p-6 flex flex-col gap-6 scroll-mt-28"
    >
      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="font-extrabold text-base text-slate-100 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-450" />
          حقيبة النينجا المرجعية (IT Interview Prep & Troubleshooting Hub)
        </h3>
        <div className="flex gap-1.5 self-end sm:self-auto">
          <button
            onClick={() => setRefTab("interview")}
            className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              refTab === "interview"
                ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-md shadow-emerald-500/10 scale-105"
                : "bg-slate-950 border border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            أسئلة المقابلات الشخصية (50 Q&A)
          </button>
          <button
            onClick={() => setRefTab("troubleshoot")}
            className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              refTab === "troubleshoot"
                ? "bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 shadow-md shadow-rose-500/10 scale-105"
                : "bg-slate-950 border border-slate-900 text-slate-400 hover:text-slate-200"
            }`}
          >
            كتيب الأخطاء الشائعة (Troubleshooting Log)
          </button>
        </div>
      </div>

      {refTab === "interview" ? (
        <div className="flex flex-col gap-4">
          {/* Role Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-900 scrollbar-none">
            {[
              { id: "all", label: "جميع الأسئلة" },
              { id: "helpdesk", label: "الدعم الفني (Help Desk)" },
              { id: "sysadmin", label: "إدارة الأنظمة (SysAdmin)" },
              { id: "network", label: "هندسة الشبكات (Network Eng)" }
            ].map((role) => (
              <button
                key={role.id}
                onClick={() => setInterviewRole(role.id)}
                className={`text-[11px] px-3 py-1.5 rounded-lg border font-bold transition-all flex-shrink-0 cursor-pointer ${
                  interviewRole === role.id
                    ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 border-transparent shadow-md shadow-emerald-500/10 scale-105"
                    : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-750"
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>

          {/* Search in Interview Prep */}
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث في أسئلة المقابلات (مثال: DHCP, Active Directory, Nginx)..."
              className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-3 pr-10 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 text-right"
              value={interviewSearch}
              onChange={(e) => setInterviewSearch(e.target.value)}
              dir="rtl"
            />
            <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
          </div>

          {/* Questions grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1">
            {interviewQuestions
              .filter((q) => interviewRole === "all" || q.role === interviewRole)
              .filter((q) => {
                const query = interviewSearch.toLowerCase();
                return q.question.toLowerCase().includes(query) || q.answer.toLowerCase().includes(query);
              })
              .map((q, idx) => (
                <div key={q.id} className="bg-slate-950/40 border border-slate-900 rounded-xl p-4 flex flex-col gap-3 hover:border-slate-800 transition-all duration-300">
                  <div className="flex items-start justify-between gap-3 border-b border-slate-900 pb-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                      q.role === "helpdesk"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : q.role === "sysadmin"
                        ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                    }`}>
                      {q.role === "helpdesk" ? "Help Desk" : q.role === "sysadmin" ? "SysAdmin" : "Network Eng"}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">سؤال {idx + 1}</span>
                  </div>
                  <h4 className="font-extrabold text-xs text-slate-200 leading-relaxed text-right">{q.question}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-900/60 mt-1 select-text text-right whitespace-pre-wrap">
                    {q.answer}
                  </p>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Troubleshooting search */}
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث في سجل الأخطاء والحلول (مثال: DNS, SSH, 403 Forbidden)..."
              className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-3 pr-10 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20 text-right"
              value={troubleshootSearch}
              onChange={(e) => setTroubleshootSearch(e.target.value)}
              dir="rtl"
            />
            <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
          </div>

          {/* Troubleshooting Cards */}
          <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-1">
            {troubleshootingLog
              .filter((item) => {
                const query = troubleshootSearch.toLowerCase();
                return item.error.toLowerCase().includes(query) || item.scenario.toLowerCase().includes(query) || item.solution.toLowerCase().includes(query);
              })
              .map((item) => (
                <div key={item.id} className="bg-slate-950/40 border border-rose-500/10 rounded-xl p-5 flex flex-col gap-3.5 hover:border-rose-500/25 transition-all duration-300">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <span className="font-black text-xs text-rose-400">{item.error}</span>
                    <span className="text-[9px] font-extrabold bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-0.5 rounded">خطأ شائع وجذري</span>
                  </div>
                  <div className="text-xs text-slate-350 leading-relaxed text-right">
                    <span className="font-extrabold text-slate-400 block mb-1">السيناريو والأعراض:</span>
                    <p className="bg-slate-950/40 p-3 rounded border border-slate-900/60 leading-relaxed">{item.scenario}</p>
                  </div>
                  <div className="text-xs text-slate-350 leading-relaxed text-right">
                    <span className="font-extrabold text-slate-400 block mb-1">خطوات الحل والحل السريع:</span>
                    <div className="p-3 bg-[#070b12] text-slate-200 rounded-lg font-mono text-left whitespace-pre-wrap select-text border border-rose-500/5 leading-relaxed" dir="ltr">
                      {item.solution}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </section>
  );
});

export default ReferenceHub;

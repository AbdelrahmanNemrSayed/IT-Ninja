import React, { useState, memo } from "react";
import { cheatSheetsData, toolsData } from "../data/roadmapData";
import { Terminal, Search, ExternalLink } from "lucide-react";

const CheatSheetsHub = memo(function CheatSheetsHub() {
  const [cheatSearch, setCheatSearch] = useState("");
  const [cheatCategory, setCheatCategory] = useState("all");
  const [copiedCommand, setCopiedCommand] = useState("");

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCommand(text);
    setTimeout(() => setCopiedCommand(""), 2000);
  };

  return (
    <section 
      id="tools" 
      className="bg-slate-900/20 border border-slate-900 rounded-2xl p-6 flex flex-col gap-6 scroll-mt-28"
    >
      <div className="border-b border-slate-800 pb-4">
        <h3 className="font-extrabold text-base text-slate-100 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-purple-400" />
          مستودع بطاقات الأوامر السريعة والبحث الذكي (Cheat Sheets)
        </h3>
      </div>

      {/* Search and Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <input 
            type="text" 
            className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-3 pr-10 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 text-right"
            placeholder="ابحث عن أمر أو دالة (vlan, chmod, ip, AD)..."
            value={cheatSearch}
            onChange={(e) => setCheatSearch(e.target.value)}
            dir="rtl"
            aria-label="البحث في أوامر Cheat Sheets"
          />
          <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
        </div>
        
        <div className="flex gap-1 overflow-x-auto">
          {["all", "cisco", "linux", "powershell"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCheatCategory(cat)}
              className={`text-xs px-3.5 py-2 rounded-xl font-bold uppercase transition-all cursor-pointer ${
                cheatCategory === cat
                  ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-slate-950 border-transparent shadow-md shadow-purple-500/10 scale-105"
                  : "bg-slate-950 border border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-750"
              }`}
            >
              {cat === "all" ? "الكل" : cat === "cisco" ? "Cisco" : cat === "linux" ? "Linux" : "PowerShell"}
            </button>
          ))}
        </div>
      </div>

      {/* Commands Table */}
      <div className="bg-slate-950 border border-slate-900 rounded-xl overflow-hidden">
        <div className="max-h-[300px] overflow-y-auto overflow-x-auto">
          <table className="w-full text-right border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-900/80 text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-850">
                <th className="p-3 text-right">القسم</th>
                <th className="p-3 text-right">الأمر (Command)</th>
                <th className="p-3 text-right">الوصف والوظيفة</th>
                <th className="p-3 text-center w-24">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {cheatSheetsData
                .filter((item) => {
                  const matchesCategory = cheatCategory === "all" || item.category === cheatCategory;
                  const matchesSearch = item.command.toLowerCase().includes(cheatSearch.toLowerCase()) || 
                                        item.desc.includes(cheatSearch);
                  return matchesCategory && matchesSearch;
                })
                .map((item, idx) => (
                  <tr 
                    key={idx} 
                    className="text-xs border-b border-slate-900/60 hover:bg-slate-900/30 transition-colors"
                  >
                    <td className="p-3 font-semibold text-slate-400">
                      {item.category === "cisco" ? "Cisco IOS" : item.category === "linux" ? "Linux" : "PowerShell"}
                    </td>
                    <td className="p-3 font-mono text-purple-400 font-bold select-all text-left" dir="ltr">
                      {item.command}
                    </td>
                    <td className="p-3 text-slate-300 leading-relaxed">
                      {item.desc}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => copyToClipboard(item.command)}
                        className="text-[10px] font-bold px-2 py-1 rounded bg-slate-900 hover:bg-purple-500/10 border border-slate-800 hover:border-purple-500/30 text-slate-400 hover:text-purple-400 transition-all cursor-pointer"
                      >
                        {copiedCommand === item.command ? "تم!" : "نسخ"}
                      </button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Essential Tools list */}
      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">الأدوات والبرامج الأساسية للمحاكاة والتطبيقات:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {toolsData.map((tool, idx) => (
            <div key={idx} className="bg-slate-950 border border-slate-900 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-sm text-slate-200">{tool.name}</span>
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-850">
                    {tool.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{tool.desc}</p>
              </div>
              <div className="border-t border-slate-900 pt-3 flex justify-end">
                <a 
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>تحميل / زيارة</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default CheatSheetsHub;

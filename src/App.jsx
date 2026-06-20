import React, { useState, useEffect, useCallback } from "react";
import { roadmapData } from "./data/roadmapData";
import { totalCheckboxes, accentColors, getPlatformIcon } from "./utils/constants";
import { useProgress } from "./hooks/useProgress";
import { useUserData } from "./hooks/useUserData";
import { useBackup } from "./hooks/useBackup";

import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";
import Footer from "./layout/Footer";

import RoadmapPhase from "./components/RoadmapPhase";
import CheatSheetsHub from "./components/CheatSheetsHub";
import ReferenceHub from "./components/ReferenceHub";
import ConfettiEffect from "./components/ConfettiEffect";
import CelebrationModal from "./components/CelebrationModal";

import { Trophy, Award, Book, ExternalLink, Star, Wrench } from "lucide-react";
import { motion } from "framer-motion";

export default function App() {
  const {
    completedItems,
    setCompletedItems,
    certProgress,
    setCertProgress,
    toggleItem,
    togglePhaseMaster,
    getPhaseCompletionStats,
    handleCertChange
  } = useProgress();

  const {
    starredResources,
    notebookNotes,
    earnedBadges,
    setEarnedBadges,
    toggleStar,
    updateNote,
    bookmarkedItems
  } = useUserData();

  const {
    exportBackup,
    importBackup,
    resetAllProgress
  } = useBackup(completedItems, setCompletedItems, setCertProgress);

  const [activeFilter, setActiveFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedPhases, setExpandedPhases] = useState(() => {
    const firstIncomplete = roadmapData.find(phase => {
      const phaseItemIds = [
        ...phase.subtopics.map((t) => t.id),
        ...phase.resources.map((r) => r.id)
      ];
      return !phaseItemIds.every((id) => completedItems[id]);
    });
    return firstIncomplete ? { [firstIncomplete.id]: true } : {};
  });

  const [celebratedPhase, setCelebratedPhase] = useState(null);
  const [confettiActive, setConfettiActive] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const completedCount = Object.keys(completedItems).length;
  const globalProgressPercent = totalCheckboxes > 0 ? Math.round((completedCount / totalCheckboxes) * 100) : 0;

  const togglePhaseExpansion = useCallback((phaseId) => {
    setExpandedPhases(prev => ({
      ...prev,
      [phaseId]: !prev[phaseId]
    }));
  }, []);

  // Automated Badge/Milestone evaluation
  useEffect(() => {
    roadmapData.forEach((phase) => {
      const stats = getPhaseCompletionStats(phase);
      const isCompleted = stats.percent === 100 && stats.total > 0;
      
      if (isCompleted && !earnedBadges.includes(phase.id)) {
        setEarnedBadges((prev) => {
          if (prev.includes(phase.id)) return prev;
          return [...prev, phase.id];
        });
        setCelebratedPhase(phase);
        setConfettiActive(true);
        setTimeout(() => {
          setConfettiActive(false);
        }, 5000);
      }
    });
  }, [completedItems, earnedBadges, getPhaseCompletionStats, setEarnedBadges]);

  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      <ConfettiEffect active={confettiActive} />
      
      <CelebrationModal 
        celebratedPhase={celebratedPhase} 
        setCelebratedPhase={setCelebratedPhase} 
      />

      <Header 
        globalProgressPercent={globalProgressPercent}
        completedCount={completedCount}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        exportBackup={exportBackup}
        importBackup={importBackup}
        resetAllProgress={resetAllProgress}
      />

      <div className="flex-grow flex w-full max-w-7xl mx-auto px-4 py-6 gap-6 relative">
        <Sidebar 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          getPhaseCompletionStats={getPhaseCompletionStats}
          earnedBadges={earnedBadges}
          handleScrollTo={handleScrollTo}
        />

        <main className="flex-grow w-full lg:max-w-[calc(100%-17rem)] flex flex-col gap-8">
          
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.05)]"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full filter blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full filter blur-3xl pointer-events-none" />
            
            <div className="flex flex-col gap-2 relative z-10">
              <div className="flex items-center gap-2">
                <Trophy className="w-4.5 h-4.5 text-amber-400" />
                <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest">لوحة تحكم تفاعلية للمهندسين</span>
              </div>
              <h2 className="text-2xl font-black leading-tight text-slate-100">
                لوحة تحكم المسار المهني لمهندس الأنظمة والشبكات (IT Ninja)
              </h2>
            </div>
          </motion.section>

          {bookmarkedItems.length > 0 && (
            <motion.section 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-slate-900/40 backdrop-blur-md border border-amber-500/20 rounded-2xl p-5 flex flex-col gap-4 shadow-lg shadow-amber-500/5"
            >
              <div className="flex items-center justify-between border-b border-slate-850 pb-2.5">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4.5 h-4.5 text-amber-400 fill-amber-400 animate-pulse" />
                  <h3 className="font-extrabold text-sm text-slate-100">المصادر التعليمية المفضلة (Bookmarks Hub)</h3>
                </div>
                <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20">
                  {bookmarkedItems.length} مصادر
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {bookmarkedItems.map((res) => {
                  return (
                    <motion.div 
                      whileHover={{ scale: 1.02, y: -5 }}
                      key={res.id} 
                      className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-amber-500/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] transition-all duration-300"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[9px] font-bold text-slate-500">{res.phaseShortTitle}</span>
                          <button 
                            onClick={() => toggleStar(res.id)}
                            className="text-amber-400 hover:text-slate-400 p-0.5 transition-colors cursor-pointer"
                            title="إزالة من المفضلة"
                          >
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          </button>
                        </div>
                        <h4 className="font-bold text-xs text-slate-200 line-clamp-1">{res.title}</h4>
                        <p className="text-[11px] text-slate-450 mt-2 line-clamp-2 leading-relaxed">{res.desc}</p>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-900/80 pt-3 mt-4">
                        <div className="flex items-center gap-1">
                          {getPlatformIcon(res.platform)}
                          <span className="text-[9px] text-slate-500 font-semibold">{res.platform}</span>
                        </div>
                        <a 
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 cursor-pointer"
                        >
                          <span>دخول</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          )}

          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 flex flex-col gap-4 shadow-lg"
          >
            <div className="border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
                <Wrench className="w-4.5 h-4.5 text-cyan-400 animate-pulse" />
                أدوات العمل اليومية لمهندس الأنظمة (Essential Daily Tools for IT Professionals)
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  name: "PuTTY",
                  desc: "محاكي طرفي آمن لبروتوكولات SSH/Telnet للاتصال بالسيرفرات وإدارة أجهزة الشبكة برمجياً.",
                  url: "https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html"
                },
                {
                  name: "Tftpd64",
                  desc: "خادم وعميل TFTP خفيف الوزن ومتوافق مع IPv6 لنقل أنظمة التشغيل والترقيات لأجهزة الشبكة.",
                  url: "https://tftpd64.toomedim.fr/"
                },
                {
                  name: "Git for Windows",
                  desc: "نظام إدارة الإصدارات وتتبع التغييرات للأكواد والسكربتات وتشغيل أوامر Bash على نظام ويندوز.",
                  url: "https://gitforwindows.org/"
                }
              ].map((t) => (
                <motion.div 
                  whileHover={{ scale: 1.03, y: -5 }}
                  key={t.name} 
                  className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all duration-300"
                >
                  <div className="mb-4">
                    <span className="font-extrabold text-sm text-cyan-400 block mb-1">{t.name}</span>
                    <p className="text-xs text-slate-400 leading-relaxed">{t.desc}</p>
                  </div>
                  <a 
                    href={t.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-slate-350 hover:text-white flex items-center justify-center gap-1 py-1.5 bg-slate-900 border border-slate-800 rounded-lg hover:bg-cyan-500/10 hover:border-cyan-500/20 transition-all cursor-pointer"
                  >
                    <span>تحميل الأداة</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {roadmapData.map((phase) => (
            <RoadmapPhase
              key={phase.id}
              phase={phase}
              completedItems={completedItems}
              starredResources={starredResources}
              notebookNotes={notebookNotes}
              activeFilter={activeFilter}
              toggleItem={toggleItem}
              togglePhaseMaster={togglePhaseMaster}
              toggleStar={toggleStar}
              updateNote={updateNote}
              isOpen={!!expandedPhases[phase.id]}
              onToggle={() => togglePhaseExpansion(phase.id)}
            />
          ))}

          <CheatSheetsHub />

          <section 
            id="certifications" 
            className="bg-slate-900/20 border border-slate-900 rounded-2xl p-6 flex flex-col gap-6 scroll-mt-28"
          >
            <div className="border-b border-slate-800 pb-4">
              <h3 className="font-extrabold text-base text-slate-100 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                متتبع الشهادات المهنية العالمية (IT Certifications Track)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { key: "ccna", name: "Cisco CCNA 200-301", color: "cyan" },
                { key: "linux", name: "CompTIA Linux+", color: "amber" },
                { key: "security", name: "CompTIA Security+", color: "red" },
                { key: "cloud", name: "AWS Cloud Practitioner", color: "emerald" }
              ].map((cert) => {
                const styles = accentColors[cert.color];
                return (
                  <div key={cert.key} className="bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col gap-3 shadow-md">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-extrabold text-slate-200">{cert.name}</span>
                      <span className={`text-[10px] font-bold ${styles.text}`}>نسبة الجاهزية</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        step="5"
                        value={certProgress[cert.key]}
                        onChange={(e) => handleCertChange(cert.key, parseInt(e.target.value, 10))}
                        className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        aria-label={`تغيير نسبة جاهزية ${cert.name}`}
                      />
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-900 pt-2.5 mt-1.5">
                      <span className="font-mono text-sm text-slate-350 font-bold">{certProgress[cert.key]}%</span>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => handleCertChange(cert.key, certProgress[cert.key] + 10)}
                          className="px-2 py-0.5 rounded bg-slate-900 border border-slate-850 text-[10px] text-slate-400 hover:text-white cursor-pointer"
                        >
                          +10%
                        </button>
                        <button 
                          onClick={() => handleCertChange(cert.key, 0)}
                          className="px-2 py-0.5 rounded bg-slate-900 border border-slate-850 text-[10px] text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                        >
                          تصفير
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <ReferenceHub />

          <section 
            id="courses-hub" 
            className="bg-slate-900/20 border border-slate-900 rounded-2xl p-6 flex flex-col gap-6 scroll-mt-28"
          >
            <div className="border-b border-slate-800 pb-4">
              <h3 className="font-extrabold text-base text-slate-100 flex items-center gap-2">
                <Book className="w-5 h-5 text-emerald-400" />
                جدول المسارات والمصادر الشامل (Courses & Path Hub)
              </h3>
            </div>

            <div className="bg-slate-950 border border-slate-900 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-900 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-850">
                      <th className="p-3.5 text-right w-28">المرحلة</th>
                      <th className="p-3.5 text-right">المصدر / الكورس</th>
                      <th className="p-3.5 text-right">اللغة</th>
                      <th className="p-3.5 text-right">الوصف</th>
                      <th className="p-3.5 text-center w-28">الحالة</th>
                      <th className="p-3.5 text-center w-28">الرابط</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roadmapData.map((phase) => {
                      return phase.resources.map((res) => {
                        const isChecked = !!completedItems[res.id];
                        return (
                          <tr 
                            key={res.id} 
                            className="text-xs border-b border-slate-900/60 hover:bg-slate-900/20 transition-colors"
                          >
                            <td className="p-3 font-semibold text-slate-400">
                              {phase.title.split(":")[0]}
                            </td>
                            <td className="p-3 font-bold text-slate-200">
                              {res.title}
                            </td>
                            <td className="p-3">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                res.lang === "ar" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                              }`}>
                                {res.lang === "ar" ? "عربي 🇪🇬" : "إنجليزي 🇬🇧"}
                              </span>
                            </td>
                            <td className="p-3 text-slate-400 leading-relaxed max-w-sm line-clamp-2">
                              {res.desc}
                            </td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => toggleItem(res.id)}
                                className={`text-[10px] px-2 py-1 rounded border font-semibold transition-all cursor-pointer ${
                                  isChecked 
                                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                                    : "bg-slate-900 border-slate-850 text-slate-500"
                                }`}
                                aria-label={isChecked ? `تحديد ${res.title} كغير مكتمل` : `تحديد ${res.title} كمكتمل`}
                              >
                                {isChecked ? "✅ مكتمل" : "⏳ غير مكتمل"}
                              </button>
                            </td>
                            <td className="p-3 text-center">
                              <a 
                                href={res.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[10px] px-2 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded font-bold hover:bg-cyan-500/20 flex items-center gap-1 transition-all cursor-pointer inline-flex"
                              >
                                <span>زيارة</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </td>
                          </tr>
                        );
                      });
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

        </main>
      </div>

      <Footer showScrollTop={showScrollTop} />
    </div>
  );
}

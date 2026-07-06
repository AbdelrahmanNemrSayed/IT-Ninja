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
import HomeLabHub from "./components/HomeLabHub";
import PracticePlatformsGrid from "./components/PracticePlatformsGrid";
import ConfettiEffect from "./components/ConfettiEffect";
import CelebrationModal from "./components/CelebrationModal";
import ProfileSelector from "./components/ProfileSelector";
import AdvancedNinjaTools from "./components/AdvancedNinjaTools";
import CareerHub from "./components/CareerHub";
import RAIDVisualizer from "./components/RAIDVisualizer";
import RoadmapPlanner from "./components/RoadmapPlanner";
import NinjaAchievements from "./components/NinjaAchievements";
import AuthModal from "./components/AuthModal";
import UserProfile from "./components/UserProfile";
import Leaderboard from "./components/Leaderboard";
import AIAssistant from "./components/AIAssistant";
import CertificateGenerator from "./components/CertificateGenerator";
import DailyTodo from "./components/DailyTodo";
import StudyTimer from "./components/StudyTimer";
import GlobalSearch, { useGlobalSearch, GlobalSearchTrigger } from "./components/GlobalSearch";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import LinuxTerminal from "./components/LinuxTerminal";
import NetworkTopology from "./components/NetworkTopology";
import SubnetCalculator from "./components/SubnetCalculator";
import FirewallGenerator from "./components/FirewallGenerator";
import RaidCalculator from "./components/RaidCalculator";
import AutomationScriptHub from "./components/AutomationScriptHub";

import { Trophy, Award, Book, ExternalLink, Star, Wrench } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProfileProvider, useProfile } from "./context/ProfileContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <AppContent />
      </ProfileProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const { activeProfileId } = useProfile();
  const { user, authModal, setAuthModal, recoveryMode } = useAuth();
  const { isOpen: searchOpen, setIsOpen: setSearchOpen } = useGlobalSearch();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [userProfileOpen, setUserProfileOpen] = useState(false);
  
  // Navigation / Multi-Page routing state
  const [activeView, setActiveView] = useState("roadmap");

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
    setStarredResources,
    notebookNotes,
    setNotebookNotes,
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
  } = useBackup(
    completedItems, setCompletedItems,
    certProgress, setCertProgress,
    starredResources, setStarredResources,
    notebookNotes, setNotebookNotes,
    earnedBadges, setEarnedBadges
  );

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
  const totalItemsCount = totalCheckboxes || 1;
  const globalProgressPercent = Math.round((completedCount / totalItemsCount) * 100) || 0;

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
    setActiveView("roadmap");
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
    setSidebarOpen(false);
  };

  if (recoveryMode) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <AnimatePresence>
          <AuthModal key="auth-modal" />
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div key={activeProfileId} className="min-h-screen ninja-bg text-slate-100 flex flex-col select-none">
      <ConfettiEffect active={confettiActive} />
      
      <CelebrationModal 
        celebratedPhase={celebratedPhase} 
        setCelebratedPhase={setCelebratedPhase} 
      />

      {/* Auth Modal */}
      <AnimatePresence>
        {authModal && <AuthModal key="auth-modal" />}
      </AnimatePresence>

      {/* User Profile Modal */}
      <AnimatePresence>
        {userProfileOpen && <UserProfile key="user-profile" onClose={() => setUserProfileOpen(false)} />}
      </AnimatePresence>

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
        onOpenProfileModal={() => setProfileModalOpen(true)}
        onOpenUserProfile={() => setUserProfileOpen(true)}
        onSearchClick={() => setSearchOpen(true)}
      />

      <div className="flex-grow flex w-full max-w-7xl mx-auto px-4 py-6 gap-6 relative">
        <Sidebar 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          getPhaseCompletionStats={getPhaseCompletionStats}
          earnedBadges={earnedBadges}
          handleScrollTo={handleScrollTo}
          activeView={activeView}
          setActiveView={setActiveView}
        />

        <main className="flex-grow w-full lg:max-w-[calc(100%-17rem)] flex flex-col gap-8">
          
          {/* PAGE 1: ROADMAP & CURRICULUM */}
          {activeView === "roadmap" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
              <motion.section 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden shadow-lg text-right"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full filter blur-3xl pointer-events-none" />
                <div className="flex flex-col gap-2 relative z-10 flex-row-reverse justify-between items-center sm:flex-row">
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end flex-row-reverse">
                      <Trophy className="w-4.5 h-4.5 text-amber-400" />
                      <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest">خريطة الطريق والمسار المهني</span>
                    </div>
                    <h2 className="text-2xl font-black leading-tight text-slate-100 mt-2">
                      مسار البنية التحتية والأنظمة لمهندسي تكنولوجيا المعلومات
                    </h2>
                  </div>
                </div>
              </motion.section>

              {bookmarkedItems.length > 0 && (
                <div className="bg-slate-900/40 backdrop-blur-md border border-amber-500/20 rounded-2xl p-5 flex flex-col gap-4 shadow-lg text-right">
                  <div className="flex items-center justify-between border-b border-slate-850 pb-2.5 flex-row-reverse">
                    <div className="flex items-center gap-1.5 flex-row-reverse">
                      <Star className="w-4.5 h-4.5 text-amber-400 fill-amber-400 animate-pulse" />
                      <h3 className="font-extrabold text-sm text-slate-100">المصادر المفضلة</h3>
                    </div>
                    <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full">{bookmarkedItems.length} مصادر</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {bookmarkedItems.map((res) => (
                      <div key={res.id} className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-amber-500/50 transition-all text-right">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[9px] font-bold text-slate-500">{res.phaseShortTitle}</span>
                            <button onClick={() => toggleStar(res.id)} className="text-amber-400 hover:text-slate-400 cursor-pointer"><Star className="w-3.5 h-3.5 fill-amber-400" /></button>
                          </div>
                          <h4 className="font-bold text-xs text-slate-200 line-clamp-1">{res.title}</h4>
                        </div>
                        <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 mt-4 flex items-center justify-end gap-0.5">
                          <span>دخول</span><ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <NinjaAchievements />
                <Leaderboard currentUserId={user?.id} />
              </div>

              <CareerHub />
              <RoadmapPlanner />

              {/* Render Phases */}
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

              <section id="certifications" className="bg-slate-900/20 border border-slate-900 rounded-2xl p-6 flex flex-col gap-6 scroll-mt-28 text-right">
                <div className="border-b border-slate-800 pb-4 flex justify-start items-center gap-2 flex-row-reverse">
                  <Award className="w-5 h-5 text-amber-400" />
                  <h3 className="font-extrabold text-base text-slate-100">متتبع الشهادات المهنية العالمية (IT Certifications Track)</h3>
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
                      <div key={cert.key} className="bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col gap-3">
                        <span className="text-xs font-extrabold text-slate-200">{cert.name}</span>
                        <input type="range" min="0" max="100" step="5" value={certProgress[cert.key]} onChange={(e) => handleCertChange(cert.key, parseInt(e.target.value, 10))} className="w-full h-1.5 cursor-pointer accent-cyan-500" />
                        <div className="flex items-center justify-between border-t border-slate-900 pt-2.5 mt-1 text-xs">
                          <span className="font-mono font-bold text-slate-350">{certProgress[cert.key]}%</span>
                          <button onClick={() => handleCertChange(cert.key, certProgress[cert.key] + 10)} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-850 text-[10px] text-slate-400 cursor-pointer">+10%</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </motion.div>
          )}

          {/* PAGE 2: INTERACTIVE TOOLS & SIMULATORS */}
          {activeView === "tools" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
              <NetworkTopology />
              <AdvancedNinjaTools />
              <LinuxTerminal />
              <RaidCalculator />
              <RAIDVisualizer />
              <SubnetCalculator />
              <FirewallGenerator />
            </motion.div>
          )}

          {/* PAGE 3: REFERENCE & CHEATSHEETS */}
          {activeView === "reference" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
              <ReferenceHub />
              <CheatSheetsHub />
              <AutomationScriptHub />
              
              <motion.section 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 flex flex-col gap-4 text-right"
              >
                <div className="border-b border-slate-800 pb-3 flex justify-start items-center gap-2 flex-row-reverse">
                  <Wrench className="w-4.5 h-4.5 text-cyan-400" />
                  <h3 className="font-extrabold text-sm text-slate-100">أدوات العمل اليومية لمهندس الأنظمة (Essential Daily Tools)</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: "PuTTY", desc: "محاكي طرفي آمن لبروتوكولات SSH/Telnet للاتصال بالسيرفرات وإدارة أجهزة الشبكة برمجياً.", url: "https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html" },
                    { name: "Tftpd64", desc: "خادم وعميل TFTP خفيف الوزن ومتوافق مع IPv6 لنقل أنظمة التشغيل والترقيات لأجهزة الشبكة.", url: "https://tftpd64.toomedim.fr/" },
                    { name: "Git for Windows", desc: "نظام إدارة الإصدارات وتتبع التغييرات للأكواد والسكربتات وتشغيل أوامر Bash على نظام ويندوز.", url: "https://gitforwindows.org/" }
                  ].map((t) => (
                    <div key={t.name} className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-cyan-500/50 transition-all text-right">
                      <div className="mb-4">
                        <span className="font-extrabold text-sm text-cyan-400 block mb-1">{t.name}</span>
                        <p className="text-xs text-slate-400 leading-relaxed">{t.desc}</p>
                      </div>
                      <a href={t.url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-slate-350 hover:text-white flex items-center justify-center gap-1 py-1.5 bg-slate-900 border border-slate-800 rounded-lg transition-all cursor-pointer">
                        <span>تحميل الأداة</span>
                      </a>
                    </div>
                  ))}
                </div>
              </motion.section>
            </motion.div>
          )}

          {/* PAGE 4: PERFORMANCE ANALYTICS & TODAY TODO */}
          {activeView === "analytics" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
              <AnalyticsDashboard />
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <DailyTodo />
                <CertificateGenerator
                  phaseNumber={1}
                  phaseTitle="Network Foundations"
                  completedCount={completedCount}
                  totalCount={totalCheckboxes}
                />
              </div>

              <HomeLabHub />
              <PracticePlatformsGrid />
            </motion.div>
          )}

        </main>
      </div>

      <Footer />
      <AIAssistant />
      <GlobalSearch />
      <StudyTimer />
      <ProfileSelector open={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
    </div>
  );
}

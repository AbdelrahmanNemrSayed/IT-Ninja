import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Download, X, HelpCircle, Share } from "lucide-react";

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstaller, setShowInstaller] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 1. Detect if PWA is already installed and running standalone
    const isRunningStandalone = window.matchMedia("(display-mode: standalone)").matches 
      || window.navigator.standalone 
      || false;
    setIsStandalone(isRunningStandalone);

    // 2. Detect iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const detectIOS = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(detectIOS);

    // 3. Listen for browser install prompt (Android, Chrome, Edge)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      // Store prompt to trigger later
      setDeferredPrompt(e);
      
      // Show installer if not dismissed recently
      const dismissed = localStorage.getItem("pwa-installer-dismissed");
      if (!dismissed && !isRunningStandalone) {
        setShowInstaller(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 4. For iOS: show setup instructions if running in browser
    if (detectIOS && !isRunningStandalone) {
      const dismissed = localStorage.getItem("pwa-installer-dismissed");
      if (!dismissed) {
        // Show after a small delay to not block initial paint
        const timer = setTimeout(() => {
          setShowInstaller(true);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Hide UI
    setShowInstaller(false);
    
    // Show prompt
    deferredPrompt.prompt();
    
    // Check outcome
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`PWA installation outcome: ${outcome}`);
    
    // Reset deferred prompt
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstaller(false);
    // Remember dismissal for 7 days
    localStorage.setItem("pwa-installer-dismissed", "true");
  };

  if (!showInstaller || isStandalone) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed bottom-4 left-4 z-50 max-w-sm w-[calc(100vw-2rem)] glass-card rounded-2xl p-5 shadow-2xl border border-cyan-500/30 text-right flex flex-col gap-3.5"
      >
        {/* Glow accent */}
        <div className="absolute inset-0 bg-radial-gradient from-cyan-500/5 to-transparent pointer-events-none rounded-2xl" />

        {/* Header */}
        <div className="flex justify-between items-start flex-row-reverse relative">
          <div className="flex items-center gap-2.5 flex-row-reverse">
            <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
              <Smartphone className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-100">تثبيت IT Ninja كـ App 📱</h4>
              <p className="text-[9px] text-slate-400 mt-0.5">تصفح خريطة الطريق والمحاكيات بسلاسة دون شريط المتصفح</p>
            </div>
          </div>
          <button 
            onClick={handleDismiss}
            className="text-slate-500 hover:text-slate-350 p-1 cursor-pointer transition-colors"
            aria-label="إغلاق التنبيه"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Instructions/Action */}
        {isIOS ? (
          /* iOS Guide */
          <div className="flex flex-col gap-2.5 border-t border-slate-850/80 pt-3">
            <span className="text-[10px] text-slate-300 font-bold leading-relaxed block">
              لتثبيت التطبيق على جهاز الـ iPhone/iPad الخاص بك:
            </span>
            <ol className="text-[9px] text-slate-400 flex flex-col gap-1.5 list-decimal list-inside pr-1 leading-relaxed">
              <li>
                اضغط على أيقونة <strong>المشاركة (Share)</strong> <Share className="w-3.5 h-3.5 inline mx-0.5 text-cyan-400" /> أسفل شاشة Safari.
              </li>
              <li>
                مرر القائمة لأسفل واختر <strong>إضافة إلى الصفحة الرئيسية (Add to Home Screen)</strong>.
              </li>
              <li>
                انقر على <strong>إضافة (Add)</strong> في الزاوية العلوية لتأكيد التثبيت.
              </li>
            </ol>
            <button
              onClick={handleDismiss}
              className="w-full bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-extrabold py-2 rounded-xl hover:text-white cursor-pointer transition-all mt-1"
            >
              حسناً، فهمت
            </button>
          </div>
        ) : (
          /* Android/Chrome prompt button */
          <div className="flex gap-2 border-t border-slate-850/80 pt-3 flex-row-reverse">
            <button
              onClick={handleInstallClick}
              className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[10px] font-black py-2.5 rounded-xl flex items-center justify-center gap-1.5 flex-row-reverse cursor-pointer shadow-lg shadow-cyan-500/10 transition-all"
            >
              <Download className="w-3.5 h-3.5" /> تثبيت التطبيق الآن
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-[10px] font-bold rounded-xl cursor-pointer transition-all"
            >
              ليس الآن
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, RotateCw, Layers, ShieldCheck, Activity, 
  Server, Cpu, Database, Network, PowerOff, Sparkles
} from "lucide-react";

export default function SystemArchitectureSimulator() {
  const [web1Alive, setWeb1Alive] = useState(true);
  const [web2Alive, setWeb2Alive] = useState(true);
  const [simulateTraffic, setSimulateTraffic] = useState(false);
  const [trafficRoute, setTrafficRoute] = useState([]); // Array of steps
  const [logs, setLogs] = useState(["🖥️ نظام محاكاة معماريات الأنظمة جاهز..."]);
  const [activeTab, setActiveTab] = useState("traffic"); // traffic, config
  const [xpEarned, setXpEarned] = useState(false);

  const addLog = (msg) => {
    setLogs(prev => [...prev, msg]);
  };

  const runTrafficTest = async () => {
    if (simulateTraffic) return;
    
    addLog("⚡ جاري توجيه طلبات المستخدمين (User Request Flow)...");
    
    // Determine route based on server status
    if (!web1Alive && !web2Alive) {
      setSimulateTraffic(true);
      setTrafficRoute(["client", "lb"]);
      await new Promise(resolve => setTimeout(resolve, 1000));
      addLog("❌ خطأ: تعذر الوصول للخدمة! كلا خادمي الويب معطلين (503 Service Unavailable).");
      setSimulateTraffic(false);
      return;
    }

    setSimulateTraffic(true);
    
    // Path 1: Client to Load Balancer
    setTrafficRoute(["client", "lb"]);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Path 2: Load Balancer to Web Server (Round Robin / Failover)
    let selectedWeb = "web1";
    if (web1Alive && web2Alive) {
      // Load balance evenly, default to web1 for visual path
      selectedWeb = Math.random() > 0.5 ? "web1" : "web2";
    } else if (web1Alive) {
      selectedWeb = "web1";
    } else {
      selectedWeb = "web2";
    }

    setTrafficRoute(["client", "lb", selectedWeb]);
    addLog(`🔀 قام موازن الحمل (Nginx) بتوجيه الطلب إلى: ${selectedWeb === "web1" ? "Web-01" : "Web-02"}`);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Path 3: Web Server to DB / Cache
    setTrafficRoute(["client", "lb", selectedWeb, "db"]);
    addLog("🗄️ جاري الاستعلام من قاعدة البيانات وإرجاع النتيجة للعميل.");
    await new Promise(resolve => setTimeout(resolve, 1000));

    addLog("✅ استجابة ناجحة (HTTP 200 OK) تم إرجاعها للمستخدم.");
    setSimulateTraffic(false);

    // Trigger success if failover was successfully demonstrated
    if ((!web1Alive && web2Alive) || (web1Alive && !web2Alive)) {
      if (!xpEarned) {
        setXpEarned(true);
        window.dispatchEvent(new CustomEvent("trigger-confetti"));
        addLog("🏆 رائع! لقد أثبتت نجاح نظام عدم الفشل (High Availability / Failover) بنجاح!");
      }
    }
  };

  return (
    <div id="architecture-simulator" className="glass-card rounded-2xl p-6 flex flex-col gap-6 shadow-lg text-right scroll-mt-28">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 flex justify-between items-center flex-row-reverse flex-wrap gap-2">
        <div>
          <h3 className="font-extrabold text-sm text-slate-100 flex items-center justify-start gap-2 flex-row-reverse">
            <Layers className="w-5 h-5 text-emerald-400" />
            مصمم ومحاكي معمارية الأنظمة (System Architecture Simulator)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            تعلم كيف تقوم بتوزيع الأحمال (Load Balancing) وتأمين استقرار الأنظمة ضد الأعطال (High Availability).
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex gap-2 flex-row-reverse">
          <button
            onClick={runTrafficTest}
            disabled={simulateTraffic}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-850 text-slate-950 font-black px-4 py-1.5 rounded-lg text-[10px] flex items-center gap-1.5 flex-row-reverse cursor-pointer transition-colors"
          >
            <Play className="w-3.5 h-3.5" /> تشغيل تدفق الزيارات
          </button>
          
          <button
            onClick={() => {
              setWeb1Alive(true);
              setWeb2Alive(true);
              setLogs(["🔄 تم إعادة تشغيل جميع الخوادم."]);
            }}
            className="bg-slate-900 border border-slate-800 hover:text-white text-slate-400 font-bold px-3 py-1.5 rounded-lg text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCw className="w-3 h-3" /> إعادة تشغيل الكل
          </button>
        </div>
      </div>

      {/* Main interactive architecture canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: System Diagram Canvas */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <span className="text-[10px] text-slate-400 font-extrabold flex items-center gap-1.5 flex-row-reverse">
            <Network className="w-3.5 h-3.5 text-emerald-400" />
            البنية التحتية التفاعلية للشبكة (Architecture Blueprint Canvas)
          </span>

          <div className="bg-slate-950 border border-slate-850 p-6 rounded-xl h-80 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-radial-gradient from-emerald-500/5 to-transparent pointer-events-none" />

            {/* Layout representation */}
            <div className="flex justify-between items-center relative my-auto w-full px-4 flex-row-reverse">
              
              {/* Client Browser */}
              <div className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center bg-slate-900/60 border-slate-850 ${
                  trafficRoute.includes("client") ? "border-emerald-500 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.1)]" : ""
                }`}>
                  <Cpu className="w-5 h-5 text-slate-400" />
                </div>
                <span className="text-[9px] font-black text-slate-350">العميل (Client)</span>
              </div>

              {/* Connector lines and Load Balancer */}
              <div className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center bg-slate-900/60 border-slate-850 ${
                  trafficRoute.includes("lb") ? "border-emerald-500 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.1)]" : ""
                }`}>
                  <Network className="w-5 h-5 text-slate-400" />
                </div>
                <span className="text-[9px] font-black text-slate-350">موازن الحمل (LB)</span>
              </div>

              {/* Web Server Tier (Two stacked) */}
              <div className="flex flex-col gap-4">
                
                {/* Web 01 */}
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-14 h-11 rounded-lg border flex items-center justify-center relative transition-all ${
                    !web1Alive 
                      ? "border-rose-500 bg-rose-500/5 text-rose-500" 
                      : trafficRoute.includes("web1") 
                      ? "border-emerald-500 bg-emerald-500/5 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                      : "border-slate-850 bg-slate-900/60 text-slate-400"
                  }`}>
                    <Server className="w-5 h-5" />
                    
                    {/* Kill server button */}
                    <button
                      onClick={() => {
                        setWeb1Alive(!web1Alive);
                        addLog(web1Alive ? "🚨 تم إيقاف خادم Web-01." : "🟢 تم تشغيل خادم Web-01.");
                      }}
                      className="absolute -top-1.5 -left-1.5 p-0.5 rounded-full bg-slate-900 border border-slate-800 hover:border-rose-500 transition-colors cursor-pointer"
                      title={web1Alive ? "إيقاف الخادم" : "تشغيل الخادم"}
                    >
                      <PowerOff className="w-2.5 h-2.5 text-rose-500" />
                    </button>
                  </div>
                  <span className="text-[8px] font-black text-slate-400">Web-01</span>
                </div>

                {/* Web 02 */}
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-14 h-11 rounded-lg border flex items-center justify-center relative transition-all ${
                    !web2Alive 
                      ? "border-rose-500 bg-rose-500/5 text-rose-500" 
                      : trafficRoute.includes("web2") 
                      ? "border-emerald-500 bg-emerald-500/5 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                      : "border-slate-850 bg-slate-900/60 text-slate-400"
                  }`}>
                    <Server className="w-5 h-5" />

                    <button
                      onClick={() => {
                        setWeb2Alive(!web2Alive);
                        addLog(web2Alive ? "🚨 تم إيقاف خادم Web-02." : "🟢 تم تشغيل خادم Web-02.");
                      }}
                      className="absolute -top-1.5 -left-1.5 p-0.5 rounded-full bg-slate-900 border border-slate-800 hover:border-rose-500 transition-colors cursor-pointer"
                      title={web2Alive ? "إيقاف الخادم" : "تشغيل الخادم"}
                    >
                      <PowerOff className="w-2.5 h-2.5 text-rose-500" />
                    </button>
                  </div>
                  <span className="text-[8px] font-black text-slate-400">Web-02</span>
                </div>

              </div>

              {/* Database Server */}
              <div className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center bg-slate-900/60 border-slate-850 ${
                  trafficRoute.includes("db") ? "border-emerald-500 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.1)]" : ""
                }`}>
                  <Database className="w-5 h-5 text-slate-400" />
                </div>
                <span className="text-[9px] font-black text-slate-350">قاعدة البيانات (DB)</span>
              </div>

            </div>

            {/* Hint message explaining HA failover */}
            <div className="text-right border-t border-slate-850/60 pt-2.5">
              <span className="text-[9px] text-slate-500 font-extrabold block">💡 سيناريو اختبار التعطل (Failover Scenario):</span>
              <p className="text-[8px] text-slate-400 leading-normal mt-0.5">
                قم بإيقاف أحد الخوادم (Web-01 أو Web-02) باستخدام زر الطاقة الأحمر الصغير، ثم انقر على "تشغيل تدفق الزيارات" لمشاهدة كيف يعيد النظام توجيه الطلبات للخادم الآخر دون توقف الخدمة.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Logging Console */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <span className="text-[10px] text-slate-400 font-extrabold flex items-center gap-1.5 flex-row-reverse">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            سجل موازن الحمل والتوجيه (Load Balancer Logs)
          </span>

          <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl h-80 overflow-y-auto flex flex-col gap-1 text-right font-mono text-[9px]">
            {logs.map((log, idx) => (
              <div key={idx} className={
                log.startsWith("❌") 
                  ? "text-rose-400" 
                  : log.startsWith("✅") || log.startsWith("🏆")
                  ? "text-emerald-400 font-bold" 
                  : "text-slate-300"
              }>
                {log}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

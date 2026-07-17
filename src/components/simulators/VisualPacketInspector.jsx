import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, RotateCw, Globe, HelpCircle, Network, ArrowLeft, ArrowRight,
  Eye, Cpu, Layers, HardDrive, CheckCircle2
} from "lucide-react";

const PROTOCOLS = {
  dns: {
    name: "استعلام DNS (DNS Query Resolution)",
    desc: "كيف يقوم جهازك بالبحث عن عنوان IP لموقع ويب عن طريق خادم أسماء النطاقات.",
    steps: [
      {
        title: "إرسال طلب استعلام DNS (Recursive Query)",
        from: "client", to: "server",
        desc: "العميل يسأل: ما هو الـ IP الخاص بـ google.com؟",
        packet: {
          srcMac: "AA:BB:CC:11:22:33", dstMac: "DD:EE:FF:44:55:66",
          srcIp: "192.168.1.10", dstIp: "8.8.8.8",
          srcPort: "54321", dstPort: "53 (DNS)",
          protocol: "UDP (DNS Query)",
          payload: "Query: google.com (A Record)"
        }
      },
      {
        title: "استجابة خادم DNS بالـ IP الصحيح",
        from: "server", to: "client",
        desc: "خادم الأسماء يجيب: العنوان هو 142.250.190.46",
        packet: {
          srcMac: "DD:EE:FF:44:55:66", dstMac: "AA:BB:CC:11:22:33",
          srcIp: "8.8.8.8", dstIp: "192.168.1.10",
          srcPort: "53 (DNS)", dstPort: "54321",
          protocol: "UDP (DNS Response)",
          payload: "Answer: 142.250.190.46, TTL: 300"
        }
      }
    ]
  },
  tcp_handshake: {
    name: "مصافحة TCP الثلاثية (TCP 3-Way Handshake)",
    desc: "عملية تأسيس اتصال موثوق وآمن بين العميل والخادم قبل نقل أي بيانات.",
    steps: [
      {
        title: "1. إرسال SYN (Synchronize)",
        from: "client", to: "server",
        desc: "العميل يطلب فتح اتصال جديد ويرسل رقم تسلسلي عشوائي (Seq = X).",
        packet: {
          srcMac: "AA:BB:CC:11:22:33", dstMac: "FF:FF:FF:FF:FF:FF",
          srcIp: "192.168.1.10", dstIp: "142.250.190.46",
          srcPort: "49152", dstPort: "80 (HTTP)",
          protocol: "TCP (SYN)",
          payload: "Flags: [SYN], Seq: 1000, Ack: 0"
        }
      },
      {
        title: "2. استجابة SYN-ACK (Synchronize-Acknowledge)",
        from: "server", to: "client",
        desc: "الخادم يوافق على الاتصال ويرسل رقمه التسلسلي مع تأكيد رقم العميل (Ack = X+1).",
        packet: {
          srcMac: "FF:FF:FF:FF:FF:FF", dstMac: "AA:BB:CC:11:22:33",
          srcIp: "142.250.190.46", dstIp: "192.168.1.10",
          srcPort: "80 (HTTP)", dstPort: "49152",
          protocol: "TCP (SYN-ACK)",
          payload: "Flags: [SYN, ACK], Seq: 2000, Ack: 1001"
        }
      },
      {
        title: "3. إرسال ACK (Acknowledge)",
        from: "client", to: "server",
        desc: "العميل يؤكد الاستلام وبذلك يكتمل تأسيس القناة الموثوقة لبدء التراسل.",
        packet: {
          srcMac: "AA:BB:CC:11:22:33", dstMac: "FF:FF:FF:FF:FF:FF",
          srcIp: "192.168.1.10", dstIp: "142.250.190.46",
          srcPort: "49152", dstPort: "80 (HTTP)",
          protocol: "TCP (ACK)",
          payload: "Flags: [ACK], Seq: 1001, Ack: 2001"
        }
      }
    ]
  }
};

export default function VisualPacketInspector() {
  const [selectedProto, setSelectedProto] = useState("dns");
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [logs, setLogs] = useState(["🖥️ جاهز لبدء فحص حزم الشبكة تفاعلياً..."]);
  const [packetPos, setPacketPos] = useState("client"); // client, transit, server

  const proto = PROTOCOLS[selectedProto];
  const step = proto.steps[activeStep];

  useEffect(() => {
    setActiveStep(0);
    setPacketPos("client");
    setIsPlaying(false);
    setLogs([`📂 تم تحميل السيناريو: ${PROTOCOLS[selectedProto].name}`]);
  }, [selectedProto]);

  const handleNextStep = () => {
    if (activeStep < proto.steps.length - 1) {
      const next = activeStep + 1;
      setActiveStep(next);
      setPacketPos(proto.steps[next].from);
      setLogs(prev => [...prev, `➡️ الانتقال للخطوة ${next + 1}: ${proto.steps[next].title}`]);
    }
  };

  const handlePrevStep = () => {
    if (activeStep > 0) {
      const prev = activeStep - 1;
      setActiveStep(prev);
      setPacketPos(proto.steps[prev].from);
      setLogs(prevLogs => [...prevLogs, `⬅️ الرجوع للخطوة ${prev + 1}: ${proto.steps[prev].title}`]);
    }
  };

  const startAnimation = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    
    // Simulate packet in transit
    setPacketPos("transit");
    setLogs(prev => [...prev, `⚡ الحزمة تتحرك الآن من ${step.from} إلى ${step.to}...`]);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setPacketPos(step.to);
    setLogs(prev => [...prev, `✅ وصلت الحزمة بنجاح إلى ${step.to}.`]);
    setIsPlaying(false);
  };

  return (
    <div id="packet-inspector" className="glass-card rounded-2xl p-6 flex flex-col gap-6 shadow-lg text-right scroll-mt-28">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 flex justify-between items-center flex-row-reverse flex-wrap gap-2">
        <div>
          <h3 className="font-extrabold text-sm text-slate-100 flex items-center justify-start gap-2 flex-row-reverse">
            <Network className="w-5 h-5 text-cyan-400" />
            محاكي تحليل حزم الشبكات والتراسل (Visual Packet Inspector)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            شاهد حزم البيانات الحية وهي تعبر الشبكة، وحلل ترويسات بروتوكولات الاتصال (Packet Headers).
          </p>
        </div>

        {/* Protocol Selector */}
        <div className="flex items-center gap-2 flex-row-reverse">
          <span className="text-[10px] text-slate-400 font-bold">البروتوكول:</span>
          <select
            value={selectedProto}
            onChange={(e) => setSelectedProto(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-330 hover:border-cyan-500/30 transition-colors cursor-pointer font-bold"
          >
            {Object.keys(PROTOCOLS).map(key => (
              <option key={key} value={key}>{PROTOCOLS[key].name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Wireframe Packet Header Inspection */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <span className="text-[10px] text-slate-400 font-extrabold flex items-center gap-1.5 flex-row-reverse">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            مُحلل الحزمة التفصيلي (Packet Header Fields)
          </span>

          <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col gap-2 font-mono text-[9px] text-right">
            <div className="border border-slate-850 bg-slate-900/40 p-2.5 rounded-lg">
              <span className="text-[8px] text-slate-500 font-bold block mb-1">DATA LINK LAYER (L2 Ethernet)</span>
              <div className="flex justify-between items-center flex-row-reverse">
                <span className="text-slate-400">Src MAC: {step.packet.srcMac}</span>
                <span className="text-slate-400">Dst MAC: {step.packet.dstMac}</span>
              </div>
            </div>

            <div className="border border-slate-850 bg-slate-900/40 p-2.5 rounded-lg">
              <span className="text-[8px] text-slate-500 font-bold block mb-1">NETWORK LAYER (L3 IP)</span>
              <div className="flex justify-between items-center flex-row-reverse">
                <span className="text-cyan-400">Src IP: {step.packet.srcIp}</span>
                <span className="text-cyan-400">Dst IP: {step.packet.dstIp}</span>
              </div>
            </div>

            <div className="border border-slate-850 bg-slate-900/40 p-2.5 rounded-lg">
              <span className="text-[8px] text-slate-500 font-bold block mb-1">TRANSPORT LAYER (L4 TCP/UDP)</span>
              <div className="flex justify-between items-center flex-row-reverse">
                <span className="text-amber-400 font-bold">{step.packet.protocol}</span>
                <span className="text-slate-400">Src Port: {step.packet.srcPort} | Dst Port: {step.packet.dstPort}</span>
              </div>
            </div>

            <div className="border border-slate-850 bg-slate-900/40 p-2.5 rounded-lg">
              <span className="text-[8px] text-slate-500 font-bold block mb-1">APPLICATION LAYER (L7 Payload)</span>
              <div className="text-left font-bold text-slate-200 mt-1 leading-normal text-[10px]" style={{ direction: "ltr" }}>
                {step.packet.payload}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Visual Node-to-Node diagram */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex justify-between items-center flex-row-reverse">
            <span className="text-[10px] text-slate-400 font-extrabold flex items-center gap-1.5 flex-row-reverse">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              المخطط البياني التفاعلي للمسار (Traffic Route Path)
            </span>

            {/* Stepper controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevStep}
                disabled={activeStep === 0}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 p-1.5 rounded-lg disabled:opacity-30 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] text-slate-400 font-bold">{activeStep + 1} / {proto.steps.length}</span>
              <button
                onClick={handleNextStep}
                disabled={activeStep === proto.steps.length - 1}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 p-1.5 rounded-lg disabled:opacity-30 cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Canvas Box */}
          <div className="bg-slate-950 border border-slate-850 p-6 rounded-xl h-64 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-radial-gradient from-cyan-500/5 to-transparent pointer-events-none" />

            {/* Explainer top */}
            <div className="text-right z-10">
              <span className="text-xs font-black text-slate-200">{step.title}</span>
              <p className="text-[10px] text-slate-400 mt-1">{step.desc}</p>
            </div>

            {/* The Visual nodes and path */}
            <div className="flex justify-between items-center relative px-8 my-auto w-full flex-row-reverse">
              
              {/* Client Node */}
              <div className="flex flex-col items-center gap-2 z-10">
                <div className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all ${
                  packetPos === "client" 
                    ? "border-cyan-500 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.15)]" 
                    : "border-slate-850 bg-slate-900/60"
                }`}>
                  <Cpu className={`w-6 h-6 ${packetPos === "client" ? "text-cyan-400 animate-pulse" : "text-slate-500"}`} />
                </div>
                <span className="text-[9px] font-black text-slate-300">العميل (PC)</span>
              </div>

              {/* Path connector line */}
              <div className="flex-1 h-0.5 bg-slate-850 mx-4 relative">
                {/* Moving Packet Bubble */}
                {packetPos === "transit" && (
                  <motion.div
                    initial={{ left: step.from === "client" ? "0%" : "100%" }}
                    animate={{ left: step.from === "client" ? "100%" : "0%" }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="w-3 h-3 rounded-full bg-cyan-400 absolute -top-1 shadow-[0_0_10px_#22d3ee] z-20"
                  />
                )}
              </div>

              {/* Server Node */}
              <div className="flex flex-col items-center gap-2 z-10">
                <div className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all ${
                  packetPos === "server" 
                    ? "border-cyan-500 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.15)]" 
                    : "border-slate-850 bg-slate-900/60"
                }`}>
                  <HardDrive className={`w-6 h-6 ${packetPos === "server" ? "text-cyan-400 animate-pulse" : "text-slate-500"}`} />
                </div>
                <span className="text-[9px] font-black text-slate-300">الخادم (Host)</span>
              </div>

            </div>

            {/* Action buttons */}
            <div className="flex justify-between items-center flex-row-reverse z-10">
              <button
                onClick={startAnimation}
                disabled={isPlaying}
                className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-850 text-slate-950 font-black px-4 py-1.5 rounded-lg text-[10px] flex items-center gap-1.5 flex-row-reverse cursor-pointer transition-colors"
              >
                <Play className="w-3.5 h-3.5" /> تشغيل إرسال الحزمة
              </button>

              <button
                onClick={() => {
                  setPacketPos("client");
                  setActiveStep(0);
                  setLogs(["🔄 تم إعادة تهيئة المختبر."]);
                }}
                className="bg-slate-900 border border-slate-800 hover:text-white text-slate-400 font-bold px-3 py-1.5 rounded-lg text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCw className="w-3 h-3" /> إعادة ضبط
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Logs console bottom */}
      <div className="bg-slate-950 border border-slate-850 rounded-xl p-3 flex flex-col gap-2">
        <span className="text-[9px] text-slate-500 font-extrabold block border-b border-slate-850 pb-1.5 flex items-center justify-start gap-1 flex-row-reverse">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          سجل الأحداث والشبكة (Inspection Network Logs)
        </span>
        <div className="h-20 overflow-y-auto font-mono text-[9px] text-slate-350 leading-relaxed flex flex-col gap-1 text-right">
          {logs.map((log, idx) => (
            <div key={idx} className={log.startsWith("✅") || log.startsWith("🎉") ? "text-emerald-400 font-bold" : "text-slate-300"}>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, Server, Users, Binary, FileCode, Copy, CheckCircle2, 
  HelpCircle, Settings, ShieldAlert, ArrowRight, Play, Info, AlertTriangle, RefreshCw
} from "lucide-react";

export default function SysAdminLabTools() {
  const [activeTab, setActiveTab] = useState("dns");

  useEffect(() => {
    const handleLaunchTool = (e) => {
      const toolId = e.detail;
      if (["dns", "ssh", "gpo", "binary", "yaml"].includes(toolId)) {
        setActiveTab(toolId);
      }
    };
    window.addEventListener("launch-ninja-tool", handleLaunchTool);
    return () => window.removeEventListener("launch-ninja-tool", handleLaunchTool);
  }, []);

  const tabs = [
    { id: "dns", label: "محاكي ومولد DNS", icon: <Globe className="w-4 h-4" /> },
    { id: "ssh", label: "مستند SSH Config", icon: <Server className="w-4 h-4" /> },
    { id: "gpo", label: "محاكي Active Directory GPO", icon: <Users className="w-4 h-4" /> },
    { id: "binary", label: "مستكشف القناع الثنائي", icon: <Binary className="w-4 h-4" /> },
    { id: "yaml", label: "مصحح وفاحص YAML", icon: <FileCode className="w-4 h-4" /> }
  ];

  return (
    <div id="sysadmin-lab-tools" className="bg-slate-900/40 backdrop-blur-md border border-purple-500/20 rounded-2xl p-6 flex flex-col gap-6 shadow-lg text-right scroll-mt-28">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="font-extrabold text-base text-slate-100 flex items-center gap-2 flex-row-reverse justify-end">
            <Settings className="w-5 h-5 text-purple-400 animate-spin-slow" />
            <span>مختبر ومحاكيات مهندسي الأنظمة والـ DevOps</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">خمس أدوات ذكية وتفاعلية لتبسيط بيئات العمل الحقيقية وإدارة السيرفرات</p>
        </div>
      </div>

      {/* Tabs Buttons */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-800/50" dir="rtl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-xs px-3.5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20"
                : "bg-slate-950 border border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-850"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="min-h-[380px]">
        <AnimatePresence mode="wait">
          {activeTab === "dns" && <DNSTool key="dns" />}
          {activeTab === "ssh" && <SSHTool key="ssh" />}
          {activeTab === "gpo" && <GPOTool key="gpo" />}
          {activeTab === "binary" && <BinaryTool key="binary" />}
          {activeTab === "yaml" && <YAMLTool key="yaml" />}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ==========================================
   1. DNS ZONE & RECORD SIMULATOR
   ========================================== */
function DNSTool() {
  const [records, setRecords] = useState([
    { name: "@", type: "A", value: "192.168.1.50", ttl: "3600" },
    { name: "www", type: "CNAME", value: "@", ttl: "3600" },
    { name: "@", type: "MX", value: "10 mail.ninja.com", ttl: "14400" },
    { name: "mail", type: "A", value: "192.168.1.51", ttl: "3600" }
  ]);
  const [name, setName] = useState("");
  const [type, setType] = useState("A");
  const [value, setValue] = useState("");
  const [ttl, setTtl] = useState("3600");
  const [copied, setCopied] = useState(false);
  const [lookupQuery, setLookupQuery] = useState("www.ninja.com");
  const [lookupSteps, setLookupSteps] = useState([]);
  const [searching, setSearching] = useState(false);

  const addRecord = (e) => {
    e.preventDefault();
    if (!name || !value) return;
    setRecords([...records, { name, type, value, ttl }]);
    setName("");
    setValue("");
  };

  const deleteRecord = (idx) => {
    setRecords(records.filter((_, i) => i !== idx));
  };

  const zoneFileContent = useMemo(() => {
    let output = `$ORIGIN ninja.com.\n$TTL 86400\n\n`;
    output += `@   IN  SOA  ns1.ninja.com. admin.ninja.com. (\n`;
    output += `        2026070601 ; Serial\n`;
    output += `        3600       ; Refresh\n`;
    output += `        1800       ; Retry\n`;
    output += `        604800     ; Expire\n`;
    output += `        86400 )    ; Minimum TTL\n\n`;
    output += `@   IN  NS   ns1.ninja.com.\n`;
    output += `@   IN  NS   ns2.ninja.com.\n\n`;

    records.forEach(r => {
      const padding = 12 - r.name.length;
      const pad = padding > 0 ? " ".repeat(padding) : " ";
      output += `${r.name}${pad}IN  ${r.type.padEnd(6, " ")} ${r.value}\n`;
    });
    return output;
  }, [records]);

  const runDNSLookup = () => {
    setSearching(true);
    setLookupSteps([]);
    
    const steps = [
      { server: "المتصفح المحلى (Local Cache)", desc: "يبحث المتصفح في الكاش المحلي وذاكرة النظام (Hosts File)." },
      { server: "خادم DNS المزود (Recursive Resolver)", desc: "لم يجد في الكاش، يتصل بخادم 8.8.8.8 لحل العنوان." },
      { server: "Root Server (.)", desc: "يرد خادم الجذر: لا أعرف النطاق، اذهب إلى خوادم TLD لنطاق .com." },
      { server: "TLD Server (.com)", desc: "يرد خادم TLD: اذهب لخوادم الأسماء المعتمدة لنطاق ninja.com وهي ns1.ninja.com." },
      { server: "Authoritative Server (ns1.ninja.com)", desc: "يقوم بقراءة الـ Zone File ويرد بالسجل المطلوب بنجاح!" }
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < steps.length) {
        setLookupSteps(prev => [...prev, steps[current]]);
        current++;
      } else {
        clearInterval(interval);
        setSearching(false);
      }
    }, 1200);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Editor & Generator */}
      <div className="flex flex-col gap-4">
        <h4 className="font-extrabold text-sm text-slate-100 flex items-center gap-1.5 justify-start">
          <Globe className="w-4 h-4 text-purple-400" />
          تعديل وإضافة سجلات النطاق (Zone Editor)
        </h4>

        <form onSubmit={addRecord} className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950 p-4 rounded-xl border border-slate-850">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 font-bold">اسم السجل (Host)</span>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="www أو @" className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-200" required />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 font-bold">النوع (Type)</span>
            <select value={type} onChange={e => setType(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-bold text-slate-200">
              <option value="A">A (IPv4)</option>
              <option value="AAAA">AAAA (IPv6)</option>
              <option value="CNAME">CNAME (Alias)</option>
              <option value="MX">MX (Mail Server)</option>
              <option value="TXT">TXT (Text/SPF)</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 font-bold">القيمة (Value)</span>
            <input value={value} onChange={e => setValue(e.target.value)} placeholder="IP أو خادم" className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-200" required />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 font-bold">الإجراء</span>
            <button type="submit" className="bg-purple-650 hover:bg-purple-600 text-white rounded-lg p-2 text-xs font-bold cursor-pointer transition-all">إضافة</button>
          </div>
        </form>

        {/* Records List Table */}
        <div className="bg-slate-950 border border-slate-850 rounded-xl overflow-hidden">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-850">
              <tr>
                <th className="p-3">Host</th>
                <th className="p-3">Type</th>
                <th className="p-3">Value</th>
                <th className="p-3">TTL</th>
                <th className="p-3 text-center">حذف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {records.map((r, i) => (
                <tr key={i} className="hover:bg-slate-900/40 text-slate-300 font-mono">
                  <td className="p-3 font-semibold">{r.name}</td>
                  <td className="p-3"><span className="text-[10px] font-black bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded-md">{r.type}</span></td>
                  <td className="p-3">{r.value}</td>
                  <td className="p-3 text-slate-500">{r.ttl}</td>
                  <td className="p-3 text-center">
                    <button onClick={() => deleteRecord(i)} className="text-rose-400 hover:text-rose-300 font-bold cursor-pointer">×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Zone File Preview & Lookup Simulator */}
      <div className="flex flex-col gap-4">
        <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex justify-between items-center border-b border-slate-900 pb-2">
            <span className="text-xs font-extrabold text-purple-400">DNS Zone File (BIND Format)</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(zoneFileContent);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="text-slate-400 hover:text-purple-400 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "تم النسخ!" : "نسخ الملف"}</span>
            </button>
          </div>
          <pre className="font-mono text-[10px] text-slate-400 p-3 bg-slate-900 rounded-lg select-all text-left overflow-x-auto max-h-40 leading-relaxed" dir="ltr">
            {zoneFileContent}
          </pre>
        </div>

        {/* Lookup Simulator */}
        <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col gap-3">
          <span className="text-xs font-extrabold text-slate-200">محاكي استعلام الـ DNS التفاعلي (Lookup Flow)</span>
          <div className="flex gap-2">
            <input 
              value={lookupQuery} 
              onChange={e => setLookupQuery(e.target.value)} 
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 flex-1 text-left" 
            />
            <button 
              onClick={runDNSLookup} 
              disabled={searching}
              className="bg-purple-650 hover:bg-purple-600 text-white rounded-lg px-4 py-2 text-xs font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3 h-3" />
              <span>استعلام</span>
            </button>
          </div>

          <div className="flex flex-col gap-2 mt-2" dir="rtl">
            {lookupSteps.map((step, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                key={idx} 
                className="flex items-start gap-2 text-right text-xs bg-slate-900 p-2 rounded-lg border border-slate-850"
              >
                <div className="w-5 h-5 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div>
                  <span className="font-black text-slate-200 block">{step.server}</span>
                  <span className="text-slate-400 text-[10px]">{step.desc}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ==========================================
   2. SSH CONFIG CONFIGURATOR
   ========================================== */
function SSHTool() {
  const [hosts, setHosts] = useState([
    { alias: "prod-web", hostName: "104.24.110.12", user: "ubuntu", port: "22", keyFile: "~/.ssh/prod_key" },
    { alias: "db-backup", hostName: "192.168.1.90", user: "postgres", port: "5432", keyFile: "~/.ssh/backup_key" }
  ]);
  const [alias, setAlias] = useState("");
  const [hostName, setHostName] = useState("");
  const [user, setUser] = useState("root");
  const [port, setPort] = useState("22");
  const [keyFile, setKeyFile] = useState("");
  const [copied, setCopied] = useState(false);

  const addHost = (e) => {
    e.preventDefault();
    if (!alias || !hostName) return;
    setHosts([...hosts, { alias, hostName, user, port, keyFile }]);
    setAlias("");
    setHostName("");
    setKeyFile("");
  };

  const removeHost = (idx) => {
    setHosts(hosts.filter((_, i) => i !== idx));
  };

  const sshConfigCode = useMemo(() => {
    let output = `# IT Ninja Generated SSH Config File\n# Save this file to ~/.ssh/config\n\n`;
    hosts.forEach(h => {
      output += `Host ${h.alias}\n`;
      output += `    HostName ${h.hostName}\n`;
      output += `    User ${h.user}\n`;
      output += `    Port ${h.port}\n`;
      if (h.keyFile) {
        output += `    IdentityFile ${h.keyFile}\n`;
      }
      output += `    ServerAliveInterval 60\n\n`;
    });
    return output;
  }, [hosts]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Configuration Inputs */}
      <div className="flex flex-col gap-4">
        <h4 className="font-extrabold text-sm text-slate-100 flex items-center gap-1.5 justify-start">
          <Server className="w-4 h-4 text-purple-400" />
          إضافة خوادم لملف الـ SSH Config
        </h4>

        <form onSubmit={addHost} className="grid grid-cols-2 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-850">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 font-bold">اسم مستعار للخادم (Host Alias)</span>
            <input value={alias} onChange={e => setAlias(e.target.value)} placeholder="مثال: web-server" className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-200" required />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 font-bold">عنوان الـ IP أو النطاق (HostName)</span>
            <input value={hostName} onChange={e => setHostName(e.target.value)} placeholder="192.168.1.100" className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-200" required />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 font-bold">المستخدم (User)</span>
            <input value={user} onChange={e => setUser(e.target.value)} placeholder="root / ubuntu" className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-200" required />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 font-bold">المنفذ (Port)</span>
            <input value={port} onChange={e => setPort(e.target.value)} placeholder="22" className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-200" required />
          </div>
          <div className="flex flex-col gap-1 col-span-2">
            <span className="text-[10px] text-slate-500 font-bold">مسار مفتاح SSH الخاص (Key File Path - اختياري)</span>
            <input value={keyFile} onChange={e => setKeyFile(e.target.value)} placeholder="~/.ssh/my_private_key" className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-200 text-left" />
          </div>
          <button type="submit" className="col-span-2 bg-purple-650 hover:bg-purple-600 text-white rounded-lg py-2.5 text-xs font-bold cursor-pointer transition-all">إضافة الخادم لتكوين الملف</button>
        </form>

        <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col gap-3">
          <span className="text-xs font-extrabold text-slate-200">الخوادم المضافة وأمر الاتصال السريع</span>
          <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
            {hosts.map((h, i) => (
              <div key={i} className="flex justify-between items-center bg-slate-900 p-2.5 rounded-lg border border-slate-850">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded-md font-mono">ssh {h.alias}</span>
                  <span className="text-xs text-slate-400 font-mono">({h.user}@{h.hostName})</span>
                </div>
                <button onClick={() => removeHost(i)} className="text-rose-400 hover:text-rose-300 text-xs font-bold cursor-pointer">حذف</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Code Preview & Instructions */}
      <div className="flex flex-col gap-4">
        <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex justify-between items-center border-b border-slate-900 pb-2">
            <span className="text-xs font-extrabold text-purple-400">ملف Config المولد (~/.ssh/config)</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(sshConfigCode);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="text-slate-400 hover:text-purple-400 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "تم النسخ!" : "نسخ الملف"}</span>
            </button>
          </div>
          <pre className="font-mono text-[10px] text-slate-400 p-3 bg-slate-900 rounded-lg select-all text-left overflow-x-auto h-72 leading-relaxed" dir="ltr">
            {sshConfigCode}
          </pre>
        </div>
        
        <div className="text-[11px] text-slate-450 leading-relaxed bg-purple-500/5 p-3 rounded-lg border border-purple-500/10 text-right">
          💡 <strong>تلميح نينجا:</strong> لتطبيق هذا التكوين، احفظ الكود المنسوخ في المسار <code className="text-purple-300 font-mono">~/.ssh/config</code> على جهازك. من الآن فصاعداً، بدلاً من كتابة أمر الاتصال بالـ IP، يمكنك ببساطة كتابة أمر مستعار مثل <code className="text-purple-300 font-mono">ssh prod-web</code>!
        </div>
      </div>
    </motion.div>
  );
}

/* ==========================================
   3. AD GPO SIMULATOR
   ========================================== */
function GPOTool() {
  const [ous, setOus] = useState([
    { id: "domain", name: "ninja.com (نطاق الدومين)", blockInheritance: false, linkedGPOs: ["Default Domain Policy"] },
    { id: "hq", name: "HQ OU (المقر الرئيسي)", parent: "domain", blockInheritance: false, linkedGPOs: [] },
    { id: "it", name: "IT Dept OU (إدارة التكنولوجيا)", parent: "hq", blockInheritance: false, linkedGPOs: ["Disable USB Storage"] },
    { id: "hr", name: "HR Dept OU (الموارد البشرية)", parent: "hq", blockInheritance: false, linkedGPOs: ["Wallpaper Restriction"] }
  ]);
  const [gpoPool, setGpoPool] = useState([
    "Default Domain Policy",
    "Disable USB Storage",
    "Wallpaper Restriction",
    "Disable Control Panel",
    "Block Windows Update"
  ]);

  const [selectedOU, setSelectedOU] = useState("it");
  const [selectedGPO, setSelectedGPO] = useState("Disable Control Panel");
  const [rsopComputer, setRsopComputer] = useState("Client-PC-01");
  const [rsopResult, setRsopResult] = useState(null);

  // Link GPO to OU
  const linkGPO = () => {
    setOus(ous.map(ou => {
      if (ou.id === selectedOU && !ou.linkedGPOs.includes(selectedGPO)) {
        return { ...ou, linkedGPOs: [...ou.linkedGPOs, selectedGPO] };
      }
      return ou;
    }));
  };

  // Unlink GPO
  const unlinkGPO = (ouId, gpo) => {
    setOus(ous.map(ou => {
      if (ou.id === ouId) {
        return { ...ou, linkedGPOs: ou.linkedGPOs.filter(g => g !== gpo) };
      }
      return ou;
    }));
  };

  // Toggle Block Inheritance
  const toggleInheritance = (ouId) => {
    setOus(ous.map(ou => {
      if (ou.id === ouId) {
        return { ...ou, blockInheritance: !ou.blockInheritance };
      }
      return ou;
    }));
  };

  // Calculate Resultant Set of Policy (RSoP)
  const calculateRSoP = () => {
    const activeOU = ous.find(ou => ou.id === selectedOU);
    const path = [];
    
    // Build GPO path from root domain to chosen OU
    let current = activeOU;
    while (current) {
      path.unshift(current);
      current = ous.find(parent => parent.id === current.parent);
    }

    const applied = [];
    const blocked = [];

    path.forEach(ou => {
      if (ou.blockInheritance && ou.id !== "domain") {
        // All previously accumulated GPOs are blocked unless enforced
        // (For simplicity of this simulator, we block all prior inherited GPOs)
        blocked.push(...applied);
        applied.length = 0; // Clear applied
      }
      ou.linkedGPOs.forEach(gpo => {
        if (!applied.includes(gpo)) applied.push(gpo);
      });
    });

    setRsopResult({
      ouName: activeOU.name,
      applied,
      blocked
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* GPO Tree & Link Control */}
      <div className="flex flex-col gap-4">
        <h4 className="font-extrabold text-sm text-slate-100 flex items-center gap-1.5 justify-start">
          <Users className="w-4 h-4 text-purple-400" />
          هيكل الـ Organizational Units (OU Tree) والـ GPOs
        </h4>

        {/* Tree Display */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col gap-3">
          {ous.map(ou => (
            <div 
              key={ou.id} 
              className={`p-3 rounded-lg border text-right transition-all ${
                ou.id === "domain" ? "bg-slate-900/80 border-slate-800" :
                ou.id === "hq" ? "mr-4 bg-slate-900/60 border-slate-800/80" : "mr-8 bg-slate-900/40 border-slate-850"
              } ${selectedOU === ou.id ? "border-purple-500/50 shadow-[0_0_15px_rgba(139,92,246,0.05)]" : ""}`}
            >
              <div className="flex justify-between items-center">
                <button 
                  onClick={() => setSelectedOU(ou.id)}
                  className="font-bold text-xs text-slate-200 hover:text-purple-400 cursor-pointer"
                >
                  📁 {ou.name}
                </button>
                
                {ou.id !== "domain" && (
                  <button 
                    onClick={() => toggleInheritance(ou.id)}
                    className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border cursor-pointer ${
                      ou.blockInheritance 
                        ? "bg-rose-500/10 text-rose-400 border-rose-500/30" 
                        : "bg-slate-900 text-slate-500 border-slate-800"
                    }`}
                  >
                    {ou.blockInheritance ? "حظر التوريث: مفعّل" : "حظر التوريث"}
                  </button>
                )}
              </div>

              {ou.linkedGPOs.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {ou.linkedGPOs.map(g => (
                    <span key={g} className="text-[9px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <span>{g}</span>
                      <button onClick={() => unlinkGPO(ou.id, g)} className="hover:text-rose-400 text-slate-500 font-extrabold font-mono">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Link GPO Form */}
        <div className="grid grid-cols-3 gap-2 bg-slate-950 p-4 rounded-xl border border-slate-850 items-end">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 font-bold">اختر OU</span>
            <select value={selectedOU} onChange={e => setSelectedOU(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-bold text-slate-200">
              {ous.map(ou => <option key={ou.id} value={ou.id}>{ou.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 font-bold">ربط سياسة (Link GPO)</span>
            <select value={selectedGPO} onChange={e => setSelectedGPO(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-bold text-slate-200">
              {gpoPool.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <button onClick={linkGPO} className="bg-purple-650 hover:bg-purple-600 text-white rounded-lg py-2.5 text-xs font-bold cursor-pointer transition-all">ربط السياسة</button>
        </div>
      </div>

      {/* RSoP Computer Calculation Simulator */}
      <div className="flex flex-col gap-4">
        <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col gap-3">
          <span className="text-xs font-extrabold text-slate-200">محاكي حساب السياسة النهائية للعميل (gpresult / RSoP)</span>
          <p className="text-[11px] text-slate-400">
            اختر OU بالأعلى وانقر على "تحديث السياسات" لمحاكاة تشغيل أمر <code className="text-purple-400">gpupdate /force</code> وحساب السياسات المطبقة فعلياً.
          </p>

          <button
            onClick={calculateRSoP}
            className="bg-purple-650 hover:bg-purple-600 text-white rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-purple-500/10"
          >
            <RefreshCw className="w-4 h-4" />
            <span>تحديث وحساب السياسة (gpupdate)</span>
          </button>

          {rsopResult && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 border border-slate-850 p-4 rounded-xl flex flex-col gap-3"
            >
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-[11px] font-bold text-slate-300">السياسات المطبقة على: <span className="font-mono text-purple-400">{rsopComputer}</span></span>
                <span className="text-[9px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-850">OU: {rsopResult.ouName}</span>
              </div>

              <div>
                <span className="text-[10px] text-emerald-400 font-extrabold block mb-1">✅ السياسات المطبقة فعلياً (Applied GPOs):</span>
                {rsopResult.applied.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    {rsopResult.applied.map(a => (
                      <span key={a} className="text-xs font-mono text-slate-300 flex items-center gap-1.5 justify-start">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>{a}</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-slate-500 italic">لا توجد سياسات مطبقة</span>
                )}
              </div>

              {rsopResult.blocked.length > 0 && (
                <div className="border-t border-slate-800/80 pt-2.5 mt-1">
                  <span className="text-[10px] text-rose-400 font-extrabold block mb-1">❌ سياسات تم حظرها بسبب حظر التوريث (Blocked GPOs):</span>
                  <div className="flex flex-col gap-1">
                    {rsopResult.blocked.map(b => (
                      <span key={b} className="text-xs font-mono text-slate-400 line-through flex items-center gap-1.5 justify-start">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                        <span>{b}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ==========================================
   4. BINARY SUBNET MASK EXPLORER
   ========================================== */
function BinaryTool() {
  const [ipAddress, setIpAddress] = useState("192.168.1.137");
  const [cidr, setCidr] = useState("24");

  const binaryDetails = useMemo(() => {
    // Basic IP & CIDR validation
    const ipParts = ipAddress.split(".").map(x => parseInt(x, 10));
    const prefix = parseInt(cidr, 10);

    if (ipParts.length !== 4 || ipParts.some(isNaN) || isNaN(prefix) || prefix < 0 || prefix > 32) {
      return null;
    }

    // IP to Binary
    const ipBinary = ipParts.map(oct => oct.toString(2).padStart(8, "0")).join("");
    
    // Mask to Binary
    const maskBinary = "1".repeat(prefix) + "0".repeat(32 - prefix);
    const maskParts = [];
    for (let i = 0; i < 32; i += 8) {
      maskParts.push(parseInt(maskBinary.substring(i, i + 8), 2));
    }
    const subnetMaskStr = maskParts.join(".");

    // Network IP
    const networkBinary = ipBinary.substring(0, prefix) + "0".repeat(32 - prefix);
    const networkParts = [];
    for (let i = 0; i < 32; i += 8) {
      networkParts.push(parseInt(networkBinary.substring(i, i + 8), 2));
    }
    const networkAddress = networkParts.join(".");

    // Broadcast IP
    const broadcastBinary = ipBinary.substring(0, prefix) + "1".repeat(32 - prefix);
    const broadcastParts = [];
    for (let i = 0; i < 32; i += 8) {
      broadcastParts.push(parseInt(broadcastBinary.substring(i, i + 8), 2));
    }
    const broadcastAddress = broadcastParts.join(".");

    // First and Last host
    const firstHostParts = [...networkParts];
    firstHostParts[3] += 1;
    const lastHostParts = [...broadcastParts];
    lastHostParts[3] -= 1;

    return {
      ipBinary,
      maskBinary,
      subnetMaskStr,
      networkAddress,
      broadcastAddress,
      firstHost: firstHostParts.join("."),
      lastHost: lastHostParts.join("."),
      prefix
    };
  }, [ipAddress, cidr]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-850">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-slate-400 font-semibold">عنوان الـ IP (IPv4):</span>
          <input 
            value={ipAddress} 
            onChange={e => setIpAddress(e.target.value)} 
            className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500" 
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-slate-400 font-semibold">طول البادئة (CIDR / Prefix):</span>
          <input 
            type="number"
            min="0"
            max="32"
            value={cidr} 
            onChange={e => setCidr(e.target.value)} 
            className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500" 
          />
        </div>
      </div>

      {binaryDetails ? (
        <div className="flex flex-col gap-6">
          {/* Binary Visual Blocks */}
          <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col gap-4">
            <span className="text-xs font-extrabold text-purple-400 border-b border-slate-900 pb-2">التمثيل الثنائي للـ IP وقناع الشبكة (Binary Representation)</span>
            
            {/* Legend */}
            <div className="flex justify-start gap-4 text-[10px] font-bold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-purple-500" />
                <span className="text-slate-400">بتات الشبكة (Network Bits)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
                <span className="text-slate-400">بتات الأجهزة (Host Bits)</span>
              </div>
            </div>

            {/* IP binary visualization */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-extrabold text-slate-350">عنوان IP الحالي: <span className="font-mono text-slate-100">{ipAddress}</span></span>
              <div className="grid grid-cols-4 gap-2 md:gap-4 font-mono text-xs md:text-sm text-center">
                {[0, 1, 2, 3].map(octetIdx => (
                  <div key={octetIdx} className="bg-slate-900 border border-slate-800 p-2 rounded-lg flex justify-center gap-0.5">
                    {binaryDetails.ipBinary.substring(octetIdx * 8, octetIdx * 8 + 8).split("").map((bit, bitIdx) => {
                      const absoluteBitIdx = octetIdx * 8 + bitIdx;
                      const isNetworkBit = absoluteBitIdx < binaryDetails.prefix;
                      return (
                        <span 
                          key={bitIdx} 
                          className={`px-1.5 py-0.5 rounded text-slate-950 font-black ${isNetworkBit ? "bg-purple-500 text-slate-950" : "bg-emerald-500 text-slate-950"}`}
                        >
                          {bit}
                        </span>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Mask binary visualization */}
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-xs font-extrabold text-slate-350">قناع الشبكة (Subnet Mask): <span className="font-mono text-slate-100">{binaryDetails.subnetMaskStr}</span></span>
              <div className="grid grid-cols-4 gap-2 md:gap-4 font-mono text-xs md:text-sm text-center">
                {[0, 1, 2, 3].map(octetIdx => (
                  <div key={octetIdx} className="bg-slate-900 border border-slate-800 p-2 rounded-lg flex justify-center gap-0.5">
                    {binaryDetails.maskBinary.substring(octetIdx * 8, octetIdx * 8 + 8).split("").map((bit, bitIdx) => {
                      const absoluteBitIdx = octetIdx * 8 + bitIdx;
                      const isNetworkBit = absoluteBitIdx < binaryDetails.prefix;
                      return (
                        <span 
                          key={bitIdx} 
                          className={`px-1.5 py-0.5 rounded font-black ${isNetworkBit ? "bg-purple-500/20 text-purple-400 border border-purple-500/25" : "bg-slate-950 text-slate-600 border border-slate-850"}`}
                        >
                          {bit}
                        </span>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Computed Network Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "عنوان الشبكة (Network Address)", value: binaryDetails.networkAddress, color: "text-purple-400" },
              { label: "عنوان البث (Broadcast Address)", value: binaryDetails.broadcastAddress, color: "text-rose-400" },
              { label: "أول جهاز متاح (First Host)", value: binaryDetails.firstHost, color: "text-emerald-400" },
              { label: "آخر جهاز متاح (Last Host)", value: binaryDetails.lastHost, color: "text-emerald-400" }
            ].map(item => (
              <div key={item.label} className="bg-slate-950 border border-slate-850 p-4 rounded-xl text-right">
                <span className="text-[10px] text-slate-500 font-extrabold block mb-1">{item.label}</span>
                <span className={`text-sm font-mono font-black ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-slate-950 border border-slate-850 p-6 rounded-xl text-center text-xs text-rose-400 font-bold">
          ⚠️ الرجاء إدخال عنوان IP وقيمة CIDR صحيحة (مثال: IP: 192.168.1.1, CIDR: 0-32).
        </div>
      )}
    </motion.div>
  );
}

/* ==========================================
   5. YAML & DOCKER COMPOSE VALIDATOR
   ========================================== */
function YAMLTool() {
  const [yamlText, setYamlText] = useState(
`version: "3.8"
services:
  web-app:
    image: nginx:alpine
    ports:
      - "80:80"
\t# انتبه! هنا يوجد خطأ Tab بدلاً من المسافات`);

  const [validationResult, setValidationResult] = useState(null);

  const validateYAML = () => {
    const lines = yamlText.split("\n");
    const errors = [];

    lines.forEach((line, idx) => {
      // Check for TAB indentation
      if (line.includes("\t")) {
        errors.push({
          line: idx + 1,
          type: "TAB_ERROR",
          message: "يوجد استخدام لعلامة Tab في بداية السطر. يجب دائماً استخدام مسافات (Spaces) بدلاً من Tab في ملفات YAML."
        });
      }

      // Check for colon spacing issues
      if (line.includes(":") && !line.includes("://")) {
        const parts = line.split(":");
        const key = parts[0];
        const value = parts.slice(1).join(":");
        
        // If there's value, but no space after the colon (e.g. key:value instead of key: value)
        if (value && value.trim().length > 0 && !value.startsWith(" ") && !value.startsWith("\t")) {
          errors.push({
            line: idx + 1,
            type: "COLON_SPACE_ERROR",
            message: "الرجاء ترك مسافة فارغة واحدة على الأقل بعد النقطتين الرأسيتين (:) لتجنب فشل قراءة الملف."
          });
        }
      }
    });

    setValidationResult({
      isValid: errors.length === 0,
      errors
    });
  };

  const fixYAML = () => {
    // Replace tabs with 2 spaces
    const fixed = yamlText.replace(/\t/g, "  ");
    setYamlText(fixed);
    setValidationResult(null);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Editor */}
      <div className="flex flex-col gap-4">
        <h4 className="font-extrabold text-sm text-slate-100 flex items-center gap-1.5 justify-start">
          <FileCode className="w-4 h-4 text-purple-400" />
          محرر وفاحص ملفات YAML & Docker Compose
        </h4>

        <div className="flex flex-col gap-2">
          <textarea
            value={yamlText}
            onChange={e => {
              setYamlText(e.target.value);
              setValidationResult(null);
            }}
            rows={12}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500 leading-relaxed text-left"
            dir="ltr"
            placeholder="ألصق محتويات ملف docker-compose.yml أو ملف YAML هنا..."
          />
          <div className="flex gap-2">
            <button 
              onClick={validateYAML}
              className="flex-1 bg-purple-650 hover:bg-purple-600 text-white rounded-xl py-2.5 text-xs font-bold cursor-pointer transition-all"
            >
              افحص وصحح التنسيق
            </button>
            <button 
              onClick={fixYAML}
              className="bg-slate-950 border border-slate-850 text-slate-350 hover:text-white rounded-xl px-4 py-2.5 text-xs font-bold cursor-pointer transition-all"
            >
              استبدال الـ Tabs بمسافات تلقائياً
            </button>
          </div>
        </div>
      </div>

      {/* Validation Result Box */}
      <div className="flex flex-col gap-4">
        <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col gap-3 h-full">
          <span className="text-xs font-extrabold text-slate-200 border-b border-slate-900 pb-2">تقرير الفحص (Validation Report)</span>
          
          {validationResult === null ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-center text-slate-500 flex-1">
              <Info className="w-8 h-8 text-slate-600" />
              <p className="text-xs">الرجاء إدخال محتوى YAML والنقر على زر الفحص</p>
            </div>
          ) : validationResult.isValid ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-center text-emerald-400 flex-1 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              <div className="flex flex-col">
                <span className="text-xs font-black">الملف سليم 100%!</span>
                <span className="text-[10px] text-slate-450 mt-1">تنسيق الـ Indentation والمسافات يطابق مواصفات YAML القياسية.</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 overflow-y-auto max-h-80 flex-1">
              <div className="flex items-center gap-2 text-rose-400 border border-rose-500/20 bg-rose-500/5 p-3 rounded-xl">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs font-black">تم العثور على {validationResult.errors.length} أخطاء تنسيقية:</span>
              </div>

              {validationResult.errors.map((err, i) => (
                <div key={i} className="bg-slate-900 border border-slate-850 p-3 rounded-lg flex flex-col gap-1 text-right">
                  <div className="flex justify-between items-center border-b border-slate-850 pb-1.5 mb-1">
                    <span className="text-[10px] font-black text-rose-400 font-mono">السطر: {err.line}</span>
                    <span className="text-[9px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded font-black">{err.type}</span>
                  </div>
                  <p className="text-xs text-slate-350 leading-relaxed font-medium">{err.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

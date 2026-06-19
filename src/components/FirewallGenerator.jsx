import React, { useState, useEffect, memo } from "react";
import { ShieldCheck, Copy, Check } from "lucide-react";

const portPresets = [
  { label: "SSH (22)", value: "22", proto: "tcp" },
  { label: "HTTP (80)", value: "80", proto: "tcp" },
  { label: "HTTPS (443)", value: "443", proto: "tcp" },
  { label: "DNS (53)", value: "53", proto: "both" },
  { label: "RDP (3389)", value: "3389", proto: "tcp" }
];

const FirewallGenerator = memo(function FirewallGenerator() {
  const [fwType, setFwType] = useState("ufw");
  const [port, setPort] = useState("80");
  const [action, setAction] = useState("allow");
  const [protocol, setProtocol] = useState("tcp");
  const [command, setCommand] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateCommand();
  }, [fwType, port, action, protocol]);

  const generateCommand = () => {
    const actUpper = action.toUpperCase();
    const protoLower = protocol.toLowerCase();
    
    let generated = "";

    switch (fwType) {
      case "ufw":
        if (action === "allow") {
          generated = `sudo ufw allow ${port}/${protoLower}`;
        } else {
          generated = `sudo ufw deny ${port}/${protoLower}`;
        }
        break;
      case "iptables":
        const target = action === "allow" ? "ACCEPT" : "DROP";
        if (protocol === "both") {
          generated = `sudo iptables -A INPUT -p tcp --dport ${port} -j ${target}\nsudo iptables -A INPUT -p udp --dport ${port} -j ${target}`;
        } else {
          generated = `sudo iptables -A INPUT -p ${protoLower} --dport ${port} -j ${target}`;
        }
        break;
      case "win":
        const actionWin = action === "allow" ? "allow" : "block";
        const protocolWin = protocol === "both" ? "ANY" : protocol.toUpperCase();
        generated = `netsh advfirewall firewall add rule name="IT_Ninja_Port_${port}_${actUpper}" dir=in action=${actionWin} protocol=${protocolWin} localport=${port}`;
        break;
      case "pfsense":
        const pfsenseAction = action === "allow" ? "Pass" : "Block/Reject";
        const pfsenseProto = protocol === "both" ? "TCP/UDP" : protocol.toUpperCase();
        generated = `[PfSense Rule Setup Guide]:\n- Action: ${pfsenseAction}\n- Interface: WAN\n- Address Family: IPv4\n- Protocol: ${pfsenseProto}\n- Destination Port Range: From ${port} to ${port}\n- Description: Custom Rule for Port ${port}`;
        break;
      default:
        generated = "";
    }

    setCommand(generated);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/60 border border-red-500/20 rounded-xl p-5 shadow-lg backdrop-blur-md">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
        <ShieldCheck className="w-5 h-5 text-rose-455 animate-pulse" />
        <h3 className="font-bold text-lg text-slate-100">مولد أوامر جدران الحماية (Firewall Command Generator)</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {/* Firewall select */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400 font-bold">جدار الحماية (Firewall):</label>
          <select 
            value={fwType}
            onChange={(e) => setFwType(e.target.value)}
            className="bg-slate-955 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-rose-300 focus:outline-none"
          >
            <option value="ufw">UFW (Ubuntu/Debian)</option>
            <option value="iptables">iptables (Standard Linux)</option>
            <option value="win">Windows Advanced Firewall</option>
            <option value="pfsense">PfSense (GUI Rules)</option>
          </select>
        </div>

        {/* Port Input */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400 font-bold">منفذ الاتصال (Port):</label>
          <input 
            type="text"
            value={port}
            onChange={(e) => setPort(e.target.value)}
            className="bg-slate-955 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-rose-350 focus:outline-none"
            placeholder="80"
          />
        </div>

        {/* Action Select */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400 font-bold">الإجراء (Action):</label>
          <select 
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="bg-slate-955 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-rose-300 focus:outline-none"
          >
            <option value="allow">سماح (Allow / Pass)</option>
            <option value="deny">حظر (Deny / Block)</option>
          </select>
        </div>

        {/* Protocol Select */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400 font-bold">البروتوكول (Protocol):</label>
          <select 
            value={protocol}
            onChange={(e) => setProtocol(e.target.value)}
            className="bg-slate-955 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-rose-300 focus:outline-none"
            disabled={fwType === "ufw" && protocol === "both"} // UFW both handles via default
          >
            <option value="tcp">TCP</option>
            <option value="udp">UDP</option>
            <option value="both">كلاهما (Both)</option>
          </select>
        </div>
      </div>

      {/* Port Presets Row */}
      <div className="flex items-center gap-1.5 mb-4 overflow-x-auto py-1 scrollbar-none">
        <span className="text-[10px] text-slate-500 font-bold">منافذ شائعة:</span>
        {portPresets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => {
              setPort(preset.value);
              setProtocol(preset.proto);
            }}
            className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-955 border border-slate-850 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-all cursor-pointer"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Command Output Panel */}
      <div className="bg-slate-955 border border-red-500/10 rounded-lg overflow-hidden flex flex-col">
        <div className="bg-slate-900/80 px-3 py-1.5 border-b border-red-500/10 flex justify-between items-center">
          <span className="font-mono text-[10px] text-rose-400 font-bold">الأمر الناتج (Generated Command)</span>
          <button 
            onClick={handleCopy}
            className="text-slate-450 hover:text-rose-400 hover:bg-rose-500/10 p-1 rounded transition-all flex items-center gap-1 text-[10px] cursor-pointer"
          >
            {copied ? (
              <><Check className="w-3 h-3 text-emerald-400" /><span className="text-emerald-400 font-bold">تم النسخ!</span></>
            ) : (
              <><Copy className="w-3 h-3" /><span>نسخ الأمر</span></>
            )}
          </button>
        </div>
        <div className="p-3.5 font-mono text-xs text-slate-200 select-text leading-relaxed bg-[#070b12] whitespace-pre-wrap">
          {command}
        </div>
      </div>
    </div>
  );
});

export default FirewallGenerator;

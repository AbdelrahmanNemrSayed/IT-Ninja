import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Server, Monitor, HardDrive, Wifi, Plus, Trash2, Play, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";

export default function NetworkTopology() {
  const [nodes, setNodes] = useState([
    { id: "router_1", name: "Router 1 (الراوتر الرئيسي)", type: "router", ip: "192.168.1.1", x: 180, y: 50 },
    { id: "switch_1", name: "Switch 1 (السويتش المركزي)", type: "switch", x: 180, y: 160 },
    { id: "pc_1", name: "PC 1 (جهاز الموظف)", type: "pc", ip: "192.168.1.10", x: 80, y: 280 },
    { id: "server_1", name: "Web Server (خادم الويب)", type: "server", ip: "192.168.1.100", x: 280, y: 280 }
  ]);

  const [connections, setConnections] = useState([
    { from: "router_1", to: "switch_1" },
    { from: "switch_1", to: "pc_1" },
    { from: "switch_1", to: "server_1" }
  ]);

  const [selectedNode, setSelectedNode] = useState(null);
  const [connectFrom, setConnectFrom] = useState(null);
  const [pingSource, setPingSource] = useState("");
  const [pingTarget, setPingTarget] = useState("");
  const [packetAnim, setPacketAnim] = useState(null);
  const [log, setLog] = useState([]);

  // Add new nodes
  const addNode = (type) => {
    const id = `${type}_${Date.now()}`;
    let name = "";
    let ip = "";
    if (type === "router") { name = "New Router"; ip = "192.168.2.1"; }
    else if (type === "switch") { name = "New Switch"; }
    else if (type === "pc") { name = "New Client PC"; ip = "192.168.1.15"; }
    else if (type === "server") { name = "New Server"; ip = "192.168.1.200"; }

    const newNode = {
      id, name, type, ip,
      x: 150 + Math.random() * 80,
      y: 150 + Math.random() * 80
    };
    setNodes(prev => [...prev, newNode]);
    addLog(`➕ تم إضافة جهاز جديد: ${name}`);
  };

  const addLog = (msg) => {
    setLog(prev => [msg, ...prev].slice(0, 15));
  };

  // Delete Node and its connections
  const deleteNode = (id) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    setConnections(prev => prev.filter(c => c.from !== id && c.to !== id));
    setSelectedNode(null);
    addLog(`🗑️ تم إزالة الجهاز: ${id}`);
  };

  // Node connection builder
  const handleNodeClick = (nodeId) => {
    if (connectFrom === "SELECT_SOURCE") {
      setConnectFrom(nodeId);
      const srcNode = nodes.find(n => n.id === nodeId);
      addLog(`🔌 تم اختيار ${srcNode.name} كمصدر. الآن انقر على الجهاز الثاني للتوصيل...`);
      return;
    }

    if (connectFrom) {
      if (connectFrom === nodeId) {
        setConnectFrom(null);
        addLog("🔌 تم إلغاء وضع التوصيل.");
        return;
      }
      // Check if connection already exists
      const exists = connections.some(c => 
        (c.from === connectFrom && c.to === nodeId) || 
        (c.from === nodeId && c.to === connectFrom)
      );
      if (exists) {
        addLog("⚠️ الكابل متصل بالفعل بين هذين الجهازين!");
        setConnectFrom(null);
        return;
      }
      const fromNode = nodes.find(n => n.id === connectFrom);
      const toNode = nodes.find(n => n.id === nodeId);
      setConnections(prev => [...prev, { from: connectFrom, to: nodeId }]);
      addLog(`🔌 تم توصيل كابل شبكي بين ${fromNode.name} و ${toNode.name}`);
      setConnectFrom(null);
    } else {
      setSelectedNode(nodes.find(n => n.id === nodeId));
    }
  };

  // Start ping packet simulation
  const startPing = () => {
    if (!pingSource || !pingTarget) return;
    if (pingSource === pingTarget) return;

    const srcNode = nodes.find(n => n.id === pingSource);
    const destNode = nodes.find(n => n.id === pingTarget);

    addLog(`📡 بدء فحص الاتصال (Ping) من ${srcNode.name} إلى ${destNode.name}...`);
    
    // Find path via Switch (mocked simple path animation)
    setPacketAnim({
      fromX: srcNode.x, fromY: srcNode.y,
      toX: destNode.x, toY: destNode.y,
      step: "sending"
    });

    setTimeout(() => {
      // Echo response
      setPacketAnim({
        fromX: destNode.x, fromY: destNode.y,
        toX: srcNode.x, toY: srcNode.y,
        step: "replying"
      });

      setTimeout(() => {
        setPacketAnim(null);
        addLog(`✅ نجاح الاتصال: تم استقبال الرد من ${destNode.ip} بنجاح! (RTT < 1ms)`);
      }, 1000);

    }, 1000);
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-6 flex flex-col gap-6 shadow-lg relative text-right">
      <div className="border-b border-slate-800 pb-3 flex justify-between items-center flex-row-reverse">
        <div>
          <h3 className="font-extrabold text-sm text-slate-100 flex items-center justify-start gap-2 flex-row-reverse">
            <Wifi className="w-5 h-5 text-cyan-400" />
            محاكي توبولوجيا الشبكات المرئي (Network Topology Designer)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            قم ببناء شبكتك الخاصة، صل الكابلات، واختبر الاتصال (Ping) وحركة حزم البيانات مباشرة.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Control panel */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {/* Add devices */}
          <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl flex flex-col gap-2">
            <span className="text-[10px] text-slate-500 font-extrabold block mb-1">إضافة أجهزة للشبكة</span>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => addNode("router")} className="bg-slate-900 border border-slate-800 rounded-lg p-2 flex flex-col items-center gap-1 hover:border-cyan-500/40 hover:bg-slate-850 cursor-pointer text-[10px] font-bold text-slate-300">
                <Wifi className="w-4 h-4 text-cyan-400" /> الراوتر
              </button>
              <button onClick={() => addNode("switch")} className="bg-slate-900 border border-slate-800 rounded-lg p-2 flex flex-col items-center gap-1 hover:border-cyan-500/40 hover:bg-slate-850 cursor-pointer text-[10px] font-bold text-slate-300">
                <HardDrive className="w-4 h-4 text-purple-400" /> السويتش
              </button>
              <button onClick={() => addNode("pc")} className="bg-slate-900 border border-slate-800 rounded-lg p-2 flex flex-col items-center gap-1 hover:border-cyan-500/40 hover:bg-slate-850 cursor-pointer text-[10px] font-bold text-slate-300">
                <Monitor className="w-4 h-4 text-emerald-400" /> كمبيوتر عميل
              </button>
              <button onClick={() => addNode("server")} className="bg-slate-900 border border-slate-800 rounded-lg p-2 flex flex-col items-center gap-1 hover:border-cyan-500/40 hover:bg-slate-850 cursor-pointer text-[10px] font-bold text-slate-300">
                <Server className="w-4 h-4 text-amber-400" /> خادم (Server)
              </button>
            </div>
          </div>

          {/* Connect & Link builder */}
          <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl flex flex-col gap-2">
            <span className="text-[10px] text-slate-500 font-extrabold block mb-1">توصيل الكابلات الشبكية</span>
            <button
              onClick={() => {
                if (nodes.length < 2) {
                  addLog("⚠️ يجب إضافة جهازين على الأقل لتتمكن من التوصيل!");
                  return;
                }
                setConnectFrom("SELECT_SOURCE");
                addLog("🔌 وضع التوصيل: انقر على الجهاز الأول (المصدر)...");
              }}
              className={`w-full py-2 border text-[10px] font-bold rounded-lg cursor-pointer transition-colors ${
                connectFrom === "SELECT_SOURCE" 
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-400 animate-pulse" 
                  : "bg-cyan-500/10 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20"
              }`}
            >
              {connectFrom === "SELECT_SOURCE" ? "انتظار اختيار الجهاز الأول..." : "ربط كابل شبكي جديد (Cable RJ45)"}
            </button>
          </div>

          {/* Ping Simulator */}
          <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl flex flex-col gap-3">
            <span className="text-[10px] text-slate-500 font-extrabold block">محاكي فحص الاتصال (Ping ICMP)</span>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] text-slate-400 font-semibold">من الجهاز:</span>
                <select
                  value={pingSource}
                  onChange={e => setPingSource(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-[10px] text-slate-200 cursor-pointer"
                >
                  <option value="">-- اختر المصدر --</option>
                  {nodes.filter(n => n.type !== "switch").map(n => (
                    <option key={n.id} value={n.id}>{n.name} ({n.ip})</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] text-slate-400 font-semibold">إلى الجهاز:</span>
                <select
                  value={pingTarget}
                  onChange={e => setPingTarget(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-[10px] text-slate-200 cursor-pointer"
                >
                  <option value="">-- اختر الهدف --</option>
                  {nodes.filter(n => n.type !== "switch" && n.id !== pingSource).map(n => (
                    <option key={n.id} value={n.id}>{n.name} ({n.ip})</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={startPing}
              disabled={!pingSource || !pingTarget}
              className="w-full py-2 bg-emerald-500 text-slate-950 text-xs font-black rounded-lg hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" /> إطلاق اختبار Ping
            </button>
          </div>
        </div>

        {/* Center Interactive SVG workspace */}
        <div className="lg:col-span-3 bg-slate-950/80 border border-slate-850 rounded-xl relative overflow-hidden h-[340px] flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Draw Cable Connections */}
            {connections.map((c, i) => {
              const fromNode = nodes.find(n => n.id === c.from);
              const toNode = nodes.find(n => n.id === c.to);
              if (!fromNode || !toNode) return null;
              return (
                <line
                  key={i}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke="#334155"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Packet Simulation Animation */}
            {packetAnim && (
              <motion.circle
                cx={packetAnim.fromX}
                cy={packetAnim.fromY}
                r="6"
                fill={packetAnim.step === "sending" ? "#06b6d4" : "#10b981"}
                animate={{ cx: packetAnim.toX, cy: packetAnim.toY }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
            )}
          </svg>

          {/* Render Nodes as floating objects */}
          {nodes.map(node => {
            const isSelected = selectedNode?.id === node.id;
            const isConnectSource = connectFrom === node.id;
            return (
              <motion.div
                key={node.id}
                drag
                dragMomentum={false}
                onDrag={(e, info) => {
                  setNodes(prev => prev.map(n => n.id === node.id ? { ...n, x: n.x + info.delta.x, y: n.y + info.delta.y } : n));
                }}
                onClick={() => handleNodeClick(node.id)}
                className={`absolute w-14 h-14 rounded-2xl flex flex-col items-center justify-center border cursor-grab active:cursor-grabbing transition-shadow select-none ${
                  isConnectSource
                    ? "bg-cyan-500/20 border-cyan-400 animate-pulse shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    : isSelected
                    ? "bg-slate-900 border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                    : "bg-slate-900/90 border-slate-800 hover:border-slate-750"
                }`}
                style={{ left: node.x - 28, top: node.y - 28 }}
              >
                {node.type === "router" && <Wifi className="w-6 h-6 text-cyan-400" />}
                {node.type === "switch" && <HardDrive className="w-6 h-6 text-purple-400" />}
                {node.type === "pc" && <Monitor className="w-6 h-6 text-emerald-400" />}
                {node.type === "server" && <Server className="w-6 h-6 text-amber-400" />}
                <span className="text-[8px] font-extrabold text-slate-300 mt-1 max-w-[50px] truncate text-center">{node.name}</span>
                {node.ip && <span className="text-[6px] font-mono text-slate-500 mt-0.5">{node.ip}</span>}
              </motion.div>
            );
          })}

          {/* Node Options Drawer */}
          {selectedNode && (
            <div className="absolute bottom-3 left-3 right-3 bg-slate-900/95 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm">{selectedNode.type === "router" ? "🥋" : selectedNode.type === "server" ? "☁️" : "💻"}</span>
                <div className="text-right">
                  <span className="text-[10px] font-black text-slate-100 block">{selectedNode.name}</span>
                  {selectedNode.ip && <span className="text-[8px] font-mono text-slate-500">{selectedNode.ip}</span>}
                </div>
              </div>
              <button
                onClick={() => deleteNode(selectedNode.id)}
                className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Action Logs */}
      <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 font-mono text-[9px] text-slate-400 max-h-24 overflow-y-auto">
        <span className="text-[8px] text-slate-500 font-extrabold block mb-1">سجل الأحداث والشبكة:</span>
        <div className="flex flex-col gap-1">
          {log.length === 0 ? "ابدأ ببناء شبكتك وتوصيل كابلات RJ45..." : log.map((l, i) => <div key={i}>{l}</div>)}
        </div>
      </div>
    </div>
  );
}

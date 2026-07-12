import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Server, Monitor, HardDrive, Wifi, Plus, Trash2, Play, 
  RefreshCw, AlertCircle, CheckCircle2, Terminal, X, ArrowRight, Cable 
} from "lucide-react";

const INITIAL_NODES = [
  { 
    id: "router_1", 
    name: "Router 1 (الراوتر الرئيسي)", 
    type: "router", 
    hostname: "Router1",
    cliMode: "user",
    cliActiveInt: "",
    x: 280, 
    y: 55,
    interfaces: {
      "Gi0/0": { ip: "192.168.1.1", subnet: "255.255.255.0", status: "up" },
      "Gi0/1": { ip: "192.168.2.1", subnet: "255.255.255.0", status: "down" }
    }
  },
  { 
    id: "switch_1", 
    name: "Switch 1 (السويتش المركزي)", 
    type: "switch", 
    hostname: "Switch1",
    cliMode: "user",
    cliActiveInt: "",
    x: 280, 
    y: 165,
    macTable: [
      { mac: "000A.0001.AAAA", port: "Fa0/2", device: "pc_1" },
      { mac: "000A.0001.BBBB", port: "Fa0/3", device: "server_1" }
    ],
    interfaces: Array.from({ length: 24 }, (_, i) => `Fa0/${i+1}`).reduce((acc, curr) => {
      acc[curr] = { status: "up" };
      return acc;
    }, {})
  },
  { 
    id: "pc_1", 
    name: "PC 1 (جهاز الموظف)", 
    type: "pc", 
    ip: "192.168.1.10", 
    subnet: "255.255.255.0",
    mac: "000A.0001.AAAA",
    gateway: "192.168.1.1",
    x: 100, 
    y: 275 
  },
  { 
    id: "server_1", 
    name: "Web Server (خادم الويب)", 
    type: "server", 
    ip: "192.168.1.100", 
    subnet: "255.255.255.0",
    mac: "000A.0001.BBBB",
    gateway: "192.168.1.1",
    x: 460, 
    y: 275 
  }
];

const INITIAL_CONNECTIONS = [
  { from: "router_1", fromPort: "Gi0/0", to: "switch_1", toPort: "Fa0/1" },
  { from: "switch_1", fromPort: "Fa0/2", to: "pc_1", toPort: "NIC" },
  { from: "switch_1", fromPort: "Fa0/3", to: "server_1", toPort: "NIC" }
];

const TROUBLESHOOTING_SCENARIOS = [
  {
    id: "free_build",
    title: "بناء حر للشبكة (Free Build)",
    objective: "مختبر مفتوح لإضافة الأجهزة وربط الكابلات وتجربة سطر الأوامر دون قيود.",
    nodes: INITIAL_NODES,
    connections: INITIAL_CONNECTIONS
  },
  {
    id: "scenario_1",
    title: "سيناريو 1: المنفذ الميت (Down Gateway Port)",
    objective: "الهدف: تمكين الاتصال (Ping) بين PC 1 و Web Server.\nالمشكلة: منفذ الراوتر الرئيسي Gi0/1 مغلق افتراضياً (shutdown). تفقد حالة المنافذ عبر CLI السيرفر أو الراوتر وقم بتفعيله.",
    nodes: [
      { 
        id: "router_1", 
        name: "Router 1 (الراوتر الرئيسي)", 
        type: "router", 
        hostname: "Router1",
        cliMode: "user",
        cliActiveInt: "",
        x: 280, 
        y: 55,
        interfaces: {
          "Gi0/0": { ip: "192.168.1.1", subnet: "255.255.255.0", status: "up" },
          "Gi0/1": { ip: "192.168.2.1", subnet: "255.255.255.0", status: "down" }
        }
      },
      { 
        id: "switch_1", 
        name: "Switch 1 (السويتش المركزي)", 
        type: "switch", 
        hostname: "Switch1",
        cliMode: "user",
        cliActiveInt: "",
        x: 280, 
        y: 165,
        macTable: [
          { mac: "000A.0001.AAAA", port: "Fa0/2", device: "pc_1" },
          { mac: "000A.0001.BBBB", port: "Fa0/3", device: "server_1" }
        ],
        interfaces: Array.from({ length: 24 }, (_, i) => `Fa0/${i+1}`).reduce((acc, curr) => {
          acc[curr] = { status: "up" };
          return acc;
        }, {})
      },
      { 
        id: "pc_1", 
        name: "PC 1 (جهاز الموظف)", 
        type: "pc", 
        ip: "192.168.1.10", 
        subnet: "255.255.255.0",
        mac: "000A.0001.AAAA",
        gateway: "192.168.1.1",
        x: 100, 
        y: 275 
      },
      { 
        id: "server_1", 
        name: "Web Server (خادم الويب)", 
        type: "server", 
        ip: "192.168.2.100", 
        subnet: "255.255.255.0",
        mac: "000A.0001.BBBB",
        gateway: "192.168.2.1",
        x: 460, 
        y: 275 
      }
    ],
    connections: [
      { from: "router_1", fromPort: "Gi0/0", to: "switch_1", toPort: "Fa0/1" },
      { from: "switch_1", fromPort: "Fa0/2", to: "pc_1", toPort: "NIC" },
      { from: "router_1", fromPort: "Gi0/1", to: "server_1", toPort: "NIC" }
    ]
  },
  {
    id: "scenario_2",
    title: "سيناريو 2: البوابة الخاطئة للعميل (Wrong Client Gateway)",
    objective: "الهدف: تمكين الاتصال (Ping) بين PC 1 و Web Server.\nالمشكلة: إعدادات العبّارة الافتراضية للعميل PC 1 غير صحيحة. انقر نقرة واحدة على PC 1 وقم بتعديل حقل Gateway ليكون IP الراوتر الصحيح (192.168.1.1).",
    nodes: [
      { 
        id: "router_1", 
        name: "Router 1 (الراوتر الرئيسي)", 
        type: "router", 
        hostname: "Router1",
        cliMode: "user",
        cliActiveInt: "",
        x: 280, 
        y: 55,
        interfaces: {
          "Gi0/0": { ip: "192.168.1.1", subnet: "255.255.255.0", status: "up" },
          "Gi0/1": { ip: "192.168.2.1", subnet: "255.255.255.0", status: "up" }
        }
      },
      { 
        id: "switch_1", 
        name: "Switch 1 (السويتش المركزي)", 
        type: "switch", 
        hostname: "Switch1",
        cliMode: "user",
        cliActiveInt: "",
        x: 280, 
        y: 165,
        macTable: [
          { mac: "000A.0001.AAAA", port: "Fa0/2", device: "pc_1" },
          { mac: "000A.0001.BBBB", port: "Fa0/3", device: "server_1" }
        ],
        interfaces: Array.from({ length: 24 }, (_, i) => `Fa0/${i+1}`).reduce((acc, curr) => {
          acc[curr] = { status: "up" };
          return acc;
        }, {})
      },
      { 
        id: "pc_1", 
        name: "PC 1 (جهاز الموظف)", 
        type: "pc", 
        ip: "192.168.1.10", 
        subnet: "255.255.255.0",
        mac: "000A.0001.AAAA",
        gateway: "192.168.1.99",
        x: 100, 
        y: 275 
      },
      { 
        id: "server_1", 
        name: "Web Server (خادم الويب)", 
        type: "server", 
        ip: "192.168.2.100", 
        subnet: "255.255.255.0",
        mac: "000A.0001.BBBB",
        gateway: "192.168.2.1",
        x: 460, 
        y: 275 
      }
    ],
    connections: [
      { from: "router_1", fromPort: "Gi0/0", to: "switch_1", toPort: "Fa0/1" },
      { from: "switch_1", fromPort: "Fa0/2", to: "pc_1", toPort: "NIC" },
      { from: "router_1", fromPort: "Gi0/1", to: "server_1", toPort: "NIC" }
    ]
  },
  {
    id: "scenario_3",
    title: "سيناريو 3: تضارب قناع الشبكة (Subnet Mismatch)",
    objective: "الهدف: تمكين الاتصال (Ping) بين PC 1 و Web Server.\nالمشكلة: قناع الشبكة (Subnet Mask) على Web Server مضبوط بشكل خاطئ على 255.255.0.0. قم بتغييره ليصبح 255.255.255.0 لحل مشكلة توجيه الحزمة.",
    nodes: [
      { 
        id: "router_1", 
        name: "Router 1 (الراوتر الرئيسي)", 
        type: "router", 
        hostname: "Router1",
        cliMode: "user",
        cliActiveInt: "",
        x: 280, 
        y: 55,
        interfaces: {
          "Gi0/0": { ip: "192.168.1.1", subnet: "255.255.255.0", status: "up" },
          "Gi0/1": { ip: "192.168.2.1", subnet: "255.255.255.0", status: "up" }
        }
      },
      { 
        id: "switch_1", 
        name: "Switch 1 (السويتش المركزي)", 
        type: "switch", 
        hostname: "Switch1",
        cliMode: "user",
        cliActiveInt: "",
        x: 280, 
        y: 165,
        macTable: [
          { mac: "000A.0001.AAAA", port: "Fa0/2", device: "pc_1" },
          { mac: "000A.0001.BBBB", port: "Fa0/3", device: "server_1" }
        ],
        interfaces: Array.from({ length: 24 }, (_, i) => `Fa0/${i+1}`).reduce((acc, curr) => {
          acc[curr] = { status: "up" };
          return acc;
        }, {})
      },
      { 
        id: "pc_1", 
        name: "PC 1 (جهاز الموظف)", 
        type: "pc", 
        ip: "192.168.1.10", 
        subnet: "255.255.255.0",
        mac: "000A.0001.AAAA",
        gateway: "192.168.1.1",
        x: 100, 
        y: 275 
      },
      { 
        id: "server_1", 
        name: "Web Server (خادم الويب)", 
        type: "server", 
        ip: "192.168.2.100", 
        subnet: "255.255.0.0",
        mac: "000A.0001.BBBB",
        gateway: "192.168.2.1",
        x: 460, 
        y: 275 
      }
    ],
    connections: [
      { from: "router_1", fromPort: "Gi0/0", to: "switch_1", toPort: "Fa0/1" },
      { from: "switch_1", fromPort: "Fa0/2", to: "pc_1", toPort: "NIC" },
      { from: "router_1", fromPort: "Gi0/1", to: "server_1", toPort: "NIC" }
    ]
  }
];

export default function NetworkTopology() {
  const [currentScenarioId, setCurrentScenarioId] = useState("free_build");
  const [scenarioSolved, setScenarioSolved] = useState(false);

  const [nodes, setNodes] = useState(() => JSON.parse(JSON.stringify(INITIAL_NODES)));
  const [connections, setConnections] = useState(() => JSON.parse(JSON.stringify(INITIAL_CONNECTIONS)));
  const [selectedNode, setSelectedNode] = useState(null);
  
  // Connect States
  const [connectFrom, setConnectFrom] = useState(null);
  const [pendingConnection, setPendingConnection] = useState(null);
  const [selectedFromPort, setSelectedFromPort] = useState("");
  const [selectedToPort, setSelectedToPort] = useState("");

  // Ping States
  const [pingSource, setPingSource] = useState("");
  const [pingTarget, setPingTarget] = useState("");
  const [packetAnim, setPacketAnim] = useState(null);
  const [log, setLog] = useState([]);
  
  // CLI States
  const [cliOpenNode, setCliOpenNode] = useState(null);
  const [cliInput, setCliInput] = useState("");
  const [cliHistory, setCliHistory] = useState([]);
  const cliInputRef = useRef(null);

  // Packet Inspection State
  const [inspectedPacket, setInspectedPacket] = useState(null);

  // Drag State
  const [draggingId, setDraggingId] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (cliOpenNode) {
      const node = nodes.find(n => n.id === cliOpenNode);
      if (node) {
        const hostname = node.hostname || (node.type === "router" ? "Router" : "Switch");
        const prompt = getCliPrompt(node.cliMode || "user", hostname, node.cliActiveInt);
        setCliHistory([
          `=== محاكي نظام تشغيل ${node.type === "router" ? "Cisco Router (IOS)" : "Cisco Switch (IOS)"} ===`,
          `اضغط على 'help' أو '?' لعرض الأوامر المدعومة.`,
          ``,
          prompt
        ]);
      }
    }
  }, [cliOpenNode]);

  const addLog = (msg) => {
    setLog(prev => [msg, ...prev].slice(0, 15));
  };

  const getCliPrompt = (mode, hostname, activeInt) => {
    if (mode === "user") return `${hostname}>`;
    if (mode === "privilege") return `${hostname}#`;
    if (mode === "config") return `${hostname}(config)#`;
    if (mode === "config-if") return `${hostname}(config-if)#`;
    return `${hostname}>`;
  };

  const handleScenarioChange = (scenarioId) => {
    setCurrentScenarioId(scenarioId);
    const scenario = TROUBLESHOOTING_SCENARIOS.find(s => s.id === scenarioId);
    if (scenario) {
      setNodes(JSON.parse(JSON.stringify(scenario.nodes)));
      setConnections(JSON.parse(JSON.stringify(scenario.connections)));
      setScenarioSolved(false);
      setSelectedNode(null);
      setConnectFrom(null);
      setPendingConnection(null);
      setPingSource("");
      setPingTarget("");
      setPacketAnim(null);
      setLog([`📂 تم تحميل السيناريو: ${scenario.title}`]);
      setCliOpenNode(null);
      setInspectedPacket(null);
    }
  };

  // Add new nodes
  const addNode = (type) => {
    const id = `${type}_${Date.now()}`;
    let name = "";
    let ip = "";
    let mac = `000A.0001.${Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase()}`;
    
    let extra = {};
    if (type === "router") { 
      name = `Router ${nodes.filter(n => n.type === "router").length + 1}`; 
      extra = {
        hostname: name.replace(/\s+/g, ""),
        cliMode: "user",
        cliActiveInt: "",
        interfaces: {
          "Gi0/0": { ip: "192.168.2.1", subnet: "255.255.255.0", status: "down" },
          "Gi0/1": { ip: "10.0.0.1", subnet: "255.255.255.0", status: "down" }
        }
      };
    } else if (type === "switch") { 
      name = `Switch ${nodes.filter(n => n.type === "switch").length + 1}`; 
      extra = {
        hostname: name.replace(/\s+/g, ""),
        cliMode: "user",
        cliActiveInt: "",
        macTable: [],
        interfaces: Array.from({ length: 24 }, (_, i) => `Fa0/${i+1}`).reduce((acc, curr) => {
          acc[curr] = { status: "up" };
          return acc;
        }, {})
      };
    } else if (type === "pc") { 
      name = `PC ${nodes.filter(n => n.type === "pc").length + 1}`; 
      ip = "192.168.1.20";
      extra = { ip, subnet: "255.255.255.0", mac, gateway: "192.168.1.1" };
    } else if (type === "server") { 
      name = `Server ${nodes.filter(n => n.type === "server").length + 1}`; 
      ip = "192.168.1.200";
      extra = { ip, subnet: "255.255.255.0", mac, gateway: "192.168.1.1" };
    }

    const newNode = {
      id, name, type,
      x: 120 + Math.random() * 200,
      y: 120 + Math.random() * 150,
      ...extra
    };
    setNodes(prev => [...prev, newNode]);
    addLog(`➕ تم إضافة جهاز جديد: ${name}`);
  };

  // Delete Node and its connections
  const deleteNode = (id) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    setConnections(prev => prev.filter(c => c.from !== id && c.to !== id));
    setSelectedNode(null);
    if (cliOpenNode === id) setCliOpenNode(null);
    addLog(`🗑️ تم إزالة الجهاز: ${id}`);
  };

  // Get available ports of a device
  const getAvailablePorts = (node) => {
    if (!node) return [];
    let ports = [];
    if (node.type === "pc" || node.type === "server") {
      ports = ["NIC"];
    } else if (node.type === "router") {
      ports = ["Gi0/0", "Gi0/1"];
    } else if (node.type === "switch") {
      ports = Array.from({ length: 24 }, (_, i) => `Fa0/${i+1}`);
    }

    // Filter out already used ports in active connections
    const usedPorts = connections
      .filter(c => c.from === node.id || c.to === node.id)
      .map(c => c.from === node.id ? c.fromPort : c.toPort);

    return ports.filter(p => !usedPorts.includes(p));
  };

  // Node connection initiator
  const handleNodeClick = (nodeId) => {
    if (connectFrom === "SELECT_SOURCE") {
      setConnectFrom(nodeId);
      const srcNode = nodes.find(n => n.id === nodeId);
      const ports = getAvailablePorts(srcNode);
      if (ports.length === 0) {
        addLog(`⚠️ لا توجد منافذ شبكية فارغة متاحة في ${srcNode.name}!`);
        setConnectFrom(null);
        return;
      }
      setSelectedFromPort(ports[0]);
      addLog(`🔌 تم اختيار ${srcNode.name} كمصدر. انقر على الجهاز الثاني للتوصيل...`);
      return;
    }

    if (connectFrom) {
      if (connectFrom === nodeId) {
        setConnectFrom(null);
        addLog("🔌 تم إلغاء وضع التوصيل.");
        return;
      }

      // Connection to target node
      const fromNode = nodes.find(n => n.id === connectFrom);
      const toNode = nodes.find(n => n.id === nodeId);
      const toPorts = getAvailablePorts(toNode);

      if (toPorts.length === 0) {
        addLog(`⚠️ لا توجد منافذ شبكية فارغة متاحة في ${toNode.name}!`);
        setConnectFrom(null);
        return;
      }

      setSelectedToPort(toPorts[0]);
      setPendingConnection({ fromNode, toNode });
      setConnectFrom(null);
    } else {
      setSelectedNode(nodes.find(n => n.id === nodeId));
    }
  };

  const confirmPendingConnection = () => {
    if (!pendingConnection) return;
    const { fromNode, toNode } = pendingConnection;
    
    setConnections(prev => [...prev, { 
      from: fromNode.id, 
      fromPort: selectedFromPort, 
      to: toNode.id, 
      toPort: selectedToPort 
    }]);

    addLog(`🔌 توصيل: تم ربط كابل شبكي بين ${fromNode.name} (${selectedFromPort}) و ${toNode.name} (${selectedToPort})`);
    setPendingConnection(null);
  };

  // Start ping packet simulation with L2/L3 verification
  const startPing = () => {
    if (!pingSource || !pingTarget) return;
    if (pingSource === pingTarget) return;

    const srcNode = nodes.find(n => n.id === pingSource);
    const destNode = nodes.find(n => n.id === pingTarget);

    addLog(`📡 بدء فحص الاتصال (Ping) من ${srcNode.name} إلى ${destNode.name}...`);
    
    // Build packet inspection trace steps
    const steps = [];
    let success = false;
    let failReason = "";

    // L3 Routing Verification
    const isSameSubnet = (ip1, ip2, sub) => {
      const parts1 = ip1.split(".").slice(0, 3).join(".");
      const parts2 = ip2.split(".").slice(0, 3).join(".");
      return parts1 === parts2;
    };

    steps.push({
      title: "توليد حزمة ICMP Echo Request",
      desc: `قام الجهاز ${srcNode.name} بتوليد حزمة فحص اتصال.`,
      l2: `MAC المصدر: ${srcNode.mac || "غياب MAC"} | MAC الهدف: FF:FF:FF:FF:FF:FF (ARP Request)`,
      l3: `IP المصدر: ${srcNode.ip} | IP الهدف: ${destNode.ip}`,
      port: "منفذ الخروج: NIC"
    });

    // Check physical cabling path
    const hasPath = (curr, target, visited = new Set()) => {
      if (curr === target) return true;
      visited.add(curr);
      const links = connections.filter(c => c.from === curr || c.to === curr);
      for (const link of links) {
        const next = link.from === curr ? link.to : link.from;
        if (!visited.has(next)) {
          if (hasPath(next, target, visited)) return true;
        }
      }
      return false;
    };

    const cPathExists = hasPath(srcNode.id, destNode.id);

    if (!cPathExists) {
      failReason = "⚠️ فشل الاتصال: لا يوجد اتصال كابلي فيزيائي بين الجهازين!";
    } else {
      // Check subnet and gateway routing
      if (isSameSubnet(srcNode.ip, destNode.ip, srcNode.subnet)) {
        // Direct subnet communication (Switch path)
        success = true;
        steps.push({
          title: "المرور عبر السويتش (L2 switching)",
          desc: "السويتش يمرر الإشارات بناءً على عناوين MAC المخزنة في جدول Address Table.",
          l2: `منفذ الدخول: Fa0/2 | منفذ الخروج الموجه للهدف: Fa0/3`,
          l3: `بروتوكول: ICMP (نوع 8 - Echo)`,
          port: "تم العثور على MAC الهدف في الـ Switch Table"
        });
      } else {
        // Different subnets - routing needed via Router
        const localRouter = nodes.find(n => n.type === "router" && isSameSubnet(srcNode.ip, Object.values(n.interfaces)[0].ip, srcNode.subnet));
        const activeRouterInt = localRouter ? Object.keys(localRouter.interfaces).find(key => isSameSubnet(srcNode.ip, localRouter.interfaces[key].ip, srcNode.subnet)) : null;

        if (!localRouter || !activeRouterInt || localRouter.interfaces[activeRouterInt].status !== "up") {
          failReason = "⚠️ فشل الاتصال: تعذر العثور على بوابة افتراضية (Default Gateway) نشطة في نفس النطاق الشبكي!";
        } else if (srcNode.gateway !== localRouter.interfaces[activeRouterInt].ip) {
          failReason = `⚠️ فشل الاتصال: خطأ في إعدادات بوابة الجهاز (${srcNode.name}) الافتراضية. يجب أن تشير إلى IP الراوتر المحايد: ${localRouter.interfaces[activeRouterInt].ip}`;
        } else {
          // Gateway OK, check routing to destination subnet
          const destRouterInt = Object.keys(localRouter.interfaces).find(key => isSameSubnet(destNode.ip, localRouter.interfaces[key].ip, destNode.subnet));
          if (!destRouterInt || localRouter.interfaces[destRouterInt].status !== "up") {
            failReason = `⚠️ فشل الاتصال: منفذ الخروج في الراوتر (${destRouterInt || "المنفذ المقابل"}) غير مفعل (Administratively Down). يرجى فتح المنفذ عبر الـ CLI باستخدام الأمر 'no shutdown'.`;
          } else {
            success = true;
            steps.push({
              title: "توجيه البوابة الافتراضية (Routing to Gateway)",
              desc: `أرسل الجهاز الحزمة إلى الراوتر ${localRouter.name} لأن الهدف يقع في شبكة خارجية.`,
              l2: `MAC المصدر: ${srcNode.mac} | MAC البوابة: 000A.0001.CCCC`,
              l3: `IP المصدر: ${srcNode.ip} | IP الهدف: ${destNode.ip}`,
              port: `عبر المنفذ: ${activeRouterInt}`
            });
            steps.push({
              title: "معالجة الراوتر وإعادة التوجيه (L3 Routing)",
              desc: `قام الراوتر بالبحث في جدول التوجيه (Routing Table) وتوجيه الحزمة لمنفذ الشبكة المستهدفة.`,
              l2: `تحديث رأس الإطار: MAC خروج الراوتر -> MAC كارت السيرفر`,
              l3: `مقارنة الشبكة: مطابقة النطاق ${destNode.ip.split(".").slice(0, 3).join(".")}.0/24`,
              port: `منفذ الخروج للراوتر: ${destRouterInt}`
            });
          }
        }
      }
    }

    if (success) {
      steps.push({
        title: "وصول حزمة Echo Request للهدف",
        desc: `استقبل ${destNode.name} الحزمة بنجاح وقام بتوليد حزمة Echo Reply لإعادتها.`,
        l2: `MAC المصدر: ${destNode.mac} | MAC الهدف: ${srcNode.mac}`,
        l3: `IP المصدر: ${destNode.ip} | IP الهدف: ${srcNode.ip}`,
        port: "حالة الخدمة: نشط"
      });
      steps.push({
        title: "نجاح استجابة Ping بالكامل",
        desc: `وصلت حزمة الرد للجهاز المصدر ${srcNode.name}.`,
        l2: `نجاح الاستلام والقياس بنجاح. RTT < 1ms`,
        l3: `حزم مرسلة: 4 | حزم مستلمة: 4 | المفقود: 0%`,
        port: "أنهيت العملية بنجاح"
      });
    } else {
      steps.push({
        title: "توقف مسار الحزمة (Request Timed Out)",
        desc: failReason,
        l2: "فشل التحقق الفيزيائي أو المنطقي",
        l3: "إسقاط الحزمة بمستشعر الشبكة المصغر",
        port: "الحالة: Down"
      });
    }

    setInspectedPacket({ success, steps });

    // Trigger visual packet animation
    setPacketAnim({
      fromX: srcNode.x, fromY: srcNode.y,
      toX: destNode.x, toY: destNode.y,
      step: success ? "sending" : "failed"
    });

    setTimeout(() => {
      if (success) {
        setPacketAnim({
          fromX: destNode.x, fromY: destNode.y,
          toX: srcNode.x, toY: srcNode.y,
          step: "replying"
        });

        setTimeout(() => {
          setPacketAnim(null);
          addLog(`✅ نجاح الاتصال: تم استقبال الرد من ${destNode.ip} بنجاح!`);
          
          if (currentScenarioId !== "free_build" && !scenarioSolved) {
            const hasSolved = (currentScenarioId === "scenario_1" || currentScenarioId === "scenario_2" || currentScenarioId === "scenario_3") && 
              ((pingSource === "pc_1" && pingTarget === "server_1") || (pingSource === "server_1" && pingTarget === "pc_1"));
            
            if (hasSolved) {
              setScenarioSolved(true);
              addLog(`🎉 مبارك! تم حل سيناريو المشكلة بنجاح واستعادة الاتصال!`);
              window.dispatchEvent(new CustomEvent("trigger-confetti"));
            }
          }
        }, 1000);
      } else {
        setPacketAnim(null);
        addLog(failReason);
      }
    }, 1000);
  };

  // Handle CLI command submission
  const handleCliSubmit = (e) => {
    if (e.key === "Enter") {
      const cmd = cliInput;
      setCliInput("");
      
      const node = nodes.find(n => n.id === cliOpenNode);
      if (!node) return;

      const hostname = node.hostname || (node.type === "router" ? "Router" : "Switch");
      const currentPrompt = getCliPrompt(node.cliMode || "user", hostname, node.cliActiveInt);

      const output = processCliCommand(cliOpenNode, cmd);

      // Grab updated parameters
      setTimeout(() => {
        setNodes(prev => {
          const updatedNode = prev.find(n => n.id === cliOpenNode);
          if (updatedNode) {
            const nextPrompt = getCliPrompt(updatedNode.cliMode || "user", updatedNode.hostname, updatedNode.cliActiveInt);
            setCliHistory(prevHist => [
              ...prevHist.slice(0, -1),
              `${currentPrompt} ${cmd}`,
              output,
              nextPrompt
            ].filter(line => line !== ""));
          }
          return prev;
        });
      }, 50);
    }
  };

  const processCliCommand = (nodeId, cmdStr) => {
    const cmd = cmdStr.trim();
    if (!cmd) return "";

    const parts = cmd.split(/\s+/);
    const main = parts[0].toLowerCase();
    
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return "Device not found.";

    let output = "";
    let nextMode = node.cliMode || "user";
    let nextHostname = node.hostname || (node.type === "router" ? "Router" : "Switch");
    let nextActiveInt = node.cliActiveInt || "";

    if (main === "enable" || main === "en") {
      if (nextMode === "user") {
        nextMode = "privilege";
      } else {
        output = "% Already in privilege mode.";
      }
    } else if (main === "disable") {
      if (nextMode === "privilege") {
        nextMode = "user";
      } else {
        output = "% Cannot disable from this mode.";
      }
    } else if (main === "configure" || main === "conf") {
      if (parts[1]?.toLowerCase() === "terminal" || parts[1]?.toLowerCase() === "t") {
        if (nextMode === "privilege") {
          nextMode = "config";
        } else {
          output = "% Must be in enable mode to configure.";
        }
      } else {
        output = "% Incomplete command.";
      }
    } else if (main === "exit" || main === "ex") {
      if (nextMode === "config-if") {
        nextMode = "config";
        nextActiveInt = "";
      } else if (nextMode === "config") {
        nextMode = "privilege";
      } else if (nextMode === "privilege") {
        nextMode = "user";
      } else {
        output = "% Already at root mode.";
      }
    } else if (main === "hostname" || main === "host") {
      if (nextMode === "config") {
        if (parts[1]) {
          nextHostname = parts[1];
        } else {
          output = "% Hostname required.";
        }
      } else {
        output = "% Must be in config mode to change hostname.";
      }
    } else if (main === "interface" || main === "int") {
      if (nextMode === "config") {
        const intName = parts[1];
        if (intName) {
          const validInts = node.type === "router" ? ["Gi0/0", "Gi0/1"] : Array.from({ length: 24 }, (_, i) => `Fa0/${i+1}`);
          const match = validInts.find(i => i.toLowerCase() === intName.toLowerCase() || i.toLowerCase().replace("/", "") === intName.toLowerCase());
          if (match) {
            nextMode = "config-if";
            nextActiveInt = match;
          } else {
            output = "% Invalid interface name.";
          }
        } else {
          output = "% Interface required.";
        }
      } else {
        output = "% Must be in config mode to select interface.";
      }
    } else if (main === "ip") {
      if (nextMode === "config-if" && (parts[1]?.toLowerCase() === "address" || parts[1]?.toLowerCase() === "add")) {
        const ip = parts[2];
        const subnet = parts[3];
        if (ip && subnet) {
          if (node.type === "router") {
            setNodes(prev => prev.map(n => {
              if (n.id === nodeId) {
                const updatedInts = { ...n.interfaces };
                updatedInts[nextActiveInt] = { ...updatedInts[nextActiveInt], ip, subnet };
                return { ...n, interfaces: updatedInts };
              }
              return n;
            }));
            output = "";
          } else {
            output = "% IP address cannot be configured directly on L2 Switch interface.";
          }
        } else {
          output = "% Incomplete command. Usage: ip address <ip> <subnet>";
        }
      } else {
        output = "% Invalid command in this mode.";
      }
    } else if (main === "no" && (parts[1]?.toLowerCase() === "shutdown" || parts[1]?.toLowerCase() === "shut")) {
      if (nextMode === "config-if") {
        setNodes(prev => prev.map(n => {
          if (n.id === nodeId) {
            const updatedInts = { ...n.interfaces };
            updatedInts[nextActiveInt] = { ...updatedInts[nextActiveInt], status: "up" };
            return { ...n, interfaces: updatedInts };
          }
          return n;
        }));
        output = `\n%LINK-5-CHANGED: Interface ${nextActiveInt}, changed state to up\n%LINEPROTO-5-UPDOWN: Line protocol on Interface ${nextActiveInt}, changed state to up`;
      } else {
        output = "% Invalid command in this mode.";
      }
    } else if (main === "shutdown" || main === "shut") {
      if (nextMode === "config-if") {
        setNodes(prev => prev.map(n => {
          if (n.id === nodeId) {
            const updatedInts = { ...n.interfaces };
            updatedInts[nextActiveInt] = { ...updatedInts[nextActiveInt], status: "down" };
            return { ...n, interfaces: updatedInts };
          }
          return n;
        }));
        output = `\n%LINK-5-CHANGED: Interface ${nextActiveInt}, changed state to administratively down\n%LINEPROTO-5-UPDOWN: Line protocol on Interface ${nextActiveInt}, changed state to down`;
      } else {
        output = "% Invalid command in this mode.";
      }
    } else if (main === "show" || main === "sh") {
      const sub = parts[1]?.toLowerCase();
      if (sub === "ip") {
        const subsub = parts[2]?.toLowerCase();
        if (subsub === "interface" || subsub === "int") {
          output = `Interface              IP-Address      OK? Method Status                Protocol\n`;
          const intList = node.type === "router" ? ["Gi0/0", "Gi0/1"] : Array.from({ length: 24 }, (_, i) => `Fa0/${i+1}`);
          intList.forEach(name => {
            const config = node.interfaces?.[name] || { ip: "unassigned", status: "down" };
            const ipStr = config.ip || "unassigned";
            const statStr = config.status === "up" ? "up" : "administratively down";
            const protoStr = config.status === "up" ? "up" : "down";
            output += `${name.padEnd(23)}${ipStr.padEnd(16)}YES manual ${statStr.padEnd(22)}${protoStr}\n`;
          });
        } else if (subsub === "route") {
          if (node.type === "router") {
            output = `Codes: C - connected, S - static, R - RIP, M - mobile, B - BGP\n\n`;
            let routingLines = [];
            Object.keys(node.interfaces || {}).forEach(name => {
              const conf = node.interfaces[name];
              if (conf.status === "up" && conf.ip) {
                const netParts = conf.ip.split(".");
                netParts[3] = "0";
                const netIp = netParts.join(".");
                routingLines.push(`C    ${netIp}/24 is directly connected, ${name}`);
              }
            });
            output += routingLines.length > 0 ? routingLines.join("\n") : "% Routing table is empty (interfaces down or unassigned)";
          } else {
            output = "% L2 Switch does not maintain an IP routing table.";
          }
        } else {
          output = "% Invalid show ip command.";
        }
      } else if (sub === "mac" || sub === "mac-address-table") {
        if (node.type === "switch") {
          output = `          Mac Address Table\n-------------------------------------------\nVlan    Mac Address       Type        Ports\n----    -----------       ----        -----\n`;
          (node.macTable || []).forEach(item => {
            output += `   1    ${item.mac}     DYNAMIC     ${item.port}\n`;
          });
        } else {
          output = "% Router does not maintain a MAC Address Table.";
        }
      } else {
        output = "% Invalid show command.";
      }
    } else if (main === "help" || main === "?") {
      output = `Cisco IOS Commands:\n` +
               `  enable                  - Enter privilege EXEC mode\n` +
               `  disable                 - Return to user EXEC mode\n` +
               `  configure terminal      - Enter global configuration mode\n` +
               `  hostname <name>         - Change router/switch hostname (config mode)\n` +
               `  interface <name>        - Select interface to configure (config mode)\n` +
               `  ip address <ip> <subnet> - Assign IP address to interface (config-if mode)\n` +
               `  no shutdown             - Enable interface (config-if mode)\n` +
               `  shutdown                - Disable interface (config-if mode)\n` +
               `  show ip interface brief - Display interface status table\n` +
               `  show ip route           - Display active IP routing table\n` +
               `  show mac address-table  - Display MAC address table (Switch only)\n` +
               `  exit                    - Exit current mode`;
    } else {
      output = `% Invalid input or command unrecognized: "${cmd}"`;
    }

    setNodes(prev => prev.map(n => {
      if (n.id === nodeId) {
        return {
          ...n,
          cliMode: nextMode,
          hostname: nextHostname,
          cliActiveInt: nextActiveInt
        };
      }
      return n;
    }));

    return output;
  };

  // Pointer drag events
  const handlePointerMove = (e) => {
    if (!draggingId || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    x = Math.max(28, Math.min(rect.width - 28, x));
    y = Math.max(28, Math.min(rect.height - 28, y));

    setNodes(prev => prev.map(n => n.id === draggingId ? { ...n, x, y } : n));
  };

  const handlePointerUp = () => {
    setDraggingId(null);
  };

  return (
    <div 
      id="network-topology"
      className="glass-card rounded-2xl p-6 flex flex-col gap-6 shadow-lg relative text-right scroll-mt-28"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div className="border-b border-slate-800 pb-3 flex justify-between items-center flex-row-reverse flex-wrap gap-3">
        <div>
          <h3 className="font-extrabold text-sm text-slate-100 flex items-center justify-start gap-2 flex-row-reverse">
            <Wifi className="w-5 h-5 text-cyan-400" />
            محاكي توبولوجيا الشبكات التفاعلي (Network Topology Labs Pro)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            انقر نقراً مزدوجاً على الأجهزة لفتح شاشة الأوامر CLI، صل كابلات الأسلاك بفتحات محددة، واختبر حزم البيانات.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-row-reverse">
          <span className="text-[10px] text-slate-400 font-bold">وضع المختبر:</span>
          <select
            value={currentScenarioId}
            onChange={(e) => handleScenarioChange(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-350 hover:border-cyan-500/30 transition-colors cursor-pointer font-bold"
          >
            {TROUBLESHOOTING_SCENARIOS.map(s => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
        </div>
      </div>

      {currentScenarioId !== "free_build" && (
        <div className={`p-4 rounded-xl border transition-all flex flex-col gap-1.5 text-right ${
          scenarioSolved 
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.05)]" 
            : "bg-amber-500/5 border-amber-500/20 text-amber-300"
        }`}>
          <div className="flex items-center justify-between flex-row-reverse">
            <span className="text-xs font-black flex items-center gap-1.5 flex-row-reverse">
              {scenarioSolved ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-amber-400" />}
              {scenarioSolved ? "تم حل المشكلة واستعادة الشبكة بنجاح! 🎉 (+50 XP)" : "مهمة نشطة: تشخيص وإصلاح العطل الشبكي"}
            </span>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 uppercase text-slate-400">
              {scenarioSolved ? "مكتمل" : "جاري الحل"}
            </span>
          </div>
          <p className="text-[10px] whitespace-pre-line text-slate-300 leading-relaxed font-medium mt-1">
            {TROUBLESHOOTING_SCENARIOS.find(s => s.id === currentScenarioId)?.objective}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Controls */}
        <div className="lg:col-span-1 flex flex-col gap-4">
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

          {/* Connect Cables */}
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

          {/* Ping Panel */}
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
                    <option key={n.id} value={n.id}>{n.name} ({n.ip || "بلا IP"})</option>
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
                    <option key={n.id} value={n.id}>{n.name} ({n.ip || "بلا IP"})</option>
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

        {/* Center SVG Workspace */}
        <div 
          ref={containerRef}
          onClick={() => setSelectedNode(null)}
          className="lg:col-span-3 bg-slate-950/80 border border-slate-850 rounded-xl relative overflow-hidden h-[360px] cursor-default"
        >
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Connection Lines */}
            {connections.map((c, i) => {
              const fromNode = nodes.find(n => n.id === c.from);
              const toNode = nodes.find(n => n.id === c.to);
              if (!fromNode || !toNode) return null;
              return (
                <g key={i}>
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke="#1e293b"
                    strokeWidth="3.5"
                  />
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke="#0ea5e9"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                </g>
              );
            })}

            {/* Packet Animation */}
            {packetAnim && (
              <motion.circle
                cx={packetAnim.fromX}
                cy={packetAnim.fromY}
                r="7"
                fill={packetAnim.step === "sending" ? "#06b6d4" : packetAnim.step === "failed" ? "#ef4444" : "#10b981"}
                animate={{ cx: packetAnim.toX, cy: packetAnim.toY }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
            )}
          </svg>

          {/* Floating Devices */}
          {nodes.map(node => {
            const isSelected = selectedNode?.id === node.id;
            const isConnectSource = connectFrom === node.id;
            return (
              <div
                key={node.id}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setDraggingId(node.id);
                  setSelectedNode(node);
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  if (node.type === "router" || node.type === "switch") {
                    setCliOpenNode(node.id);
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleNodeClick(node.id);
                }}
                title="اضغط نقرة مزدوجة لفتح الـ CLI"
                className={`absolute w-14 h-14 rounded-2xl flex flex-col items-center justify-center border cursor-grab active:cursor-grabbing transition-all select-none ${
                  isConnectSource
                    ? "bg-cyan-500/20 border-cyan-400 animate-pulse shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    : isSelected
                    ? "bg-slate-900 border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                    : "bg-slate-900/90 border-slate-800 hover:border-slate-750"
                }`}
                style={{ 
                  left: node.x - 28, 
                  top: node.y - 28,
                  touchAction: "none" 
                }}
              >
                {node.type === "router" && <Wifi className="w-6 h-6 text-cyan-400" />}
                {node.type === "switch" && <HardDrive className="w-6 h-6 text-purple-400" />}
                {node.type === "pc" && <Monitor className="w-6 h-6 text-emerald-400" />}
                {node.type === "server" && <Server className="w-6 h-6 text-amber-400" />}
                <span className="text-[8px] font-extrabold text-slate-300 mt-1 max-w-[50px] truncate text-center">{node.name}</span>
                {node.ip && <span className="text-[6px] font-mono text-slate-500 mt-0.5">{node.ip}</span>}
              </div>
            );
          })}

          {/* Connection Ports Picker Overlay */}
          {pendingConnection && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-30 flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl max-w-sm w-full flex flex-col gap-4 text-right">
                <span className="font-extrabold text-xs text-slate-200 block border-b border-slate-800 pb-2">اختيار فتحات الكابل (Select Ports)</span>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 font-bold">{pendingConnection.fromNode.name} المنفذ في:</span>
                    <select 
                      value={selectedFromPort} 
                      onChange={e => setSelectedFromPort(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-300"
                    >
                      {getAvailablePorts(pendingConnection.fromNode).map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 font-bold">{pendingConnection.toNode.name} المنفذ في:</span>
                    <select 
                      value={selectedToPort} 
                      onChange={e => setSelectedToPort(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-300"
                    >
                      {getAvailablePorts(pendingConnection.toNode).map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-start gap-2 mt-2">
                  <button onClick={confirmPendingConnection} className="bg-cyan-500 text-slate-950 px-4 py-1.5 rounded-lg text-xs font-black hover:bg-cyan-400 cursor-pointer">توصيل</button>
                  <button onClick={() => setPendingConnection(null)} className="bg-slate-950 border border-slate-800 text-slate-400 px-4 py-1.5 rounded-lg text-xs font-bold hover:text-slate-200 cursor-pointer">إلغاء</button>
                </div>
              </div>
            </div>
          )}

          {/* Node details drawer */}
          {selectedNode && !pendingConnection && (
            <div className="absolute bottom-3 left-3 right-3 bg-slate-900/95 border border-slate-850 rounded-xl p-3 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <span className="text-sm">
                  {selectedNode.type === "router" ? "🥋" : selectedNode.type === "switch" ? "⚙️" : "💻"}
                </span>
                <div className="text-right">
                  <span className="text-[10px] font-black text-slate-100 block">{selectedNode.name}</span>
                  {selectedNode.ip && (selectedNode.type === "pc" || selectedNode.type === "server") ? (
                    <div className="flex gap-2 items-center mt-1 flex-row-reverse flex-wrap">
                      <div className="flex flex-col gap-0.5 items-end">
                        <span className="text-[7px] text-slate-500 font-bold">IP العنوان</span>
                        <input
                          type="text"
                          value={selectedNode.ip}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNodes(prev => prev.map(n => n.id === selectedNode.id ? { ...n, ip: val } : n));
                            setSelectedNode(prev => ({ ...prev, ip: val }));
                          }}
                          className="bg-slate-950 border border-slate-850 rounded px-1 py-0.5 text-[8px] font-mono text-slate-200 w-24 text-center focus:border-cyan-500/50 outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-0.5 items-end">
                        <span className="text-[7px] text-slate-500 font-bold">قناع الشبكة</span>
                        <input
                          type="text"
                          value={selectedNode.subnet}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNodes(prev => prev.map(n => n.id === selectedNode.id ? { ...n, subnet: val } : n));
                            setSelectedNode(prev => ({ ...prev, subnet: val }));
                          }}
                          className="bg-slate-950 border border-slate-850 rounded px-1 py-0.5 text-[8px] font-mono text-slate-200 w-24 text-center focus:border-cyan-500/50 outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-0.5 items-end">
                        <span className="text-[7px] text-slate-500 font-bold">العبّارة الافتراضية</span>
                        <input
                          type="text"
                          value={selectedNode.gateway}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNodes(prev => prev.map(n => n.id === selectedNode.id ? { ...n, gateway: val } : n));
                            setSelectedNode(prev => ({ ...prev, gateway: val }));
                          }}
                          className="bg-slate-950 border border-slate-850 rounded px-1 py-0.5 text-[8px] font-mono text-slate-200 w-24 text-center focus:border-cyan-500/50 outline-none"
                        />
                      </div>
                    </div>
                  ) : (
                    selectedNode.ip && <span className="text-[8px] font-mono text-slate-500 block">IP: {selectedNode.ip} | Gateway: {selectedNode.gateway}</span>
                  )}
                  {selectedNode.type === "router" && (
                    <span className="text-[8px] font-mono text-cyan-400 block mt-0.5">
                      Gi0/0: {selectedNode.interfaces?.["Gi0/0"]?.ip || "unassigned"} ({selectedNode.interfaces?.["Gi0/0"]?.status})
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {(selectedNode.type === "router" || selectedNode.type === "switch") && (
                  <button 
                    onClick={() => setCliOpenNode(selectedNode.id)}
                    className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 cursor-pointer flex items-center gap-1 text-[9px] font-bold"
                  >
                    <Terminal className="w-3.5 h-3.5" /> افتح CLI
                  </button>
                )}
                <button
                  onClick={() => deleteNode(selectedNode.id)}
                  className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cisco IOS CLI Terminal Modal */}
      <AnimatePresence>
        {cliOpenNode && (
          <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full h-[450px] flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="bg-slate-950 px-4 py-3 flex items-center justify-between border-b border-slate-850 flex-row-reverse">
                <div className="flex items-center gap-2 flex-row-reverse">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-extrabold text-slate-200">شاشة أوامر Cisco CLI: {nodes.find(n => n.id === cliOpenNode)?.name}</span>
                </div>
                <button 
                  onClick={() => setCliOpenNode(null)}
                  className="text-slate-400 hover:text-rose-400 transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Console log */}
              <div 
                className="flex-grow p-4 bg-black font-mono text-xs text-green-400 overflow-y-auto flex flex-col gap-1 text-left"
                onClick={() => cliInputRef.current?.focus()}
              >
                {cliHistory.map((line, i) => (
                  <div key={i} className="whitespace-pre-wrap">{line}</div>
                ))}
                
                {/* Input prompt */}
                <div className="flex items-center gap-1.5 mt-2">
                  <input
                    ref={cliInputRef}
                    type="text"
                    value={cliInput}
                    onChange={e => setCliInput(e.target.value)}
                    onKeyDown={handleCliSubmit}
                    className="flex-1 bg-transparent border-none text-green-400 outline-none p-0 text-left font-mono focus:ring-0"
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Packet Inspector & System Logs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Packet Inspector Panel */}
        <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col gap-3">
          <span className="text-[10px] text-slate-500 font-extrabold block border-b border-slate-900 pb-1.5">مفتش حزم البيانات (ICMP Packet Inspector):</span>
          {inspectedPacket ? (
            <div className="flex flex-col gap-3 max-h-[160px] overflow-y-auto pr-1">
              {inspectedPacket.steps.map((step, i) => (
                <div key={i} className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 text-right flex flex-col gap-1 text-[10px]">
                  <div className="flex items-center justify-between border-b border-slate-850/60 pb-1">
                    <span className="text-[8px] bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded-md font-extrabold">{step.port}</span>
                    <span className="font-bold text-slate-200">{step.title}</span>
                  </div>
                  <p className="text-slate-400 text-[9px] mt-0.5">{step.desc}</p>
                  <div className="flex flex-col gap-0.5 font-mono text-[8px] text-slate-500 mt-1 border-t border-slate-850/30 pt-1">
                    <div>L2: {step.l2}</div>
                    <div>L3: {step.l3}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center min-h-[100px] text-slate-500 text-[10px]">
              <AlertCircle className="w-5 h-5 mb-1.5 text-slate-600" />
              <span>لا توجد بيانات للفحص حالياً. قم بإطلاق Ping لعرض مسار الحزمة.</span>
            </div>
          )}
        </div>

        {/* Action Logs */}
        <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 font-mono text-[9px] text-slate-400 max-h-48 overflow-y-auto">
          <span className="text-[8px] text-slate-500 font-extrabold block mb-1">سجل الأحداث والشبكة:</span>
          <div className="flex flex-col gap-1">
            {log.map((msg, i) => (
              <div key={i} className="text-right">{msg}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

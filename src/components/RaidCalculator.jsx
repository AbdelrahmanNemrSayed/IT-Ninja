import React, { useState, useEffect, memo } from "react";
import { HardDrive, Info, AlertTriangle, ShieldCheck } from "lucide-react";

const raidDetails = {
  "0": {
    name: "RAID 0 (Striping)",
    desc: "توزيع البيانات على الأقراص بالتوازي. يوفر سرعة فائقة جداً ولكن بدون أي حماية (تلف قرص واحد يعني فقدان كامل البيانات).",
    minDisks: 2,
    color: "text-rose-400 border-rose-500/20 bg-rose-500/5"
  },
  "1": {
    name: "RAID 1 (Mirroring)",
    desc: "نسخ البيانات بالكامل وتكرارها على الأقراص. يوفر حماية فائقة للبيانات، لكن السعة الإجمالية تساوي سعة قرص واحد فقط.",
    minDisks: 2,
    color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5"
  },
  "5": {
    name: "RAID 5 (Parity)",
    desc: "توزيع البيانات مع معلومات التماثل (Parity) لحماية البيانات. يوفر توازناً ممتازاً بين السعة والسرعة، ويتحمل تلف قرص واحد.",
    minDisks: 3,
    color: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5"
  },
  "10": {
    name: "RAID 10 (1+0)",
    desc: "دمج بين النسخ المتطابق والتوزيع (Mirroring + Striping). أداء عالٍ جداً وحماية فائقة، يتطلب 4 أقراص على الأقل وعدد أقراص زوجي.",
    minDisks: 4,
    color: "text-amber-400 border-amber-500/20 bg-amber-500/5"
  }
};

const RaidCalculator = memo(function RaidCalculator() {
  const [raidLevel, setRaidLevel] = useState("5");
  const [numDisks, setNumDisks] = useState(4);
  const [diskSize, setDiskSize] = useState(1000);
  const [diskUnit, setDiskUnit] = useState("GB");

  const [result, setResult] = useState({
    usableCapacity: 0,
    faultTolerance: 0,
    readSpeed: "",
    writeSpeed: "",
    efficiency: 0,
    isValid: true,
    errorMsg: ""
  });

  useEffect(() => {
    calculateRaid();
  }, [raidLevel, numDisks, diskSize, diskUnit]);

  const calculateRaid = () => {
    const level = raidLevel;
    const n = parseInt(numDisks, 10);
    const size = parseFloat(diskSize);
    const minD = raidDetails[level].minDisks;

    // Basic Validations
    if (isNaN(n) || isNaN(size) || n <= 0 || size <= 0) {
      setResult((prev) => ({ ...prev, isValid: false, errorMsg: "يرجى إدخال قيم صحيحة وموجبة للأقراص والمساحة." }));
      return;
    }

    if (n < minD) {
      setResult((prev) => ({
        ...prev,
        isValid: false,
        errorMsg: `يتطلب RAID ${level} عدد ${minD} أقراص على الأقل ليعمل بشكل صحيح.`
      }));
      return;
    }

    if (level === "10" && n % 2 !== 0) {
      setResult((prev) => ({
        ...prev,
        isValid: false,
        errorMsg: "يتطلب RAID 10 عدداً زوجياً من الأقراص (مثال: 4، 6، 8...)."
      }));
      return;
    }

    let usableCapacity = 0;
    let faultTolerance = 0;
    let readSpeed = "";
    let writeSpeed = "";
    let efficiency = 0;

    switch (level) {
      case "0":
        usableCapacity = n * size;
        faultTolerance = 0;
        readSpeed = `${n}x (فائق السرعة)`;
        writeSpeed = `${n}x (فائق السرعة)`;
        efficiency = 100;
        break;
      case "1":
        usableCapacity = size;
        faultTolerance = n - 1;
        readSpeed = `${n}x (سريع جداً)`;
        writeSpeed = "1x (عادي / بطيء)";
        efficiency = Math.round((1 / n) * 100);
        break;
      case "5":
        usableCapacity = (n - 1) * size;
        faultTolerance = 1;
        readSpeed = `${n - 1}x (سريع وممتاز)`;
        writeSpeed = "مقبول (مع بطء بسبب حسابات التماثل)";
        efficiency = Math.round(((n - 1) / n) * 100);
        break;
      case "10":
        usableCapacity = (n / 2) * size;
        faultTolerance = 1; // Guaranteed 1, can survive up to n/2 depending on which disks fail
        readSpeed = `${n}x (فائق السرعة)`;
        writeSpeed = `${n / 2}x (سريع جداً)`;
        efficiency = 50;
        break;
      default:
        break;
    }

    setResult({
      usableCapacity: Math.round(usableCapacity * 100) / 100,
      faultTolerance,
      readSpeed,
      writeSpeed,
      efficiency,
      isValid: true,
      errorMsg: ""
    });
  };

  const currentLevelInfo = raidDetails[raidLevel];

  return (
    <div className="bg-slate-900/60 border border-blue-500/20 rounded-xl p-5 shadow-lg backdrop-blur-md">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
        <HardDrive className="w-5 h-5 text-blue-400 animate-pulse" />
        <h3 className="font-bold text-lg text-slate-100">حاسبة السعات والأمان لمصفوفات التخزين (RAID Calculator)</h3>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {/* RAID Level */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-slate-400 font-semibold">نوع مصفوفة RAID:</label>
          <select
            value={raidLevel}
            onChange={(e) => setRaidLevel(e.target.value)}
            className="bg-slate-950 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="0">RAID 0 (لا حماية)</option>
            <option value="1">RAID 1 (مرآة كاملة)</option>
            <option value="5">RAID 5 (سرعة + حماية)</option>
            <option value="10">RAID 10 (سرعة + أمان فائق)</option>
          </select>
        </div>

        {/* Number of Disks */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-slate-400 font-semibold">عدد الأقراص (Number of Disks):</label>
          <input
            type="number"
            min="1"
            max="32"
            value={numDisks}
            onChange={(e) => setNumDisks(parseInt(e.target.value, 10))}
            className="bg-slate-950 border border-slate-700/60 rounded-lg px-3 py-2 text-sm font-mono text-blue-300 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Disk Size */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-slate-400 font-semibold">حجم القرص الواحد:</label>
          <input
            type="number"
            min="1"
            value={diskSize}
            onChange={(e) => setDiskSize(parseFloat(e.target.value))}
            className="bg-slate-950 border border-slate-700/60 rounded-lg px-3 py-2 text-sm font-mono text-blue-300 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Disk Size Unit */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-slate-400 font-semibold">وحدة القياس:</label>
          <select
            value={diskUnit}
            onChange={(e) => setDiskUnit(e.target.value)}
            className="bg-slate-950 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="GB">جيجابايت (GB)</option>
            <option value="TB">تيرابايت (TB)</option>
          </select>
        </div>
      </div>

      {/* Selected RAID Description Info Box */}
      <div className={`border rounded-xl p-3.5 mb-5 text-xs leading-relaxed flex items-start gap-2.5 ${currentLevelInfo.color}`}>
        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <div>
          <span className="font-extrabold block mb-1">{currentLevelInfo.name}</span>
          <p className="text-slate-300 font-medium">{currentLevelInfo.desc}</p>
        </div>
      </div>

      {/* Results or Validation Errors */}
      {!result.isValid ? (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-3.5 flex items-center gap-2.5 text-rose-400 text-xs">
          <AlertTriangle className="w-4.5 h-4.5 flex-shrink-0" />
          <span className="font-semibold">{result.errorMsg}</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-center">
            <div className="text-[10px] text-slate-400 font-bold mb-1">المساحة الفعلية المتاحة</div>
            <div className="font-mono text-sm text-emerald-400 font-bold">
              {result.usableCapacity.toLocaleString()} {diskUnit}
            </div>
            <span className="text-[9px] text-slate-500 font-bold block mt-1">كفاءة المساحة: {result.efficiency}%</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-center">
            <div className="text-[10px] text-slate-400 font-bold mb-1">نسبة الأمان (التحمل)</div>
            <div className="font-mono text-sm text-slate-200 font-bold flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{result.faultTolerance} قرص</span>
            </div>
            <span className="text-[9px] text-slate-500 font-bold block mt-1">أقصى عدد للأقراص التالفة</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-center">
            <div className="text-[10px] text-slate-400 font-bold mb-1">سرعة القراءة المتوقعة</div>
            <div className="font-mono text-xs text-cyan-400 font-bold leading-5">
              {result.readSpeed}
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-center">
            <div className="text-[10px] text-slate-400 font-bold mb-1">سرعة الكتابة المتوقعة</div>
            <div className="font-mono text-xs text-amber-400 font-bold leading-5">
              {result.writeSpeed}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default RaidCalculator;

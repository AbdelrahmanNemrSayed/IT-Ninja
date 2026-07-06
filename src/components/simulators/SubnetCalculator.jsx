import React, { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, ShieldAlert, Binary } from "lucide-react";

function ipToInt(ip) {
  const parts = ip.split(".").map(Number);
  return ((parts[0] << 24) >>> 0) | ((parts[1] << 16) >>> 0) | ((parts[2] << 8) >>> 0) | parts[3] >>> 0;
}

function intToIp(n) {
  return [
    (n >>> 24) & 255,
    (n >>> 16) & 255,
    (n >>> 8) & 255,
    n & 255,
  ].join(".");
}

function toBinary(n, bits = 32) {
  return (n >>> 0).toString(2).padStart(bits, "0");
}

function formatBinaryOctets(binStr) {
  return [0, 8, 16, 24].map(i => binStr.slice(i, i + 8));
}

const SubnetCalculator = memo(function SubnetCalculator() {
  const [ipAddress, setIpAddress] = useState("192.168.1.1");
  const [cidr, setCidr] = useState("24");
  const [result, setResult] = useState(null);
  const [isValid, setIsValid] = useState(true);

  const calculateSubnet = useCallback(() => {
    const ipRegex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const ipMatch = ipAddress.match(ipRegex);
    const cidrNum = parseInt(cidr, 10);

    if (!ipMatch || isNaN(cidrNum) || cidrNum < 0 || cidrNum > 32) {
      setIsValid(false);
      return;
    }
    const octets = ipMatch.slice(1, 5).map(Number);
    if (octets.some(o => o > 255)) { setIsValid(false); return; }

    setIsValid(true);

    const ipInt = ipToInt(ipAddress);
    const maskInt = cidrNum === 0 ? 0 : ((0xffffffff << (32 - cidrNum)) >>> 0);
    const netInt = (ipInt & maskInt) >>> 0;
    const wildCard = (~maskInt) >>> 0;
    const broadInt = (netInt | wildCard) >>> 0;

    let usableHosts = cidrNum >= 31 ? Math.pow(2, 32 - cidrNum) : Math.pow(2, 32 - cidrNum) - 2;

    const firstUsable = cidrNum < 31 ? intToIp(netInt + 1) : intToIp(netInt);
    const lastUsable = cidrNum < 31 ? intToIp(broadInt - 1) : intToIp(broadInt);

    setResult({
      networkId: intToIp(netInt),
      broadcastId: intToIp(broadInt),
      subnetMask: intToIp(maskInt),
      usableHosts,
      firstUsable,
      lastUsable,
      binaryIp: toBinary(ipInt),
      binaryMask: toBinary(maskInt),
      binaryNetwork: toBinary(netInt),
      binaryBroadcast: toBinary(broadInt),
      cidrNum,
    });
  }, [ipAddress, cidr]);

  useEffect(() => {
    calculateSubnet();
  }, [calculateSubnet]);

  const binaryRow = (label, binStr, highlight, color) => {
    const octets = formatBinaryOctets(binStr);
    return (
      <tr className="border-b border-slate-900">
        <td className="py-2 px-3 text-[10px] font-bold text-slate-400 whitespace-nowrap">{label}</td>
        {octets.map((oct, i) => (
          <td key={i} className="py-2 px-2">
            <div className="flex justify-center gap-px font-mono text-[10px]">
              {oct.split("").map((bit, bi) => {
                const globalIdx = i * 8 + bi;
                const isNet = globalIdx < result.cidrNum;
                return (
                  <span
                    key={bi}
                    className={`${
                      isNet
                        ? `${color} font-extrabold`
                        : "text-slate-500"
                    }`}
                  >
                    {bit}
                  </span>
                );
              })}
            </div>
          </td>
        ))}
      </tr>
    );
  };

  return (
    <div className="bg-slate-900/60 border border-cyan-500/20 rounded-xl p-5 shadow-lg backdrop-blur-md">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
        <Network className="w-5 h-5 text-cyan-400 animate-pulse" />
        <h3 className="font-bold text-lg text-slate-100">حاسبة الشبكات الفرعية البصرية (IPv4 Visual Subnet Calculator)</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-slate-400 font-semibold">عنوان الـ IP Address:</label>
          <input
            type="text"
            className="bg-slate-950 border border-slate-700/60 rounded-lg px-3 py-2 text-sm font-mono text-cyan-300 focus:outline-none focus:border-cyan-500 transition-colors"
            placeholder="e.g. 192.168.1.1"
            value={ipAddress}
            onChange={e => setIpAddress(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-slate-400 font-semibold">البادئة CIDR Prefix (مثال: /24):</label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-slate-500 font-mono text-sm">/</span>
            <input
              type="number"
              min="0"
              max="32"
              className="w-full bg-slate-950 border border-slate-700/60 rounded-lg pl-3 pr-6 py-2 text-sm font-mono text-cyan-300 focus:outline-none focus:border-cyan-500 transition-colors"
              placeholder="24"
              value={cidr}
              onChange={e => setCidr(e.target.value)}
            />
          </div>
        </div>
      </div>

      {!isValid ? (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-3 flex items-center gap-2 text-rose-400 text-xs">
          <ShieldAlert className="w-4 h-4 flex-shrink-0" />
          <span>الرجاء إدخال عنوان IP صحيح (مثل 192.168.1.1) وبادئة CIDR بين 0 و 32.</span>
        </div>
      ) : result && (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${result.networkId}-${result.cidrNum}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-4"
          >
            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: "Network ID", value: result.networkId, color: "text-emerald-400" },
                { label: "Broadcast IP", value: result.broadcastId, color: "text-amber-400" },
                { label: "Subnet Mask", value: result.subnetMask, color: "text-slate-300" },
                { label: "First Usable", value: result.firstUsable, color: "text-cyan-300" },
                { label: "Last Usable", value: result.lastUsable, color: "text-cyan-300" },
                { label: "Usable Hosts", value: result.usableHosts.toLocaleString(), color: "text-purple-400" },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-center">
                  <div className="text-[10px] text-slate-400 font-bold mb-1">{label}</div>
                  <div className={`font-mono text-sm font-bold ${color}`}>{value}</div>
                </div>
              ))}
            </div>

            {/* Binary Visual Table */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
              <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center gap-2">
                <Binary className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[11px] font-bold text-slate-300">
                  التمثيل الثنائي — الأجزاء الملونة تمثل قسم الشبكة (Network Part /{result.cidrNum})
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px]">
                  <thead>
                    <tr className="border-b border-slate-900">
                      <th className="py-2 px-3 text-[10px] font-bold text-slate-500 text-right w-28">العنوان</th>
                      {["Octet 1", "Octet 2", "Octet 3", "Octet 4"].map(o => (
                        <th key={o} className="py-2 px-2 text-[10px] font-bold text-slate-500 text-center">{o}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {binaryRow("IP Address", result.binaryIp, result.cidrNum, "text-cyan-400")}
                    {binaryRow("Subnet Mask", result.binaryMask, result.cidrNum, "text-emerald-400")}
                    {binaryRow("Network ID", result.binaryNetwork, result.cidrNum, "text-emerald-400")}
                    {binaryRow("Broadcast", result.binaryBroadcast, result.cidrNum, "text-amber-400")}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-2 border-t border-slate-900 flex gap-4 flex-wrap">
                <div className="flex items-center gap-1.5 text-[9px] text-cyan-400 font-bold">
                  <span className="bg-cyan-400/20 px-1 rounded font-mono">1</span> Network Part (/{result.cidrNum} bits)
                </div>
                <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-bold">
                  <span className="bg-slate-700 px-1 rounded font-mono">0</span> Host Part ({32 - result.cidrNum} bits)
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
});

export default SubnetCalculator;

import React, { useState, useEffect, memo } from "react";
import { Network, HelpCircle, ShieldAlert } from "lucide-react";

const SubnetCalculator = memo(function SubnetCalculator() {
  const [ipAddress, setIpAddress] = useState("192.168.1.1");
  const [cidr, setCidr] = useState("24");
  const [result, setResult] = useState({
    networkId: "192.168.1.0",
    broadcastId: "192.168.1.255",
    subnetMask: "255.255.255.0",
    usableHosts: 254,
    isValid: true,
  });

  useEffect(() => {
    calculateSubnet();
  }, [ipAddress, cidr]);

  const calculateSubnet = () => {
    // Basic IP validation regex
    const ipRegex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const ipMatch = ipAddress.match(ipRegex);
    const cidrNum = parseInt(cidr, 10);

    if (!ipMatch || isNaN(cidrNum) || cidrNum < 0 || cidrNum > 32) {
      setResult((prev) => ({ ...prev, isValid: false }));
      return;
    }

    const octets = ipMatch.slice(1, 5).map(Number);
    if (octets.some((o) => o > 255)) {
      setResult((prev) => ({ ...prev, isValid: false }));
      return;
    }

    // Convert IP to 32-bit integer
    const ipInt = (octets[0] << 24) >>> 0 | (octets[1] << 16) >>> 0 | (octets[2] << 8) >>> 0 | octets[3] >>> 0;

    // Calculate mask
    let maskInt = 0;
    if (cidrNum > 0) {
      maskInt = (0xffffffff << (32 - cidrNum)) >>> 0;
    }

    // Network ID
    const netInt = (ipInt & maskInt) >>> 0;
    const networkId = [
      (netInt >>> 24) & 255,
      (netInt >>> 16) & 255,
      (netInt >>> 8) & 255,
      netInt & 255
    ].join(".");

    // Subnet Mask
    const subnetMask = [
      (maskInt >>> 24) & 255,
      (maskInt >>> 16) & 255,
      (maskInt >>> 8) & 255,
      maskInt & 255
    ].join(".");

    // Broadcast ID
    const wildCard = ~maskInt;
    const broadInt = (netInt | wildCard) >>> 0;
    const broadcastId = [
      (broadInt >>> 24) & 255,
      (broadInt >>> 16) & 255,
      (broadInt >>> 8) & 255,
      broadInt & 255
    ].join(".");

    // Usable Hosts
    let usableHosts = 0;
    if (cidrNum === 32) {
      usableHosts = 1;
    } else if (cidrNum === 31) {
      usableHosts = 2;
    } else {
      usableHosts = Math.pow(2, 32 - cidrNum) - 2;
    }

    setResult({
      networkId,
      broadcastId,
      subnetMask,
      usableHosts,
      isValid: true,
    });
  };

  return (
    <div className="bg-slate-900/60 border border-cyan-500/20 rounded-xl p-5 shadow-lg backdrop-blur-md">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
        <Network className="w-5 h-5 text-cyan-400 animate-pulse" />
        <h3 className="font-bold text-lg text-slate-100">حاسبة الشبكات الفرعية البصرية (IPv4 Subnet Calculator)</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-slate-400 font-semibold">عنوان الـ IP Address:</label>
          <input
            type="text"
            className="bg-slate-950 border border-slate-700/60 rounded-lg px-3 py-2 text-sm font-mono text-cyan-300 focus:outline-none focus:border-cyan-500 transition-colors"
            placeholder="e.g. 192.168.1.1"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
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
              onChange={(e) => setCidr(e.target.value)}
            />
          </div>
        </div>
      </div>

      {!result.isValid ? (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-3 flex items-center gap-2 text-rose-400 text-xs">
          <ShieldAlert className="w-4 h-4 flex-shrink-0" />
          <span>الرجاء إدخال عنوان IP صحيح (مثل 192.168.1.1) وبادئة CIDR بين 0 و 32.</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-center">
            <div className="text-[10px] text-slate-400 font-bold mb-1">Network ID</div>
            <div className="font-mono text-sm text-emerald-400 font-bold">{result.networkId}</div>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-center">
            <div className="text-[10px] text-slate-400 font-bold mb-1">Subnet Mask</div>
            <div className="font-mono text-sm text-slate-300">{result.subnetMask}</div>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-center">
            <div className="text-[10px] text-slate-400 font-bold mb-1">Broadcast ID</div>
            <div className="font-mono text-sm text-amber-400 font-bold">{result.broadcastId}</div>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-center">
            <div className="text-[10px] text-slate-400 font-bold mb-1">Usable Hosts</div>
            <div className="font-mono text-sm text-cyan-400 font-bold">
              {result.usableHosts.toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default SubnetCalculator;

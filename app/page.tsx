"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [ip, setIp] = useState("");
  const [connected, setConnected] = useState(false);
  const [isNear, setIsNear] = useState(false);
  const [override, setOverride] = useState(false);

  useEffect(() => {
    if (!connected || override) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`http://${ip}/distance`);
        const data = await res.json();

        setIsNear(data.distance < 20);
      } catch (err) {
        console.log("Sensor offline");
      }
    }, 500);

    return () => clearInterval(interval);
  }, [connected, ip, override]);

  const handleConnect = () => {
    if (ip.trim().length < 7) {
      alert("Enter a valid IP address");
      return;
    }
    setConnected(true);
  };

  // ⛔ Input Page UI
  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex flex-col items-center justify-center p-5 text-white">
        <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-8 shadow-xl w-[350px]">
          <h1 className="text-2xl font-bold text-center mb-6 tracking-wide">
            Parking Slot Detection
          </h1>

          <label className="text-sm mb-2 block font-medium">
            Enter Device IP Address
          </label>

          <input
            type="text"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="Example: 192.168.1.50"
            className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-600 focus:ring-2 
            focus:ring-blue-500 outline-none text-white"
          />

          <button
            onClick={handleConnect}
            className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-md 
            text-white font-semibold transition"
          >
            Connect
          </button>
        </div>
      </div>
    );
  }

  // ✅ Connected Page (Gray background + original IMG UI)
  return (
    <div className="relative min-h-screen bg-gray-50 text-black">
      {/* Centered Image */}
      <div className="flex flex-row items-center justify-center h-screen">
        {isNear ? (
          <img src="/IMG4.png" alt="img2" className="h-70 scale-200" />
        ) : (
          <img src="/IMG3.png" alt="img1" className="h-70 scale-200" />
        )}
      </div>

      {/* Top-left Buttons */}
      <button
        onClick={() => setOverride(!override)}
        className="absolute top-5 left-5 px-4 py-2 bg-black text-white rounded-md z-[200]"
      >
        {override ? "Disable Manual" : "Enable Manual"}
      </button>

      {override && (
        <button
          onClick={() => setIsNear(!isNear)}
          className="absolute top-16 left-5 px-4 py-2 bg-blue-600 text-white rounded-md z-[200]"
        >
          Toggle Image
        </button>
      )}

      <button
        onClick={() => setConnected(false)}
        className="absolute top-28 left-5 px-4 py-2 bg-red-600 text-white rounded-md z-[200]"
      >
        Disconnect
      </button>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import {
  MdPowerSettingsNew,
  MdToggleOn,
  MdToggleOff,
  MdClose,
} from "react-icons/md";

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

  // PAGE 1 — INPUT SCREEN
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
            className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-600 
            focus:ring-2 focus:ring-blue-500 outline-none text-white"
          />

          <button
            onClick={handleConnect}
            className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition"
          >
            Connect
          </button>
        </div>
      </div>
    );
  }

  // PAGE 2 — CONNECTED SENSOR SCREEN
  return (
    <div
      className="relative min-h-screen text-white"
      style={{ backgroundColor: "#5F5F5F" }}
    >
      {/* Center Image */}
      <div className="flex flex-row items-center justify-center h-screen">
        {isNear ? (
          <img src="/IMG4.png" alt="img2" className="h-70 scale-200" />
        ) : (
          <img src="/IMG3.png" alt="img1" className="h-70 scale-200" />
        )}
      </div>

      {/* CIRCULAR FLOATING BUTTONS */}
      <div className="absolute top-5 left-5 flex flex-col gap-4 z-[200]">
        {/* Manual Mode Button */}
        <button
          onClick={() => setOverride(!override)}
          className="w-12 h-12 rounded-full bg-black/80 flex items-center justify-center 
          shadow-lg hover:scale-110 active:scale-95 transition"
        >
          <MdPowerSettingsNew size={26} />
        </button>

        {/* Toggle Button (ONLY in manual mode) */}
        {override && (
          <button
            onClick={() => setIsNear(!isNear)}
            className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center 
            shadow-lg hover:scale-110 active:scale-95 transition"
          >
            {isNear ? <MdToggleOn size={30} /> : <MdToggleOff size={30} />}
          </button>
        )}

        {/* Disconnect */}
        <button
          onClick={() => setConnected(false)}
          className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center 
          shadow-lg hover:scale-110 active:scale-95 transition"
        >
          <MdClose size={28} />
        </button>
      </div>
    </div>
  );
}

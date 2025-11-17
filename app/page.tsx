"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [isNear, setIsNear] = useState(false); // true → distance < 20
  const [override, setOverride] = useState(false); // manual mode on/off

  useEffect(() => {
    if (override) return; // manual mode disables sensor updates

    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://10.21.1.16/distance");
        const data = await res.json();

        // distance < 20 → show img2.png
        if (data.distance < 20) {
          setIsNear(true);
        } else {
          setIsNear(false);
        }
      } catch (error) {
        console.log("Sensor offline → using previous value");
      }
    }, 500);

    return () => clearInterval(interval);
  }, [override]);

  return (
    <>
      <div className="">
        <div className="flex flex-row items-center justify-center h-screen">
          {/* Image Swap */}
          {isNear ? (
            <img src="/IMG4.png" alt="img2" className="h-70 scale-200" />
          ) : (
            <img src="/IMG3.png" alt="img1" className="h-70 scale-200" />
          )}
        </div>
      </div>

      {/* Button Mode Toggle */}
      <button
        onClick={() => setOverride(!override)}
        className="absolute top-5 left-5 px-4 py-2 bg-black text-white rounded-md z-[200]"
      >
        {override ? "Disable Manual" : "Enable Manual"}
      </button>

      {/* Manual Toggle Button */}
      {override && (
        <button
          onClick={() => setIsNear(!isNear)}
          className="absolute top-16 left-5 px-4 py-2 bg-blue-600 text-white rounded-md z-[200]"
        >
          Toggle Image
        </button>
      )}
    </>
  );
}

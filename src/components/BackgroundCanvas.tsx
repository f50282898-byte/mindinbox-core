"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function BackgroundCanvas() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-obsidian-gradient">
      {/* Whispers of intelligence: Faint glowing neural cyan pulse */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full blur-[150px] opacity-[0.07] bg-cyan-glowing"
        animate={{
          x: mousePosition.x - 400,
          y: mousePosition.y - 400,
        }}
        transition={{ type: "tween", ease: "easeOut", duration: 3 }}
      />
      
      {/* Subtle sacred geometry / Architectural lines */}
      <motion.div 
        className="absolute inset-0 opacity-[0.15]"
        animate={{
          x: mousePosition.x * 0.02,
          y: mousePosition.y * 0.02,
        }}
        transition={{ type: "tween", ease: "easeOut", duration: 2 }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="sacred-grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#D4AF37" strokeWidth="0.5" strokeOpacity="0.3" />
              <circle cx="50" cy="50" r="1" fill="#D4AF37" opacity="0.5" />
              <path d="M 0 0 L 100 100 M 100 0 L 0 100" fill="none" stroke="#D4AF37" strokeWidth="0.2" strokeOpacity="0.15" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sacred-grid)" />
        </svg>
      </motion.div>
    </div>
  );
}


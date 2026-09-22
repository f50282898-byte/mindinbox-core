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
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-10 bg-cyan-glowing"
        animate={{
          x: mousePosition.x - 300,
          y: mousePosition.y - 300,
        }}
        transition={{ type: "tween", ease: "easeOut", duration: 2 }}
      />
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "radial-gradient(circle at 2px 2px, #D4AF37 1px, transparent 0)",
        backgroundSize: "40px 40px"
      }} />
    </div>
  );
}


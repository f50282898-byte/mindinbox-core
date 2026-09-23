"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import { useUserStore } from "@/lib/store/useUserStore";

interface MasterclassPlayerProps {
  videoUrl: string; // Internal mp4 or optimized stream URL
  title: string;
}

export default function MasterclassPlayer({ videoUrl, title }: MasterclassPlayerProps) {
  const { userDoc } = useUserStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);

  let controlsTimeout: NodeJS.Timeout;

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTo = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = (videoRef.current.duration / 100) * seekTo;
      setProgress(seekTo);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeout);
    controlsTimeout = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
    return () => clearTimeout(controlsTimeout);
  }, []);

  return (
    <div 
      className="relative w-full aspect-video bg-black rounded-sm overflow-hidden group select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onContextMenu={(e) => e.preventDefault()} // Disable Right Click
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-cover"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        controlsList="nodownload noplaybackrate" // Basic built-in protection
        disablePictureInPicture
      />

      {/* Security Watermark (Anti-Screen Recording) */}
      <div className="absolute inset-0 pointer-events-none flex flex-wrap gap-20 opacity-5 mix-blend-overlay justify-center items-center overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <span key={i} className="text-white font-mono text-xs rotate-[-30deg]">
            {userDoc?.email || 'MIND_IN_A_BOX_ELITE'}
          </span>
        ))}
      </div>

      {/* Dynamic Overlay & Controls */}
      <motion.div 
        animate={{ opacity: showControls || !isPlaying ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian/40 flex flex-col justify-between p-6"
      >
        {/* Header */}
        <div>
          <h2 className="text-gold-light font-amiri text-2xl drop-shadow-md">{title}</h2>
        </div>

        {/* Custom Center Play Button */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <button 
              onClick={handlePlayPause}
              className="pointer-events-auto w-20 h-20 bg-gold/10 backdrop-blur-sm border border-gold/40 rounded-full flex items-center justify-center hover:bg-gold/20 hover:scale-105 transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)]"
            >
              <Play className="w-8 h-8 text-gold-light ml-2" />
            </button>
          </div>
        )}

        {/* Bottom Controls */}
        <div className="flex flex-col gap-4">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="w-full h-1 bg-white/20 appearance-none cursor-pointer rounded-full accent-gold hover:h-2 transition-all"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button onClick={handlePlayPause} className="text-gold hover:text-gold-light transition-colors">
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <button onClick={toggleMute} className="text-gold hover:text-gold-light transition-colors">
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
            </div>
            
            <button onClick={handleFullscreen} className="text-gold hover:text-gold-light transition-colors">
              <Maximize size={24} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


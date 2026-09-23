"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseTTSReturn {
  play: (text: string) => void;
  pause: () => void;
  stop: () => void;
  isPlaying: boolean;
  isSupported: boolean;
}

export function useTTS(): UseTTSReturn {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
      setIsSupported(true);

      const loadVoices = () => {
        const voices = synthRef.current?.getVoices() || [];
        if (voices.length > 0) {
          // Strictly filter for premium Arabic voices
          const arabicVoices = voices.filter((v) => v.lang.startsWith("ar"));
          // Prefer Saudi or Emirati voices for high quality, fallback to any Arabic
          const premiumVoice = arabicVoices.find((v) => v.lang === "ar-SA" || v.lang === "ar-AE") || arabicVoices[0];
          voiceRef.current = premiumVoice || null;
        }
      };

      // Voices load asynchronously in some browsers
      loadVoices();
      if (synthRef.current.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = loadVoices;
      }
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const play = useCallback((text: string) => {
    if (!synthRef.current || !isSupported) return;

    // If currently paused, just resume
    if (synthRef.current.paused) {
      synthRef.current.resume();
      setIsPlaying(true);
      return;
    }

    // Cancel any ongoing speech before starting a new one
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (voiceRef.current) {
      utterance.voice = voiceRef.current;
    }
    
    utterance.lang = voiceRef.current?.lang || "ar-SA";
    utterance.rate = 0.85; // Slower for philosophical contemplation
    utterance.pitch = 0.9; // Deeper pitch for stoic feel

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = (e) => {
      console.error("TTS Error:", e);
      setIsPlaying(false);
    };

    synthRef.current.speak(utterance);
    setIsPlaying(true);
  }, [isSupported]);

  const pause = useCallback(() => {
    if (synthRef.current && isSupported) {
      synthRef.current.pause();
      setIsPlaying(false);
    }
  }, [isSupported]);

  const stop = useCallback(() => {
    if (synthRef.current && isSupported) {
      synthRef.current.cancel();
      setIsPlaying(false);
    }
  }, [isSupported]);

  return { play, pause, stop, isPlaying, isSupported };
}


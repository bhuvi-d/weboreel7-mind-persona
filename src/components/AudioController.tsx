'use client';

import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Radio } from 'lucide-react';
import { audio } from '@/lib/audio';
import { motion, AnimatePresence } from 'framer-motion';

export default function AudioController() {
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (audio) {
      audio.setMute(isMuted);
    }
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isMuted && audio) {
      audio.playPulse(); // Feedback on unmute
    }
  };

  return (
    <motion.button
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 1 }}
      onClick={toggleMute}
      className="fixed bottom-8 right-8 z-50 p-4 glass-card hover:bg-white/10 transition-all duration-500 group flex items-center gap-3 overflow-hidden"
      aria-label={isMuted ? "Unmute" : "Mute"}
    >
      <div className="relative">
        <AnimatePresence mode="wait">
          {isMuted ? (
            <motion.div key="muted" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
              <VolumeX className="w-5 h-5 text-white/40" />
            </motion.div>
          ) : (
            <motion.div key="unmuted" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
              <div className="relative">
                <Volume2 className="w-5 h-5 text-primary" />
                <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute inset-0 bg-primary/30 rounded-full"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="flex flex-col items-start pr-2">
        <span className="text-[10px] font-black tracking-widest text-white/60 uppercase leading-none">Audio</span>
        <span className="text-[8px] font-black tracking-widest text-white/20 uppercase leading-none mt-1">
          {isMuted ? 'Offline' : 'Neural Link Active'}
        </span>
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    </motion.button>
  );
}

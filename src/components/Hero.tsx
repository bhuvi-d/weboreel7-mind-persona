'use client';

import { motion } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';

export default function Hero({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Background Visuals */}
      <motion.div 
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.6 }}
        transition={{ duration: 3, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,242,255,0.15)_0%,transparent_70%)] animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </motion.div>

      {/* Scanning Line Effect */}
      <div className="scanning-line" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-[1px] w-12 bg-primary/50" />
            <span className="text-xs font-black tracking-[0.5em] text-primary uppercase">Neural Identity Protocol</span>
            <div className="h-[1px] w-12 bg-primary/50" />
          </div>
          
          <h1 className="text-7xl md:text-9xl font-black mb-6 tracking-tighter leading-none italic">
            MIND<span className="text-gradient neo-glow">PERSONA</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/50 mb-12 font-light max-w-2xl leading-relaxed">
            Four cognitive trials. One neural signature. <br />
            <span className="text-white/80 font-medium">Unlock your hidden operational archetype.</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex flex-col items-center gap-6"
        >
          <button 
            onClick={onStart}
            className="btn-primary group"
          >
            <span className="flex items-center gap-3">
              Initiate Sequence <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </span>
          </button>
          
          <div className="flex items-center gap-8 text-[10px] font-black tracking-[0.3em] text-white/20 uppercase">
            <span>Memory</span>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <span>Logic</span>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <span>Speed</span>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <span>Instinct</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <div className="w-[1px] h-16 bg-gradient-to-b from-primary/50 to-transparent" />
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="w-5 h-5 text-primary/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}

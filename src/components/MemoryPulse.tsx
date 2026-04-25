'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audio } from '@/lib/audio';
import { cn } from '@/lib/utils';
import { ChevronDown, CheckCircle2, BrainCircuit } from 'lucide-react';

interface MemoryPulseProps {
  onComplete: (score: number) => void;
}

const COLORS = [
  { id: 0, color: 'bg-primary', shadow: 'shadow-[0_0_50px_rgba(0,242,255,0.6)]', glow: 'bg-primary/20' },
  { id: 1, color: 'bg-accent', shadow: 'shadow-[0_0_50px_rgba(255,0,122,0.6)]', glow: 'bg-accent/20' },
  { id: 2, color: 'bg-secondary', shadow: 'shadow-[0_0_50px_rgba(112,0,255,0.6)]', glow: 'bg-secondary/20' },
  { id: 3, color: 'bg-yellow-400', shadow: 'shadow-[0_0_50px_rgba(250,204,21,0.6)]', glow: 'bg-yellow-400/20' },
];

export default function MemoryPulse({ onComplete }: MemoryPulseProps) {
  const [gameState, setGameState] = useState<'idle' | 'countdown' | 'showing' | 'playing' | 'finished'>('idle');
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [round, setRound] = useState(1);
  const [countdown, setCountdown] = useState(3);

  const showSequence = useCallback(async (seq: number[]) => {
    setGameState('showing');
    await new Promise(r => setTimeout(r, 800));
    
    for (const id of seq) {
      setActiveButton(id);
      audio?.playPulse();
      await new Promise(r => setTimeout(r, 600));
      setActiveButton(null);
      await new Promise(r => setTimeout(r, 200));
    }
    setGameState('playing');
  }, []);

  const startNextRound = useCallback(() => {
    const nextSeq = [...sequence, Math.floor(Math.random() * 4)];
    setSequence(nextSeq);
    setUserSequence([]);
    showSequence(nextSeq);
  }, [sequence, showSequence]);

  const handleBegin = () => {
    setGameState('countdown');
    let count = 3;
    const timer = setInterval(() => {
      count--;
      setCountdown(count);
      if (count === 0) {
        clearInterval(timer);
        startNextRound();
      }
    }, 800);
  };

  const handleButtonClick = (id: number) => {
    if (gameState !== 'playing') return;
    
    setActiveButton(id);
    audio?.playPulse();
    setTimeout(() => setActiveButton(null), 200);

    const nextUserSeq = [...userSequence, id];
    setUserSequence(nextUserSeq);

    if (nextUserSeq[nextUserSeq.length - 1] !== sequence[nextUserSeq.length - 1]) {
      audio?.playError();
      setGameState('finished');
      onComplete(Math.max(0, (round - 1) * 30)); 
      return;
    }

    if (nextUserSeq.length === sequence.length) {
      if (round >= 3) {
        setGameState('finished');
        audio?.playSuccess();
        onComplete(100);
      } else {
        setRound(r => r + 1);
        setTimeout(startNextRound, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-xl mx-auto py-12 relative">
      <AnimatePresence mode="wait">
        {gameState === 'idle' && (
          <motion.div 
            key="idle" 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 1.1 }} 
            className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-background/95 backdrop-blur-2xl rounded-[3rem] p-12 border border-white/10 shadow-2xl"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 border border-primary/20">
              <BrainCircuit className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xs font-black tracking-[0.5em] text-primary mb-4">COGNITIVE TRIAL 01</h3>
            <h2 className="text-5xl font-black mb-6 text-center leading-tight">MEMORY<br/>PULSE</h2>
            <p className="text-white/40 text-center mb-12 max-w-xs text-sm leading-relaxed"> Replicate the neural sequence to stabilize your cognitive core. Precision is mandatory.</p>
            <button onClick={handleBegin} className="btn-primary w-full max-w-[240px]">BEGIN TRIAL</button>
          </motion.div>
        )}

        {gameState === 'countdown' && (
          <motion.div key="countdown" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 2, opacity: 0 }} className="absolute inset-0 z-30 flex items-center justify-center">
            <span className="text-[12rem] font-black text-primary neo-glow italic">{countdown}</span>
          </motion.div>
        )}

        {gameState === 'finished' && (
          <motion.div key="finished" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-background/95 backdrop-blur-2xl rounded-[3rem] p-12 border border-primary/20">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-8 border border-primary/40 shadow-[0_0_40px_rgba(0,242,255,0.2)]">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-4xl font-black mb-4 text-primary italic">TRIAL COMPLETE</h2>
            <p className="text-white/50 mb-16 font-medium">Neural patterns synchronized.</p>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="flex flex-col items-center gap-4">
              <span className="text-[10px] font-black tracking-[0.4em] text-primary/40 uppercase">Scroll for Next Protocol</span>
              <ChevronDown className="w-6 h-6 text-primary/40" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center mb-16 w-full">
        <div className="h-12 mb-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {gameState === 'showing' && (
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-primary font-black tracking-[0.3em] text-xs uppercase animate-pulse">
                [ SCANNING NEURAL PATTERN ]
              </motion.p>
            )}
            {gameState === 'playing' && (
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-accent font-black tracking-[0.3em] text-xs uppercase underline decoration-2 underline-offset-8">
                [ YOUR TURN: INPUT PATTERN ]
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex gap-4 justify-center">
          {[1, 2, 3].map(i => (
            <div key={i} className="relative group">
              <div className={cn("w-12 h-1 rounded-full transition-all duration-700", round >= i ? "bg-primary shadow-[0_0_20px_rgba(0,242,255,0.6)]" : "bg-white/10")} />
              {round === i && gameState !== 'finished' && <motion.div layoutId="activeRound" className="absolute -inset-2 rounded-full border border-primary/30" />}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 w-full aspect-square p-10 glass-card relative group overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        {COLORS.map((btn) => (
          <motion.button
            key={btn.id}
            whileTap={gameState === 'playing' ? { scale: 0.92 } : {}}
            onClick={() => handleButtonClick(btn.id)}
            disabled={gameState !== 'playing'}
            className={cn(
              "w-full h-full rounded-[2.5rem] transition-all duration-500 border border-white/5 relative overflow-hidden flex items-center justify-center",
              btn.color,
              activeButton === btn.id 
                ? cn("opacity-100 scale-[1.03] z-10", btn.shadow, "border-white/20") 
                : "opacity-10 grayscale-[0.8] hover:opacity-20"
            )}
          >
             {activeButton === btn.id && (
               <motion.div 
                 initial={{ scale: 0.5, opacity: 0 }}
                 animate={{ scale: 2.5, opacity: 0 }}
                 transition={{ duration: 0.6 }}
                 className="absolute inset-0 bg-white/40 rounded-full"
               />
             )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

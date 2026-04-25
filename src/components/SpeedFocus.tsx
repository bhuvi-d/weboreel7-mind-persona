'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audio } from '@/lib/audio';
import { cn } from '@/lib/utils';
import { ChevronDown, CheckCircle2, Zap, Target as TargetIcon } from 'lucide-react';

interface SpeedFocusProps {
  onComplete: (score: number) => void;
}

interface Target {
  id: number;
  x: number;
  y: number;
  isDecoy: boolean;
  size: number;
}

export default function SpeedFocus({ onComplete }: SpeedFocusProps) {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [targets, setTargets] = useState<Target[]>([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const nextId = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const spawnTarget = useCallback(() => {
    if (!containerRef.current || gameState !== 'playing') return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    const size = Math.random() * 40 + 60;
    const padding = 80;
    
    const newTarget: Target = {
      id: nextId.current++,
      x: Math.random() * (width - padding * 2) + padding,
      y: Math.random() * (height - padding * 2) + padding,
      isDecoy: Math.random() > 0.85,
      size: size
    };

    setTargets(prev => [...prev, newTarget]);
    setTimeout(() => {
      setTargets(prev => prev.filter(t => t.id !== newTarget.id));
    }, 1100);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const spawnInterval = setInterval(spawnTarget, 550);
    const timerInterval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(timerInterval);
    };
  }, [gameState, spawnTarget]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft === 0) {
      setGameState('finished');
      onComplete(score);
    }
  }, [gameState, timeLeft, score, onComplete]);

  const handleTargetClick = (target: Target) => {
    if (gameState !== 'playing') return;

    if (target.isDecoy) {
      audio?.playError();
      setScore(s => Math.max(0, s - 15));
      setCombo(0);
    } else {
      audio?.playPulse();
      setCombo(c => c + 1);
      setScore(s => s + 5 + Math.floor(combo / 5) * 2);
    }
    setTargets(prev => prev.filter(t => t.id !== target.id));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-3xl mx-auto py-12 relative">
      <AnimatePresence mode="wait">
        {gameState === 'idle' && (
          <motion.div 
            key="idle" 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 1.05 }} 
            className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-background/95 backdrop-blur-2xl rounded-[3rem] p-12 border border-white/10 shadow-2xl"
          >
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-8 border border-accent/20 shadow-[0_0_20px_rgba(255,0,122,0.1)]">
              <TargetIcon className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xs font-black tracking-[0.5em] text-accent mb-4">COGNITIVE TRIAL 03</h3>
            <h2 className="text-5xl font-black mb-6 text-center leading-tight italic">SPEED<br/>FOCUS</h2>
            <p className="text-white/40 text-center mb-12 max-w-xs text-sm leading-relaxed">Calibrate your neural reflexes. Target the primary nodes and avoid systemic noise.</p>
            <button 
              onClick={() => setGameState('playing')} 
              className="btn-primary border-accent bg-accent/20 text-accent hover:bg-accent hover:text-white shadow-[0_0_40px_rgba(255,0,122,0.3)] hover:shadow-[0_0_60px_rgba(255,0,122,0.5)] w-full max-w-[240px]"
            >
              START CALIBRATION
            </button>
          </motion.div>
        )}

        {gameState === 'finished' && (
          <motion.div key="finished" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-background/95 backdrop-blur-2xl rounded-[3rem] p-12 border border-accent/20 shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mb-8 border border-accent/40 shadow-[0_0_40px_rgba(255,0,122,0.2)]">
              <Zap className="w-10 h-10 text-accent" />
            </div>
            <h2 className="text-4xl font-black mb-4 text-accent italic">CALIBRATION DONE</h2>
            <p className="text-white/50 mb-16 font-medium text-center">Neural response time optimized.</p>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="flex flex-col items-center gap-4">
              <span className="text-[10px] font-black tracking-[0.4em] text-accent/40 uppercase">Awaiting Final Protocol</span>
              <ChevronDown className="w-6 h-6 text-accent/40" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-20 mb-12 w-full justify-center items-end">
        <div className="text-center relative">
           <AnimatePresence>
            {combo > 2 && (
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: -20 }}
                exit={{ opacity: 0 }}
                className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-black text-primary tracking-widest whitespace-nowrap"
              >
                COMBO x{combo}
              </motion.span>
            )}
          </AnimatePresence>
          <p className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase mb-3">Time Remaining</p>
          <p className={cn("text-6xl font-black italic", timeLeft < 5 ? "text-accent animate-pulse" : "text-white")}>{timeLeft}S</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase mb-3">Reflex Score</p>
          <p className="text-6xl font-black text-primary italic neo-glow">{score}</p>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="relative w-full h-[550px] glass-card border-white/5 overflow-hidden cursor-crosshair group shadow-inner"
      >
        <div className="absolute inset-0 bg-primary/2 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="scanning-line opacity-20" />
        
        <AnimatePresence>
          {targets.map((target) => (
            <motion.button
              key={target.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => handleTargetClick(target)}
              className={cn(
                "absolute rounded-[1.5rem] transition-all duration-300 border-2 flex items-center justify-center overflow-hidden group/target",
                target.isDecoy 
                  ? "bg-accent/10 border-accent/40 shadow-[0_0_30px_rgba(255,0,122,0.3)] hover:bg-accent/20" 
                  : "bg-primary/10 border-primary/40 shadow-[0_0_30px_rgba(0,242,255,0.3)] hover:bg-primary/20"
              )}
              style={{ left: target.x, top: target.y, width: target.size, height: target.size, transform: 'translate(-50%, -50%)' }}
            >
               <div className={cn(
                 "w-2 h-2 rounded-full animate-ping",
                 target.isDecoy ? "bg-accent" : "bg-primary"
               )} />
               {/* Inner Glow */}
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]" />
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

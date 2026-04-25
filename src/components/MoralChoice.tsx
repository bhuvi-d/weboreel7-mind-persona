'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audio } from '@/lib/audio';
import { cn } from '@/lib/utils';
import { ChevronDown, Fingerprint, Activity } from 'lucide-react';

interface MoralChoiceProps {
  onComplete: (choices: string[]) => void;
}

const DILEMMAS = [
  {
    id: 1,
    question: "A high-stakes mission is failing. Do you...",
    options: [
      { text: "Take the risk yourself", value: "risk", tag: "PROACTIVE" },
      { text: "Recalculate and wait", value: "patience", tag: "ANALYTICAL" }
    ]
  },
  {
    id: 2,
    question: "You have limited energy resources. Do you...",
    options: [
      { text: "Fuel the lead explorer", value: "focus", tag: "STRATEGIC" },
      { text: "Distribute to the group", value: "social", tag: "EMPATHETIC" }
    ]
  },
  {
    id: 3,
    question: "An unknown signal appears. Do you...",
    options: [
      { text: "Analyze from a distance", value: "logic", tag: "CAUTIOUS" },
      { text: "Investigate immediately", value: "instinct", tag: "INTUITIVE" }
    ]
  }
];

export default function MoralChoice({ onComplete }: MoralChoiceProps) {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);

  const handleChoice = (value: string) => {
    if (gameState !== 'playing') return;
    
    audio?.playPulse();
    const nextChoices = [...choices, value];
    setChoices(nextChoices);

    if (currentStep >= DILEMMAS.length - 1) {
      setGameState('finished');
      onComplete(nextChoices);
    } else {
      setCurrentStep(s => s + 1);
    }
  };

  const currentDilemma = DILEMMAS[currentStep];

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
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10">
              <Activity className="w-8 h-8 text-white/40" />
            </div>
            <h3 className="text-xs font-black tracking-[0.5em] text-white/30 mb-4 uppercase">FINAL TRIAL</h3>
            <h2 className="text-5xl font-black mb-6 text-center leading-tight italic">INSTINCT<br/>PROTOCOL</h2>
            <p className="text-white/40 text-center mb-12 max-w-xs text-sm leading-relaxed">The final layer. Pure subconscious response. Your decisions here finalize the neural profile.</p>
            <button 
              onClick={() => setGameState('playing')} 
              className="btn-secondary w-full max-w-[260px] shadow-[0_0_40px_rgba(255,255,255,0.05)]"
            >
              INITIATE INSTINCT SCAN
            </button>
          </motion.div>
        )}

        {gameState === 'finished' && (
          <motion.div key="finished" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-background/95 backdrop-blur-2xl rounded-[3rem] p-12 border border-white/10 shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.05)]">
              <Fingerprint className="w-10 h-10 text-white animate-pulse" />
            </div>
            <h2 className="text-4xl font-black mb-4 italic">PROFILE GENERATED</h2>
            <p className="text-white/50 mb-16 font-medium text-center">Neural signature recorded. System finalizing archetype.</p>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="flex flex-col items-center gap-4">
              <span className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase">Final Reveal Awaiting</span>
              <ChevronDown className="w-6 h-6 text-white/30" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-16 text-center w-full">
        <p className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase mb-6">[ DECISION {currentStep + 1} / 3 ]</p>
        <div className="flex gap-4 justify-center w-full max-w-sm mx-auto">
          {DILEMMAS.map((_, i) => (
            <div key={i} className="flex-1 relative group">
              <div className={cn("h-1 rounded-full transition-all duration-700", currentStep >= i ? "bg-white/60 shadow-[0_0_15px_rgba(255,255,255,0.3)]" : "bg-white/5")} />
              {currentStep === i && gameState !== 'finished' && <motion.div layoutId="activeChoice" className="absolute -inset-2 rounded-full border border-white/20" />}
            </div>
          ))}
        </div>
      </div>

      <div className="w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -30, opacity: 0 }}
            className="flex flex-col gap-10"
          >
            <div className="p-16 glass-card border-white/5 relative overflow-hidden group min-h-[220px] flex items-center justify-center">
              <div className="absolute inset-0 bg-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="scanning-line opacity-10" />
              <p className="text-3xl md:text-4xl font-medium text-center relative z-10 leading-tight tracking-tight italic">{currentDilemma.question}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {currentDilemma.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleChoice(option.value)}
                  className="p-10 rounded-[3rem] bg-white/[0.03] border-2 border-white/5 hover:border-white/20 hover:bg-white/[0.08] transition-all duration-500 group relative overflow-hidden flex flex-col items-center gap-3 shadow-xl"
                >
                  <span className="text-[10px] font-black tracking-[0.3em] text-white/20 group-hover:text-white/40 transition-colors uppercase">{option.tag}</span>
                  <span className="text-xl font-bold group-hover:text-white transition-colors relative z-10 text-center px-4">{option.text}</span>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)]" />
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

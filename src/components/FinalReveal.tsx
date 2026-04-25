'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Image from 'next/image';
import { audio } from '@/lib/audio';
import { Share2, RefreshCcw, Lock, Award, ShieldCheck, Zap, Target, Brain, Compass } from 'lucide-react';

interface FinalRevealProps {
  scores: {
    memory: number;
    logic: number;
    speed: number;
    choices: string[];
  };
  stage: 'hero' | 'games' | 'result';
  onRestart: () => void;
}

const PERSONAS = {
  owl: {
    name: "The Architect",
    image: "/assets/owl.png",
    description: "Your neural pathways favor deep structural analysis. You perceive the world as a complex series of interconnected systems, prioritizing long-term stability over short-term gains.",
    strengths: ["Structural Integrity", "Deep Pattern Recognition", "Strategic Foresight"],
    style: "SYSTEMATIC ARCHITECT",
    color: "text-primary",
    glow: "shadow-[0_0_50px_rgba(0,242,255,0.3)]",
    icon: Brain
  },
  fox: {
    name: "The Infiltrator",
    image: "/assets/fox.png",
    description: "High-frequency neural firing patterns indicate extreme adaptability. You thrive in chaotic environments where rapid decision-making and fluid thinking are the only ways to survive.",
    strengths: ["Dynamic Adaptation", "Non-linear Logic", "Rapid Reflexes"],
    style: "ADAPTIVE INFILTRATOR",
    color: "text-orange-400",
    glow: "shadow-[0_0_50px_rgba(251,146,60,0.3)]",
    icon: Zap
  },
  wolf: {
    name: "The Commander",
    image: "/assets/wolf.png",
    description: "Your cognitive signature is one of immense clarity and decisive action. You naturally gravitate towards directional leadership, optimizing resources for the survival of the collective.",
    strengths: ["Directional Leadership", "Resource Optimization", "Absolute Decisiveness"],
    style: "TACTICAL COMMANDER",
    color: "text-blue-400",
    glow: "shadow-[0_0_50px_rgba(96,165,250,0.3)]",
    icon: ShieldCheck
  },
  dolphin: {
    name: "The Diplomat",
    image: "/assets/dolphin.png",
    description: "Extraordinary emotional resonance detected. Your neural network is highly tuned to social dynamics, allowing you to bridge cognitive gaps that others find insurmountable.",
    strengths: ["Social Resonance", "Cognitive Empathy", "Fluid Collaboration"],
    style: "EMOTIONAL DIPLOMAT",
    color: "text-cyan-400",
    glow: "shadow-[0_0_50px_rgba(34,211,238,0.3)]",
    icon: Compass
  },
  panther: {
    name: "The Executor",
    image: "/assets/panther.png",
    description: "Your focus is laser-targeted. Once a goal is identified, your neural resources are mobilized with singular intensity, making you an unstoppable force of execution.",
    strengths: ["Target Singularity", "Unwavering Focus", "Mobilization Speed"],
    style: "PRECISION EXECUTOR",
    color: "text-purple-400",
    glow: "shadow-[0_0_50px_rgba(192,132,252,0.3)]",
    icon: Target
  },
  raven: {
    name: "The Visionary",
    image: "/assets/raven.png",
    description: "Highly unconventional neural mapping detected. You operate outside standard cognitive frameworks, identifying solutions in the abstract space between logic and intuition.",
    strengths: ["Abstract Innovation", "Unconventional Logic", "Conceptual Complexity"],
    style: "NEURAL VISIONARY",
    color: "text-accent",
    glow: "shadow-[0_0_50px_rgba(255,0,122,0.3)]",
    icon: Award
  }
};

export default function FinalReveal({ scores, stage, onRestart }: FinalRevealProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const analysisStarted = useRef(false);

  useEffect(() => {
    if (stage !== 'result') {
      setIsRevealed(false);
      analysisStarted.current = false;
    }
  }, [stage]);

  const personaKey = useMemo(() => {
    const { memory, logic, speed, choices } = scores;
    let result: keyof typeof PERSONAS = "owl";

    if (logic > 80 && choices.includes("patience")) result = "owl";
    else if (speed > 80 && choices.includes("risk")) result = "fox";
    else if (logic > 80 && choices.includes("focus")) result = "wolf";
    else if (speed > 80 && choices.includes("social")) result = "dolphin";
    else if (memory > 80 && choices.includes("instinct")) result = "panther";
    else result = "raven";

    return result;
  }, [scores]);

  useEffect(() => {
    if (stage !== 'result' || analysisStarted.current) return;
    analysisStarted.current = true;

    const timer = setTimeout(() => {
      setIsRevealed(true);
      audio?.playReveal();
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00f2ff', '#7000ff', '#ff007a'],
        ticks: 200
      });
    }, 4000);

    return () => clearTimeout(timer);
  }, [stage]);

  const currentPersona = PERSONAS[personaKey];
  const PersonaIcon = currentPersona.icon;

  if (stage !== 'result') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 relative overflow-hidden">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute w-[500px] h-[500px] border border-white/5 rounded-full"
        />
        <Lock className="w-20 h-20 text-white/5 mb-8" />
        <h2 className="text-3xl font-black text-white/10 tracking-[0.4em] mb-4">Identity Locked</h2>
        <p className="text-white/10 max-w-sm text-sm uppercase font-bold tracking-widest">Awaiting total neural synchronization through all cognitive trials.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-24 px-4 snap-start relative">
      <AnimatePresence mode="wait">
        {!isRevealed ? (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="text-center w-full max-w-2xl"
          >
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-4xl md:text-6xl font-black tracking-[0.2em] mb-12 italic"
            >
              GENERATING <span className="text-gradient">NEURAL MAP</span>
            </motion.div>
            
            <div className="space-y-6">
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-primary via-secondary to-accent shadow-[0_0_30px_rgba(0,242,255,0.8)]"
                />
              </div>
              <div className="flex justify-between text-[10px] font-black tracking-[0.4em] text-white/30 uppercase">
                <span>Decoding Archetype</span>
                <span>100% Sync</span>
              </div>
            </div>

            <div className="mt-16 grid grid-cols-2 gap-4">
              {['Synaptic Load', 'Logic Flow', 'Reflex Buffer', 'Moral Compass'].map((label, i) => (
                 <motion.div 
                   key={label}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.5 }}
                   className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-[10px] font-black tracking-widest text-white/40 uppercase"
                 >
                   {label}: <span className="text-primary">OK</span>
                 </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="revealed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-6xl w-full"
          >
            <div className="text-center mb-16">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs uppercase tracking-[0.6em] text-white/30 font-black mb-6 block"
              >
                Cognitive Profile Unlocked
              </motion.span>
              <motion.h1 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className={`text-7xl md:text-[10rem] font-black mb-4 ${currentPersona.color} neo-glow tracking-tighter leading-none italic uppercase`}
              >
                {currentPersona.name}
              </motion.h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Persona Image & Icon Card */}
              <motion.div
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="lg:col-span-5 relative"
              >
                <div className={`glass-card p-12 flex items-center justify-center aspect-square relative overflow-hidden group ${currentPersona.glow}`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="scanning-line opacity-30" />
                  <div className="relative w-full h-full z-10 drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                    <Image 
                      src={currentPersona.image} 
                      alt={currentPersona.name} 
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                  <div className="absolute bottom-8 right-8">
                    <PersonaIcon className={`w-12 h-12 ${currentPersona.color} opacity-40`} />
                  </div>
                </div>
              </motion.div>

              {/* Insights & Actions */}
              <div className="lg:col-span-7 space-y-10">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="space-y-6"
                >
                   <h3 className="text-xs uppercase tracking-[0.4em] text-white/20 font-black">Neural Assessment</h3>
                   <p className="text-2xl md:text-3xl text-white/80 font-medium leading-relaxed italic">{currentPersona.description}</p>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div className="p-8 glass-card border-white/5 space-y-4">
                    <h3 className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-black">Core Competencies</h3>
                    <div className="space-y-3">
                      {currentPersona.strengths.map((s, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className={`w-1.5 h-1.5 rounded-full ${currentPersona.color}`} />
                          <span className="text-sm font-bold text-white/70">{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-8 bg-white/[0.02] border border-white/10 rounded-[2rem] space-y-3">
                    <h3 className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-black">Archetype Style</h3>
                    <p className={`text-2xl font-black ${currentPersona.color} italic`}>{currentPersona.style}</p>
                    <div className="h-[1px] w-full bg-white/5" />
                    <p className="text-[10px] text-white/20 font-bold tracking-widest uppercase">Operational Protocol Active</p>
                  </div>
                </motion.div>

                <motion.div 
                   initial={{ y: 20, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   transition={{ delay: 1.2 }}
                   className="flex flex-wrap gap-6"
                >
                  <button onClick={() => alert("Identity report exported!")} className="btn-secondary flex items-center gap-3 flex-1 min-w-[200px] justify-center">
                    <Share2 className="w-5 h-5" /> Export Signature
                  </button>
                  <button onClick={onRestart} className="btn-primary flex items-center gap-3 flex-1 min-w-[200px] justify-center bg-white text-black shadow-white/20">
                    <RefreshCcw className="w-5 h-5" /> Reset Protocol
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

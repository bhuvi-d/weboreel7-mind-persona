'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import SmoothScroll from '@/components/SmoothScroll';
import Hero from '@/components/Hero';
import MemoryPulse from '@/components/MemoryPulse';
import LogicGrid from '@/components/LogicGrid';
import SpeedFocus from '@/components/SpeedFocus';
import MoralChoice from '@/components/MoralChoice';
import FinalReveal from '@/components/FinalReveal';
import AudioController from '@/components/AudioController';
import dynamic from 'next/dynamic';

const GridBackground = dynamic(() => import('@/components/GridBackground'), { ssr: false });
import { audio } from '@/lib/audio';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [stage, setStage] = useState<'hero' | 'games' | 'result'>('hero');
  const [currentGame, setCurrentGame] = useState(0);
  const [scores, setScores] = useState({
    memory: 0,
    logic: 0,
    speed: 0,
    choices: [] as string[]
  });

  const sectionRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null)
  ];

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    setMounted(true);
    const observers = sectionRefs.map((ref, i) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(i);
          }
        },
        { threshold: 0.5 }
      );
      if (ref.current) observer.observe(ref.current);
      return observer;
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollTo = (index: number) => {
    sectionRefs[index].current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStart = () => {
    setStage('games');
    audio?.playPulse();
    scrollTo(1);
  };

  const handleMemoryComplete = (score: number) => {
    setScores(prev => ({ ...prev, memory: score }));
    setCurrentGame(1);
  };

  const handleLogicComplete = (score: number) => {
    setScores(prev => ({ ...prev, logic: score }));
    setCurrentGame(2);
  };

  const handleSpeedComplete = (score: number) => {
    setScores(prev => ({ ...prev, speed: score }));
    setCurrentGame(3);
  };

  const handleMoralComplete = (choices: string[]) => {
    setScores(prev => ({ ...prev, choices }));
    setStage('result');
    scrollTo(5);
  };

  const handleRestart = () => {
    setStage('hero');
    setCurrentGame(0);
    setScores({ memory: 0, logic: 0, speed: 0, choices: [] });
    scrollTo(0);
  };

  return (
    <SmoothScroll>
      <main className="relative bg-background text-foreground min-h-screen">
        <AudioController />
        
        {/* Progress Bar */}
        {mounted && (
          <motion.div 
            className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left" 
            style={{ scaleX }} 
          />
        )}

        {/* Section Tracker */}
        <div className="fixed top-1/2 left-8 -translate-y-1/2 flex flex-col gap-10 z-40 hidden md:flex">
          {[
            "HOME", "MEMORY", "LOGIC", "SPEED", "CHOICE", "RESULT"
          ].map((label, i) => (
            <button 
              key={i}
              onClick={() => scrollTo(i)}
              className="group relative flex items-center"
            >
              <div className="relative flex items-center justify-center">
                <div className={`w-3 h-3 rounded-full transition-all duration-700 border-2 ${
                  activeSection === i 
                    ? "bg-primary border-primary shadow-[0_0_20px_rgba(0,242,255,0.8)] scale-125" 
                    : "bg-transparent border-white/20 group-hover:border-white/40"
                }`} />
                {mounted && activeSection === i && (
                  <motion.div 
                    layoutId="activeDot"
                    className="absolute -inset-2 rounded-full border border-primary/20"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>
              
              <span className={`absolute left-10 opacity-0 group-hover:opacity-100 transition-all duration-500 text-[10px] font-black tracking-[0.4em] uppercase pointer-events-none whitespace-nowrap translate-x-[-10px] group-hover:translate-x-0 ${
                activeSection === i ? "text-primary opacity-100 translate-x-0" : "text-white/30"
              }`}>
                {label}
              </span>

              {i < 5 && (
                <div className="absolute top-full left-1.5 w-[1px] h-10 bg-gradient-to-b from-white/10 to-white/10" />
              )}
            </button>
          ))}
        </div>

        <GridBackground />
        
        <div className="flex flex-col">
          <section ref={sectionRefs[0]} className="h-screen flex-shrink-0">
            <Hero onStart={handleStart} />
          </section>

          <section ref={sectionRefs[1]} className="h-screen flex-shrink-0 flex items-center justify-center p-4 border-b border-white/5">
            <div className="w-full max-w-4xl">
              <MemoryPulse onComplete={handleMemoryComplete} />
            </div>
          </section>

          <section ref={sectionRefs[2]} className="h-screen flex-shrink-0 flex items-center justify-center p-4 border-b border-white/5">
            <div className="w-full max-w-4xl">
              <LogicGrid onComplete={handleLogicComplete} />
            </div>
          </section>

          <section ref={sectionRefs[3]} className="h-screen flex-shrink-0 flex items-center justify-center p-4 border-b border-white/5">
            <div className="w-full max-w-4xl">
              <SpeedFocus onComplete={handleSpeedComplete} />
            </div>
          </section>

          <section ref={sectionRefs[4]} className="h-screen flex-shrink-0 flex items-center justify-center p-4 border-b border-white/5">
            <div className="w-full max-w-4xl">
              <MoralChoice onComplete={handleMoralComplete} />
            </div>
          </section>

          <section ref={sectionRefs[5]} className="min-h-screen flex-shrink-0">
            <FinalReveal scores={scores} stage={stage} onRestart={handleRestart} />
          </section>
        </div>

        {/* Dynamic Background Effects */}
        {mounted && (
          <div className="fixed inset-0 pointer-events-none z-[-1] opacity-20">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] animate-pulse" />
          </div>
        )}
      </main>
    </SmoothScroll>
  );
}

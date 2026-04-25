'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audio } from '@/lib/audio';
import { Square, Circle, Triangle, Hexagon, Diamond, Shield, ChevronDown, CheckCircle2, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogicGridProps {
  onComplete: (score: number) => void;
}

const SHAPES = [Square, Circle, Triangle, Hexagon, Diamond, Shield];

export default function LogicGrid({ onComplete }: LogicGridProps) {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [grid, setGrid] = useState<number[]>([]);
  const [missingIndex, setMissingIndex] = useState<number>(0);
  const [options, setOptions] = useState<number[]>([]);
  const [round, setRound] = useState(1);
  const [startTime, setStartTime] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

  const generatePuzzle = useCallback(() => {
    const patternType = Math.floor(Math.random() * 2);
    const newGrid = [];
    const shapePool = [...Array(SHAPES.length).keys()].sort(() => Math.random() - 0.5);
    
    if (patternType === 0) {
      const s1 = shapePool[0];
      const s2 = shapePool[1];
      for (let i = 0; i < 9; i++) newGrid.push(i % 2 === 0 ? s1 : s2);
    } else {
      const s1 = shapePool[0];
      const s2 = shapePool[1];
      const s3 = shapePool[2];
      for (let i = 0; i < 9; i++) {
        if (i % 3 === 0) newGrid.push(s1);
        else if (i % 3 === 1) newGrid.push(s2);
        else newGrid.push(s3);
      }
    }

    const missingIdx = Math.floor(Math.random() * 9);
    const correctAnswer = newGrid[missingIdx];
    const otherShapes = shapePool.filter(s => s !== correctAnswer);
    const newOptions = [correctAnswer, ...otherShapes.slice(0, 3)].sort(() => Math.random() - 0.5);

    setGrid(newGrid);
    setMissingIndex(missingIdx);
    setOptions(newOptions);
    setStartTime(Date.now());
  }, []);

  const handleBegin = () => {
    setGameState('playing');
    generatePuzzle();
  };

  const handleOptionClick = (shapeIndex: number) => {
    if (gameState !== 'playing') return;
    
    if (shapeIndex === grid[missingIndex]) {
      audio?.playSuccess();
      const timeTaken = (Date.now() - startTime) / 1000;
      const roundScore = Math.max(10, 25 - Math.floor(timeTaken));
      setTotalScore(s => s + roundScore);

      if (round >= 3) {
        setGameState('finished');
        onComplete(totalScore + roundScore);
      } else {
        setRound(r => r + 1);
        generatePuzzle();
      }
    } else {
      audio?.playError();
      if (round >= 3) {
        setGameState('finished');
        onComplete(totalScore);
      } else {
        setRound(r => r + 1);
        generatePuzzle();
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-2xl mx-auto py-12 relative">
      <AnimatePresence mode="wait">
        {gameState === 'idle' && (
          <motion.div 
            key="idle" 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 1.05 }} 
            className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-background/95 backdrop-blur-2xl rounded-[3rem] p-12 border border-white/10 shadow-2xl"
          >
            <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-8 border border-secondary/20">
              <Cpu className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-xs font-black tracking-[0.5em] text-secondary mb-4">COGNITIVE TRIAL 02</h3>
            <h2 className="text-5xl font-black mb-6 text-center leading-tight italic">LOGIC<br/>MATRIX</h2>
            <p className="text-white/40 text-center mb-12 max-w-xs text-sm leading-relaxed">Decode the underlying neural pattern. Identify the missing sequence node.</p>
            <button onClick={handleBegin} className="btn-primary border-secondary shadow-[0_0_40px_rgba(112,0,255,0.3)] hover:shadow-[0_0_60px_rgba(112,0,255,0.5)] bg-secondary text-white w-full max-w-[240px]">INITIATE ANALYSIS</button>
          </motion.div>
        )}

        {gameState === 'finished' && (
          <motion.div key="finished" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-background/95 backdrop-blur-2xl rounded-[3rem] p-12 border border-secondary/20 shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mb-8 border border-secondary/40 shadow-[0_0_40px_rgba(112,0,255,0.2)]">
              <CheckCircle2 className="w-10 h-10 text-secondary" />
            </div>
            <h2 className="text-4xl font-black mb-4 text-secondary italic">ANALYSIS COMPLETE</h2>
            <p className="text-white/50 mb-16 font-medium text-center">Neural core integrity verified.</p>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="flex flex-col items-center gap-4">
              <span className="text-[10px] font-black tracking-[0.4em] text-secondary/40 uppercase">Proceed to Next Protocol</span>
              <ChevronDown className="w-6 h-6 text-secondary/40" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center mb-12 w-full">
        <p className="text-secondary font-black tracking-[0.4em] text-xs mb-6 uppercase">[ PHASE {round} / 3 ]</p>
        <div className="flex gap-4 justify-center">
          {[1, 2, 3].map(i => (
            <div key={i} className="relative group">
              <div className={cn("w-16 h-1 rounded-full transition-all duration-700", round >= i ? "bg-secondary shadow-[0_0_20px_rgba(112,0,255,0.6)]" : "bg-white/10")} />
              {round === i && gameState !== 'finished' && <motion.div layoutId="activeLogicRound" className="absolute -inset-2 rounded-full border border-secondary/30" />}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 p-10 glass-card border-white/5 mb-16 relative overflow-hidden group">
        <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        {grid.map((shapeIdx, i) => {
          const ShapeIcon = SHAPES[shapeIdx];
          const isMissing = i === missingIndex;
          return (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "w-28 h-28 flex items-center justify-center rounded-[2rem] border-2 transition-all duration-500", 
                isMissing 
                  ? "bg-white/5 border-dashed border-white/20 shadow-[inset_0_0_40px_rgba(255,255,255,0.02)] relative overflow-hidden" 
                  : "bg-white/[0.03] border-white/5 hover:border-secondary/30"
              )}
            >
              {!isMissing && <ShapeIcon className="w-12 h-12 text-secondary/80" />}
              {isMissing && (
                <>
                  <div className="scanning-line" />
                  <span className="text-4xl font-black text-white/10 animate-pulse">?</span>
                </>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="flex gap-8">
        {options.map((shapeIdx, i) => {
          const ShapeIcon = SHAPES[shapeIdx];
          return (
            <motion.button
              key={i}
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(112, 0, 255, 0.15)', borderColor: 'rgba(112, 0, 255, 0.5)' }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleOptionClick(shapeIdx)}
              className="w-24 h-24 flex items-center justify-center rounded-[2.5rem] bg-white/[0.03] border-2 border-white/10 transition-all duration-300 group relative overflow-hidden shadow-xl"
            >
              <div className="absolute inset-0 bg-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <ShapeIcon className="w-10 h-10 text-white relative z-10" />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

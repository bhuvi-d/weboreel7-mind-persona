'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Particle {
  x: string;
  y: string;
  duration: number;
  delay: number;
}

export default function GridBackground() {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setMounted(true);
    const newParticles = [...Array(6)].map(() => ({
      x: Math.random() * 100 + "%",
      y: Math.random() * 100 + "%",
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 10,
    }));
    setParticles(newParticles);
  }, []);

  if (!mounted) {
    return <div className="fixed inset-0 z-[-1] pointer-events-none bg-background" />;
  }

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none bg-background overflow-hidden" suppressHydrationWarning>
      {/* Dynamic Cyber Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 cyber-grid"
      />
      
      {/* Radial Depth Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,242,255,0.05)_0%,transparent_70%)]" />
      
      {/* Floating Light Particles */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          initial={{ 
            opacity: 0,
            x: p.x,
            y: p.y,
          }}
          animate={{ 
            opacity: [0, 0.4, 0],
            y: ["-10%", "110%"],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear"
          }}
          className="absolute w-1 h-20 bg-gradient-to-b from-primary/0 via-primary/30 to-primary/0 blur-sm"
        />
      ))}

      {/* Atmospheric Fog */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background opacity-80" />
    </div>
  );
}

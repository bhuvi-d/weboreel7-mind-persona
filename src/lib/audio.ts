'use client';

class AudioManager {
  private ctx: AudioContext | null = null;
  private masterVolume: GainNode | null = null;
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterVolume = this.ctx.createGain();
      this.masterVolume.connect(this.ctx.destination);
    }
  }

  private resume() {
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMute(mute: boolean) {
    this.isMuted = mute;
    if (this.masterVolume) {
      this.masterVolume.gain.setTargetAtTime(mute ? 0 : 1, this.ctx!.currentTime, 0.1);
    }
  }

  playSuccess() {
    this.resume();
    if (!this.ctx || !this.masterVolume || this.isMuted) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(this.masterVolume);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  playError() {
    this.resume();
    if (!this.ctx || !this.masterVolume || this.isMuted) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.2);
    
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(this.masterVolume);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  playPulse() {
    this.resume();
    if (!this.ctx || !this.masterVolume || this.isMuted) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(this.masterVolume);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playReveal() {
    this.resume();
    if (!this.ctx || !this.masterVolume || this.isMuted) return;
    
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 1);
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(277.18, this.ctx.currentTime); // C#
    osc2.frequency.exponentialRampToValueAtTime(554.37, this.ctx.currentTime + 1);
    
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 2);
    
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterVolume);
    
    osc1.start();
    osc2.start();
    osc1.stop(this.ctx.currentTime + 2);
    osc2.stop(this.ctx.currentTime + 2);
  }

  playAmbience() {
    this.resume();
    if (!this.ctx || !this.masterVolume || this.isMuted) return;
    
    // Create a low hum
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(55, this.ctx.currentTime);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterVolume);
    
    osc.start();
    return () => {
      osc.stop();
    };
  }
}

export const audio = typeof window !== 'undefined' ? new AudioManager() : null;

import { suoniConfig } from '../config/suoniConfig';

let audioCtx: AudioContext | null = null;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

const playTone = (freq: number, type: OscillatorType, duration: number, vol: number = 1, delay: number = 0) => {
  if (!suoniConfig.abilitati) return;
  initAudio();
  if (!audioCtx) return;

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  oscillator.type = type;
  const startTime = audioCtx.currentTime + delay;
  oscillator.frequency.setValueAtTime(freq, startTime);
  
  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(vol * suoniConfig.volume, startTime + 0.05);
  gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
};

export const playSpinSound = () => {
  let i = 0;
  const interval = setInterval(() => {
    playTone(300 + (i % 2) * 100, 'square', 0.1, 0.1);
    i++;
    if (i > 15) clearInterval(interval);
  }, 100);
};

export const playWinSound = () => {
  playTone(440, 'sine', 0.2, 0.5);
  playTone(554, 'sine', 0.2, 0.5, 0.2);
  playTone(659, 'sine', 0.4, 0.5, 0.4);
};

export const playJackpotSound = () => {
  let i = 0;
  const interval = setInterval(() => {
    playTone(400 + Math.random() * 400, 'triangle', 0.1, 0.5);
    i++;
    if (i > 30) clearInterval(interval);
  }, 100);
};

export const playLoseSound = () => {
  playTone(300, 'sawtooth', 0.3, 0.3);
  playTone(250, 'sawtooth', 0.5, 0.3, 0.3);
};

export const playButtonSound = () => {
  playTone(600, 'sine', 0.1, 0.2);
};

export const playIntroMelody = () => {
  const notes = [440, 554, 659, 880, 659, 880, 1108];
  notes.forEach((freq, i) => {
    playTone(freq, 'sine', 0.3, 0.4, i * 0.15);
  });
};

export const playWheelSpinMelody = () => {
  let i = 0;
  const interval = setInterval(() => {
    playTone(800 - (i * 10), 'triangle', 0.1, 0.2);
    i++;
    if (i > 40) clearInterval(interval);
  }, 100);
};

export const playWheelWin = () => {
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C
  notes.forEach((freq, i) => {
    playTone(freq, 'square', 0.2, 0.4, i * 0.1);
  });
};

export const playWheelLose = () => {
  const notes = [392.00, 370.00, 349.23, 329.63]; // G Gb F E
  notes.forEach((freq, i) => {
    playTone(freq, 'sawtooth', 0.4, 0.4, i * 0.3);
  });
};

export const playRandomEventSound = (type: string) => {
  switch(type) {
    case 'coin': playTone(1200, 'sine', 0.1, 0.3); break;
    case 'sparkle': playTone(2000, 'sine', 0.05, 0.2); setTimeout(() => playTone(2200, 'sine', 0.05, 0.2), 50); break;
    case 'jackpot_ping': playTone(880, 'square', 0.3, 0.4); break;
    case 'bonus_alert': playTone(600, 'triangle', 0.2, 0.4); playTone(800, 'triangle', 0.4, 0.4, 0.2); break;
    case 'magic_swish': playTone(400, 'sine', 0.5, 0.2); break;
    default: playTone(1000, 'sine', 0.1, 0.2);
  }
};

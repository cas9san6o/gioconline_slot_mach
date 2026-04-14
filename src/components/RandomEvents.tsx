import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { playRandomEventSound } from '../engine/soundEngine';

type RandomEvent = {
  id: number;
  type: 'coin' | 'sparkle' | 'jackpot_ping' | 'bonus_alert' | 'magic_swish';
  x: number;
  y: number;
  content: string;
};

export const RandomEvents = ({ isSpinning }: { isSpinning: boolean }) => {
  const [events, setEvents] = useState<RandomEvent[]>([]);

  useEffect(() => {
    if (isSpinning) return; // Don't spawn during spins to avoid distraction

    const spawnEvent = () => {
      if (Math.random() > 0.3) return; // 30% chance to spawn every interval

      const types: RandomEvent['type'][] = ['coin', 'sparkle', 'jackpot_ping', 'bonus_alert', 'magic_swish'];
      const contents = {
        'coin': '🪙',
        'sparkle': '✨',
        'jackpot_ping': '🎰',
        'bonus_alert': 'BONUS!',
        'magic_swish': '💎'
      };

      const type = types[Math.floor(Math.random() * types.length)];
      
      const newEvent: RandomEvent = {
        id: Date.now(),
        type,
        x: Math.random() * 80 + 10, // 10% to 90% of screen width
        y: Math.random() * 80 + 10, // 10% to 90% of screen height
        content: contents[type]
      };

      playRandomEventSound(type);
      setEvents(prev => [...prev, newEvent]);

      // Remove event after animation
      setTimeout(() => {
        setEvents(prev => prev.filter(e => e.id !== newEvent.id));
      }, 2000);
    };

    const interval = setInterval(spawnEvent, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [isSpinning]);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      <AnimatePresence>
        {events.map(event => (
          <motion.div
            key={event.id}
            className={`absolute font-black drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] ${event.type === 'bonus_alert' ? 'text-4xl text-yellow-400' : 'text-5xl'}`}
            style={{ left: `${event.x}%`, top: `${event.y}%` }}
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.2, 1, 0.8], y: -50 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            {event.content}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

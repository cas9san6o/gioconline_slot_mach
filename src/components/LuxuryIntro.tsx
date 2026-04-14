import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { playIntroMelody } from '../engine/soundEngine';

export const LuxuryIntro = ({ onComplete, text = "PREPARATI A VINCERE!" }: { onComplete: () => void, text?: string }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    playIntroMelody();
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 800); // Wait for fade out
    }, 3200); // 4 seconds total (3.2s visible + 0.8s fade)
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed inset-0 z-[100] bg-gradient-to-b from-purple-900 via-blue-900 to-black overflow-hidden flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ scale: 1 }}
            animate={{ scale: 1.15 }}
            transition={{ duration: 4, ease: "linear" }}
          >
            {/* Background Image Overlay */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596838132731-3301c3fd4317?q=80&w=1080&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-screen"></div>
            
            {/* Particles */}
            {Array.from({ length: 40 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-3xl md:text-5xl drop-shadow-[0_0_15px_rgba(255,215,0,1)]"
                initial={{ 
                  x: (Math.random() - 0.5) * window.innerWidth * 1.5, 
                  y: window.innerHeight / 2 + 100,
                  rotate: 0,
                  opacity: 0
                }}
                animate={{ 
                  y: -window.innerHeight / 2 - 100,
                  rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                  opacity: [0, 1, 1, 0]
                }}
                transition={{ 
                  duration: 2 + Math.random() * 2, 
                  ease: "easeOut",
                  delay: Math.random() * 1.5
                }}
              >
                {Math.random() > 0.5 ? '🪙' : '✨'}
              </motion.div>
            ))}

            <motion.div 
              className="text-[120px] md:text-[180px] drop-shadow-[0_0_40px_rgba(255,215,0,0.8)] z-10 mb-4"
              animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              🎰
            </motion.div>

            <motion.h1 
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.3 }}
              className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-yellow-400 to-yellow-700 text-center z-10 drop-shadow-[0_5px_10px_rgba(0,0,0,0.8)] px-4 uppercase tracking-widest"
            >
              {text}
            </motion.h1>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

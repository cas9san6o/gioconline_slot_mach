import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { playButtonSound, playWinSound, playIntroMelody } from '../engine/soundEngine';

export const PickBonusBoxGame = ({ onComplete }: { onComplete: (premio: number) => void }) => {
  const [showIntro, setShowIntro] = useState(true);
  const [boxes, setBoxes] = useState<number[]>([]);
  const [openedIndex, setOpenedIndex] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    playIntroMelody();
    setTimeout(() => {
      setShowIntro(false);
      // Generate 3 boxes: 1 big prize, 2 small prizes
      const prizes = [1000, 50, 10];
      // Shuffle
      setBoxes(prizes.sort(() => Math.random() - 0.5));
    }, 3000);
  }, []);

  const handleBoxClick = (index: number) => {
    if (gameOver) return;
    playButtonSound();
    setOpenedIndex(index);
    setGameOver(true);
    
    const premio = boxes[index];
    setTimeout(() => {
      playWinSound();
    }, 1000);

    setTimeout(() => {
      onComplete(premio);
    }, 4000);
  };

  if (showIntro) {
    return (
      <div className="absolute inset-0 bg-black/95 z-50 flex flex-col items-center justify-center overflow-hidden">
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="text-6xl md:text-8xl mb-8 drop-shadow-[0_0_30px_rgba(250,204,21,1)]"
        >
          📦
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 text-center drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]"
        >
          SCEGLI IL FORZIERE
        </motion.h2>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4 backdrop-blur-md">
      <h2 className="text-3xl md:text-5xl font-black text-yellow-400 mb-12 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)] text-center">
        TROVA IL JACKPOT!
      </h2>

      <div className="flex justify-center gap-4 md:gap-8 w-full max-w-2xl">
        {boxes.map((premio, i) => (
          <motion.div
            key={i}
            onClick={() => handleBoxClick(i)}
            whileHover={!gameOver ? { scale: 1.1 } : {}}
            whileTap={!gameOver ? { scale: 0.9 } : {}}
            className={`relative w-24 h-24 md:w-32 md:h-32 cursor-pointer ${gameOver && openedIndex !== i ? 'opacity-70' : ''}`}
          >
            {gameOver ? (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: openedIndex === i ? 0 : 1.5 }}
                className={`absolute inset-0 flex flex-col items-center justify-center rounded-xl border-4 shadow-[0_0_30px_rgba(250,204,21,1)] z-10 ${openedIndex === i ? 'bg-gradient-to-b from-yellow-300 to-yellow-600 border-white' : 'bg-gradient-to-b from-gray-400 to-gray-600 border-gray-300'}`}
              >
                <span className="text-3xl md:text-4xl">{premio >= 1000 ? '💎' : '🪙'}</span>
                <span className={`text-xl md:text-2xl font-black ${openedIndex === i ? 'text-black' : 'text-gray-800'}`}>{premio}</span>
              </motion.div>
            ) : (
              <motion.div 
                animate={!gameOver ? { rotate: [-2, 2, -2] } : {}}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-amber-700 to-amber-900 rounded-xl border-4 border-amber-500 shadow-[0_0_15px_rgba(217,119,6,0.5)]"
              >
                <span className="text-5xl md:text-6xl">📦</span>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {gameOver && openedIndex !== null && (
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-4xl md:text-5xl font-black text-green-400 drop-shadow-[0_0_20px_rgba(74,222,128,0.8)]"
        >
          HAI VINTO {boxes[openedIndex]}!
        </motion.div>
      )}
    </div>
  );
};

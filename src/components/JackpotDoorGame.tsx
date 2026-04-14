import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { playButtonSound, playWinSound, playIntroMelody, playLoseSound } from '../engine/soundEngine';

export const JackpotDoorGame = ({ onComplete }: { onComplete: (premio: number) => void }) => {
  const [showIntro, setShowIntro] = useState(true);
  const [doors, setDoors] = useState<number[]>([]);
  const [openedIndex, setOpenedIndex] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    playIntroMelody();
    setTimeout(() => {
      setShowIntro(false);
      const prizes = [5000, 500, 0]; // Jackpot, Medium, Lose
      setDoors(prizes.sort(() => Math.random() - 0.5));
    }, 3000);
  }, []);

  const handleDoorClick = (index: number) => {
    if (gameOver) return;
    playButtonSound();
    setOpenedIndex(index);
    setGameOver(true);
    
    const premio = doors[index];
    setTimeout(() => {
      if (premio > 0) playWinSound();
      else playLoseSound();
    }, 1000);

    setTimeout(() => {
      onComplete(premio);
    }, 4000);
  };

  if (showIntro) {
    return (
      <div className="absolute inset-0 bg-black/95 z-50 flex flex-col items-center justify-center overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-6xl md:text-8xl mb-8 drop-shadow-[0_0_30px_rgba(250,204,21,1)]"
        >
          🚪
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 text-center drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]"
        >
          PORTA DEL JACKPOT
        </motion.h2>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4 backdrop-blur-md">
      <h2 className="text-3xl md:text-5xl font-black text-yellow-400 mb-12 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)] text-center">
        SCEGLI LA TUA PORTA
      </h2>

      <div className="flex justify-center gap-4 md:gap-8 w-full max-w-3xl">
        {doors.map((premio, i) => (
          <div key={i} className="relative w-24 h-40 md:w-32 md:h-56 perspective-1000">
            <motion.div
              onClick={() => handleDoorClick(i)}
              animate={gameOver ? { rotateY: -105 } : { rotateY: 0 }}
              transition={{ duration: 1, ease: "easeInOut", delay: gameOver && openedIndex !== i ? 1.5 : 0 }}
              style={{ transformOrigin: "left" }}
              className={`absolute inset-0 bg-gradient-to-b from-yellow-600 to-yellow-900 border-4 border-yellow-400 rounded-lg shadow-[0_0_15px_rgba(250,204,21,0.5)] cursor-pointer flex items-center justify-center z-20 ${gameOver && openedIndex !== i ? 'opacity-70' : ''}`}
            >
              <div className="w-4 h-4 bg-yellow-300 rounded-full absolute right-2 top-1/2 -translate-y-1/2 shadow-inner"></div>
              <span className="text-4xl font-black text-yellow-300/50">{i + 1}</span>
            </motion.div>
            
            {/* Dietro la porta */}
            <div className="absolute inset-0 bg-black border-4 border-gray-800 rounded-lg flex flex-col items-center justify-center z-10 overflow-hidden">
              {premio === 5000 ? (
                <div className="text-center animate-pulse">
                  <div className="text-4xl">🎰</div>
                  <div className="text-yellow-400 font-black text-xl">JACKPOT</div>
                  <div className="text-yellow-300 font-bold">{premio}</div>
                </div>
              ) : premio > 0 ? (
                <div className="text-center">
                  <div className="text-4xl">💰</div>
                  <div className="text-green-400 font-bold">{premio}</div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-4xl">❌</div>
                  <div className="text-red-500 font-bold">VUOTO</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {gameOver && openedIndex !== null && (
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.5 }}
          className={`mt-12 text-4xl md:text-5xl font-black drop-shadow-[0_0_20px_rgba(74,222,128,0.8)] ${doors[openedIndex] > 0 ? 'text-green-400' : 'text-red-500'}`}
        >
          {doors[openedIndex] > 0 ? `HAI VINTO ${doors[openedIndex]}!` : 'RITENTA!'}
        </motion.div>
      )}
    </div>
  );
};

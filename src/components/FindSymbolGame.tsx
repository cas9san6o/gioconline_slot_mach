import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playButtonSound, playWinSound, playIntroMelody, playLoseSound } from '../engine/soundEngine';

export const FindSymbolGame = ({ onComplete }: { onComplete: (premio: number) => void }) => {
  const [showIntro, setShowIntro] = useState(true);
  const [targetSymbol, setTargetSymbol] = useState('');
  const [grid, setGrid] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [premio, setPremio] = useState(0);

  const possibleSymbols = ['🍒', '🍋', '🍉', '⭐', '🔔', '💎', '7️⃣', '🍀', '🍇'];

  useEffect(() => {
    playIntroMelody();
    setTimeout(() => {
      setShowIntro(false);
      startGame();
    }, 3000);
  }, []);

  const startGame = () => {
    const target = possibleSymbols[Math.floor(Math.random() * possibleSymbols.length)];
    setTargetSymbol(target);

    let newGrid = Array(9).fill('');
    const targetIndex = Math.floor(Math.random() * 9);
    newGrid[targetIndex] = target;

    for (let i = 0; i < 9; i++) {
      if (i !== targetIndex) {
        let sym;
        do {
          sym = possibleSymbols[Math.floor(Math.random() * possibleSymbols.length)];
        } while (sym === target);
        newGrid[i] = sym;
      }
    }
    setGrid(newGrid);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  };

  const handleTimeout = () => {
    if (gameOver) return;
    setGameOver(true);
    playLoseSound();
    setTimeout(() => onComplete(0), 2000);
  };

  const handleSymbolClick = (symbol: string) => {
    if (gameOver) return;
    playButtonSound();
    
    setGameOver(true);
    if (symbol === targetSymbol) {
      const winAmount = timeLeft * 100; // Più veloce = più crediti
      setPremio(winAmount);
      playWinSound();
      setTimeout(() => onComplete(winAmount), 3000);
    } else {
      playLoseSound();
      setTimeout(() => onComplete(0), 2000);
    }
  };

  if (showIntro) {
    return (
      <div className="absolute inset-0 bg-black/95 z-50 flex flex-col items-center justify-center overflow-hidden">
        <motion.div
          animate={{ rotateY: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="text-6xl md:text-8xl mb-8"
        >
          🎯
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-blue-300 to-blue-600 text-center drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
        >
          TROVA IL SIMBOLO
        </motion.h2>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4 backdrop-blur-md">
      <div className="text-center mb-8">
        <h3 className="text-xl text-gray-300 font-bold mb-2">TROVA QUESTO SIMBOLO:</h3>
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="text-6xl md:text-8xl drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]"
        >
          {targetSymbol}
        </motion.div>
      </div>

      <div className="text-2xl font-black text-red-500 mb-4 animate-pulse">
        TEMPO: {timeLeft}s
      </div>

      <div className="grid grid-cols-3 gap-2 md:gap-4 w-full max-w-sm">
        {grid.map((symbol, i) => (
          <motion.button
            key={i}
            onClick={() => handleSymbolClick(symbol)}
            disabled={gameOver}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="aspect-square bg-gray-800/80 border-2 border-blue-500/50 rounded-xl flex items-center justify-center text-4xl md:text-5xl shadow-[0_0_15px_rgba(59,130,246,0.2)]"
          >
            {symbol}
          </motion.button>
        ))}
      </div>

      {gameOver && (
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`mt-8 text-3xl md:text-5xl font-black ${premio > 0 ? 'text-green-400 drop-shadow-[0_0_20px_rgba(74,222,128,0.8)]' : 'text-red-500'}`}
        >
          {premio > 0 ? `OTTIMO! +${premio}` : 'TEMPO SCADUTO!'}
        </motion.div>
      )}
    </div>
  );
};

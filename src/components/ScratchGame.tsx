import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playButtonSound, playWinSound, playIntroMelody } from '../engine/soundEngine';

const ScratchCard = ({ symbol, isScratched, onScratchComplete }: { symbol: string, isScratched: boolean, onScratchComplete: () => void }) => {
  const [scratchedBlocks, setScratchedBlocks] = useState<boolean[]>(Array(25).fill(false));
  const isCompleted = useRef(false);

  const handleMove = (index: number) => {
    if (isCompleted.current || isScratched) return;
    
    if (!scratchedBlocks[index]) {
      const newBlocks = [...scratchedBlocks];
      newBlocks[index] = true;
      setScratchedBlocks(newBlocks);
      
      const scratchedCount = newBlocks.filter(Boolean).length;
      if (scratchedCount >= 15) { // 60% scratched
        isCompleted.current = true;
        onScratchComplete();
      }
    }
  };

  return (
    <div className="relative aspect-square rounded-xl overflow-hidden shadow-[0_0_15px_rgba(250,204,21,0.2)] border-2 border-yellow-600/50 touch-none">
      {/* Sfondo (Simbolo rivelato) */}
      <div className="absolute inset-0 bg-gray-900 flex items-center justify-center text-5xl md:text-6xl">
        {symbol}
      </div>
      
      {/* Copertura da grattare */}
      <AnimatePresence>
        {!isScratched && (
          <motion.div 
            exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 grid grid-cols-5 grid-rows-5"
          >
            {scratchedBlocks.map((isBlockScratched, i) => (
              <div 
                key={i}
                onMouseEnter={(e) => { if (e.buttons === 1) handleMove(i); }}
                onMouseDown={() => handleMove(i)}
                onTouchMove={(e) => {
                  const touch = e.touches[0];
                  const el = document.elementFromPoint(touch.clientX, touch.clientY);
                  if (el && el.getAttribute('data-index')) {
                    handleMove(parseInt(el.getAttribute('data-index')!, 10));
                  }
                }}
                onTouchStart={() => handleMove(i)}
                data-index={i}
                className={`w-full h-full transition-opacity duration-100 ${isBlockScratched ? 'opacity-0' : 'opacity-100 bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700'}`}
              >
                {!isBlockScratched && i === 12 && <span className="absolute inset-0 flex items-center justify-center text-white/50 font-black text-xl pointer-events-none">GRATTA</span>}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ScratchGame = ({ onComplete }: { onComplete: (premio: number) => void }) => {
  const [scratched, setScratched] = useState<boolean[]>(Array(6).fill(false));
  const [symbols, setSymbols] = useState<string[]>([]);
  const [showIntro, setShowIntro] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [premio, setPremio] = useState(0);

  const possibleSymbols = ['🪙', '💎', '🎰', '🎁', '💸', '👑'];

  useEffect(() => {
    // Generate symbols with a guaranteed win or random
    const isWin = Math.random() > 0.5;
    const targetSymbol = possibleSymbols[Math.floor(Math.random() * possibleSymbols.length)];
    let newSymbols = Array(6).fill('');
    
    if (isWin) {
      // Place 3 identical symbols
      let placed = 0;
      while (placed < 3) {
        const idx = Math.floor(Math.random() * 6);
        if (!newSymbols[idx]) {
          newSymbols[idx] = targetSymbol;
          placed++;
        }
      }
    }
    
    // Fill the rest
    for (let i = 0; i < 6; i++) {
      if (!newSymbols[i]) {
        let sym;
        do {
          sym = possibleSymbols[Math.floor(Math.random() * possibleSymbols.length)];
        } while (isWin && sym === targetSymbol); // Don't accidentally add a 4th winning symbol
        newSymbols[i] = sym;
      }
    }
    setSymbols(newSymbols);

    playIntroMelody();
    setTimeout(() => setShowIntro(false), 3000);
  }, []);

  const handleScratchComplete = (index: number) => {
    if (scratched[index] || gameOver) return;
    
    playButtonSound();
    const newScratched = [...scratched];
    newScratched[index] = true;
    setScratched(newScratched);

    if (newScratched.every(s => s)) {
      setGameOver(true);
      checkWin(newScratched);
    }
  };

  const checkWin = (currentScratched: boolean[]) => {
    const counts: Record<string, number> = {};
    symbols.forEach(s => {
      counts[s] = (counts[s] || 0) + 1;
    });

    const winningSymbol = Object.keys(counts).find(k => counts[k] >= 3);
    
    if (winningSymbol) {
      const winAmount = 500; // Base win
      setPremio(winAmount);
      playWinSound();
      setTimeout(() => onComplete(winAmount), 3000);
    } else {
      setTimeout(() => onComplete(0), 2000);
    }
  };

  if (showIntro) {
    return (
      <div className="absolute inset-0 bg-black/95 z-50 flex flex-col items-center justify-center overflow-hidden">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 1.5 }}
          className="text-6xl md:text-8xl mb-8"
        >
          🎫
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600 text-center drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]"
        >
          GRATTA E VINCI
        </motion.h2>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4 backdrop-blur-md">
      <h2 className="text-3xl md:text-5xl font-black text-yellow-400 mb-8 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)] text-center">
        GRATTA 6 TESSERE
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-md">
        {symbols.map((symbol, i) => (
          <ScratchCard 
            key={i} 
            symbol={symbol} 
            isScratched={scratched[i]} 
            onScratchComplete={() => handleScratchComplete(i)} 
          />
        ))}
      </div>

      {gameOver && (
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`mt-8 text-4xl md:text-5xl font-black ${premio > 0 ? 'text-green-400 drop-shadow-[0_0_20px_rgba(74,222,128,0.8)]' : 'text-gray-400'}`}
        >
          {premio > 0 ? `HAI VINTO ${premio}!` : 'RITENTA!'}
        </motion.div>
      )}
    </div>
  );
};

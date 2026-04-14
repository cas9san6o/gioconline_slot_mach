import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playButtonSound, playWinSound, playIntroMelody } from '../engine/soundEngine';

type Coin = { id: number; x: number; value: number; speed: number };

export const FallingCoinsGame = ({ onComplete }: { onComplete: (premio: number) => void }) => {
  const [showIntro, setShowIntro] = useState(true);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [score, setScore] = useState(0);
  const [caughtCount, setCaughtCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    playIntroMelody();
    setTimeout(() => {
      setShowIntro(false);
      startGame();
    }, 3000);
  }, []);

  const startGame = () => {
    const gameTimer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(gameTimer);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const spawnTimer = setInterval(() => {
      if (gameOver) return;
      const isMultiplier = Math.random() > 0.8;
      setCoins(prev => [...prev, {
        id: Date.now(),
        x: Math.random() * 80 + 10, // 10% to 90% width
        value: isMultiplier ? 50 : 10,
        speed: Math.random() * 2 + 2 // 2s to 4s fall duration
      }]);
    }, 400);

    return () => {
      clearInterval(gameTimer);
      clearInterval(spawnTimer);
    };
  };

  useEffect(() => {
    if (gameOver) {
      playWinSound();
      setTimeout(() => onComplete(score), 3000);
    }
  }, [gameOver, score, onComplete]);

  const catchCoin = (id: number, value: number) => {
    if (gameOver) return;
    playButtonSound();
    setScore(s => s + value);
    setCaughtCount(c => c + 1);
    setCoins(prev => prev.filter(c => c.id !== id));
  };

  if (showIntro) {
    return (
      <div className="absolute inset-0 bg-black/95 z-50 flex flex-col items-center justify-center overflow-hidden">
        <motion.div
          animate={{ y: [-100, 100], opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="text-6xl md:text-8xl mb-8"
        >
          🪙
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-500 text-center drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]"
        >
          PIOGGIA DI MONETE
        </motion.h2>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center p-4 backdrop-blur-md overflow-hidden">
      <div className="flex justify-between w-full max-w-md mt-4 z-20">
        <div className="flex flex-col">
          <div className="text-2xl font-black text-yellow-400">CREDITI: {score}</div>
          <div className="text-sm font-bold text-gray-300">MONETE PRESE: {caughtCount}</div>
        </div>
        <div className="text-2xl font-black text-red-500">TEMPO: {timeLeft}s</div>
      </div>

      <AnimatePresence>
        {!gameOver && coins.map(coin => (
          <motion.div
            key={coin.id}
            onMouseDown={() => catchCoin(coin.id, coin.value)}
            onTouchStart={(e) => { e.preventDefault(); catchCoin(coin.id, coin.value); }}
            initial={{ y: -100, opacity: 1 }}
            animate={{ y: window.innerHeight + 100 }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{ duration: coin.speed, ease: "linear" }}
            className={`absolute cursor-pointer text-5xl md:text-6xl drop-shadow-[0_0_15px_rgba(250,204,21,0.8)] ${coin.value > 10 ? 'animate-pulse' : ''}`}
            style={{ left: `${coin.x}%` }}
          >
            {coin.value > 10 ? '💰' : '🪙'}
          </motion.div>
        ))}
      </AnimatePresence>

      {gameOver && (
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-30"
        >
          <div className="text-5xl md:text-6xl font-black text-green-400 drop-shadow-[0_0_20px_rgba(74,222,128,0.8)]">
            FINE!
          </div>
          <div className="text-3xl md:text-4xl font-bold text-yellow-400 mt-4">
            HAI RACCOLTO {score}
          </div>
          <div className="text-xl font-bold text-white mt-2">
            ({caughtCount} monete)
          </div>
        </motion.div>
      )}
    </div>
  );
};

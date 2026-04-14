import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { playWheelSpinMelody, playWheelWin, playWheelLose } from '../engine/soundEngine';

export const MiniGameWheel = ({ onComplete }: { onComplete: (premio: number) => void }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [premio, setPremio] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  
  const premi = [10, 0, 100, 200, 0, 1000];
  const colors = ['#FFD700', '#333333', '#DC143C', '#1E90FF', '#333333', '#FF8C00'];
  const sliceAngle = 360 / premi.length;

  const gira = () => {
    setIsSpinning(true);
    playWheelSpinMelody();
    
    const winningIndex = Math.floor(Math.random() * premi.length);
    const vinto = premi[winningIndex];
    
    // Calculate rotation to land the winning slice at the top (0 degrees)
    const extraSpins = 360 * 5;
    const offset = (Math.random() * (sliceAngle - 10)) - ((sliceAngle - 10) / 2);
    const targetRotation = extraSpins - (winningIndex * sliceAngle) + offset;

    setRotation(targetRotation);

    setTimeout(() => {
      setPremio(vinto);
      setIsSpinning(false);
      if (vinto > 0) {
        playWheelWin();
      } else {
        playWheelLose();
      }
      setTimeout(() => onComplete(vinto), 3000);
    }, 4000);
  };

  const gradientStops = premi.map((_, i) => {
    const start = i * sliceAngle;
    const end = (i + 1) * sliceAngle;
    return `${colors[i]} ${start}deg ${end}deg`;
  }).join(', ');

  return (
    <div className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center justify-center text-white p-4 backdrop-blur-md">
      <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600 mb-12 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">RUOTA BONUS</h2>
      
      <div className="relative w-72 h-72 md:w-96 md:h-96 mb-8">
        {/* Freccia indicatore */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-white z-20 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
        
        <motion.div 
          className="w-full h-full rounded-full border-8 border-yellow-500 shadow-[0_0_30px_rgba(250,204,21,0.6)] relative overflow-hidden"
          style={{ background: `conic-gradient(from -${sliceAngle/2}deg, ${gradientStops})` }}
          animate={{ rotate: rotation }}
          transition={{ duration: 4, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {premi.map((p, i) => (
            <div 
              key={i} 
              className="absolute inset-0 flex justify-center"
              style={{ transform: `rotate(${i * sliceAngle}deg)` }}
            >
              <span className="text-2xl md:text-3xl font-black mt-4 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                {p === 0 ? '❌' : p}
              </span>
            </div>
          ))}
          {/* Centro ruota */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-yellow-600 rounded-full border-4 border-yellow-300 shadow-inner z-10"></div>
        </motion.div>
      </div>
      
      {premio !== null ? (
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`text-4xl md:text-5xl font-black drop-shadow-[0_0_20px_rgba(74,222,128,0.8)] ${premio > 0 ? 'text-green-400' : 'text-red-500'}`}
        >
          {premio > 0 ? `HAI VINTO ${premio}!` : 'RITENTA!'}
        </motion.div>
      ) : (
        <button 
          onClick={gira} 
          disabled={isSpinning}
          className="bg-gradient-to-b from-yellow-300 to-yellow-600 text-black px-10 py-4 rounded-full font-black text-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(250,204,21,0.4)]"
        >
          {isSpinning ? 'GIRANDO...' : 'GIRA LA RUOTA'}
        </button>
      )}
    </div>
  );
};

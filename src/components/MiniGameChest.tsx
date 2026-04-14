import { useState } from 'react';
import { motion } from 'motion/react';

export const MiniGameChest = ({ onComplete }: { onComplete: (premio: number) => void }) => {
  const [aperto, setAperto] = useState(false);
  const [premio, setPremio] = useState<number | null>(null);

  const apri = () => {
    if (aperto) return;
    setAperto(true);
    const vinto = [0, 50, 100, 500][Math.floor(Math.random() * 4)];
    setPremio(vinto);
    setTimeout(() => onComplete(vinto), 2000);
  };

  return (
    <div className="absolute inset-0 bg-black/95 z-50 flex flex-col items-center justify-center text-white p-4">
      <h2 className="text-4xl font-black text-yellow-400 mb-8">APRI IL FORZIERE</h2>
      
      <motion.div 
        onClick={apri}
        className="text-8xl cursor-pointer"
        animate={aperto ? { scale: 1.2, rotate: [0, -10, 10, 0] } : { scale: 1 }}
        whileHover={{ scale: 1.1 }}
      >
        {aperto ? '💎' : '📦'}
      </motion.div>

      {aperto && premio !== null && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-3xl font-bold text-green-400"
        >
          {premio > 0 ? `HAI TROVATO ${premio} CREDITI!` : 'FORZIERE VUOTO!'}
        </motion.div>
      )}
    </div>
  );
};

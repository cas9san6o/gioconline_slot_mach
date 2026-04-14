import { motion } from 'motion/react';

export const Reel = ({ simboli, isSpinning }: { simboli: any[], isSpinning: boolean }) => {
  return (
    <div className="flex flex-col gap-1 md:gap-2 bg-black/40 p-1 md:p-2 rounded-lg overflow-hidden h-40 md:h-64 relative border-2 border-yellow-500/50 shadow-inner">
      <motion.div 
        className="flex flex-col gap-1 md:gap-2 absolute w-full left-0 px-1 md:px-2"
        animate={isSpinning ? { y: [0, -1000] } : { y: 0 }}
        transition={isSpinning ? { repeat: Infinity, duration: 0.2, ease: "linear" } : { duration: 0.5, type: "spring" }}
      >
        {isSpinning ? 
          Array(10).fill(0).map((_, i) => <div key={i} className="h-12 md:h-16 flex items-center justify-center text-3xl md:text-4xl bg-white/10 rounded border border-white/5">❓</div>) :
          simboli.map((simbolo, i) => (
            <div key={i} className="h-12 md:h-16 flex items-center justify-center text-3xl md:text-4xl bg-gradient-to-b from-white/20 to-white/5 rounded shadow-inner border border-white/10">
              {simbolo.icona.startsWith('http') ? (
                <img src={simbolo.icona} alt={simbolo.nome} className="w-10 h-10 md:w-12 md:h-12 object-contain" referrerPolicy="no-referrer" />
              ) : (
                simbolo.icona
              )}
            </div>
          ))
        }
      </motion.div>
    </div>
  );
};

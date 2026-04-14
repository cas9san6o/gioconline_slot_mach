import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { simboliConfig } from '../config/simboliConfig';
import { playButtonSound } from '../engine/soundEngine';

export const LegendPanel = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-40">
      <button 
        onClick={() => { playButtonSound(); setIsOpen(!isOpen); }}
        className="bg-black/80 border-2 border-yellow-500 text-yellow-400 font-bold py-2 px-4 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)] hover:bg-black hover:scale-105 transition-all text-sm flex items-center gap-2 backdrop-blur-md"
      >
        <span>ℹ️</span> LEGENDA PREMI
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-12 left-0 w-72 md:w-80 bg-black/90 border-2 border-yellow-500 rounded-xl p-4 shadow-[0_0_20px_rgba(250,204,21,0.3)] backdrop-blur-md origin-bottom-left"
          >
            <div className="flex justify-between items-center mb-3 border-b border-gray-700 pb-2">
              <h3 className="text-yellow-400 font-bold text-lg">COMBINAZIONI VINCENTI</h3>
              <button onClick={() => { playButtonSound(); setIsOpen(false); }} className="text-gray-400 hover:text-white">&times;</button>
            </div>
            
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              <p className="text-xs text-gray-300 mb-2">Allinea 3 o più simboli uguali (da sinistra) per vincere. Il Jolly (🌟) sostituisce qualsiasi simbolo base.</p>
              
              {simboliConfig.map((simbolo, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-800/50 p-2 rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center bg-black rounded border border-gray-600">
                      {simbolo.icona.startsWith('http') ? <img src={simbolo.icona} alt={simbolo.nome} className="w-6 h-6 object-contain" referrerPolicy="no-referrer" /> : simbolo.icona}
                    </div>
                    <span className="text-white text-sm font-bold">{simbolo.nome}</span>
                  </div>
                  <div className="text-right">
                    {simbolo.isBonus ? (
                      <span className="text-purple-400 text-xs font-bold block">3x = MINIGIOCO</span>
                    ) : simbolo.isScatter ? (
                      <span className="text-blue-400 text-xs font-bold block">Paga in ogni pos.</span>
                    ) : (
                      <>
                        <span className="text-green-400 text-xs font-bold block">3x = {simbolo.valoreBase}x puntata</span>
                        <span className="text-green-500 text-xs font-bold block">4x = {simbolo.valoreBase * 2}x puntata</span>
                        <span className="text-green-600 text-xs font-bold block">5x = {simbolo.valoreBase * 3}x puntata</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

import { useState, useRef, useEffect } from 'react';
import { formattaValuta } from '../utils/helpers';

export const WalletPanel = ({ crediti, puntata, setPuntata, ultimaVincita, jackpot }: any) => {
  const [showPresets, setShowPresets] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(puntata.toString());
  const inputRef = useRef<HTMLInputElement>(null);
  const presets = [1, 5, 10, 20, 50, 100, 200, 500, 1000];

  useEffect(() => {
    if (!isEditing) {
      setInputValue(puntata.toString());
    }
  }, [puntata, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const val = parseInt(inputValue, 10);
    if (!isNaN(val) && val > 0) {
      setPuntata(val);
    } else {
      setInputValue(puntata.toString());
    }
    // Delay hiding presets to allow clicking them
    setTimeout(() => {
      setIsEditing(false);
      setShowPresets(false);
    }, 200);
  };

  const handleInputFocus = () => {
    setIsEditing(true);
    setShowPresets(true);
  };

  return (
    <div className="grid grid-cols-2 lg:flex lg:justify-between items-center bg-black/60 backdrop-blur-md text-white p-3 md:p-4 rounded-xl border border-yellow-500/30 shadow-[0_0_15px_rgba(250,204,21,0.15)] gap-3 md:gap-4 relative">
      <div className="text-center">
        <div className="text-[10px] md:text-xs text-gray-300 font-bold tracking-wider">CREDITI</div>
        <div className="text-base md:text-xl font-black text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]">{formattaValuta(crediti)}</div>
      </div>
      <div className="text-center relative">
        <div className="text-[10px] md:text-xs text-gray-300 font-bold tracking-wider">PUNTATA</div>
        <div className="flex items-center justify-center gap-1 md:gap-2">
          <button onClick={() => setPuntata(Math.max(1, puntata - 1))} className="bg-gray-800/80 px-2 rounded hover:bg-gray-700 border border-gray-600">-</button>
          
          <div className="relative flex items-center justify-center min-w-[60px]">
            {isEditing ? (
              <input
                ref={inputRef}
                type="number"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onFocus={handleInputFocus}
                autoFocus
                className="w-16 bg-gray-800 text-center text-sm md:text-lg font-bold text-white outline-none rounded border border-yellow-500"
              />
            ) : (
              <span 
                className="text-sm md:text-lg font-bold cursor-pointer hover:text-yellow-300 transition-colors"
                onClick={handleInputFocus}
              >
                {formattaValuta(puntata)}
              </span>
            )}
          </div>

          <button onClick={() => setPuntata(puntata + 1)} className="bg-gray-800/80 px-2 rounded hover:bg-gray-700 border border-gray-600">+</button>
        </div>
        
        {showPresets && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-gray-900 border border-yellow-500/50 rounded-lg p-3 grid grid-cols-3 gap-3 z-50 shadow-2xl w-48 md:w-64">
            {presets.map(p => (
              <button 
                key={p}
                onMouseDown={() => { setPuntata(p); setIsEditing(false); setShowPresets(false); }}
                className="bg-gray-800 hover:bg-yellow-600 text-white text-sm md:text-base font-bold py-2 px-2 rounded border border-gray-600 hover:border-yellow-400 transition-colors flex items-center justify-center"
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="text-center">
        <div className="text-[10px] md:text-xs text-gray-300 font-bold tracking-wider">ULTIMA VINCITA</div>
        <div className="text-base md:text-xl font-black text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">{formattaValuta(ultimaVincita)}</div>
      </div>
      <div className="text-center">
        <div className="text-[10px] md:text-xs text-yellow-500 font-black animate-pulse tracking-widest">JACKPOT</div>
        <div className="text-lg md:text-2xl font-black text-yellow-300 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]">{formattaValuta(jackpot)}</div>
      </div>
    </div>
  );
};

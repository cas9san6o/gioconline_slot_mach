export const ControlPanel = ({ gira, isSpinning, colorePulsanti = "from-yellow-300 to-yellow-600" }: { gira: () => void, isSpinning: boolean, colorePulsanti?: string }) => {
  return (
    <div className="flex justify-center">
      <button 
        onClick={gira} 
        disabled={isSpinning}
        className={`w-24 h-24 md:w-32 md:h-32 rounded-full font-black text-2xl md:text-3xl border-4 md:border-8 shadow-[0_0_20px_rgba(250,204,21,0.5)] transition-all ${isSpinning ? 'bg-gray-600 border-gray-800 text-gray-400' : `bg-gradient-to-b ${colorePulsanti} border-yellow-700 text-black hover:scale-105 active:scale-95`}`}
      >
        {isSpinning ? '...' : 'GIRA'}
      </button>
    </div>
  );
};

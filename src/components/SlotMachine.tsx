import { Reel } from './Reel';

export const SlotMachine = ({ griglia, isSpinning }: { griglia: any[][], isSpinning: boolean }) => {
  const rulli = Array(5).fill(0).map((_, colIndex) => griglia.map(riga => riga[colIndex]));

  return (
    <div className="grid grid-cols-5 gap-1 md:gap-2 bg-black/60 backdrop-blur-md p-2 md:p-4 rounded-2xl border-4 border-yellow-500 shadow-[0_0_30px_rgba(250,204,21,0.3)]">
      {rulli.map((rullo, i) => (
        <Reel key={i} simboli={rullo} isSpinning={isSpinning} />
      ))}
    </div>
  );
};

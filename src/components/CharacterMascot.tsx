import { motion } from 'motion/react';
import { personaggiConfig } from '../config/personaggiConfig';

export const CharacterMascot = ({ stato, personaggioId }: { stato: 'idle' | 'vittoria' | 'sconfitta' | 'spin' | 'jackpot', personaggioId: string }) => {
  const personaggio = personaggiConfig.find(p => p.id === personaggioId) || personaggiConfig[0];

  const getAnimation = () => {
    return personaggio.animazioni[stato] || personaggio.animazioni.idle;
  };

  return (
    <motion.div animate={getAnimation()} className="text-6xl drop-shadow-lg origin-bottom flex items-center justify-center">
      {personaggio.emoji.startsWith('http') ? (
        <img src={personaggio.emoji} alt={personaggio.nome} className="w-16 h-16 object-contain" referrerPolicy="no-referrer" />
      ) : (
        personaggio.emoji
      )}
    </motion.div>
  );
};

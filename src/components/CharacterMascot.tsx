import { motion } from 'motion/react';
import { personaggiConfig } from '../config/personaggiConfig';

export const CharacterMascot = ({ stato, personaggioId }: { stato: 'idle' | 'vittoria' | 'sconfitta' | 'spin' | 'jackpot', personaggioId: string }) => {
  const personaggio = personaggiConfig.find(p => p.id === personaggioId) || personaggiConfig[0];

  const getAnimation = () => {
    return personaggio.animazioni[stato] || personaggio.animazioni.idle;
  };

  return (
    <motion.div animate={getAnimation()} className="text-6xl drop-shadow-lg origin-bottom">
      {personaggio.emoji}
    </motion.div>
  );
};

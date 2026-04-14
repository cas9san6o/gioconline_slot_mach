import { probabilitaConfig } from '../config/probabilitaConfig';

export const determinaEsito = (forzatura?: string) => {
  if (forzatura) return forzatura;

  const rand = Math.random();
  if (rand < probabilitaConfig.probabilitaJackpot) return 'jackpot';
  if (rand < probabilitaConfig.probabilitaJackpot + probabilitaConfig.probabilitaMiniGioco) return 'minigioco';
  if (rand < probabilitaConfig.probabilitaJackpot + probabilitaConfig.probabilitaMiniGioco + probabilitaConfig.probabilitaBaseVittoria) return 'vittoria';
  
  return 'sconfitta';
};

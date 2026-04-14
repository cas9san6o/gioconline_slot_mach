import { getRandomElement } from '../utils/randomizer';

export const giocaRuotaBonus = () => {
  const premi = [10, 20, 50, 100, 500, 1000];
  return getRandomElement(premi);
};

export const giocaForziere = () => {
  const premi = [0, 50, 200];
  return getRandomElement(premi);
};

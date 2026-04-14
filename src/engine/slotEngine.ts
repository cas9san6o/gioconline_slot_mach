import { simboliConfig } from '../config/simboliConfig';
import { getRandomElement } from '../utils/randomizer';

export const generaGriglia = (righe: number, colonne: number, esito: string) => {
  const griglia: any[][] = [];
  
  for (let r = 0; r < righe; r++) {
    const riga = [];
    for (let c = 0; c < colonne; c++) {
      riga.push(getRandomElement(simboliConfig));
    }
    griglia.push(riga);
  }

  if (esito === 'vittoria' || esito === 'jackpot') {
    const simboloVincente = esito === 'jackpot' ? simboliConfig.find(s => s.id === '7') || simboliConfig[0] : getRandomElement(simboliConfig);
    for (let c = 0; c < colonne; c++) {
      griglia[1][c] = simboloVincente;
    }
  } else if (esito === 'quasi_vincita') {
    const simboloVincente = getRandomElement(simboliConfig);
    for (let c = 0; c < colonne - 1; c++) {
      griglia[1][c] = simboloVincente;
    }
    griglia[1][colonne - 1] = simboliConfig.find(s => s.id !== simboloVincente.id) || simboliConfig[1];
  } else if (esito.startsWith('minigioco')) {
     const simboloBonus = simboliConfig.find(s => s.isBonus) || simboliConfig[0];
     griglia[1][0] = simboloBonus;
     griglia[1][2] = simboloBonus;
     griglia[1][4] = simboloBonus;
  }

  return griglia;
};

export const calcolaVincita = (griglia: any[][], puntata: number) => {
  let vincita = 0;
  let lineeVincenti = 0;

  for (let r = 0; r < griglia.length; r++) {
    const primoSimbolo = griglia[r][0];
    let count = 1;
    for (let c = 1; c < griglia[r].length; c++) {
      if (griglia[r][c].id === primoSimbolo.id || griglia[r][c].isWild) {
        count++;
      } else {
        break;
      }
    }
    if (count >= 3) {
      vincita += primoSimbolo.valoreBase * puntata * (count - 2);
      lineeVincenti++;
    }
  }

  return { vincita, lineeVincenti };
};

import { useState, useCallback } from 'react';
import { generaGriglia, calcolaVincita } from '../engine/slotEngine';
import { determinaEsito } from '../engine/probabilityEngine';
import { getJackpot, incrementaJackpot, resetJackpot } from '../engine/rewardEngine';
import { playSpinSound, playWinSound, playJackpotSound, playLoseSound } from '../engine/soundEngine';

export const useSlotLogic = () => {
  const [griglia, setGriglia] = useState<any[][]>(generaGriglia(3, 5, 'sconfitta'));
  const [isSpinning, setIsSpinning] = useState(false);
  const [crediti, setCrediti] = useState(1000);
  const [puntata, setPuntata] = useState(10);
  const [ultimaVincita, setUltimaVincita] = useState(0);
  const [jackpot, setJackpot] = useState(getJackpot());
  const [stats, setStats] = useState({ spin: 0, vittorie: 0, jackpots: 0, totaleVinto: 0, totalePuntato: 0 });
  const [forzatura, setForzatura] = useState<string | undefined>();
  const [minigiocoAttivo, setMinigiocoAttivo] = useState<string | null>(null);
  const [statoPersonaggio, setStatoPersonaggio] = useState<'idle' | 'vittoria' | 'sconfitta' | 'spin' | 'jackpot'>('idle');
  const [spinMessage, setSpinMessage] = useState<string | null>(null);

  const encouragingMessages = [
    "DAI CHE VINCI!",
    "FORZA!",
    "QUASI CI SIAMO...",
    "GIRA GIRA GIRA!",
    "SENTO PROFUMO DI JACKPOT!",
    "INCROCIA LE DITA!",
    "BUONA FORTUNA!"
  ];

  const gira = useCallback(async () => {
    if (isSpinning || crediti < puntata) return;
    
    setIsSpinning(true);
    setStatoPersonaggio('spin');
    
    // Mostra un messaggio incoraggiante casuale
    if (Math.random() > 0.5) {
      setSpinMessage(encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)]);
    } else {
      setSpinMessage(null);
    }

    playSpinSound();
    
    setCrediti(c => c - puntata);
    setJackpot(incrementaJackpot());
    
    const esito = determinaEsito(forzatura);
    setForzatura(undefined);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const nuovaGriglia = generaGriglia(3, 5, esito);
    setGriglia(nuovaGriglia);
    setSpinMessage(null);

    let vincita = 0;
    let isJackpot = false;

    if (esito === 'jackpot') {
      vincita = jackpot;
      isJackpot = true;
      setJackpot(resetJackpot());
      playJackpotSound();
      setStatoPersonaggio('jackpot');
    } else if (esito.startsWith('minigioco')) {
      let gameToPlay = 'ruota';
      if (esito === 'minigioco_scratch') gameToPlay = 'scratch';
      else if (esito === 'minigioco_find_symbol') gameToPlay = 'find_symbol';
      else if (esito === 'minigioco_pick_box') gameToPlay = 'pick_box';
      else if (esito === 'minigioco_falling_coins') gameToPlay = 'falling_coins';
      else if (esito === 'minigioco_jackpot_door') gameToPlay = 'jackpot_door';
      else if (esito === 'minigioco') {
        const minigames = ['ruota', 'scratch', 'find_symbol', 'pick_box', 'falling_coins', 'jackpot_door'];
        gameToPlay = minigames[Math.floor(Math.random() * minigames.length)];
      }
      setMinigiocoAttivo(gameToPlay);
      setStatoPersonaggio('idle');
    } else {
      const risultato = calcolaVincita(nuovaGriglia, puntata);
      vincita = risultato.vincita;
      if (vincita > 0) {
        playWinSound();
        setStatoPersonaggio('vittoria');
      } else {
        playLoseSound();
        setStatoPersonaggio('sconfitta');
      }
    }

    setUltimaVincita(vincita);
    setCrediti(c => c + vincita);

    setStats(s => ({
      spin: s.spin + 1,
      vittorie: s.vittorie + (vincita > 0 ? 1 : 0),
      jackpots: s.jackpots + (isJackpot ? 1 : 0),
      totaleVinto: s.totaleVinto + vincita,
      totalePuntato: s.totalePuntato + puntata
    }));

    setIsSpinning(false);
    
    if (esito !== 'minigioco') {
        setTimeout(() => setStatoPersonaggio('idle'), 3000);
    }
  }, [isSpinning, crediti, puntata, jackpot, forzatura]);

  const simulaSpin = useCallback((numeroSpin: number) => {
    let creditiSimulati = crediti;
    let jackpotSimulato = jackpot;
    let statsSimulate = { ...stats };

    for (let i = 0; i < numeroSpin; i++) {
        creditiSimulati -= puntata;
        jackpotSimulato += 10;
        const esito = determinaEsito();
        const grigliaTemp = generaGriglia(3, 5, esito);
        
        let vincita = 0;
        if (esito === 'jackpot') {
            vincita = jackpotSimulato;
            jackpotSimulato = 10000;
        } else if (esito !== 'minigioco') {
            vincita = calcolaVincita(grigliaTemp, puntata).vincita;
        }

        creditiSimulati += vincita;
        statsSimulate.spin++;
        if (vincita > 0) statsSimulate.vittorie++;
        if (esito === 'jackpot') statsSimulate.jackpots++;
        statsSimulate.totaleVinto += vincita;
        statsSimulate.totalePuntato += puntata;
    }

    setCrediti(creditiSimulati);
    setJackpot(jackpotSimulato);
    setStats(statsSimulate);
  }, [crediti, puntata, jackpot, stats]);

  return {
    griglia, isSpinning, crediti, setCrediti, puntata, setPuntata, ultimaVincita, jackpot, stats,
    gira, setForzatura, simulaSpin, minigiocoAttivo, setMinigiocoAttivo, statoPersonaggio, spinMessage
  };
};

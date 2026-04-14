import { useState } from 'react';
import { useSlotLogic } from '../hooks/useSlotLogic';
import { SlotMachine } from '../components/SlotMachine';
import { WalletPanel } from '../components/WalletPanel';
import { ControlPanel } from '../components/ControlPanel';
import { CharacterMascot } from '../components/CharacterMascot';
import { StatisticsPanel } from '../components/StatisticsPanel';
import { MiniGameWheel } from '../components/MiniGameWheel';
import { ScratchGame } from '../components/ScratchGame';
import { FindSymbolGame } from '../components/FindSymbolGame';
import { PickBonusBoxGame } from '../components/PickBonusBoxGame';
import { FallingCoinsGame } from '../components/FallingCoinsGame';
import { JackpotDoorGame } from '../components/JackpotDoorGame';
import { LuxuryIntro } from '../components/LuxuryIntro';
import { RandomEvents } from '../components/RandomEvents';
import { playButtonSound } from '../engine/soundEngine';
import { temaConfig } from '../config/temaConfig';

export const DashboardAdmin = () => {
  const { 
    griglia, isSpinning, crediti, setCrediti, puntata, setPuntata, 
    ultimaVincita, jackpot, stats, gira, setForzatura, simulaSpin,
    minigiocoAttivo, setMinigiocoAttivo, statoPersonaggio, spinMessage
  } = useSlotLogic();

  const [personaggio, setPersonaggio] = useState('volpe');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [sfondo, setSfondo] = useState(temaConfig.sfondo);
  const [sfondoImmagine, setSfondoImmagine] = useState(temaConfig.sfondoImmagine);
  const [font, setFont] = useState(temaConfig.fontPrincipale);
  const [nomeSlot, setNomeSlot] = useState(temaConfig.nomeSlot);
  const [coloreTitolo, setColoreTitolo] = useState(temaConfig.coloreTitolo);
  const [coloreBordi, setColoreBordi] = useState(temaConfig.coloreBordi);
  const [colorePulsanti, setColorePulsanti] = useState(temaConfig.colorePulsanti);
  
  const [showIntro, setShowIntro] = useState(true);
  const [showMinigameIntro, setShowMinigameIntro] = useState(false);

  const handleMinigameTrigger = () => {
    setShowMinigameIntro(true);
  };

  if (minigiocoAttivo && !showMinigameIntro && !minigiocoAttivo.startsWith('playing_')) {
      handleMinigameTrigger();
      setMinigiocoAttivo(`playing_${minigiocoAttivo}`);
  }

  const handleMinigameComplete = (premio: number) => {
    setCrediti(c => c + premio);
    setMinigiocoAttivo(null);
  };

  return (
    <div 
      className={`min-h-screen ${sfondo} ${font} p-2 md:p-4 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4 transition-colors duration-500 bg-cover bg-center bg-no-repeat bg-fixed relative overflow-hidden`}
      style={{ backgroundImage: `url(${sfondoImmagine})` }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-0"></div>

      <RandomEvents isSpinning={isSpinning} />

      {showIntro && <LuxuryIntro onComplete={() => setShowIntro(false)} />}
      {showMinigameIntro && <LuxuryIntro text="MINIGIOCO SBLOCCATO!" onComplete={() => setShowMinigameIntro(false)} />}

      {/* Colonna Slot (Mobile First) */}
      <div className="w-full max-w-md lg:max-w-3xl flex flex-col gap-3 md:gap-4 relative z-10">
        <div className="flex justify-between items-center px-2 md:px-4">
          <CharacterMascot stato={statoPersonaggio} personaggioId={personaggio} />
          <h1 className={`text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b ${coloreTitolo} italic drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] text-center tracking-wider`}>
            {nomeSlot}
          </h1>
        </div>
        
        <WalletPanel crediti={crediti} puntata={puntata} setPuntata={(p: number) => { playButtonSound(); setPuntata(p); }} ultimaVincita={ultimaVincita} jackpot={jackpot} />
        
        <div className={`border-4 ${coloreBordi} rounded-2xl relative`}>
          {spinMessage && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-full text-center z-20">
              <span className="bg-black/80 text-yellow-400 font-black px-4 py-2 rounded-full border-2 border-yellow-500 shadow-[0_0_15px_rgba(250,204,21,0.5)] animate-bounce inline-block">
                {spinMessage}
              </span>
            </div>
          )}
          <SlotMachine griglia={griglia} isSpinning={isSpinning} />
        </div>
        
        <ControlPanel gira={gira} isSpinning={isSpinning} colorePulsanti={colorePulsanti} />

        {minigiocoAttivo === 'playing_ruota' && !showMinigameIntro && <MiniGameWheel onComplete={handleMinigameComplete} />}
        {minigiocoAttivo === 'playing_scratch' && !showMinigameIntro && <ScratchGame onComplete={handleMinigameComplete} />}
        {minigiocoAttivo === 'playing_find_symbol' && !showMinigameIntro && <FindSymbolGame onComplete={handleMinigameComplete} />}
        {minigiocoAttivo === 'playing_pick_box' && !showMinigameIntro && <PickBonusBoxGame onComplete={handleMinigameComplete} />}
        {minigiocoAttivo === 'playing_falling_coins' && !showMinigameIntro && <FallingCoinsGame onComplete={handleMinigameComplete} />}
        {minigiocoAttivo === 'playing_jackpot_door' && !showMinigameIntro && <JackpotDoorGame onComplete={handleMinigameComplete} />}

        <button 
          onClick={() => { playButtonSound(); setShowAdminPanel(!showAdminPanel); }}
          className="fixed bottom-4 right-4 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold py-2 px-4 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.8)] opacity-80 hover:opacity-100 hover:scale-105 transition-all z-50 text-sm md:text-base border-2 border-red-400"
        >
          CHEAT
        </button>
      </div>

      {/* Colonna Admin Panel */}
      {showAdminPanel && (
        <div className="w-full max-w-md lg:w-96 bg-gray-900/90 backdrop-blur-md p-4 rounded-xl border-2 border-gray-600 flex flex-col gap-4 overflow-y-auto max-h-[60vh] lg:max-h-[90vh] z-40 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          <h2 className="text-xl font-bold text-white border-b border-gray-600 pb-2">PANNELLO AMMINISTRATORE</h2>
          
          <div className="space-y-2">
            <h3 className="text-sm text-gray-400 font-bold">FORZATURE ESITO</h3>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => { playButtonSound(); setForzatura('vittoria'); }} className="bg-green-700 hover:bg-green-600 text-white text-xs py-2 rounded">Forza Vittoria</button>
              <button onClick={() => { playButtonSound(); setForzatura('jackpot'); }} className="bg-yellow-600 hover:bg-yellow-500 text-white text-xs py-2 rounded">Forza Jackpot</button>
              <button onClick={() => { playButtonSound(); setForzatura('quasi_vincita'); }} className="bg-blue-700 hover:bg-blue-600 text-white text-xs py-2 rounded">Forza Quasi Vincita</button>
              <button onClick={() => { playButtonSound(); setForzatura('minigioco'); }} className="bg-purple-700 hover:bg-purple-600 text-white text-xs py-2 rounded">Forza Minigioco (Random)</button>
            </div>
            
            <h3 className="text-sm text-gray-400 font-bold mt-2">FORZA MINIGIOCO SPECIFICO</h3>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => { playButtonSound(); setForzatura('minigioco_ruota'); }} className="bg-purple-800 hover:bg-purple-700 text-white text-xs py-2 rounded border border-purple-500">Ruota</button>
              <button onClick={() => { playButtonSound(); setForzatura('minigioco_scratch'); }} className="bg-purple-800 hover:bg-purple-700 text-white text-xs py-2 rounded border border-purple-500">Gratta e Vinci</button>
              <button onClick={() => { playButtonSound(); setForzatura('minigioco_find_symbol'); }} className="bg-purple-800 hover:bg-purple-700 text-white text-xs py-2 rounded border border-purple-500">Trova Simbolo</button>
              <button onClick={() => { playButtonSound(); setForzatura('minigioco_pick_box'); }} className="bg-purple-800 hover:bg-purple-700 text-white text-xs py-2 rounded border border-purple-500">Scegli Forziere</button>
              <button onClick={() => { playButtonSound(); setForzatura('minigioco_falling_coins'); }} className="bg-purple-800 hover:bg-purple-700 text-white text-xs py-2 rounded border border-purple-500">Pioggia Monete</button>
              <button onClick={() => { playButtonSound(); setForzatura('minigioco_jackpot_door'); }} className="bg-purple-800 hover:bg-purple-700 text-white text-xs py-2 rounded border border-purple-500">Porta Jackpot</button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm text-gray-400 font-bold">SIMULAZIONI</h3>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => { playButtonSound(); simulaSpin(100); }} className="bg-gray-700 hover:bg-gray-600 text-white text-xs py-2 rounded">Simula 100 Spin</button>
              <button onClick={() => { playButtonSound(); simulaSpin(1000); }} className="bg-gray-700 hover:bg-gray-600 text-white text-xs py-2 rounded">Simula 1000 Spin</button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm text-gray-400 font-bold">CONTROLLI AMBIENTE</h3>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => { playButtonSound(); setCrediti(10000); }} className="bg-red-900 hover:bg-red-800 text-white text-xs py-2 rounded">Reset Crediti (10k)</button>
              <select 
                value={personaggio} 
                onChange={(e) => { playButtonSound(); setPersonaggio(e.target.value); }}
                className="bg-gray-700 text-white text-xs py-2 px-1 rounded"
              >
                <option value="volpe">Volpe</option>
                <option value="coniglio">Coniglio</option>
                <option value="moneta">Moneta</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm text-gray-400 font-bold">PERSONALIZZAZIONE TEMA</h3>
            <div className="grid grid-cols-1 gap-2">
              <input 
                type="text" 
                placeholder="Nome Slot Machine" 
                value={nomeSlot}
                onChange={(e) => setNomeSlot(e.target.value)}
                className="bg-gray-700 text-white text-xs py-2 px-2 rounded border border-gray-600 focus:border-yellow-500 outline-none"
              />
              <input 
                type="text" 
                placeholder="URL Immagine di sfondo" 
                value={sfondoImmagine}
                onChange={(e) => setSfondoImmagine(e.target.value)}
                className="bg-gray-700 text-white text-xs py-2 px-2 rounded border border-gray-600 focus:border-yellow-500 outline-none"
              />
              <select 
                value={coloreTitolo} 
                onChange={(e) => { playButtonSound(); setColoreTitolo(e.target.value); }}
                className="bg-gray-700 text-white text-xs py-2 px-2 rounded"
              >
                <option value="from-yellow-200 to-yellow-600">Titolo: Oro</option>
                <option value="from-purple-300 to-purple-600">Titolo: Viola</option>
                <option value="from-blue-300 to-blue-600">Titolo: Blu</option>
                <option value="from-green-300 to-green-600">Titolo: Verde</option>
                <option value="from-red-300 to-red-600">Titolo: Rosso</option>
              </select>
              <select 
                value={coloreBordi} 
                onChange={(e) => { playButtonSound(); setColoreBordi(e.target.value); }}
                className="bg-gray-700 text-white text-xs py-2 px-2 rounded"
              >
                <option value="border-yellow-500">Bordi: Oro</option>
                <option value="border-purple-500">Bordi: Viola</option>
                <option value="border-blue-500">Bordi: Blu</option>
                <option value="border-green-500">Bordi: Verde</option>
                <option value="border-red-500">Bordi: Rosso</option>
              </select>
              <select 
                value={colorePulsanti} 
                onChange={(e) => { playButtonSound(); setColorePulsanti(e.target.value); }}
                className="bg-gray-700 text-white text-xs py-2 px-2 rounded"
              >
                <option value="from-yellow-300 to-yellow-600">Pulsanti: Oro</option>
                <option value="from-purple-400 to-purple-700">Pulsanti: Viola</option>
                <option value="from-blue-400 to-blue-700">Pulsanti: Blu</option>
                <option value="from-green-400 to-green-700">Pulsanti: Verde</option>
                <option value="from-red-400 to-red-700">Pulsanti: Rosso</option>
              </select>
              <select 
                value={font} 
                onChange={(e) => { playButtonSound(); setFont(e.target.value); }}
                className="bg-gray-700 text-white text-xs py-2 px-2 rounded"
              >
                <option value="font-sans">Sans-Serif (Moderno)</option>
                <option value="font-serif">Serif (Elegante)</option>
                <option value="font-mono">Monospace (Terminale)</option>
              </select>
            </div>
          </div>

          <StatisticsPanel stats={stats} />
        </div>
      )}
    </div>
  );
};

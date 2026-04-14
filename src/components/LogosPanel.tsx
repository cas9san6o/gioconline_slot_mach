import { useState } from 'react';
import { simboliConfig } from '../config/simboliConfig';
import { personaggiConfig } from '../config/personaggiConfig';
import { playButtonSound } from '../engine/soundEngine';

export const LogosPanel = ({ onClose, onUpdate }: { onClose: () => void, onUpdate: () => void }) => {
  const [simboli, setSimboli] = useState([...simboliConfig]);
  const [personaggi, setPersonaggi] = useState([...personaggiConfig]);

  const handleSimboloChange = (index: number, field: string, value: string) => {
    const newSimboli = [...simboli];
    newSimboli[index] = { ...newSimboli[index], [field]: value };
    setSimboli(newSimboli);
  };

  const handlePersonaggioChange = (index: number, field: string, value: string) => {
    const newPersonaggi = [...personaggi];
    newPersonaggi[index] = { ...newPersonaggi[index], [field]: value };
    setPersonaggi(newPersonaggi);
  };

  const handleSave = () => {
    playButtonSound();
    // Mutate the original arrays
    simboli.forEach((s, i) => {
      simboliConfig[i].nome = s.nome;
      simboliConfig[i].icona = s.icona;
    });
    personaggi.forEach((p, i) => {
      personaggiConfig[i].nome = p.nome;
      personaggiConfig[i].emoji = p.emoji;
    });
    onUpdate();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-gray-900 border-2 border-yellow-500 rounded-xl p-4 md:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_0_30px_rgba(250,204,21,0.3)]">
        <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-2">
          <h2 className="text-2xl font-black text-yellow-400">GESTIONE LOGHI E SIMBOLI</h2>
          <button onClick={() => { playButtonSound(); onClose(); }} className="text-gray-400 hover:text-white text-2xl font-bold">&times;</button>
        </div>

        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-bold text-white mb-3 bg-gray-800 p-2 rounded">Simboli Slot</h3>
            <div className="space-y-3">
              {simboli.map((simbolo, i) => (
                <div key={simbolo.id} className="flex flex-col md:flex-row gap-2 items-start md:items-center bg-gray-800/50 p-2 rounded">
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-black rounded border border-gray-600 text-2xl">
                    {simbolo.icona.startsWith('http') ? <img src={simbolo.icona} alt={simbolo.nome} className="w-8 h-8 object-contain" referrerPolicy="no-referrer" /> : simbolo.icona}
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                    <input 
                      type="text" 
                      value={simbolo.nome} 
                      onChange={(e) => handleSimboloChange(i, 'nome', e.target.value)}
                      placeholder="Nome Simbolo"
                      className="bg-gray-700 text-white text-sm p-2 rounded border border-gray-600 focus:border-yellow-500 outline-none w-full"
                    />
                    <input 
                      type="text" 
                      value={simbolo.icona} 
                      onChange={(e) => handleSimboloChange(i, 'icona', e.target.value)}
                      placeholder="Emoji o URL Immagine"
                      className="bg-gray-700 text-white text-sm p-2 rounded border border-gray-600 focus:border-yellow-500 outline-none w-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-white mb-3 bg-gray-800 p-2 rounded">Personaggi Mascotte</h3>
            <div className="space-y-3">
              {personaggi.map((personaggio, i) => (
                <div key={personaggio.id} className="flex flex-col md:flex-row gap-2 items-start md:items-center bg-gray-800/50 p-2 rounded">
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-black rounded border border-gray-600 text-2xl">
                    {personaggio.emoji.startsWith('http') ? <img src={personaggio.emoji} alt={personaggio.nome} className="w-8 h-8 object-contain" referrerPolicy="no-referrer" /> : personaggio.emoji}
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                    <input 
                      type="text" 
                      value={personaggio.nome} 
                      onChange={(e) => handlePersonaggioChange(i, 'nome', e.target.value)}
                      placeholder="Nome Personaggio"
                      className="bg-gray-700 text-white text-sm p-2 rounded border border-gray-600 focus:border-yellow-500 outline-none w-full"
                    />
                    <input 
                      type="text" 
                      value={personaggio.emoji} 
                      onChange={(e) => handlePersonaggioChange(i, 'emoji', e.target.value)}
                      placeholder="Emoji o URL Immagine"
                      className="bg-gray-700 text-white text-sm p-2 rounded border border-gray-600 focus:border-yellow-500 outline-none w-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={() => { playButtonSound(); onClose(); }} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-bold">Annulla</button>
          <button onClick={handleSave} className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded font-bold shadow-[0_0_10px_rgba(34,197,94,0.5)]">Salva Modifiche</button>
        </div>
      </div>
    </div>
  );
};

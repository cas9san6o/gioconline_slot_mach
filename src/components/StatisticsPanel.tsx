export const StatisticsPanel = ({ stats }: { stats: any }) => {
  const rtp = stats.totalePuntato > 0 ? ((stats.totaleVinto / stats.totalePuntato) * 100).toFixed(2) : '0.00';
  const winRate = stats.spin > 0 ? ((stats.vittorie / stats.spin) * 100).toFixed(2) : '0.00';

  return (
    <div className="bg-gray-900 p-4 rounded-lg text-xs font-mono text-green-400 border border-green-900">
      <h3 className="text-white font-bold mb-2 border-b border-gray-700 pb-1">STATISTICHE SVILUPPATORE</h3>
      <div className="grid grid-cols-2 gap-2">
        <div>Spin Totali: {stats.spin}</div>
        <div>Vittorie: {stats.vittorie} ({winRate}%)</div>
        <div>Jackpot: {stats.jackpots}</div>
        <div>Totale Puntato: {stats.totalePuntato}</div>
        <div>Totale Vinto: {stats.totaleVinto}</div>
        <div className="text-yellow-400 font-bold">RTP Simulato: {rtp}%</div>
      </div>
    </div>
  );
};

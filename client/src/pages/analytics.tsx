import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Zap, Leaf, Activity } from 'lucide-react';

const Analytics = () => {
  // Simulazione dati real-time
  const [co2Saved, setCo2Saved] = useState(1245.5);
  const [communityPower, setCommunityPower] = useState(89);
  
  // Effetto "Live Update"
  useEffect(() => {
    const interval = setInterval(() => {
      setCo2Saved(prev => prev + (Math.random() * 0.05));
      setCommunityPower(prev => Math.min(100, Math.max(80, prev + (Math.random() - 0.5))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
          Quantum Analytics
        </h1>
        <p className="text-gray-400">Analisi impatto ambientale in tempo reale.</p>
      </header>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CO2 Card - Neon Green */}
        <div className="bg-gray-900/50 border border-green-500/30 p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-green-500/5 blur-xl group-hover:bg-green-500/10 transition-all"></div>
          <div className="relative flex justify-between items-start">
            <div>
              <p className="text-green-400 text-sm font-mono mb-1">CO2 RISPARMIATA (Community)</p>
              <h3 className="text-4xl font-bold text-white drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">
                {co2Saved.toFixed(3)} <span className="text-lg text-gray-500">kg</span>
              </h3>
            </div>
            <Leaf className="text-green-500 w-8 h-8 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
          </div>
          <div className="mt-4 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 w-[75%] shadow-[0_0_10px_#22c55e] animate-pulse"></div>
          </div>
        </div>

        {/* Global Temp - Neon Red/Orange */}
        <div className="bg-gray-900/50 border border-orange-500/30 p-6 rounded-2xl relative overflow-hidden">
           <div className="absolute inset-0 bg-orange-500/5 blur-xl"></div>
           <div className="relative">
             <div className="flex justify-between items-center mb-4">
               <p className="text-orange-400 text-sm font-mono">GLOBAL TEMP ANOMALY</p>
               <Activity className="text-orange-500 w-6 h-6" />
             </div>
             <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-white">+1.45°C</span>
                <span className="text-red-400 text-xs mb-1">Critico</span>
             </div>
             <p className="text-xs text-gray-500 mt-2">Dati aggiornati da NASA GISS</p>
           </div>
        </div>

        {/* Energy Efficiency - Neon Blue */}
        <div className="bg-gray-900/50 border border-cyan-500/30 p-6 rounded-2xl relative overflow-hidden">
           <div className="absolute inset-0 bg-cyan-500/5 blur-xl"></div>
           <div className="relative">
             <div className="flex justify-between items-center mb-4">
               <p className="text-cyan-400 text-sm font-mono">EFFICIENZA NETWORK</p>
               <Zap className="text-cyan-500 w-6 h-6" />
             </div>
             <div className="text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
               {communityPower.toFixed(1)}%
             </div>
             <div className="flex gap-1 mt-3">
               {[1,2,3,4,5,6,7,8,9,10].map(i => (
                 <div key={i} className={`h-8 w-full rounded-sm ${i < communityPower/10 ? 'bg-cyan-500 shadow-[0_0_5px_#06b6d4]' : 'bg-gray-800'}`}></div>
               ))}
             </div>
           </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-xl text-white font-bold mb-6 flex items-center gap-2">
          <BarChart3 className="text-purple-500" />
          Trend Riduzione Emissioni (Ultimi 6 Mesi)
        </h3>
        <div className="h-64 flex items-end justify-between gap-4 px-4">
          {[40, 65, 45, 80, 55, 90, 70, 95].map((h, i) => (
            <div key={i} className="w-full relative group">
              <div 
                style={{ height: `${h}%` }} 
                className="bg-gradient-to-t from-purple-900 to-purple-500 rounded-t-lg transition-all duration-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.6)]"
              ></div>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-white text-xs bg-black px-2 py-1 rounded border border-gray-700 transition-opacity">
                {h * 12} Tons
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 text-gray-500 text-xs font-mono uppercase">
          <span>Gen</span><span>Feb</span><span>Mar</span><span>Apr</span><span>Mag</span><span>Giu</span><span>Lug</span><span>Ago</span>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
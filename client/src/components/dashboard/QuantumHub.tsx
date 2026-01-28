import React, { useState, useEffect } from 'react';
import { Zap, ShoppingBag, Cpu, Activity, Terminal } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useBotContext } from '@/context/bot-context'; // Importiamo il collegamento al cervello

const QuantumHub = () => {
  const { toast } = useToast();
  // Colleghiamo il cervello!
  const { status, logs, xp, credits, addCredits, addXp, isBotActive } = useBotContext();
  
  // Stato Locale per la UI (Mood, Shop)
  const [mood, setMood] = useState<'neutral' | 'happy' | 'focus' | 'party'>('neutral');
  const [level, setLevel] = useState(3);

  // Effetto: Se il bot sta lavorando (status cambia), cambia l'umore
  useEffect(() => {
    if (status.includes("Analisi") || status.includes("Ingegneria")) {
      setMood('focus');
    } else if (status.includes("Catalogato") || status.includes("Blueprint")) {
      setMood('happy');
      addCredits(10); // Guadagno automatico quando il bot lavora!
      addXp(5);
      setTimeout(() => setMood('neutral'), 3000);
    }
  }, [status]);

  const shopItems = [
    { id: 'happy', icon: '😊', name: 'Happy Mode', cost: 50, color: 'text-green-400' },
    { id: 'focus', icon: '⚡', name: 'Overclock', cost: 100, color: 'text-yellow-400' },
    { id: 'party', icon: '🎉', name: 'Party Time', cost: 200, color: 'text-purple-400' },
  ];

  const handleBuy = (item: typeof shopItems[0]) => {
    if (credits >= item.cost) {
      addCredits(-item.cost); // Usa la funzione del context
      setMood(item.id as any);
      addXp(15);
      toast({
        title: `Modulo ${item.name} Installato!`,
        description: `Upgrade completato.`,
        className: "bg-cyan-950 border-cyan-500 text-white"
      });
    } else {
      toast({ title: "Crediti Insufficienti", variant: "destructive" });
    }
  };

  const renderBotAvatar = () => {
    return (
      <div className={`
        relative w-32 h-32 md:w-44 md:h-44 rounded-full 
        flex items-center justify-center 
        transition-all duration-700 ease-in-out
        border-4 bg-black/60 backdrop-blur-md
        ${mood === 'happy' ? 'border-green-500 shadow-[0_0_50px_rgba(34,197,94,0.6)]' :
          mood === 'focus' ? 'border-yellow-500 shadow-[0_0_50px_rgba(234,179,8,0.6)]' :
          mood === 'party' ? 'border-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.6)] animate-pulse' :
          'border-cyan-500 shadow-[0_0_50px_rgba(6,182,212,0.6)]'}
      `}>
        <div className={`absolute inset-0 rounded-full opacity-20 blur-xl ${
            mood === 'happy' ? 'bg-green-400' : mood === 'focus' ? 'bg-yellow-400' : mood === 'party' ? 'bg-purple-400' : 'bg-cyan-400'
        }`}></div>

        <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="flex gap-4">
                <div className={`w-3 h-3 md:w-5 md:h-5 rounded-full transition-all duration-300 ${
                    mood === 'focus' ? 'bg-yellow-400 h-1 md:h-2 w-5 md:w-8 rounded-none' : 'bg-white'
                } ${mood === 'party' ? 'animate-bounce' : ''}`}></div>
                <div className={`w-3 h-3 md:w-5 md:h-5 rounded-full transition-all duration-300 ${
                    mood === 'focus' ? 'bg-yellow-400 h-1 md:h-2 w-5 md:w-8 rounded-none' : 'bg-white'
                } ${mood === 'party' ? 'animate-bounce delay-100' : ''}`}></div>
            </div>
            {mood === 'happy' && <div className="w-8 h-4 border-b-4 border-green-400 rounded-full"></div>}
            {mood === 'neutral' && <div className="w-6 h-1 bg-cyan-500/50 rounded-full mt-1"></div>}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full animate-in fade-in zoom-in duration-500">
      <Card className="bg-[#0f111a] border-gray-800 p-0 overflow-hidden relative shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[350px]">
          {/* SX: Avatar */}
          <div className="p-8 flex flex-col items-center justify-center border-r border-gray-800/50 bg-black/20 relative">
             <div className="absolute top-4 left-4 flex items-center gap-2 text-xs font-mono bg-black/40 px-3 py-1 rounded border border-gray-800">
               <div className={`w-2 h-2 rounded-full ${isBotActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
               <span className={isBotActive ? 'text-green-400' : 'text-red-400'}>
                 {isBotActive ? 'CORE ONLINE' : 'OFFLINE'}
               </span>
             </div>
             
             {renderBotAvatar()}

             <div className="mt-6 w-full max-w-[200px] space-y-2 text-center">
                <p className="text-cyan-400 font-mono text-xs truncate animate-pulse">{status}</p>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 transition-all duration-1000" style={{ width: `${xp}%` }}></div>
                </div>
             </div>
          </div>

          {/* DX: Dashboard & Terminale */}
          <div className="lg:col-span-2 p-8 flex flex-col justify-between">
             {/* Header Stats */}
             <div className="flex justify-between items-center mb-6">
                <div>
                   <h2 className="text-2xl font-bold text-white">Quantum Core <span className="text-cyan-500">v3.0</span></h2>
                   <p className="text-gray-400 text-xs">Gestione autonoma risorse & crafting</p>
                </div>
                <div className="bg-gray-900 border border-gray-700 px-4 py-2 rounded-xl flex items-center gap-3">
                   <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                   <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Credits</p>
                      <p className="text-xl font-mono font-bold text-white">{credits}</p>
                   </div>
                </div>
             </div>

             {/* Terminale Log (Qui vedi cosa fa il EcoBotManager!) */}
             <div className="bg-black/80 rounded-lg p-4 font-mono text-xs h-32 overflow-y-auto border border-gray-800 mb-6 custom-scrollbar">
                <div className="flex items-center gap-2 text-gray-500 mb-2 border-b border-gray-800 pb-1">
                   <Terminal className="w-3 h-3" /> System Logs
                </div>
                {logs.length === 0 ? (
                  <span className="text-gray-600">In attesa di attività...</span>
                ) : (
                  logs.map((log, i) => (
                    <div key={i} className="mb-1">
                       <span className="text-cyan-500 opacity-50 mr-2">[{new Date().toLocaleTimeString()}]</span>
                       <span className="text-gray-300">{log}</span>
                    </div>
                  ))
                )}
             </div>

             {/* Shop Rapido */}
             <div className="grid grid-cols-3 gap-3">
                {shopItems.map((item) => (
                   <button key={item.id} onClick={() => handleBuy(item)} className="bg-gray-900/50 hover:bg-gray-800 border border-gray-800 p-3 rounded-lg text-center transition-all">
                      <div className="text-2xl mb-1">{item.icon}</div>
                      <div className="text-[10px] text-gray-500">-{item.cost} QC</div>
                   </button>
                ))}
             </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QuantumHub;
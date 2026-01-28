import React, { useState, useEffect } from 'react';
import { Zap, ShoppingBag, Leaf } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useBotContext } from '@/context/bot-context';
import { useToast } from '@/hooks/use-toast';

const QuantumHub = () => {
  const { toast } = useToast();
  const { status, xp, credits, addCredits, addXp } = useBotContext();
  const [mood, setMood] = useState<'neutral' | 'happy' | 'focus' | 'party'>('neutral');

  useEffect(() => {
    if (status.includes("Analisi") || status.includes("Ingegneria")) {
      setMood('focus');
    } else if (status.includes("Catalogato") || status.includes("Blueprint")) {
      setMood('happy');
      setTimeout(() => setMood('neutral'), 3000);
    }
  }, [status]);

  const shopItems = [
    { id: 'happy', icon: '😊', name: 'Happy Mode', cost: 50 },
    { id: 'focus', icon: '⚡', name: 'Overclock', cost: 100 },
    { id: 'party', icon: '🎉', name: 'Party Time', cost: 200 },
  ];

  const handleBuy = (item: any) => {
    if (credits >= item.cost) {
      addCredits(-item.cost);
      setMood(item.id);
      addXp(15);
      toast({ title: `Acquistato: ${item.name}` });
    } else {
      toast({ title: "Crediti Insufficienti", variant: "destructive" });
    }
  };

  const renderAvatar = () => (
     <div className={`relative w-40 h-40 rounded-full flex items-center justify-center transition-all duration-500 border-4 bg-black/40 backdrop-blur-md ${mood === 'happy' ? 'border-green-500 shadow-[0_0_60px_#22c55e]' : 'border-cyan-500 shadow-[0_0_60px_#06b6d4]'}`}>
        <div className="flex gap-4">
            <div className={`w-4 h-4 bg-white rounded-full ${mood === 'party' ? 'animate-bounce' : ''}`}></div>
            <div className={`w-4 h-4 bg-white rounded-full ${mood === 'party' ? 'animate-bounce delay-100' : ''}`}></div>
        </div>
        <div className="absolute -bottom-3 bg-gray-900 text-white border border-gray-700 px-3 py-1 rounded-full text-xs font-bold">LVL {Math.floor(xp / 20) + 1}</div>
     </div>
  );

  return (
    <Card className="bg-[#0f111a] border-gray-800 p-8 relative overflow-hidden shadow-2xl min-h-[400px]">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-600/5 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="flex-1 space-y-8">
             <div>
               <h2 className="text-4xl font-bold text-white mb-2">Quantum <span className="text-cyan-500">Hub</span></h2>
               <div className="flex items-center gap-2">
                 <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded border border-green-500/30">STATUS: ONLINE</span>
                 <p className="text-gray-500 text-sm animate-pulse">{status}</p>
               </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div className="bg-gray-900/60 p-4 rounded-xl border border-gray-800">
                 <p className="text-gray-400 text-xs uppercase font-bold flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-500"/> Crediti QC</p>
                 <p className="text-3xl font-mono text-white mt-1">{credits}</p>
               </div>
               <div className="bg-gray-900/60 p-4 rounded-xl border border-gray-800">
                 <p className="text-gray-400 text-xs uppercase font-bold flex items-center gap-2"><Leaf className="w-4 h-4 text-green-500"/> CO2 Saved</p>
                 <p className="text-3xl font-mono text-white mt-1">{Math.floor(xp * 1.5)} kg</p>
               </div>
             </div>
          </div>
          <div className="flex flex-col items-center gap-8">
             {renderAvatar()}
             <div className="flex gap-2 bg-black/30 p-2 rounded-xl border border-gray-800">
                {shopItems.map((item) => (
                   <button key={item.id} onClick={() => handleBuy(item)} className="w-10 h-10 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-lg text-xl transition-all">{item.icon}</button>
                ))}
             </div>
          </div>
        </div>
    </Card>
  );
};

export default QuantumHub;
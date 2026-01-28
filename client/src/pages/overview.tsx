import React from 'react';
import { useUser } from '@/hooks/use-user';
import { useLocation } from "wouter";
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
    Zap, Globe, TrendingUp, Crown, ArrowRight, 
    Leaf, ShieldCheck, Activity, Rocket, LayoutGrid 
} from 'lucide-react';

export default function Overview() {
  const { user } = useUser();
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
        
        {/* HERO WELCOME */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0f111a] via-[#1a0b2e] to-[#0f111a] border border-purple-500/20 shadow-2xl p-8 md:p-16">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full animate-pulse"></div>
            <div className="relative z-10 max-w-3xl">
                <Badge className="mb-4 bg-purple-500/10 text-purple-400 border-purple-500/50 px-3 py-1 text-xs tracking-widest uppercase">
                    Quantum System v2.4
                </Badge>
                <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
                    Benvenuto nel <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">Futuro del Riciclo</span>
                </h1>
                <p className="text-xl text-slate-400 mb-8 leading-relaxed">
                    Ciao <span className="text-white font-bold">{user?.displayName || "Maker"}</span>. 
                    Il tuo ecosistema digitale è pronto.
                </p>
                <div className="flex flex-wrap gap-4">
                    <Button onClick={() => setLocation('/dashboard')} className="h-14 px-8 bg-white text-black hover:bg-slate-200 font-bold rounded-full text-lg shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-transform hover:scale-105">
                        <LayoutGrid className="mr-2 h-5 w-5"/> Vai al Quantum Hub
                    </Button>
                    <Button onClick={() => setLocation('/marketplace')} variant="outline" className="h-14 px-8 border-slate-700 text-slate-300 hover:text-white hover:border-white/50 rounded-full text-lg">
                        Esplora Market
                    </Button>
                </div>
            </div>
        </div>

        {/* STATS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-[#161b22] border-slate-800 p-6 relative overflow-hidden group hover:border-green-500/30 transition-all">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-500/20 rounded-lg"><Leaf className="w-5 h-5 text-green-400"/></div>
                        <span className="text-slate-400 text-sm font-bold uppercase">Eco Score</span>
                    </div>
                    <div className="text-4xl font-black text-white">850</div>
                    <p className="text-green-500 text-xs mt-1 font-bold">+12% vs settimana scorsa</p>
                </div>
            </Card>

            <Card className="bg-[#161b22] border-slate-800 p-6 relative overflow-hidden group hover:border-yellow-500/30 transition-all">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-yellow-500/20 rounded-lg"><Zap className="w-5 h-5 text-yellow-400"/></div>
                        <span className="text-slate-400 text-sm font-bold uppercase">Wallet</span>
                    </div>
                    <div className="text-4xl font-black text-white">Check <span className="text-lg text-slate-500">QC</span></div>
                    <Button variant="link" onClick={() => setLocation('/wallet')} className="text-yellow-500 text-xs p-0 h-auto mt-1">Vai al Wallet →</Button>
                </div>
            </Card>

            <Card className="bg-[#161b22] border-slate-800 p-6 relative overflow-hidden group hover:border-cyan-500/30 transition-all">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-cyan-500/20 rounded-lg"><Crown className="w-5 h-5 text-cyan-400"/></div>
                        <span className="text-slate-400 text-sm font-bold uppercase">Livello Master</span>
                    </div>
                    <div className="text-4xl font-black text-white">LVL 3</div>
                    <div className="w-full bg-slate-800 h-1.5 mt-3 rounded-full overflow-hidden">
                        <div className="bg-cyan-500 w-[60%] h-full"></div>
                    </div>
                </div>
            </Card>
        </div>

        {/* UPDATES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-[#0f111a] border-slate-800 p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Globe className="text-purple-500"/> Notizie Globali</h3>
                <div className="space-y-6">
                    <div className="flex gap-4 group cursor-pointer">
                        <div className="flex-1 border-l-2 border-slate-800 pl-4 group-hover:border-purple-500 transition-colors">
                            <div className="flex justify-between items-center mb-1"><Badge variant="outline" className="text-[10px] border-slate-700 text-slate-400">EVENTO</Badge><span className="text-xs text-slate-600">2h fa</span></div>
                            <h4 className="text-white font-bold group-hover:text-purple-400 transition-colors">Nuovo Evento: Friday for Quantum</h4>
                            <p className="text-sm text-slate-400">Partecipa alla pulizia globale venerdì.</p>
                        </div>
                    </div>
                    {/* Altre news... */}
                </div>
            </Card>
            
            <Card className="bg-[#1a1d2d] border-slate-800 p-6 flex items-center justify-between hover:bg-[#202530] cursor-pointer transition-colors" onClick={() => setLocation('/admin/console')}>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-500/10 rounded-full"><Activity className="w-6 h-6 text-red-500"/></div>
                    <div><h4 className="text-white font-bold">Admin Console</h4><p className="text-xs text-slate-500">Solo personale autorizzato</p></div>
                </div>
                <ArrowRight className="text-slate-600"/>
            </Card>
        </div>
    </div>
  );
}
import React from 'react';
import { useLocation } from "wouter";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Gavel, Zap, Ticket, ArrowRight, Smile, Store } from 'lucide-react';

export default function MarketHub() {
  const [, setLocation] = useLocation();

  const SECTIONS = [
      { 
          title: "Quantum Store", 
          desc: "Acquista Emoticon, Skin e Oggetti Rari pubblicati dal sistema.", 
          icon: Smile, 
          color: "text-purple-400", 
          bg: "bg-purple-900/10",
          link: "/marketplace" 
      },
      { 
          title: "Annunci & Scambi", 
          desc: "Compra e vendi materiali e strumenti con altri utenti.", 
          icon: ShoppingBag, 
          color: "text-blue-400", 
          bg: "bg-blue-900/10",
          link: "/marketplace" 
      },
      { 
          title: "Casa d'Aste", 
          desc: "Fai offerte su pezzi unici creati dai Maker.", 
          icon: Gavel, 
          color: "text-yellow-400", 
          bg: "bg-yellow-900/10",
          link: "/auction-house"
      },
      { 
          title: "Banca & Codici", 
          desc: "Ricarica QC e riscatta i codici bundle.", 
          icon: Zap, 
          color: "text-cyan-400", 
          bg: "bg-cyan-900/10",
          link: "/wallet"
      },
      { 
          title: "Biglietteria", 
          desc: "Pass per eventi globali e workshop.", 
          icon: Ticket, 
          color: "text-green-400", 
          bg: "bg-green-900/10",
          link: "/events"
      }
  ];

  return (
    <div className="space-y-8 animate-in fade-in pb-20">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0f111a] via-[#161b22] to-[#0f111a] border border-slate-800 p-10 text-center shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            <div className="relative z-10">
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 mb-4 px-4 py-1">HUB UNIFICATO</Badge>
                <h1 className="text-5xl font-black text-white mb-4">Quantum <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Market</span></h1>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg">Il centro nevralgico per ogni transazione nell'ecosistema.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SECTIONS.map((sec, i) => (
                <Card key={i} className="bg-[#1a1d2d] border-slate-800 hover:border-slate-600 transition-all group cursor-pointer hover:-translate-y-1 shadow-lg" onClick={() => setLocation(sec.link)}>
                    <CardHeader>
                        <div className={`w-14 h-14 rounded-2xl ${sec.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <sec.icon className={`w-8 h-8 ${sec.color}`}/>
                        </div>
                        <CardTitle className="text-2xl font-bold text-white">{sec.title}</CardTitle>
                        <CardDescription className="text-slate-400">{sec.desc}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center text-sm font-bold text-slate-500 group-hover:text-white transition-colors">
                            Accedi <ArrowRight className="ml-2 w-4 h-4"/>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
  );
}
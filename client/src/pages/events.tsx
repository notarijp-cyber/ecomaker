import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const EVENTS_LIST = [
    { title: "Hackathon Riciclo Creativo", date: "15 Maggio", loc: "Milano & Online", type: "Gara" },
    { title: "Webinar: Economia Circolare", date: "20 Maggio", loc: "Zoom Live", type: "Learning" },
    { title: "Pulizia Spiagge Nazionali", date: "2 Giugno", loc: "Tutta Italia", type: "Action" },
];

export default function Events() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="text-center py-10">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">Eventi <span className="text-cyan-400">Quantum</span></h1>
            <p className="text-slate-400 text-xl">Connettiti, impara e agisci con la community globale.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {EVENTS_LIST.map((evt, i) => (
                <Card key={i} className="bg-[#1a1d2d] border-slate-700 hover:border-cyan-500 cursor-pointer group transition-all">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <Badge variant="outline" className="text-cyan-400 border-cyan-900">{evt.type}</Badge>
                            <ArrowRight className="text-slate-600 group-hover:text-white transition-colors"/>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">{evt.title}</h3>
                        <div className="flex flex-col gap-2 text-slate-400 text-sm">
                            <span className="flex items-center gap-2"><Calendar className="w-4 h-4"/> {evt.date}</span>
                            <span className="flex items-center gap-2"><MapPin className="w-4 h-4"/> {evt.loc}</span>
                        </div>
                        <Button className="w-full mt-6 bg-slate-800 group-hover:bg-cyan-600 text-white transition-colors">Iscriviti</Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
  );
}
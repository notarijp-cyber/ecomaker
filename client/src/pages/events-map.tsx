import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Users } from 'lucide-react';

export default function GlobalEventsMap() {
  const events = [
    { id: 1, name: "Friday for Quantum - Milano", coords: { top: "30%", left: "45%" }, type: "FRIDAY", active: true },
    { id: 2, name: "Recycle Jam - Berlin", coords: { top: "25%", left: "52%" }, type: "EVENT", active: false },
    { id: 3, name: "Ocean Cleanup - Remote", coords: { top: "60%", left: "20%" }, type: "REMOTE", active: true },
  ];

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold text-white">Mappa Eventi Globali</h1>
         <Badge variant="outline" className="border-green-500 text-green-500 animate-pulse">3 Eventi Attivi</Badge>
      </div>

      <Card className="flex-1 bg-[#050505] border-gray-800 relative overflow-hidden rounded-xl group">
         {/* Mappa Stilizzata (Sfondo) */}
         <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center opacity-20 grayscale group-hover:grayscale-0 transition-all duration-1000"></div>
         
         {/* Markers */}
         {events.map((evt) => (
            <div 
              key={evt.id} 
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group/marker"
              style={{ top: evt.coords.top, left: evt.coords.left }}
            >
               <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 ${evt.type === 'FRIDAY' ? 'bg-green-500/20 border-green-500 text-green-500' : 'bg-cyan-500/20 border-cyan-500 text-cyan-500'}`}>
                  <MapPin className="w-4 h-4" />
                  <div className={`absolute inset-0 rounded-full animate-ping ${evt.active ? 'opacity-100' : 'opacity-0'}`}></div>
               </div>
               
               {/* Tooltip */}
               <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 bg-black/90 border border-gray-700 p-3 rounded-lg opacity-0 group-hover/marker:opacity-100 transition-opacity z-10 pointer-events-none">
                  <p className="font-bold text-white text-sm">{evt.name}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-1"><Users className="w-3 h-3"/> 124 Partecipanti</p>
                  {evt.type === 'FRIDAY' && <Badge className="mt-2 bg-green-600 text-[10px]">FRIDAY FOR QUANTUM</Badge>}
               </div>
            </div>
         ))}
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         {events.map((evt) => (
            <Card key={evt.id} className="p-4 bg-[#0f111a] border-gray-800 flex items-center gap-4 hover:border-cyan-500/50 transition-colors cursor-pointer">
               <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${evt.type === 'FRIDAY' ? 'bg-green-900/20 text-green-500' : 'bg-cyan-900/20 text-cyan-500'}`}>
                  <Calendar className="w-5 h-5"/>
               </div>
               <div>
                  <h4 className="font-bold text-white text-sm">{evt.name}</h4>
                  <p className="text-xs text-gray-500">Clicca per dettagli</p>
               </div>
            </Card>
         ))}
      </div>
    </div>
  );
}
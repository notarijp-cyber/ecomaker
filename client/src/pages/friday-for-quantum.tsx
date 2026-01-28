import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Video, School, Share2, Globe, Megaphone } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useSocial } from '@/context/social-context';
import { NewsTicker } from '@/components/layout/NewsTicker';

const EVENTS = [
    { id: 1, title: "Pulizia Parco Sempione", school: "Liceo Volta", date: "Venerdì 24, 14:00", participants: 45, status: "open", image: "https://images.unsplash.com/photo-1618477461853-5f8dd1458461?auto=format&fit=crop&q=80&w=800" },
    { id: 2, title: "Global Strike: Piazza Duomo", school: "Coordinamento Studentesco", date: "Venerdì 24, 09:00", participants: 1200, status: "live", image: "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&q=80&w=800" },
];

export default function FridayForQuantum() {
  const { toast } = useToast();
  const { addPost, shareToExternal, news } = useSocial();
  const [activeTab, setActiveTab] = useState("events");

  // Filtra solo le notizie di attivismo
  const activismNews = news.filter(n => n.category === 'ACTIVISM' || n.category === 'GLOBAL');

  const handleJoin = (evt: any) => {
      toast({ title: "Iscrizione Confermata!", className: "bg-green-600 text-white" });
      // CONDIVISIONE AUTOMATICA NELLA COMMUNITY
      addPost({
          author: "Tu (EcoMaker)",
          avatar: "https://github.com/shadcn.png",
          content: `Mi sono appena unito all'evento "${evt.title}"! 🌿 Chi viene con me a fare la differenza? #FridayForQuantum`,
          type: 'EVENT',
          image: evt.image
      });
  };

  return (
    <div className="space-y-0 animate-in fade-in duration-500">
        <NewsTicker />
        
        <div className="p-4 md:p-8 space-y-8">
            {/* HERO SECTION */}
            <div className="relative rounded-3xl overflow-hidden border border-green-900/50 bg-[#0f111a] group">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-1000"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#0f111a] via-[#0f111a]/80 to-transparent"></div>
                
                <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="max-w-2xl">
                        <Badge className="bg-red-600 text-white mb-4 animate-pulse">LIVE ACTION</Badge>
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">
                            FRIDAY FOR <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">QUANTUM</span>
                        </h1>
                        <p className="text-slate-300 text-xl leading-relaxed">
                            La piattaforma ufficiale per coordinare l'azione climatica studentesca. 
                            Collega la tua scuola, organizza scioperi e pulizie, e condividi l'impatto in tempo reale.
                        </p>
                        <div className="flex gap-4 mt-8">
                            <Button className="h-12 px-8 bg-green-600 hover:bg-green-500 text-white font-bold text-lg rounded-full shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                                Unisciti al Movimento
                            </Button>
                            <Button variant="outline" className="h-12 px-8 border-slate-600 text-slate-300 hover:text-white rounded-full" onClick={() => shareToExternal("Instagram", "Sto partecipando al Friday for Quantum!")}>
                                <Share2 className="w-5 h-5 mr-2"/> Diffondi
                            </Button>
                        </div>
                    </div>
                    
                    {/* BOX NOTIZIE LIVE */}
                    <Card className="w-full md:w-96 bg-black/50 border-slate-700 backdrop-blur-md">
                        <CardHeader className="pb-2 border-b border-slate-800">
                            <CardTitle className="text-sm uppercase text-slate-400 flex items-center"><Globe className="w-4 h-4 mr-2"/> Aggiornamenti Globali</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            {activismNews.slice(0, 3).map(n => (
                                <div key={n.id} className="text-sm border-l-2 border-green-500 pl-3">
                                    <p className="text-white font-medium line-clamp-2">{n.text}</p>
                                    <span className="text-xs text-slate-500">{n.source} • {n.time}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-[#1a1d2d] border border-slate-800 h-14 p-1">
                    <TabsTrigger value="events" className="font-bold text-slate-300 data-[state=active]:bg-green-700">EVENTI GLOBALI</TabsTrigger>
                    <TabsTrigger value="create" className="font-bold text-slate-300 data-[state=active]:bg-cyan-700">ORGANIZZA</TabsTrigger>
                    <TabsTrigger value="live" className="font-bold text-slate-300 data-[state=active]:bg-red-700 flex gap-2"><Video className="w-4 h-4"/> STREAMING</TabsTrigger>
                </TabsList>

                <TabsContent value="events" className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {EVENTS.map((evt) => (
                        <Card key={evt.id} className="bg-[#1a1d2d] border-slate-700 overflow-hidden group">
                            <div className="h-40 bg-cover bg-center relative" style={{backgroundImage: `url(${evt.image})`}}>
                                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur">
                                    {evt.participants} Partecipanti
                                </div>
                            </div>
                            <CardHeader>
                                <CardTitle className="text-white">{evt.title}</CardTitle>
                                <CardDescription className="flex items-center gap-1"><School className="w-3 h-3"/> {evt.school}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 text-sm text-slate-300 mb-4">
                                    <Calendar className="w-4 h-4 text-green-400"/> {evt.date}
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button className="bg-slate-800 hover:bg-green-600 text-white" onClick={() => handleJoin(evt)}>Partecipa</Button>
                                    <Button variant="outline" className="border-slate-700 hover:bg-cyan-900/30" onClick={() => shareToExternal("WhatsApp", `Vieni con me a ${evt.title}?`)}>
                                        <Share2 className="w-4 h-4 mr-2"/> Invita
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="create" className="mt-8 p-8 bg-[#1a1d2d] rounded-2xl border border-slate-700 text-center">
                    <Megaphone className="w-16 h-16 text-cyan-500 mx-auto mb-4"/>
                    <h2 className="text-2xl font-bold text-white mb-2">Lancia una mobilitazione</h2>
                    <p className="text-slate-400 mb-6">Crea un evento, invita la tua scuola e traccia i kg di rifiuti raccolti.</p>
                    <Button className="bg-cyan-600 text-white font-bold px-8">Inizia Setup Evento</Button>
                </TabsContent>
            </Tabs>
        </div>
    </div>
  );
}
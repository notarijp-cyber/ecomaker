import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Store, ScanLine, ArrowRight, Target, Leaf, MapPin, Share2, MessageCircle, Gavel, ShieldAlert } from "lucide-react";
import { useLocation, Link } from "wouter"; // Aggiunto Link per la navigazione
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc, increment, onSnapshot } from "firebase/firestore";
import { NewsTicker } from '@/components/layout/NewsTicker';
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AvatarVisual } from "@/components/gamification/AvatarVisual";
import { AVATAR_LORE, AvatarType } from "@/lib/avatar-lore";

// CONFIGURAZIONE MISSIONI GIORNALIERE
const DAILY_MISSIONS = [
    { id: 'm1', category: 'Recycle', title: "Scansiona 3 Rifiuti", goal: 3, current: 1, reward: 50, icon: ScanLine, color: 'text-cyan-400', bgColor: 'bg-cyan-500/20' },
    { id: 'm2', category: 'Social', title: "Commenta 2 Progetti", goal: 2, current: 2, reward: 30, icon: MessageCircle, color: 'text-purple-400', bgColor: 'bg-purple-500/20', completed: true },
    { id: 'm3', category: 'Explore', title: "Visita il Mercatino", goal: 1, current: 0, reward: 20, icon: Store, color: 'text-green-400', bgColor: 'bg-green-500/20' },
];

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // --- CONTROLLO MASTER ---
  const MASTER_EMAIL = "ecomakerteamtest@gmail.com";
  const isMaster = auth.currentUser?.email === MASTER_EMAIL;

  // Stato Utente Iniziale
  const [userData, setUserData] = useState<any>({ 
    credits: 0, 
    level: 1, 
    xp: 0, 
    maxXp: 100, 
    materials: 0, 
    co2Saved: 0, 
    displayName: "Maker", 
    avatarType: 'EchoBot' 
  });
  
  const [missions, setMissions] = useState(DAILY_MISSIONS);

  // 1. LISTENER IN TEMPO REALE
  useEffect(() => {
    if (!auth.currentUser) return;

    const unsubscribe = onSnapshot(doc(db, "users", auth.currentUser.uid), (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(prev => ({
                ...prev,
                ...data,
                avatarType: data.avatarType || 'EchoBot',
                displayName: data.displayName || prev.displayName
            }));
        }
    });

    return () => unsubscribe();
  }, []);

  // 2. LOGICA RISCATTO MISSIONI
  const handleClaimReward = async (missionId: string, reward: number) => {
      setMissions(prev => prev.filter(m => m.id !== missionId));
      
      if (auth.currentUser) {
          const userRef = doc(db, "users", auth.currentUser.uid);
          await updateDoc(userRef, { 
            credits: increment(reward),
            xp: increment(10)
          });
      }

      toast({ 
          title: `Missione Completata!`, 
          description: `+${reward} QC e +10 XP aggiunti.`, 
          className: "bg-green-600 text-white border-green-500" 
      });
  };

  // 3. RECUPERO DATI AVATAR
  const loreIndex = Math.min((userData.level || 1) - 1, 4);
  const currentAvatarLore = AVATAR_LORE[userData.avatarType as AvatarType]?.evolution[loreIndex];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24">
      
      {/* --- HEADER SUPERIORE CON NEWS E PULSANTE MASTER --- */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full">
            <NewsTicker />
          </div>

          {/* IL BOTTONE SEGRETO PER ACCEDERE ALLA CONSOLE */}
          {isMaster && (
            <Link href="/admin/console">
                <Button variant="destructive" className="animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.6)] font-bold border border-red-400 whitespace-nowrap">
                    <ShieldAlert className="mr-2 h-4 w-4" /> ADMIN CORE
                </Button>
            </Link>
          )}
      </div>

      {/* --- HERO SECTION: QUANTUM HUB --- */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#151725] to-[#0f111a] border border-cyan-900/50 shadow-2xl p-6 md:p-10 transition-all hover:shadow-cyan-900/20 hover:shadow-lg">
         <div className="absolute top-0 right-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
         
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            
            {/* COLONNA SX: DATI E AZIONI */}
            <div className="flex-1 space-y-6 w-full">
                <div>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-lg mb-2">
                        Quantum <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Hub</span>
                    </h1>
                    <div className="flex items-center gap-3 text-slate-400 text-lg">
                        <span className="text-white font-bold">{userData.displayName}</span>
                        <Badge variant="outline" className="bg-green-950/40 text-green-400 border-green-500/30 animate-pulse flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span> ONLINE
                        </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1a1d2d]/60 backdrop-blur border border-slate-700 p-4 rounded-2xl hover:bg-[#1a1d2d] transition-all cursor-pointer group hover:border-yellow-500/50" onClick={() => setLocation('/wallet')}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Crediti QC</span>
                            <Zap className="w-4 h-4 text-yellow-400 group-hover:scale-125 transition-transform duration-300"/>
                        </div>
                        <p className="text-3xl font-black text-white">{userData.credits}</p>
                    </div>
                    
                    <div className="bg-[#1a1d2d]/60 backdrop-blur border border-slate-700 p-4 rounded-2xl hover:bg-[#1a1d2d] transition-all group hover:border-green-500/50">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">CO2 Saved</span>
                            <Leaf className="w-4 h-4 text-green-400 group-hover:scale-125 transition-transform duration-300"/>
                        </div>
                        <p className="text-3xl font-black text-white">{userData.co2Saved}<span className="text-sm text-slate-500 ml-1 font-medium">kg</span></p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Button onClick={() => setLocation('/ar-material-scan')} className="flex-1 md:flex-none bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(8,145,178,0.3)] transition-all hover:scale-105">
                        <ScanLine className="w-4 h-4 mr-2"/> Scansiona Rifiuto
                    </Button>
                    <Button variant="outline" onClick={() => setLocation('/friday-for-quantum')} className="flex-1 md:flex-none border-green-600/50 text-green-400 hover:bg-green-900/20 hover:text-green-300 font-bold rounded-xl">
                        <MapPin className="w-4 h-4 mr-2"/> Friday Map
                    </Button>
                </div>
            </div>

            {/* COLONNA DX: AVATAR VISUAL */}
            <div className="flex flex-col items-center relative w-full md:w-auto">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-500/20 blur-[60px] rounded-full pointer-events-none"></div>
                
                <div className="w-48 h-48 md:w-64 md:h-64 relative z-10 transition-transform hover:scale-105 duration-500 cursor-pointer" onClick={() => setLocation('/profile')}>
                    <AvatarVisual 
                        type={userData.avatarType} 
                        level={userData.level} 
                    />
                </div>

                <div className="mt-2 w-full max-w-[250px] space-y-3">
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden relative">
                        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-purple-500" style={{ width: `${(userData.xp || 0) % 100}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                        <span>LVL {userData.level}</span>
                        <span>XP {userData.xp || 0}/100</span>
                    </div>

                    <div className="bg-black/40 backdrop-blur-md border border-slate-700/50 p-3 rounded-xl text-center shadow-lg">
                        <p className="text-xs text-cyan-300 font-bold mb-1 uppercase tracking-wide">{currentAvatarLore?.title || "Entità Sconosciuta"}</p>
                        <p className="text-[10px] text-slate-400 italic leading-relaxed">"{currentAvatarLore?.story || "Caricamento dati neurali..."}"</p>
                    </div>
                </div>
            </div>
         </div>
      </div>

      {/* --- GRID SEZIONI INFERIORI --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          
          {/* 1. MISSIONI */}
          <Card className="bg-[#1a1d2d] border-slate-700 hover:border-purple-500/50 group flex flex-col relative overflow-hidden transition-all hover:shadow-lg">
              <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-20 transition-opacity">
                  <Target className="w-32 h-32 text-cyan-400" />
              </div>
              <CardContent className="p-6 relative z-10 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><Target className="w-5 h-5"/></div>
                          <h3 className="font-bold text-white text-lg">Missioni</h3>
                      </div>
                      <Badge variant="outline" className="text-cyan-400 border-cyan-500/50">{missions.length} Daily</Badge>
                  </div>
                  
                  <div className="space-y-4 flex-1">
                      {missions.length === 0 ? (
                          <div className="text-center text-slate-500 py-8 text-sm italic">
                              Tutte le missioni completate! Torna domani.
                          </div>
                      ) : (
                          missions.map((mission) => (
                            <div key={mission.id} className="p-3 rounded-xl border bg-black/20 border-slate-800 hover:border-cyan-500/30 transition-all">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${mission.bgColor} ${mission.color}`}>
                                            <mission.icon className="w-3 h-3"/>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-xs md:text-sm text-white">{mission.title}</h4>
                                            <div className="flex items-center gap-2 text-[10px] font-medium mt-0.5">
                                                <span className="text-slate-400">{mission.current}/{mission.goal}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button size="sm" onClick={() => handleClaimReward(mission.id, mission.reward)} disabled={mission.current < mission.goal} className={`h-7 text-[10px] px-3 font-bold ${mission.current >= mission.goal ? 'bg-green-600 text-white animate-pulse hover:bg-green-500' : 'bg-slate-800 text-slate-500'}`}>
                                        {mission.current >= mission.goal ? 'RISCATTA' : `+${mission.reward} QC`}
                                    </Button>
                                </div>
                                <div className="relative h-1 bg-slate-800 rounded-full overflow-hidden">
                                    <div className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ${mission.color === 'text-cyan-400' ? 'bg-cyan-500' : 'bg-purple-500'}`} style={{ width: `${(mission.current / mission.goal) * 100}%` }}></div>
                                </div>
                            </div>
                          ))
                      )}
                  </div>
              </CardContent>
          </Card>

          {/* 2. COMMERCIO */}
          <div className="space-y-4 flex flex-col">
               <div onClick={() => setLocation('/auction-house')} className="flex-1 p-6 rounded-2xl bg-gradient-to-br from-[#1a1d2d] to-yellow-900/10 border border-slate-700 hover:border-yellow-500/50 cursor-pointer group flex items-center justify-between transition-all hover:translate-y-[-2px] hover:shadow-lg">
                  <div className="flex items-center gap-4">
                      <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                          <Gavel className="w-6 h-6"/>
                      </div>
                      <div>
                          <h3 className="font-bold text-white text-lg">Casa d'Aste</h3>
                          <p className="text-xs text-slate-400 mt-1">Vendi materiali rari</p>
                      </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-yellow-500 transition-transform group-hover:translate-x-1"/>
              </div>

              <div onClick={() => setLocation('/marketplace')} className="flex-1 p-6 rounded-2xl bg-gradient-to-br from-[#1a1d2d] to-green-900/10 border border-slate-700 hover:border-green-500/50 cursor-pointer group flex items-center justify-between transition-all hover:translate-y-[-2px] hover:shadow-lg">
                  <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-500/10 rounded-xl text-green-500 group-hover:bg-green-500 group-hover:text-black transition-colors">
                          <Store className="w-6 h-6"/>
                      </div>
                      <div>
                          <h3 className="font-bold text-white text-lg">Mercatino</h3>
                          <p className="text-xs text-slate-400 mt-1">Scambio rapido</p>
                      </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-green-500 transition-transform group-hover:translate-x-1"/>
              </div>
          </div>

          {/* 3. COMMUNITY & FRIDAY */}
          <Card className="bg-[#1a1d2d] border-slate-700 hover:border-green-500/50 cursor-pointer group transition-all hover:shadow-green-900/20 hover:shadow-lg" onClick={() => setLocation('/friday-for-quantum')}>
              <CardContent className="p-6 flex flex-col h-full justify-between">
                   <div>
                       <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-green-500/20 rounded-lg text-green-400 group-hover:bg-green-500 group-hover:text-white transition-colors">
                              <Share2 className="w-5 h-5"/>
                          </div>
                          <h3 className="font-bold text-white text-lg">Friday for Quantum</h3>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed mb-6">
                          Unisciti alla mobilitazione globale. Organizza eventi di pulizia, guadagna badge esclusivi e scala la classifica mondiale.
                      </p>
                   </div>
                   
                   <Button className="w-full bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl group-hover:scale-[1.02] transition-transform">
                       Partecipa Ora
                   </Button>
              </CardContent>
          </Card>
      </div>
    </div>
  );
}
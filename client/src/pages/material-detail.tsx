import React, { useState, useEffect } from 'react';
import { useRoute, useLocation } from "wouter";
import { ArrowLeft, Recycle, ShieldAlert, Clock, FileText, Database, Lock, Microscope, ArrowRight, Save, Atom } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

export default function MaterialDetail() {
  const { toast } = useToast();
  const [, params] = useRoute("/material-detail/:id");
  const [, setLocation] = useLocation();
  const [material, setMaterial] = useState<any>(null);
  const [linkedProjectData, setLinkedProjectData] = useState<any>(null);
  const [userLevel, setUserLevel] = useState(1);
  const [isBot, setIsBot] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userDims, setUserDims] = useState({ h: "", w: "", d: "" });

  useEffect(() => {
    if (!params?.id) return;
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
        try {
            if (currentUser) {
                const userSnap = await getDoc(doc(db, "users", currentUser.uid));
                if (userSnap.exists()) setUserLevel(userSnap.data().level || 1);
                setIsBot(currentUser.email === "ecomakerteamtest@gmail.com");
            }
            let matData = null;
            let snap = await getDoc(doc(db, "repository", params.id));
            if (!snap.exists() && currentUser) snap = await getDoc(doc(db, "users", currentUser.uid, "inventory", params.id));
            
            if (snap.exists()) {
                matData = { id: snap.id, ...snap.data() };
                setMaterial(matData);
                if (matData.userDimensions) setUserDims(matData.userDimensions);
                const q = query(collection(db, "secret_projects_db"), where("linkedMaterialId", "==", snap.id));
                const projSnap = await getDocs(q);
                if (!projSnap.empty) setLinkedProjectData({ id: projSnap.docs[0].id, ...projSnap.docs[0].data() });
            }
        } catch (e) { console.error(e); } finally { setLoading(false); }
    });
    return () => unsubscribeAuth();
  }, [params?.id]);

  const saveDimensions = async () => {
      if (!auth.currentUser || !material) return;
      try {
          if (!isBot) {
              await updateDoc(doc(db, "users", auth.currentUser.uid, "inventory", material.id), { userDimensions: userDims });
              toast({ title: "Misure Salvate", className: "bg-green-600 text-white" });
          }
      } catch (e) { toast({ title: "Errore", variant: "destructive" }); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-cyan-500 animate-pulse font-mono">CARICAMENTO...</div>;
  if (!material) return <div className="p-8 text-white">Materiale non trovato.</div>;

  const cardColor = material.recycleColor || "#64748b";
  const requiredLevel = linkedProjectData?.requiredLevel || 1;
  const isLocked = userLevel < requiredLevel;

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen pb-20 text-white font-sans">
      <Button variant="ghost" onClick={() => setLocation('/inventory')} className="text-slate-400 mb-6 pl-0 hover:text-white"><ArrowLeft className="w-5 h-5 mr-2"/> Indietro</Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
            <Card className="border-0 overflow-hidden shadow-2xl relative h-96 flex flex-col items-center justify-center" style={{ backgroundColor: cardColor }}>
                <Recycle className="w-32 h-32 text-black/20 animate-spin-slow mb-4" />
                <h1 className="text-3xl font-black text-black/80 text-center px-4 uppercase leading-tight">{material.category || "RIFIUTO"}</h1>
                <div className="mt-4 bg-black/20 px-4 py-1 rounded-full text-black/70 font-mono font-bold">{material.disposalRule ? material.disposalRule.split(' ')[0] : "INDIFFERENZIATO"}</div>
            </Card>

            <Card className={`border-slate-800 shadow-xl ${linkedProjectData ? 'bg-cyan-950/30 border-cyan-800' : 'bg-slate-900'}`}>
                <CardHeader className="pb-2"><CardTitle className="text-xs font-mono text-slate-500 flex items-center gap-2"><Database className="w-3 h-3" /> DATABASE PROGETTI</CardTitle></CardHeader>
                <CardContent>
                    {linkedProjectData ? (
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 text-cyan-400">
                                {isLocked ? <Lock className="w-5 h-5 mt-1 shrink-0 text-red-400" /> : <Lock className="w-5 h-5 mt-1 shrink-0 text-green-400" />}
                                <div>
                                    <div className="font-bold text-sm line-clamp-1">{linkedProjectData.title}</div>
                                    <div className={`text-xs ${isLocked ? 'text-red-400' : 'text-green-400'}`}>Liv. {requiredLevel} (Tu: {userLevel})</div>
                                </div>
                            </div>
                            {!isLocked && <Button className="w-full bg-cyan-700 hover:bg-cyan-600 text-white shadow-lg" onClick={() => setLocation(`/project-detail/${linkedProjectData.id}?secret=true`)}>Visualizza Progetto <ArrowRight className="w-4 h-4 ml-2"/></Button>}
                        </div>
                    ) : (
                        <div className="text-slate-500 text-sm flex items-center gap-2 py-2"><Clock className="w-4 h-4"/> Nessun blueprint disponibile.</div>
                    )}
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
            <div><h2 className="text-4xl font-bold mb-2">{material.name || material.commonName}</h2><Badge className="bg-white text-black hover:bg-white">{material.category}</Badge></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* BOX SCI-FI (Sostituisce Dati Bot) */}
                <Card className="bg-gradient-to-br from-purple-900/40 to-slate-900 border-purple-500/30">
                    <CardHeader className="pb-2"><CardTitle className="text-sm text-purple-400 flex items-center gap-2"><Atom className="w-4 h-4 animate-spin-slow"/> RISONANZA QUANTICA</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-white">Classe {Math.floor(Math.random()*5)+1} Alpha</div>
                        <p className="text-xs text-purple-300 mt-1">Materiale stabile idoneo per upcycling avanzato.</p>
                    </CardContent>
                </Card>

                {/* BOX UTENTE */}
                <Card className="bg-[#1a1d2d] border-slate-700">
                    <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-400 flex items-center gap-2">LE TUE MISURE (cm)</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <Input placeholder="H" className="bg-slate-900 border-slate-600 h-8 text-xs text-white" value={userDims.h} onChange={e => setUserDims({...userDims, h: e.target.value})}/>
                                <Input placeholder="L" className="bg-slate-900 border-slate-600 h-8 text-xs text-white" value={userDims.w} onChange={e => setUserDims({...userDims, w: e.target.value})}/>
                                <Input placeholder="P" className="bg-slate-900 border-slate-600 h-8 text-xs text-white" value={userDims.d} onChange={e => setUserDims({...userDims, d: e.target.value})}/>
                            </div>
                            <Button size="sm" onClick={saveDimensions} className="w-full h-7 text-xs bg-slate-700 hover:bg-green-600"><Save className="w-3 h-3 mr-1" /> Salva</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#1a1d2d] border-slate-700 md:col-span-2">
                    <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-400 flex items-center gap-2"><FileText className="w-4 h-4 text-blue-500"/> SMALTIMENTO</CardTitle></CardHeader>
                    <CardContent>
                        <div className="p-4 bg-slate-900/50 rounded-lg border-l-4 border-blue-500"><p className="text-lg text-white font-medium">"{material.disposalRule}"</p></div>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-transparent border-slate-800">
                <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-400 flex items-center gap-2"><Microscope className="w-4 h-4 text-purple-500"/> NOTE DI LABORATORIO</CardTitle></CardHeader>
                <CardContent><p className="text-slate-300 leading-relaxed italic">"{material.description}"</p></CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
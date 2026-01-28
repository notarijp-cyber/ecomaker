import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Layers, Plus, Hammer, CheckCircle, Clock, Zap, ArrowLeft, Loader2, AlertTriangle } from 'lucide-react';
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { auth, db } from "@/lib/firebase"; 
import { collection, query, orderBy, onSnapshot, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";

export default function MyProjects() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Stati
  const [projects, setProjects] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  
  // Stati UI
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      // Controllo Auth immediato
      if(!auth.currentUser) return;

      setLoading(true);

      // 1. Carica Progetti
      const qProjects = query(collection(db, "users", auth.currentUser.uid, "projects"), orderBy("createdAt", "desc"));
      const unsubProj = onSnapshot(qProjects, (snap) => {
          setProjects(snap.docs.map(d => ({id: d.id, ...d.data()})));
      });

      // 2. Carica Inventario (per i materiali)
      const qMat = query(collection(db, "users", auth.currentUser.uid, "inventory"));
      const unsubMat = onSnapshot(qMat, (snap) => {
          setMaterials(snap.docs.map(d => ({id: d.id, ...d.data()})));
      });

      // 3. Carica Dati Utente (Livello/XP)
      const unsubUser = onSnapshot(doc(db, "users", auth.currentUser.uid), (snap) => {
          setUserData(snap.data());
          setLoading(false); // Sblocca il caricamento qui
      });

      return () => { unsubProj(); unsubMat(); unsubUser(); };
  }, []);

  // Creazione Progetto
  const createProject = async () => {
      if (!auth.currentUser || materials.length === 0) return;

      // Logica Semplificata: Usa il primo materiale disponibile
      const matToUse = materials[0]; 
      
      try {
          // 1. Consuma materiale
          await deleteDoc(doc(db, "users", auth.currentUser.uid, "inventory", matToUse.id));

          // 2. Crea Progetto
          await addDoc(collection(db, "users", auth.currentUser.uid, "projects"), {
              title: `Costruzione con ${matToUse.name || "Materiale"}`,
              status: "in_progress",
              progress: 0,
              xpReward: 150, // XP che darà
              createdAt: new Date()
          });

          toast({ title: "Progetto Avviato! 🚀", description: `Hai usato 1x ${matToUse.name}.`, className: "bg-blue-600 text-white" });
          setIsNewProjectOpen(false);

      } catch (e) {
          console.error(e);
          toast({ title: "Errore Creazione", variant: "destructive" });
      }
  };

  // Completamento Progetto
  const completeProject = async (proj: any) => {
      if(!auth.currentUser) return;
      try {
          // 1. Aggiorna stato progetto
          const projRef = doc(db, "users", auth.currentUser.uid, "projects", proj.id);
          await updateDoc(projRef, { status: "completed", progress: 100 });
          
          // 2. Assegna XP all'utente
          const userRef = doc(db, "users", auth.currentUser.uid);
          const currentXP = userData?.experience || 0;
          await updateDoc(userRef, { experience: currentXP + proj.xpReward });

          toast({ title: "Progetto Completato! 🏆", description: `+${proj.xpReward} XP guadagnati.`, className: "bg-green-600 text-white" });
          
      } catch(e) { console.error(e); }
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-[#0f111a]"><Loader2 className="w-10 h-10 text-blue-500 animate-spin"/></div>;

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen text-white pb-20 animate-in fade-in">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
            <div>
                <Button variant="ghost" onClick={() => setLocation('/dashboard')} className="text-slate-400 pl-0 mb-2"><ArrowLeft className="mr-2 h-4 w-4"/> Quantum Hub</Button>
                <h1 className="text-4xl font-black text-white flex items-center gap-3"><Layers className="w-10 h-10 text-blue-500" /> WORKSHOP</h1>
            </div>
            <Button onClick={() => setIsNewProjectOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                <Plus className="w-5 h-5 mr-2"/> NUOVO PROGETTO
            </Button>
        </div>

        {/* LIVELLO MAKER */}
        <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30 p-6 mb-8">
            <div className="flex justify-between items-center mb-2">
                <span className="text-blue-400 font-bold uppercase tracking-widest text-xs">Livello Maker</span>
                <span className="text-white font-black text-xl">{userData?.level || 1}</span>
            </div>
            <Progress value={Math.min(100, ((userData?.experience || 0) / ((userData?.level || 1) * 1000)) * 100)} className="h-2 bg-slate-800" />
            <p className="text-xs text-slate-400 mt-2 text-right">{userData?.experience || 0} XP</p>
        </Card>

        {/* LISTA PROGETTI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length === 0 && (
                <div className="col-span-full text-center py-20 bg-[#1a1d2d] rounded-xl border border-dashed border-slate-700">
                    <Hammer className="w-12 h-12 text-slate-600 mx-auto mb-4"/>
                    <h3 className="text-xl font-bold text-white">Nessun progetto</h3>
                    <p className="text-slate-500 mb-6">Usa i materiali dell'inventario per costruire.</p>
                    <Button variant="outline" onClick={() => setIsNewProjectOpen(true)}>Inizia a costruire</Button>
                </div>
            )}

            {projects.map((proj) => (
                <Card key={proj.id} className="bg-[#1a1d2d] border-slate-700 relative overflow-hidden group hover:border-blue-500/50 transition-all">
                    {proj.status === 'completed' && <div className="absolute top-0 right-0 bg-green-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">COMPLETATO</div>}
                    
                    <CardHeader>
                        <CardTitle className="text-white text-lg">{proj.title}</CardTitle>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Clock className="w-3 h-3"/> {proj.createdAt?.seconds ? new Date(proj.createdAt.seconds * 1000).toLocaleDateString() : "Oggi"}
                        </div>
                    </CardHeader>
                    
                    <CardContent>
                        <div className="flex justify-between text-xs mb-2 text-slate-300">
                            <span>Progresso</span>
                            <span>{proj.progress}%</span>
                        </div>
                        <Progress value={proj.progress} className={`h-2 ${proj.status === 'completed' ? '[&>div]:bg-green-500' : '[&>div]:bg-blue-500'} bg-slate-800`} />
                    </CardContent>
                    
                    <CardFooter>
                        {proj.status !== 'completed' ? (
                            <Button className="w-full bg-slate-800 hover:bg-blue-600 border border-slate-600 transition-colors" onClick={() => completeProject(proj)}>
                                <Hammer className="w-4 h-4 mr-2"/> COMPLETA (+{proj.xpReward} XP)
                            </Button>
                        ) : (
                            <Button className="w-full bg-green-900/20 text-green-400 border border-green-900 cursor-default hover:bg-green-900/20">
                                <CheckCircle className="w-4 h-4 mr-2"/> ARCHIVIATO
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            ))}
        </div>

        {/* MODALE CREAZIONE */}
        <Dialog open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen}>
            <DialogContent className="bg-[#0f111a] border-slate-700 text-white">
                <DialogHeader>
                    <DialogTitle>Nuovo Progetto</DialogTitle>
                    <DialogDescription className="text-slate-400">Il sistema userà automaticamente un materiale dal tuo inventario.</DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                    <p className="text-sm font-bold text-slate-300">Materiali Disponibili ({materials.length}):</p>
                    <div className="max-h-40 overflow-y-auto space-y-2 pr-2 custom-scrollbar p-2 bg-black/20 rounded-lg">
                        {materials.length === 0 ? (
                            <div className="flex flex-col items-center py-4 text-red-400 gap-2">
                                <AlertTriangle className="w-6 h-6"/>
                                <span className="text-xs">Inventario vuoto! Scansiona o compra materiali.</span>
                            </div>
                        ) : (
                            materials.map(m => (
                                <div key={m.id} className="flex justify-between items-center p-2 bg-slate-900 rounded border border-slate-800">
                                    <span className="text-sm flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> {m.name || "Materiale Sconosciuto"}</span>
                                    <Badge variant="outline" className="border-slate-600">x{m.quantity}</Badge>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <Button onClick={createProject} disabled={materials.length === 0} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-12">
                    <Zap className="w-4 h-4 mr-2"/> AVVIA COSTRUZIONE
                </Button>
            </DialogContent>
        </Dialog>
    </div>
  );
}
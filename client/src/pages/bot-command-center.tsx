import React, { useState, useContext } from 'react';
import { BotContext } from "@/context/bot-context";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Database, Terminal, ShieldAlert, Trash2, RefreshCw, AlertTriangle, Lock } from 'lucide-react';
import { useLocation } from "wouter";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, deleteDoc, writeBatch } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function BotCommandCenter() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showResetModal, setShowResetModal] = useState(false);
  const [pin, setPin] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Recupero Context Sicuro
  let contextData = null;
  try { contextData = useContext(BotContext); } catch(e) { console.error(e); }
  
  const safeData = contextData || { status: "Offline", stats: { mined: 0, target: "N/A" }, logs: [], isBotActive: false, addLog: () => {} };

  const confirmReset = async () => {
      if (pin !== "2603") {
          toast({ title: "PIN ERRATO", variant: "destructive" });
          return;
      }
      setIsDeleting(true);
      safeData.addLog(`AVVIO PROTOCOLLO PURGE TOTALE...`);

      try {
          const batch = writeBatch(db);
          let deletedCount = 0;

          // 1. CANCELLA REPOSITORY (Materiali)
          const repoQ = query(collection(db, "repository"), where("source", "==", "EcoBot_v3"));
          const repoSnaps = await getDocs(repoQ);
          repoSnaps.forEach((doc) => { batch.delete(doc.ref); deletedCount++; });

          // 2. CANCELLA PROGETTI SEGRETI
          const secretQ = query(collection(db, "secret_projects_db")); // Cancella tutto qui, è database di test
          const secretSnaps = await getDocs(secretQ);
          secretSnaps.forEach((doc) => { batch.delete(doc.ref); deletedCount++; });

          // Esegui cancellazione
          await batch.commit();

          safeData.addLog(`PURGE COMPLETATO: Rimossi ${deletedCount} record.`);
          toast({ title: "Reset Completato", description: `${deletedCount} elementi rimossi.` });

      } catch (error) {
          console.error(error);
          safeData.addLog(`ERRORE CRITICO: ${error.message}`);
      } finally {
          setIsDeleting(false);
          setShowResetModal(false);
          setPin("");
      }
  };

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-4 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center border-b border-green-900/50 pb-4">
            <h1 className="text-2xl font-bold flex items-center gap-3 text-green-400">
                <ShieldAlert className="w-8 h-8 animate-pulse" /> QUANTUM COMMAND v3.0
            </h1>
            <div className="flex gap-2">
                <Button variant="destructive" onClick={() => setShowResetModal(true)} className="border-red-500 bg-red-900/20 text-red-500 hover:bg-red-900/50">
                    <Trash2 className="w-4 h-4 mr-2" /> PURGE DB
                </Button>
                <Button variant="outline" onClick={() => setLocation('/dashboard')} className="border-green-900 text-green-500">USCITA</Button>
            </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
            <Card className="bg-black/80 border-green-800"><CardHeader className="pb-2 text-xs text-green-600">STATO</CardHeader><CardContent className="text-xl text-green-300">{safeData.status}</CardContent></Card>
            <Card className="bg-black/80 border-green-800"><CardHeader className="pb-2 text-xs text-green-600">TARGET</CardHeader><CardContent className="text-xl text-yellow-400">{safeData.stats?.target || "Attesa"}</CardContent></Card>
            <Card className="bg-black/80 border-green-800"><CardHeader className="pb-2 text-xs text-green-600">REPOSITORY</CardHeader><CardContent className="text-3xl text-blue-400 flex gap-2"><Database/> {safeData.stats?.mined || 0}</CardContent></Card>
        </div>

        <Card className="bg-black border-green-800 h-96 flex flex-col">
            <CardHeader className="bg-green-900/10 py-2 text-green-500 flex gap-2"><Terminal className="w-4 h-4" /> KERNEL LOGS</CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-1 text-xs">
                {safeData.logs.map((log, i) => <div key={i} className="text-green-300 border-l-2 border-green-900 pl-2">{log}</div>)}
            </CardContent>
        </Card>
      </div>

      <Dialog open={showResetModal} onOpenChange={setShowResetModal}>
        <DialogContent className="bg-black border-red-800 text-red-500 font-mono">
            <DialogHeader><DialogTitle>PROTOCOLLO CANCELLAZIONE</DialogTitle></DialogHeader>
            <Input type="password" placeholder="PIN MASTER" className="bg-red-950/30 border-red-800 text-center text-xl tracking-[1em]" value={pin} onChange={(e) => setPin(e.target.value)} maxLength={4} />
            <DialogFooter>
                <Button variant="destructive" onClick={confirmReset} disabled={isDeleting} className="w-full bg-red-700">CONFERMA PURGE</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
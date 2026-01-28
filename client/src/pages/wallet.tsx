import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, CreditCard, Gift, ShieldCheck, Wallet as WalletIcon, ArrowRight, Loader2, Coins } from 'lucide-react';
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, increment, collection, query, where, getDocs, writeBatch } from "firebase/firestore";

export default function WalletPage() {
  const { toast } = useToast();
  const [userCredits, setUserCredits] = useState(0); 
  const [redeemCode, setRedeemCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      const fetchCredits = async () => {
          if(!auth.currentUser) return;
          const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
          if(snap.exists()) setUserCredits(snap.data().credits || 0);
      };
      fetchCredits();
  }, []);

  const handleRedeemCode = async () => {
      if (!redeemCode || !auth.currentUser) return;
      setLoading(true);
      
      try {
          const q = query(collection(db, "redemption_codes"), where("code", "==", redeemCode));
          const snapshot = await getDocs(q);

          if (snapshot.empty) {
              toast({ title: "Codice Inesistente", variant: "destructive" });
              setLoading(false); return;
          }

          const codeDoc = snapshot.docs[0];
          const codeData = codeDoc.data();

          if (codeData.redeemedBy && codeData.redeemedBy.includes(auth.currentUser.uid)) {
              toast({ title: "Codice già utilizzato da te!", variant: "destructive" });
              setLoading(false); return;
          }

          // Riscatta
          const batch = writeBatch(db);
          const userRef = doc(db, "users", auth.currentUser.uid);
          
          if (codeData.credits > 0) batch.update(userRef, { credits: increment(codeData.credits) });
          batch.update(codeDoc.ref, { redeemedBy: [...(codeData.redeemedBy || []), auth.currentUser.uid] });

          await batch.commit();
          
          // Feedback Utente
          let msg = "Successo!";
          if (codeData.credits) msg += ` +${codeData.credits} QC`;
          if (codeData.items && codeData.items.length) msg += ` +${codeData.items.join(", ")}`;
          if (codeData.pass) msg += " +Pass Evento";

          if(codeData.credits > 0) setUserCredits(p => p + codeData.credits);
          toast({ title: "RISCATTATO! 🎉", description: msg, className: "bg-purple-600 text-white border-none" });
          setRedeemCode("");

      } catch (e) {
          console.error(e);
          toast({ title: "Errore di Sistema", description: "Riprova più tardi.", variant: "destructive" });
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen text-white animate-in fade-in pb-20">
        {/* ... Header Wallet e Tabs ... (Identici a prima, solo logica fixata sopra) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 bg-gradient-to-r from-[#1a1d2d] to-[#0f111a] p-8 rounded-3xl border border-cyan-500/20 shadow-2xl">
            <div><h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3"><WalletIcon className="w-8 h-8 text-cyan-400"/> Quantum Wallet</h1></div>
            <div className="bg-black/40 p-6 rounded-2xl border border-cyan-500/50 text-center min-w-[200px]"><div className="text-sm text-cyan-300 font-bold uppercase mb-1 flex items-center justify-center gap-2"><Zap className="w-4 h-4"/> Saldo</div><div className="text-5xl font-black text-white">{userCredits} <span className="text-2xl text-cyan-400">QC</span></div></div>
        </div>

        <Tabs defaultValue="redeem" className="w-full space-y-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-[#1a1d2d] border border-slate-700 h-12"><TabsTrigger value="buy">Acquista</TabsTrigger><TabsTrigger value="redeem">Riscatta</TabsTrigger></TabsList>
            
            <TabsContent value="buy">
                {/* Cards Acquisto (Mock) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">{[{c:500,p:"4.99"},{c:1200,p:"9.99"},{c:3000,p:"19.99"},{c:7500,p:"49.99"}].map((pkg, i) => (
                    <Card key={i} className="bg-gradient-to-b from-slate-700 to-slate-900 border-slate-700 group hover:scale-105 transition-all cursor-pointer">
                        <CardHeader className="text-center"><Coins className="w-8 h-8 text-yellow-400 mx-auto mb-2"/><CardTitle className="text-3xl font-black text-white">{pkg.c}</CardTitle></CardHeader>
                        <CardFooter><Button className="w-full bg-white/10 hover:bg-white/30 text-white font-bold">€ {pkg.p}</Button></CardFooter>
                    </Card>
                ))}</div>
            </TabsContent>

            <TabsContent value="redeem">
                <Card className="bg-[#1a1d2d] border-slate-700 max-w-xl mx-auto shadow-2xl">
                    <CardContent className="space-y-4 pt-6">
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <Input 
                                    placeholder="CODICE (es. QM-C500...)" 
                                    className="bg-black/30 border-slate-600 text-white h-14 text-lg pl-10 uppercase font-mono" 
                                    value={redeemCode} 
                                    onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                                />
                                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5"/>
                            </div>
                            <Button onClick={handleRedeemCode} disabled={loading || !redeemCode} className="h-14 px-8 bg-purple-600 hover:bg-purple-500 text-white font-bold">
                                {loading ? <Loader2 className="w-5 h-5 animate-spin"/> : <ArrowRight className="w-6 h-6"/>}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}
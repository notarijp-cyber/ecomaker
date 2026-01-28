import React, { useState, useEffect } from 'react';
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gavel, Clock, Trophy, TrendingUp, Plus, ArrowLeft, Loader2, DollarSign } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { db, auth } from "@/lib/firebase"; 
import { collection, query, orderBy, onSnapshot, addDoc, doc, updateDoc, increment, getDoc, runTransaction } from "firebase/firestore";

export default function AuctionHouse() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [auctions, setAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState<{[key: string]: string}>({});

  // LISTENER ASTE LIVE
  useEffect(() => {
    const q = query(collection(db, "auctions"), orderBy("endTime", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const activeAuctions = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        // Filtra solo quelle attive (data fine > oggi)
        const now = new Date();
        setAuctions(activeAuctions.filter((a: any) => a.endTime?.toDate() > now));
        setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // PIAZZA OFFERTA (TRANSAZIONE SICURA)
  const handleBid = async (auctionId: string, currentBid: number) => {
      if(!auth.currentUser) return;
      const myBid = parseInt(bidAmount[auctionId]);

      if (!myBid || myBid <= currentBid) {
          toast({ title: "Offerta troppo bassa", description: "Devi superare l'offerta attuale.", variant: "destructive" });
          return;
      }

      try {
          await runTransaction(db, async (transaction) => {
              // 1. Leggi User e Asta
              const userRef = doc(db, "users", auth.currentUser!.uid);
              const auctionRef = doc(db, "auctions", auctionId);
              const userSnap = await transaction.get(userRef);
              const auctionSnap = await transaction.get(auctionRef);

              if (!userSnap.exists() || !auctionSnap.exists()) throw "Dati mancanti";

              const userData = userSnap.data();
              const auctionData = auctionSnap.data();

              // 2. Verifica Crediti
              if (userData.credits < myBid) throw "Crediti insufficienti";
              if (myBid <= auctionData.currentBid) throw "Qualcuno ha già rilanciato!";

              // 3. Esegui: Scala soldi (bloccati), Aggiorna Asta
              transaction.update(userRef, { credits: increment(-myBid) }); 
              // Nota: In un sistema reale, dovresti rimborsare l'offerente precedente qui.
              transaction.update(auctionRef, { 
                  currentBid: myBid, 
                  highestBidder: auth.currentUser!.uid,
                  bidsCount: increment(1)
              });
          });

          toast({ title: "OFFERTA PIAZZATA! 🔨", description: `Sei in testa con ${myBid} QC.`, className: "bg-green-600 text-white" });
          setBidAmount({...bidAmount, [auctionId]: ""});

      } catch (e: any) {
          toast({ title: "Errore Offerta", description: e.toString(), variant: "destructive" });
      }
  };

  // CREA ASTA FINTA (PER TEST)
  const createMockAuction = async () => {
      if(!auth.currentUser) return;
      const end = new Date();
      end.setHours(end.getHours() + 24); // Scade tra 24h

      await addDoc(collection(db, "auctions"), {
          itemName: "Prototipo Eco-Drone",
          seller: auth.currentUser.uid,
          sellerName: auth.currentUser.displayName || "Maker",
          currentBid: 100,
          highestBidder: null,
          endTime: end,
          bidsCount: 0,
          image: "🛸",
          createdAt: new Date()
      });
      toast({ title: "Asta Creata (Test)", className: "bg-yellow-600 text-black" });
  };

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen text-white pb-20 animate-in fade-in">
        
        <div className="flex justify-between items-end mb-8">
            <div>
                <Button variant="ghost" onClick={() => setLocation('/market-hub')} className="text-slate-400 pl-0 mb-2"><ArrowLeft className="mr-2 h-4 w-4"/> Market Hub</Button>
                <h1 className="text-4xl font-black text-white flex items-center gap-3"><Gavel className="w-10 h-10 text-yellow-500" /> CASA D'ASTE</h1>
            </div>
            <Button onClick={createMockAuction} className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold border border-yellow-400">
                <Plus className="w-4 h-4 mr-2"/> VENDI OGGETTO
            </Button>
        </div>

        <Tabs defaultValue="live" className="w-full space-y-6">
            <TabsList className="bg-slate-900 border border-slate-800">
                <TabsTrigger value="live" className="data-[state=active]:bg-yellow-900/50 data-[state=active]:text-yellow-400 font-bold">ASTE LIVE 🔥</TabsTrigger>
                <TabsTrigger value="my" className="data-[state=active]:bg-slate-800">LE MIE OFFERTE</TabsTrigger>
            </TabsList>

            <TabsContent value="live">
                {loading ? <div className="flex justify-center p-10"><Loader2 className="animate-spin text-yellow-500"/></div> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {auctions.length === 0 && <div className="col-span-full text-center py-20 text-slate-500 italic">Nessuna asta attiva. Clicca "Vendi Oggetto" per testare.</div>}
                        
                        {auctions.map((auc) => (
                            <Card key={auc.id} className="bg-[#1a1d2d] border-slate-700 hover:border-yellow-500/50 transition-all group shadow-lg">
                                <CardHeader className="relative">
                                    <Badge className="absolute top-4 right-4 bg-red-600 animate-pulse">LIVE</Badge>
                                    <div className="h-32 bg-black/30 rounded-lg flex items-center justify-center text-6xl mb-4 group-hover:scale-105 transition-transform">
                                        {auc.image}
                                    </div>
                                    <CardTitle className="text-xl text-white">{auc.itemName}</CardTitle>
                                    <div className="flex justify-between items-center mt-2 text-sm text-slate-400">
                                        <span className="flex items-center gap-1"><Trophy className="w-3 h-3 text-yellow-500"/> Venditore: {auc.sellerName}</span>
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {new Date(auc.endTime.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="bg-black/20 py-4">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-xs text-slate-500 uppercase font-bold">Offerta Attuale</span>
                                        <span className="text-2xl font-black text-yellow-400">{auc.currentBid} QC</span>
                                    </div>
                                    <div className="text-xs text-slate-500 text-right mb-4">{auc.bidsCount} rilanci</div>
                                    
                                    <div className="flex gap-2">
                                        <Input 
                                            type="number" 
                                            placeholder={`Min ${auc.currentBid + 10}`} 
                                            className="bg-black/50 border-slate-600 text-white"
                                            value={bidAmount[auc.id] || ""}
                                            onChange={(e) => setBidAmount({...bidAmount, [auc.id]: e.target.value})}
                                        />
                                        <Button 
                                            onClick={() => handleBid(auc.id, auc.currentBid)} 
                                            className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold px-6"
                                        >
                                            RILANCIA
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </TabsContent>

            <TabsContent value="my">
                <div className="text-center py-20 bg-[#1a1d2d] rounded-xl border border-dashed border-slate-700 text-slate-500">
                    Non stai partecipando a nessuna asta.
                </div>
            </TabsContent>
        </Tabs>
    </div>
  );
}
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Search, Hammer, Layers, PenTool, ArrowLeft, Store, Send, MapPin, ExternalLink, Smile, Loader2, Lock } from 'lucide-react';
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { db, auth } from "@/lib/firebase"; 
import { collection, query, where, getDocs, orderBy, onSnapshot, doc, updateDoc, increment, arrayUnion, getDoc } from "firebase/firestore";

const MOCK_ITEMS = [
    { id: 'm1', item: "Trapano a percussione", type: "tools", user: "MarioRossi", price_offer: "45 QC", distance: "2km" },
    { id: 'm2', item: "Pallet integri", type: "materials", user: "WoodMaster", price_offer: "Scambio", distance: "10km" }
];

export default function Marketplace() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("tools");
  
  const [marketItems, setMarketItems] = useState<any[]>([]);
  const [emotes, setEmotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  // CHAT
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatPartner, setChatPartner] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // LISTENER REAL-TIME
  useEffect(() => {
    const qEmotes = query(collection(db, "store_items"), where("type", "==", "emote"));
    const unsubEmotes = onSnapshot(qEmotes, (snap) => {
        const liveData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setEmotes(liveData);
        setLoading(false);
    });

    const qMarket = query(collection(db, "market_listings"), orderBy("createdAt", "desc"));
    const unsubMarket = onSnapshot(qMarket, (snap) => {
        const liveMarket = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setMarketItems(liveMarket.length > 0 ? liveMarket : MOCK_ITEMS);
    });

    return () => { unsubEmotes(); unsubMarket(); };
  }, []);

  // --- FUNZIONE DI ACQUISTO REALE ---
  const buyEmote = async (emote: any) => {
      if(!auth.currentUser) return;
      setPurchasing(true);

      try {
          const userRef = doc(db, "users", auth.currentUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (!userSnap.exists()) {
              toast({ title: "Errore User", variant: "destructive" });
              setPurchasing(false); return;
          }

          const userData = userSnap.data();
          const currentCredits = userData.credits || 0;

          // 1. Controllo Crediti
          if (currentCredits < emote.price) {
              toast({ title: "Crediti Insufficienti", description: `Ti servono altri ${emote.price - currentCredits} QC.`, variant: "destructive" });
              setPurchasing(false); return;
          }

          // 2. Controllo se già posseduto (evita doppi acquisti)
          const inventory = userData.inventory || [];
          const alreadyOwns = inventory.some((item: any) => item.name === emote.name);
          if (alreadyOwns) {
              toast({ title: "Già Posseduto!", description: "Hai già questo oggetto nell'inventario.", variant: "default" });
              setPurchasing(false); return;
          }

          // 3. Esegui Transazione
          await updateDoc(userRef, {
              credits: increment(-emote.price),
              inventory: arrayUnion({
                  id: emote.id,
                  name: emote.name,
                  icon: emote.icon,
                  rarity: emote.rarity,
                  type: 'emote',
                  purchasedAt: new Date()
              })
          });

          toast({ title: "Acquisto Riuscito! 🎉", description: `Hai ottenuto: ${emote.name}. Controlla l'inventario.`, className: "bg-green-600 text-white border-none" });

      } catch (e) {
          console.error(e);
          toast({ title: "Errore Transazione", description: "Riprova più tardi.", variant: "destructive" });
      } finally {
          setPurchasing(false);
      }
  };

  const filteredItems = marketItems.filter(item => 
      (item.type === activeTab || (!item.type && activeTab === 'tools')) && 
      (item.item || item.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openChat = (user: string, item: string) => { setChatPartner(user); setMessages([{ sender: "me", text: `Ciao! Ho visto che cerchi "${item}".` }]); setIsChatOpen(true); };
  const sendMessage = () => { if (!newMessage.trim()) return; setMessages(p => [...p, { sender: "me", text: newMessage }]); setNewMessage(""); };
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen text-white pb-20 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
          <div><Button variant="ghost" onClick={() => setLocation('/market-hub')} className="text-slate-400 pl-0 mb-2"><ArrowLeft className="mr-2 h-4 w-4"/> Market Hub</Button><h1 className="text-4xl font-black text-white flex items-center gap-3"><Store className="w-10 h-10 text-cyan-400" /> MARKETPLACE</h1></div>
          <div className="relative w-full md:w-auto"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"/><Input placeholder="Cerca..." className="pl-10 bg-black/50 border-slate-700 w-full md:w-64" onChange={(e) => setSearchTerm(e.target.value)}/></div>
      </div>

      {/* EMOTICON STORE */}
      <div className="mb-10 space-y-4">
          <div className="flex items-center justify-between"><h2 className="text-xl font-bold flex items-center gap-2"><Smile className="text-purple-400"/> Emoticon Store</h2><Badge className="bg-purple-900/30 text-purple-400">LIVE</Badge></div>
          {loading ? <Loader2 className="animate-spin text-purple-500"/> : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {emotes.length === 0 && <div className="col-span-full text-center py-10 bg-[#1a1d2d] rounded-xl border border-dashed border-slate-700"><p className="text-slate-500">Nessuna emoticon in vendita.</p></div>}
                  {emotes.map((emote) => (
                      <Card key={emote.id} className="bg-[#1a1d2d] border-slate-800 p-4 hover:border-purple-500/50 transition-all group cursor-pointer relative overflow-hidden shadow-md hover:shadow-purple-900/20">
                          {emote.discount > 0 && <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-2 py-1">-{emote.discount}%</div>}
                          <div className="h-24 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">{emote.icon}</div>
                          <div className="p-3 text-center bg-black/40 rounded-lg"><p className="font-bold text-white text-sm truncate">{emote.name}</p><p className="text-xs text-purple-400 font-mono mt-1">{emote.price} QC</p><Badge variant="outline" className="text-[10px] mt-2 border-slate-600 text-slate-400">{emote.rarity}</Badge></div>
                          <Button 
                            size="sm" 
                            className="w-full mt-3 bg-slate-700 hover:bg-purple-600 text-xs font-bold h-8 transition-colors" 
                            onClick={() => buyEmote(emote)}
                            disabled={purchasing}
                          >
                            {purchasing ? <Loader2 className="w-3 h-3 animate-spin"/> : "ACQUISTA"}
                          </Button>
                      </Card>
                  ))}
              </div>
          )}
      </div>

      <Tabs defaultValue="tools" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-900 border border-slate-800 h-14 p-1 rounded-xl mb-6">
              <TabsTrigger value="tools" className="data-[state=active]:bg-cyan-700 data-[state=active]:text-white font-bold"><Hammer className="w-4 h-4 mr-2"/> TOOLS</TabsTrigger>
              <TabsTrigger value="materials" className="data-[state=active]:bg-green-700 data-[state=active]:text-white font-bold"><Layers className="w-4 h-4 mr-2"/> MATERIALI</TabsTrigger>
              <TabsTrigger value="consumables" className="data-[state=active]:bg-purple-700 data-[state=active]:text-white font-bold"><PenTool className="w-4 h-4 mr-2"/> MIX</TabsTrigger>
          </TabsList>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((req) => (
                  <Card key={req.id} className="bg-[#1a1d2d] border-slate-700 hover:border-cyan-500/50 transition-all group shadow-lg">
                      <CardHeader className="pb-2">
                          <div className="flex justify-between items-start mb-2"><Badge variant="outline" className="text-slate-400 border-slate-600 flex gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> {req.user}</Badge><span className="text-xs text-slate-500 flex items-center"><MapPin className="w-3 h-3 mr-1"/> {req.distance}</span></div>
                          <CardTitle className="text-xl text-white truncate">{req.item || req.name}</CardTitle><p className="text-sm text-cyan-400 font-bold">Offerta: {req.price_offer}</p>
                      </CardHeader>
                      <CardFooter className="pt-4 border-t border-slate-800 bg-black/20 flex flex-col gap-2"><Button className="w-full bg-green-600 hover:bg-green-500 font-bold h-9" onClick={() => openChat(req.user, req.item || req.name)}><MessageCircle className="w-4 h-4 mr-2"/> CONTATTA</Button></CardFooter>
                  </Card>
              ))}
          </div>
      </Tabs>
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
          <DialogContent className="bg-[#0f111a] border-slate-700 text-white sm:max-w-md h-[70vh] flex flex-col p-0"><div className="flex-1 overflow-y-auto p-4 space-y-3 bg-black/20">{messages.map((msg, i) => (<div key={i} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'me' ? 'bg-cyan-600 text-white rounded-tr-none' : 'bg-[#1a1d2d] border border-slate-700 rounded-tl-none'}`}>{msg.text}</div></div>))}</div><div className="p-3 border-t border-slate-800 bg-[#1a1d2d] flex gap-2"><Input className="bg-black/50 border-slate-600" placeholder="Scrivi..." value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} /><Button size="icon" className="bg-cyan-600" onClick={sendMessage}><Send className="w-4 h-4"/></Button></div></DialogContent>
      </Dialog>
    </div>
  );
}
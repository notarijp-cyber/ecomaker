import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Box, Smile, CheckCircle, Search, Shield, Zap, Recycle, Minus, Plus, Trash2, ArrowRight, Camera } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { auth, db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc, collection, query, orderBy, deleteDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";

export default function Inventory() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<any>(null);
  
  // Dati
  const [materials, setMaterials] = useState<any[]>([]); // Materiali fisici (Scan)
  const [digitalItems, setDigitalItems] = useState<any[]>([]); // Oggetti digitali (Market)
  const [equippedEmote, setEquippedEmote] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. CARICAMENTO DATI (Combinato)
  useEffect(() => {
    if (!auth.currentUser) return;
    setUser(auth.currentUser);

    // A) Listener Materiali Fisici (Collection 'inventory')
    const qMaterials = query(collection(db, "users", auth.currentUser.uid, "inventory"), orderBy("scannedAt", "desc"));
    const unsubMaterials = onSnapshot(qMaterials, (snap) => {
        setMaterials(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // B) Listener Oggetti Digitali & Profilo (Doc 'users')
    const userRef = doc(db, "users", auth.currentUser.uid);
    const unsubUser = onSnapshot(userRef, (snap) => {
        if (snap.exists()) {
            const data = snap.data();
            setDigitalItems(data.inventory || []); // Array di oggetti comprati
            setEquippedEmote(data.equippedEmote || null);
        }
        setLoading(false);
    });

    return () => { unsubMaterials(); unsubUser(); };
  }, []);

  // 2. LOGICA EQUIPAGGIAMENTO (Solo per Emoticon)
  const handleEquip = async (item: any) => {
      if (!auth.currentUser) return;
      try {
          const userRef = doc(db, "users", auth.currentUser.uid);
          await updateDoc(userRef, { equippedEmote: item.icon });
          toast({ title: "Equipaggiato!", description: `${item.name} è ora il tuo avatar attivo.`, className: "bg-cyan-600 text-white" });
      } catch (e) {
          toast({ title: "Errore", variant: "destructive" });
      }
  };

  // 3. LOGICA GESTIONE MATERIALI (Quantità)
  const updateQuantity = async (itemId: string, currentQty: number, change: number, e: React.MouseEvent) => {
      e.preventDefault(); e.stopPropagation();
      if (!auth.currentUser) return;
      const newQty = (currentQty || 1) + change;
      
      if (newQty < 1) {
          if (window.confirm("Rimuovere definitivamente questo materiale?")) {
              await deleteDoc(doc(db, "users", auth.currentUser.uid, "inventory", itemId));
              toast({ title: "Materiale rimosso", variant: "default" });
          }
          return;
      }
      await updateDoc(doc(db, "users", auth.currentUser.uid, "inventory", itemId), { quantity: newQty });
  };

  // FILTRI
  const filteredMaterials = materials.filter(m => (m.name || "").toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredDigital = digitalItems.filter(i => (i.name || "").toLowerCase().includes(searchTerm.toLowerCase()));
  
  // Separazione oggetti digitali per tipo
  const emotes = filteredDigital.filter(i => i.type === 'emote');
  // const skins = filteredDigital.filter(i => i.type === 'skin'); // Futuro

  if (loading) return <div className="flex justify-center h-screen items-center text-cyan-500 animate-pulse"><Box className="w-12 h-12 mb-4"/></div>;

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen text-white pb-20 animate-in fade-in">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
            <div>
                <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3"><Box className="w-10 h-10 text-cyan-400"/> INVENTARIO</h1>
                <p className="text-slate-400">Gestisci le tue risorse fisiche e i tuoi oggetti digitali.</p>
            </div>
            <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input placeholder="Cerca oggetto..." className="pl-10 bg-black/50 border-slate-700 w-full text-white" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
            </div>
        </div>

        <Tabs defaultValue="materials" className="w-full space-y-6">
            <TabsList className="bg-slate-900 border border-slate-800 w-full md:w-auto inline-flex p-1 h-12">
                <TabsTrigger value="materials" className="flex-1 md:w-40 font-bold data-[state=active]:bg-cyan-900 data-[state=active]:text-white"><Recycle className="w-4 h-4 mr-2"/> MATERIALI</TabsTrigger>
                <TabsTrigger value="digital" className="flex-1 md:w-40 font-bold data-[state=active]:bg-purple-900 data-[state=active]:text-white"><Smile className="w-4 h-4 mr-2"/> DIGITALI</TabsTrigger>
            </TabsList>

            {/* TAB 1: MATERIALI FISICI (LOGICA VECCHIA MIGLIORATA) */}
            <TabsContent value="materials">
                {filteredMaterials.length === 0 ? (
                    <div className="text-center py-20 bg-[#1a1d2d] rounded-xl border border-dashed border-slate-700">
                        <Recycle className="w-16 h-16 text-slate-600 mx-auto mb-4 opacity-50"/>
                        <h3 className="text-xl font-bold text-white mb-2">Nessun materiale</h3>
                        <p className="text-slate-500 mb-6">Scansiona rifiuti o acquistali nel market.</p>
                        <Button className="bg-cyan-600 hover:bg-cyan-500 text-white" onClick={() => setLocation('/ar-material-scan')}><Camera className="w-4 h-4 mr-2"/> SCANSIONA ORA</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredMaterials.map((item) => (
                            <Link key={item.id} href={`/material-detail/${item.id}`}>
                                <Card className="border-0 bg-[#1a1d2d] overflow-hidden flex flex-col group transition-all hover:scale-105 cursor-pointer shadow-lg hover:shadow-cyan-500/10">
                                    <div className="relative h-32 flex items-center justify-center overflow-hidden" style={{ backgroundColor: item.recycleColor || "#334155" }}>
                                        <Recycle className="w-16 h-16 text-black/20 group-hover:rotate-180 transition-transform duration-700" />
                                        <Badge className="absolute bottom-2 right-2 bg-black/40 border-none backdrop-blur-sm">{item.category || "Materiale"}</Badge>
                                    </div>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg text-white truncate">{item.name || item.commonName}</CardTitle>
                                        <p className="text-xs text-slate-400 font-mono truncate">{item.disposalRule || "Indifferenziato"}</p>
                                    </CardHeader>
                                    <CardFooter className="mt-auto pt-4 border-t border-slate-800 bg-black/20 flex justify-between items-center">
                                        <div className="flex items-center gap-1 bg-slate-900 rounded-lg p-1 border border-slate-700" onClick={(e) => e.stopPropagation()}>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-red-400" onClick={(e) => updateQuantity(item.id, item.quantity, -1, e)}><Minus className="w-3 h-3" /></Button>
                                            <span className="font-bold text-white w-8 text-center tabular-nums">{item.quantity || 1}</span>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-green-400" onClick={(e) => updateQuantity(item.id, item.quantity, 1, e)}><Plus className="w-3 h-3" /></Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </TabsContent>

            {/* TAB 2: OGGETTI DIGITALI (EMOTICON & SKINS) */}
            <TabsContent value="digital">
                {emotes.length === 0 ? (
                    <div className="text-center py-20 bg-[#1a1d2d] rounded-xl border border-dashed border-slate-700">
                        <Smile className="w-16 h-16 text-slate-600 mx-auto mb-4 opacity-50"/>
                        <h3 className="text-xl font-bold text-white mb-2">Inventario Digitale Vuoto</h3>
                        <p className="text-slate-500 mb-6">Non possiedi ancora Emoticon o Skin.</p>
                        <Button className="bg-purple-600 hover:bg-purple-500 text-white" onClick={() => setLocation('/marketplace')}>VAI ALLO STORE</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {emotes.map((item, i) => (
                            <Card key={i} className={`bg-[#1a1d2d] border-slate-800 p-4 relative group hover:border-purple-500/50 transition-all ${equippedEmote === item.icon ? 'border-green-500 ring-1 ring-green-500 bg-green-900/10' : ''}`}>
                                {equippedEmote === item.icon && <div className="absolute top-2 right-2 bg-green-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg z-10"><CheckCircle className="w-3 h-3"/> ATTIVO</div>}
                                
                                <div className="h-24 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]">{item.icon}</div>
                                
                                <div className="mt-2 text-center relative z-10">
                                    <p className="font-bold text-white text-sm truncate">{item.name}</p>
                                    <Badge variant="outline" className="mt-1 text-[10px] border-slate-600 text-slate-400">{item.rarity || "Comune"}</Badge>
                                </div>
                                
                                <Button 
                                    size="sm" 
                                    onClick={() => handleEquip(item)} 
                                    className={`w-full mt-3 text-xs font-bold h-8 ${equippedEmote === item.icon ? 'bg-slate-800 text-slate-500 cursor-default' : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg'}`} 
                                    disabled={equippedEmote === item.icon}
                                >
                                    {equippedEmote === item.icon ? "EQUIPAGGIATO" : "EQUIPAGGIA"}
                                </Button>
                            </Card>
                        ))}
                    </div>
                )}
            </TabsContent>
        </Tabs>
    </div>
  );
}
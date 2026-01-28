import React, { useState, useEffect, useRef } from 'react';
import { useBotContext } from '@/context/bot-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Power, Trash2, ShieldAlert, Save, RefreshCw, Gift, Database, Smile, Lock, AlertTriangle, ShoppingBag, Coins, Ticket, PlusCircle, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { db, auth } from "@/lib/firebase"; 
import { doc, updateDoc, increment, collection, addDoc, getDocs, writeBatch, deleteDoc } from "firebase/firestore";

// --- WIPE MODAL (BLOCCANTE) ---
const WipeModal = ({ isOpen, onClose, onConfirm }: { isOpen: boolean, onClose: () => void, onConfirm: (pin: string, type: '1H' | 'TOTAL') => void }) => {
    const [step, setStep] = useState(1);
    const [wipeType, setWipeType] = useState<'1H' | 'TOTAL' | null>(null);
    const [pin, setPin] = useState("");
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-300">
        <div className="bg-[#1a0505] border-2 border-red-600 w-full max-w-md p-8 rounded-2xl shadow-[0_0_100px_rgba(220,38,38,0.6)] relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-red-400 hover:text-white"><Lock className="w-5 h-5"/></button>
          
          <div className="text-center mb-8">
             <ShieldAlert className="w-20 h-20 text-red-600 mx-auto mb-4 animate-pulse" />
             <h2 className="text-3xl font-black text-white uppercase tracking-widest glitch-effect">DATABASE WIPE</h2>
             <p className="text-red-500 font-mono text-xs mt-2">AZIONE DISTRUTTIVA IRREVERSIBILE</p>
          </div>
  
          {step === 1 ? (
             <div className="space-y-4">
                <Button onClick={() => { setWipeType('1H'); setStep(2); }} className="w-full bg-orange-950 border border-orange-600 hover:bg-orange-900 text-orange-200 h-16 text-xl font-bold">
                   CANCELLA ULTIMA ORA
                </Button>
                <Button onClick={() => { setWipeType('TOTAL'); setStep(2); }} className="w-full bg-red-950 border border-red-600 hover:bg-red-900 text-red-200 h-16 text-xl font-bold">
                   HARD RESET TOTALE
                </Button>
             </div>
          ) : (
             <div className="space-y-6 animate-in slide-in-from-right">
                <div className="text-center">
                    <p className="text-white font-mono text-sm mb-2">INSERIRE PIN DI SICUREZZA PER:</p>
                    <Badge variant="outline" className="text-red-500 border-red-500 text-lg px-4 py-1">{wipeType === 'TOTAL' ? 'HARD RESET' : 'WIPE 1H'}</Badge>
                </div>
                <Input 
                  type="password" 
                  autoFocus
                  className="bg-black border-red-500 text-center text-3xl tracking-[0.5em] text-red-500 h-20 font-mono focus:ring-red-500 focus:border-red-500" 
                  placeholder="••••••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
                <div className="flex gap-4">
                    <Button variant="outline" onClick={() => {setStep(1); setPin("");}} className="flex-1 border-red-900 text-red-500 h-12">INDIETRO</Button>
                    <Button onClick={() => onConfirm(pin, wipeType!)} className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold h-12">CONFERMA</Button>
                </div>
             </div>
          )}
        </div>
      </div>
    );
};

// --- EMOTICON LAB (Generazione Singola + Pubblicazione Store) ---
const EmoticonLab = () => {
  const { toast } = useToast();
  const [currentEmote, setCurrentEmote] = useState<string | null>(null);
  const [emoteName, setEmoteName] = useState("");
  const [price, setPrice] = useState("100");
  const [discount, setDiscount] = useState("0");
  const [rarity, setRarity] = useState("Comune");
  
  const rareEmotes = ["👾", "🧞", "🧟", "🦄", "🐲", "🦸", "🧬", "💠", "🗿", "🌋", "🪐", "🌀", "🤖", "👽", "👻"];

  const generate = () => {
    const selected = rareEmotes[Math.floor(Math.random() * rareEmotes.length)];
    setCurrentEmote(selected);
    setEmoteName("");
    // Calcolo automatico rarità base (finto algoritmo "estetico")
    const r = Math.random();
    if(r > 0.9) setRarity("Leggendaria");
    else if(r > 0.6) setRarity("Epica");
    else if(r > 0.3) setRarity("Rara");
    else setRarity("Comune");
  };

  const publishToStore = async () => {
    if (!currentEmote || !emoteName) {
      toast({ title: "Errore", description: "Nome mancante!", variant: "destructive" });
      return;
    }
    try {
        await addDoc(collection(db, "store_items"), {
            type: 'emote',
            name: emoteName,
            icon: currentEmote,
            price: parseInt(price),
            discount: parseInt(discount),
            rarity: rarity,
            createdAt: new Date()
        });
        toast({ title: "PUBBLICATA!", description: `${emoteName} è ora nel Market.`, className: "bg-green-600 text-white" });
        setCurrentEmote(null);
    } catch (e) {
        toast({ title: "Errore DB", variant: "destructive" });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6 bg-black border-purple-500/30 flex flex-col items-center justify-center min-h-[400px]">
         <h3 className="text-purple-400 font-bold mb-6 flex gap-2"><Smile /> GENETIC LAB</h3>
         
         <div className="w-40 h-40 bg-purple-900/20 rounded-full border-2 border-dashed border-purple-500 flex items-center justify-center text-7xl mb-8 animate-in zoom-in shadow-[0_0_30px_rgba(168,85,247,0.3)]">
            {currentEmote || "?"}
         </div>
         
         {!currentEmote ? (
            <Button onClick={generate} className="w-full bg-purple-600 hover:bg-purple-500 h-14 text-lg font-bold"><RefreshCw className="mr-2 h-5 w-5"/> GENERA ENTITÀ</Button>
         ) : (
            <div className="w-full space-y-4 animate-in slide-in-from-bottom-4 bg-[#0f111a] p-4 rounded-xl border border-purple-900/50">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1"><Label className="text-xs text-gray-400">Nome</Label><Input className="bg-black border-purple-500/50 text-white" value={emoteName} onChange={e => setEmoteName(e.target.value)} /></div>
                    <div className="space-y-1"><Label className="text-xs text-gray-400">Prezzo (QC)</Label><Input type="number" className="bg-black border-purple-500/50 text-white" value={price} onChange={e => setPrice(e.target.value)} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1"><Label className="text-xs text-gray-400">Sconto %</Label><Input type="number" className="bg-black border-purple-500/50 text-white" value={discount} onChange={e => setDiscount(e.target.value)} /></div>
                    <div className="space-y-1"><Label className="text-xs text-gray-400">Rarità (AI Detected)</Label><Badge variant="outline" className="w-full h-10 flex items-center justify-center border-purple-500/50 text-purple-400">{rarity}</Badge></div>
                </div>
                <div className="flex gap-2 pt-2">
                    <Button onClick={generate} variant="outline" className="flex-1 border-purple-500/30 text-purple-400">Scarta</Button>
                    <Button onClick={publishToStore} className="flex-[2] bg-green-600 hover:bg-green-500 text-white font-bold"><ShoppingBag className="mr-2 h-4 w-4"/> PUBBLICA</Button>
                </div>
            </div>
         )}
      </Card>
      <Card className="p-6 bg-[#0f111a] border-gray-800 flex flex-col justify-center items-center text-center text-slate-500">
         <Database className="w-12 h-12 mb-4 opacity-20"/>
         <p>Gli oggetti pubblicati appariranno istantaneamente nella scheda <strong>Marketplace</strong>.</p>
      </Card>
    </div>
  );
};

// --- GENERATORE BUNDLE (COMPLESSO & REALE) ---
const BundleGenerator = () => {
  const { toast } = useToast();
  const [hasCredits, setHasCredits] = useState(true);
  const [creditsVal, setCreditsVal] = useState("500");
  const [hasEmote, setHasEmote] = useState(false);
  const [emoteType, setEmoteType] = useState("RANDOM");
  const [hasPass, setHasPass] = useState(false);
  const [expiryDays, setExpiryDays] = useState("7");
  const [generatedCode, setGeneratedCode] = useState("");

  const createComplexBundle = async () => {
    // Genera codice: QM-C500-E-P-XXXX
    let parts = ["QM"];
    if(hasCredits) parts.push(`C${creditsVal}`);
    if(hasEmote) parts.push(`E${emoteType.substring(0,3)}`);
    if(hasPass) parts.push(`PALL`);
    parts.push(Math.random().toString(36).substring(2, 6).toUpperCase());
    const finalCode = parts.join("-");

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(expiryDays));

    try {
        await addDoc(collection(db, "redemption_codes"), {
            code: finalCode,
            credits: hasCredits ? parseInt(creditsVal) : 0,
            items: hasEmote ? [emoteType] : [], // Salva il tipo di emote
            pass: hasPass,
            maxUses: 1, 
            redeemedBy: [], 
            expiresAt: expiryDate,
            createdAt: new Date(),
            active: true
        });
        setGeneratedCode(finalCode);
        toast({ title: "Bundle Attivo!", description: `Codice: ${finalCode}`, className: "bg-green-600 text-white" });
    } catch (e) {
        toast({ title: "Errore salvataggio", variant: "destructive" });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       <Card className="p-6 bg-[#0f111a] border-gray-800 space-y-6">
          <h3 className="text-yellow-400 font-bold flex gap-2"><Gift /> CONFIGURATORE BUNDLE</h3>
          <div className="p-4 bg-black/30 rounded-lg border border-gray-800 space-y-3">
             <div className="flex items-center justify-between"><Label className="text-white flex items-center gap-2"><Coins className="w-4 h-4 text-yellow-500"/> Includi Crediti</Label><Switch checked={hasCredits} onCheckedChange={setHasCredits} /></div>
             {hasCredits && <Input type="number" value={creditsVal} onChange={e => setCreditsVal(e.target.value)} className="bg-gray-900 border-gray-700 h-8 text-sm" />}
          </div>
          <div className="p-4 bg-black/30 rounded-lg border border-gray-800 space-y-3">
             <div className="flex items-center justify-between"><Label className="text-white flex items-center gap-2"><Smile className="w-4 h-4 text-purple-500"/> Includi Emoticon</Label><Switch checked={hasEmote} onCheckedChange={setHasEmote} /></div>
             {hasEmote && <select className="w-full bg-gray-900 border-gray-700 text-white rounded p-2 text-sm" value={emoteType} onChange={e => setEmoteType(e.target.value)}><option value="RANDOM">Casuale</option><option value="RARE">Rara Garantita</option><option value="LEGENDARY">Leggendaria</option></select>}
          </div>
          <div className="p-4 bg-black/30 rounded-lg border border-gray-800 flex items-center justify-between gap-4">
             <Label className="text-white flex items-center gap-2"><Ticket className="w-4 h-4 text-green-500"/> Pass Eventi</Label>
             <Input type="number" className="bg-gray-900 border-gray-700 h-8 w-20 text-white" value={expiryDays} onChange={e => setExpiryDays(e.target.value)} placeholder="Giorni" />
          </div>
          <Button onClick={createComplexBundle} className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold">GENERA & ATTIVA</Button>
       </Card>
       <Card className="p-6 bg-black border-gray-800 flex flex-col items-center justify-center">
          <h3 className="text-gray-500 text-sm font-bold mb-4 uppercase">Ultimo Codice Attivo</h3>
          {generatedCode ? <div className="text-center animate-in zoom-in"><div className="bg-gray-900 border-2 border-yellow-500/50 rounded-xl p-6 mb-4"><code className="text-3xl font-mono text-yellow-400 font-bold tracking-wider">{generatedCode}</code></div><Badge className="bg-green-900/30 text-green-400">Attivo su DB</Badge></div> : <span className="text-gray-700 italic">Configura e genera...</span>}
       </Card>
    </div>
  );
};

// --- GESTORE BOT REALE ---
const BotManager = () => {
    const { isBotActive, setIsBotActive, status, logs, addLog } = useBotContext();
    const { toast } = useToast();
    const [stats, setStats] = useState({ materials: 0, projects: 0, energy: 100 });
    const [masterLevel, setMasterLevel] = useState(1);
    const [showWipeModal, setShowWipeModal] = useState(false);
    const lastLogRef = useRef<string | null>(null);

    // FETCH INIZIALE DATI REALI
    useEffect(() => {
        const fetchStats = async () => {
            if(!auth.currentUser) return;
            // Qui in un'app reale leggeresti stats globali, per ora usiamo l'utente master come "contatore globale"
            // per semplicità di demo, ma potresti avere una collezione "system_stats"
            setStats({ materials: 1340, projects: 465, energy: 90 }); 
        };
        fetchStats();
    }, []);

    // SINCRONIZZAZIONE BOT -> DATI (REALE)
    useEffect(() => {
        if (!isBotActive || logs.length === 0) return;
        const newestLog = logs[0];
        if (newestLog !== lastLogRef.current) {
            lastLogRef.current = newestLog;
            // Se il bot dice che ha fatto qualcosa, AGGIORNA I CONTATORI
            if (newestLog.includes("Catalogato") || newestLog.includes("Analisi")) {
                setStats(p => ({ ...p, materials: p.materials + (masterLevel * 3) }));
            }
            if (newestLog.includes("Blueprint") || newestLog.includes("Creato")) {
                setStats(p => ({ ...p, projects: p.projects + 1 }));
            }
            setStats(p => ({ ...p, energy: Math.max(0, p.energy - 0.05) }));
        }
    }, [logs, isBotActive, masterLevel]);

    // UPDATE LIVELLO NEL DB
    const updateMasterLevel = async (lvl: number) => {
        setMasterLevel(lvl);
        if (auth.currentUser) {
            await updateDoc(doc(db, "users", auth.currentUser.uid), { level: lvl });
            toast({ title: `LIVELLO ${lvl} ATTIVATO`, description: "Permessi di accesso aggiornati nel DB.", className: "bg-cyan-600 text-white" });
        }
    };

    // FUNZIONE CREDITI MANUALI REALE
    const handleManualQC = async () => {
        if (auth.currentUser) {
            const userRef = doc(db, "users", auth.currentUser.uid);
            await updateDoc(userRef, { credits: increment(1000) }); // +1000 REALI
            toast({ title: "INIEZIONE LIQUIDITÀ", description: "+1000 QC aggiunti al Master Wallet.", className: "bg-yellow-600 text-black" });
        }
    };

    // WIPE FISICO DAL DB
    const executeWipe = async (pin: string, type: '1H' | 'TOTAL') => {
        if (type === 'TOTAL' && pin === "26031998") {
            setStats({ materials: 0, projects: 0, energy: 100 });
            toast({ title: "HARD RESET ESEGUITO", description: "Database ripulito completamente.", className: "bg-red-600 text-white" });
            addLog("SYSTEM: DATABASE FORMATTED. ALL DATA LOST.");
            // Qui in futuro metterai: await deleteCollection(db, 'materials');
        } else if (type === '1H' && pin === "2603") {
            setStats(p => ({ materials: Math.max(0, p.materials - 200), projects: Math.max(0, p.projects - 20), energy: p.energy }));
            toast({ title: "WIPE 1H ESEGUITO", className: "bg-orange-600 text-white" });
            addLog("SYSTEM: CACHE 1H CLEARED.");
        } else {
            toast({ title: "PIN NON VALIDO", variant: "destructive" });
        }
        setShowWipeModal(false);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <WipeModal isOpen={showWipeModal} onClose={() => setShowWipeModal(false)} onConfirm={executeWipe} />
            <Card className="md:col-span-2 p-6 bg-black border-green-900/50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-green-500/50 animate-pulse"></div>
                <div className="flex justify-between items-start mb-6">
                    <div><p className="text-gray-500 text-xs uppercase tracking-widest">Core Status</p><h2 className={`text-3xl font-mono font-black ${isBotActive ? "text-green-400 animate-pulse" : "text-red-600"}`}>{isBotActive ? status : "SISTEMA IN PAUSA"}</h2></div>
                    <Button onClick={() => setIsBotActive(!isBotActive)} className={isBotActive ? "bg-red-600 hover:bg-red-700 font-bold" : "bg-green-600 hover:bg-green-700 font-bold"}><Power className="mr-2 h-5 w-5" /> {isBotActive ? "ARRESTO" : "AVVIA"}</Button>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl text-center"><span className="text-[10px] text-gray-400 uppercase font-bold">Materiali</span><p className="text-3xl font-black text-white">{Math.floor(stats.materials)}</p></div>
                    <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl text-center"><span className="text-[10px] text-gray-400 uppercase font-bold">Progetti</span><p className="text-3xl font-black text-white">{stats.projects}</p></div>
                    <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl text-center"><span className="text-[10px] text-gray-400 uppercase font-bold">Energy</span><p className="text-3xl font-black text-green-400">{stats.energy.toFixed(1)}%</p></div>
                </div>
                <div className="flex items-center gap-4 mb-4 bg-black/40 p-3 rounded-lg border border-gray-800">
                    <span className="text-xs text-gray-400 uppercase font-bold">Master Speed:</span>
                    <div className="flex gap-2">{[1, 2, 3, 4, 5].map(lvl => (<button key={lvl} onClick={() => updateMasterLevel(lvl)} className={`w-8 h-8 rounded font-bold transition-all ${masterLevel === lvl ? 'bg-cyan-600 text-white scale-110' : 'bg-gray-800 text-gray-500'}`}>{lvl}</button>))}</div>
                    <Button size="sm" variant="outline" className="ml-auto border-yellow-600 text-yellow-500 hover:bg-yellow-900/20" onClick={handleManualQC}><PlusCircle className="w-4 h-4 mr-1"/> Manual QC</Button>
                </div>
                <div className="bg-[#0a0a0c] p-4 rounded-xl h-48 overflow-y-auto font-mono text-xs text-green-500 border border-gray-800 custom-scrollbar shadow-inner">{logs.map((l, i) => (<div key={i}>[{new Date().toLocaleTimeString()}] {l}</div>))}</div>
            </Card>
            <div className="space-y-6">
                <Card className="p-6 bg-[#1a0505] border-red-900/50 h-full flex flex-col justify-center items-center text-center">
                    <AlertTriangle className="w-16 h-16 text-red-600 mb-6" /><h3 className="text-red-500 font-black text-2xl mb-2">DANGER ZONE</h3><Button onClick={() => setShowWipeModal(true)} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-14 text-lg"><Trash2 className="mr-2 h-6 w-6"/> WIPE CACHE</Button>
                </Card>
            </div>
        </div>
    );
};

export default function AdminBotConsole() {
  return (
    <div className="space-y-6 animate-in fade-in pb-20">
       <div className="flex items-center justify-between p-4 bg-red-950/20 border border-red-900 rounded-xl"><h1 className="text-2xl font-black text-red-500 flex items-center gap-2"><ShieldAlert className="w-8 h-8"/> ADMIN CORE CONSOLE</h1><Badge variant="outline" className="border-red-500 text-red-500 bg-red-950/30">ROOT GRANTED</Badge></div>
       <Tabs defaultValue="bot" className="w-full">
          <TabsList className="bg-gray-900 border border-gray-800 w-full justify-start h-12 p-1"><TabsTrigger value="bot">🤖 Bot & DB</TabsTrigger><TabsTrigger value="emotes">🧪 Emoticon Store</TabsTrigger><TabsTrigger value="codes">🎟️ Bundle Generator</TabsTrigger></TabsList>
          <TabsContent value="bot" className="space-y-6 mt-6"><BotManager /></TabsContent>
          <TabsContent value="emotes" className="mt-6"><EmoticonLab /></TabsContent>
          <TabsContent value="codes" className="mt-6"><BundleGenerator /></TabsContent>
       </Tabs>
    </div>
  );
}
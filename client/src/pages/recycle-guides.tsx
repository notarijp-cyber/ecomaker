import React from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { ArrowLeft, Recycle, Leaf, Trash2, Box, Droplet, Zap, Shirt, Info } from "lucide-react";

// STANDARD DI RICICLO (Dati statici per evitare dipendenze esterne complicate)
const RECYCLE_STANDARDS = {
  plastic_metal: {
    id: "plastic_metal",
    label: "Plastica e Metallo",
    color: "#facc15", // Yellow-400
    container: "Sacco Giallo / Trasparente",
    rules: "Bottiglie appiattite, flaconi, vaschette, lattine, scatolette, tappi in metallo. TUTTO VUOTO E PULITO.",
    destination: "Viene separato in impianto: l'alluminio torna alluminio all'infinito, la plastica diventa pile o arredi."
  },
  paper: {
    id: "paper",
    label: "Carta e Cartone",
    color: "#3b82f6", // Blue-500
    container: "Bidone Blu / Scatolone",
    rules: "Giornali, riviste, scatole, quaderni, Tetra Pak (se previsto dal comune). NIENTE SCONTRINI O CARTA UNTA.",
    destination: "Diventa nuova carta riciclata o cartone da imballaggio."
  },
  glass: {
    id: "glass",
    label: "Vetro",
    color: "#22c55e", // Green-500
    container: "Campana Verde",
    rules: "Bottiglie, vasetti. NIENTE CERAMICA, PIREX O CRISTALLO (rovinano tutto il lotto).",
    destination: "Fuso per creare nuove bottiglie. Riciclabile al 100% all'infinito."
  },
  organic: {
    id: "organic",
    label: "Organico",
    color: "#a16207", // Brown (usiamo un ambra scuro per visibilità)
    container: "Bidoncino Marrone / Compost",
    rules: "Scarti di cucina, fondi di caffè, bustine tè, tovaglioli di carta sporchi, fiori recisi.",
    destination: "Diventa Compost (terriccio) o Biogas (energia)."
  },
  weee: {
    id: "weee",
    label: "RAEE (Elettronica)",
    color: "#06b6d4", // Cyan-500
    container: "Isola Ecologica / Negozi",
    rules: "Qualsiasi cosa con la spina o batterie: Phon, PC, giocattoli elettrici. NON NEL SECCO!",
    destination: "Recupero metalli preziosi (Oro, Rame, Terre Rare)."
  },
  textile: {
    id: "textile",
    label: "Tessili",
    color: "#ec4899", // Pink-500
    container: "Cassonetti Raccolta Abiti",
    rules: "Abiti usati in buono stato (in buste chiuse). Se stracciati, usarli come stracci o isola ecologica.",
    destination: "Riutilizzo vintage o riciclo fibre per imbottiture."
  },
  general: {
    id: "general",
    label: "Secco Residuo",
    color: "#64748b", // Slate-500 (Grigio)
    container: "Sacco Grigio / Nero",
    rules: "Tutto ciò che NON è riciclabile: pannolini, cd, ceramica rotta, spazzolini, penne, carta oleata.",
    destination: "Termovalorizzatore (Energia) o Discarica (da evitare)."
  }
};

export default function RecycleGuidesPage() {
  const [, setLocation] = useLocation();

  // Mappa le icone agli standard
  const getIcon = (id: string) => {
      switch(id) {
          case 'paper': return <Box className="w-8 h-8"/>;
          case 'plastic_metal': return <Recycle className="w-8 h-8"/>;
          case 'glass': return <Droplet className="w-8 h-8"/>;
          case 'organic': return <Leaf className="w-8 h-8"/>;
          case 'weee': return <Zap className="w-8 h-8"/>;
          case 'textile': return <Shirt className="w-8 h-8"/>;
          default: return <Trash2 className="w-8 h-8"/>;
      }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen text-white pb-20 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setLocation('/dashboard')} className="text-slate-400 hover:text-cyan-400 pl-0 group">
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"/> Dashboard
            </Button>
            <h1 className="text-2xl md:text-3xl font-black flex items-center gap-2 text-white">
                <Recycle className="text-green-500 w-8 h-8"/> 
                Guida Galattica al Riciclo
            </h1>
          </div>
          <div className="bg-slate-900 px-4 py-2 rounded-lg text-sm text-slate-400 border border-slate-800 flex items-center">
             <Info className="w-4 h-4 mr-2 text-cyan-400"/>
             Database aggiornato al protocollo Quantum 2026
          </div>
      </div>

      <div className="max-w-6xl mx-auto">
          <p className="text-slate-400 mb-8 text-center max-w-2xl mx-auto text-lg">
              Non sai dove buttare quel rifiuto? Consulta il database ufficiale.
              <br/><span className="text-cyan-400 font-bold">Segui i colori</span> per non sbagliare mai e massimizzare i tuoi Crediti.
          </p>

          <Tabs defaultValue="plastic_metal" className="w-full">
            
            {/* LISTA CATEGORIE COLORATE */}
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-4 lg:grid-cols-7 h-auto bg-[#1a1d2d] border border-slate-700 p-2 gap-2 rounded-xl mb-8">
                {Object.values(RECYCLE_STANDARDS).map((std) => (
                    <TabsTrigger 
                        key={std.id} 
                        value={std.id}
                        className="flex flex-col items-center gap-2 py-4 data-[state=active]:bg-slate-800/80 transition-all rounded-lg border border-transparent data-[state=active]:border-slate-600 hover:bg-slate-800/50"
                        style={{ borderBottom: `4px solid ${std.color}` }}
                    >
                        <div style={{ color: std.color }} className="transition-transform group-hover:scale-110">{getIcon(std.id)}</div>
                        <span className="text-[10px] uppercase font-bold text-slate-300 hidden md:block">{std.label.split(' ')[0]}</span>
                    </TabsTrigger>
                ))}
            </TabsList>

            {/* CONTENUTO GUIDE */}
            <div className="bg-[#0f111a] rounded-3xl border border-slate-800 p-1">
                {Object.values(RECYCLE_STANDARDS).map((std) => (
                    <TabsContent key={std.id} value={std.id} className="focus:outline-none m-0">
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
                            
                            {/* COLONNA VISUALE (SX) */}
                            <div className="lg:col-span-2 relative h-64 lg:h-auto flex flex-col items-center justify-center p-8 overflow-hidden rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none" 
                                  style={{ backgroundColor: std.color }}>
                                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <div className="p-4 bg-black/20 rounded-full mb-4 backdrop-blur-sm border border-white/20 text-white">
                                        {getIcon(std.id)}
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-black text-black/80 mb-2 leading-tight">{std.label}</h2>
                                    <div className="bg-black/30 px-4 py-1.5 rounded-full text-white font-mono font-bold text-sm border border-white/30 backdrop-blur-md">
                                        {std.container}
                                    </div>
                                </div>
                            </div>

                            {/* COLONNA INFO (DX) */}
                            <div className="lg:col-span-3 p-6 md:p-10 space-y-6 bg-[#1a1d2d] rounded-b-2xl lg:rounded-r-2xl lg:rounded-bl-none">
                                
                                {/* COSA SI */}
                                <div className="flex gap-4">
                                    <div className="mt-1">
                                        <div className="w-8 h-8 rounded-full bg-green-900/30 flex items-center justify-center text-green-500 border border-green-500/30">
                                            <Leaf className="w-4 h-4"/>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-green-400 mb-1">COSA INSERIRE</h3>
                                        <p className="text-slate-300 leading-relaxed">{std.rules}</p>
                                    </div>
                                </div>

                                <div className="w-full h-px bg-slate-700/50"></div>

                                {/* DESTINAZIONE */}
                                <div className="flex gap-4">
                                    <div className="mt-1">
                                        <div className="w-8 h-8 rounded-full bg-cyan-900/30 flex items-center justify-center text-cyan-500 border border-cyan-500/30">
                                            <Recycle className="w-4 h-4"/>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-cyan-400 mb-1">NUOVA VITA (Destinazione)</h3>
                                        <p className="text-slate-300 leading-relaxed">{std.destination}</p>
                                    </div>
                                </div>

                                {/* ALERT */}
                                <div className="mt-6 bg-yellow-900/10 border border-yellow-600/30 p-4 rounded-xl flex items-start gap-3">
                                    <Trash2 className="text-yellow-500 w-5 h-5 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-bold text-yellow-500 mb-1">REGOLA D'ORO</h4>
                                        <p className="text-sm text-yellow-200/80 leading-snug">
                                            Se il materiale è molto sporco o unto, va quasi sempre nel <strong>secco indifferenziato</strong> per non contaminare il processo di riciclo.
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </TabsContent>
                ))}
            </div>

          </Tabs>
      </div>
    </div>
  );
}
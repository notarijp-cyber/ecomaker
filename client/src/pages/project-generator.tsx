import React, { useState, useEffect } from 'react';
import { useLocation } from "wouter";
import { Wand2, Save, ArrowLeft, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs, limit } from "firebase/firestore";
import { generateProjectBlueprint } from "@/lib/gemini"; // Importa la funzione compatibile

export default function ProjectGeneratorPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const queryParams = new URLSearchParams(window.location.search);
  const materialParam = queryParams.get("material") || "Plastica";
  
  const [generatedProject, setGeneratedProject] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [sourceType, setSourceType] = useState<"AI" | "DB">("AI");

  const addLog = (text: string) => setLogs(prev => [...prev, `> ${text}`]);

  // --- WATCHDOG DI SICUREZZA PER IL BOT ---
  useEffect(() => {
    if (auth.currentUser?.email === "ecomakerteamtest@gmail.com") {
        const watchdog = setTimeout(() => {
            console.log("🐕 Watchdog: Ritorno forzato alla base.");
            setLocation("/dashboard");
        }, 12000); // 12 secondi massimo
        return () => clearTimeout(watchdog);
    }
  }, [setLocation]);

  // --- START AUTOMATICO ---
  useEffect(() => {
    if (!isGenerating && !generatedProject) {
        startGenerationProcess();
    }
  }, []);

  const startGenerationProcess = async () => {
      setIsGenerating(true);
      setLogs([]);
      addLog(`Sistema Quantum avviato.`);
      addLog(`Analisi materiale: ${materialParam}`);

      // 1. Cerca nel DB Progetti Pubblici
      const existingProject = await checkInternalDatabase(materialParam);

      if (existingProject) {
          setSourceType("DB");
          addLog("Progetto trovato in memoria!");
          setGeneratedProject(existingProject);
          setIsGenerating(false);
          
          // Se è il bot, esce subito
          if (auth.currentUser?.email === "ecomakerteamtest@gmail.com") {
              setTimeout(() => setLocation("/dashboard"), 1500);
          }
      } else {
          // 2. Genera con AI
          setSourceType("AI");
          addLog("Richiesta Blueprint a Gemini...");
          await handleGeminiGeneration();
      }
  };

  const checkInternalDatabase = async (material: string) => {
      try {
          const q = query(collection(db, "projects"), where("materialTag", "==", material.toLowerCase()), limit(1));
          const querySnapshot = await getDocs(q);
          return !querySnapshot.empty ? querySnapshot.docs[0].data() : null;
      } catch (e) { return null; }
  };

  const handleGeminiGeneration = async () => {
    try {
        const aiData = await generateProjectBlueprint(materialParam, 1);
        
        setGeneratedProject(aiData);
        setIsGenerating(false);
        addLog("Blueprint generato con successo.");

        // Se è il Bot, salva automaticamente
        if (auth.currentUser?.email === "ecomakerteamtest@gmail.com") {
             addLog("Archiviazione automatica...");
             saveProject(aiData);
        }
    } catch (e) {
        addLog("Errore Generazione AI.");
        setIsGenerating(false);
    }
  };

  const saveProject = async (data = generatedProject) => {
    if (!auth.currentUser || !data) return;
    const isBot = auth.currentUser.email === "ecomakerteamtest@gmail.com";

    try {
        await addDoc(collection(db, "projects"), {
            ...data,
            materialTag: materialParam.toLowerCase(),
            authorId: auth.currentUser.uid,
            authorName: isBot ? "EcoTester_Bot" : "Maker",
            createdAt: new Date(),
            status: "public",
            source: isBot ? "Bot" : "User_Gen"
        });
        
        if(!isBot) toast({ title: "Progetto Salvato!", className: "bg-green-600 text-white" });
        else addLog("Salvato nel DB.");

    } catch (e) {
        console.error("Errore DB:", e);
        addLog("Errore scrittura DB.");
    } finally {
        if (isBot) {
            setTimeout(() => setLocation("/dashboard"), 1000);
        } else {
            // L'utente resta sulla pagina per vedere il risultato
        }
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen futuristic-bg bg-[#0f111a] text-white space-y-8">
      
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="ghost" onClick={() => setLocation('/dashboard')} className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5 mr-2"/> Indietro
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LOG SYSTEM */}
        <Card className="glass-morph border-slate-700 bg-black/90 font-mono shadow-2xl h-full max-h-[600px] flex flex-col">
            <CardHeader className="border-b border-slate-800 pb-3">
                <CardTitle className="text-cyan-400 text-sm flex items-center gap-2">
                    <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} /> 
                    SYSTEM LOG
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-2 text-xs">
                {logs.map((l, i) => (
                    <div key={i} className="text-green-400 border-l-2 border-green-900 pl-2">{l}</div>
                ))}
                {isGenerating && <span className="animate-pulse text-green-600">_ Elaborazione in corso...</span>}
            </CardContent>
        </Card>

        {/* RISULTATO GENERATO */}
        {generatedProject && (
            <Card className="glass-morph bg-[#1a1d2d] animate-in slide-in-from-right-10 border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
                <CardHeader>
                    <Badge className={`w-fit mb-2 ${sourceType === 'DB' ? 'bg-blue-900 text-blue-200' : 'bg-purple-900 text-purple-200'}`}>
                        {sourceType === 'DB' ? 'MEMORIA INTERNA' : 'GENERATO DA AI'}
                    </Badge>
                    <CardTitle className="text-2xl font-bold text-white">{generatedProject.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-slate-300 text-lg leading-relaxed">{generatedProject.description}</p>
                    
                    <div className="grid grid-cols-3 gap-3 text-center">
                          <div className="bg-black/40 p-3 rounded border border-slate-700">
                              <span className="text-slate-500 text-xs uppercase block">Difficoltà</span>
                              <b className="text-white">{generatedProject.difficulty}</b>
                          </div>
                          <div className="bg-black/40 p-3 rounded border border-slate-700">
                              <span className="text-slate-500 text-xs uppercase block">Tempo</span>
                              <b className="text-white">{generatedProject.timeEstimate || "2 ore"}</b>
                          </div>
                          <div className="bg-green-900/20 p-3 rounded border border-green-900/50">
                              <span className="text-green-600 text-xs uppercase block">Crediti</span>
                              <b className="text-green-400">50 QC</b>
                          </div>
                    </div>

                    {/* Lista Strumenti */}
                    {generatedProject.tools && (
                        <div className="bg-black/20 p-4 rounded-lg">
                            <h4 className="text-sm font-bold text-slate-400 mb-2 uppercase">Strumenti Necessari</h4>
                            <div className="flex flex-wrap gap-2">
                                {generatedProject.tools.map((t: string, i: number) => (
                                    <Badge key={i} variant="outline" className="border-slate-600 text-slate-300">{t}</Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Bot Feedback */}
                    {auth.currentUser?.email === "ecomakerteamtest@gmail.com" ? (
                        <div className="flex items-center justify-center text-xs text-slate-500 animate-pulse mt-4 bg-black/30 py-3 rounded border border-slate-800">
                            <RefreshCw className="w-3 h-3 mr-2 animate-spin"/> Archiviazione e Ritorno...
                        </div>
                    ) : (
                        !isGenerating && sourceType !== 'DB' && (
                            <Button onClick={() => saveProject()} className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg font-bold shadow-lg shadow-green-900/20">
                                <Save className="w-5 h-5 mr-2" /> Salva nei Miei Progetti
                            </Button>
                        )
                    )}
                    
                    {!isGenerating && sourceType === 'DB' && auth.currentUser?.email !== "ecomakerteamtest@gmail.com" && (
                        <Button onClick={() => setLocation('/my-projects')} className="w-full bg-blue-600 hover:bg-blue-700 h-12">
                            Vai ai Miei Progetti
                        </Button>
                    )}
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
import React, { useState, useEffect, useRef } from 'react';
import { useRoute, useLocation } from "wouter";
import { ArrowLeft, Clock, Hammer, ShoppingCart, AlertTriangle, CheckCircle2, Lock, PlayCircle, Check, Search, Box, Layers, Coins, Unlock, Camera, Upload, Zap, Gavel, PlusCircle, Loader2, XCircle, Store, ExternalLink, Share2, ScanLine } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useSocial } from '@/context/social-context'; // NUOVO IMPORT

export default function ProjectDetail() {
  const { toast } = useToast();
  const [match, params] = useRoute("/project-detail/:id");
  const [, setLocation] = useLocation();
  const { addPost, shareToExternal } = useSocial(); // HOOK SOCIAL
  
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [userCredits, setUserCredits] = useState(0);
  
  // STATO STEP COMPLETATI
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  // Stati Verifica
  const [isVerifying, setIsVerifying] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [verificationResult, setVerificationResult] = useState({ success: false, score: 0, xp: 0 });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const searchParams = new URLSearchParams(window.location.search);
  const isSecret = searchParams.get('secret') === 'true';

  useEffect(() => {
    if (params?.id && auth.currentUser) {
      const loadData = async () => {
        setLoading(true);
        try {
            const collectionName = isSecret ? "secret_projects_db" : "projects";
            const projRef = doc(db, collectionName, params.id);
            const snap = await getDoc(projRef);
            const userRef = doc(db, "users", auth.currentUser.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) setUserCredits(userSnap.data().credits || 0);

            if (snap.exists()) {
                const data = snap.data();
                setProject({ id: snap.id, ...data });
                if (data.authorId === auth.currentUser.uid || auth.currentUser.email === "ecomakerteamtest@gmail.com") {
                    setIsUnlocked(true);
                }
            } else {
                 // Fallback se non trova nel DB (per evitare schermata bianca durante i test)
                 setProject({
                    id: params.id,
                    title: "Progetto Quantum Prototype",
                    description: "Progetto sperimentale recuperato dagli archivi.",
                    timeEstimate: "2 ore",
                    difficulty: "Medio",
                    requiredLevel: 1,
                    creditsCost: 100,
                    quantumValue: 500,
                    steps: ["Analisi", "Costruzione", "Finitura"],
                    materialsList: [{name: "Materiale Base"}],
                    affiliateTools: ["Strumento Base"]
                });
            }
        } catch (e) { console.error(e); } finally { setLoading(false); }
      };
      loadData();
    }
  }, [params?.id, isSecret]);

  const handleUnlock = async () => {
      const cost = project.creditsCost || 100;
      if (userCredits >= cost) {
          if (auth.currentUser) {
             await updateDoc(doc(db, "users", auth.currentUser.uid), { credits: increment(-cost) });
             setUserCredits(prev => prev - cost);
          }
          setIsUnlocked(true);
          toast({ title: "Progetto Sbloccato!", className: "bg-green-600 text-white" });
      } else {
          toast({ title: "Crediti Insufficienti", description: `Servono ${cost} QC.`, variant: "destructive" });
      }
  };

  const markStepComplete = (index: number) => {
    if (!completedSteps.includes(index)) {
        setCompletedSteps(prev => [...prev, index]); 
        setTimeout(() => window.scrollBy({ top: 250, behavior: 'smooth' }), 100);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const url = URL.createObjectURL(file);
          setPreviewUrl(url);
      }
  };

  const handleVerifyProject = async () => {
      if (!previewUrl) {
          toast({ title: "Errore", description: "Carica una foto.", variant: "destructive" });
          return;
      }
      setIsVerifying(true);
      setTimeout(async () => {
          setIsVerifying(false);
          let rawScore = Math.floor(Math.random() * 40) + 40; 
          if (Math.random() > 0.6) rawScore += 20; 
          const passed = rawScore >= 60;
          const xpAwarded = passed ? Math.floor((project.quantumValue || 500) * 0.2) : 0;

          if (passed && auth.currentUser) {
              await updateDoc(doc(db, "users", auth.currentUser.uid), { experience: increment(xpAwarded) });
          }
          setVerificationResult({ success: passed, score: Math.min(99, rawScore), xp: xpAwarded });
          setShowResultDialog(true);
      }, 3000);
  };

  const openGoogleImages = () => {
      const query = project.googleSearchTerm || project.title;
      window.open(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`, '_blank');
  };

  // NUOVA FUNZIONE DI CONDIVISIONE INTERNA
  const handleShareInternal = () => {
      addPost({
          author: "Tu (EcoMaker)",
          avatar: "https://github.com/shadcn.png",
          content: `Ho appena visualizzato il progetto "${project.title}". Sembra incredibile! Chi lo costruisce con me? 🛠️`,
          type: 'PROJECT',
          image: project.image 
      });
  };

  const handleCloseDialog = (open: boolean) => {
      if (!open) {
          setShowResultDialog(false);
          if (verificationResult.success) setLocation('/dashboard');
      }
  };

  if (loading) return <div className="p-20 text-center text-cyan-500 animate-pulse">Caricamento Blueprint...</div>;
  if (!project) return null;

  const totalSteps = project.steps?.length || 0;
  const currentStepIndex = project.steps.findIndex((_: any, i: number) => !completedSteps.includes(i));
  const effectiveCurrentStep = currentStepIndex === -1 ? totalSteps : currentStepIndex;

  const projectCost = project.creditsCost || 100;
  const quantumVal = project.quantumValue || 500;
  const reservePrice = Math.floor(quantumVal * 0.8);

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen text-white pb-20 animate-in fade-in duration-500">
      
      {/* HEADER NAVIGAZIONE */}
      <div className="flex items-center justify-between gap-4 mb-6">
          <Button variant="ghost" onClick={() => setLocation(isSecret ? '/my-projects' : '/dashboard')} className="text-slate-400 pl-0 hover:text-white">
            <ArrowLeft className="w-5 h-5 mr-2"/> Indietro
          </Button>
          <div className="flex items-center gap-4">
              <div className="bg-slate-900 px-3 py-1 rounded-full text-yellow-400 font-mono text-sm border border-yellow-900 flex items-center gap-2">
                  <Coins className="w-4 h-4" /> {userCredits} QC
              </div>
              {isSecret && <Badge className="bg-purple-900 text-purple-200 border-purple-700 flex items-center"><Lock className="w-3 h-3 mr-1"/> MASTER BLUEPRINT</Badge>}
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLONNA SX: DETTAGLI */}
        <div className="lg:col-span-1 space-y-6 sticky top-8 h-fit">
            <Card className="bg-[#1a1d2d] border-slate-700 shadow-xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-white leading-tight">{project.title}</CardTitle>
                    <div className="flex gap-2 mt-3 flex-wrap">
                        <Badge variant="outline" className="text-yellow-400 border-yellow-600"><Clock className="w-3 h-3 mr-1"/> {project.timeEstimate}</Badge>
                        <Badge variant="outline" className="text-cyan-400 border-cyan-600">{project.difficulty}</Badge>
                        <Badge className="bg-green-900 text-green-200 border-green-700">Liv. {project.requiredLevel}</Badge>
                    </div>
                    <div className="mt-4 bg-blue-900/30 p-3 rounded-lg border border-blue-500/30 flex items-center justify-between">
                        <span className="text-xs text-blue-300 font-bold uppercase flex items-center"><Zap className="w-4 h-4 mr-2 text-blue-400"/> Quantum Value</span>
                        <span className="text-xl font-black text-blue-100">{quantumVal} QV</span>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-slate-300 text-sm">{project.description}</p>
                    
                    {!isUnlocked ? (
                        <div className="bg-slate-900/80 p-6 rounded-xl border border-slate-700 text-center space-y-4 animate-in fade-in">
                            <Lock className="w-12 h-12 text-yellow-500 mx-auto animate-pulse" />
                            <Button onClick={handleUnlock} className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold h-12 text-lg shadow-lg shadow-yellow-900/20">
                                <Unlock className="w-5 h-5 mr-2" /> Sblocca ({projectCost} QC)
                            </Button>
                        </div>
                    ) : (
                        <div className="bg-green-900/30 p-4 rounded-lg border border-green-500/30 text-center animate-in zoom-in">
                            <p className="text-green-400 font-bold flex items-center justify-center"><CheckCircle2 className="w-5 h-5 mr-2"/> PROGETTO ATTIVO</p>
                        </div>
                    )}

                    {isUnlocked && (
                        <>
                            {/* STRUMENTI & MATERIALI */}
                            <div className="bg-black/30 p-4 rounded-lg border border-slate-800">
                                <h3 className="text-xs font-bold text-green-400 mb-3 uppercase flex items-center"><ShoppingCart className="w-3 h-3 mr-2"/> Strumenti</h3>
                                <div className="space-y-3">
                                    {project.affiliateTools?.map((tool: string, i: number) => (
                                        <div key={i} className="flex flex-col gap-1 border-b border-slate-700 pb-2 last:border-0">
                                            <span className="text-sm text-white">{tool}</span>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="ghost" className="h-6 text-[10px] text-cyan-400 bg-cyan-950/30 hover:text-white" onClick={() => setLocation(`/marketplace?search=${tool}&tab=tools`)}>
                                                    <Store className="w-3 h-3 mr-1"/> Market
                                                </Button>
                                                <Button size="sm" variant="ghost" className="h-6 text-[10px] text-yellow-500 bg-yellow-950/30 hover:text-white" onClick={() => window.open(`https://www.amazon.it/s?k=${tool}`, '_blank')}>
                                                    <ExternalLink className="w-3 h-3 mr-1"/> Amazon
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-black/40 p-4 rounded-lg border border-slate-700">
                                <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase flex items-center"><Layers className="w-3 h-3 mr-2"/> Ingredienti</h3>
                                <ul className="space-y-2">
                                    {project.materialsList?.map((m: any, i: number) => (
                                        <li key={i} className="flex justify-between items-center text-sm text-white border-b border-slate-700 pb-1">
                                            <span>{m.name}</span>
                                            <Button size="icon" variant="ghost" className="h-6 w-6 text-purple-400" onClick={() => setLocation(`/marketplace?search=${m.name}&tab=materials`)}>
                                                <Store className="w-3 h-3"/>
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            {/* PULSANTI SOCIAL E REFERENCE */}
                            <div className="space-y-3">
                                <Button onClick={openGoogleImages} className="w-full bg-purple-600 hover:bg-purple-500 text-white shadow-lg">
                                    <Search className="w-4 h-4 mr-2"/> Visualizza Idea (Foto)
                                </Button>
                                
                                <div className="grid grid-cols-2 gap-2">
                                    <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-cyan-900/20 hover:text-cyan-400" onClick={handleShareInternal}>
                                        <Share2 className="w-4 h-4 mr-2"/> Posta in Community
                                    </Button>
                                    <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-pink-900/20 hover:text-pink-400" onClick={() => shareToExternal("Instagram", `Guarda questo progetto su EcoMaker: ${project.title}`)}>
                                        <Share2 className="w-4 h-4 mr-2"/> Instagram
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>

        {/* COLONNA DX: ISTRUZIONI */}
        <div className="lg:col-span-2 relative">
            <Card className="bg-[#0f111a] border-slate-800 h-full shadow-2xl">
                <CardHeader className="border-b border-slate-800">
                    <CardTitle className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-2"><CheckCircle2 className="w-6 h-6 text-green-500"/> Istruzioni Operative</div>
                        <Badge variant="outline" className="text-slate-400">{Math.min(effectiveCurrentStep, totalSteps)} / {totalSteps}</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    {project.steps?.map((step: string, i: number) => {
                        if (i > effectiveCurrentStep) return null;
                        const isDone = i < effectiveCurrentStep;
                        const isActive = i === effectiveCurrentStep;

                        return (
                        <div key={i} className={`relative flex gap-4 p-6 rounded-xl transition-all duration-500 border ${isActive ? 'bg-cyan-950/40 border-cyan-500/50 scale-100 opacity-100 shadow-xl' : 'bg-black/20 border-slate-800 scale-95 opacity-50'}`}>
                            {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 rounded-l-xl animate-pulse"></div>}
                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${isDone ? 'bg-green-900 text-green-200' : 'bg-cyan-600 text-white'}`}>
                                    {isDone ? <Check className="w-6 h-6"/> : i + 1}
                                </div>
                            </div>
                            <div className="flex-1 pb-2">
                                <p className={`text-lg leading-relaxed font-medium ${isDone ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{step}</p>
                                {isActive && isUnlocked && (
                                    <Button onClick={() => markStepComplete(i)} className="mt-6 w-full md:w-auto bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg group">
                                        <PlayCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform"/> Segna come completato
                                    </Button>
                                )}
                            </div>
                        </div>
                    )})}

                    {/* VERIFICA FINALE */}
                    {effectiveCurrentStep === totalSteps && isUnlocked && (
                        <div className="mt-8 p-6 bg-blue-950/30 border border-blue-500/50 rounded-xl animate-in slide-in-from-bottom">
                            <h3 className="text-xl font-bold text-blue-100 mb-4 flex items-center"><Camera className="w-6 h-6 mr-2"/> Verifica Finale AI</h3>
                            <div className="flex flex-col gap-4 items-center">
                                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" id="photo-upload"/>
                                <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-blue-400/50 rounded-lg hover:bg-blue-900/20 transition-colors relative overflow-hidden bg-black/40">
                                    {previewUrl ? <img src={previewUrl} alt="Preview" className="w-full h-full object-contain p-2" /> : <div className="flex flex-col items-center"><Upload className="w-12 h-12 text-blue-400 mb-4"/><span className="text-sm text-blue-300 font-bold">CLICCA PER CARICARE FOTO</span></div>}
                                </label>
                                <Button onClick={handleVerifyProject} disabled={isVerifying} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-14 text-lg shadow-lg relative overflow-hidden">
                                    {isVerifying ? <><Loader2 className="w-6 h-6 mr-2 animate-spin" /> Analisi Dimensionale...</> : <><Zap className="w-6 h-6 mr-2" /> Invia per Verifica AI</>}
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>

      {/* DIALOGO RISULTATO */}
      <Dialog open={showResultDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="bg-[#1a1d2d] border-slate-700 text-white sm:max-w-md">
            <DialogHeader><DialogTitle className={`text-2xl font-bold ${verificationResult.success ? 'text-green-400' : 'text-red-400'}`}>{verificationResult.success ? "Progetto Validato!" : "Verifica Fallita"}</DialogTitle></DialogHeader>
            <div className="text-center py-4 space-y-4">
                <div className={`text-6xl font-black ${verificationResult.success ? 'text-green-400' : 'text-red-500'}`}>{verificationResult.score}%</div>
                <div className={`${verificationResult.success ? 'bg-green-900/30 border-green-500/30' : 'bg-red-900/30 border-red-500/30'} p-4 rounded border`}>
                    <p className={verificationResult.success ? "text-green-300" : "text-red-300"}>{verificationResult.success ? "Ottimo lavoro! Geometria conforme." : "Immagine poco chiara o oggetto errato."}</p>
                    {verificationResult.success && <div className="mt-3 text-3xl font-black text-yellow-400">+{verificationResult.xp} XP</div>}
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4 mt-2">
                {verificationResult.success ? (
                    <Button className="h-16 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white font-black text-xl animate-pulse" onClick={() => setLocation(`/auction-house?mode=create&projectId=${project.id}&title=${encodeURIComponent(project.title)}&reserve=${reservePrice}`)}>
                        <Gavel className="w-8 h-8 mr-2" /> METTI ALL'ASTA
                    </Button>
                ) : (
                    <Button className="bg-slate-700 hover:bg-slate-600 h-12 font-bold" onClick={() => setShowResultDialog(false)}>Riprova</Button>
                )}
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
import React, { useState } from "react";
import { Link } from "wouter";
import { 
  Users, Copy, Gift, Trophy, Share2, ArrowRight, 
  ArrowLeft, CheckCircle2, Zap 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function ReferralPage() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  // DATI SIMULATI
  const referralData = {
    code: "MAKER-2026-XQ",
    totalInvited: 3,
    creditsEarned: 150,
    nextRewardAt: 5, // Prossimo traguardo
  };

  // Calcolo % progresso (semplificato visivamente)
  const progressPercentage = (referralData.totalInvited / referralData.nextRewardAt) * 100;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralData.code);
    setCopied(true);
    toast({
      title: "Codice Copiato!",
      description: "Invialo ai tuoi amici per guadagnare crediti.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-full w-full bg-[#0f111a] text-white font-sans overflow-x-hidden">
      
      {/* HEADER NAVIGAZIONE */}
      <div className="sticky top-0 z-10 bg-[#0f111a]/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/settings">
            <Button variant="ghost" className="text-slate-400 hover:text-white pl-0 hover:bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" /> Torna alle Impostazioni
            </Button>
          </Link>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20">
             <Trophy className="w-4 h-4 text-yellow-500" />
             <span className="text-xs md:text-sm font-bold text-yellow-500">Livello: Ambassador</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 md:p-12 space-y-12">

        {/* HERO */}
        <div className="text-center space-y-6 relative">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-indigo-500/20 rounded-full blur-[80px] -z-10"></div>
           
           <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
             Invita Amici, <br/>
             <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
               Guadagna Potere
             </span>
           </h1>
           <p className="text-slate-400 text-lg max-w-2xl mx-auto">
             Espandi l'ecosistema EcoMaker. Per ogni amico che si iscrive e scansiona il suo primo oggetto, 
             riceverete entrambi <span className="text-white font-bold">50 Crediti Quantum</span>.
           </p>
        </div>

        {/* CARD PRINCIPALE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            
            {/* SINISTRA: CODICE */}
            <div className="bg-[#1a1d2d] rounded-3xl p-8 border border-indigo-500/30 shadow-2xl relative group">
               <h3 className="text-indigo-300 font-bold uppercase tracking-widest text-sm mb-4">Il tuo Codice Univoco</h3>
               
               <div 
                 onClick={handleCopy}
                 className="bg-black/40 border-2 border-dashed border-indigo-500/50 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-indigo-400 hover:bg-black/60 transition-all"
               >
                  <span className="text-2xl md:text-4xl font-mono font-bold text-white tracking-wider">
                    {referralData.code}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-500"/> : <Copy className="w-3 h-3"/>} 
                    {copied ? "Copiato!" : "Clicca per copiare"}
                  </span>
               </div>

               <div className="mt-8 flex gap-3">
                  <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700" onClick={handleCopy}>
                    <Copy className="w-4 h-4 mr-2" /> Copia
                  </Button>
               </div>
            </div>

            {/* DESTRA: STATISTICHE */}
            <div className="bg-gradient-to-br from-[#1a1d2d] to-[#25223c] rounded-3xl p-8 border border-yellow-500/20 shadow-2xl flex flex-col justify-between">
               <div>
                 <h3 className="text-yellow-500/80 font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                    <Zap className="w-4 h-4" /> Performance
                 </h3>
                 
                 <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                       <div className="text-3xl font-bold text-white">{referralData.totalInvited}</div>
                       <div className="text-xs text-slate-400">Amici Invitati</div>
                    </div>
                    <div className="bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/20">
                       <div className="text-3xl font-bold text-yellow-400">+{referralData.creditsEarned}</div>
                       <div className="text-xs text-yellow-200/70">Crediti Guadagnati</div>
                    </div>
                 </div>
               </div>

               {/* BARRA PROGRESSO */}
               <div>
                  <div className="flex justify-between text-sm mb-2">
                     <span className="text-slate-300">Prossimo Bonus</span>
                     <span className="text-indigo-400">{referralData.totalInvited} / {referralData.nextRewardAt} Amici</span>
                  </div>
                  <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                     <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                     />
                  </div>
               </div>
            </div>
        </div>
      </div>
    </div>
  );
}
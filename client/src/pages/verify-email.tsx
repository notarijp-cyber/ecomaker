import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Mail, RefreshCw, LogOut, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import { sendEmailVerification, signOut, onAuthStateChanged } from "firebase/auth";

export default function VerifyEmailPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Controllo periodico automatico
  useEffect(() => {
    const interval = setInterval(async () => {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          setIsVerified(true);
          clearInterval(interval);
        }
      }
    }, 3000); // Controlla ogni 3 secondi
    return () => clearInterval(interval);
  }, []);

  const handleContinue = () => {
    if (auth.currentUser?.emailVerified) {
      setLocation("/dashboard");
    } else {
      toast({ title: "Non ancora verificata", description: "Clicca il link nella mail prima di procedere.", variant: "destructive" });
    }
  };

  const resendEmail = async () => {
    setLoading(true);
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        toast({ title: "Inviata!", description: "Controlla la tua casella di posta." });
      }
    } catch (error: any) {
      toast({ title: "Errore", description: "Attendi qualche minuto prima di riprovare.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-[#0f111a] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1a1d2d] rounded-2xl p-8 border border-slate-700 shadow-2xl text-center space-y-6">
        
        <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto border border-yellow-500/30">
          {isVerified ? (
             <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-in zoom-in" />
          ) : (
             <Mail className="w-10 h-10 text-yellow-400 animate-pulse" />
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {isVerified ? "Email Verificata!" : "Verifica Necessaria"}
          </h1>
          <p className="text-slate-400">
            {isVerified 
              ? "Il tuo account Quantum è attivo. Puoi accedere."
              : `Abbiamo inviato un link a ${auth.currentUser?.email}. Cliccalo per attivare i 30 Crediti.`
            }
          </p>
        </div>

        <div className="space-y-3 pt-4">
           {isVerified ? (
             <Button onClick={() => setLocation("/dashboard")} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6">
               VAI ALLA DASHBOARD
             </Button>
           ) : (
             <>
               <Button onClick={() => window.location.reload()} variant="outline" className="w-full border-slate-600 text-white hover:bg-slate-800">
                 Ho verificato, Fammi entrare
               </Button>
               <Button onClick={resendEmail} disabled={loading} variant="ghost" className="text-cyan-400 hover:text-cyan-300">
                 <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Rinvia Email
               </Button>
             </>
           )}
        </div>

        <div className="pt-6 border-t border-slate-700/50">
           <button onClick={handleLogout} className="text-sm text-slate-500 hover:text-red-400 flex items-center justify-center w-full gap-2">
             <LogOut className="w-4 h-4" /> Disconnetti / Cambia Account
           </button>
        </div>

      </div>
    </div>
  );
}
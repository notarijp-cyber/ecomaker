import React, { useState } from "react";
import { useLocation } from "wouter";
import { 
  Leaf, Atom, Zap, Globe, ArrowRight, Recycle, 
  Cpu, ChevronRight, Play, Gift, Chrome, Facebook, Mail, Loader2, CheckCircle2, RefreshCw, KeyRound, ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// FIREBASE & FIRESTORE
import { auth, db } from "@/lib/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail, // <--- NUOVO IMPORT
  signOut
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Dati Form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  // Stati Interfaccia
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false); // <--- NUOVO STATO PER IL RESET PASSWORD

  // --- 1. REGISTRAZIONE ---
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !username) {
        toast({ title: "Dati mancanti", description: "Compila tutti i campi.", variant: "destructive" });
        return;
    }
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: username });
      await sendEmailVerification(user);
      setIsVerificationStep(true);
      toast({ title: "Quasi fatto!", description: "Controlla la tua email per attivare l'account." });

    } catch (error: any) {
      console.error(error);
      let msg = error.message;
      if(error.code === 'auth/email-already-in-use') msg = "Email già registrata.";
      if(error.code === 'auth/weak-password') msg = "Password troppo debole (min 6 caratteri).";
      toast({ title: "Errore Registrazione", description: msg, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. CONTROLLA VERIFICA ---
  const checkVerification = async () => {
    setIsLoading(true);
    try {
      await auth.currentUser?.reload();
      const user = auth.currentUser;

      if (user?.emailVerified) {
        await setDoc(doc(db, "users", user.uid), {
            username: username || user.displayName,
            email: user.email,
            credits: 30, 
            level: 1,
            experience: 0,
            createdAt: serverTimestamp(),
            scannedItems: 0,
            co2Saved: 0
        });

        toast({ 
            title: "Account Attivato!", 
            description: "+30 Crediti aggiunti. Benvenuto!",
            className: "bg-emerald-500/20 border-emerald-500/50 text-white"
        });
        setLocation("/dashboard");
      } else {
        toast({ title: "Non ancora verificato", description: "Clicca il link che ti abbiamo inviato via mail.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Errore", description: "Riprova tra poco.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const resendEmail = async () => {
    if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        toast({ title: "Inviata", description: "Nuova mail di verifica inviata." });
    }
  };

  // --- 3. LOGIN NORMALE ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      if (!user.emailVerified) {
        toast({ title: "Email non verificata", description: "Devi verificare la mail prima di accedere.", variant: "destructive" });
        await signOut(auth); 
        return;
      }

      toast({ title: "Bentornato Maker!", description: "Accesso effettuato." });
      setLocation("/dashboard");
    } catch (error: any) {
        toast({ title: "Errore Accesso", description: "Credenziali non valide.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // --- 4. RECUPERA PASSWORD (NUOVA FUNZIONE) ---
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
        toast({ title: "Inserisci l'email", description: "Scrivi l'email dove vuoi ricevere il link di reset.", variant: "destructive" });
        return;
    }
    setIsLoading(true);
    try {
        await sendPasswordResetEmail(auth, email);
        toast({ title: "Email Inviata!", description: "Controlla la posta per resettare la password." });
        setIsResetMode(false); // Torna al login dopo l'invio
    } catch (error: any) {
        let msg = error.message;
        if(error.code === 'auth/user-not-found') msg = "Nessun account trovato con questa email.";
        toast({ title: "Errore", description: msg, variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
  };

  // --- 5. SOCIAL LOGIN ---
  const handleSocialLogin = async (providerName: "google" | "facebook") => {
    setIsLoading(true);
    const provider = providerName === "google" ? new GoogleAuthProvider() : new FacebookAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
            username: user.displayName || "Maker",
            email: user.email,
            credits: 30, 
            level: 1,
            createdAt: serverTimestamp(),
            scannedItems: 0,
            co2Saved: 0
          });
          toast({ title: "Benvenuto!", description: "+30 Crediti per il tuo primo accesso social." });
      }
      setLocation("/dashboard");
    } catch (error: any) {
        toast({ title: "Errore Social", description: error.message, variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f111a] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      
      {/* SFONDO ANIMATO */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[150px]"></div>
      </div>

      {/* --- HERO SECTION --- */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[90vh]">
        
        {/* TESTO A SINISTRA */}
        <div className="space-y-8 animate-in slide-in-from-left duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            <Atom className="w-4 h-4 text-cyan-400 animate-spin-slow" />
            <span className="text-sm font-medium text-cyan-300">EcoMaker Quantum Hub v2.0</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Plasma il Futuro,<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-emerald-400">
              Un Rifiuto alla Volta.
            </span>
          </h1>
          
          <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
            La prima piattaforma che trasforma la plastica in valuta. Scansiona, ricicla e guadagna Crediti Quantum per finanziare progetti reali.
          </p>

          <div className="flex items-center gap-4 pt-4">
            <div className="flex -space-x-3">
                {[1,2,3].map(i => <div key={i} className={`w-10 h-10 rounded-full border-2 border-[#0f111a] bg-slate-700`}></div>)}
            </div>
            <div className="text-sm text-slate-300">
                Unisciti a <span className="font-bold text-white">10.000+ Maker</span> attivi.
            </div>
          </div>
        </div>

        {/* CARD LOGIN / REGISTRAZIONE A DESTRA */}
        <div className="relative animate-in slide-in-from-top duration-1000 delay-200">
           {/* Glow Effect */}
           <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 blur-2xl -z-10 rounded-3xl"></div>
           
           <div className="bg-[#1a1d2d]/90 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl relative overflow-hidden transition-all duration-300">
              
              {!isVerificationStep ? (
                  <>
                      {/* --- TITOLO (CAMBIA SE SIAMO IN RESET PASSWORD) --- */}
                      <div className="mb-6 relative">
                         {!isResetMode ? (
                           <>
                             <div className="absolute top-0 right-[-65px] bg-gradient-to-l from-emerald-500 to-cyan-600 text-white text-[10px] font-bold px-10 py-1 rotate-45 shadow-lg flex justify-center">
                                +30 CREDITI
                             </div>
                             <h2 className="text-2xl font-bold text-white mb-1">Accesso Quantum</h2>
                             <p className="text-slate-400 text-sm">Il tuo portale per l'ecosistema EcoMaker.</p>
                           </>
                         ) : (
                           <>
                             <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                               <KeyRound className="w-6 h-6 text-purple-400" /> Recupero Password
                             </h2>
                             <p className="text-slate-400 text-sm">Ti invieremo un link per crearne una nuova.</p>
                           </>
                         )}
                      </div>

                      {/* --- CONTENUTO CARD --- */}
                      {!isResetMode ? (
                        /* MODO NORMALE: TABS LOGIN / SIGNUP */
                        <>
                          <Tabs defaultValue="signup" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-900/50">
                              <TabsTrigger value="login">Accedi</TabsTrigger>
                              <TabsTrigger value="signup">Registrati</TabsTrigger>
                            </TabsList>

                            {/* SIGNUP */}
                            <TabsContent value="signup">
                               <form onSubmit={handleSignup} className="space-y-4">
                                  <Input 
                                    placeholder="Nome Maker (es. Neo)" 
                                    className="bg-black/30 border-slate-600 text-white"
                                    value={username} onChange={e => setUsername(e.target.value)} required
                                  />
                                  <Input 
                                    type="email" placeholder="Email" 
                                    className="bg-black/30 border-slate-600 text-white"
                                    value={email} onChange={e => setEmail(e.target.value)} required
                                  />
                                  <Input 
                                    type="password" placeholder="Password" 
                                    className="bg-black/30 border-slate-600 text-white"
                                    value={password} onChange={e => setPassword(e.target.value)} required
                                  />
                                  <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white font-bold py-6 mt-2">
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin"/> : "Registrati & Prendi i Crediti"}
                                  </Button>
                               </form>
                            </TabsContent>
                            
                            {/* LOGIN */}
                            <TabsContent value="login">
                               <form onSubmit={handleLogin} className="space-y-4">
                                  <Input 
                                    type="email" placeholder="Email" 
                                    className="bg-black/30 border-slate-600 text-white"
                                    value={email} onChange={e => setEmail(e.target.value)}
                                  />
                                  <Input 
                                    type="password" placeholder="Password" 
                                    className="bg-black/30 border-slate-600 text-white"
                                    value={password} onChange={e => setPassword(e.target.value)}
                                  />
                                  
                                  {/* LINK PASSWORD DIMENTICATA */}
                                  <div className="flex justify-end">
                                    <span 
                                      onClick={() => { setIsResetMode(true); setEmail(""); }} // Pulisce email per evitare confusioni o la mantiene se vuoi
                                      className="text-xs text-cyan-400 hover:text-cyan-300 cursor-pointer hover:underline transition-colors"
                                    >
                                      Password dimenticata?
                                    </span>
                                  </div>

                                  <Button type="submit" disabled={isLoading} className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-6 mt-2">
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin"/> : "Entra nel Sistema"}
                                  </Button>
                               </form>
                            </TabsContent>
                          </Tabs>

                          {/* SOCIAL FOOTER */}
                          <div className="relative my-6">
                             <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-700/50"></span></div>
                             <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#1a1d2d] px-2 text-slate-500">Social Login</span></div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                             <Button variant="outline" onClick={() => handleSocialLogin("google")} className="border-slate-700 bg-slate-800 hover:bg-slate-700 text-white">
                                <Chrome className="w-4 h-4 mr-2" /> Google
                             </Button>
                             <Button variant="outline" onClick={() => handleSocialLogin("facebook")} className="border-slate-700 bg-[#1877F2]/20 hover:bg-[#1877F2]/40 text-white">
                                <Facebook className="w-4 h-4 mr-2" /> Facebook
                             </Button>
                          </div>
                        </>
                      ) : (
                        /* MODO RESET PASSWORD */
                        <form onSubmit={handleResetPassword} className="space-y-6 animate-in fade-in zoom-in duration-300">
                           <Input 
                             type="email" placeholder="La tua email di registrazione" 
                             className="bg-black/30 border-slate-600 text-white h-12"
                             value={email} onChange={e => setEmail(e.target.value)} required
                           />
                           
                           <div className="space-y-3">
                             <Button type="submit" disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-6">
                               {isLoading ? <Loader2 className="w-5 h-5 animate-spin"/> : "Invia Link di Reset"}
                             </Button>
                             
                             <Button 
                               type="button" 
                               variant="ghost" 
                               onClick={() => setIsResetMode(false)} 
                               className="w-full text-slate-400 hover:text-white"
                             >
                               <ArrowLeft className="w-4 h-4 mr-2" /> Torna al Login
                             </Button>
                           </div>
                        </form>
                      )}
                  </>
              ) : (
                  /* --- MOSTRA SCHERMATA ATTESA VERIFICA (DOPO REGISTRAZIONE) --- */
                  <div className="text-center py-10 px-4 space-y-6 animate-in fade-in zoom-in">
                      <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/30">
                          <Mail className="w-10 h-10 text-cyan-400 animate-pulse" />
                      </div>
                      <h2 className="text-2xl font-bold text-white">Controlla la Posta!</h2>
                      <p className="text-slate-400">
                          Abbiamo inviato un link di verifica a <span className="text-white font-mono">{email}</span>.
                          <br/>Clicca il link e poi premi il pulsante qui sotto.
                      </p>
                      
                      <div className="space-y-3 pt-4">
                          <Button onClick={checkVerification} disabled={isLoading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6 text-lg">
                              {isLoading ? <Loader2 className="w-5 h-5 animate-spin"/> : <><CheckCircle2 className="w-5 h-5 mr-2" /> Ho Verificato</>}
                          </Button>
                          
                          <Button variant="ghost" onClick={resendEmail} className="text-slate-500 hover:text-white text-sm">
                              <RefreshCw className="w-3 h-3 mr-2" /> Non ho ricevuto nulla, rinvia
                          </Button>
                      </div>
                  </div>
              )}

           </div>
        </div>
      </div>

      {/* --- SEZIONE NEWS & INFO --- */}
      <div className="bg-slate-900/50 border-t border-slate-800 py-20">
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                   <Globe className="w-6 h-6 text-emerald-400" /> Green News Network
                </h2>
                <Button variant="link" className="text-cyan-400">Vedi tutte →</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#1a1d2d] rounded-xl overflow-hidden border border-slate-700/50 hover:border-cyan-500/50 transition-all group cursor-pointer">
                   <div className="h-40 bg-slate-800 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900 to-slate-900 opacity-80"></div>
                      <div className="absolute bottom-3 left-3 bg-cyan-500 text-black text-[10px] font-bold px-2 py-0.5 rounded">TECH</div>
                   </div>
                   <div className="p-5">
                      <h3 className="font-bold mb-2 group-hover:text-cyan-400 transition-colors">Città Net-Zero: Il successo di Neo-Tokyo</h3>
                      <p className="text-xs text-slate-400">Come il riciclo distribuito ha abbattuto il 40% della CO2 in soli sei mesi.</p>
                   </div>
                </div>

                <div className="bg-[#1a1d2d] rounded-xl overflow-hidden border border-slate-700/50 hover:border-purple-500/50 transition-all group cursor-pointer">
                   <div className="h-40 bg-slate-800 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-slate-900 opacity-80"></div>
                      <div className="absolute bottom-3 left-3 bg-purple-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">MAKER</div>
                   </div>
                   <div className="p-5">
                      <h3 className="font-bold mb-2 group-hover:text-purple-400 transition-colors">Guadagnare con il PET: La guida definitiva</h3>
                      <p className="text-xs text-slate-400">Analisi dei mercati dei materiali di scarto nel Q1 2026. Prezzi in rialzo.</p>
                   </div>
                </div>

                <div className="bg-[#1a1d2d] rounded-xl overflow-hidden border border-slate-700/50 hover:border-emerald-500/50 transition-all group cursor-pointer">
                   <div className="h-40 bg-slate-800 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 to-slate-900 opacity-80"></div>
                      <div className="absolute bottom-3 left-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">EVENTI</div>
                   </div>
                   <div className="p-5">
                      <h3 className="font-bold mb-2 group-hover:text-emerald-400 transition-colors">Hackathon Globale: "Plastic to Power"</h3>
                      <p className="text-xs text-slate-400">Iscrizioni aperte. Montepremi di 10.000 Crediti Quantum per il miglior progetto.</p>
                   </div>
                </div>
            </div>
         </div>
      </div>

      <div className="border-t border-slate-800 py-6 text-center text-slate-500 text-xs">
         © 2026 EcoMaker Quantum Hub. Tutti i diritti riservati.
      </div>
    </div>
  );
}
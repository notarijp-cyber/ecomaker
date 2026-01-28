import React, { useState } from "react";
import { useLocation } from "wouter";
import { Mail, Lock, ArrowRight, Loader2, User, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendEmailVerification, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // --- LOGIN ---
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // SE NON È VERIFICATO -> BLOCCA
        if (!user.emailVerified) {
           await signOut(auth);
           toast({ 
             title: "Email non verificata", 
             description: "Controlla la tua casella di posta e clicca sul link di verifica.", 
             variant: "destructive" 
           });
           setLoading(false);
           return;
        }

        toast({ title: "Bentornato!", description: "Accesso effettuato." });
        setLocation("/dashboard");

      } else {
        // --- REGISTRAZIONE ---
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: username });
        
        // Salviamo i dati iniziali nel database
        await setDoc(doc(db, "users", user.uid), {
          username,
          email,
          credits: 30, // Bonus benvenuto
          level: 1,
          experience: 0,
          createdAt: new Date(),
          tutorialCompleted: false
        });

        // Invia la mail vera
        await sendEmailVerification(user);
        
        toast({ title: "Account Creato", description: "Ti abbiamo inviato una mail di verifica." });
        setLocation("/verify-email");
      }
    } catch (error: any) {
      let msg = error.message;
      if (error.code === 'auth/email-already-in-use') msg = "Email già registrata.";
      if (error.code === 'auth/weak-password') msg = "Password troppo debole.";
      toast({ title: "Errore", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f111a] flex items-center justify-center p-4 relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-4xl bg-[#1a1d2d]/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl flex overflow-hidden relative z-10 min-h-[600px]">
        
        <div className="hidden md:flex flex-col justify-center w-1/2 p-12 bg-gradient-to-br from-slate-900 to-[#0f111a] border-r border-slate-800">
           <h1 className="text-5xl font-extrabold text-white mb-6 leading-tight">
             EcoMaker <span className="text-cyan-400">Hub</span>
           </h1>
           <p className="text-slate-400 text-lg">La piattaforma per i Maker del futuro.</p>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
           <div className="text-center md:text-left mb-8">
              <h2 className="text-2xl font-bold text-white">Accesso Quantum</h2>
           </div>

           <div className="bg-black/30 p-1 rounded-xl flex mb-8">
              <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${isLogin ? 'bg-slate-700 text-white' : 'text-slate-500'}`}>Accedi</button>
              <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${!isLogin ? 'bg-slate-700 text-white' : 'text-slate-500'}`}>Registrati</button>
           </div>

           <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <div className="relative"><User className="absolute left-3 top-3 w-5 h-5 text-slate-500" /><Input placeholder="Nome" className="pl-10 bg-black/20 border-slate-700 text-white" value={username} onChange={e => setUsername(e.target.value)} required /></div>
              )}
              <div className="relative"><Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" /><Input type="email" placeholder="Email" className="pl-10 bg-black/20 border-slate-700 text-white" value={email} onChange={e => setEmail(e.target.value)} required /></div>
              <div className="relative"><Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" /><Input type="password" placeholder="Password" className="pl-10 bg-black/20 border-slate-700 text-white" value={password} onChange={e => setPassword(e.target.value)} required /></div>

              <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold h-12 shadow-lg">
                 {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : isLogin ? "Entra nel Sistema" : "Registrati"}
              </Button>
           </form>
        </div>
      </div>
    </div>
  );
}
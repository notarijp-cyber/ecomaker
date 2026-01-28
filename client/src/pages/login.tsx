import React, { useState } from 'react';
import { useLocation } from "wouter";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Zap, LayoutGrid } from 'lucide-react';

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // Switch tra Login e Registrazione
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        // LOGIN
        await signInWithEmailAndPassword(auth, email, password);
        // Il redirect è gestito automaticamente da App.tsx
      } else {
        // REGISTRAZIONE
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Invia mail di verifica
        await sendEmailVerification(userCredential.user);
        toast({
          title: "Account creato!",
          description: "Ti abbiamo inviato una mail di verifica. Controlla la posta.",
          className: "bg-green-900 border-green-500 text-white"
        });
      }
    } catch (error: any) {
      console.error(error);
      let msg = "Errore sconosciuto.";
      if (error.code === 'auth/invalid-credential') msg = "Email o password errati.";
      if (error.code === 'auth/email-already-in-use') msg = "Questa email è già registrata.";
      if (error.code === 'auth/weak-password') msg = "La password è troppo debole (min 6 caratteri).";
      
      toast({
        title: "Errore Accesso",
        description: msg,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#0a0a0c]">
      {/* LATO SINISTRO - Visual/Brand */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-gray-900 via-[#0f1014] to-black items-center justify-center relative overflow-hidden border-r border-gray-800">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-[#0a0a0c]"></div>
        
        <div className="relative z-10 p-12 max-w-xl">
          <div className="w-16 h-16 bg-cyan-900/20 rounded-2xl flex items-center justify-center mb-8 border border-cyan-500/30 backdrop-blur-md shadow-[0_0_30px_rgba(6,182,212,0.2)]">
             <LayoutGrid className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-6xl font-bold text-white mb-6 tracking-tighter leading-tight">
            EcoMaker<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">Quantum Hub</span>
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            La piattaforma per i Maker del futuro. Gestisci risorse, scambia materiali e innova nell'ecosistema Quantum.
          </p>
          
          <div className="mt-12 grid grid-cols-2 gap-6">
             <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 backdrop-blur-sm">
                <Zap className="w-6 h-6 text-yellow-500 mb-2" />
                <p className="text-sm font-bold text-white">Guadagna QC</p>
                <p className="text-xs text-gray-500">Crediti per ogni azione green.</p>
             </div>
             <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 backdrop-blur-sm">
                <div className="w-6 h-6 rounded-full bg-green-500 mb-2 opacity-80"></div>
                <p className="text-sm font-bold text-white">Salva il Pianeta</p>
                <p className="text-xs text-gray-500">Traccia la CO2 risparmiata.</p>
             </div>
          </div>
        </div>
      </div>

      {/* LATO DESTRO - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#0a0a0c] relative">
        {/* Glow effect background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="w-full max-w-md space-y-8 relative z-10">
           <div className="text-center lg:text-left">
             <h2 className="text-3xl font-bold text-white mb-2">
                {isLogin ? "Accesso Quantum" : "Unisciti al Network"}
             </h2>
             <p className="text-gray-500">
               {isLogin ? "Inserisci le tue credenziali crittografate." : "Crea il tuo profilo Maker in pochi secondi."}
             </p>
           </div>
           
           <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-4">
                  <Input 
                    type="email" 
                    placeholder="Email Protocollo" 
                    className="bg-gray-900/50 border-gray-800 text-white h-12 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Input 
                    type="password" 
                    placeholder="Chiave di Accesso" 
                    className="bg-gray-900/50 border-gray-800 text-white h-12 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold tracking-wide shadow-lg shadow-cyan-900/20 transition-all active:scale-[0.98]"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                {isLogin ? "Entra nel Sistema" : "Inizializza Profilo"}
              </Button>
           </form>

           <div className="pt-6 border-t border-gray-800 text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {isLogin ? (
                    <>Non hai un account? <span className="text-cyan-400 font-bold ml-1">Registrati</span></>
                ) : (
                    <>Hai già un ID? <span className="text-cyan-400 font-bold ml-1">Accedi</span></>
                )}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
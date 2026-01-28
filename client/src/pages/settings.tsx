import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { 
    User, Mail, Phone, Lock, Facebook, Twitter, Github, 
    CreditCard, MapPin, ShieldCheck, LogOut, CheckCircle, Loader2, Save, Edit2, Smartphone 
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { auth, db } from "@/lib/firebase";
import { sendEmailVerification, updateProfile, RecaptchaVerifier, linkWithPhoneNumber } from "firebase/auth"; 
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useUser } from '@/hooks/use-user';

declare global {
  interface Window {
    recaptchaVerifier: any;
    confirmationResult: any;
  }
}

export default function Settings() {
  const { user } = useUser();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Stati Dati Utente
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [bio, setBio] = useState("");
  
  // STATI TELEFONO (OTP FLOW)
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [verificationStep, setVerificationStep] = useState<'idle' | 'sending' | 'otp' | 'verified'>('idle');

  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // CARICAMENTO INIZIALE
  useEffect(() => {
      if(!auth.currentUser) return;
      setIsEmailVerified(auth.currentUser.emailVerified);
      // Se l'utente ha già un numero collegato su Auth
      if(auth.currentUser.phoneNumber) {
          setPhoneNumber(auth.currentUser.phoneNumber);
          setIsPhoneVerified(true);
          setVerificationStep('verified');
      }

      // Carica Bio dal DB
      const userRef = doc(db, "users", auth.currentUser.uid);
      getDoc(userRef).then((snap) => {
          if (snap.exists()) {
              const data = snap.data();
              if (data.bio) setBio(data.bio);
          }
      });
  }, [user]);

  // --- LOGICA RECAPTCHA (Necessaria per SMS) ---
  const generateRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response: any) => {
          // reCAPTCHA solved
        }
      });
    }
  };

  // 1. INVIA SMS (Firebase Reale)
  const handleSendOtp = async () => {
      if (!phoneNumber || phoneNumber.length < 10) {
          toast({ title: "Numero non valido", description: "Inserisci il prefisso (es. +39333...)", variant: "destructive" });
          return;
      }
      
      setVerificationStep('sending');
      generateRecaptcha();
      const appVerifier = window.recaptchaVerifier;

      try {
          const confirmationResult = await linkWithPhoneNumber(auth.currentUser!, phoneNumber, appVerifier);
          window.confirmationResult = confirmationResult;
          setVerificationStep('otp');
          toast({ title: "SMS Inviato", description: "Controlla il tuo telefono." });
      } catch (error: any) {
          console.error(error);
          setVerificationStep('idle');
          if(error.code === 'auth/invalid-phone-number') toast({ title: "Numero Errato", variant: "destructive" });
          else if(error.code === 'auth/credential-already-in-use') toast({ title: "Numero già in uso", variant: "destructive" });
          else toast({ title: "Errore Invio", description: error.message, variant: "destructive" });
      }
  };

  // 2. VERIFICA CODICE OTP
  const handleVerifyOtp = async () => {
      if (otp.length !== 6) return;
      setLoading(true);
      try {
          // Conferma il codice
          const result = await window.confirmationResult.confirm(otp);
          // Se ok, aggiorna anche Firestore
          const userRef = doc(db, "users", auth.currentUser!.uid);
          await updateDoc(userRef, { phoneNumber: phoneNumber, phoneVerified: true });
          
          setIsPhoneVerified(true);
          setVerificationStep('verified');
          toast({ title: "Successo! 📞", description: "Numero collegato correttamente.", className: "bg-green-600 text-white" });
      } catch (error) {
          toast({ title: "Codice Errato", description: "Riprova.", variant: "destructive" });
      } finally {
          setLoading(false);
      }
  };

  // 3. VERIFICA EMAIL
  const handleVerifyEmail = async () => {
      if (!auth.currentUser) return;
      setLoading(true);
      try {
          await sendEmailVerification(auth.currentUser);
          toast({ title: "Email Inviata! 📧", description: `Controlla ${user?.email}.`, className: "bg-blue-600 text-white" });
      } catch (error) {
          toast({ title: "Errore", variant: "destructive" });
      } finally { setLoading(false); }
  };

  // 4. SALVA PROFILO
  const handleSaveProfile = async () => {
      if (!auth.currentUser) return;
      setLoading(true);
      try {
          await updateProfile(auth.currentUser, { displayName: displayName });
          await updateDoc(doc(db, "users", auth.currentUser.uid), { displayName, bio });
          toast({ title: "Profilo Aggiornato", className: "bg-green-600 text-white" });
      } catch (e) { toast({ title: "Errore", variant: "destructive" }); } 
      finally { setLoading(false); }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen text-white pb-20 animate-in fade-in">
        <div id="recaptcha-container"></div> {/* Necessario per Firebase */}
        
        <h1 className="text-3xl font-black text-white mb-8">Impostazioni & Account</h1>

        <Tabs defaultValue="account" className="w-full space-y-8">
            <TabsList className="bg-[#1a1d2d] border border-slate-700 w-full justify-start h-12 p-1 rounded-xl">
                <TabsTrigger value="account" className="flex-1 data-[state=active]:bg-cyan-900/50 data-[state=active]:text-white">Account</TabsTrigger>
                <TabsTrigger value="wallet" className="flex-1 data-[state=active]:bg-cyan-900/50 data-[state=active]:text-white">Wallet & Pagamenti</TabsTrigger>
                <TabsTrigger value="shipping" className="flex-1 data-[state=active]:bg-cyan-900/50 data-[state=active]:text-white">Spedizioni</TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="space-y-6">
                
                {/* PROFILO */}
                <Card className="bg-[#1a1d2d] border-slate-700 shadow-lg">
                    <CardHeader><CardTitle className="flex items-center gap-2 text-cyan-400"><User className="w-5 h-5"/> Profilo Pubblico</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2"><Label>Nome Utente</Label><Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="bg-black/30 border-slate-600 text-white" /></div>
                            <div className="space-y-2"><Label>Bio</Label><Input value={bio} onChange={(e) => setBio(e.target.value)} className="bg-black/30 border-slate-600 text-white" /></div>
                        </div>
                        <Button onClick={handleSaveProfile} disabled={loading} className="bg-cyan-600 hover:bg-cyan-500 text-white mt-2 font-bold">{loading ? <Loader2 className="animate-spin w-4 h-4"/> : "Salva Modifiche"}</Button>
                    </CardContent>
                </Card>

                {/* SICUREZZA & TELEFONO */}
                <Card className="bg-[#1a1d2d] border-slate-700 shadow-lg">
                    <CardHeader><CardTitle className="flex items-center gap-2 text-green-400"><ShieldCheck className="w-5 h-5"/> Sicurezza & Verifiche</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        
                        {/* EMAIL */}
                        <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-slate-800">
                            <div className="flex items-center gap-4"><div className="p-2 bg-slate-800 rounded-full"><Mail className="w-5 h-5 text-slate-300"/></div><div><p className="text-sm font-bold text-white">Email</p><p className="text-xs text-slate-400">{user?.email}</p></div></div>
                            {isEmailVerified ? <Badge className="bg-green-900/30 text-green-400 border-green-800 h-8 px-3"><CheckCircle className="w-4 h-4 mr-2"/> Verificata</Badge> : <Button size="sm" variant="outline" onClick={handleVerifyEmail}>Verifica Ora</Button>}
                        </div>

                        {/* TELEFONO (OTP FLOW) */}
                        <div className="flex flex-col p-4 bg-black/20 rounded-xl border border-slate-800">
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-slate-800 rounded-full"><Smartphone className="w-5 h-5 text-slate-300"/></div>
                                    <div>
                                        <p className="text-sm font-bold text-white">Numero di Cellulare</p>
                                        <p className="text-xs text-slate-400">{isPhoneVerified ? phoneNumber : "Non verificato"}</p>
                                    </div>
                                </div>
                                {isPhoneVerified && <Badge className="bg-green-900/30 text-green-400 border-green-800 h-8 px-3"><CheckCircle className="w-4 h-4 mr-2"/> Verificato</Badge>}
                            </div>

                            {/* ZONA INPUT TELEFONO */}
                            {!isPhoneVerified && (
                                <div className="mt-4 pt-4 border-t border-slate-700">
                                    {verificationStep === 'idle' || verificationStep === 'sending' ? (
                                        <div className="flex gap-2">
                                            <Input 
                                                placeholder="+39 333..." 
                                                value={phoneNumber} 
                                                onChange={(e) => setPhoneNumber(e.target.value)} 
                                                className="bg-black/30 border-slate-600 text-white"
                                            />
                                            <Button onClick={handleSendOtp} disabled={verificationStep === 'sending'} className="bg-green-600 hover:bg-green-500 text-white">
                                                {verificationStep === 'sending' ? <Loader2 className="animate-spin w-4 h-4"/> : "Invia SMS"}
                                            </Button>
                                        </div>
                                    ) : verificationStep === 'otp' ? (
                                        <div className="flex gap-2 animate-in slide-in-from-right">
                                            <Input 
                                                placeholder="Codice a 6 cifre" 
                                                value={otp} 
                                                onChange={(e) => setOtp(e.target.value)} 
                                                className="bg-black/30 border-slate-600 text-white tracking-widest text-center"
                                                maxLength={6}
                                            />
                                            <Button onClick={handleVerifyOtp} disabled={loading} className="bg-blue-600 hover:bg-blue-500 text-white">
                                                {loading ? <Loader2 className="animate-spin w-4 h-4"/> : "Conferma"}
                                            </Button>
                                        </div>
                                    ) : null}
                                </div>
                            )}
                        </div>

                        {/* 2FA */}
                        <div className="flex items-center justify-between pt-2 px-1"><div className="flex items-center gap-3"><Lock className="w-5 h-5 text-slate-400"/><Label className="text-slate-300 font-medium">Autenticazione a due fattori (2FA)</Label></div><Switch disabled /></div>
                    </CardContent>
                </Card>

                <div className="pt-6 border-t border-slate-800"><Button variant="destructive" className="w-full bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900 h-12 font-bold" onClick={() => auth.signOut()}><LogOut className="w-5 h-5 mr-2"/> Disconnetti da tutti i dispositivi</Button></div>
            </TabsContent>

            {/* TAB WALLET */}
            <TabsContent value="wallet">
                <Card className="bg-[#1a1d2d] border-slate-700 text-center py-16 shadow-lg"><CreditCard className="w-16 h-16 text-slate-600 mx-auto mb-6"/><h3 className="text-2xl text-white font-bold mb-2">Metodi di Pagamento</h3><p className="text-slate-400 mb-8 max-w-md mx-auto">Ricarica il saldo per acquistare.</p><Button className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 font-bold" onClick={() => window.location.href='/wallet'}>Vai al Wallet</Button></Card>
            </TabsContent>

            {/* TAB SPEDIZIONI */}
            <TabsContent value="shipping">
                <Card className="bg-[#1a1d2d] border-slate-700 text-center py-16 shadow-lg"><MapPin className="w-16 h-16 text-slate-600 mx-auto mb-6"/><h3 className="text-2xl text-white font-bold mb-2">Indirizzi di Spedizione</h3><p className="text-slate-400 mb-8 max-w-md mx-auto">Gestisci gli indirizzi per i premi fisici.</p><Button disabled className="bg-slate-700 text-slate-400 cursor-not-allowed px-8 border border-slate-600">Aggiungi Indirizzo (In Arrivo)</Button></Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Configura Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_key');

// Componente form di pagamento
const PaymentForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/kickstarter-demo',
        },
        redirect: 'if_required'
      });

      if (error) {
        toast({
          title: "Errore Pagamento",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Pagamento Completato",
          description: "Controlla la tua email per il codice di accesso!",
        });
        onSuccess();
      }
    } catch (error) {
      console.error('Errore pagamento:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il pagamento",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing} 
        className="w-full bg-green-600 hover:bg-green-700"
      >
        {isProcessing ? "Elaborazione..." : "Paga €2 (Rimborsabile)"}
      </Button>
    </form>
  );
};

export default function KickstarterDemo() {
  const [clientSecret, setClientSecret] = useState("");
  const [paymentStep, setPaymentStep] = useState<'intro' | 'email' | 'payment' | 'code' | 'demo'>('intro');
  const [email, setEmail] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentTutorial, setCurrentTutorial] = useState<string>('');
  const { toast } = useToast();

  // Tutorial steps per ogni sezione
  const tutorials = {
    scanner: {
      title: "📱 AI Scanner Demo",
      steps: [
        "Attiva la fotocamera del tuo dispositivo",
        "Punta l'obiettivo su un oggetto da riciclare",
        "L'AI riconoscerà automaticamente il materiale",
        "Riceverai suggerimenti istantanei per progetti upcycling"
      ]
    },
    generator: {
      title: "🎯 Project Generator Demo", 
      steps: [
        "Seleziona fino a 3 materiali dalla lista",
        "Scegli il livello di difficoltà preferito",
        "L'AI genererà progetti personalizzati in tempo reale",
        "Visualizza istruzioni dettagliate e lista materiali"
      ]
    },
    tracker: {
      title: "🌍 Eco-Impact Tracker Demo",
      steps: [
        "Monitora i progetti completati e materiali riciclati",
        "Visualizza l'impatto ambientale delle tue azioni",
        "Accumula punti eco e sblocca achievement",
        "Confronta i tuoi progressi con la community globale"
      ]
    }
  };

  const createPaymentIntent = async () => {
    if (!email || !email.includes('@')) {
      toast({
        title: "Email Richiesta",
        description: "Inserisci un'email valida per ricevere il codice di accesso",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await apiRequest("POST", "/api/create-demo-deposit", {
        amount: 2,
        email: email
      });
      const data = await response.json();
      
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setPaymentStep('payment');
        toast({
          title: "Deposito Demo Creato",
          description: "Completa il pagamento per ricevere il codice di accesso via email",
        });
      }
    } catch (error) {
      console.error("Errore creazione deposito:", error);
      toast({
        title: "Errore",
        description: "Impossibile creare il deposito demo. Riprova.",
        variant: "destructive",
      });
    }
  };

  const validateAccessCode = async () => {
    if (!accessCode || accessCode.length !== 8) {
      toast({
        title: "Codice Non Valido",
        description: "Inserisci il codice di 8 caratteri ricevuto via email",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await apiRequest("POST", "/api/validate-demo-code", {
        code: accessCode.toUpperCase()
      });
      const data = await response.json();
      
      if (data.success) {
        setPaymentStep('demo');
        toast({
          title: "Accesso Autorizzato",
          description: "Benvenuto nella demo EcoMaker! Esplora tutte le funzionalità.",
        });
      } else {
        toast({
          title: "Codice Non Valido",
          description: data.message || "Il codice inserito non è valido",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Errore validazione codice:", error);
      toast({
        title: "Errore",
        description: "Impossibile validare il codice. Riprova.",
        variant: "destructive",
      });
    }
  };

  const openTutorial = (type: string) => {
    setCurrentTutorial(type);
    setShowTutorial(true);
  };

  // Renderizza la fase introduttiva
  if (paymentStep === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              🌱 EcoMaker Demo
            </h1>
            <p className="text-xl text-slate-300 mb-6">
              Esplora il futuro dell'upcycling sostenibile con la nostra demo interattiva
            </p>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Deposito €2 - 100% Rimborsabile entro 30 giorni
            </Badge>
          </div>

          {/* Sezioni demo */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-slate-800/50 border-slate-700 hover:border-green-500 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-green-400 text-xl">📱 AI Scanner</CardTitle>
                <CardDescription className="text-slate-300">
                  Riconoscimento intelligente dei materiali tramite fotocamera
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-slate-400 space-y-2 mb-4">
                  <li>• Scansione istantanea oggetti</li>
                  <li>• Identificazione materiali AI</li>
                  <li>• Suggerimenti progetti real-time</li>
                  <li>• Database 500+ materiali</li>
                </ul>
                <Button 
                  variant="outline" 
                  onClick={() => setPaymentStep('email')}
                  className="w-full border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
                >
                  Prova Demo
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-blue-400 text-xl">🎯 Project Generator</CardTitle>
                <CardDescription className="text-slate-300">
                  Creazione progetti personalizzati con AI avanzata
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-slate-400 space-y-2 mb-4">
                  <li>• Combinazioni multi-materiale</li>
                  <li>• Progetti adattivi per skill</li>
                  <li>• Istruzioni step-by-step</li>
                  <li>• Calcolo impatto ambientale</li>
                </ul>
                <Button 
                  variant="outline" 
                  onClick={() => setPaymentStep('email')}
                  className="w-full border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                >
                  Prova Demo
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:border-purple-500 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-purple-400 text-xl">🌍 Eco-Impact Tracker</CardTitle>
                <CardDescription className="text-slate-300">
                  Monitoraggio completo dell'impatto ambientale
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-slate-400 space-y-2 mb-4">
                  <li>• Tracking CO2 risparmiata</li>
                  <li>• Sistema achievement gamificato</li>
                  <li>• Statistiche community globale</li>
                  <li>• Report sostenibilità personalizzati</li>
                </ul>
                <Button 
                  variant="outline" 
                  onClick={() => setPaymentStep('email')}
                  className="w-full border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
                >
                  Prova Demo
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Benefici per contributor */}
          <Card className="bg-gradient-to-r from-green-800/30 to-blue-800/30 border-green-500/50">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-green-400">
                Perché Supportare EcoMaker su Kickstarter?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">💰 Vantaggi Economici</h3>
                  <ul className="text-slate-300 space-y-2">
                    <li>• Accesso Early Bird a prezzo scontato del 40%</li>
                    <li>• App lifetime gratuita (valore €299/anno)</li>
                    <li>• Deposito demo 100% rimborsabile</li>
                    <li>• ROI investimento stimato: 25:1 LTV/CAC</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">🌱 Impatto Ambientale</h3>
                  <ul className="text-slate-300 space-y-2">
                    <li>• Riduzione rifiuti domestici del 60%</li>
                    <li>• Saving CO2: 2.5 tonnellate/anno per utente</li>
                    <li>• Contributo economia circolare globale</li>
                    <li>• Exit target €2B mercato sostenibilità</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <Button 
              size="lg" 
              onClick={() => setPaymentStep('email')}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3 text-lg"
            >
              Inizia Demo con Deposito €2
            </Button>
            <p className="text-sm text-slate-400 mt-3">
              Deposito completamente rimborsabile • Accesso immediato • Codice via email
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Renderizza la fase email
  if (paymentStep === 'email') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-6">
        <div className="max-w-md mx-auto mt-20">
          <Card className="bg-slate-800/90 border-slate-700">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-green-400">📧 Email per Codice Accesso</CardTitle>
              <CardDescription className="text-slate-300">
                Inserisci la tua email per ricevere il codice di accesso demo dopo il pagamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Email *</label>
                <Input
                  type="email"
                  placeholder="tua.email@esempio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
                <p className="text-xs text-slate-400">
                  Il codice di accesso a 8 caratteri sarà inviato a questa email dopo il pagamento
                </p>
              </div>

              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h4 className="font-medium text-white mb-2">Cosa Include il Deposito €2:</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>✅ Accesso completo demo per 30 giorni</li>
                  <li>✅ Codice sicuro inviato via email</li>
                  <li>✅ Rimborso 100% garantito</li>
                  <li>✅ Supporto priority per contributor</li>
                </ul>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={createPaymentIntent}
                  disabled={!email}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Procedi al Pagamento €2
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setPaymentStep('intro')}
                  className="w-full border-slate-600 text-slate-300"
                >
                  Indietro
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Renderizza la fase pagamento
  if (paymentStep === 'payment' && clientSecret) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-6">
        <div className="max-w-md mx-auto mt-20">
          <Card className="bg-slate-800/90 border-slate-700">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-green-400">💳 Pagamento Sicuro</CardTitle>
              <CardDescription className="text-slate-300">
                Deposito €2 rimborsabile al 100% • Powered by Stripe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm onSuccess={() => setPaymentStep('code')} />
              </Elements>
              
              <div className="text-center mt-4">
                <Button 
                  variant="ghost" 
                  onClick={() => setPaymentStep('email')}
                  className="text-slate-400 hover:text-white"
                >
                  Indietro
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Renderizza la fase inserimento codice
  if (paymentStep === 'code') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-6">
        <div className="max-w-md mx-auto mt-20">
          <Card className="bg-slate-800/90 border-slate-700">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-green-400">🔑 Inserisci Codice Accesso</CardTitle>
              <CardDescription className="text-slate-300">
                Controlla la tua email ({email}) per il codice di accesso a 8 caratteri
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Codice Accesso *</label>
                <Input
                  type="text"
                  placeholder="ABC123XY"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  maxLength={8}
                  className="bg-slate-700 border-slate-600 text-white text-center text-lg tracking-wider"
                  required
                />
                <p className="text-xs text-slate-400">
                  Il codice è stato inviato via email e scade tra 30 giorni
                </p>
              </div>

              <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-700/50">
                <h4 className="font-medium text-blue-300 mb-2">📧 Non hai ricevuto l'email?</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Controlla la cartella spam/promozioni</li>
                  <li>• L'invio può richiedere fino a 5 minuti</li>
                  <li>• Verifica che l'email sia corretta: {email}</li>
                </ul>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={validateAccessCode}
                  disabled={!accessCode || accessCode.length !== 8}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Accedi alla Demo
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setPaymentStep('email')}
                  className="w-full border-slate-600 text-slate-300"
                >
                  Cambia Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Renderizza la demo completa
  if (paymentStep === 'demo') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header Demo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              🎉 Benvenuto nella Demo EcoMaker!
            </h1>
            <Badge className="bg-green-600 text-white">
              Accesso Autorizzato • Utente: {email}
            </Badge>
          </div>

          {/* Demo Sections */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-slate-800/50 border-green-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-green-500 text-white px-2 py-1 text-xs">ATTIVO</div>
              <CardHeader>
                <CardTitle className="text-green-400">📱 AI Scanner Demo</CardTitle>
                <CardDescription>Test riconoscimento materiali in tempo reale</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={85} className="mb-4" />
                <p className="text-sm text-slate-400 mb-4">Precisione AI: 94.7%</p>
                <div className="space-y-2">
                  <Button onClick={() => openTutorial('scanner')} variant="outline" className="w-full">
                    Tutorial Guidato
                  </Button>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Avvia Scanner
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-blue-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-2 py-1 text-xs">ATTIVO</div>
              <CardHeader>
                <CardTitle className="text-blue-400">🎯 Project Generator</CardTitle>
                <CardDescription>Genera progetti personalizzati con AI</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={92} className="mb-4" />
                <p className="text-sm text-slate-400 mb-4">Progetti generati: 1,247</p>
                <div className="space-y-2">
                  <Button onClick={() => openTutorial('generator')} variant="outline" className="w-full">
                    Tutorial Guidato
                  </Button>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Genera Progetto
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-purple-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-purple-500 text-white px-2 py-1 text-xs">ATTIVO</div>
              <CardHeader>
                <CardTitle className="text-purple-400">🌍 Eco-Impact Tracker</CardTitle>
                <CardDescription>Monitora il tuo impatto ambientale</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={78} className="mb-4" />
                <p className="text-sm text-slate-400 mb-4">CO2 risparmiata: 2.3kg</p>
                <div className="space-y-2">
                  <Button onClick={() => openTutorial('tracker')} variant="outline" className="w-full">
                    Tutorial Guidato
                  </Button>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Visualizza Stats
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <Card className="bg-gradient-to-r from-green-800/30 to-blue-800/30 border-green-500/50 mb-8">
            <CardHeader>
              <CardTitle className="text-center text-white">📊 Le Tue Statistiche Demo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-400">15</div>
                  <div className="text-sm text-slate-300">Materiali Scansionati</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">7</div>
                  <div className="text-sm text-slate-300">Progetti Generati</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">342</div>
                  <div className="text-sm text-slate-300">Punti Eco</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400">2.3kg</div>
                  <div className="text-sm text-slate-300">CO2 Risparmiata</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Finale */}
          <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
            <CardContent className="text-center p-8">
              <h2 className="text-2xl font-bold mb-4">Ti Piace EcoMaker? Supporta il Progetto!</h2>
              <p className="text-lg mb-6">
                Unisciti alla campagna Kickstarter e aiutaci a rivoluzionare l'upcycling globale
              </p>
              <Button 
                size="lg" 
                className="bg-white text-green-600 hover:bg-gray-100 mr-4"
              >
                Vai al Kickstarter
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-green-600"
              >
                Scarica Documenti
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Tutorial Modal */}
        {showTutorial && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <Card className="bg-slate-800 border-slate-700 max-w-lg w-full">
              <CardHeader>
                <CardTitle className="text-white">{tutorials[currentTutorial as keyof typeof tutorials]?.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="text-slate-300 space-y-3">
                  {tutorials[currentTutorial as keyof typeof tutorials]?.steps.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">
                        {index + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
                <div className="flex justify-end space-x-3 mt-6">
                  <Button variant="outline" onClick={() => setShowTutorial(false)}>
                    Chiudi
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Inizia Tutorial
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }

  return null;
}
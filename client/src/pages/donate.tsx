import React from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Heart, Leaf, Recycle, ArrowRight, CheckCircle, User, Users, TrendingUp, Globe } from "lucide-react";

export default function DonatePage() {
  const [donationAmount, setDonationAmount] = React.useState<string>("25");
  const [customAmount, setCustomAmount] = React.useState<string>("");
  const [donationFrequency, setDonationFrequency] = React.useState<string>("monthly");
  const [donationCompleted, setDonationCompleted] = React.useState<boolean>(false);
  
  const predefinedAmounts = ["10", "25", "50", "100"];

  const handleAmountClick = (amount: string) => {
    setDonationAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setCustomAmount(value);
      setDonationAmount("custom");
    }
  };

  const handleDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulazione di invio donazione
    setTimeout(() => {
      setDonationCompleted(true);
    }, 1000);
  };

  const impactData = [
    {
      icon: <Recycle className="h-10 w-10" />,
      amount: "5 Tonnellate",
      title: "Materiali riciclati",
      description: "Materiali salvati dalle discariche e riutilizzati per progetti creativi."
    },
    {
      icon: <Users className="h-10 w-10" />,
      amount: "1.500+",
      title: "Partecipanti ai workshop",
      description: "Persone che hanno imparato tecniche di upcycling nei nostri workshop."
    },
    {
      icon: <TrendingUp className="h-10 w-10" />,
      amount: "350+",
      title: "Progetti comunitari",
      description: "Iniziative locali di riciclo creativo finanziate dalle donazioni."
    },
    {
      icon: <Globe className="h-10 w-10" />,
      amount: "12 Tonnellate",
      title: "CO₂ risparmiata",
      description: "Impatto ambientale positivo grazie al riutilizzo dei materiali."
    }
  ];

  const donationUseCases = [
    {
      title: "Educazione e workshop",
      description: "Organizziamo workshop gratuiti nelle scuole e comunità per insegnare tecniche di riciclo creativo.",
      percentage: 30
    },
    {
      title: "Materiali per progetti comunitari",
      description: "Forniamo materiali e strumenti per iniziative di riciclo in comunità svantaggiate.",
      percentage: 25
    },
    {
      title: "Tecnologia e sviluppo",
      description: "Miglioriamo la nostra app e strumenti di AI per suggerire progetti sempre più innovativi.",
      percentage: 20
    },
    {
      title: "Ricerca e innovazione",
      description: "Studiamo nuove tecniche di upcycling e collaboriamo con esperti di sostenibilità.",
      percentage: 15
    },
    {
      title: "Operazioni e logistica",
      description: "Manteniamo i nostri spazi fisici e organizziamo eventi di raccolta materiali.",
      percentage: 10
    }
  ];

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-block p-2 bg-red-100 rounded-full mb-4">
              <Heart className="h-6 w-6 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-primary mb-4">Dona alla causa</h1>
            <p className="text-neutral-medium max-w-2xl mx-auto">
              Il tuo supporto ci aiuta a promuovere il riciclo creativo, ridurre i rifiuti e 
              costruire comunità più sostenibili attraverso progetti di upcycling.
            </p>
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Impact Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">Il tuo impatto</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {impactData.map((item, index) => (
                  <Card key={index} className="border-neutral-light bg-white">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="p-3 bg-primary/10 rounded-full mb-4 text-primary">
                          {item.icon}
                        </div>
                        <p className="text-2xl font-bold text-primary mb-2">{item.amount}</p>
                        <h3 className="font-semibold mb-2">{item.title}</h3>
                        <p className="text-sm text-neutral-medium">{item.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="border-neutral-light mb-6">
                <CardHeader>
                  <CardTitle>Come utilizziamo le donazioni</CardTitle>
                  <CardDescription>
                    Ogni donazione viene allocata strategicamente per massimizzare l'impatto ambientale e sociale.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {donationUseCases.map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{item.title}</span>
                          <span className="text-primary font-medium">{item.percentage}%</span>
                        </div>
                        <div className="w-full bg-neutral-100 rounded-full h-2.5">
                          <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-neutral-medium mt-1 mb-3">{item.description}</p>
                        {index < donationUseCases.length - 1 && <Separator className="my-2" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-neutral-light bg-gradient-to-br from-green-50 to-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className="p-3 bg-green-100 rounded-full mr-4">
                      <Leaf className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Trasparenza garantita</h3>
                      <p className="text-neutral-dark mb-2">
                        Pubblichiamo regolarmente report dettagliati sull'utilizzo delle donazioni 
                        e l'impatto ambientale che abbiamo raggiunto insieme.
                      </p>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-green-600"
                        onClick={() => alert("I report di trasparenza e impatto ambientale saranno disponibili a breve.")}
                      >
                        Vedi i nostri report <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Donation Form */}
            <div>
              <Card className="border-neutral-light bg-white shadow-md overflow-hidden">
                {donationCompleted ? (
                  <div className="p-8 text-center">
                    <div className="p-4 bg-green-100 rounded-full inline-flex mx-auto mb-6">
                      <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-green-700 mb-4">Grazie per la tua donazione!</h2>
                    <p className="text-neutral-dark mb-6">
                      Il tuo contributo ci aiuterà a fare la differenza. Abbiamo inviato una ricevuta 
                      all'indirizzo email fornito.
                    </p>
                    <div className="p-4 bg-green-50 rounded-lg mb-6 inline-block">
                      <p className="text-lg font-semibold text-green-700">
                        {donationFrequency === "monthly" ? "Donazione mensile" : "Donazione una tantum"}: {donationAmount === "custom" ? customAmount : donationAmount}€
                      </p>
                    </div>
                    <p className="text-neutral-medium mb-6">
                      Ti terremo aggiornato su come il tuo supporto sta facendo la differenza.
                    </p>
                    <div className="flex justify-center space-x-4">
                      <Button onClick={() => setDonationCompleted(false)}>
                        Effettua un'altra donazione
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => window.location.href = '/'}
                      >
                        Torna alla home
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <CardHeader className="pb-4">
                      <CardTitle>La tua donazione</CardTitle>
                      <CardDescription>
                        Ogni contributo, piccolo o grande, aiuta a rendere il mondo più sostenibile.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleDonationSubmit}>
                        <div className="space-y-6">
                          {/* Donation frequency */}
                          <div>
                            <Label className="mb-2 block">Frequenza della donazione</Label>
                            <Tabs 
                              defaultValue="monthly" 
                              value={donationFrequency} 
                              onValueChange={setDonationFrequency}
                              className="w-full"
                            >
                              <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="monthly">Mensile</TabsTrigger>
                                <TabsTrigger value="onetime">Una tantum</TabsTrigger>
                              </TabsList>
                            </Tabs>
                          </div>
                          
                          {/* Amount selection */}
                          <div>
                            <Label className="mb-2 block">Importo della donazione (€)</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                              {predefinedAmounts.map(amount => (
                                <Button
                                  key={amount}
                                  type="button"
                                  variant={donationAmount === amount ? "default" : "outline"}
                                  onClick={() => handleAmountClick(amount)}
                                  className="h-12"
                                >
                                  {amount}€
                                </Button>
                              ))}
                            </div>
                            <div className="relative">
                              <Input 
                                type="text"
                                placeholder="Importo personalizzato"
                                value={customAmount}
                                onChange={handleCustomAmountChange}
                                className="h-12 pl-8"
                              />
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-medium">
                                €
                              </span>
                            </div>
                          </div>
                          
                          {/* Payment info */}
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="fullName">Nome completo</Label>
                              <Input id="fullName" placeholder="Nome e cognome" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input id="email" type="email" placeholder="La tua email" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="cardNumber">Numero carta</Label>
                                <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-2">
                                  <Label htmlFor="expiry">Scadenza</Label>
                                  <Input id="expiry" placeholder="MM/AA" />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="cvc">CVC</Label>
                                  <Input id="cvc" placeholder="123" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6 p-4 bg-primary/5 rounded-lg mb-6">
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">Importo donazione:</span>
                            <span className="font-medium">
                              {donationAmount === "custom" ? 
                                (customAmount ? `${customAmount}€` : "0€") : 
                                `${donationAmount}€`
                              }
                            </span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">Frequenza:</span>
                            <span className="font-medium">
                              {donationFrequency === "monthly" ? "Mensile" : "Una tantum"}
                            </span>
                          </div>
                          <Separator className="my-3" />
                          <div className="flex justify-between text-primary">
                            <span className="font-semibold">Totale:</span>
                            <span className="font-semibold">
                              {donationAmount === "custom" ? 
                                (customAmount ? `${customAmount}€` : "0€") : 
                                `${donationAmount}€`}
                              {donationFrequency === "monthly" ? "/mese" : ""}
                            </span>
                          </div>
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full"
                          onClick={(e) => {
                            e.preventDefault();
                            setDonationCompleted(true);
                          }}
                        >
                          <Heart className="mr-2 h-4 w-4" /> 
                          Dona ora
                        </Button>
                        
                        <p className="text-xs text-neutral-medium mt-4 text-center">
                          Utilizziamo Stripe per processare le donazioni in modo sicuro.<br />
                          La tua carta non verrà addebitata fino alla conferma finale.
                        </p>
                      </form>
                    </CardContent>
                  </>
                )}
              </Card>

              {!donationCompleted && (
                <div className="mt-6">
                  <Card className="border-neutral-light">
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <div className="p-2 bg-primary/10 rounded-full mr-4">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Altre modalità di donazione</h3>
                          <p className="text-sm text-neutral-medium mb-4">
                            Preferisci altre opzioni? Puoi effettuare bonifici bancari, donazioni PayPal, 
                            o contribuire con materiali per i nostri progetti.
                          </p>
                          <Button variant="outline" size="sm">
                            Scopri altre opzioni
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-center mb-8">Chi sostiene la nostra missione</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-neutral-light bg-white shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 rounded-full bg-primary/20 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">MR</span>
                  </div>
                  <h3 className="font-semibold mb-2">Marco Rossi</h3>
                  <p className="text-sm text-neutral-medium mb-4">Donatore mensile da 1 anno</p>
                  <p className="text-neutral-dark italic">
                    "Sostengo EcoMaker perché trasforma in modo tangibile il modo in cui vediamo i rifiuti. 
                    I workshop nelle scuole stanno educando la prossima generazione."
                  </p>
                </CardContent>
              </Card>
              <Card className="border-neutral-light bg-white shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 rounded-full bg-primary/20 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">LV</span>
                  </div>
                  <h3 className="font-semibold mb-2">Laura Verdi</h3>
                  <p className="text-sm text-neutral-medium mb-4">Sostenitrice e volontaria</p>
                  <p className="text-neutral-dark italic">
                    "Non solo dono finanziariamente, ma partecipo anche ai progetti comunitari. 
                    Vedere l'impatto diretto che abbiamo nel quartiere è incredibilmente gratificante."
                  </p>
                </CardContent>
              </Card>
              <Card className="border-neutral-light bg-white shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 rounded-full bg-primary/20 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">EB</span>
                  </div>
                  <h3 className="font-semibold mb-2">EcoBusiness SRL</h3>
                  <p className="text-sm text-neutral-medium mb-4">Partner aziendale</p>
                  <p className="text-neutral-dark italic">
                    "Come azienda, collaborare con EcoMaker ci ha permesso di ridurre gli sprechi 
                    e coinvolgere i dipendenti in iniziative sostenibili significative."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Other ways to support */}
          <div className="text-center mb-16">
            <h2 className="text-2xl font-semibold mb-8">Altri modi per supportare la nostra missione</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-neutral-light bg-white shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-blue-100 rounded-full inline-flex mx-auto mb-4">
                    <Recycle className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Dona materiali</h3>
                  <p className="text-neutral-medium mb-4">
                    Hai materiali che potrebbero essere riutilizzati? Donali alla nostra community per progetti creativi.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => alert("Ti mostreremo tutte le informazioni riguardo i nostri workshop di upcycling. Questa funzionalità sarà disponibile a breve.")}
                  >
                    Scopri come
                  </Button>
                </CardContent>
              </Card>
              <Card className="border-neutral-light bg-white shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-purple-100 rounded-full inline-flex mx-auto mb-4">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Diventa volontario</h3>
                  <p className="text-neutral-medium mb-4">
                    Offri il tuo tempo e le tue competenze per aiutare a organizzare workshop, eventi e progetti comunitari.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => alert("Ti mostreremo informazioni su come puoi diventare volontario. Questa funzionalità sarà disponibile a breve.")}
                  >
                    Unisciti a noi
                  </Button>
                </CardContent>
              </Card>
              <Card className="border-neutral-light bg-white shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-orange-100 rounded-full inline-flex mx-auto mb-4">
                    <Globe className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Diffondi la voce</h3>
                  <p className="text-neutral-medium mb-4">
                    Condividi i nostri progetti sui social media e invita amici e familiari a unirsi alla nostra community.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => alert("Ti mostreremo le opzioni per condividere la nostra pagina sui social media. Questa funzionalità sarà disponibile a breve.")}
                  >
                    Condividi ora
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-2xl font-semibold text-center mb-6">Domande frequenti sulle donazioni</h2>
            <Card className="border-neutral-light">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Le donazioni sono deducibili fiscalmente?</h3>
                    <p className="text-neutral-medium mb-4">
                      Sì, EcoMaker è un'organizzazione non profit riconosciuta e le donazioni sono deducibili fiscalmente 
                      secondo la normativa vigente. Ti invieremo una ricevuta per la dichiarazione dei redditi.
                    </p>
                    
                    <h3 className="font-semibold text-lg mb-2">Posso annullare la mia donazione mensile?</h3>
                    <p className="text-neutral-medium">
                      Puoi annullare la tua donazione ricorrente in qualsiasi momento dal tuo profilo o 
                      contattando il nostro team di supporto. Non ci sono penalità o costi aggiuntivi.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Come viene utilizzato esattamente il denaro?</h3>
                    <p className="text-neutral-medium mb-4">
                      Pubblichiamo report trimestrali dettagliati che mostrano come vengono allocate le donazioni. 
                      La maggior parte dei fondi va direttamente a progetti educativi e comunitari.
                    </p>
                    
                    <h3 className="font-semibold text-lg mb-2">Posso donare a un progetto specifico?</h3>
                    <p className="text-neutral-medium">
                      Sì, abbiamo un'opzione per donazioni mirate. Contattaci dopo la donazione specificando 
                      il progetto che desideri supportare e allocheremo i fondi di conseguenza.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-neutral-50 px-6 py-4 flex justify-center">
                <Button variant="link">
                  Visualizza tutte le FAQ sulle donazioni <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
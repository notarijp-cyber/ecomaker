import React from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cookie, CheckCircle, XCircle, Settings, AlertTriangle } from "lucide-react";

export default function CookiePolicyPage() {
  const lastUpdated = "15 Gennaio 2023";

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-block p-2 bg-primary/10 rounded-full mb-4">
              <Cookie className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-primary mb-4">Cookie Policy</h1>
            <p className="text-neutral-medium max-w-2xl mx-auto">
              Questa policy spiega come utilizziamo i cookie e tecnologie simili sul nostro sito web e nella nostra app.
            </p>
            <p className="text-sm text-neutral-medium mt-4">
              Ultimo aggiornamento: {lastUpdated}
            </p>
          </div>

          <div className="mb-8">
            <Tabs defaultValue="general">
              <TabsList className="w-full grid grid-cols-3 mb-8">
                <TabsTrigger value="general">Informazioni generali</TabsTrigger>
                <TabsTrigger value="cookies">I nostri cookie</TabsTrigger>
                <TabsTrigger value="management">Gestione dei cookie</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Cosa sono i cookie?</h2>
                        <p className="text-neutral-medium mb-3">
                          I cookie sono piccoli file di testo che vengono memorizzati sul tuo dispositivo (computer, tablet, smartphone) 
                          quando visiti un sito web o utilizzi un'app. Sono ampiamente utilizzati per far funzionare i siti web in modo 
                          più efficiente, memorizzare le preferenze dell'utente e fornire informazioni ai proprietari del sito.
                        </p>
                        <p className="text-neutral-medium">
                          I cookie possono essere "persistenti" o "di sessione". I cookie persistenti rimangono sul tuo dispositivo fino 
                          alla data di scadenza impostata o fino a quando non li elimini. I cookie di sessione vengono eliminati quando chiudi il browser.
                        </p>
                      </div>
                      
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Come utilizziamo i cookie</h2>
                        <p className="text-neutral-medium mb-3">
                          Utilizziamo i cookie per diversi scopi, tra cui:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-neutral-medium">
                          <li>Consentire il funzionamento essenziale del nostro sito e app</li>
                          <li>Ricordare le tue preferenze e impostazioni</li>
                          <li>Migliorare la velocità e la sicurezza del servizio</li>
                          <li>Analizzare come gli utenti interagiscono con il nostro servizio</li>
                          <li>Personalizzare l'esperienza in base alle tue precedenti interazioni</li>
                          <li>Fornire funzionalità social media e contenuti personalizzati</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Tipi di cookie che utilizziamo</h2>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-4">
                            <div className="p-1 mt-0.5 bg-green-100 rounded-full text-green-600">
                              <CheckCircle className="h-4 w-4" />
                            </div>
                            <div>
                              <h3 className="font-semibold mb-1">Cookie necessari</h3>
                              <p className="text-neutral-medium text-sm">
                                Questi cookie sono essenziali per il funzionamento del nostro sito web e app. Senza questi cookie, 
                                il servizio non funzionerebbe correttamente. Non possono essere disattivati.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-4">
                            <div className="p-1 mt-0.5 bg-blue-100 rounded-full text-blue-600">
                              <Settings className="h-4 w-4" />
                            </div>
                            <div>
                              <h3 className="font-semibold mb-1">Cookie funzionali</h3>
                              <p className="text-neutral-medium text-sm">
                                Questi cookie consentono funzionalità avanzate come la memorizzazione delle preferenze, il login e altre funzioni personalizzate. 
                                Se disattivati, alcune funzionalità potrebbero non essere disponibili.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-4">
                            <div className="p-1 mt-0.5 bg-yellow-100 rounded-full text-yellow-600">
                              <AlertTriangle className="h-4 w-4" />
                            </div>
                            <div>
                              <h3 className="font-semibold mb-1">Cookie analitici</h3>
                              <p className="text-neutral-medium text-sm">
                                Questi cookie ci aiutano a capire come gli utenti interagiscono con il nostro servizio raccogliendo 
                                informazioni in forma anonima. Utilizziamo queste informazioni per migliorare il nostro sito e app.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-4">
                            <div className="p-1 mt-0.5 bg-red-100 rounded-full text-red-600">
                              <XCircle className="h-4 w-4" />
                            </div>
                            <div>
                              <h3 className="font-semibold mb-1">Cookie di marketing (non utilizzati)</h3>
                              <p className="text-neutral-medium text-sm">
                                <strong>Non utilizziamo cookie di marketing o pubblicitari.</strong> Il nostro impegno per la sostenibilità 
                                si estende anche alla nostra politica digitale, preferendo un'esperienza priva di tracciamento pubblicitario.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Tecnologie simili</h2>
                        <p className="text-neutral-medium mb-3">
                          Oltre ai cookie, potremmo utilizzare altre tecnologie simili:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-neutral-medium">
                          <li><strong>Web beacon:</strong> Piccole immagini trasparenti che ci consentono di verificare se hai visitato determinate pagine</li>
                          <li><strong>Storage locale HTML5:</strong> Consente di memorizzare dati sul tuo dispositivo in modo simile ai cookie ma con maggiore capacità</li>
                          <li><strong>Fingerprinting:</strong> Tecnica che raccoglie informazioni sul tuo browser e dispositivo per identificarti</li>
                        </ul>
                        <p className="text-neutral-medium mt-3">
                          Utilizziamo queste tecnologie con lo stesso scopo e sotto gli stessi principi dei cookie descritti in questa policy.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="cookies">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Cookie specifici che utilizziamo</h2>
                        <p className="text-neutral-medium mb-6">
                          Di seguito è riportato un elenco dettagliato dei cookie che utilizziamo sul nostro sito web e nella nostra app.
                        </p>
                        
                        <div className="space-y-8">
                          <div>
                            <h3 className="text-lg font-semibold border-b border-neutral-200 pb-2 mb-4">Cookie necessari</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div className="font-medium">Nome cookie</div>
                              <div className="font-medium">Scopo</div>
                              <div className="font-medium">Durata</div>
                            </div>
                            
                            <div className="mt-2 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm py-2 border-b border-neutral-100">
                                <div className="text-neutral-dark">session_id</div>
                                <div className="text-neutral-medium">Identifica la sessione dell'utente e mantiene lo stato di login</div>
                                <div className="text-neutral-medium">Sessione</div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm py-2 border-b border-neutral-100">
                                <div className="text-neutral-dark">csrf_token</div>
                                <div className="text-neutral-medium">Protegge contro attacchi CSRF (Cross-Site Request Forgery)</div>
                                <div className="text-neutral-medium">Sessione</div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm py-2">
                                <div className="text-neutral-dark">cookie_consent</div>
                                <div className="text-neutral-medium">Memorizza le preferenze sui cookie dell'utente</div>
                                <div className="text-neutral-medium">1 anno</div>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-semibold border-b border-neutral-200 pb-2 mb-4">Cookie funzionali</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div className="font-medium">Nome cookie</div>
                              <div className="font-medium">Scopo</div>
                              <div className="font-medium">Durata</div>
                            </div>
                            
                            <div className="mt-2 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm py-2 border-b border-neutral-100">
                                <div className="text-neutral-dark">user_preferences</div>
                                <div className="text-neutral-medium">Salva le preferenze dell'utente (tema, impostazioni)</div>
                                <div className="text-neutral-medium">1 anno</div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm py-2 border-b border-neutral-100">
                                <div className="text-neutral-dark">recent_projects</div>
                                <div className="text-neutral-medium">Memorizza gli ultimi progetti visualizzati</div>
                                <div className="text-neutral-medium">30 giorni</div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm py-2">
                                <div className="text-neutral-dark">language</div>
                                <div className="text-neutral-medium">Memorizza la lingua preferita dell'utente</div>
                                <div className="text-neutral-medium">1 anno</div>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-semibold border-b border-neutral-200 pb-2 mb-4">Cookie analitici</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div className="font-medium">Nome cookie</div>
                              <div className="font-medium">Scopo</div>
                              <div className="font-medium">Durata</div>
                            </div>
                            
                            <div className="mt-2 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm py-2 border-b border-neutral-100">
                                <div className="text-neutral-dark">_ga</div>
                                <div className="text-neutral-medium">Utilizzato da Google Analytics per distinguere gli utenti</div>
                                <div className="text-neutral-medium">2 anni</div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm py-2 border-b border-neutral-100">
                                <div className="text-neutral-dark">_gid</div>
                                <div className="text-neutral-medium">Utilizzato da Google Analytics per distinguere gli utenti</div>
                                <div className="text-neutral-medium">24 ore</div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm py-2">
                                <div className="text-neutral-dark">_gat</div>
                                <div className="text-neutral-medium">Utilizzato da Google Analytics per limitare la frequenza delle richieste</div>
                                <div className="text-neutral-medium">1 minuto</div>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-semibold border-b border-neutral-200 pb-2 mb-4">Cookie di terze parti</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div className="font-medium">Provider</div>
                              <div className="font-medium">Scopo</div>
                              <div className="font-medium">Privacy Policy</div>
                            </div>
                            
                            <div className="mt-2 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm py-2 border-b border-neutral-100">
                                <div className="text-neutral-dark">Google Analytics</div>
                                <div className="text-neutral-medium">Analisi del comportamento dell'utente per migliorare il servizio</div>
                                <div className="text-neutral-medium">
                                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                    Privacy Policy
                                  </a>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm py-2">
                                <div className="text-neutral-dark">Stripe</div>
                                <div className="text-neutral-medium">Elaborazione dei pagamenti per donazioni</div>
                                <div className="text-neutral-medium">
                                  <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                    Privacy Policy
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="management">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Come gestire i cookie</h2>
                        <p className="text-neutral-medium mb-6">
                          Puoi controllare e gestire i cookie in diversi modi. Tieni presente che la rimozione o il blocco dei 
                          cookie potrebbe influire sulla tua esperienza utente e parti del nostro servizio potrebbero non funzionare correttamente.
                        </p>
                        
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Impostazioni del browser</h3>
                            <p className="text-neutral-medium mb-3">
                              La maggior parte dei browser web ti consente di controllare i cookie attraverso le impostazioni. 
                              Puoi generalmente trovare queste impostazioni nelle "Opzioni", "Preferenze" o nel menu "Impostazioni" del tuo browser:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-neutral-medium">
                              <li><strong>Chrome:</strong> Menu {'->'} Impostazioni {'->'} Mostra impostazioni avanzate {'->'} Privacy {'->'} Impostazioni contenuti</li>
                              <li><strong>Firefox:</strong> Menu {'->'} Opzioni {'->'} Privacy {'->'} Cronologia {'->'} Impostazioni personalizzate</li>
                              <li><strong>Safari:</strong> Preferenze {'->'} Privacy</li>
                              <li><strong>Edge:</strong> Menu {'->'} Impostazioni {'->'} Cancella dati di navigazione</li>
                              <li><strong>Opera:</strong> Preferenze {'->'} Avanzate {'->'} Cookie</li>
                            </ul>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Dispositivi mobili</h3>
                            <p className="text-neutral-medium mb-3">
                              Sui dispositivi mobili, puoi gestire le impostazioni relative ai cookie e al tracciamento attraverso:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-neutral-medium">
                              <li><strong>iOS:</strong> Impostazioni {'->'} Safari {'->'} Blocca tutti i cookie</li>
                              <li><strong>Android:</strong> Apri Chrome {'->'} Impostazioni {'->'} Impostazioni sito {'->'} Cookie</li>
                            </ul>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Opt-out dai cookie analitici</h3>
                            <p className="text-neutral-medium mb-3">
                              Puoi scegliere di non essere tracciato da Google Analytics installando il 
                              <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline mx-1">
                                componente aggiuntivo del browser per la disattivazione di Google Analytics
                              </a>.
                            </p>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Le tue preferenze su EcoMaker</h3>
                            <p className="text-neutral-medium mb-6">
                              Puoi personalizzare le tue preferenze sui cookie utilizzando le impostazioni qui sotto. 
                              Tieni presente che i cookie necessari non possono essere disattivati poiché sono essenziali per il funzionamento del sito.
                            </p>
                            
                            <div className="space-y-4 p-6 bg-neutral-50 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold">Cookie necessari</h4>
                                  <p className="text-xs text-neutral-medium">Sempre attivi e non possono essere disattivati</p>
                                </div>
                                <Button variant="outline" disabled>Sempre attivi</Button>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold">Cookie funzionali</h4>
                                  <p className="text-xs text-neutral-medium">Migliorano la funzionalità e personalizzazione</p>
                                </div>
                                <Button onClick={() => alert("Hai accettato i cookie funzionali. Le tue preferenze sono state salvate.")}>Accetta</Button>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold">Cookie analitici</h4>
                                  <p className="text-xs text-neutral-medium">Ci aiutano a migliorare il nostro servizio</p>
                                </div>
                                <Button onClick={() => alert("Hai accettato i cookie analitici. Le tue preferenze sono state salvate.")}>Accetta</Button>
                              </div>
                              
                              <div className="pt-4 flex justify-between border-t border-neutral-200 mt-4">
                                <Button 
                                  variant="outline"
                                  onClick={() => alert("Hai rifiutato tutti i cookie opzionali.")}
                                >
                                  Rifiuta tutti
                                </Button>
                                <Button
                                  onClick={() => alert("Hai accettato tutti i cookie. Grazie per aiutarci a migliorare il servizio.")}
                                >
                                  Accetta tutti
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Do Not Track</h2>
                        <p className="text-neutral-medium">
                          Alcuni browser includono la funzionalità "Do Not Track" (DNT) che segnala ai siti web che non desideri 
                          essere tracciato. Poiché non esiste ancora uno standard comune per l'implementazione del segnale DNT, 
                          il nostro sito web attualmente non risponde ai segnali DNT del browser. Tuttavia, continuiamo a 
                          monitorare gli sviluppi in questa area e adatteremo le nostre pratiche di conseguenza.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="text-center mb-10">
            <p className="text-neutral-medium mb-4">
              Hai domande sulla nostra Cookie Policy o su come gestiamo i tuoi dati?
            </p>
            <Button
              onClick={() => window.location.href = "/contact"}
            >
              Contatta il nostro team privacy
            </Button>
          </div>

          <div className="flex justify-center space-x-8 text-neutral-medium text-sm">
            <a href="/privacy-policy" className="hover:text-primary">Privacy Policy</a>
            <a href="/terms-of-service" className="hover:text-primary">Termini di Servizio</a>
            <a href="/faq" className="hover:text-primary">Centro Sicurezza</a>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
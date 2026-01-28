import React from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FileText, LifeBuoy, ScaleIcon, ArrowRight } from "lucide-react";

export default function TermsOfServicePage() {
  const lastUpdated = "10 Gennaio 2023";

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-block p-2 bg-primary/10 rounded-full mb-4">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-primary mb-4">Termini di Servizio</h1>
            <p className="text-neutral-medium max-w-2xl mx-auto">
              Questi termini costituiscono un accordo legale tra te ed EcoMaker riguardo l'utilizzo dei nostri servizi.
            </p>
            <p className="text-sm text-neutral-medium mt-4">
              Ultimo aggiornamento: {lastUpdated}
            </p>
          </div>

          <Card className="mb-12">
            <CardContent className="p-6 lg:p-8">
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold mb-4">1. Introduzione</h2>
                  <p className="text-neutral-medium mb-3">
                    Benvenuto in EcoMaker! Questi Termini di Servizio ("Termini") regolano l'accesso e l'utilizzo dell'applicazione 
                    mobile EcoMaker, del sito web e di tutti i servizi correlati (collettivamente, il "Servizio") offerti da 
                    EcoMaker S.r.l. ("noi", "nostro" o "EcoMaker").
                  </p>
                  <p className="text-neutral-medium">
                    Utilizzando il nostro Servizio, accetti di essere vincolato da questi Termini. Se non accetti questi Termini, 
                    ti preghiamo di non utilizzare il nostro Servizio. Ti consigliamo di leggere attentamente anche la nostra 
                    Privacy Policy, che descrive come raccogliamo e utilizziamo i tuoi dati personali.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">2. Requisiti di utilizzo</h2>
                  <div className="mb-3">
                    <h3 className="font-semibold mb-2">2.1 Età minima</h3>
                    <p className="text-neutral-medium">
                      Per utilizzare il Servizio, devi avere almeno 16 anni o, se inferiore, l'età minima richiesta dalla legislazione del tuo 
                      paese per utilizzare servizi digitali. Se hai meno di 18 anni, dovresti utilizzare il Servizio solo con il 
                      coinvolgimento di un genitore o tutore.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">2.2 Account utente</h3>
                    <p className="text-neutral-medium mb-3">
                      Per utilizzare alcune funzionalità del Servizio, potrebbe essere necessario creare un account. Sei responsabile 
                      di mantenere la riservatezza delle credenziali del tuo account e di tutte le attività che si verificano sotto il tuo account.
                    </p>
                    <p className="text-neutral-medium">
                      Ti impegni a fornire informazioni accurate, correnti e complete durante il processo di registrazione e a 
                      mantenere aggiornate tali informazioni. EcoMaker si riserva il diritto di sospendere o terminare il tuo account 
                      se vengono fornite informazioni false, imprecise, non attuali o incomplete.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">3. Utilizzo del Servizio</h2>
                  <div className="mb-3">
                    <h3 className="font-semibold mb-2">3.1 Licenza limitata</h3>
                    <p className="text-neutral-medium">
                      EcoMaker ti concede una licenza limitata, non esclusiva, non trasferibile e revocabile per accedere e utilizzare 
                      il Servizio per scopi personali e non commerciali, in conformità con questi Termini.
                    </p>
                  </div>
                  
                  <div className="mb-3">
                    <h3 className="font-semibold mb-2">3.2 Restrizioni d'uso</h3>
                    <p className="text-neutral-medium mb-3">
                      Nell'utilizzare il Servizio, accetti di non:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-neutral-medium">
                      <li>Violare leggi, regolamenti o diritti di terzi</li>
                      <li>Utilizzare il Servizio per scopi illegali o non autorizzati</li>
                      <li>Tentare di accedere a account o dati di altri utenti</li>
                      <li>Interferire con o interrompere l'integrità o le prestazioni del Servizio</li>
                      <li>Tentare di decodificare, decompilare o sottoporre a reverse engineering qualsiasi software del Servizio</li>
                      <li>Raccogliere o raccogliere dati dagli utenti senza il loro consenso</li>
                      <li>Utilizzare il Servizio per inviare materiale offensivo, dannoso o ingannevole</li>
                      <li>Utilizzare il Servizio in modo da sovraccaricare la nostra infrastruttura</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">3.3 Feedback e suggerimenti</h3>
                    <p className="text-neutral-medium">
                      Se fornisci feedback, idee o suggerimenti relativi al nostro Servizio ("Feedback"), riconosci che tali Feedback 
                      non sono confidenziali e ci autorizzi a utilizzare tali Feedback senza alcuna limitazione o compenso. 
                      Tutti i Feedback diventeranno nostra proprietà esclusiva.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">4. Contenuti utente</h2>
                  <div className="mb-3">
                    <h3 className="font-semibold mb-2">4.1 Proprietà dei contenuti</h3>
                    <p className="text-neutral-medium">
                      Il Servizio può consentirti di pubblicare, collegare, archiviare, condividere e rendere disponibili in altro 
                      modo informazioni, testo, grafica, video o altri materiali ("Contenuti utente"). Tu mantieni tutti i diritti 
                      di proprietà intellettuale sui Contenuti utente che pubblichi sul Servizio.
                    </p>
                  </div>
                  
                  <div className="mb-3">
                    <h3 className="font-semibold mb-2">4.2 Licenza per i contenuti</h3>
                    <p className="text-neutral-medium">
                      Pubblicando Contenuti utente sul Servizio, concedi a EcoMaker una licenza mondiale, non esclusiva, royalty-free, 
                      trasferibile, e sublicenziabile per utilizzare, copiare, modificare, distribuire, preparare opere derivate, 
                      visualizzare pubblicamente e eseguire pubblicamente i tuoi Contenuti utente in connessione con l'operazione o 
                      l'uso del Servizio e della promozione di EcoMaker.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">4.3 Responsabilità dei contenuti</h3>
                    <p className="text-neutral-medium mb-3">
                      Sei l'unico responsabile dei Contenuti utente che pubblichi sul Servizio. Con la pubblicazione di Contenuti utente, dichiari e garantisci che:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-neutral-medium">
                      <li>Sei il creatore e proprietario dei Contenuti utente o hai i diritti necessari per concedere la licenza di cui sopra</li>
                      <li>I tuoi Contenuti utente non violano la privacy, i diritti di pubblicità, i diritti d'autore, i diritti contrattuali o altri diritti di terze parti</li>
                      <li>I tuoi Contenuti utente non contengono materiale che è falso, ingannevole, diffamatorio, osceno, pornografico, molesto, minaccioso o in altro modo illegale</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">5. Proprietà intellettuale</h2>
                  <p className="text-neutral-medium mb-3">
                    Il Servizio e tutti i suoi contenuti originali, funzionalità e funzionalità (inclusi ma non limitati a testi, 
                    grafica, logo, design, fotografie, icone, immagini, clip audio, download digitali, compilazioni di dati, e software) 
                    sono di proprietà di EcoMaker o dei suoi licenzianti e sono protetti da leggi italiane e internazionali su copyright, 
                    marchi, brevetti, segreti commerciali e altri diritti di proprietà intellettuale o diritti di proprietà.
                  </p>
                  <p className="text-neutral-medium">
                    Tutti i marchi, marchi di servizio e nomi commerciali utilizzati da noi nel Servizio sono marchi di nostra proprietà 
                    o di altri rispettivi proprietari che ci hanno concesso il diritto e la licenza di utilizzarli.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">6. Disclaimer e limitazioni di responsabilità</h2>
                  <div className="mb-3">
                    <h3 className="font-semibold mb-2">6.1 "COSÌ COM'È" e "COME DISPONIBILE"</h3>
                    <p className="text-neutral-medium">
                      Il Servizio è fornito "COSÌ COM'È" e "COME DISPONIBILE", senza garanzie di alcun tipo, espresse o implicite. 
                      EcoMaker non garantisce che il Servizio soddisferà le tue esigenze, o che sarà disponibile in modo ininterrotto, 
                      tempestivo, sicuro o privo di errori.
                    </p>
                  </div>
                  
                  <div className="mb-3">
                    <h3 className="font-semibold mb-2">6.2 Limitazione di responsabilità</h3>
                    <p className="text-neutral-medium">
                      Nella misura massima consentita dalla legge applicabile, in nessun caso EcoMaker sarà responsabile per danni 
                      indiretti, punitivi, incidentali, speciali, consequenziali o esemplari, inclusi, senza limitazione, danni per 
                      perdita di profitti, avviamento, uso, dati o altre perdite intangibili, derivanti da o relative all'uso o all'impossibilità 
                      di utilizzare il Servizio.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">6.3 Progetti di upcycling e consigli</h3>
                    <p className="text-neutral-medium">
                      EcoMaker non garantisce l'accuratezza, completezza o utilità dei progetti di upcycling, consigli o altre 
                      informazioni fornite attraverso il Servizio. L'utilizzo di qualsiasi progetto, consiglio o informazione 
                      ottenuta dal Servizio è a tuo rischio e pericolo. Dovresti sempre verificare l'idoneità dei materiali e seguire 
                      le precauzioni di sicurezza appropriate quando realizzi progetti.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">7. Indennizzo</h2>
                  <p className="text-neutral-medium">
                    Accetti di difendere, indennizzare e tenere indenne EcoMaker e i suoi affiliati, funzionari, agenti, partner e 
                    dipendenti da qualsiasi rivendicazione, responsabilità, danno, perdita e spesa, comprese le spese legali ragionevoli, 
                    derivanti da o in qualche modo collegate al tuo accesso o utilizzo del Servizio, ai tuoi Contenuti utente, o alla tua 
                    violazione di questi Termini.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">8. Modifiche al Servizio e ai Termini</h2>
                  <p className="text-neutral-medium mb-3">
                    EcoMaker si riserva il diritto di modificare o interrompere, temporaneamente o permanentemente, il Servizio 
                    o qualsiasi parte di esso con o senza preavviso. Non saremo responsabili per qualsiasi modifica, sospensione o interruzione del Servizio.
                  </p>
                  <p className="text-neutral-medium">
                    Ci riserviamo il diritto di rivedere questi Termini in qualsiasi momento. Se apportiamo modifiche sostanziali 
                    a questi Termini, ti informeremo attraverso un avviso sul nostro Servizio o via email. Il tuo uso continuato del 
                    Servizio dopo tali modifiche costituisce accettazione dei nuovi Termini.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">9. Legge applicabile e risoluzione delle controversie</h2>
                  <p className="text-neutral-medium mb-3">
                    Questi Termini saranno disciplinati e interpretati in conformità con le leggi italiane, senza riguardo 
                    alle disposizioni sul conflitto di leggi.
                  </p>
                  <p className="text-neutral-medium mb-3">
                    Qualsiasi controversia derivante da o relativa a questi Termini o al Servizio sarà risolta prima attraverso 
                    un tentativo in buona fede di negoziati tra le parti. Se la controversia non può essere risolta in questo modo, 
                    sarà sottoposta alla giurisdizione esclusiva dei tribunali di Milano, Italia.
                  </p>
                  <p className="text-neutral-medium">
                    Se sei un consumatore residente nell'Unione Europea, potresti avere diritto a risolvere le controversie 
                    attraverso la piattaforma di risoluzione delle controversie online gestita dalla Commissione Europea, 
                    accessibile all'indirizzo ec.europa.eu/consumers/odr.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">10. Disposizioni generali</h2>
                  <div className="mb-3">
                    <h3 className="font-semibold mb-2">10.1 Intero accordo</h3>
                    <p className="text-neutral-medium">
                      Questi Termini costituiscono l'intero accordo tra te ed EcoMaker riguardo l'utilizzo del Servizio e 
                      sostituiscono qualsiasi precedente accordo tra te e noi.
                    </p>
                  </div>
                  
                  <div className="mb-3">
                    <h3 className="font-semibold mb-2">10.2 Rinuncia e separabilità</h3>
                    <p className="text-neutral-medium">
                      La mancata applicazione di qualsiasi diritto o disposizione di questi Termini da parte nostra non sarà 
                      considerata una rinuncia a tale diritto o disposizione. Se una qualsiasi disposizione di questi Termini 
                      è ritenuta invalida, illegale o inapplicabile, le restanti disposizioni rimarranno in pieno vigore ed effetto.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">10.3 Assegnazione</h3>
                    <p className="text-neutral-medium">
                      Non puoi assegnare o trasferire questi Termini, o qualsiasi diritto o obbligo da essi derivante, senza 
                      il nostro previo consenso scritto. EcoMaker può liberamente assegnare questi Termini senza restrizioni.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">11. Contattaci</h2>
                  <p className="text-neutral-medium mb-3">
                    Se hai domande su questi Termini di Servizio, ti preghiamo di contattarci:
                  </p>
                  <div className="bg-neutral-50 p-4 rounded-lg">
                    <p className="font-medium mb-1">EcoMaker s.r.l.</p>
                    <p className="text-neutral-medium mb-1">Via Sostenibilità 123, Milano, Italia</p>
                    <p className="text-neutral-medium mb-1">Email: legal@ecomaker.it</p>
                    <p className="text-neutral-medium">Telefono: +39 123 456 7890</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col md:flex-row items-center justify-between bg-neutral-50 p-6 rounded-lg mb-10">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <ScaleIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Accettazione dei termini</h3>
                <p className="text-sm text-neutral-medium">
                  Utilizzando il nostro servizio, accetti questi Termini di Servizio
                </p>
              </div>
            </div>
            <Button
              onClick={() => window.location.href = "/"}
            >
              Torna al servizio
            </Button>
          </div>

          <div className="text-center mb-10">
            <p className="text-neutral-medium mb-4">
              Hai domande sui nostri Termini di Servizio?
            </p>
            <Button 
              className="flex items-center"
              onClick={() => window.location.href = "/contact"}
            >
              <LifeBuoy className="mr-2 h-4 w-4" />
              Contatta il nostro team legale
            </Button>
          </div>

          <div className="flex justify-center space-x-8 text-neutral-medium text-sm">
            <a href="/privacy-policy" className="hover:text-primary">Privacy Policy</a>
            <a href="/cookie-policy" className="hover:text-primary">Cookie Policy</a>
            <a href="#" onClick={(e) => {
              e.preventDefault();
              alert("Il Centro Sicurezza è in fase di sviluppo. Sarà disponibile a breve.");
            }} className="hover:text-primary">Centro Sicurezza</a>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
import React from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Leaf, Recycle, Truck, Users, Settings } from "lucide-react";

export default function FAQPage() {
  const categories = [
    { id: "general", name: "Generali", icon: <Leaf /> },
    { id: "recycling", name: "Riciclo", icon: <Recycle /> },
    { id: "projects", name: "Progetti", icon: <Settings /> },
    { id: "community", name: "Comunità", icon: <Users /> },
    { id: "delivery", name: "Materiali", icon: <Truck /> },
  ];

  const faqs = {
    general: [
      {
        question: "Cos'è EcoMaker?",
        answer: "EcoMaker è una piattaforma che aiuta le persone a trasformare materiali di scarto in progetti utili e creativi. Utilizzando l'intelligenza artificiale, suggeriamo idee personalizzate in base ai materiali che hai a disposizione, offriamo istruzioni dettagliate e ti mettiamo in contatto con una comunità di appassionati di upcycling."
      },
      {
        question: "È gratuito l'utilizzo dell'app?",
        answer: "Sì, le funzionalità di base di EcoMaker sono completamente gratuite. Questo include la generazione di idee di progetto, l'accesso alle guide di base e la partecipazione alla community. Offriamo anche un piano premium con funzionalità avanzate come guide dettagliate step-by-step, eventi esclusivi e accesso prioritario ai materiali donati dalle aziende."
      },
      {
        question: "Come funziona l'app?",
        answer: "L'app utilizza l'intelligenza artificiale per analizzare i materiali che hai a disposizione e suggerire progetti creativi. Puoi inserire i materiali manualmente o scattare foto. Una volta scelto un progetto, riceverai istruzioni dettagliate, elenco degli strumenti necessari e persino visualizzazioni in realtà aumentata di come apparirà il risultato finale."
      },
      {
        question: "Posso utilizzare EcoMaker su dispositivi mobili?",
        answer: "Assolutamente! EcoMaker è completamente responsive e funziona su tutti i dispositivi, inclusi smartphone e tablet. Per accedere a tutte le funzionalità, inclusa la scansione dei materiali e la realtà aumentata, consigliamo di utilizzare un dispositivo con fotocamera."
      }
    ],
    recycling: [
      {
        question: "Quali materiali posso riciclare con EcoMaker?",
        answer: "EcoMaker supporta il riutilizzo di un'ampia gamma di materiali, tra cui plastica (bottiglie, contenitori), vetro, carta e cartone, tessuti, legno, metallo (lattine, barattoli) e elettronica di base. Il nostro sistema di AI può identificare e suggerire progetti per quasi tutti i materiali comuni che altrimenti finirebbero nella spazzatura."
      },
      {
        question: "Come posso sapere se un materiale è adatto al riciclo creativo?",
        answer: "La nostra funzionalità di scansione dei materiali può aiutarti a identificare se un elemento è adatto per progetti di upcycling. In generale, cerchiamo materiali puliti, non danneggiati e privi di sostanze chimiche nocive. La sezione 'Guide al Riciclo' fornisce anche informazioni dettagliate sui vari tipi di materiali e il loro potenziale di riutilizzo."
      },
      {
        question: "Devo pulire i materiali prima di utilizzarli?",
        answer: "Sì, è importante pulire accuratamente tutti i materiali prima di utilizzarli nei tuoi progetti. Rimuovi etichette, colla e residui quando possibile. Per contenitori che hanno ospitato alimenti o prodotti chimici, è particolarmente importante lavarli bene. Le nostre guide offrono consigli specifici sulla preparazione dei diversi tipi di materiali."
      },
      {
        question: "Posso riciclare materiali elettronici?",
        answer: "Sebbene alcuni componenti elettronici di base possano essere riutilizzati in progetti creativi, molti dispositivi elettronici contengono materiali pericolosi che richiedono tecniche di riciclaggio specializzate. Ti consigliamo di consultare le nostre guide specifiche per l'elettronica o di utilizzare servizi di riciclaggio dedicati per dispositivi complessi."
      }
    ],
    projects: [
      {
        question: "Quanto sono difficili i progetti proposti?",
        answer: "Offriamo progetti di tutti i livelli di difficoltà, da principiante ad avanzato. Ogni progetto è chiaramente etichettato con un livello di difficoltà e il tempo stimato per il completamento. Puoi filtrare i suggerimenti in base alla tua esperienza e alle tue capacità. Anche i progetti più complessi sono suddivisi in passaggi semplici e comprensibili."
      },
      {
        question: "Ho bisogno di strumenti speciali per completare i progetti?",
        answer: "La maggior parte dei nostri progetti può essere realizzata con strumenti domestici di base come forbici, coltelli, colle e nastro adesivo. Quando un progetto richiede strumenti più specializzati, lo indichiamo chiaramente e spesso suggeriamo alternative più accessibili. Offriamo anche collegamenti per l'acquisto di eventuali strumenti o materiali aggiuntivi necessari."
      },
      {
        question: "Posso modificare i progetti suggeriti dall'app?",
        answer: "Assolutamente! Incoraggiamo la creatività e la personalizzazione. I progetti suggeriti sono linee guida che puoi adattare in base alle tue preferenze, materiali disponibili e competenze. Nella sezione community puoi anche condividere le tue versioni modificate dei progetti per ispirare altri utenti."
      },
      {
        question: "Cosa posso fare se mi blocco durante un progetto?",
        answer: "Se incontri difficoltà durante un progetto, puoi utilizzare la nostra funzione di chat assistita da AI per ricevere suggerimenti specifici. Puoi anche pubblicare domande nella community dove altri utenti o i nostri esperti possono aiutarti. Per gli utenti premium, offriamo anche sessioni di assistenza video one-to-one per progetti particolarmente complessi."
      }
    ],
    community: [
      {
        question: "Come posso condividere i miei progetti con la community?",
        answer: "Puoi condividere i tuoi progetti completati nella sezione 'Community' dell'app. Carica foto, aggiungi descrizioni, elenca i materiali utilizzati e fornisci istruzioni personalizzate. Puoi anche taggare i progetti con parole chiave rilevanti per aiutare altri utenti a trovarli quando cercano ispirazione."
      },
      {
        question: "Ci sono eventi comunitari a cui posso partecipare?",
        answer: "Sì, organizziamo regolarmente eventi sia online che in presenza (in alcune località). Questi includono workshop di upcycling, eventi di pulizia ambientale, sfide creative e sessioni di scambio materiali. Controlla la sezione 'Eventi' per vedere cosa è programmato nella tua zona o online."
      },
      {
        question: "Posso collaborare con altri utenti su progetti?",
        answer: "Assolutamente! Incoraggiamo la collaborazione attraverso la nostra funzionalità 'Progetti di Gruppo'. Puoi invitare altri utenti a unirsi al tuo progetto, suddividere le attività e comunicare attraverso la chat di progetto. Questa è una grande opportunità per progetti più ambiziosi o iniziative comunitarie."
      },
      {
        question: "Come posso contribuire alla community oltre ai miei progetti?",
        answer: "Ci sono molti modi per contribuire! Puoi scrivere guide e tutorial, rispondere alle domande di altri utenti, partecipare o organizzare eventi locali, donare materiali in eccesso, o persino diventare un mentore per i nuovi membri. La tua esperienza e conoscenza sono preziose per la community."
      }
    ],
    delivery: [
      {
        question: "Come posso trovare materiali per i miei progetti?",
        answer: "Oltre ai materiali che già possiedi, puoi esplorare la nostra sezione 'Scambio Materiali' dove altri utenti e aziende offrono materiali in eccesso. Organizziamo anche eventi di raccolta e partner con aziende locali per il recupero di materiali di scarto. La funzione 'Materiali Richiesti' ti consente di pubblicare richieste specifiche per materiali che stai cercando."
      },
      {
        question: "Le aziende possono contribuire con materiali?",
        answer: "Sì, abbiamo un programma dedicato per le aziende che desiderano donare materiali di scarto o inutilizzati. Le aziende possono registrarsi come partner, elencare i materiali disponibili e mettersi in contatto con gli utenti interessati. Questo aiuta le aziende a ridurre i rifiuti e supporta la nostra community di maker."
      },
      {
        question: "Posso acquistare materiali o strumenti attraverso l'app?",
        answer: "Per materiali o strumenti specifici che non riesci a trovare attraverso il nostro sistema di scambio, offriamo suggerimenti per l'acquisto tramite partner affiliati. Privilegiamo sempre opzioni sostenibili e locali quando possibile. Una percentuale di queste vendite affiliate viene reinvestita nelle iniziative comunitarie di EcoMaker."
      },
      {
        question: "È possibile ricevere donazioni di materiali se ne ho bisogno per un progetto?",
        answer: "Abbiamo un sistema di richieste per materiali specifici nella sezione 'Scambio Materiali'. Puoi pubblicare ciò di cui hai bisogno, e altri utenti o aziende locali possono rispondere se hanno quei materiali disponibili. Per progetti con impatto sociale o comunitario, abbiamo anche un fondo speciale per supportare l'acquisizione di materiali necessari."
      }
    ]
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-primary mb-4">Domande Frequenti</h1>
            <p className="text-neutral-medium max-w-2xl mx-auto">
              Trova risposte alle domande più comuni sull'utilizzo di EcoMaker, 
              i progetti di riciclo creativo e la partecipazione alla nostra community.
            </p>
          </div>

          {/* Search bar */}
          <div className="mb-10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-medium" />
              <Input 
                placeholder="Cerca nelle FAQ..." 
                className="pl-10 h-12 rounded-lg border-neutral-light focus:ring-primary focus:border-primary"
              />
              <Button 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10"
                onClick={() => alert("Funzionalità di ricerca in fase di implementazione.")}
              >
                Cerca
              </Button>
            </div>
          </div>

          {/* FAQ Tabs */}
          <Tabs defaultValue="general">
            <TabsList className="w-full grid grid-cols-2 md:grid-cols-5 mb-8">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex flex-col items-center space-y-2 p-4"
                >
                  <div className="p-2 rounded-full bg-primary/10">
                    {React.cloneElement(category.icon, { className: "h-5 w-5 text-primary" })}
                  </div>
                  <span>{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {faqs[category.id].map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`${category.id}-item-${index}`}
                      className="border border-neutral-light rounded-lg overflow-hidden bg-white shadow-sm"
                    >
                      <AccordionTrigger className="px-6 py-4 text-left font-medium hover:bg-neutral-50">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="px-6 py-4 text-neutral-dark">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            ))}
          </Tabs>

          {/* Still need help */}
          <div className="mt-12 bg-gradient-to-br from-primary/10 to-accent/10 p-8 rounded-lg text-center">
            <h2 className="text-xl font-semibold text-primary mb-4">Non hai trovato quello che cercavi?</h2>
            <p className="text-neutral-dark mb-6 max-w-lg mx-auto">
              Se hai bisogno di ulteriore assistenza o hai domande specifiche non coperte nelle FAQ, 
              non esitare a contattarci direttamente.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="flex-1">Contattaci via email</Button>
              <Button variant="outline" className="flex-1">Chatta con l'assistente virtuale</Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
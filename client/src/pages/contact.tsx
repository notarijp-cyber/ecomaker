import React from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MessageCircle, Mail, MapPin, Phone, Send, Clock, CheckCircle } from "lucide-react";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Il nome deve essere lungo almeno 2 caratteri" }).max(50),
  email: z.string().email({ message: "Inserisci un indirizzo email valido" }),
  subject: z.string().min(5, { message: "L'oggetto deve essere lungo almeno 5 caratteri" }).max(100),
  message: z.string().min(10, { message: "Il messaggio deve essere lungo almeno 10 caratteri" }).max(1000),
  reason: z.string({ required_error: "Seleziona un motivo di contatto" }),
});

export default function ContactPage() {
  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const [isSubmitted, setIsSubmitted] = React.useState(false);

  function onSubmit(values: z.infer<typeof contactFormSchema>) {
    console.log(values);
    // Simulazione di invio del messaggio
    setTimeout(() => {
      setIsSubmitted(true);
    }, 1000);
  }

  const contactReasons = [
    { value: "general", label: "Informazioni generali" },
    { value: "project", label: "Supporto per un progetto" },
    { value: "bug", label: "Segnalazione di un problema" },
    { value: "partnership", label: "Proposta di collaborazione" },
    { value: "donation", label: "Donazione di materiali" },
    { value: "other", label: "Altro" },
  ];

  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5" />,
      title: "Email",
      info: "supporto@ecomaker.it",
      description: "Rispondiamo entro 24 ore lavorative"
    },
    {
      icon: <Phone className="h-5 w-5" />,
      title: "Telefono",
      info: "+39 123 456 7890",
      description: "Dal lunedì al venerdì, 9:00 - 18:00"
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Sede",
      info: "Via Sostenibilità 123, Milano",
      description: "Vieni a trovarci su appuntamento"
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Tempi di risposta",
      info: "24-48 ore",
      description: "Per richieste urgenti, usa la chat live"
    },
  ];

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-block p-2 bg-primary/10 rounded-full mb-4">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-primary mb-4">Contattaci</h1>
            <p className="text-neutral-medium max-w-2xl mx-auto">
              Hai domande, suggerimenti o feedback? Siamo qui per aiutarti a rendere i tuoi progetti di riciclo creativo un successo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {contactInfo.map((item, index) => (
              <Card key={index} className="border-neutral-light bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4">
                    {React.cloneElement(item.icon, { className: "h-6 w-6 text-primary" })}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="font-medium text-primary mb-2">{item.info}</p>
                  <p className="text-sm text-neutral-medium">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Form Card */}
          <Card className="border-neutral-light bg-white shadow-md overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-semibold mb-6">Inviaci un messaggio</h2>
                
                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="p-4 rounded-full bg-green-100 mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-green-700 mb-2">Messaggio inviato!</h3>
                    <p className="text-neutral-medium mb-6">
                      Grazie per averci contattato. Risponderemo al tuo messaggio il prima possibile.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsSubmitted(false);
                        form.reset();
                      }}
                    >
                      Invia un altro messaggio
                    </Button>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome completo</FormLabel>
                              <FormControl>
                                <Input placeholder="Il tuo nome" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="La tua email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="reason"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Motivo del contatto</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleziona un motivo" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {contactReasons.map((reason) => (
                                  <SelectItem key={reason.value} value={reason.value}>
                                    {reason.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Oggetto</FormLabel>
                            <FormControl>
                              <Input placeholder="Di cosa si tratta?" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Messaggio</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Scrivi qui il tuo messaggio..." 
                                rows={5}
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Sii il più specifico possibile per aiutarci a rispondere al meglio.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsSubmitted(true);
                        }}
                      >
                        <Send className="mr-2 h-4 w-4" /> Invia messaggio
                      </Button>
                    </form>
                  </Form>
                )}
              </div>
              
              <div className="hidden md:block bg-gradient-to-br from-primary to-accent relative">
                <div className="absolute inset-0 opacity-10">
                  <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <pattern id="recycle-pattern" patternUnits="userSpaceOnUse" width="10" height="10">
                      <circle cx="1" cy="1" r="0.5" fill="white" />
                    </pattern>
                    <rect x="0" y="0" width="100%" height="100%" fill="url(#recycle-pattern)" />
                  </svg>
                </div>
                <div className="p-8 flex flex-col h-full justify-center relative z-10">
                  <div className="text-white mb-6">
                    <h3 className="text-xl font-semibold mb-4">Seguici sui social</h3>
                    <p className="mb-6 opacity-90">
                      Resta aggiornato sui nostri ultimi progetti, eventi e suggerimenti per un lifestyle sostenibile.
                    </p>
                    <div className="flex space-x-4">
                      <a href="#" className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                        <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                        </svg>
                      </a>
                      <a href="#" className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                        <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                        </svg>
                      </a>
                      <a href="#" className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                        <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                  
                  <div className="text-white">
                    <h3 className="text-xl font-semibold mb-4">Visita il nostro spazio</h3>
                    <p className="mb-4 opacity-90">
                      Abbiamo uno spazio fisico dove organizziamo workshop, eventi e puoi portare 
                      materiali da riciclare o ritirare progetti comunitari.
                    </p>
                    <div className="bg-white/10 p-4 rounded-lg">
                      <p className="font-semibold text-white mb-1">EcoMaker Lab</p>
                      <p className="text-white/80 text-sm mb-2">Via Sostenibilità 123, Milano</p>
                      <p className="text-white/80 text-sm">
                        Orari: Lun-Ven 10:00-19:00, Sab 10:00-14:00
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-semibold text-center mb-8">Domande frequenti sui contatti</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-neutral-light shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Quanto tempo ci vuole per una risposta?</h3>
                  <p className="text-neutral-medium">
                    Ci impegniamo a rispondere a tutte le richieste entro 24-48 ore lavorative. 
                    Per richieste urgenti, consigliamo di utilizzare la chat live quando disponibile.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-neutral-light shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Posso proporre una collaborazione?</h3>
                  <p className="text-neutral-medium">
                    Assolutamente! Siamo sempre aperti a partnership con aziende, organizzazioni e creatori 
                    che condividono i nostri valori sulla sostenibilità. Seleziona "Proposta di collaborazione" 
                    nel modulo di contatto.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-neutral-light shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Come posso donare materiali?</h3>
                  <p className="text-neutral-medium">
                    Puoi contattarci attraverso il modulo specificando quali materiali vorresti donare. 
                    Organizzeremo un appuntamento per il ritiro o la consegna presso il nostro spazio.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-neutral-light shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Offrite supporto telefonico?</h3>
                  <p className="text-neutral-medium">
                    Sì, offriamo supporto telefonico per questioni che richiedono assistenza immediata. 
                    I nostri operatori sono disponibili dal lunedì al venerdì, dalle 9:00 alle 18:00.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
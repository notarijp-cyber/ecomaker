import React from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Leaf, Recycle, PlusCircle, Bird, Users, Calendar, Clock, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function SustainabilityBlogPage() {
  const categories = [
    { id: "all", name: "Tutti gli articoli" },
    { id: "upcycling", name: "Upcycling" },
    { id: "eco-living", name: "Vita sostenibile" },
    { id: "tutorials", name: "Tutorial" },
    { id: "community", name: "Comunità" },
  ];

  const blogPosts = [
    {
      id: 1,
      title: "10 modi sorprendenti per riutilizzare i barattoli di vetro",
      excerpt: "Dai barattoli di marmellata vuoti a vasi, lampade e dispensatori di sapone. Scopri come trasformare i barattoli di vetro in oggetti belli e funzionali per la tua casa.",
      imageUrl: "https://images.unsplash.com/photo-1626753841838-05f274ee1441?q=80&w=870&auto=format&fit=crop",
      category: "upcycling",
      author: "Marina Verdi",
      date: "12 Maggio 2023",
      readTime: "8 min",
      tags: ["vetro", "decorazione", "facile"]
    },
    {
      id: 2,
      title: "Guida definitiva al compostaggio domestico",
      excerpt: "Tutto ciò che devi sapere per iniziare a compostare a casa, anche se vivi in appartamento. Riduci i rifiuti organici e crea un fertilizzante naturale per le tue piante.",
      imageUrl: "https://images.unsplash.com/photo-1581529101597-4cc30e521910?q=80&w=870&auto=format&fit=crop",
      category: "eco-living",
      author: "Luca Bianchi",
      date: "3 Aprile 2023",
      readTime: "12 min",
      tags: ["compostaggio", "giardinaggio", "principianti"]
    },
    {
      id: 3,
      title: "Come creare una lampada da una bottiglia di vino",
      excerpt: "Tutorial passo-passo per trasformare una bottiglia di vino vuota in una lampada elegante per il tuo salotto. Un progetto creativo che impressionerà i tuoi ospiti.",
      imageUrl: "https://images.unsplash.com/photo-1616046913255-9c23e10e8b3e?q=80&w=1480&auto=format&fit=crop",
      category: "tutorials",
      author: "Paolo Rossi",
      date: "17 Marzo 2023",
      readTime: "15 min",
      tags: ["vetro", "illuminazione", "intermedio"]
    },
    {
      id: 4,
      title: "L'evento di pulizia delle spiagge ha raccolto 500kg di plastica",
      excerpt: "La comunità EcoMaker si è riunita lo scorso weekend per pulire la spiaggia locale. Scopri come è andata e come partecipare al prossimo evento.",
      imageUrl: "https://images.unsplash.com/photo-1618477462146-050d2767eac4?q=80&w=870&auto=format&fit=crop",
      category: "community",
      author: "Giulia Mari",
      date: "28 Febbraio 2023",
      readTime: "5 min",
      tags: ["eventi", "comunità", "plastica"]
    },
    {
      id: 5,
      title: "5 alternative ecologiche alla plastica monouso in cucina",
      excerpt: "Scopri prodotti e soluzioni per eliminare la plastica monouso dalla tua cucina. Alternative economiche e facili da adottare per ridurre l'impatto ambientale.",
      imageUrl: "https://images.unsplash.com/photo-1604187350574-51ace44288b5?q=80&w=870&auto=format&fit=crop",
      category: "eco-living",
      author: "Sofia Natura",
      date: "15 Gennaio 2023",
      readTime: "10 min",
      tags: ["plastica", "cucina", "sostenibilità"]
    },
    {
      id: 6,
      title: "Come trasformare vecchie t-shirt in borse della spesa",
      excerpt: "Un tutorial facile per riciclare magliette che non usi più in borse resistenti per la spesa. Nessuna abilità di cucito richiesta!",
      imageUrl: "https://images.unsplash.com/photo-1529374814797-de52885a0249?q=80&w=870&auto=format&fit=crop",
      category: "tutorials",
      author: "Elena Stoffa",
      date: "7 Gennaio 2023",
      readTime: "7 min",
      tags: ["tessuti", "moda", "facile"]
    }
  ];

  const featuredPost = blogPosts[0];
  const recentPosts = blogPosts.slice(1, 4);
  
  // Filtra i post per categoria
  const getPostsByCategory = (categoryId: string) => {
    if (categoryId === "all") return blogPosts;
    return blogPosts.filter(post => post.category === categoryId);
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block p-2 bg-primary/10 rounded-full mb-4">
              <Recycle className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-primary mb-4">Blog Sostenibilità</h1>
            <p className="text-neutral-medium max-w-2xl mx-auto">
              Articoli, guide e storie dalla comunità sul vivere sostenibile, upcycling creativo e riduzione dell'impatto ambientale.
            </p>
          </div>

          {/* Featured Post */}
          <Card className="mb-12 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="order-2 md:order-1 p-6 flex flex-col justify-center">
                <div className="text-xs font-medium text-primary mb-2">
                  {featuredPost.category.toUpperCase()} • {featuredPost.date}
                </div>
                <CardTitle className="text-2xl mb-4">{featuredPost.title}</CardTitle>
                <p className="text-neutral-medium mb-4">{featuredPost.excerpt}</p>
                <div className="flex items-center text-sm text-neutral-medium space-x-4 mb-6">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{featuredPost.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{featuredPost.readTime}</span>
                  </div>
                </div>
                <Button 
                  className="mt-auto self-start"
                  onClick={() => alert("Apertura dell'articolo completo. Questa funzionalità sarà implementata a breve.")}
                >
                  Leggi l'articolo <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div 
                className="order-1 md:order-2 h-64 md:h-auto bg-cover bg-center" 
                style={{ backgroundImage: `url(${featuredPost.imageUrl})` }}
              ></div>
            </div>
          </Card>

          {/* Recent Posts */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Articoli recenti</h2>
              <Button 
                variant="outline"
                onClick={() => alert("Verrai reindirizzato alla pagina con tutti gli articoli. Funzionalità in fase di implementazione.")}
              >
                Vedi tutti
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentPosts.map(post => (
                <Card key={post.id} className="flex flex-col h-full overflow-hidden">
                  <div 
                    className="h-48 bg-cover bg-center" 
                    style={{ backgroundImage: `url(${post.imageUrl})` }}
                  ></div>
                  <CardHeader className="p-4 pb-2">
                    <div className="text-xs font-medium text-primary mb-2">
                      {post.category.toUpperCase()}
                    </div>
                    <CardTitle className="text-lg">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 flex-grow">
                    <p className="text-sm text-neutral-medium">{post.excerpt}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between items-center">
                    <div className="text-xs text-neutral-medium flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {post.date}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-primary"
                      onClick={() => alert(`Apertura dell'articolo "${post.title}". Funzionalità in fase di implementazione.`)}
                    >
                      Leggi <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          {/* All Posts by Category */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Esplora per categoria</h2>
            <Tabs defaultValue="all">
              <TabsList className="mb-6 w-full grid grid-cols-2 md:grid-cols-5">
                {categories.map(category => (
                  <TabsTrigger key={category.id} value={category.id}>{category.name}</TabsTrigger>
                ))}
              </TabsList>
              
              {categories.map(category => (
                <TabsContent key={category.id} value={category.id}>
                  <div className="grid grid-cols-1 gap-8">
                    {getPostsByCategory(category.id).map(post => (
                      <Card key={post.id} className="overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-4">
                          <div 
                            className="h-48 md:h-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${post.imageUrl})` }}
                          ></div>
                          <div className="col-span-3 p-6">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex space-x-2">
                                <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                                  {post.category}
                                </span>
                                {post.tags.map(tag => (
                                  <span key={tag} className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <div className="flex items-center text-xs text-neutral-medium space-x-4">
                                <div className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  <span>{post.date}</span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>{post.readTime}</span>
                                </div>
                              </div>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                            <p className="text-neutral-medium mb-4">{post.excerpt}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-neutral-medium">{post.author}</span>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => alert(`Apertura dell'articolo "${post.title}". Funzionalità in fase di implementazione.`)}
                              >
                                Leggi l'articolo
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Newsletter signup */}
          <Card className="mt-12 bg-green-50 border-green-100">
            <CardContent className="p-8 flex flex-col md:flex-row items-center text-center md:text-left">
              <div className="p-4 bg-green-100 rounded-full mb-4 md:mb-0 md:mr-6">
                <Leaf className="h-8 w-8 text-green-600" />
              </div>
              <div className="flex-grow md:mr-6">
                <h3 className="text-xl font-semibold text-green-800 mb-2">Iscriviti alla newsletter</h3>
                <p className="text-neutral-dark mb-0">
                  Ricevi articoli, guide e ispirazioni direttamente nella tua casella di posta.
                </p>
              </div>
              <Button className="min-w-[150px] mt-4 md:mt-0">
                Iscriviti ora
              </Button>
            </CardContent>
          </Card>

          {/* Write for us */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-semibold mb-4">Hai una storia da condividere?</h2>
            <p className="text-neutral-medium max-w-xl mx-auto mb-6">
              Siamo sempre alla ricerca di nuove voci e prospettive. Condividi le tue esperienze, 
              consigli o progetti di upcycling con la nostra comunità.
            </p>
            <Button variant="outline" className="inline-flex items-center">
              <PlusCircle className="mr-2 h-4 w-4" /> Scrivi per noi
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
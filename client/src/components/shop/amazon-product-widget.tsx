import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, CheckCircle, Truck, Star, Clock, Download } from "lucide-react";

export interface AmazonProduct {
  title: string;
  description?: string;
  price: string;
  rating?: number;
  imageUrl?: string;
  affiliateUrl: string;
  category: string;
  isPrime?: boolean;
}

interface AmazonProductWidgetProps {
  products: AmazonProduct[];
  title?: string;
  description?: string;
  isLoading?: boolean;
}

export function AmazonProductWidget({ 
  products, 
  title = "Prodotti consigliati", 
  description = "Attrezzi e materiali che potrebbero servire per questo progetto", 
  isLoading = false
}: AmazonProductWidgetProps) {
  if (isLoading) {
    return (
      <Card className="eco-card recycle-icon-bg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          <p className="text-sm text-neutral-medium">{description}</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-52 w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!products || products.length === 0) {
    return null;
  }
  
  const renderRatingStars = (rating: number = 0) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-3 w-3 ${i < fullStars ? "text-yellow-500 fill-yellow-500" : (i === fullStars && hasHalfStar ? "text-yellow-500" : "text-gray-300")}`} />
        ))}
        <span className="ml-1 text-xs text-neutral-medium">({rating.toFixed(1)})</span>
      </div>
    );
  };
  
  // Funzione per scaricare la lista prodotti come file di testo
  const downloadProductsList = async () => {
    if (!products || products.length === 0) return;
    
    try {
      // Estrai i termini di ricerca dai prodotti (categorie)
      const categoriesSet = new Set<string>();
      products.forEach(p => categoriesSet.add(p.category.toLowerCase()));
      const searchTerms = Array.from(categoriesSet);
      
      // Effettua una richiesta POST e gestisci la risposta
      const response = await fetch('/api/amazon-products/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchTerms }),
      });
      
      // Verifica che la risposta sia OK
      if (!response.ok) {
        throw new Error('Errore durante il download dei prodotti');
      }
      
      // Ottieni il testo della risposta
      const textContent = await response.text();
      
      // Crea un blob con il testo
      const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
      
      // Crea un URL per il blob
      const url = URL.createObjectURL(blob);
      
      // Crea un link per il download
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.setAttribute('download', 'prodotti-amazon.txt');
      document.body.appendChild(downloadLink);
      
      // Simula il click per avviare il download
      downloadLink.click();
      
      // Rimuovi il link dalla pagina e rilascia l'URL
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Errore durante il download dei prodotti:", error);
    }
  };
  
  return (
    <Card className="eco-card recycle-icon-bg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          {products && products.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 text-xs" 
              onClick={downloadProductsList}
            >
              <Download className="h-3 w-3" />
              Scarica lista
            </Button>
          )}
        </div>
        <p className="text-sm text-neutral-medium">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product, index) => (
            <a 
              key={index} 
              href={product.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Card className="overflow-hidden border border-neutral-100 hover:border-primary transition-all duration-200 hover:shadow-md h-full group">
                <div className="flex h-full flex-col">
                  {product.isPrime && (
                    <div className="absolute top-2 right-2 z-10">
                      <div className="bg-[#00a8e1] text-white text-xs px-2 py-0.5 rounded flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 16" width="50" height="16" fill="white" className="h-4">
                          <path d="M10.97 0c1.76.02 2.81.38 4.25 1.75l-1.86 1.88c-.72-.69-1.22-1.2-2.44-1.19-1.58 0-2.86 1.29-2.86 2.88s1.28 2.9 2.86 2.9c1.2-.01 1.82-.45 2.58-1.23l1.86 1.88c-1.35 1.41-2.5 1.84-4.44 1.84-2.8 0-5.24-2.1-5.24-5.31s2.44-5.37 5.3-5.4zM28.28 5v8.61h-2.48V5h2.48zM22.6 5c2.39 0 3.85 1.15 3.85 3.17 0 2.01-1.55 3.05-3.85 3.05h-1.96v2.39h-2.48V5h4.44zm-.09 4.07c.95 0 1.49-.32 1.49-1.09 0-.77-.53-1.09-1.49-1.09h-1.87v2.18h1.87zM38.76 5v1.85h-4.97v1.46h4.74v1.85h-4.74v1.6h4.97v1.85h-7.45V5h7.45zM45.55 10.57v3.04h-2.32V5h4.37c2.06 0 3.25 1.15 3.25 2.78s-1.17 2.76-3.25 2.76l-2.05.03zm1.65-3.67h-1.65v1.97h1.65c.85 0 1.25-.25 1.25-.96 0-.76-.39-1.01-1.25-1.01zM28.09 1.77c0 .8-.63 1.45-1.42 1.45-.78 0-1.4-.65-1.4-1.45 0-.79.62-1.44 1.4-1.44.79 0 1.42.65 1.42 1.44zM1.45 9.07c0-.31.1-.72.24-1.3L3.3 1.94h2.53l-2.37 8.7c-.42 1.6-1.58 2.67-3.09 2.97l-.46-1.78c.74-.19 1.23-.71 1.49-1.41a1.67 1.67 0 0 1 .05-.34zM19.39.76c-1.21 0-2.24.42-3.04 1.24-.44-.83-1.08-1.24-1.97-1.24-.89 0-1.65.41-2.23 1.24-.01-.13-.03-.24-.04-.34h-2.16c.04.91.01 1.86-.02 2.84-.08 2.41-.17 5.03.2 6.48H12c.15-.65.26-1.3.39-1.86.1-.44.18-.91.26-1.38.16-.92.55-1.7 1.23-1.7.57 0 .87.38 1.01 1.73.01.19.01.38.01.57 0 .58-.01 1.19-.06 1.78-.04.47-.07.95-.11 1.42-.02.22-.04.43-.04.44h1.98c0-.2.02-.48.06-.77.06-.46.14-.94.22-1.42.11-.66.22-1.34.3-2.01.09-.8.49-1.74 1.13-1.74.76 0 .83 1.12.86 1.92.01.28.02.56.02.84-.01.54-.03 1.09-.06 1.62-.02.4-.05.79-.08 1.12-.01.15-.02.28-.03.44h1.97c.04-1.65.04-3.31.04-4.95 0-1.64-.59-2.4-1.72-2.41z"/>
                        </svg>
                      </div>
                    </div>
                  )}
                  <div className="relative h-36 overflow-hidden bg-white p-4 flex items-center justify-center">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.title} 
                        className="h-full object-contain group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                        }}
                      />
                    ) : (
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-neutral-100">
                        <ShoppingCart className="h-12 w-12 text-neutral-400" />
                      </div>
                    )}
                    <div className="fallback-icon hidden flex h-24 w-24 items-center justify-center rounded-full bg-neutral-100">
                      <ShoppingCart className="h-12 w-12 text-neutral-400" />
                    </div>
                  </div>
                  <CardContent className="flex-grow p-4">
                    <h3 className="mb-2 line-clamp-2 font-medium text-neutral-800 group-hover:text-primary transition-colors">
                      {product.title}
                    </h3>
                    {product.rating && (
                      <div className="mb-2">
                        {renderRatingStars(product.rating)}
                      </div>
                    )}
                    <div className="text-xl font-bold text-primary mb-3">
                      {product.price}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {product.category && (
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-xs font-normal">
                          {product.category}
                        </Badge>
                      )}
                    </div>
                    {product.isPrime ? (
                      <div className="flex items-center text-xs text-green-700 mt-2 font-medium">
                        <Truck className="h-3 w-3 mr-1" />
                        <span>Consegna Prime in 1-2 giorni</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-xs text-neutral-500 mt-2">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Spedizione standard</span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <button
                      className="flex w-full items-center justify-center rounded-md bg-primary py-2 px-4 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Acquista su Amazon
                    </button>
                  </CardFooter>
                </div>
              </Card>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
// Questo file gestisce le richieste per i prodotti Amazon attraverso l'API Amazon Product Advertising

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

// Mock data for eco-friendly and crafting products
// In a real implementation, this would use the Amazon Product Advertising API
const mockProductDatabase: Record<string, AmazonProduct[]> = {
  "bottiglie plastica": [
    {
      title: "Taglierino Circolare per Bottiglie di Plastica, Strumento di Taglio Fai-da-te per Bottiglie di Plastica",
      price: "€12.99",
      rating: 4.5,
      imageUrl: "https://m.media-amazon.com/images/I/61QJ0lNQJCL._AC_SL1500_.jpg",
      affiliateUrl: "https://www.amazon.it/dp/B08MPXSVLP",
      category: "Strumenti",
      isPrime: true
    }
  ],
  "legno riciclato": [
    {
      title: "Kit di Utensili per Intaglio del Legno, 12 Pezzi Scalpelli Professionali per Legno",
      price: "€29.99",
      rating: 4.3,
      imageUrl: "https://m.media-amazon.com/images/I/71Z7z4-eYbL._AC_SL1500_.jpg",
      affiliateUrl: "https://www.amazon.it/dp/B08H8BH5TK",
      category: "Strumenti",
      isPrime: true
    }
  ],
  "tessuti": [
    {
      title: "ARTEZA Stoffe e Tessuti, Set da 10 Pezzi da 50x50 cm",
      price: "€14.99",
      rating: 4.7,
      imageUrl: "https://m.media-amazon.com/images/I/91NznQvq3ZL._AC_SL1500_.jpg",
      affiliateUrl: "https://www.amazon.it/dp/B07S6BVYVB",
      category: "Materiali",
      isPrime: true
    }
  ],
  "vetro": [
    {
      title: "Dremel 7103 Fresa diamantata conica 3,2 mm",
      description: "Perfetto per incisioni e lavorazioni su vetro",
      price: "€8.49",
      rating: 4.6,
      imageUrl: "https://m.media-amazon.com/images/I/51F8oGDXnxL._AC_SL1500_.jpg",
      affiliateUrl: "https://www.amazon.it/dp/B00004UDI1",
      category: "Strumenti",
      isPrime: true
    }
  ],
  "metallo": [
    {
      title: "STANLEY STHT0-77340 Set Lime assortite per metallo",
      price: "€16.90",
      rating: 4.5,
      imageUrl: "https://m.media-amazon.com/images/I/718TdJQI9ZL._AC_SL1500_.jpg",
      affiliateUrl: "https://www.amazon.it/dp/B001DSZUC4",
      category: "Strumenti",
      isPrime: true
    }
  ],
  "carta": [
    {
      title: "TRITART Set Carta Kraft A4 - 130 Fogli Kraft Naturale",
      description: "Carta riciclata ideale per progetti di artigianato", 
      price: "€10.95",
      rating: 4.8,
      imageUrl: "https://m.media-amazon.com/images/I/81tGcYJGRLL._AC_SL1500_.jpg",
      affiliateUrl: "https://www.amazon.it/dp/B07QLLFW74",
      category: "Materiali",
      isPrime: true
    }
  ],
  "colla": [
    {
      title: "Gorilla Colla Adesiva Trasparente 50ml",
      price: "€9.18",
      rating: 4.6,
      imageUrl: "https://m.media-amazon.com/images/I/71M6LtQvTzL._AC_SL1500_.jpg",
      affiliateUrl: "https://www.amazon.it/dp/B07K7XD9ZK",
      category: "Strumenti",
      isPrime: true
    }
  ],
  "vernici": [
    {
      title: "Marabu 1203 05 - Set 6 Colori Vernici Acriliche per Pittura",
      price: "€14.49",
      rating: 4.7,
      imageUrl: "https://m.media-amazon.com/images/I/816ERLm3DiL._AC_SL1500_.jpg",
      affiliateUrl: "https://www.amazon.it/dp/B000WL7SMA",
      category: "Materiali",
      isPrime: true
    }
  ],
  "forbici": [
    {
      title: "Scotch Forbici Titanium, Lame in Titanio",
      price: "€5.99",
      rating: 4.8,
      imageUrl: "https://m.media-amazon.com/images/I/61r0TqXcixL._AC_SL1500_.jpg",
      affiliateUrl: "https://www.amazon.it/dp/B000WLBAZE",
      category: "Strumenti",
      isPrime: true
    }
  ],
  "pistola colla": [
    {
      title: "Bosch Gluey Pistola Incollatrice",
      price: "€24.99",
      rating: 4.5,
      imageUrl: "https://m.media-amazon.com/images/I/617AHrWOmYL._AC_SL1500_.jpg",
      affiliateUrl: "https://www.amazon.it/dp/B07BN2T7RR",
      category: "Strumenti",
      isPrime: true
    }
  ]
};

// Function to find related products for a list of search terms
export async function findRelatedProducts(searchTerms: string[]): Promise<AmazonProduct[]> {
  if (!searchTerms || searchTerms.length === 0) {
    return [];
  }

  const results: AmazonProduct[] = [];
  const addedProductTitles = new Set<string>();

  // Search for each term in our mock database
  for (const term of searchTerms) {
    const lowerTerm = term.toLowerCase();
    
    // Look for exact matches first
    if (mockProductDatabase[lowerTerm]) {
      mockProductDatabase[lowerTerm].forEach(product => {
        if (!addedProductTitles.has(product.title)) {
          results.push(product);
          addedProductTitles.add(product.title);
        }
      });
      continue;
    }
    
    // If no exact match, try partial matches
    for (const [key, products] of Object.entries(mockProductDatabase)) {
      if (key.includes(lowerTerm) || lowerTerm.includes(key)) {
        products.forEach(product => {
          if (!addedProductTitles.has(product.title)) {
            results.push(product);
            addedProductTitles.add(product.title);
          }
        });
      }
    }
  }

  // Limit to max 6 products
  return results.slice(0, 6);
}

// In a real implementation, this would use the Amazon Product Advertising API
// with proper authentication and request handling
export async function searchAmazonProducts(searchTerms: string[]): Promise<AmazonProduct[]> {
  try {
    // Here we'd make the actual API call to Amazon
    // For now, returning mock data
    return findRelatedProducts(searchTerms);
  } catch (error) {
    console.error("Error searching Amazon products:", error);
    throw error;
  }
}
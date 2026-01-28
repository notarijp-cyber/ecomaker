import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { AmazonProduct } from "@/components/shop/amazon-product-widget";

interface UseAmazonProductsProps {
  materials?: string[];
  tools?: string[];
  enabled?: boolean;
}

export function useAmazonProducts({ 
  materials = [], 
  tools = [], 
  enabled = true 
}: UseAmazonProductsProps = {}) {
  const [combinedTerms, setCombinedTerms] = useState<string[]>([]);
  
  useEffect(() => {
    // Evita di usare spread su Set per compatibilità
    const uniqueTermsMap: Record<string, boolean> = {};
    [...materials, ...tools].forEach(term => {
      uniqueTermsMap[term] = true;
    });
    setCombinedTerms(Object.keys(uniqueTermsMap));
  }, [materials, tools]);
  
  const { 
    data: products, 
    isLoading, 
    error
  } = useQuery({
    queryKey: ['/api/amazon-products', combinedTerms.join(',')],
    enabled: enabled && combinedTerms.length > 0,
    queryFn: async () => {
      try {
        const response = await apiRequest("POST", "/api/amazon-products", { searchTerms: combinedTerms });
        const data = await response.json();
        return data as AmazonProduct[];
      } catch (error) {
        console.error("Errore nel recupero dei prodotti Amazon:", error);
        return [] as AmazonProduct[];
      }
    }
  });

  return {
    products: products || [],
    isLoading,
    error
  };
}
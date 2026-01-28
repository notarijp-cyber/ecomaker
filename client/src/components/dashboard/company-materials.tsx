import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Material, Company } from "@/lib/types";
import { MaterialCard } from "@/components/project/material-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Building, Factory, ChevronRight, Recycle, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function CompanyMaterials() {
  const [, setLocation] = useLocation();
  const { data: materials, isLoading: materialsLoading } = useQuery<Material[]>({
    queryKey: ['/api/materials'],
  });

  const { data: companies, isLoading: companiesLoading } = useQuery<Company[]>({
    queryKey: ['/api/companies'],
  });

  // Get only materials with a companyId
  const companyMaterials = materials?.filter(m => m.companyId !== undefined).slice(0, 2);

  const isLoading = materialsLoading || companiesLoading;

  const getCompanyName = (companyId?: number): string => {
    if (!companyId || !companies) return "";
    const company = companies.find(c => c.id === companyId);
    return company?.name || "";
  };

  return (
    <Card className="mb-6 shadow-sm">
      <CardHeader className="pb-3 border-b border-border/10">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Factory className="h-5 w-5 mr-2 text-primary" />
            <CardTitle className="text-xl font-heading">
              Materiali aziendali
            </CardTitle>
          </div>
          
          <Button 
            variant="ghost" 
            className="text-primary hover:underline text-sm font-medium p-0 h-auto"
            onClick={() => setLocation("/inventory")}
          >
            Vedi tutti
          </Button>
        </div>
        <CardDescription>
          Materiali recuperati dai nostri partner industriali
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4 pb-2">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {Array(2).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <>
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1 hide-scrollbar">
              {companies?.slice(0, 2).map(company => (
                <Badge 
                  key={company.id} 
                  variant="outline" 
                  className="bg-white/80 backdrop-blur-sm border-neutral-200 text-neutral-800 py-1 px-2 hover:bg-white cursor-pointer whitespace-nowrap"
                >
                  <Building className="h-3 w-3 mr-1 text-amber-500" />
                  {company.name}
                </Badge>
              ))}
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {companyMaterials?.map(material => (
                <div 
                  key={material.id}
                  className="flex items-center p-3 bg-neutral-50 rounded-lg border border-neutral-200 hover:bg-neutral-100 cursor-pointer"
                  onClick={() => setLocation(`/material-detail/${material.id}`)}
                >
                  <div className="flex-shrink-0 bg-white p-2 rounded-md border border-neutral-200 mr-3">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium text-sm">{material.name}</h3>
                    <div className="text-xs text-neutral-500">{getCompanyName(material.companyId)}</div>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    <Badge variant="secondary" className="text-xs">{material.quantity} {material.unit}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>

      {!isLoading && (
        <CardFooter className="pt-1 pb-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-sm"
            onClick={() => setLocation("/inventory")}
          >
            Sfoglia tutti i materiali
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

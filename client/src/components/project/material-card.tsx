import React from "react";
import { useLocation, Link } from "wouter";
import { Material } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getMaterialTypeColor } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { PackageCheck, MapPin, Building, ArrowUpRight, Recycle, Leaf, Eye } from "lucide-react";

interface MaterialCardProps {
  material: Material;
  companyName?: string;
}

export function MaterialCard({ material, companyName }: MaterialCardProps) {
  const [, setLocation] = useLocation();
  const { data: materialTypes } = useQuery({
    queryKey: ['/api/material-types']
  });
  
  const materialType = materialTypes && Array.isArray(materialTypes) && materialTypes.length > 0 
    ? materialTypes.find((t: any) => t.id === material.typeId) 
    : null;
    
  const bgPatterns = [
    "bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMjkuNSAzNS41cTIgMCAzLjUtMS41dDEuNS0zLjUtMS41LTMuNS0zLjUtMS41LTMuNSAxLjUtMS41IDMuNSAxLjUgMy41IDMuNSAxLjVabTAtMTJxMyAwIDUuMjUgMi4xMjVUMzcgMzAuNSAzNC44NzUgMzUuNzUgMjkuNSAzNy44NzUgMjQuMjUgMzUuNzUgMjIgMzAuNXQyLjI1LTUuMjUgNS4yNS0yLjEyNVoiIGZpbGw9InJnYmEoMSwxNTMsNzcsMC4xKSIvPjwvc3ZnPg==')]",
    "bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMzMgMjJsLTQgNCAzLTYtNS0xIDYtMyAtMi01IDQgNCAyLTUtMSA2IDYtM1ptLTgtNGwtMSA2IDYtMyAyIDUtNCA0IDMtNi01LTEgNi0zIC0yLTUgNCA0Wk0yNCAzMWwtNCA0IDMtNi01LTEgNi0zIC0yLTUgNCA0IDItNSAtMSA2IDYtM1ptOSA3bC0xIDYgNi0zIDIgNS00IDQgMy02IC01LTEgNi0zIC0yLTUgNCA0WiIgZmlsbD0icmdiYSgxLDE1Myw3NywwLjEpIi8+PC9zdmc+')]",
    "bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MiIgaGVpZ2h0PSI1MiIgdmlld0JveD0iMCAwIDUyIDUyIj48cGF0aCBmaWxsPSJyZ2JhKDEsMTUzLDc3LDAuMSkiIGQ9Ik0yNSAxM2MwLTcuMSw1LjktMywyLTJzLTQgNy45LDMgOC41YzAsMCwzLjUsMCwzLjUtM2E0LjMsNC4zLDAsMCwwLTQuNS00LjVBNCw0LDAsMCwwLDI1LDEzbTItMTBhNiw2LDAsMCwwLTYsNmMwLDQuOSwxLjgsNS43LDQsNy42LTIuNSwyLTEwLjEsMS45LTEwLDguNC4xLDcsNywxMS44LDEzLDEyaDJjNi0uMiwxMi44LTQsMTMtMTEgLjEtNi41LTcuNS03LTEwLTktMi0xLjctMi0yLjMtMi03IDAtMywyLTYsNS02IDMuMSwwLDUsMyw1LDYsMCw1LjksNiw0LjUsNi4xLDAsMC03LTUuOS0xMy0xNC0xM2gtM20wLDQ1Yy0xNC4zLDAtMjQtNy4xLTI0LTE2UzEyLjcsMTYsMjcsMTZzMjQsNy4xLDI0LDE2UzQxLjMsNDgsMjcsNDhaIi8+PC9zdmc+')]"
  ];
  
  const randomBgPattern = bgPatterns[material.id % bgPatterns.length];
  
  return (
    <Card className="overflow-hidden group hover:shadow-md transition-all duration-300 border border-neutral-200/70 hover:border-primary/30">
      <div className="relative overflow-hidden">
        <div className={`h-40 ${randomBgPattern} bg-cover bg-center bg-gradient-to-br from-green-50 to-emerald-100`}>
          {material.imageUrl ? (
            <img
              src={material.imageUrl}
              alt={material.name}
              className="object-cover h-full w-full transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="rounded-full bg-white/90 p-4 shadow-sm">
                <Recycle className="h-10 w-10 text-primary/80" />
              </div>
            </div>
          )}
          
          {/* Decorative elements */}
          <div className="absolute top-4 left-4 rounded-full bg-white/80 w-8 h-8 flex items-center justify-center">
            <Leaf className="h-4 w-4 text-green-600" />
          </div>
        </div>
        
        {materialType && (
          <div className="absolute top-0 right-0">
            <div className="relative">
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-t-primary/80 border-l-[40px] border-l-transparent"></div>
              <span className="absolute top-2 right-2 text-white text-xs font-bold transform rotate-45">ECO</span>
            </div>
            <Badge className={`mt-10 mr-3 shadow-sm ${getMaterialTypeColor(materialType.name)}`}>
              {materialType.name}
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-5">
        <h3 className="font-heading font-semibold text-neutral-900 group-hover:text-primary transition-colors">
          {material.name}
        </h3>
        
        <p className="text-sm text-neutral-600 mt-1 line-clamp-2">
          {material.description || "Materiale ecosostenibile disponibile per progetti di riciclo creativo"}
        </p>
        
        <div className="border-t border-dashed border-neutral-200 my-3 pt-3 space-y-2">
          <div className="flex items-center text-sm text-neutral-700">
            <div className="rounded-full bg-green-50 p-1.5 mr-2.5">
              <PackageCheck className="h-3.5 w-3.5 text-green-600" />
            </div>
            <span className="font-medium">{material.quantity}</span>
            <span className="ml-1">{material.unit}</span>
          </div>
          
          {material.location && (
            <div className="flex items-center text-sm text-neutral-700">
              <div className="rounded-full bg-red-50 p-1.5 mr-2.5">
                <MapPin className="h-3.5 w-3.5 text-red-500" />
              </div>
              <span>{material.location}</span>
            </div>
          )}
          
          {companyName && (
            <div className="flex items-center text-sm text-neutral-700">
              <div className="rounded-full bg-amber-50 p-1.5 mr-2.5">
                <Building className="h-3.5 w-3.5 text-amber-500" />
              </div>
              <span>{companyName}</span>
            </div>
          )}
        </div>
        
        <div className="flex space-x-2 mt-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 justify-between border-primary/30 text-primary hover:bg-green-50 hover:border-primary/50 group-hover:bg-primary/10 transition-all"
            onClick={() => setLocation(`/material-detail/${material.id}`)}
          >
            <span>Dettagli</span>
            <ArrowUpRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Button>
          
          <Link href={`/ar-material-visualization?id=${material.id}`}>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-primary/30 text-primary hover:bg-green-50 hover:border-primary/50 group-hover:bg-primary/10 transition-all"
            >
              <Eye className="h-3.5 w-3.5" />
              <span className="ml-1.5">AR</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

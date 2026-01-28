import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistance } from "date-fns";
import { it } from "date-fns/locale";
import { Link } from "wouter";

export default function MaterialList() {
  const { isLoading, data: materials } = useQuery({
    queryKey: ['/api/materials/user/1'],
  });
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-neutral-200 rounded-lg"></div>
                <div className="ml-4 flex-1">
                  <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-neutral-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-neutral-200 rounded w-1/4"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (!materials || materials.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 flex flex-col items-center justify-center">
          <span className="material-icons text-4xl text-neutral-400 mb-2">inventory_2</span>
          <h3 className="text-lg font-medium text-neutral-800 mb-1">Nessun materiale</h3>
          <p className="text-sm text-neutral-600 mb-4 text-center">
            Non hai ancora scansionato alcun materiale. Inizia a raccogliere materiali per i tuoi progetti.
          </p>
          <Link href="/">
            <Button className="bg-primary text-white">
              Torna alla Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {materials.map((material) => (
        <Card key={material.id}>
          <CardContent className="p-4">
            <div className="flex items-start">
              {material.imageUrl ? (
                <img 
                  src={material.imageUrl} 
                  alt={material.name} 
                  className="w-16 h-16 rounded-lg object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-neutral-200 flex items-center justify-center">
                  <span className="material-icons text-neutral-400">image</span>
                </div>
              )}
              <div className="ml-4 flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-neutral-800">{material.name}</h3>
                  <Badge variant={material.isUsed ? "outline" : "default"} className={material.isUsed ? "text-neutral-500" : "bg-green-100 text-green-800 hover:bg-green-200"}>
                    {material.isUsed ? "Utilizzato" : "Disponibile"}
                  </Badge>
                </div>
                <p className="text-sm text-neutral-600 mt-1">
                  {material.type.charAt(0).toUpperCase() + material.type.slice(1)} • {material.dimensions}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  Scansionato {formatDistance(new Date(material.scannedAt), new Date(), { addSuffix: true, locale: it })}
                </p>
                
                {material.estimatedWeight && (
                  <div className="flex items-center mt-2 text-xs text-neutral-600">
                    <span className="material-icons text-xs mr-1">scale</span>
                    <span>{material.estimatedWeight}g • </span>
                    <span className="material-icons text-xs mx-1 text-green-600">eco</span>
                    <span className="text-green-600">{Math.round(material.estimatedWeight * 0.5)}g CO2 risparmiati</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

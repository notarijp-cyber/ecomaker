import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MaterialPhysicalProperties } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function MaterialSciencePage() {
  const [materialType, setMaterialType] = useState<string>("");
  const [specificName, setSpecificName] = useState<string>("");
  const { toast } = useToast();
  
  const materialTypes = [
    "plastica", "legno", "metallo", "vetro", "carta", "ceramica", 
    "tessuto", "gomma", "alluminio", "acciaio", "rame", "oro", 
    "argento", "platino", "poliestere", "nylon", "cotone", "seta"
  ];

  // Query per i dati scientifici dei materiali
  const {
    data: materialData,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['material-science', materialType, specificName],
    queryFn: async () => {
      if (!materialType) return null;
      
      const endpoint = specificName 
        ? `/api/material-science/${materialType}/${specificName}` 
        : `/api/material-science/${materialType}`;
        
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Si è verificato un errore durante l'ottenimento dei dati");
      }
      
      return response.json();
    },
    enabled: false // Non eseguire automaticamente la query
  });

  const handleSearch = () => {
    if (!materialType) {
      toast({
        title: "Tipo di materiale richiesto",
        description: "Seleziona un tipo di materiale per continuare",
        variant: "destructive"
      });
      return;
    }
    
    refetch();
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Database scientifico dei materiali</h1>
      <p className="text-neutral-600 mb-8">
        Esplora le proprietà scientifiche dei materiali riciclabili e scopri dati dettagliati sulla loro sostenibilità
        e impatto ambientale. Questi dati sono forniti grazie all'integrazione con Materials Project API.
      </p>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Ricerca materiali</CardTitle>
          <CardDescription>
            Seleziona un tipo di materiale e opzionalmente specifica un nome preciso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="materialType">Tipo di materiale</Label>
              <Select value={materialType} onValueChange={setMaterialType}>
                <SelectTrigger id="materialType">
                  <SelectValue placeholder="Seleziona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  {materialTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 space-y-2">
              <Label htmlFor="specificName">Nome specifico (opzionale)</Label>
              <Input
                id="specificName"
                placeholder="Es. PET, PVC, HDPE"
                value={specificName}
                onChange={(e) => setSpecificName(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSearch} 
            disabled={isLoading || !materialType}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Ricerca in corso...
              </>
            ) : (
              "Cerca dati scientifici"
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {isError && (
        <Card className="border-destructive mb-8">
          <CardHeader className="bg-destructive/10">
            <CardTitle className="text-destructive">Errore</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p>Si è verificato un errore durante l'ottenimento dei dati scientifici. Verifica che l'API Materials Project sia configurata correttamente.</p>
          </CardContent>
        </Card>
      )}
      
      {materialData && (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>
                {materialData.name}
                <span className="ml-2 text-sm font-normal text-neutral-500">({materialData.type})</span>
              </CardTitle>
              <CardDescription>
                {materialData.description || "Informazioni dettagliate sul materiale"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="properties">
                <TabsList className="w-full">
                  <TabsTrigger value="properties" className="flex-1">Proprietà</TabsTrigger>
                  <TabsTrigger value="sustainability" className="flex-1">Sostenibilità</TabsTrigger>
                  <TabsTrigger value="uses" className="flex-1">Utilizzi</TabsTrigger>
                </TabsList>
                
                <TabsContent value="properties" className="space-y-6 mt-4">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Proprietà fisiche</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {renderPhysicalProperties(materialData.properties)}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="sustainability" className="space-y-6 mt-4">
                  {materialData.sustainabilityScore !== undefined && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-2">Punteggio di sostenibilità</h3>
                      <div className="space-y-2">
                        <Progress value={materialData.sustainabilityScore} className="h-4" />
                        <div className="flex justify-between text-sm">
                          <span>Basso impatto</span>
                          <span className="font-semibold">{materialData.sustainabilityScore}/100</span>
                          <span>Alto impatto</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {materialData.environmentalImpact && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-2">Impatto ambientale</h3>
                      <p className="text-neutral-700">{materialData.environmentalImpact}</p>
                    </div>
                  )}
                  
                  {materialData.decompositionTime && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Tempo di decomposizione</h3>
                      <p className="text-neutral-700">{materialData.decompositionTime}</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="uses" className="space-y-6 mt-4">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Utilizzi comuni</h3>
                    {materialData.commonUses && materialData.commonUses.length > 0 ? (
                      <ul className="list-disc pl-6 space-y-2">
                        {materialData.commonUses.map((use: string, index: number) => (
                          <li key={index}>{use}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-neutral-500">Nessun utilizzo comune registrato per questo materiale.</p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Metodi di produzione</h3>
                    {materialData.productionMethods && materialData.productionMethods.length > 0 ? (
                      <ul className="list-disc pl-6 space-y-2">
                        {materialData.productionMethods.map((method: string, index: number) => (
                          <li key={index}>{method}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-neutral-500">Nessun metodo di produzione registrato per questo materiale.</p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Consigli per il riciclo</h3>
                    {materialData.recyclingTips && materialData.recyclingTips.length > 0 ? (
                      <ul className="list-disc pl-6 space-y-2">
                        {materialData.recyclingTips.map((tip: string, index: number) => (
                          <li key={index}>{tip}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-neutral-500">Nessun consiglio di riciclo registrato per questo materiale.</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Funzione di supporto per renderizzare le proprietà fisiche
function renderPhysicalProperties(properties: MaterialPhysicalProperties) {
  const propertyLabels: Record<string, string> = {
    density: "Densità (g/cm³)",
    electricalConductivity: "Conducibilità elettrica (S/m)",
    thermalConductivity: "Conducibilità termica (W/(m·K))",
    meltingPoint: "Punto di fusione (K)",
    recyclable: "Riciclabile",
    biodegradable: "Biodegradabile",
    renewableSource: "Fonte rinnovabile",
    toxicity: "Tossicità",
    energyToProcess: "Energia di processo (MJ/kg)",
    co2Footprint: "Impronta CO2 (kg CO2/kg)",
    waterUsage: "Utilizzo d'acqua (L/kg)",
    durabilityYears: "Durabilità (anni)",
    insulationRValue: "Isolamento (valore R)",
    flammability: "Infiammabilità",
    uvResistance: "Resistenza UV",
    acidResistance: "Resistenza agli acidi",
    alkalineResistance: "Resistenza agli alcali"
  };
  
  return Object.entries(properties)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]: [string, any]) => {
      // Formatta i valori booleani
      let displayValue: React.ReactNode = value;
      if (typeof value === "boolean") {
        displayValue = value ? (
          <span className="text-green-600 font-medium">Sì</span>
        ) : (
          <span className="text-red-600 font-medium">No</span>
        );
      }
      
      return (
        <div key={key} className="bg-neutral-50 p-3 rounded-md">
          <span className="block text-sm text-neutral-500">{propertyLabels[key] || key}</span>
          <span className="block font-medium">{displayValue}</span>
        </div>
      );
    });
}
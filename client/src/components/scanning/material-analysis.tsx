import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MaterialAnalysisResult, MaterialType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getMaterialTypeColor } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

interface MaterialAnalysisProps {
  result: MaterialAnalysisResult;
  imageUrl: string;
  materialTypes: MaterialType[];
  onReset: () => void;
  onSave: () => void;
}

export function MaterialAnalysis({ result, imageUrl, materialTypes, onReset, onSave }: MaterialAnalysisProps) {
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState("pezzo");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Find material type ID based on the analyzed type
  const materialTypeId = materialTypes.find(
    mt => mt.name.toLowerCase() === result.type.toLowerCase()
  )?.id || materialTypes[0]?.id || 1;
  
  const unitOptions = ["pezzo", "kg", "g", "litro", "ml", "metro", "cm"];
  
  // Add material mutation
  const addMaterialMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/materials', {
        name: result.name,
        description: `${result.name} di tipo ${result.type}. ${result.possibleUses[0] || ''}`,
        typeId: materialTypeId,
        imageUrl: imageUrl,
        userId: 1, // Demo user
        quantity: parseFloat(quantity),
        unit: unit,
        isAvailable: true,
        location: "Casa"
      });
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Materiale aggiunto",
        description: "Il materiale è stato aggiunto all'inventario",
        variant: "default"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/materials'] });
      onSave();
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: "Non è stato possibile aggiungere il materiale",
        variant: "destructive"
      });
      console.error("Error adding material:", error);
    }
  });
  
  const handleSaveMaterial = () => {
    if (parseFloat(quantity) <= 0) {
      toast({
        title: "Errore",
        description: "La quantità deve essere maggiore di zero",
        variant: "destructive"
      });
      return;
    }
    
    addMaterialMutation.mutate();
  };
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="info">
        <TabsList className="w-full">
          <TabsTrigger value="info" className="flex-1">Dettagli</TabsTrigger>
          <TabsTrigger value="uses" className="flex-1">Utilizzi</TabsTrigger>
          <TabsTrigger value="tips" className="flex-1">Consigli</TabsTrigger>
          {(result.physicalProperties || result.sustainabilityScore || result.environmentalImpact) && (
            <TabsTrigger value="science" className="flex-1">Scienza</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="info" className="space-y-4 mt-4">
          <div className="flex gap-4">
            <div className="w-1/3">
              <div className="bg-neutral-lightest rounded-lg overflow-hidden aspect-square">
                <img src={imageUrl} alt={result.name} className="object-cover w-full h-full" />
              </div>
            </div>
            
            <div className="w-2/3 space-y-3">
              <div>
                <h3 className="font-heading font-semibold text-lg">{result.name}</h3>
                <Badge className={getMaterialTypeColor(result.type)}>{result.type}</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantità</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="unit">Unità</Label>
                  <Select defaultValue={unit} onValueChange={setUnit}>
                    <SelectTrigger id="unit">
                      <SelectValue placeholder="Seleziona unità" />
                    </SelectTrigger>
                    <SelectContent>
                      {unitOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="uses" className="mt-4">
          <Card>
            <CardContent className="p-3 pt-3">
              <h4 className="font-heading font-medium text-sm mb-2">Possibili utilizzi</h4>
              <ul className="text-sm text-neutral-medium space-y-3">
                {result.possibleUses.map((use, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-2"></div>
                    <span>{use}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tips" className="mt-4">
          <Card>
            <CardContent className="p-3 pt-3">
              <h4 className="font-heading font-medium text-sm mb-2">Consigli per il riciclo</h4>
              <ul className="text-sm text-neutral-medium space-y-3">
                {result.recyclingTips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-2"></div>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        {(result.physicalProperties || result.sustainabilityScore || result.environmentalImpact) && (
          <TabsContent value="science" className="mt-4">
            <Card>
              <CardContent className="p-3 pt-3">
                <h4 className="font-heading font-medium text-sm mb-4">Dati scientifici del materiale</h4>
                
                {/* Sostenibilità */}
                {result.sustainabilityScore !== undefined && (
                  <div className="mb-4">
                    <h5 className="font-medium text-xs mb-2">Sostenibilità</h5>
                    <div className="flex flex-col space-y-2">
                      <div className="w-full bg-neutral-100 rounded-full h-4">
                        <div 
                          className="bg-gradient-to-r from-red-500 to-green-500 h-4 rounded-full" 
                          style={{ width: `${result.sustainabilityScore}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Basso impatto</span>
                        <span className="font-semibold">{result.sustainabilityScore}/100</span>
                        <span>Alto impatto</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Impatto ambientale */}
                {result.environmentalImpact && (
                  <div className="mb-4">
                    <h5 className="font-medium text-xs mb-1">Impatto ambientale</h5>
                    <p className="text-sm text-neutral-700">{result.environmentalImpact}</p>
                  </div>
                )}
                
                {/* Tempo di decomposizione */}
                {result.decompositionTime && (
                  <div className="mb-4">
                    <h5 className="font-medium text-xs mb-1">Tempo di decomposizione</h5>
                    <p className="text-sm text-neutral-700">{result.decompositionTime}</p>
                  </div>
                )}
                
                {/* Proprietà fisiche */}
                {result.physicalProperties && Object.keys(result.physicalProperties).length > 0 && (
                  <div>
                    <h5 className="font-medium text-xs mb-2">Proprietà fisiche</h5>
                    <div className="grid grid-cols-2 gap-2">
                      {result.physicalProperties.density !== undefined && (
                        <div className="bg-neutral-50 p-2 rounded">
                          <span className="text-xs text-neutral-500">Densità</span>
                          <p className="text-sm font-medium">{result.physicalProperties.density} g/cm³</p>
                        </div>
                      )}
                      
                      {result.physicalProperties.meltingPoint !== undefined && (
                        <div className="bg-neutral-50 p-2 rounded">
                          <span className="text-xs text-neutral-500">Punto di fusione</span>
                          <p className="text-sm font-medium">{result.physicalProperties.meltingPoint} K</p>
                        </div>
                      )}
                      
                      {result.physicalProperties.electricalConductivity !== undefined && (
                        <div className="bg-neutral-50 p-2 rounded">
                          <span className="text-xs text-neutral-500">Conducibilità elettrica</span>
                          <p className="text-sm font-medium">{result.physicalProperties.electricalConductivity} S/m</p>
                        </div>
                      )}
                      
                      {result.physicalProperties.thermalConductivity !== undefined && (
                        <div className="bg-neutral-50 p-2 rounded">
                          <span className="text-xs text-neutral-500">Conducibilità termica</span>
                          <p className="text-sm font-medium">{result.physicalProperties.thermalConductivity} W/(m·K)</p>
                        </div>
                      )}
                      
                      {result.physicalProperties.recyclable !== undefined && (
                        <div className="bg-neutral-50 p-2 rounded">
                          <span className="text-xs text-neutral-500">Riciclabile</span>
                          <p className="text-sm font-medium">{result.physicalProperties.recyclable ? 'Sì' : 'No'}</p>
                        </div>
                      )}
                      
                      {result.physicalProperties.biodegradable !== undefined && (
                        <div className="bg-neutral-50 p-2 rounded">
                          <span className="text-xs text-neutral-500">Biodegradabile</span>
                          <p className="text-sm font-medium">{result.physicalProperties.biodegradable ? 'Sì' : 'No'}</p>
                        </div>
                      )}
                      
                      {result.physicalProperties.toxicity !== undefined && (
                        <div className="bg-neutral-50 p-2 rounded">
                          <span className="text-xs text-neutral-500">Tossicità</span>
                          <p className="text-sm font-medium">{result.physicalProperties.toxicity}</p>
                        </div>
                      )}
                      
                      {result.physicalProperties.co2Footprint !== undefined && (
                        <div className="bg-neutral-50 p-2 rounded">
                          <span className="text-xs text-neutral-500">Impronta CO2</span>
                          <p className="text-sm font-medium">{result.physicalProperties.co2Footprint} kg CO2/kg</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
      
      <div className="flex space-x-3">
        <Button 
          variant="outline" 
          className="flex-1 border border-neutral-light text-neutral-dark"
          onClick={onReset}
          disabled={addMaterialMutation.isPending}
        >
          Scansiona altro
        </Button>
        <Button 
          className="flex-1 bg-primary text-white"
          onClick={handleSaveMaterial}
          disabled={addMaterialMutation.isPending}
        >
          {addMaterialMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Salvataggio...
            </>
          ) : (
            "Aggiungi all'inventario"
          )}
        </Button>
      </div>
    </div>
  );
}

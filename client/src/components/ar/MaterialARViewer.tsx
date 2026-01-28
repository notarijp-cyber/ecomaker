import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModelViewer } from './ModelViewer';
import { ARViewer } from './ARViewer';
import { Camera, Eye, Lightbulb, Headset, RotateCcw, Info, 
        ArrowRightToLine, Maximize, Minimize, RefreshCw } from 'lucide-react';

export interface Material {
  id: number;
  name: string;
  description?: string;
  typeId: number;
  imageUrl?: string;
  modelType?: string;
  color?: string;
  properties?: any;
}

interface MaterialARViewerProps {
  materials: Material[];
  className?: string;
  initialMaterialId?: number;
}

/**
 * Componente per la visualizzazione AR di materiali
 * Permette di visualizzare oggetti 3D rappresentativi di materiali di riciclo
 */
export function MaterialARViewer({ materials, className = '', initialMaterialId }: MaterialARViewerProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [isARActive, setIsARActive] = useState(false);
  const [viewMode, setViewMode] = useState<'3d' | 'ar'>('3d');
  const [rotation, setRotation] = useState(true);
  const [modelScale, setModelScale] = useState(1);

  useEffect(() => {
    // Se è specificato un ID iniziale, cerca quel materiale
    if (initialMaterialId && materials && materials.length > 0 && !selectedMaterial) {
      const foundMaterial = materials.find(m => m.id === initialMaterialId);
      if (foundMaterial) {
        setSelectedMaterial(foundMaterial);
        return;
      }
    }
    
    // Altrimenti seleziona il primo materiale di default
    if (materials && materials.length > 0 && !selectedMaterial) {
      setSelectedMaterial(materials[0]);
    }
  }, [materials, selectedMaterial, initialMaterialId]);

  const toggleAR = () => {
    setIsARActive(!isARActive);
  };

  const determineModelType = (material: Material): string => {
    if (material.modelType) return material.modelType;
    
    // Determina il tipo di modello basato sul nome o descrizione del materiale
    const name = material.name.toLowerCase();
    if (name.includes('bottiglia') || name.includes('bottle')) return 'bottle';
    if (name.includes('carta') || name.includes('cartone') || name.includes('paper')) return 'box';
    if (name.includes('lattina') || name.includes('can')) return 'cylinder';
    if (name.includes('vetro') || name.includes('glass')) return 'bottle';
    if (name.includes('plastica') || name.includes('plastic')) return 'box';
    
    // Default
    return 'box';
  };

  const determineModelColor = (material: Material): string => {
    if (material.color) return material.color;
    
    // Colore basato sul tipo di materiale
    const name = material.name.toLowerCase();
    if (name.includes('plastica') || name.includes('plastic')) return '#8bc5cc';
    if (name.includes('carta') || name.includes('cartone') || name.includes('paper')) return '#e8c291';
    if (name.includes('lattina') || name.includes('alluminio') || name.includes('aluminium')) return '#cccccc';
    if (name.includes('vetro') || name.includes('glass')) return '#a8d9e6';
    if (name.includes('legno') || name.includes('wood')) return '#a57b55';
    
    // Default
    return '#4caf50';
  };

  const getARModelOptions = (material: Material) => {
    return {
      modelType: determineModelType(material),
      color: determineModelColor(material),
      materialId: material.id
    };
  };

  const handleZoomIn = () => {
    setModelScale(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setModelScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleResetView = () => {
    setModelScale(1);
    setRotation(true);
  };

  if (!selectedMaterial) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center min-h-[300px]">
          <RefreshCw className="h-10 w-10 text-neutral-300 animate-spin mb-4" />
          <p className="text-neutral-medium">Caricamento materiali...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Visualizza Materiali in AR</CardTitle>
            <CardDescription>
              Esplora i materiali in 3D e realtà aumentata prima di utilizzarli
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setViewMode(viewMode === '3d' ? 'ar' : '3d')}
              className="hidden sm:flex"
            >
              {viewMode === '3d' ? (
                <>
                  <Headset className="h-4 w-4 mr-2" />
                  Passa a AR
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Torna a 3D
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-4">
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="preview" className="flex-1">
              Anteprima 3D
            </TabsTrigger>
            <TabsTrigger value="materials" className="flex-1">
              Materiali
            </TabsTrigger>
            <TabsTrigger value="info" className="flex-1">
              Informazioni
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="space-y-4">
            {/* Visualizzazione 3D del materiale */}
            <div className="relative bg-neutral-50 rounded-lg overflow-hidden w-full">
              <div className="flex justify-center py-6">
                <div className={`relative transition-transform duration-300`} style={{ transform: `scale(${modelScale})` }}>
                  <ModelViewer
                    modelType={determineModelType(selectedMaterial)}
                    color={determineModelColor(selectedMaterial)}
                    rotation={rotation}
                    width={250}
                    height={250}
                  />
                </div>
                
                {/* Controlli zoom e rotazione */}
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <Button onClick={handleZoomIn} variant="secondary" size="icon" className="h-8 w-8 rounded-full">
                    <Maximize className="h-4 w-4" />
                  </Button>
                  <Button onClick={handleZoomOut} variant="secondary" size="icon" className="h-8 w-8 rounded-full">
                    <Minimize className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => setRotation(!rotation)} variant="secondary" size="icon" className="h-8 w-8 rounded-full">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button onClick={handleResetView} variant="secondary" size="icon" className="h-8 w-8 rounded-full">
                    <ArrowRightToLine className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="px-4 pb-4">
                <h3 className="text-lg font-bold mb-1">{selectedMaterial.name}</h3>
                <p className="text-neutral-medium text-sm mb-3">
                  {selectedMaterial.description || 'Materiale riciclabile che può essere trasformato in nuovi progetti.'}
                </p>
                
                <div className="flex justify-center mt-4">
                  <Button onClick={toggleAR} className="bg-primary">
                    <Headset className="h-4 w-4 mr-2" />
                    Visualizza in Realtà Aumentata
                  </Button>
                </div>
              </div>
            </div>

            {/* Consigli di utilizzo */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-semibold flex items-center">
                  <Lightbulb className="h-4 w-4 mr-2 text-amber-500" />
                  Consigli per l'utilizzo
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <div className="bg-primary bg-opacity-10 p-1 rounded-full mr-2 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Pulisci accuratamente il materiale prima di utilizzarlo nel tuo progetto.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary bg-opacity-10 p-1 rounded-full mr-2 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Questo materiale può essere facilmente tagliato, piegato o modellato con gli strumenti appropriati.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary bg-opacity-10 p-1 rounded-full mr-2 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Si combina bene con altri materiali riciclati come {selectedMaterial.name.includes('plastica') ? 'carta o legno' : 'plastica o vetro'}.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="materials" className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {materials.map((material) => (
                <div 
                  key={material.id}
                  className={`
                    cursor-pointer border rounded-lg overflow-hidden hover:border-primary transition-colors
                    ${selectedMaterial && selectedMaterial.id === material.id ? 'border-primary-500 ring-2 ring-primary-200' : ''}
                  `}
                  onClick={() => setSelectedMaterial(material)}
                >
                  <div className="h-24 bg-neutral-50 flex items-center justify-center">
                    {material.imageUrl ? (
                      <img 
                        src={material.imageUrl} 
                        alt={material.name} 
                        className="max-h-20 max-w-full object-contain"
                      />
                    ) : (
                      <div className="h-16 w-16 relative">
                        <ModelViewer
                          modelType={determineModelType(material)}
                          color={determineModelColor(material)}
                          width={64}
                          height={64}
                        />
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium text-center line-clamp-2">
                      {material.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="info" className="space-y-4">
            {selectedMaterial && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-bold mb-2 flex items-center">
                    <Info className="h-4 w-4 mr-2 text-primary" />
                    Caratteristiche del Materiale
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-neutral-50 p-3 rounded-md">
                      <p className="text-xs font-semibold mb-1 text-neutral-medium">Tipo</p>
                      <p className="text-sm font-medium">{selectedMaterial.name.split(' ')[0]}</p>
                    </div>
                    <div className="bg-neutral-50 p-3 rounded-md">
                      <p className="text-xs font-semibold mb-1 text-neutral-medium">Riciclabilità</p>
                      <p className="text-sm font-medium">Alta</p>
                    </div>
                    <div className="bg-neutral-50 p-3 rounded-md">
                      <p className="text-xs font-semibold mb-1 text-neutral-medium">Durabilità</p>
                      <p className="text-sm font-medium">Media</p>
                    </div>
                    <div className="bg-neutral-50 p-3 rounded-md">
                      <p className="text-xs font-semibold mb-1 text-neutral-medium">Lavorabilità</p>
                      <p className="text-sm font-medium">Facile</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-bold mb-2">Progetti Correlati</h3>
                  <p className="text-sm text-neutral-medium">
                    Questo materiale è utilizzato frequentemente nei progetti di:
                  </p>
                  <ul className="list-disc ml-5 mt-2 space-y-1 text-sm">
                    {selectedMaterial.name.toLowerCase().includes('bottiglia') && (
                      <>
                        <li>Vasi per piante sospesi</li>
                        <li>Lampade da tavolo</li>
                        <li>Contenitori per organizzare</li>
                      </>
                    )}
                    {selectedMaterial.name.toLowerCase().includes('carta') && (
                      <>
                        <li>Decorazioni a parete</li>
                        <li>Contenitori origami</li>
                        <li>Cornici per foto</li>
                      </>
                    )}
                    {selectedMaterial.name.toLowerCase().includes('legno') && (
                      <>
                        <li>Mensole da parete</li>
                        <li>Portaoggetti</li>
                        <li>Appendiabiti</li>
                      </>
                    )}
                    {!selectedMaterial.name.toLowerCase().includes('bottiglia') && 
                     !selectedMaterial.name.toLowerCase().includes('carta') &&
                     !selectedMaterial.name.toLowerCase().includes('legno') && (
                      <>
                        <li>Organizzatori per la casa</li>
                        <li>Vasi per piante</li>
                        <li>Accessori decorativi</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {isARActive && (
        <ARViewer
          materialId={selectedMaterial.id}
          modelUrl=""
          isVisible={isARActive}
          onClose={() => setIsARActive(false)}
        />
      )}
    </Card>
  );
}
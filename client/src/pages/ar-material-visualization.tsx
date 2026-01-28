import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout/page-layout';
import { MaterialARViewer } from '@/components/ar/MaterialARViewer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Camera, Info, Lightbulb, Package, Shapes, Eye, RefreshCw } from 'lucide-react';
import { useCamera } from '@/hooks/use-camera';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';

/**
 * Pagina per la visualizzazione dei materiali in realtà aumentata
 * Consente agli utenti di esplorare i materiali disponibili in 3D e AR
 */
export default function ARMaterialVisualizationPage() {
  const [activeTab, setActiveTab] = useState('ar-viewer');
  const [searchParams] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search);
    }
    return new URLSearchParams();
  });
  const materialIdParam = searchParams.get('id');
  
  const { 
    videoRef, 
    isActive: cameraActive, 
    imageUrl, 
    isLoading: analyzeLoading,
    analysisResult,
    startCamera, 
    stopCamera, 
    captureImage,
    analyzeImage,
    resetImage
  } = useCamera();

  // Carica la lista dei materiali disponibili
  const { data: materials = [], isLoading: materialsLoading } = useQuery<any[]>({
    queryKey: ['/api/materials'],
    staleTime: 60 * 1000, // 1 minuto
  });

  // Carica i tipi di materiali
  const { data: materialTypes = [], isLoading: typesLoading } = useQuery<any[]>({
    queryKey: ['/api/material-types'],
    staleTime: 5 * 60 * 1000, // 5 minuti
  });

  const handleStartCamera = async () => {
    await startCamera();
  };

  const handleCaptureImage = async () => {
    await captureImage();
  };

  const handleAnalyzeImage = async () => {
    if (imageUrl) {
      await analyzeImage(true); // Usa Google Vision API
    }
  };

  const handleTryScanAgain = () => {
    resetImage();
    handleStartCamera();
  };

  const getRecognizedMaterials = () => {
    if (!materials || !analysisResult || !analysisResult.name) {
      return [];
    }

    // Trova materiali che corrispondono al materiale riconosciuto
    return materials.filter((material: any) => {
      // Trova corrispondenza per nome o tipo
      const materialName = material.name.toLowerCase();
      const recognizedName = analysisResult.name.toLowerCase();
      const recognizedType = analysisResult.type?.toLowerCase() || '';
      
      return materialName.includes(recognizedName) || 
             materialName.includes(recognizedType) || 
             recognizedName.includes(materialName) ||
             recognizedType.includes(materialName);
    });
  };

  const recognizedMaterials = getRecognizedMaterials();

  return (
    <PageLayout>
      <div className="container max-w-7xl mx-auto py-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Visualizzazione Materiali in AR
              </h1>
              <p className="text-muted-foreground">
                Esplora i tuoi materiali riciclabili in realtà aumentata per creare progetti sostenibili
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-12">
          {/* Sidebar informazioni */}
          <div className="md:col-span-3 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Info className="h-5 w-5 mr-2 text-primary" />
                  Guida AR
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Questa funzionalità ti permette di visualizzare i materiali in 3D e realtà aumentata per comprendere meglio come utilizzarli.
                  </p>
                  
                  <div className="rounded-md bg-primary/5 p-3">
                    <h4 className="font-medium text-sm mb-1 flex items-center">
                      <Lightbulb className="h-4 w-4 mr-1 text-primary" />
                      Come funziona
                    </h4>
                    <ol className="text-xs space-y-1 text-muted-foreground list-decimal ml-4">
                      <li>Esplora i materiali in visualizzazione 3D</li>
                      <li>Premi il pulsante AR per visualizzarli nello spazio reale</li>
                      <li>Usa la modalità con marker per un posizionamento preciso</li>
                      <li>Puoi anche scansionare nuovi materiali con la fotocamera</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Package className="h-5 w-5 mr-2 text-primary" />
                  Materiali
                </CardTitle>
              </CardHeader>
              <CardContent>
                {materialsLoading || typesLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      {materialTypes && materialTypes.slice(0, 5).map((type: any) => (
                        <div key={type.id} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                          <span className="text-sm">{type.name}</span>
                          <Badge variant="outline" className="ml-auto text-xs">
                            {materials?.filter((m: any) => m.typeId === type.id).length || 0}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4">
                      <Link href="/inventory">
                        <Button variant="outline" size="sm" className="w-full">
                          Visualizza Inventario
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Contenuto principale */}
          <div className="md:col-span-9">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ar-viewer" className="flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  Visualizzatore AR
                </TabsTrigger>
                <TabsTrigger value="material-scanner" className="flex items-center">
                  <Camera className="h-4 w-4 mr-2" />
                  Scansiona Materiale
                </TabsTrigger>
              </TabsList>
              
              {/* Tab Visualizzatore AR */}
              <TabsContent value="ar-viewer" className="space-y-4">
                {materialsLoading ? (
                  <Card>
                    <CardContent className="p-8 flex items-center justify-center">
                      <div className="text-center">
                        <RefreshCw className="h-12 w-12 text-primary/30 animate-spin mx-auto mb-4" />
                        <p>Caricamento materiali...</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : materials && materials.length > 0 ? (
                  <MaterialARViewer 
                    materials={materials} 
                    initialMaterialId={materialIdParam ? parseInt(materialIdParam, 10) : undefined} 
                  />
                ) : (
                  <Card>
                    <CardContent className="p-8 flex flex-col items-center justify-center">
                      <Shapes className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-medium mb-2">Nessun materiale disponibile</h3>
                      <p className="text-muted-foreground text-center mb-4">
                        Non hai ancora aggiunto materiali al tuo inventario o scansionato materiali.
                      </p>
                      <Link href="/inventory">
                        <Button>Gestisci Inventario</Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              {/* Tab Scanner Materiali */}
              <TabsContent value="material-scanner" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Scanner Materiali</CardTitle>
                    <CardDescription>
                      Scansiona un materiale con la fotocamera per identificarlo e visualizzarlo in AR
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="aspect-video relative bg-black rounded-md overflow-hidden">
                      {!imageUrl ? (
                        cameraActive ? (
                          <>
                            <video
                              ref={videoRef}
                              autoPlay
                              playsInline
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                              <Button
                                onClick={handleCaptureImage}
                                size="lg"
                                className="rounded-full h-14 w-14 p-0"
                              >
                                <Camera className="h-6 w-6" />
                              </Button>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full">
                            <Camera className="h-12 w-12 text-white mb-4 opacity-50" />
                            <Button onClick={handleStartCamera} variant="default">
                              Attiva Fotocamera
                            </Button>
                          </div>
                        )
                      ) : (
                        <div className="relative h-full">
                          <img
                            src={imageUrl}
                            alt="Immagine catturata"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-4 right-4 flex gap-2">
                            <Button
                              onClick={handleTryScanAgain}
                              variant="secondary"
                            >
                              Scansiona di Nuovo
                            </Button>
                            {!analysisResult && (
                              <Button
                                onClick={handleAnalyzeImage}
                                variant="default"
                                disabled={analyzeLoading}
                              >
                                {analyzeLoading ? (
                                  <>
                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                    Analisi...
                                  </>
                                ) : (
                                  'Analizza Materiale'
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Risultato dell'analisi */}
                    {analysisResult && (
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <h3 className="text-lg font-medium mb-2">Materiale Riconosciuto</h3>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-1">Tipo</p>
                              <p className="font-semibold text-lg">{analysisResult.name}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-1">Categoria</p>
                              <p className="font-semibold text-lg">{analysisResult.type || 'Non specificata'}</p>
                            </div>
                          </div>
                          <div className="mt-4">
                            <p className="text-sm font-medium text-muted-foreground mb-1">Possibili utilizzi</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {analysisResult.possibleUses && analysisResult.possibleUses.map((use: string, i: number) => (
                                <Badge key={i} variant="secondary">{use}</Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-sm font-medium text-primary mb-2">Materiali corrispondenti nel tuo inventario</p>
                            {recognizedMaterials.length > 0 ? (
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {recognizedMaterials.map((material: any) => (
                                  <div key={material.id} className="border rounded p-2 text-center">
                                    <p className="text-sm font-medium">{material.name}</p>
                                    <p className="text-xs text-muted-foreground">{material.quantity} {material.unit}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                Nessun materiale corrispondente trovato nel tuo inventario.
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {recognizedMaterials.length > 0 && (
                          <MaterialARViewer materials={recognizedMaterials} />
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
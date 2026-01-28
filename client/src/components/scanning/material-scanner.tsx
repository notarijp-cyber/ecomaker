import React, { useState, useEffect } from "react";
import { useCamera } from "@/hooks/use-camera";
import { X, Info, Box, Lightbulb, Search, BookOpen, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CameraView } from "@/components/scanning/camera-view";
import { MaterialAnalysis } from "@/components/scanning/material-analysis";
import { useMaterialInventory } from "@/hooks/use-material-inventory";
import { useAIAssistant } from "@/hooks/use-ai-assistant";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MaterialAnalysisResult } from "@/lib/types";

interface MaterialScannerProps {
  onClose: () => void;
}

export function MaterialScanner({ onClose }: MaterialScannerProps) {
  const [step, setStep] = useState<'camera' | 'analysis' | 'result' | 'ideas'>('camera');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [uploadedImageAnalysis, setUploadedImageAnalysis] = useState<MaterialAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [externalSource, setExternalSource] = useState<string>('all');
  const [useGoogleVision, setUseGoogleVision] = useState<boolean>(false);
  const camera = useCamera();
  const { materialTypes, materials } = useMaterialInventory(1); // Using demo user id for now
  const { 
    searchExternalProjects, 
    externalProjects, 
    generateEnhancedProjectIdeas,
    projectSuggestions,
    isLoading,
    error: aiError
  } = useAIAssistant();
  
  const handleCapture = async (): Promise<string | null> => {
    try {
      const imageUrl = await camera.captureImage();
      if (imageUrl) {
        setStep('analysis');
      }
      return imageUrl;
    } catch (error) {
      console.error("Errore durante la cattura dell'immagine:", error);
      return null;
    }
  };
  
  const handleImageUpload = async (base64: string) => {
    // Immagine caricata dalla galleria
    camera.stopCamera();
    camera.resetImage();
    
    if (base64) {
      setStep('analysis');
      
      try {
        // Determina l'endpoint in base al parametro useGoogleVision
        const endpoint = useGoogleVision 
          ? '/api/analyze-material-google-vision'
          : '/api/analyze-material';
          
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            image: base64,
            useGoogleVision 
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Errore nella risposta del server: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result) {
          // Aggiornare lo stato con il risultato dell'analisi
          setUploadedImageAnalysis(result);
          setUploadedImageUrl(base64);
          setStep('result');
        }
      } catch (err: any) {
        console.error('Errore durante l\'analisi dell\'immagine:', err);
        setError(`Errore durante l'analisi: ${err.message || 'Errore sconosciuto'}`);
        setStep('camera');
      }
    }
  };
  
  const handleAnalyze = async () => {
    if (uploadedImageUrl && !uploadedImageAnalysis) {
      try {
        // Remove data URL prefix if present
        const base64Image = uploadedImageUrl.split(',')[1];
        
        // Determina l'endpoint in base al parametro useGoogleVision
        const endpoint = useGoogleVision 
          ? '/api/analyze-material-google-vision'
          : '/api/analyze-material';
          
        // Call the API directly for uploaded images
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            image: base64Image,
            useGoogleVision
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to analyze image');
        }
        
        const result = await response.json();
        setUploadedImageAnalysis(result);
        setStep('result');
      } catch (error) {
        console.error('Error analyzing uploaded image:', error);
        setError('Errore durante l\'analisi dell\'immagine. Riprova.');
      }
    } else {
      // Use camera analysis for camera-captured images
      await camera.analyzeImage(useGoogleVision);
      setStep('result');
    }
  };
  
  const handleReset = () => {
    setUploadedImageAnalysis(null);
    setUploadedImageUrl(null);
    camera.resetImage();
    camera.startCamera();
    setStep('camera');
  };
  
  const handleSave = () => {
    // Would save the material to user's inventory
    setUploadedImageAnalysis(null);
    setUploadedImageUrl(null);
    camera.resetImage();
    onClose();
  };
  
  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchExternalProjects(searchQuery.split(',').map(s => s.trim()), externalSource);
    }
  };
  
  const handleGenerateIdeas = () => {
    const analysisResult = uploadedImageAnalysis || camera.analysisResult;
    
    if (analysisResult) {
      // Combine the scanned material with existing materials to generate project ideas
      const availableMaterials = [analysisResult.name];
      if (materials) {
        availableMaterials.push(...materials.slice(0, 3).map(m => m.name));
      }
      
      generateEnhancedProjectIdeas(availableMaterials);
      setStep('ideas');
    }
  };
  
  return (
    <div className="fixed inset-0 bg-neutral-dark bg-opacity-50 z-40">
      <div 
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl p-4 transform transition-transform duration-300 ease-in-out"
        style={{ height: '85vh' }}
      >
        <div className="flex justify-between items-center border-b border-neutral-light pb-3 mb-3">
          <h2 className="text-xl font-heading font-bold">Scansiona materiale</h2>
          <Button
            variant="ghost"
            className="rounded-full h-8 w-8 flex items-center justify-center text-neutral-medium hover:bg-neutral-lightest"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Pulsanti per test in ambiente Replit */}
        {step === 'camera' && (
          <div className="space-y-2 mb-4">
            <Button 
              variant="secondary" 
              className="w-full bg-amber-50 border border-amber-200 text-amber-700"
              onClick={() => {
                // LIBRERIA DI MATERIALI DIVERSI PER TESTING
                const demoMaterials = [
                  {
                    name: "Bottiglia di plastica PET",
                    type: "Plastica",
                    possibleUses: [
                      "Creare un vaso per piante con il fondo della bottiglia",
                      "Trasformare in un portapenne colorato",
                      "Usare come contenitore per piccoli oggetti",
                      "Creare una lampada decorativa",
                      "Realizzare un mini terrario per piante"
                    ],
                    recyclingTips: [
                      "Rimuovere l'etichetta e il tappo prima del riciclo",
                      "Sciacquare la bottiglia prima di riciclarla",
                      "Non schiacciare completamente la bottiglia",
                      "Verifica il codice di riciclo sul fondo (PET = 1)",
                      "Può essere riciclata più volte in nuovi prodotti"
                    ]
                  },
                  {
                    name: "Cartone da imballaggio",
                    type: "Carta",
                    possibleUses: [
                      "Creare organizzatori per cassetti",
                      "Costruire un gioco da tavolo personalizzato",
                      "Realizzare decorazioni per la casa",
                      "Costruire una casetta per bambini",
                      "Rivestire quaderni e libri"
                    ],
                    recyclingTips: [
                      "Rimuovere nastro adesivo e graffette",
                      "Appiattire il cartone per risparmiare spazio",
                      "Tenere asciutto il cartone prima del riciclo",
                      "Separare il cartone colorato da quello naturale",
                      "Evitare di riciclare cartone sporco di cibo"
                    ]
                  },
                  {
                    name: "Barattolo di vetro",
                    type: "Vetro",
                    possibleUses: [
                      "Creare portacandele decorativi",
                      "Utilizzare come vaso per piante aromatiche",
                      "Realizzare lampade con luci LED",
                      "Contenitori per conserve fatte in casa",
                      "Organizzatori per piccoli oggetti"
                    ],
                    recyclingTips: [
                      "Rimuovere tappi e coperchi prima del riciclo",
                      "Sciacquare bene per eliminare residui di cibo",
                      "Non necessario rimuovere le etichette di carta",
                      "Non mescolare con ceramica o cristallo",
                      "Il vetro può essere riciclato infinite volte"
                    ]
                  },
                  {
                    name: "Lattina di alluminio",
                    type: "Metallo",
                    possibleUses: [
                      "Creare portapenne decorativi",
                      "Realizzare lampade da giardino",
                      "Costruire mini fornelli per campeggio",
                      "Fare stampi per biscotti fai-da-te",
                      "Creare decorazioni sospese per esterni"
                    ],
                    recyclingTips: [
                      "Sciacquare per rimuovere residui di bevande",
                      "Schiacciare la lattina per risparmiare spazio",
                      "Riciclare anche il coperchio staccato",
                      "L'alluminio è riciclabile al 100%",
                      "Riciclare l'alluminio risparmia il 95% dell'energia"
                    ]
                  },
                  {
                    name: "Contenitore di polistirolo",
                    type: "Plastica",
                    possibleUses: [
                      "Creare stampi per progetti in cemento",
                      "Realizzare contenitori isolanti per piante",
                      "Creare basi per progetti di modellismo",
                      "Utilizzare come isolante per piccoli spazi",
                      "Realizzare dispenser automatici per animali"
                    ],
                    recyclingTips: [
                      "Verificare se accettato nel sistema locale di riciclo",
                      "Pulire da residui di cibo",
                      "Ridurre in pezzi piccoli se possibile",
                      "Separare dalle altre plastiche",
                      "Cercare centri specializzati per il polistirolo"
                    ]
                  }
                ];
                
                // Seleziona un materiale casuale
                const randomIndex = Math.floor(Math.random() * demoMaterials.length);
                const demoResult = demoMaterials[randomIndex];
                
                // Simula un'immagine di esempio
                const demoImage = "data:image/jpeg;base64,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";
                
                // Imposta gli stati e mostra i risultati
                if (step === 'camera') {
                  setUploadedImageUrl(demoImage);
                  setUploadedImageAnalysis(demoResult);
                  setStep('result');
                }
              }}
            >
              Genera esempio casuale per test
            </Button>
            
            <div className="text-xs text-gray-500 text-center">
              Seleziona per generare un esempio di riconoscimento materiale senza usare la fotocamera reale.
              Clicca più volte per vedere esempi diversi.
            </div>
          </div>
        )}
        
        {step === 'camera' && (
          <CameraView
            videoRef={camera.videoRef}
            isActive={camera.isActive}
            error={camera.error}
            onStart={camera.startCamera}
            onCapture={handleCapture}
            onImageUpload={handleImageUpload}
          />
        )}
        
        {step === 'analysis' && (
          <div className="space-y-4">
            <div className="bg-neutral-lightest rounded-lg overflow-hidden aspect-w-4 aspect-h-3 mb-4">
              {(uploadedImageUrl || camera.imageUrl) && (
                <img src={uploadedImageUrl || camera.imageUrl} alt="Captured material" className="object-contain" />
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-primary-light bg-opacity-10 p-3">
                <Info className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-grow">
                <p className="text-sm text-neutral-medium">
                  L'immagine è stata acquisita. Clicca su "Analizza" per identificare il materiale con l'intelligenza artificiale.
                </p>
              </div>
            </div>
            
            <div className="mb-4 rounded-md overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-blue-50 to-green-50 px-3 py-2 border-b border-gray-100 text-blue-800 font-medium text-sm">
                Seleziona modalità di analisi
              </div>
              
              <div className="p-3 space-y-3">
                <div 
                  className={`flex items-center px-3 py-3 rounded-md cursor-pointer transition-colors ${!useGoogleVision ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'}`}
                  onClick={() => setUseGoogleVision(false)}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${!useGoogleVision ? 'bg-yellow-500' : 'bg-gray-300'}`}>
                    {!useGoogleVision && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="font-medium text-gray-800">OpenAI</div>
                    <div className="text-xs text-gray-600">Migliore per analisi approfondite e descrittive</div>
                  </div>
                  <div className="w-8 h-8 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-yellow-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                    </svg>
                  </div>
                </div>
                
                <div 
                  className={`flex items-center px-3 py-3 rounded-md cursor-pointer transition-colors ${useGoogleVision ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'}`}
                  onClick={() => setUseGoogleVision(true)}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${useGoogleVision ? 'bg-blue-500' : 'bg-gray-300'}`}>
                    {useGoogleVision && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="font-medium text-gray-800">Google Vision AI</div>
                    <div className="text-xs text-gray-600">Migliore per riconoscimento oggetti fisici reali</div>
                  </div>
                  <div className="w-8 h-8 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-full w-full">
                      <path fill="#4285F4" d="M12 7V3H3v18h18v-9h-4v5H5V5h7v2z"/>
                      <path fill="#EA4335" d="M12 3v4h7v4h4V3z"/>
                      <path fill="#FBBC04" d="M12 17h7v-4h4v9h-11z"/>
                      <circle fill="#34A853" cx="17" cy="12" r="2.5"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              {useGoogleVision && (
                <div className="px-3 py-2 bg-blue-50 border-t border-blue-100 text-xs text-blue-600">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M13 9h-2V7h2v2zm0 8h-2v-6h2v6zm-1-13C6.48 4 2 8.48 2 14s4.48 10 10 10 10-4.48 10-10S17.52 4 12 4zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                    </svg>
                    Usando Google Vision AI con Client ID configurato
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                className="flex-1 border border-neutral-light text-neutral-dark"
                onClick={handleReset}
              >
                Scatta di nuovo
              </Button>
              <Button 
                className="flex-1 bg-primary text-white"
                onClick={handleAnalyze}
                disabled={camera.isLoading}
              >
                {camera.isLoading ? 'Analisi in corso...' : 'Analizza'}
              </Button>
            </div>
          </div>
        )}
        
        {step === 'result' && (camera.analysisResult || uploadedImageAnalysis) && (
          <div className="space-y-4">
            <MaterialAnalysis 
              result={uploadedImageAnalysis || camera.analysisResult!} 
              imageUrl={uploadedImageUrl || camera.imageUrl || ''}
              materialTypes={materialTypes || []}
              onReset={() => {
                setStep('camera');
                setUploadedImageAnalysis(null);
                setUploadedImageUrl(null);
                handleReset();
              }}
              onSave={handleSave}
            />
            
            <div className="mt-4 pb-4 border-t border-neutral-light pt-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-heading font-medium">Cosa vuoi fare con questo materiale?</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="py-6 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:bg-green-100"
                  onClick={handleGenerateIdeas}
                >
                  <Lightbulb className="h-6 w-6 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Genera idee di progetti</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="py-6 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:bg-blue-100"
                  onClick={() => searchExternalProjects([camera.analysisResult!.name])}
                >
                  <Search className="h-6 w-6 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Cerca progetti simili</span>
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {step === 'ideas' && (
          <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-1">
            <div className="flex justify-between items-center">
              <h3 className="font-heading font-medium text-lg">Idee di progetti suggerite</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-neutral-medium"
                onClick={() => setStep('result')}
              >
                Torna indietro
              </Button>
            </div>
            
            <Tabs defaultValue="ai-suggestions" className="w-full">
              <TabsList className="w-full grid grid-cols-3 mb-4">
                <TabsTrigger value="ai-suggestions" className="text-xs">
                  <Lightbulb className="h-4 w-4 mr-1" />
                  Suggerimenti AI
                </TabsTrigger>
                <TabsTrigger value="external-projects" className="text-xs">
                  <Globe className="h-4 w-4 mr-1" />
                  Progetti esterni
                </TabsTrigger>
                <TabsTrigger value="search" className="text-xs">
                  <Search className="h-4 w-4 mr-1" />
                  Ricerca
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="ai-suggestions" className="space-y-4">
                {isLoading ? (
                  <div className="py-8 text-center">
                    <div className="animate-pulse rounded-full bg-primary-light h-12 w-12 mx-auto mb-3 flex items-center justify-center">
                      <Lightbulb className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-neutral-medium">Generazione di idee in corso...</p>
                  </div>
                ) : projectSuggestions.length > 0 ? (
                  projectSuggestions.map((project, index) => (
                    <Card key={index} className="overflow-hidden bg-gradient-to-br from-white to-green-50 border-green-100">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base text-green-800">{project.name}</CardTitle>
                        <CardDescription className="text-sm text-green-600">
                          Difficoltà: {project.difficulty} · Tempo stimato: {project.estimatedTime} {project.timeUnit}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-neutral-dark">{project.description}</p>
                        
                        <div>
                          <h4 className="text-xs font-medium mb-1 text-neutral-medium">Materiali necessari:</h4>
                          <div className="flex flex-wrap gap-1">
                            {project.requiredMaterials.map((material, i) => (
                              <Badge key={i} variant="outline" className="bg-white">
                                {material.name} ({material.quantity} {material.unit})
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="bg-white bg-opacity-50 p-2 rounded-md">
                          <h4 className="text-xs font-medium mb-1 text-green-700">Impatto ambientale:</h4>
                          <div className="grid grid-cols-3 gap-2 text-center text-xs">
                            <div className="bg-green-100 rounded-md p-2">
                              <p className="font-medium text-green-800">{project.environmentalImpact.materialsRecycled} kg</p>
                              <p className="text-green-600">Materiali riciclati</p>
                            </div>
                            <div className="bg-green-100 rounded-md p-2">
                              <p className="font-medium text-green-800">{project.environmentalImpact.moneySaved} €</p>
                              <p className="text-green-600">Risparmio</p>
                            </div>
                            <div className="bg-green-100 rounded-md p-2">
                              <p className="font-medium text-green-800">{project.environmentalImpact.carbonFootprintReduction} kg</p>
                              <p className="text-green-600">CO₂ ridotta</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end pt-2">
                          <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
                            Crea progetto
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <div className="rounded-full bg-neutral-lightest h-12 w-12 mx-auto mb-3 flex items-center justify-center">
                      <Info className="h-6 w-6 text-neutral-medium" />
                    </div>
                    <p className="text-neutral-medium">Nessun suggerimento disponibile. Prova a generare nuove idee.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="external-projects" className="space-y-4">
                {isLoading ? (
                  <div className="py-8 text-center">
                    <div className="animate-pulse rounded-full bg-blue-100 h-12 w-12 mx-auto mb-3 flex items-center justify-center">
                      <Globe className="h-6 w-6 text-blue-500" />
                    </div>
                    <p className="text-neutral-medium">Ricerca in corso...</p>
                  </div>
                ) : externalProjects.length > 0 ? (
                  externalProjects.map((project, index) => (
                    <Card key={index} className="overflow-hidden bg-gradient-to-br from-white to-blue-50 border-blue-100">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base text-blue-800">{project.title}</CardTitle>
                            <CardDescription className="text-xs text-blue-600">
                              Fonte: {project.source}
                            </CardDescription>
                          </div>
                          <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                            Esterno
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-neutral-dark">{project.description}</p>
                        
                        <div>
                          <h4 className="text-xs font-medium mb-1 text-neutral-medium">Materiali necessari:</h4>
                          <div className="flex flex-wrap gap-1">
                            {project.materialsNeeded.map((material, i) => (
                              <Badge key={i} variant="outline" className="bg-white">
                                {material}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex justify-between pt-2">
                          <Button variant="outline" size="sm" className="border-blue-200 text-blue-700">
                            <BookOpen className="h-4 w-4 mr-1" />
                            Salva idea
                          </Button>
                          <a 
                            href={project.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-primary-foreground shadow hover:bg-blue-700 h-8 px-3 py-2"
                          >
                            Visita
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <div className="rounded-full bg-neutral-lightest h-12 w-12 mx-auto mb-3 flex items-center justify-center">
                      <Globe className="h-6 w-6 text-neutral-medium" />
                    </div>
                    <p className="text-neutral-medium">Nessun progetto esterno trovato. Prova a fare una ricerca.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="search" className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Cerca progetti (separa le parole chiave con virgole)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-grow"
                  />
                  <Button onClick={handleSearch} disabled={isLoading || !searchQuery.trim()}>
                    <Search className="h-4 w-4 mr-1" />
                    Cerca
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <div className="text-xs text-neutral-medium pr-2 py-1">Fonte:</div>
                  {['all', 'instructables', 'wikihow', 'pinterest', 'etsy'].map((source) => (
                    <Badge
                      key={source}
                      variant={externalSource === source ? 'default' : 'outline'}
                      className={externalSource === source ? 'bg-blue-600' : 'cursor-pointer'}
                      onClick={() => setExternalSource(source)}
                    >
                      {source === 'all' ? 'Tutte le fonti' : source}
                    </Badge>
                  ))}
                </div>
                
                {isLoading ? (
                  <div className="py-8 text-center">
                    <div className="animate-pulse rounded-full bg-neutral-light h-12 w-12 mx-auto mb-3 flex items-center justify-center">
                      <Search className="h-6 w-6 text-neutral-medium" />
                    </div>
                    <p className="text-neutral-medium">Ricerca in corso...</p>
                  </div>
                ) : searchQuery && externalProjects.length === 0 ? (
                  <div className="py-8 text-center">
                    <div className="rounded-full bg-neutral-lightest h-12 w-12 mx-auto mb-3 flex items-center justify-center">
                      <Info className="h-6 w-6 text-neutral-medium" />
                    </div>
                    <p className="text-neutral-medium">Nessun risultato trovato. Prova con altre parole chiave.</p>
                  </div>
                ) : null}
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        {/* Recent Materials Section */}
        {(step === 'camera' || step === 'analysis') && (
          <div className="mt-4 bg-white rounded-lg shadow-sm border border-neutral-light p-3">
            <h3 className="font-heading font-medium text-sm mb-2">Materiali recenti</h3>
            <div className="flex space-x-3 overflow-x-auto pb-2">
              <div className="flex-shrink-0 w-16 text-center">
                <div className="rounded-lg bg-neutral-lightest aspect-square flex items-center justify-center mb-1">
                  <Box className="h-8 w-8 text-neutral-medium" />
                </div>
                <span className="text-xs text-neutral-medium">Cartone</span>
              </div>
              <div className="flex-shrink-0 w-16 text-center">
                <div className="rounded-lg bg-neutral-lightest aspect-square flex items-center justify-center mb-1">
                  <div className="h-8 w-8 text-neutral-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                </div>
                <span className="text-xs text-neutral-medium">Plastica</span>
              </div>
              <div className="flex-shrink-0 w-16 text-center">
                <div className="rounded-lg bg-neutral-lightest aspect-square flex items-center justify-center mb-1">
                  <div className="h-8 w-8 text-neutral-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 3H3v18h18V3zM10 17H5V7h5v10zM19 17h-5V7h5v10z" />
                    </svg>
                  </div>
                </div>
                <span className="text-xs text-neutral-medium">Metallo</span>
              </div>
              <div className="flex-shrink-0 w-16 text-center">
                <div className="rounded-lg bg-neutral-lightest aspect-square flex items-center justify-center mb-1">
                  <div className="h-8 w-8 text-neutral-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <span className="text-xs text-neutral-medium">Vetro</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

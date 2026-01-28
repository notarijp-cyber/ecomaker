import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ModelViewer } from './ModelViewer';
import { ARButton } from './ARButton';
import { Eye, Lightbulb, ArrowRightLeft, Share2, Download } from 'lucide-react';

interface TransformStage {
  title: string;
  description: string;
  modelType: string;
  imageUrl?: string;
}

interface ARTransformPreviewProps {
  projectName: string;
  projectDescription?: string;
  beforeImage?: string;
  afterImage?: string;
  stages?: TransformStage[];
  modelType?: string; // Tipo del modello 3D (bottiglia, vaso, lampada, ecc.)
}

/**
 * Componente per visualizzare la trasformazione di un oggetto da riciclare
 * con anteprima AR del prima/dopo
 */
export function ARTransformPreview({
  projectName,
  projectDescription,
  beforeImage,
  afterImage,
  stages = [],
  modelType = 'box'
}: ARTransformPreviewProps) {
  const [activeTab, setActiveTab] = useState('before');
  
  // Se non sono definiti stadi, creiamo degli stadi predefiniti prima/dopo
  const transformStages = stages.length > 0 ? stages : [
    {
      title: 'Prima',
      description: 'Materiale originale prima della trasformazione',
      modelType: modelType,
      imageUrl: beforeImage
    },
    {
      title: 'Dopo',
      description: 'Il progetto trasformato e completato',
      modelType: modelType,
      imageUrl: afterImage
    }
  ];
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>{projectName}</CardTitle>
          <ARButton
            modelUrl=""
            buttonVariant="outline"
            buttonSize="sm"
            buttonText="Visualizza in AR"
          />
        </div>
        {projectDescription && (
          <CardDescription>{projectDescription}</CardDescription>
        )}
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6">
          <TabsList className="w-full">
            {transformStages.map((stage, index) => (
              <TabsTrigger 
                key={index} 
                value={index === 0 ? 'before' : `stage-${index}`}
                className="flex-1"
              >
                {stage.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        {transformStages.map((stage, index) => (
          <TabsContent 
            key={index} 
            value={index === 0 ? 'before' : `stage-${index}`}
            className="mt-0"
          >
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Colonna sinistra: immagine o visualizzazione anteprima */}
                <div className="bg-neutral-50 flex items-center justify-center p-4 min-h-[300px]">
                  {stage.imageUrl ? (
                    <img 
                      src={stage.imageUrl} 
                      alt={stage.title} 
                      className="max-h-[250px] object-contain"
                    />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <Lightbulb className="h-16 w-16 mx-auto mb-2 text-neutral-300" />
                      <p>Nessuna immagine disponibile</p>
                    </div>
                  )}
                </div>
                
                {/* Colonna destra: modello 3D e descrizione */}
                <div className="p-6">
                  <h3 className="font-medium text-lg mb-2">{stage.title}</h3>
                  <p className="text-muted-foreground mb-4 text-sm">{stage.description}</p>
                  
                  {/* Preview 3D */}
                  <div className="bg-background rounded-lg overflow-hidden shadow-sm mb-4">
                    <ModelViewer 
                      modelType={stage.modelType}
                      width={240}
                      height={240}
                      className="mx-auto"
                    />
                  </div>
                  
                  {/* Azioni */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Dettagli
                    </Button>
                    {index > 0 && (
                      <Button variant="outline" size="sm">
                        <ArrowRightLeft className="h-4 w-4 mr-2" />
                        Confronta
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Condividi
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
}
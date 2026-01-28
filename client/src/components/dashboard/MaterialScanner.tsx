import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCamera } from "@/hooks/use-camera";
import { useScanner } from "@/hooks/use-scanner";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

export default function MaterialScanner() {
  const queryClient = useQueryClient();
  const { cameraRef, photoData, startCamera, stopCamera, takePhoto } = useCamera();
  const { recognizedMaterial, recognizeMaterial, isRecognizing } = useScanner();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  
  // Mutation for saving material
  const saveMaterialMutation = useMutation({
    mutationFn: async (material: any) => {
      return apiRequest("POST", "/api/materials", {
        userId: 1, // In a real app, this would come from auth context
        name: material.name,
        type: material.materialType,
        quantity: 1,
        imageUrl: photoData,
        estimatedWeight: material.estimatedWeight,
        dimensions: material.dimensions
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/materials/user/1'] });
      toast({
        title: "Materiale salvato!",
        description: `${recognizedMaterial?.name} aggiunto al tuo inventario.`,
      });
      handleCloseCamera();
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: "Impossibile salvare il materiale. Riprova.",
        variant: "destructive",
      });
    }
  });
  
  const handleScanClick = async () => {
    setIsCameraOpen(true);
    await startCamera();
  };
  
  const handleCloseCamera = () => {
    setIsCameraOpen(false);
    stopCamera();
  };
  
  const handleTakePhoto = async () => {
    await takePhoto();
    await recognizeMaterial(photoData);
  };
  
  const handleSaveMaterial = () => {
    if (recognizedMaterial) {
      saveMaterialMutation.mutate(recognizedMaterial);
    }
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="font-heading font-semibold text-xl mb-4 text-neutral-800">Scansiona i Materiali</h2>
        
        <div className="flex flex-col md:flex-row gap-6">
          {!isCameraOpen ? (
            <div className="md:w-1/2 flex flex-col items-center justify-center bg-neutral-100 rounded-lg p-6">
              <span className="material-icons text-5xl text-green-500 mb-4">camera_alt</span>
              <Button 
                onClick={handleScanClick}
                className="bg-primary hover:bg-primary-dark text-white font-medium px-6 py-3 rounded-lg mb-2"
              >
                Scansiona Ora
              </Button>
              <p className="text-sm text-neutral-600 text-center">
                Usa la fotocamera per scansionare i materiali che vuoi riciclare
              </p>
            </div>
          ) : (
            <div className="md:w-1/2 flex flex-col items-center justify-center bg-neutral-100 rounded-lg p-4">
              {!photoData ? (
                <>
                  <div className="relative w-full h-64 mb-4 bg-black rounded-lg overflow-hidden">
                    <video 
                      ref={cameraRef} 
                      className="absolute inset-0 w-full h-full object-cover"
                      autoPlay 
                      playsInline
                    ></video>
                  </div>
                  <div className="flex space-x-4">
                    <Button onClick={handleTakePhoto} className="bg-primary text-white">
                      Scatta Foto
                    </Button>
                    <Button onClick={handleCloseCamera} variant="outline">
                      Annulla
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative w-full h-64 mb-4 bg-black rounded-lg overflow-hidden">
                    <img 
                      src={photoData} 
                      className="absolute inset-0 w-full h-full object-cover"
                      alt="Foto materiale" 
                    />
                  </div>
                  
                  {isRecognizing ? (
                    <div className="flex flex-col items-center justify-center w-full">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
                      <p className="text-neutral-600">Riconoscimento materiale...</p>
                    </div>
                  ) : recognizedMaterial ? (
                    <div className="w-full">
                      <div className="bg-white p-4 rounded-lg mb-4">
                        <h3 className="font-medium text-lg">{recognizedMaterial.name}</h3>
                        <p className="text-sm text-neutral-600 mb-2">
                          Tipo: {recognizedMaterial.materialType} • Peso: {recognizedMaterial.estimatedWeight}g
                        </p>
                        <p className="text-sm text-neutral-600 mb-2">
                          Dimensioni: {recognizedMaterial.dimensions}
                        </p>
                        <div className="mt-2">
                          <p className="text-xs font-medium text-green-600">Usi potenziali:</p>
                          <ul className="text-xs text-neutral-600 ml-4 list-disc">
                            {recognizedMaterial.potentialUses.slice(0, 2).map((use, index) => (
                              <li key={index}>{use}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="flex space-x-4">
                        <Button 
                          onClick={handleSaveMaterial} 
                          className="bg-primary text-white flex-1"
                          disabled={saveMaterialMutation.isPending}
                        >
                          {saveMaterialMutation.isPending ? "Salvataggio..." : "Salva Materiale"}
                        </Button>
                        <Button onClick={handleCloseCamera} variant="outline">
                          Annulla
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <p className="text-red-500 mb-4">Impossibile riconoscere il materiale. Riprova.</p>
                      <div className="flex space-x-4">
                        <Button onClick={handleTakePhoto} className="bg-primary text-white">
                          Nuova Foto
                        </Button>
                        <Button onClick={handleCloseCamera} variant="outline">
                          Annulla
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          
          <div className="md:w-1/2">
            <MaterialListPreview />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MaterialListPreview() {
  const { isLoading, data: materials } = useQuery({
    queryKey: ['/api/materials/user/1'],
  });
  
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-neutral-200 rounded w-1/3 mb-3"></div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center p-3 bg-neutral-100 rounded-lg">
              <div className="w-12 h-12 bg-neutral-200 rounded-lg"></div>
              <div className="ml-3 flex-1">
                <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
              </div>
              <div className="w-5 h-5 bg-neutral-200 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <h3 className="font-medium text-neutral-800 mb-3">Materiali Recenti</h3>
      
      <div className="space-y-3">
        {materials && materials.slice(0, 3).map((material) => (
          <div key={material.id} className="flex items-center p-3 bg-neutral-100 rounded-lg">
            {material.imageUrl ? (
              <img 
                src={material.imageUrl} 
                alt={material.name} 
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-neutral-200 flex items-center justify-center">
                <span className="material-icons text-neutral-400">image</span>
              </div>
            )}
            <div className="ml-3 flex-1">
              <p className="font-medium text-neutral-800">{material.name}</p>
              <p className="text-sm text-neutral-600">
                {material.type.charAt(0).toUpperCase() + material.type.slice(1)} • {material.dimensions}
              </p>
            </div>
            <span className="material-icons text-neutral-500">chevron_right</span>
          </div>
        ))}
      </div>
      
      <Link href="/materials" className="block text-center text-primary font-medium mt-4 hover:underline">
        Vedi tutto l'inventario
      </Link>
    </>
  );
}

import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

import React, { useEffect, useState } from "react";
import { Camera, Image, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isActive: boolean;
  error: string | null;
  onStart: () => Promise<boolean>;
  onCapture: () => Promise<string | null>;
  onImageUpload?: (base64: string) => void;
}

export function CameraView({ videoRef, isActive, error, onStart, onCapture, onImageUpload }: CameraViewProps) {
  const [uploadingImage, setUploadingImage] = useState(false);
  
  useEffect(() => {
    // Start camera when component mounts
    if (!isActive) {
      onStart();
    }
    
    // Clean up when component unmounts
    return () => {
      // Camera cleanup is handled in the hook
    };
  }, [isActive, onStart]);
  
  // Funzione per gestire l'upload di immagini dalla galleria
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setUploadingImage(true);
    
    const file = files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      if (onImageUpload && base64) {
        onImageUpload(base64);
      }
      setUploadingImage(false);
    };
    
    reader.onerror = () => {
      setUploadingImage(false);
      console.error('Errore durante la lettura del file');
    };
    
    reader.readAsDataURL(file);
  };
  
  return (
    <div className="space-y-4">
      <div className="bg-neutral-lightest rounded-lg overflow-hidden aspect-video mb-4">
        <div className="p-2 flex items-center justify-center h-full">
          {error ? (
            <Alert className="bg-error/10 text-error border-error">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900/90 rounded relative">
              {isActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <Camera className="h-16 w-16 text-white opacity-70" />
                  <p className="text-white mt-4">Accesso alla fotocamera in corso...</p>
                  <p className="text-white mt-2 text-sm max-w-xs text-center">La fotocamera potrebbe non funzionare in questo ambiente. Per favore, usa la funzione "Carica immagine" per testare.</p>
                </>
              )}
              
              {/* Scanner target elements - Mirino migliorato */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-64 h-64 border-2 border-white/30 rounded-lg flex items-center justify-center">
                  <div className="absolute top-0 left-0 h-8 w-8 border-t-2 border-l-2 border-white"></div>
                  <div className="absolute top-0 right-0 h-8 w-8 border-t-2 border-r-2 border-white"></div>
                  <div className="absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-white"></div>
                  <div className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-white"></div>
                  <div className="animate-ping absolute w-16 h-16 border-2 border-primary/50 rounded-full"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-3 bg-primary/5 p-3 rounded-lg border border-primary/10">
        <div className="rounded-full bg-primary/10 p-3">
          <Camera className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-grow">
          <p className="text-sm text-neutral-700 dark:text-neutral-300">
            Posiziona l'oggetto al centro dello schermo e scatta una foto. L'AI identificherà automaticamente il materiale.
          </p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex space-x-3">
          <div className="relative flex-1">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploadingImage}
            />
            <Button 
              variant="outline" 
              className="w-full bg-white border border-neutral-light text-neutral-dark"
              onClick={() => document.getElementById('file-upload')?.click()}
              disabled={uploadingImage}
            >
              <UploadCloud className="h-5 w-5 mr-2" />
              {uploadingImage ? 'Caricamento...' : 'Carica immagine'}
            </Button>
          </div>
          <Button 
            className="flex-1 bg-primary text-white"
            onClick={onCapture}
            disabled={!isActive || uploadingImage}
          >
            <Camera className="h-5 w-5 mr-2" />
            Scatta foto
          </Button>
        </div>
        
        {/* Pulsante per test in ambiente Replit */}
        <Button 
          variant="secondary" 
          className="w-full bg-amber-50 border border-amber-200 text-amber-700"
          onClick={() => {
            if (onImageUpload) {
              // Base64 immagine di bottiglia (solo una porzione iniziale)
              const demoImage = "data:image/jpeg;base64,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";
              onImageUpload(demoImage);
            }
          }}
        >
          Genera esempio per test
        </Button>
      </div>
    </div>
  );
}

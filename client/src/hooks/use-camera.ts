import { useState, useEffect, useRef } from 'react';
import { MaterialAnalysisResult } from '@/lib/types';

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  isActive: boolean;
  hasPermission: boolean;
  permissionDenied: boolean;
  isLoading: boolean;
  error: string | null;
  imageUrl: string | null;
  analysisResult: MaterialAnalysisResult | null;
  startCamera: () => Promise<boolean>;
  stopCamera: () => void;
  captureImage: () => Promise<string | null>;
  analyzeImage: (useGoogleVision?: boolean) => Promise<MaterialAnalysisResult | null>;
  resetImage: () => void;
}

/**
 * Hook per gestire l'accesso alla fotocamera, cattura e analisi delle immagini
 */
export function useCamera(): UseCameraReturn {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<MaterialAnalysisResult | null>(null);

  // Cleanup la camera quando il componente viene smontato
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach(track => track.stop());
        streamRef.current = null;
        setIsActive(false);
      }
    };
  }, []);

  // Reset dell'analisi e dell'immagine
  const resetImage = () => {
    setImageUrl(null);
    setAnalysisResult(null);
    setError(null);
  };

  // Inizializza la fotocamera
  const startCamera = async (): Promise<boolean> => {
    if (isActive && streamRef.current) {
      return true; // Camera già attiva
    }
    
    resetImage();
    setError(null);
    
    try {
      // Richiedi accesso alla fotocamera
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });

      // Assegna lo stream al video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      streamRef.current = stream;
      setIsActive(true);
      setHasPermission(true);
      setPermissionDenied(false);
      
      return true;
    } catch (error: any) {
      console.error('Errore durante l\'accesso alla fotocamera:', error);
      
      // Gestisci il caso in cui l'utente ha negato l'accesso
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setPermissionDenied(true);
        setError('Permesso negato per l\'accesso alla fotocamera');
      } else {
        setError(`Errore fotocamera: ${error.message}`);
      }
      
      setIsActive(false);
      setHasPermission(false);
      
      return false;
    }
  };

  // Ferma la fotocamera
  const stopCamera = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsActive(false);
  };

  // Cattura un'immagine dalla fotocamera
  const captureImage = async (): Promise<string | null> => {
    setError(null);
    
    if (!isActive || !videoRef.current) {
      setError('La fotocamera non è attiva');
      return null;
    }
    
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setError('Impossibile creare il contesto canvas');
        return null;
      }
      
      // Disegna il frame corrente del video sul canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Converti il canvas in una stringa base64
      const dataUrl = canvas.toDataURL('image/jpeg');
      setImageUrl(dataUrl);
      
      // Ferma la fotocamera dopo aver catturato l'immagine
      stopCamera();
      
      return dataUrl;
    } catch (error: any) {
      console.error('Errore durante la cattura dell\'immagine:', error);
      setError(`Errore durante la cattura: ${error.message}`);
      return null;
    }
  };

  // Analizza l'immagine catturata per identificare il materiale
  const analyzeImage = async (useGoogleVision: boolean = false): Promise<MaterialAnalysisResult | null> => {
    if (!imageUrl) {
      setError('Nessuna immagine da analizzare');
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    
    // Log per capire quale servizio stiamo usando
    console.log(`Analisi materiale utilizzando ${useGoogleVision ? 'Google Vision API' : 'OpenAI'}`);
    
    try {
      // Estrai solo la parte base64 dell'URL (rimuovi 'data:image/jpeg;base64,')
      const base64Image = imageUrl.split(',')[1];
      
      // Scegliamo un approccio unificato utilizzando sempre l'endpoint /api/ai/analyze-material
      // che è configurato per gestire entrambe le opzioni
      const endpoint = '/api/ai/analyze-material';
      
      console.log(`Invio richiesta a ${endpoint} con useGoogleVision=${useGoogleVision}`);
      
      // Invia l'immagine al backend per l'analisi
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          imageBase64: imageUrl, // Invia l'immagine completa con intestazione
          useGoogleVision 
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Errore nella risposta del server:', response.status, errorText);
        throw new Error(`Errore nella risposta del server: ${response.status}. ${errorText}`);
      }
      
      const result = await response.json();
      setAnalysisResult(result);
      setIsLoading(false);
      return result;
    } catch (error: any) {
      console.error('Errore durante l\'analisi dell\'immagine:', error);
      setError(`Errore durante l'analisi: ${error.message}`);
      setIsLoading(false);
      return null;
    }
  };

  return {
    videoRef,
    isActive,
    hasPermission,
    permissionDenied,
    isLoading,
    error,
    imageUrl,
    analysisResult,
    startCamera,
    stopCamera,
    captureImage,
    analyzeImage,
    resetImage
  };
}
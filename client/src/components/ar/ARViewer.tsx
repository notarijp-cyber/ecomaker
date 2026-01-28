import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useCamera } from '@/hooks/use-camera';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, RefreshCw, X } from 'lucide-react';

// Importiamo la libreria aframe globalmente perché richiede caricamento in pagina
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'a-scene': any;
      'a-entity': any;
      'a-camera': any;
      'a-box': any;
      'a-sphere': any;
      'a-cylinder': any;
      'a-plane': any;
      'a-marker': any;
      'a-marker-camera': any;
      'a-assets': any;
      'a-asset-item': any;
    }
  }
}

interface ARViewerProps {
  projectId?: number;
  materialId?: number;
  modelUrl?: string; // URL del modello 3D se disponibile
  placeholderImage?: string; // Immagine placeholder per il progetto
  onClose: () => void;
  isVisible: boolean;
}

/**
 * Componente per la visualizzazione AR dei progetti di upcycling
 */
export function ARViewer({
  projectId,
  materialId,
  modelUrl,
  placeholderImage,
  onClose,
  isVisible
}: ARViewerProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const { startCamera, stopCamera, videoRef, isActive, captureImage } = useCamera();
  const [arInitialized, setArInitialized] = useState(false);
  const [arMode, setArMode] = useState<'marker' | 'markerless'>('marker');
  
  // Riferimento alla scena AR
  const aframeSceneRef = useRef<any>(null);
  
  // Posizione del modello 3D (per modalità markerless)
  const [modelPosition, setModelPosition] = useState({ x: 0, y: 0, z: -1 });
  
  // Gestione dell'inizializzazione AR
  useEffect(() => {
    // Importiamo Aframe solo quando il componente è montato
    if (isVisible) {
      const loadAframe = async () => {
        // Se aframe non è già caricato, lo importiamo
        if (typeof window !== 'undefined' && !window.AFRAME) {
          await import('aframe');
          console.log('Aframe loaded');
        }
        
        await startCamera();
        setArInitialized(true);
      };

      loadAframe();
    }
    
    return () => {
      // Quando il componente viene smontato, fermiamo la camera
      if (isActive) {
        stopCamera();
      }
    };
  }, [isVisible, isActive]);
  
  // Funzione per cambiare modalità AR
  const toggleArMode = () => {
    setArMode(prev => prev === 'marker' ? 'markerless' : 'marker');
  };

  // Determina il modello 3D da visualizzare in base al tipo di progetto
  const getModelEntity = () => {
    // Se è disponibile un URL del modello, lo utilizziamo
    if (modelUrl) {
      return (
        <a-entity 
          position={`${modelPosition.x} ${modelPosition.y} ${modelPosition.z}`} 
          scale="0.1 0.1 0.1"
          gltf-model={modelUrl}
        />
      );
    }
    
    // Altrimenti creiamo un modello basato sul tipo di progetto/materiale
    // Qui sono solo esempi, andrebbero personalizzati per ogni tipo di progetto
    return (
      <>
        {materialId === 1 && (
          // Modello per "Bottiglie di plastica"
          <a-cylinder 
            position={`${modelPosition.x} ${modelPosition.y} ${modelPosition.z}`}
            radius="0.5" 
            height="1.5" 
            color="#8bc5cc"
            opacity="0.8"
          />
        )}
        {materialId === 2 && (
          // Modello per "Carta e cartone"
          <a-box 
            position={`${modelPosition.x} ${modelPosition.y} ${modelPosition.z}`}
            width="1.2" 
            height="0.1" 
            depth="1.2" 
            color="#e8c291"
          />
        )}
        {materialId === 3 && (
          // Modello per "Lattine di alluminio"
          <a-cylinder 
            position={`${modelPosition.x} ${modelPosition.y} ${modelPosition.z}`}
            radius="0.3" 
            height="1.0" 
            color="#cccccc"
            metalness="1"
          />
        )}
        {(!materialId && !projectId) && (
          // Modello generico di default
          <a-box 
            position={`${modelPosition.x} ${modelPosition.y} ${modelPosition.z}`}
            width="1" 
            height="1" 
            depth="1" 
            color="#4CC3D9"
          />
        )}
      </>
    );
  };

  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl overflow-hidden relative">
        <Button 
          className="absolute top-2 right-2 z-10" 
          size="icon" 
          variant="ghost" 
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
        
        <CardContent className="p-0">
          <div className="aspect-video w-full relative" ref={sceneRef}>
            {!arInitialized ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <RefreshCw className="h-10 w-10 text-primary animate-spin" />
                  <p className="mt-4 text-center text-muted-foreground">
                    Inizializzazione della modalità AR...
                    <br />
                    <span className="text-sm">Assicurati di consentire l'accesso alla fotocamera</span>
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ width: '100%', height: '100%' }}>
                <a-scene
                  ref={aframeSceneRef}
                  embedded
                  arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: false;"
                  renderer="antialias: true; alpha: true"
                  style={{ width: '100%', height: '100%' }}
                >
                  {arMode === 'marker' ? (
                    // Modalità con marker
                    <a-marker preset="hiro">
                      {getModelEntity()}
                    </a-marker>
                  ) : (
                    // Modalità libera (markerless)
                    <a-entity camera>
                      {getModelEntity()}
                    </a-entity>
                  )}
                  <a-entity camera></a-entity>
                </a-scene>
              </div>
            )}
          </div>
          
          <div className="p-4 bg-card text-card-foreground">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Anteprima in Realtà Aumentata</h3>
                <p className="text-sm text-muted-foreground">
                  {arMode === 'marker' 
                    ? 'Inquadra il marker Hiro per visualizzare il modello 3D' 
                    : 'Il modello 3D apparirà davanti a te'}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={toggleArMode}>
                  {arMode === 'marker' ? 'Modalità libera' : 'Usa marker'}
                </Button>
                <Button variant="default" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Scatta foto
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
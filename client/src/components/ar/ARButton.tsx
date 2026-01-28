import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Box, Eye } from 'lucide-react';
import { ARViewer } from './ARViewer';

interface ARButtonProps {
  materialId?: number;
  projectId?: number;
  modelUrl?: string;
  buttonText?: string;
  buttonVariant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary';
  buttonSize?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

/**
 * Componente pulsante per attivare la visualizzazione AR
 */
export function ARButton({
  materialId,
  projectId,
  modelUrl,
  buttonText = 'Visualizza in AR',
  buttonVariant = 'default',
  buttonSize = 'default',
  className = ''
}: ARButtonProps) {
  const [isARActive, setIsARActive] = useState(false);
  
  const activateAR = () => {
    setIsARActive(true);
  };
  
  const closeAR = () => {
    setIsARActive(false);
  };
  
  return (
    <>
      <Button
        variant={buttonVariant}
        size={buttonSize}
        className={className}
        onClick={activateAR}
      >
        <Eye className="h-4 w-4 mr-2" />
        {buttonText}
      </Button>
      
      {/* AR Viewer Modal */}
      <ARViewer
        materialId={materialId}
        projectId={projectId}
        modelUrl={modelUrl}
        isVisible={isARActive}
        onClose={closeAR}
      />
    </>
  );
}
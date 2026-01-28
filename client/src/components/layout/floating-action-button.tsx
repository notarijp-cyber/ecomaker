import React, { useState } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MaterialScanner } from "@/components/scanning/material-scanner";

export function FloatingActionButton() {
  const [showScanner, setShowScanner] = useState(false);
  
  return (
    <>
      <div className="fixed right-6 bottom-6 z-20">
        <Button 
          className="rounded-full w-14 h-14 bg-primary text-white shadow-lg flex items-center justify-center"
          onClick={() => setShowScanner(true)}
        >
          <Camera className="h-6 w-6" />
        </Button>
      </div>
      
      {showScanner && (
        <MaterialScanner onClose={() => setShowScanner(false)} />
      )}
    </>
  );
}

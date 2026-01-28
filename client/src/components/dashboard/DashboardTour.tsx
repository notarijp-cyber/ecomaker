import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface TourProps {
  onClose: () => void;
}

export function DashboardTour({ onClose }: TourProps) {
  const [step, setStep] = useState(1);

  const handleFinishTour = async () => {
    if (auth.currentUser) {
      // Segna nel DB che anche il tour è finito
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        tourCompleted: true
      });
    }
    onClose();
  };

  // Definisci i passaggi del tour
  const getStepContent = () => {
    switch (step) {
      case 1:
        return {
          title: "I tuoi Indicatori",
          text: "Qui vedi il tuo livello, i crediti Quantum e la CO2 risparmiata. Tienili d'occhio!",
          style: "top-[180px] left-[20px] md:left-[50px]", 
        };
      case 2:
        return {
          title: "Lo Scanner AI",
          text: "Il cuore del gioco. Usa questo pulsante per analizzare rifiuti e ottenere progetti.",
          style: "bottom-[150px] left-[50%] -translate-x-1/2", 
        };
      case 3:
        return {
          title: "Il Profilo",
          text: "Qui trovi il tuo Avatar e le impostazioni. Personalizzalo per salire di rango.",
          style: "bottom-[150px] left-[20px]", 
        };
      default:
        return null;
    }
  };

  const content = getStepContent();
  if (!content) return null;

  return (
    <div className="fixed inset-0 z-[50] pointer-events-none">
      {/* Overlay scuro (Clicca per saltare se vuoi, oppure blocca tutto) */}
      <div className="absolute inset-0 bg-black/70 pointer-events-auto" onClick={handleFinishTour}></div>

      {/* TOOLTIP */}
      <div className={`absolute pointer-events-auto bg-white text-black p-6 rounded-xl max-w-xs shadow-2xl animate-in fade-in zoom-in duration-300 ${content.style}`}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-purple-600">{content.title}</h3>
          <span className="text-xs bg-slate-200 px-2 py-1 rounded-full font-mono">{step}/3</span>
        </div>
        <p className="text-sm text-slate-600 mb-4">{content.text}</p>
        
        <div className="flex justify-between">
           <Button variant="ghost" size="sm" onClick={handleFinishTour} className="text-slate-400 hover:text-red-500">Salta</Button>
           <Button size="sm" onClick={() => step < 3 ? setStep(step + 1) : handleFinishTour()} className="bg-purple-600 text-white hover:bg-purple-700">
             {step < 3 ? "Avanti" : "Finito!"} <ArrowRight className="w-3 h-3 ml-2" />
           </Button>
        </div>
        
        {/* Freccia indicatrice */}
        <div className="absolute w-4 h-4 bg-white transform rotate-45 -bottom-2 left-1/2 -translate-x-1/2"></div>
      </div>
    </div>
  );
}
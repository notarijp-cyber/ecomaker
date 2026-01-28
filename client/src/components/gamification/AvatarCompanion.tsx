import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, MessageCircle, AlertCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// MOCK DATA - In futuro arriveranno dal DB utente
const USER_AVATAR = {
  type: "EchoBot", // o "GreenGuardian", "TrashTitan"
  level: 1,
  name: "EcoTester_Bot",
  materialsEaten: 0,
  xp: 350,
  nextLevelXp: 1000
};

export function AvatarCompanion() {
  const [location] = useLocation();
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const [message, setMessage] = useState<string | null>("Ciao! Sono pronto a lavorare.");
  const [mode, setMode] = useState<"hero" | "companion">("hero");

  // Logica: Se siamo in Dashboard è "Hero" (Grande), altrimenti "Companion" (Piccolo)
  useEffect(() => {
    if (location === "/" || location === "/dashboard") {
      setMode("hero");
      setMessage("Bentornato nel Quantum Hub! 🚀");
    } else {
      setMode("companion");
      setMessage(null); // Silenzioso nelle altre pagine a meno che non ci siano notifiche
    }
  }, [location]);

  // Gestione Click sull'Avatar
  const handleAvatarClick = () => {
    if (mode === "companion") {
        // Torna alla dashboard o mostra menu rapido
        window.location.href = '/dashboard';
    } else {
        // Animazione "Mangia" o Interazione Dashboard
        runEatAnimation();
    }
  };

  const runEatAnimation = () => {
      setMessage("Analisi materiali in corso... 🦴");
      setTimeout(() => {
          setMessage("Ho fame! Scansiona rifiuti per farmi evolvere!");
          toast({ title: "Avatar Status", description: "EcoBot ha bisogno di 300g di plastica per salire al Livello 2." });
      }, 2000);
  };

  // Render dell'Avatar (Grafica pura SVG/CSS)
  const renderAvatarGraphic = () => (
    <div className={`relative transition-all duration-500 ${mode === 'hero' ? 'w-32 h-32 md:w-48 md:h-48' : 'w-16 h-16'}`}>
       {/* Aura Energetica */}
       <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl animate-pulse"></div>
       
       {/* CORPO AVATAR (Semplificato per ora, poi metteremo le immagini dei 3 personaggi) */}
       <div className={`w-full h-full rounded-full border-4 flex items-center justify-center bg-[#0f111a] relative overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.4)]
            ${USER_AVATAR.type === 'EchoBot' ? 'border-cyan-500' : 'border-green-500'}`}>
            
            {/* Faccia/Occhi */}
            <div className="flex gap-4">
                <div className={`bg-cyan-400 rounded-full animate-bounce ${mode === 'hero' ? 'w-6 h-6' : 'w-3 h-3'}`} style={{ animationDelay: '0s' }}></div>
                <div className={`bg-cyan-400 rounded-full animate-bounce ${mode === 'hero' ? 'w-6 h-6' : 'w-3 h-3'}`} style={{ animationDelay: '0.2s' }}></div>
            </div>
            
            {/* Bocca (cambia con hover) */}
            <div className={`absolute bottom-1/4 w-1/3 h-1 bg-cyan-500/50 rounded-full transition-all ${isHovered ? 'h-4 rounded-b-xl' : ''}`}></div>
       </div>

       {/* Livello Badge */}
       <div className="absolute -bottom-2 -right-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full border border-purple-400 shadow-lg">
          Lvl.{USER_AVATAR.level}
       </div>
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div 
        layout
        className={`fixed z-50 flex items-end gap-4 transition-all duration-500
            ${mode === 'hero' 
                ? 'top-24 left-1/2 -translate-x-1/2 flex-col items-center' // Posizione Hero (Dashboard)
                : 'bottom-6 right-6 flex-row-reverse' // Posizione Companion (Angolo basso dx)
            }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleAvatarClick}
      >
        
        {/* AVATAR GRAFICO */}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="cursor-pointer">
            {renderAvatarGraphic()}
        </motion.div>

        {/* FUMETTO MESSAGGI */}
        {(message || isHovered) && (
            <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`bg-white/10 backdrop-blur-md border border-cyan-500/30 p-4 rounded-2xl text-white shadow-xl max-w-xs
                    ${mode === 'hero' ? 'text-center' : 'text-right'}`}
            >
                <p className="text-sm font-medium">{message || "Sono qui se serve!"}</p>
                {mode === 'hero' && (
                    <div className="mt-2 flex justify-center gap-2">
                         <Button size="sm" variant="outline" className="h-6 text-xs bg-cyan-500/10 border-cyan-500/50 hover:bg-cyan-500/20 text-cyan-300">
                            <Package className="w-3 h-3 mr-1"/> Dammi Materiali
                         </Button>
                    </div>
                )}
            </motion.div>
        )}

      </motion.div>
    </AnimatePresence>
  );
}
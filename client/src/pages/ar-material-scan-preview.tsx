import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Camera, Play, Square, Loader2, Cpu, Save, CheckCircle } from 'lucide-react';
import { useLocation } from "wouter";
import { onAuthStateChanged } from "firebase/auth";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { auth, db, storage } from "@/lib/firebase";
import { doc, updateDoc, increment, addDoc, collection } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { useToast } from "@/hooks/use-toast";
import BotCommandCenter from "@/pages/bot-command-center";

export default function ARMaterialScanPreview() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isBot, setIsBot] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
        setUser(u);
        setIsBot(u?.email === "ecomakerteamtest@gmail.com");
        setIsCheckingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  // --- LOGICA UMANA ---
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [lastPrediction, setLastPrediction] = useState<string>("");
  const [detectedItem, setDetectedItem] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // --- FIX QUI SOTTO: SINTASSI CATCH CORRETTA ---
  useEffect(() => {
    if (!isBot) {
        const loadModel = async () => {
            try {
                await tf.ready();
                const loadedModel = await mobilenet.load();
                setModel(loadedModel);
                setIsModelLoading(false);
            } catch (err) {
                console.error("Errore caricamento modello:", err);
            }
        };
        loadModel();
    }
  }, [isBot]);

  if (isCheckingAuth) return <div className="h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-cyan-500" /></div>;
  if (isBot) return <BotCommandCenter />;

  const startCamera = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
    } catch (e) {
        toast({ title: "Errore Camera", variant: "destructive" });
    }
  };

  const captureImage = () => {
      if (!videoRef.current || !canvasRef.current) return null;
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context?.drawImage(videoRef.current, 0, 0);
      return canvasRef.current.toDataURL('image/jpeg', 0.7);
  };

  const saveToInventory = async () => {
      if (!user || !detectedItem) return;
      setIsSaving(true);
      toast({ title: "Salvataggio...", description: "Caricamento in corso." });

      try {
          const imageDataUrl = captureImage();
          if (!imageDataUrl) throw new Error("Errore immagine");

          // Storage Path Sicuro
          const filename = `${Date.now()}_${detectedItem.type}.jpg`;
          // Nota: Assicurati che 'storage' sia esportato correttamente da firebase.ts
          // Se dà errore su 'storage', controlla l'import.
          const imageRef = ref(storage, `user_inventory/${user.uid}/${filename}`);
          
          await uploadString(imageRef, imageDataUrl, 'data_url');
          const downloadURL = await getDownloadURL(imageRef);

          await addDoc(collection(db, "users", user.uid, "inventory"), {
              name: detectedItem.name,
              type: detectedItem.type,
              quantity: 1,
              imageUrl: downloadURL,
              scannedAt: new Date(),
              confidence: detectedItem.confidence,
              status: "active"
          });

          await updateDoc(doc(db, "users", user.uid), { scannedItems: increment(1) });

          toast({ title: "Salvato!", className: "bg-green-600 text-white" });
          setDetectedItem(null);
          stopARScan();

      } catch (error) {
          console.error(error);
          toast({ title: "Errore Salvataggio", variant: "destructive" });
      } finally {
          setIsSaving(false);
      }
  };

  const startARScan = async () => {
    if (!model || !videoRef.current) return;
    setIsScanning(true); setScanProgress(0); setDetectedItem(null); startCamera(); 
    
    scanIntervalRef.current = setInterval(async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        const predictions = await model.classify(videoRef.current);
        if (predictions?.length > 0) {
          const best = predictions[0];
          setLastPrediction(`${best.className} (${Math.round(best.probability * 100)}%)`);
          setScanProgress(p => (p >= 100 ? 0 : p + 25));
          
          if (best.probability > 0.65 && !detectedItem) {
            const p_name = best.className.toLowerCase();
            let type = "altro"; let name = best.className;
            
            if (p_name.includes("bottle") || p_name.includes("plastic")) { type = "plastica"; name = "Bottiglia/Plastica"; }
            else if (p_name.includes("can") || p_name.includes("metal")) { type = "metallo"; name = "Lattina/Metallo"; }
            else if (p_name.includes("box") || p_name.includes("cardboard")) { type = "cartone"; name = "Scatola Cartone"; }
            
            setDetectedItem({ name, type, confidence: best.probability });
          }
        }
      }
    }, 1000);
  };

  const stopARScan = () => {
    setIsScanning(false); setScanProgress(0); setLastPrediction("");
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    if (videoRef.current && videoRef.current.srcObject) (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
  };
  
  useEffect(() => { return () => { if (scanIntervalRef.current) clearInterval(scanIntervalRef.current); }; }, []);

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8 min-h-screen futuristic-bg bg-[#0f111a] text-white">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">AR Material Scan</h1>
        <p className="text-xl text-gray-300 flex items-center justify-center gap-2">
          {isModelLoading ? <Loader2 className="animate-spin w-4 h-4"/> : <Cpu className="w-4 h-4 text-green-400"/>}
          {isModelLoading ? "Inizializzazione AI..." : "Sistema Pronto"}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-morph border-cyan-500/30 bg-[#1a1d2d]/80 md:col-span-2 relative overflow-hidden h-[400px] rounded-xl">
           <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
           <canvas ref={canvasRef} className="hidden" />
           
           {isScanning && !detectedItem && (
             <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 bg-black/30">
                 <p className="text-cyan-400 font-mono animate-pulse">{lastPrediction || "Ricerca in corso..."}</p>
                 <Progress value={scanProgress} className="w-1/2 h-2 mt-2 bg-black/50" />
             </div>
           )}

           {detectedItem && (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm animate-in zoom-in">
                 <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                 <h2 className="text-2xl font-bold text-white">{detectedItem.name}</h2>
                 <p className="text-green-400 mb-6">Confidenza: {Math.round(detectedItem.confidence * 100)}%</p>
                 <div className="flex gap-4">
                     <Button variant="outline" onClick={() => setDetectedItem(null)} className="border-red-500 text-red-400">Ignora</Button>
                     <Button onClick={saveToInventory} disabled={isSaving} className="bg-green-600 hover:bg-green-700 font-bold">
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <Save className="w-4 h-4 mr-2"/>}
                        {isSaving ? 'Salvataggio...' : 'Salva'}
                     </Button>
                 </div>
             </div>
           )}
           
           {!isScanning && !detectedItem && <div className="absolute inset-0 flex items-center justify-center bg-black/80"><Camera className="w-16 h-16 text-slate-600"/></div>}
        </Card>

        <Card className="glass-morph border-blue-500/30 bg-[#1a1d2d]/80 h-fit">
            <CardHeader><CardTitle>Controlli</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-slate-400 mb-4">
                    Punta la camera verso un oggetto per analizzarlo e salvarlo nel tuo inventario.
                </p>
                {!isScanning ? (
                    <Button onClick={startARScan} disabled={isModelLoading} className="w-full bg-cyan-600 hover:bg-cyan-700">
                        <Play className="w-4 h-4 mr-2"/> Avvia Scansione
                    </Button>
                ) : (
                    <Button onClick={stopARScan} variant="destructive" className="w-full">
                        <Square className="w-4 h-4 mr-2"/> Stop
                    </Button>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
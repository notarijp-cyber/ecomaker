import React, { useState, useEffect } from "react";
import { 
  Sprout, Flower, Zap, ArrowRight, Check, MapPin 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface OnboardingProps {
  onComplete: () => void; 
}

export function OnboardingWizard({ onComplete }: OnboardingProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Dati Utente
  const [bio, setBio] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [age, setAge] = useState("");
  const [avatar, setAvatar] = useState<"sprout" | "flower" | "cactus">("sprout");

  // GEOLOCALIZZAZIONE AVANZATA
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [isSearchingLoc, setIsSearchingLoc] = useState(false);

  // Cerca indirizzi quando scrivi più di 3 caratteri
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (locationQuery.length > 2 && !selectedLocation) {
        setIsSearchingLoc(true);
        try {
          // Usa OpenStreetMap (Gratis e senza API Key per sviluppo)
          const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${locationQuery}&addressdetails=1&limit=5`);
          const data = await response.json();
          setLocationResults(data);
        } catch (error) {
          console.error("Errore ricerca mappe", error);
        } finally {
          setIsSearchingLoc(false);
        }
      } else if (locationQuery.length <= 2) {
        setLocationResults([]);
      }
    }, 500); // Aspetta 500ms che l'utente finisca di scrivere

    return () => clearTimeout(delayDebounceFn);
  }, [locationQuery, selectedLocation]);

  const handleSelectLocation = (place: any) => {
    // Salviamo l'oggetto completo (nome, lat, lon)
    setSelectedLocation({
      displayName: place.display_name,
      city: place.address.city || place.address.town || place.address.village || "Sconosciuto",
      lat: place.lat,
      lon: place.lon
    });
    setLocationQuery(place.display_name); // Mostra il nome completo nell'input
    setLocationResults([]); // Nascondi risultati
  };

  const handleFinish = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      
      // PREPARIAMO I DATI DA SALVARE
      await updateDoc(userRef, {
        bio, 
        hobbies, 
        age, 
        location: selectedLocation, // <--- SALVA OGGETTO COMPLETO CON COORDINATE
        avatarType: avatar,
        tutorialCompleted: true, // Sblocca il Wizard
        tourCompleted: false,    // Resetta il tour per farlo partire
        level: 1 
      });

      toast({ title: "Profilo Creato!", description: "Coordinate salvate nel database." });
      onComplete(); // Chiama la dashboard per far partire il tour
    } catch (error) {
      console.error(error);
      toast({ title: "Errore", description: "Riprova a salvare.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#0f111a]/95 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-[#1a1d2d] border border-cyan-500/30 rounded-3xl p-8 shadow-2xl relative overflow-visible animate-in zoom-in duration-300">
        
        {/* Step Indicators */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${s <= step ? 'bg-cyan-500' : 'bg-slate-700'}`}></div>
          ))}
        </div>

        {/* STEP 1: DATI PERSONALI & MAPPA */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white">Chi sei, Maker?</h2>
              <p className="text-slate-400">Inserisci la tua base operativa per trovare missioni vicine.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="text-xs text-cyan-400 uppercase font-bold mb-2 block">La tua Età</label>
                  <Input 
                    type="number" placeholder="Es: 25" 
                    className="bg-black/30 border-slate-600 text-white"
                    value={age} onChange={(e) => setAge(e.target.value)}
                  />
               </div>
               
               {/* RICERCA GEOLOCALIZZATA */}
               <div className="relative">
                  <label className="text-xs text-cyan-400 uppercase font-bold mb-2 block flex justify-between">
                    <span>Città / Indirizzo</span>
                    {isSearchingLoc && <Loader2 className="w-3 h-3 animate-spin"/>}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input 
                      placeholder="Scrivi le prime 3 lettere..." 
                      className="pl-10 bg-black/30 border-slate-600 text-white focus:border-cyan-500"
                      value={locationQuery} 
                      onChange={(e) => {
                        setLocationQuery(e.target.value);
                        setSelectedLocation(null); // Resetta se l'utente cambia testo
                      }}
                    />
                  </div>

                  {/* LISTA RISULTATI MAPPA */}
                  {locationResults.length > 0 && !selectedLocation && (
                    <div className="absolute top-full left-0 right-0 bg-slate-800 border border-slate-600 rounded-md mt-1 z-50 max-h-60 overflow-y-auto shadow-2xl">
                      {locationResults.map((place: any, index: number) => (
                        <div 
                          key={index} 
                          onClick={() => handleSelectLocation(place)} 
                          className="p-3 hover:bg-cyan-500/20 cursor-pointer text-sm text-white border-b border-slate-700 last:border-0 flex items-start gap-2"
                        >
                          <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{place.display_name}</span>
                        </div>
                      ))}
                    </div>
                  )}
               </div>
            </div>

            <div>
              <label className="text-xs text-cyan-400 uppercase font-bold mb-2 block">Hobby</label>
              <Input 
                placeholder="Cinema, Sport, Tech..." 
                className="bg-black/30 border-slate-600 text-white"
                value={hobbies} onChange={(e) => setHobbies(e.target.value)}
              />
            </div>

            <div>
               <label className="text-xs text-cyan-400 uppercase font-bold mb-2 block">Bio</label>
               <Textarea 
                 placeholder="Raccontaci di te..." 
                 className="bg-black/30 border-slate-600 text-white"
                 value={bio} onChange={(e) => setBio(e.target.value)}
               />
            </div>

            <Button onClick={() => setStep(2)} disabled={!age || !selectedLocation} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-6 mt-2">
              Continua <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            {(!age || !selectedLocation) && <p className="text-xs text-center text-slate-500">Compila età e indirizzo per procedere.</p>}
          </div>
        )}

        {/* STEP 2: AVATAR (Resto uguale) */}
        {step === 2 && (
          <div className="space-y-6 text-center">
            <h2 className="text-3xl font-bold text-white">Il tuo Compagno</h2>
            <div className="grid grid-cols-3 gap-4 mt-8">
              {['sprout', 'flower', 'cactus'].map((type) => (
                <div 
                  key={type}
                  onClick={() => setAvatar(type as any)}
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all hover:scale-105 ${avatar === type ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700 bg-slate-800/50'}`}
                >
                  {type === 'sprout' && <Sprout className="w-10 h-10 mx-auto text-emerald-400" />}
                  {type === 'flower' && <Flower className="w-10 h-10 mx-auto text-pink-400" />}
                  {type === 'cactus' && <Zap className="w-10 h-10 mx-auto text-yellow-400" />}
                  <p className="mt-2 capitalize text-white font-bold">{type === 'sprout' ? 'Germoglio' : type === 'flower' ? 'Fiore' : 'Cactus'}</p>
                </div>
              ))}
            </div>
            <Button onClick={() => setStep(3)} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-6 mt-4">
              Conferma <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* STEP 3: FINE */}
        {step === 3 && (
          <div className="text-center space-y-6 py-4">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/50">
               <Check className="w-10 h-10 text-emerald-400 animate-bounce" />
            </div>
            <h2 className="text-3xl font-bold text-white">Tutto Pronto!</h2>
            <p className="text-slate-400">Abbiamo registrato la tua posizione: <br/> <span className="text-cyan-400 font-mono">{selectedLocation?.displayName}</span></p>
            <Button onClick={handleFinish} disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6">
              {loading ? "Salvataggio..." : "INIZIA IL TOUR"}
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}
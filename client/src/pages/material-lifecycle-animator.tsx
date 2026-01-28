import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Leaf, 
  Recycle, 
  Factory, 
  Trash2,
  TreePine,
  Droplets,
  Zap,
  Wind
} from "lucide-react";

interface LifecycleStage {
  id: string;
  name: string;
  duration: number;
  description: string;
  environmentalImpact: {
    co2: number;
    water: number;
    energy: number;
    waste: number;
  };
  icon: React.ComponentType<any>;
  color: string;
}

interface MaterialType {
  id: string;
  name: string;
  totalLifetime: number;
  stages: LifecycleStage[];
  recyclingPotential: number;
  biodegradable: boolean;
}

const materialTypes: MaterialType[] = [
  {
    id: "plastic",
    name: "Plastica PET",
    totalLifetime: 450,
    recyclingPotential: 85,
    biodegradable: false,
    stages: [
      {
        id: "production",
        name: "Produzione",
        duration: 1,
        description: "Estrazione petrolio e produzione polimeri",
        environmentalImpact: { co2: 2.3, water: 5.2, energy: 8.1, waste: 1.2 },
        icon: Factory,
        color: "bg-red-500"
      },
      {
        id: "use",
        name: "Utilizzo",
        duration: 2,
        description: "Periodo di utilizzo attivo del prodotto",
        environmentalImpact: { co2: 0.1, water: 0.2, energy: 0.3, waste: 0.1 },
        icon: Leaf,
        color: "bg-green-500"
      },
      {
        id: "disposal",
        name: "Smaltimento",
        duration: 447,
        description: "Decomposizione in discarica o ambiente",
        environmentalImpact: { co2: 0.8, water: 2.1, energy: 0.5, waste: 1.0 },
        icon: Trash2,
        color: "bg-gray-500"
      }
    ]
  },
  {
    id: "paper",
    name: "Carta",
    totalLifetime: 0.5,
    recyclingPotential: 95,
    biodegradable: true,
    stages: [
      {
        id: "production",
        name: "Produzione",
        duration: 0.1,
        description: "Taglio alberi e processo di polpaggio",
        environmentalImpact: { co2: 1.2, water: 15.3, energy: 4.2, waste: 2.1 },
        icon: TreePine,
        color: "bg-amber-600"
      },
      {
        id: "use",
        name: "Utilizzo",
        duration: 0.2,
        description: "Periodo di utilizzo del prodotto cartaceo",
        environmentalImpact: { co2: 0.05, water: 0.1, energy: 0.1, waste: 0.05 },
        icon: Leaf,
        color: "bg-green-500"
      },
      {
        id: "decomposition",
        name: "Decomposizione",
        duration: 0.2,
        description: "Biodegradazione naturale",
        environmentalImpact: { co2: 0.3, water: 1.2, energy: 0.1, waste: 0.1 },
        icon: Wind,
        color: "bg-emerald-500"
      }
    ]
  },
  {
    id: "glass",
    name: "Vetro",
    totalLifetime: 1000,
    recyclingPotential: 100,
    biodegradable: false,
    stages: [
      {
        id: "production",
        name: "Produzione",
        duration: 1,
        description: "Fusione sabbia e additivi ad alta temperatura",
        environmentalImpact: { co2: 0.8, water: 2.1, energy: 12.5, waste: 0.5 },
        icon: Factory,
        color: "bg-blue-600"
      },
      {
        id: "use",
        name: "Utilizzo",
        duration: 10,
        description: "Utilizzo prolungato del contenitore",
        environmentalImpact: { co2: 0.01, water: 0.05, energy: 0.02, waste: 0.01 },
        icon: Leaf,
        color: "bg-green-500"
      },
      {
        id: "persistence",
        name: "Persistenza",
        duration: 989,
        description: "Resistenza quasi eterna nell'ambiente",
        environmentalImpact: { co2: 0.02, water: 0.1, energy: 0.01, waste: 0.5 },
        icon: Recycle,
        color: "bg-cyan-500"
      }
    ]
  }
];

export default function MaterialLifecycleAnimator() {
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialType>(materialTypes[0]);
  const [currentStage, setCurrentStage] = useState(0);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setAnimationProgress(prev => {
        const increment = (100 / selectedMaterial.stages[currentStage].duration) * animationSpeed * 0.1;
        const newProgress = prev + increment;
        
        if (newProgress >= 100) {
          if (currentStage < selectedMaterial.stages.length - 1) {
            setCurrentStage(current => current + 1);
            return 0;
          } else {
            setIsPlaying(false);
            return 100;
          }
        }
        
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, currentStage, selectedMaterial, animationSpeed]);

  const resetAnimation = () => {
    setCurrentStage(0);
    setAnimationProgress(0);
    setIsPlaying(false);
  };

  const getCurrentStage = () => selectedMaterial.stages[currentStage];
  const CurrentIcon = getCurrentStage().icon;

  const getTotalEnvironmentalImpact = () => {
    return selectedMaterial.stages.reduce((total, stage) => ({
      co2: total.co2 + stage.environmentalImpact.co2,
      water: total.water + stage.environmentalImpact.water,
      energy: total.energy + stage.environmentalImpact.energy,
      waste: total.waste + stage.environmentalImpact.waste
    }), { co2: 0, water: 0, energy: 0, waste: 0 });
  };

  const getRecyclingBenefits = () => {
    const totalImpact = getTotalEnvironmentalImpact();
    const reduction = selectedMaterial.recyclingPotential / 100;
    
    return {
      co2Saved: totalImpact.co2 * reduction,
      waterSaved: totalImpact.water * reduction,
      energySaved: totalImpact.energy * reduction,
      wasteSaved: totalImpact.waste * reduction
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white mb-2">
            Interactive Material Lifecycle Animator
          </h1>
          <p className="text-cyan-200 text-lg">
            Visualizza l'impatto ambientale completo dei materiali nel tempo
          </p>
        </div>

        {/* Material Selection */}
        <Card className="bg-black/20 border-cyan-500/30 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Recycle className="w-6 h-6 text-cyan-400" />
              Selezione Materiale
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              value={selectedMaterial.id}
              onValueChange={(value) => {
                const material = materialTypes.find(m => m.id === value);
                if (material) {
                  setSelectedMaterial(material);
                  resetAnimation();
                }
              }}
            >
              <SelectTrigger className="bg-black/30 border-cyan-500/50 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {materialTypes.map(material => (
                  <SelectItem key={material.id} value={material.id}>
                    {material.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-cyan-400 font-semibold">Durata Totale</div>
                <div className="text-white">{selectedMaterial.totalLifetime} anni</div>
              </div>
              <div className="text-center">
                <div className="text-green-400 font-semibold">Potenziale Riciclo</div>
                <div className="text-white">{selectedMaterial.recyclingPotential}%</div>
              </div>
              <div className="text-center">
                <div className="text-yellow-400 font-semibold">Biodegradabile</div>
                <div className="text-white">{selectedMaterial.biodegradable ? "Sì" : "No"}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Animation Controls */}
          <Card className="bg-black/20 border-cyan-500/30 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Play className="w-6 h-6 text-cyan-400" />
                Controlli Animazione
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Stage Display */}
              <div className="text-center space-y-4">
                <div className={`w-24 h-24 mx-auto rounded-full ${getCurrentStage().color} flex items-center justify-center mb-4 animate-pulse`}>
                  <CurrentIcon className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">{getCurrentStage().name}</h3>
                <p className="text-cyan-200 text-sm">{getCurrentStage().description}</p>
                <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                  Fase {currentStage + 1} di {selectedMaterial.stages.length}
                </Badge>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-cyan-200">
                  <span>Progresso Fase</span>
                  <span>{Math.round(animationProgress)}%</span>
                </div>
                <Progress 
                  value={animationProgress} 
                  className="h-3 bg-black/30"
                />
              </div>

              {/* Controls */}
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="cyber-button"
                  size="sm"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button
                  onClick={resetAnimation}
                  variant="outline"
                  size="sm"
                  className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>

              {/* Speed Control */}
              <div className="space-y-2">
                <label className="text-sm text-cyan-200">Velocità Animazione</label>
                <Select
                  value={animationSpeed.toString()}
                  onValueChange={(value) => setAnimationSpeed(parseFloat(value))}
                >
                  <SelectTrigger className="bg-black/30 border-cyan-500/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5">0.5x</SelectItem>
                    <SelectItem value="1">1x</SelectItem>
                    <SelectItem value="2">2x</SelectItem>
                    <SelectItem value="5">5x</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Environmental Impact */}
          <Card className="bg-black/20 border-cyan-500/30 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Leaf className="w-6 h-6 text-green-400" />
                Impatto Ambientale
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-cyan-200">CO₂</span>
                  </div>
                  <div className="text-lg font-bold text-white">
                    {getCurrentStage().environmentalImpact.co2} kg
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-cyan-200">Acqua</span>
                  </div>
                  <div className="text-lg font-bold text-white">
                    {getCurrentStage().environmentalImpact.water} L
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-cyan-200">Energia</span>
                  </div>
                  <div className="text-lg font-bold text-white">
                    {getCurrentStage().environmentalImpact.energy} kWh
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-cyan-200">Rifiuti</span>
                  </div>
                  <div className="text-lg font-bold text-white">
                    {getCurrentStage().environmentalImpact.waste} kg
                  </div>
                </div>
              </div>

              <div className="border-t border-cyan-500/30 pt-4">
                <h4 className="text-sm font-semibold text-cyan-400 mb-3">Impatto Totale Lifecycle</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(getTotalEnvironmentalImpact()).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-cyan-200 capitalize">{key}:</span>
                      <span className="text-white">{value.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline Visualization */}
        <Card className="bg-black/20 border-cyan-500/30 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white">Timeline del Ciclo di Vita</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                {selectedMaterial.stages.map((stage, index) => {
                  const StageIcon = stage.icon;
                  const isActive = index === currentStage;
                  const isPast = index < currentStage;
                  
                  return (
                    <div key={stage.id} className="flex flex-col items-center space-y-2 flex-1">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isActive ? `${stage.color} animate-pulse` :
                        isPast ? `${stage.color} opacity-70` :
                        'bg-gray-600 opacity-40'
                      }`}>
                        <StageIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-center">
                        <div className={`font-semibold text-sm ${isActive ? 'text-cyan-400' : 'text-white'}`}>
                          {stage.name}
                        </div>
                        <div className="text-xs text-cyan-200">
                          {stage.duration} {stage.duration === 1 ? 'anno' : 'anni'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Timeline connector */}
              <div className="absolute top-6 left-6 right-6 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        {/* Recycling Benefits */}
        <Card className="bg-black/20 border-green-500/30 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Recycle className="w-6 h-6 text-green-400" />
              Benefici del Riciclaggio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(getRecyclingBenefits()).map(([key, value]) => (
                <div key={key} className="text-center space-y-2">
                  <div className="text-2xl font-bold text-green-400">
                    -{value.toFixed(1)}
                  </div>
                  <div className="text-sm text-green-200 capitalize">
                    {key.replace('Saved', '').replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="text-xs text-green-300">
                    Risparmiato
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-green-500/10 rounded-lg border border-green-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="w-5 h-5 text-green-400" />
                <span className="font-semibold text-green-400">Consiglio Sostenibile</span>
              </div>
              <p className="text-green-200 text-sm">
                {selectedMaterial.biodegradable 
                  ? "Questo materiale è biodegradabile! Considera il compostaggio per un impatto ancora minore."
                  : `Con un potenziale di riciclo del ${selectedMaterial.recyclingPotential}%, questo materiale può essere trasformato in nuovi prodotti riducendo significativamente l'impatto ambientale.`
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .cyber-button {
            background: linear-gradient(to right, rgb(6 182 212), rgb(37 99 235));
            transition: all 0.3s ease;
            color: white;
            border: none;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          }
          .cyber-button:hover {
            background: linear-gradient(to right, rgb(34 211 238), rgb(59 130 246));
            box-shadow: 0 20px 25px -5px rgba(6, 182, 212, 0.25);
          }
        `
      }} />
    </div>
  );
}
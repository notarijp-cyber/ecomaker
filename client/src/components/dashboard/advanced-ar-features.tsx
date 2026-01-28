import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Camera, 
  Scan, 
  Zap, 
  Eye, 
  Layers, 
  Rotate3D,
  Share2,
  Download,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Smartphone,
  Tablet,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ARProject {
  id: number;
  name: string;
  materials: string[];
  previewUrl: string;
  complexity: 'simple' | 'medium' | 'complex';
  arModelUrl: string;
  instructions: string[];
  estimatedTime: number;
  isScanned: boolean;
  scanAccuracy: number;
}

interface AdvancedARFeaturesProps {
  userId: number;
}

export function AdvancedARFeatures({ userId }: AdvancedARFeaturesProps) {
  const [arProjects, setArProjects] = useState<ARProject[]>([]);
  const [isARActive, setIsARActive] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ARProject | null>(null);
  const [scanningMode, setScanningMode] = useState<'material' | 'space' | 'measurement'>('material');
  const [deviceOrientation, setDeviceOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [arSettings, setArSettings] = useState({
    lighting: 'auto',
    quality: 'high',
    occlusion: true,
    shadows: true
  });

  useEffect(() => {
    const mockProjects: ARProject[] = [
      {
        id: 1,
        name: "Lampada da Bottiglia",
        materials: ["Bottiglia di plastica", "LED strip", "Cavo USB"],
        previewUrl: "/ar-previews/lamp.glb",
        complexity: 'simple',
        arModelUrl: "/models/bottle-lamp.glb",
        instructions: [
          "Posiziona la bottiglia di plastica",
          "Inserisci il LED strip",
          "Collega il cavo USB",
          "Testa l'illuminazione"
        ],
        estimatedTime: 30,
        isScanned: true,
        scanAccuracy: 95
      },
      {
        id: 2,
        name: "Scaffale da Cartone",
        materials: ["Scatole di cartone", "Colla vinilica", "Nastro adesivo"],
        previewUrl: "/ar-previews/shelf.glb",
        complexity: 'medium',
        arModelUrl: "/models/cardboard-shelf.glb",
        instructions: [
          "Prepara le scatole",
          "Applica la colla",
          "Assembla la struttura",
          "Rinforza con il nastro"
        ],
        estimatedTime: 60,
        isScanned: false,
        scanAccuracy: 0
      },
      {
        id: 3,
        name: "Giardino Verticale",
        materials: ["Pallet di legno", "Bottiglie di plastica", "Terra", "Semi"],
        previewUrl: "/ar-previews/garden.glb",
        complexity: 'complex',
        arModelUrl: "/models/vertical-garden.glb",
        instructions: [
          "Prepara il pallet",
          "Taglia le bottiglie",
          "Fissa le bottiglie",
          "Aggiungi terra e semi"
        ],
        estimatedTime: 120,
        isScanned: true,
        scanAccuracy: 88
      }
    ];

    setArProjects(mockProjects);
  }, [userId]);

  const startARSession = (project: ARProject) => {
    setSelectedProject(project);
    setIsARActive(true);
  };

  const stopARSession = () => {
    setIsARActive(false);
    setSelectedProject(null);
  };

  const scanMaterial = async () => {
    // Simula la scansione del materiale
    if (selectedProject) {
      setArProjects(prev => 
        prev.map(p => 
          p.id === selectedProject.id 
            ? { ...p, isScanned: true, scanAccuracy: Math.floor(Math.random() * 20) + 80 }
            : p
        )
      );
    }
  };

  const getComplexityColor = (complexity: ARProject['complexity']) => {
    switch (complexity) {
      case 'simple': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'complex': return 'bg-red-100 text-red-800';
    }
  };

  const getScanningModeIcon = (mode: typeof scanningMode) => {
    switch (mode) {
      case 'material': return <Scan className="w-4 h-4" />;
      case 'space': return <Layers className="w-4 h-4" />;
      case 'measurement': return <Rotate3D className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* AR Status Card */}
      <Card className={`transition-all ${isARActive ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200'}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className={`w-5 h-5 ${isARActive ? 'text-blue-600' : 'text-gray-600'}`} />
            Modalità AR {isARActive ? 'Attiva' : 'Inattiva'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isARActive && selectedProject ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-blue-800">{selectedProject.name}</h3>
                  <p className="text-sm text-blue-600">Visualizzazione AR in corso</p>
                </div>
                <Button 
                  onClick={stopARSession}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Ferma AR
                </Button>
              </div>

              {/* AR Controls */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setScanningMode('material')}
                  className={scanningMode === 'material' ? 'bg-blue-100' : ''}
                >
                  <Scan className="w-4 h-4 mr-1" />
                  Materiali
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setScanningMode('space')}
                  className={scanningMode === 'space' ? 'bg-blue-100' : ''}
                >
                  <Layers className="w-4 h-4 mr-1" />
                  Spazio
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setScanningMode('measurement')}
                  className={scanningMode === 'measurement' ? 'bg-blue-100' : ''}
                >
                  <Rotate3D className="w-4 h-4 mr-1" />
                  Misure
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={scanMaterial}
                >
                  <Zap className="w-4 h-4 mr-1" />
                  Scansiona
                </Button>
              </div>

              {/* Scan Accuracy */}
              {selectedProject.isScanned && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Accuratezza Scansione</span>
                    <span>{selectedProject.scanAccuracy}%</span>
                  </div>
                  <Progress value={selectedProject.scanAccuracy} className="h-2" />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Seleziona un progetto per iniziare la visualizzazione AR</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AR Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Impostazioni AR
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Qualità Rendering</label>
                <div className="flex gap-2 mt-1">
                  {['low', 'medium', 'high'].map((quality) => (
                    <Button
                      key={quality}
                      variant={arSettings.quality === quality ? "default" : "outline"}
                      size="sm"
                      onClick={() => setArSettings(prev => ({ ...prev, quality }))}
                    >
                      {quality === 'low' && 'Bassa'}
                      {quality === 'medium' && 'Media'}
                      {quality === 'high' && 'Alta'}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Illuminazione</label>
                <div className="flex gap-2 mt-1">
                  {['auto', 'manual', 'studio'].map((lighting) => (
                    <Button
                      key={lighting}
                      variant={arSettings.lighting === lighting ? "default" : "outline"}
                      size="sm"
                      onClick={() => setArSettings(prev => ({ ...prev, lighting }))}
                    >
                      {lighting === 'auto' && 'Auto'}
                      {lighting === 'manual' && 'Manuale'}
                      {lighting === 'studio' && 'Studio'}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Orientamento Dispositivo</label>
                <div className="flex gap-2 mt-1">
                  <Button
                    variant={deviceOrientation === 'portrait' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDeviceOrientation('portrait')}
                  >
                    <Smartphone className="w-4 h-4 mr-1" />
                    Verticale
                  </Button>
                  <Button
                    variant={deviceOrientation === 'landscape' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDeviceOrientation('landscape')}
                  >
                    <Tablet className="w-4 h-4 mr-1" />
                    Orizzontale
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={arSettings.occlusion}
                    onChange={(e) => setArSettings(prev => ({ ...prev, occlusion: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Occlusione Oggetti</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={arSettings.shadows}
                    onChange={(e) => setArSettings(prev => ({ ...prev, shadows: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Ombre Realistiche</span>
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AR Projects Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {arProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`h-full transition-all hover:shadow-lg ${
              selectedProject?.id === project.id ? 'border-blue-300 bg-blue-50' : 'hover:border-gray-300'
            }`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge className={getComplexityColor(project.complexity)}>
                    {project.complexity === 'simple' && 'Semplice'}
                    {project.complexity === 'medium' && 'Medio'}
                    {project.complexity === 'complex' && 'Complesso'}
                  </Badge>
                  {project.isScanned && (
                    <Badge variant="outline" className="text-green-600 border-green-300">
                      <Eye className="w-3 h-3 mr-1" />
                      Scansionato
                    </Badge>
                  )}
                </div>
                
                <CardTitle className="text-lg">{project.name}</CardTitle>
                
                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-1 mb-1">
                    <Layers className="w-3 h-3" />
                    {project.materials.length} materiali
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {project.estimatedTime} min
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Materials List */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Materiali Necessari:</h4>
                  <div className="space-y-1">
                    {project.materials.slice(0, 3).map((material, i) => (
                      <div key={i} className="text-xs text-gray-600 flex items-center gap-1">
                        <div className="w-1 h-1 bg-green-500 rounded-full" />
                        {material}
                      </div>
                    ))}
                    {project.materials.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{project.materials.length - 3} altri materiali
                      </div>
                    )}
                  </div>
                </div>

                {/* Scan Accuracy Progress */}
                {project.isScanned && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Accuratezza Scansione</span>
                      <span className="text-green-600">{project.scanAccuracy}%</span>
                    </div>
                    <Progress value={project.scanAccuracy} className="h-2" />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => startARSession(project)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={isARActive && selectedProject?.id !== project.id}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {selectedProject?.id === project.id ? 'In Corso' : 'Avvia AR'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {/* Share functionality */}}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {/* Download functionality */}}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* AR Instructions Modal */}
      <AnimatePresence>
        {isARActive && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                
                <h2 className="text-xl font-bold">Modalità AR Attiva</h2>
                <p className="text-gray-600">
                  Inquadra lo spazio dove vuoi posizionare il progetto "{selectedProject.name}"
                </p>
                
                <div className="bg-blue-50 p-4 rounded-lg text-left">
                  <h3 className="font-semibold mb-2">Istruzioni:</h3>
                  <ol className="text-sm space-y-1">
                    {selectedProject.instructions.map((instruction, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-blue-600 font-medium">{i + 1}.</span>
                        {instruction}
                      </li>
                    ))}
                  </ol>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={stopARSession} variant="outline" className="flex-1">
                    Esci da AR
                  </Button>
                  <Button onClick={scanMaterial} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <Scan className="w-4 h-4 mr-2" />
                    Scansiona
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
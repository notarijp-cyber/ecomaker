import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Lightbulb, Recycle, Package, TrendingUp, RefreshCw } from "lucide-react";

export default function InternalDatabase() {
  const [isPopulating, setIsPopulating] = useState(false);

  // Query per statistiche database
  const { data: stats, refetch: refetchStats } = useQuery({
    queryKey: ['/api/internal/stats'],
    staleTime: 30000
  });

  // Query per progetti interni
  const { data: projects, refetch: refetchProjects } = useQuery({
    queryKey: ['/api/internal/projects'],
    staleTime: 30000
  });

  // Query per materiali interni
  const { data: materials, refetch: refetchMaterials } = useQuery({
    queryKey: ['/api/internal/materials'],
    staleTime: 30000
  });

  // Query per cache Thingiverse
  const { data: thingiverseCache } = useQuery({
    queryKey: ['/api/internal/cache/thingiverse'],
    staleTime: 30000
  });

  // Query per cache Amazon
  const { data: amazonCache } = useQuery({
    queryKey: ['/api/internal/cache/amazon'],
    staleTime: 30000
  });

  // Query per progetti offline
  const { data: offlineProjects } = useQuery({
    queryKey: ['/api/internal/projects', { offline: true, limit: 30 }],
    staleTime: 30000
  });

  const handlePopulateDatabase = async () => {
    setIsPopulating(true);
    try {
      const response = await fetch('/api/internal/populate', { method: 'POST' });
      const result = await response.json();
      
      // Aspetta qualche secondo e poi aggiorna i dati
      setTimeout(() => {
        refetchStats();
        refetchProjects();
        refetchMaterials();
        setIsPopulating(false);
      }, 5000);
    } catch (error) {
      console.error('Errore popolamento database:', error);
      setIsPopulating(false);
    }
  };

  const handleAdvancedGeneration = async () => {
    setIsPopulating(true);
    try {
      const response = await fetch('/api/internal/generate-advanced', { method: 'POST' });
      const result = await response.json();
      
      // Aspetta più tempo per la generazione avanzata
      setTimeout(() => {
        refetchStats();
        refetchProjects();
        refetchMaterials();
        setIsPopulating(false);
      }, 8000);
    } catch (error) {
      console.error('Errore generazione avanzata:', error);
      setIsPopulating(false);
    }
  };

  return (
    <div className="futuristic-bg min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass-morph rounded-xl p-6 mb-6 neon-border-cyan">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="holographic-text text-3xl font-bold mb-2">
                Database Interno Quantum
              </h1>
              <p className="text-cyan-100">
                Sistema avanzato di integrazione dati dalle API esterne per funzionamento autonomo
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={handlePopulateDatabase}
                disabled={isPopulating}
                className="cyber-button"
              >
                {isPopulating ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Database className="w-4 h-4 mr-2" />
                )}
                {isPopulating ? 'Popolamento...' : 'Popola Database'}
              </Button>
              <Button 
                onClick={handleAdvancedGeneration}
                disabled={isPopulating}
                className="cyber-button bg-purple-600 hover:bg-purple-700"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Generazione AI Avanzata
              </Button>
            </div>
          </div>
        </div>

        {/* Statistiche */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="floating-card neon-border-green">
            <div className="p-6 text-center">
              <Lightbulb className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <h3 className="holographic-text-neon text-xl font-bold mb-2">
                Progetti
              </h3>
              <p className="text-green-100 text-3xl font-bold">
                {stats?.projects || 0}
              </p>
            </div>
          </div>

          <div className="floating-card neon-border-purple">
            <div className="p-6 text-center">
              <Recycle className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <h3 className="holographic-text text-xl font-bold mb-2">
                Materiali
              </h3>
              <p className="text-purple-100 text-3xl font-bold">
                {stats?.materials || 0}
              </p>
            </div>
          </div>

          <div className="floating-card neon-border-cyan">
            <div className="p-6 text-center">
              <Package className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <h3 className="holographic-text text-xl font-bold mb-2">
                Cache Thingiverse
              </h3>
              <p className="text-cyan-100 text-3xl font-bold">
                {thingiverseCache?.length || 0}
              </p>
            </div>
          </div>

          <div className="floating-card neon-border-orange">
            <div className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-orange-400 mx-auto mb-3" />
              <h3 className="holographic-text text-xl font-bold mb-2">
                Prodotti Amazon
              </h3>
              <p className="text-orange-100 text-3xl font-bold">
                {amazonCache?.length || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Contenuto principale */}
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="glass-morph">
            <TabsTrigger value="projects" className="cyber-button">Progetti Interni</TabsTrigger>
            <TabsTrigger value="offline" className="cyber-button">Progetti Offline</TabsTrigger>
            <TabsTrigger value="materials" className="cyber-button">Materiali</TabsTrigger>
            <TabsTrigger value="thingiverse" className="cyber-button">Cache Thingiverse</TabsTrigger>
            <TabsTrigger value="amazon" className="cyber-button">Cache Amazon</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="mt-6">
            <div className="floating-card">
              <div className="p-6">
                <h2 className="holographic-text text-2xl font-bold mb-4">
                  Progetti Interni Integrati
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects?.slice(0, 12).map((project: any) => (
                    <div key={project.id} className="glass-morph p-4 rounded-lg neon-border-cyan">
                      <h3 className="holographic-text font-semibold mb-2">
                        {project.name}
                      </h3>
                      <p className="text-cyan-100 text-sm mb-3 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className="bg-green-500/20 text-green-300">
                          {project.difficulty}
                        </Badge>
                        <Badge className="bg-blue-500/20 text-blue-300">
                          {project.category}
                        </Badge>
                        <Badge className="bg-purple-500/20 text-purple-300">
                          {project.source}
                        </Badge>
                      </div>
                      <div className="text-xs text-cyan-200">
                        Tempo stimato: {project.estimatedTime} {project.timeUnit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="offline" className="mt-6">
            <div className="floating-card">
              <div className="p-6">
                <h2 className="holographic-text text-2xl font-bold mb-4">
                  Progetti Offline AI Avanzati (1-7 Materiali)
                </h2>
                <div className="mb-4 p-3 glass-morph rounded-lg">
                  <p className="text-cyan-100 text-sm">
                    🤖 Sistema AI avanzato con analisi stato materiali, ottimizzazione utilizzo, 
                    generazione immagini e calcolo impatto ambientale completo.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {offlineProjects?.slice(0, 15).map((project: any) => (
                    <div key={project.id} className="glass-morph p-4 rounded-lg neon-border-green">
                      <h3 className="holographic-text-neon font-semibold mb-2">
                        {project.name}
                      </h3>
                      <p className="text-green-100 text-sm mb-3 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className="bg-green-500/20 text-green-300">
                          {project.difficulty}
                        </Badge>
                        <Badge className="bg-cyan-500/20 text-cyan-300">
                          {project.materials?.length || 0} materiali
                        </Badge>
                        <Badge className="bg-purple-500/20 text-purple-300">
                          Offline
                        </Badge>
                      </div>
                      <div className="text-xs text-green-200 mb-2">
                        Assemblaggio: {project.assemblyMethods?.slice(0, 2).join(', ') || 'Standard'}
                      </div>
                      <div className="text-xs text-cyan-200 mb-2">
                        Tempo: {project.estimatedTime} {project.timeUnit}
                      </div>
                      {project.environmentalImpact?.sustainabilityScore && (
                        <div className="text-xs text-purple-200">
                          🌱 Sostenibilità: {project.environmentalImpact.sustainabilityScore}%
                        </div>
                      )}
                      {project.previewImage && (
                        <div className="mt-3">
                          <img 
                            src={project.previewImage} 
                            alt={project.name}
                            className="w-full h-20 object-cover rounded opacity-70"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="materials" className="mt-6">
            <div className="floating-card">
              <div className="p-6">
                <h2 className="holographic-text text-2xl font-bold mb-4">
                  Materiali con Dati Scientifici
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {materials?.slice(0, 12).map((material: any) => (
                    <div key={material.id} className="glass-morph p-4 rounded-lg neon-border-purple">
                      <h3 className="holographic-text-neon font-semibold mb-2">
                        {material.name}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className="bg-purple-500/20 text-purple-300">
                          {material.type}
                        </Badge>
                        <Badge className="bg-green-500/20 text-green-300">
                          Score: {material.sustainabilityScore || 'N/A'}
                        </Badge>
                      </div>
                      <div className="text-xs text-purple-200 mb-2">
                        Usi possibili: {material.possibleUses?.slice(0, 2).join(', ')}
                      </div>
                      <div className="text-xs text-cyan-200">
                        Fonte: {material.source}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="thingiverse" className="mt-6">
            <div className="floating-card">
              <div className="p-6">
                <h2 className="holographic-text text-2xl font-bold mb-4">
                  Cache Modelli Thingiverse
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {thingiverseCache?.slice(0, 12).map((model: any) => (
                    <div key={model.id} className="glass-morph p-4 rounded-lg neon-border-cyan">
                      <h3 className="holographic-text font-semibold mb-2">
                        {model.name}
                      </h3>
                      <p className="text-cyan-100 text-sm mb-3 line-clamp-2">
                        {model.description}
                      </p>
                      <div className="flex justify-between text-xs text-cyan-200 mb-2">
                        <span>👍 {model.likesCount}</span>
                        <span>📥 {model.downloadsCount}</span>
                      </div>
                      <div className="text-xs text-cyan-200">
                        Creatore: {model.creatorName}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="amazon" className="mt-6">
            <div className="floating-card">
              <div className="p-6">
                <h2 className="holographic-text text-2xl font-bold mb-4">
                  Prodotti Amazon Correlati
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {amazonCache?.slice(0, 12).map((product: any) => (
                    <div key={product.id} className="glass-morph p-4 rounded-lg neon-border-orange">
                      <h3 className="holographic-text font-semibold mb-2">
                        {product.title}
                      </h3>
                      <div className="flex items-center justify-between mb-3">
                        <Badge className="bg-green-500/20 text-green-300">
                          {product.price}
                        </Badge>
                        {product.isPrime && (
                          <Badge className="bg-orange-500/20 text-orange-300">
                            Prime
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-orange-200 mb-2">
                        Categoria: {product.category}
                      </div>
                      <div className="text-xs text-cyan-200">
                        Rating: {product.rating || 'N/A'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
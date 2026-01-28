import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Lightbulb, 
  Zap, 
  Beaker, 
  Rocket, 
  TrendingUp, 
  Users, 
  Award,
  ChevronRight,
  BookOpen,
  Cpu,
  Target,
  Sparkles
} from "lucide-react";

interface InnovationProject {
  id: string;
  title: string;
  description: string;
  category: 'research' | 'prototype' | 'experiment' | 'collaboration';
  difficulty: 'Facile' | 'Medio' | 'Difficile';
  progress: number;
  participants: number;
  rewards: number;
  estimatedCompletion: string;
  technologies: string[];
  status: 'active' | 'completed' | 'coming-soon';
}

interface InnovationCenterProps {
  userId: number;
}

export function InnovationCenter({ userId }: InnovationCenterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const innovationProjects: InnovationProject[] = [
    {
      id: 'bio-plastic-research',
      title: 'Ricerca Bioplastiche da Alghe Marine',
      description: 'Sviluppo di nuovi materiali biodegradabili utilizzando alghe marine per ridurre l\'inquinamento plastico.',
      category: 'research',
      difficulty: 'Difficile',
      progress: 65,
      participants: 23,
      rewards: 500,
      estimatedCompletion: '3 mesi',
      technologies: ['Biochimica', 'Nanotecnologia', 'Analisi Materiali'],
      status: 'active'
    },
    {
      id: 'solar-waste-converter',
      title: 'Convertitore Solare per Rifiuti Plastici',
      description: 'Prototipo di dispositivo che utilizza energia solare per convertire rifiuti plastici in materiali utili.',
      category: 'prototype',
      difficulty: 'Medio',
      progress: 40,
      participants: 15,
      rewards: 350,
      estimatedCompletion: '2 mesi',
      technologies: ['Energia Solare', 'Ingegneria Meccanica', 'Automazione'],
      status: 'active'
    },
    {
      id: 'mycelium-packaging',
      title: 'Imballaggi in Micelio Fungino',
      description: 'Sperimentazione con micelio per creare imballaggi completamente biodegradabili e resistenti.',
      category: 'experiment',
      difficulty: 'Medio',
      progress: 80,
      participants: 31,
      rewards: 400,
      estimatedCompletion: '1 mese',
      technologies: ['Biotecnologia', 'Microbiologia', 'Design Sostenibile'],
      status: 'active'
    },
    {
      id: 'ai-waste-sorting',
      title: 'Sistema IA per Separazione Intelligente',
      description: 'Collaborazione per sviluppare un sistema di intelligenza artificiale che riconosce e separa automaticamente i rifiuti.',
      category: 'collaboration',
      difficulty: 'Difficile',
      progress: 25,
      participants: 45,
      rewards: 750,
      estimatedCompletion: '6 mesi',
      technologies: ['Machine Learning', 'Computer Vision', 'Robotica'],
      status: 'active'
    },
    {
      id: 'ocean-plastic-textile',
      title: 'Tessuti da Plastica Oceanica',
      description: 'Trasformazione della plastica raccolta dagli oceani in fibre tessili di alta qualità.',
      category: 'research',
      difficulty: 'Difficile',
      progress: 100,
      participants: 28,
      rewards: 600,
      estimatedCompletion: 'Completato',
      technologies: ['Chimica dei Polimeri', 'Ingegneria Tessile', 'Purificazione'],
      status: 'completed'
    },
    {
      id: 'quantum-recycling',
      title: 'Riciclaggio Quantico Molecolare',
      description: 'Utilizzo di principi quantistici per decomporre materiali a livello molecolare per un riciclaggio perfetto.',
      category: 'research',
      difficulty: 'Difficile',
      progress: 0,
      participants: 0,
      rewards: 1000,
      estimatedCompletion: '12 mesi',
      technologies: ['Fisica Quantistica', 'Nanotecnologia', 'Chimica Avanzata'],
      status: 'coming-soon'
    }
  ];

  const filteredProjects = selectedCategory === 'all' 
    ? innovationProjects 
    : innovationProjects.filter(p => p.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'research': return <Beaker className="h-4 w-4" />;
      case 'prototype': return <Cpu className="h-4 w-4" />;
      case 'experiment': return <Lightbulb className="h-4 w-4" />;
      case 'collaboration': return <Users className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Facile': return 'bg-green-100 text-green-800';
      case 'Medio': return 'bg-yellow-100 text-yellow-800';
      case 'Difficile': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'coming-soon': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Rocket className="h-8 w-8 text-purple-600" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Centro Innovazione EcoMaker
          </h2>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Partecipa a progetti di ricerca rivoluzionari per il futuro della sostenibilità. 
          Collabora con esperti mondiali e contribuisci a tecnologie che cambieranno il mondo.
        </p>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Tutti
          </TabsTrigger>
          <TabsTrigger value="research" className="flex items-center gap-2">
            <Beaker className="h-4 w-4" />
            Ricerca
          </TabsTrigger>
          <TabsTrigger value="prototype" className="flex items-center gap-2">
            <Cpu className="h-4 w-4" />
            Prototipi
          </TabsTrigger>
          <TabsTrigger value="experiment" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Esperimenti
          </TabsTrigger>
          <TabsTrigger value="collaboration" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Collaborazioni
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-purple-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(project.category)}
                      <Badge variant="outline" className={getDifficultyColor(project.difficulty)}>
                        {project.difficulty}
                      </Badge>
                    </div>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status === 'active' ? 'Attivo' : 
                       project.status === 'completed' ? 'Completato' : 'Prossimamente'}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {project.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {project.status !== 'coming-soon' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progresso</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{project.participants} partecipanti</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4" />
                      <span>{project.rewards} punti</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Target className="h-4 w-4" />
                    <span>Completamento: {project.estimatedCompletion}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">Tecnologie:</div>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className="w-full group-hover:bg-purple-600 group-hover:text-white transition-colors"
                    variant={project.status === 'coming-soon' ? 'outline' : 'default'}
                    disabled={project.status === 'coming-soon'}
                  >
                    {project.status === 'coming-soon' ? (
                      'Prossimamente'
                    ) : project.status === 'completed' ? (
                      <>
                        <BookOpen className="h-4 w-4 mr-2" />
                        Visualizza Risultati
                      </>
                    ) : (
                      <>
                        Partecipa al Progetto
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Innovation Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Statistiche Innovazione Globale
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">142</div>
              <div className="text-sm text-gray-600">Progetti Attivi</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">67</div>
              <div className="text-sm text-gray-600">Completati</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">2.4K</div>
              <div className="text-sm text-gray-600">Ricercatori</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">15M€</div>
              <div className="text-sm text-gray-600">Investimenti</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
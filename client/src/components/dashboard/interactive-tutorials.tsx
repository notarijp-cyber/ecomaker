import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Users, 
  Star,
  Camera,
  Lightbulb,
  Recycle,
  Award,
  ChevronRight,
  VideoIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Tutorial {
  id: number;
  title: string;
  description: string;
  category: 'beginner' | 'intermediate' | 'advanced' | 'masterclass';
  duration: number; // in minutes
  steps: number;
  completedSteps: number;
  difficulty: 'facile' | 'medio' | 'difficile';
  type: 'video' | 'interactive' | 'ar' | 'hands-on';
  tags: string[];
  isCompleted: boolean;
  isPopular: boolean;
  rating: number;
  participants: number;
  prerequisite?: string;
  rewards: {
    points: number;
    badge?: string;
    unlock?: string;
  };
}

interface InteractiveTutorialsProps {
  userId: number;
}

export function InteractiveTutorials({ userId }: InteractiveTutorialsProps) {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTutorial, setActiveTutorial] = useState<Tutorial | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const mockTutorials: Tutorial[] = [
      {
        id: 1,
        title: "Primi Passi nel Riciclo Creativo",
        description: "Impara le basi del riciclo creativo con materiali comuni di casa",
        category: 'beginner',
        duration: 15,
        steps: 8,
        completedSteps: 3,
        difficulty: 'facile',
        type: 'interactive',
        tags: ['riciclo', 'basics', 'casa'],
        isCompleted: false,
        isPopular: true,
        rating: 4.8,
        participants: 1245,
        rewards: {
          points: 200,
          badge: "Eco-Principiante",
          unlock: "Scanner materiali avanzato"
        }
      },
      {
        id: 2,
        title: "Masterclass: Upcycling Tessuti",
        description: "Trasforma vecchi vestiti in creazioni di design uniche",
        category: 'masterclass',
        duration: 45,
        steps: 12,
        completedSteps: 0,
        difficulty: 'difficile',
        type: 'video',
        tags: ['tessuti', 'fashion', 'design'],
        isCompleted: false,
        isPopular: true,
        rating: 4.9,
        participants: 856,
        prerequisite: "Completare 'Primi Passi nel Riciclo'",
        rewards: {
          points: 800,
          badge: "Maestro del Tessuto",
          unlock: "Modalità Design Avanzata"
        }
      },
      {
        id: 3,
        title: "AR Workshop: Visualizza il Tuo Progetto",
        description: "Usa la realtà aumentata per vedere i tuoi progetti prima di crearli",
        category: 'intermediate',
        duration: 25,
        steps: 6,
        completedSteps: 6,
        difficulty: 'medio',
        type: 'ar',
        tags: ['AR', 'visualizzazione', 'tech'],
        isCompleted: true,
        isPopular: false,
        rating: 4.7,
        participants: 623,
        rewards: {
          points: 400,
          badge: "AR Pioneer",
          unlock: "Libreria modelli 3D"
        }
      },
      {
        id: 4,
        title: "Laboratorio Plastica: Da Bottiglia a Lampada",
        description: "Tutorial pratico per creare una lampada da bottiglie di plastica",
        category: 'intermediate',
        duration: 30,
        steps: 10,
        completedSteps: 7,
        difficulty: 'medio',
        type: 'hands-on',
        tags: ['plastica', 'illuminazione', 'pratico'],
        isCompleted: false,
        isPopular: true,
        rating: 4.6,
        participants: 987,
        rewards: {
          points: 350,
          badge: "Illuminatore Verde"
        }
      }
    ];

    setTutorials(mockTutorials);
  }, [userId]);

  const getCategoryColor = (category: Tutorial['category']) => {
    switch (category) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      case 'masterclass': return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getTypeIcon = (type: Tutorial['type']) => {
    switch (type) {
      case 'video': return <VideoIcon className="w-4 h-4" />;
      case 'interactive': return <Lightbulb className="w-4 h-4" />;
      case 'ar': return <Camera className="w-4 h-4" />;
      case 'hands-on': return <Recycle className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: Tutorial['difficulty']) => {
    switch (difficulty) {
      case 'facile': return 'text-green-600';
      case 'medio': return 'text-yellow-600';
      case 'difficile': return 'text-red-600';
    }
  };

  const filteredTutorials = selectedCategory === 'all' 
    ? tutorials 
    : tutorials.filter(t => t.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'Tutti', count: tutorials.length },
    { id: 'beginner', label: 'Principiante', count: tutorials.filter(t => t.category === 'beginner').length },
    { id: 'intermediate', label: 'Intermedio', count: tutorials.filter(t => t.category === 'intermediate').length },
    { id: 'advanced', label: 'Avanzato', count: tutorials.filter(t => t.category === 'advanced').length },
    { id: 'masterclass', label: 'Masterclass', count: tutorials.filter(t => t.category === 'masterclass').length }
  ];

  const startTutorial = (tutorial: Tutorial) => {
    setActiveTutorial(tutorial);
    setCurrentStep(tutorial.completedSteps);
  };

  const continueTutorial = (tutorial: Tutorial) => {
    setActiveTutorial(tutorial);
    setCurrentStep(tutorial.completedSteps);
  };

  const completeTutorial = () => {
    if (activeTutorial) {
      setTutorials(prev => 
        prev.map(t => 
          t.id === activeTutorial.id 
            ? { ...t, isCompleted: true, completedSteps: t.steps }
            : t
        )
      );
      setActiveTutorial(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className="flex items-center gap-2"
          >
            {category.label}
            <Badge variant="secondary" className="text-xs">
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Featured Tutorial */}
      {filteredTutorials.filter(t => t.isPopular && !t.isCompleted)[0] && (
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Tutorial in Evidenza
              </CardTitle>
              <Badge className="bg-yellow-100 text-yellow-800">
                Popolare
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {(() => {
              const featured = filteredTutorials.filter(t => t.isPopular && !t.isCompleted)[0];
              return (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-lg text-blue-800">{featured.title}</h3>
                    <p className="text-blue-600">{featured.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-blue-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featured.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {featured.participants} partecipanti
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      {featured.rating}/5
                    </span>
                  </div>
                  
                  <Button 
                    onClick={() => startTutorial(featured)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Inizia Ora
                  </Button>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* Tutorials Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredTutorials.map((tutorial, index) => (
          <motion.div
            key={tutorial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`h-full transition-all hover:shadow-lg ${
              tutorial.isCompleted ? 'bg-green-50 border-green-200' : 'hover:border-blue-300'
            }`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {getTypeIcon(tutorial.type)}
                    </div>
                    <div>
                      <Badge className={getCategoryColor(tutorial.category)}>
                        {tutorial.category}
                      </Badge>
                      {tutorial.isPopular && (
                        <Badge variant="outline" className="ml-1 text-yellow-600 border-yellow-300">
                          Popolare
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {tutorial.isCompleted && (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  )}
                </div>
                
                <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                <p className="text-sm text-gray-600">{tutorial.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Progress Bar */}
                {tutorial.completedSteps > 0 && !tutorial.isCompleted && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso</span>
                      <span>{tutorial.completedSteps}/{tutorial.steps} passi</span>
                    </div>
                    <Progress value={(tutorial.completedSteps / tutorial.steps) * 100} />
                  </div>
                )}
                
                {/* Tutorial Info */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {tutorial.duration}min
                    </span>
                    <span className={`flex items-center gap-1 ${getDifficultyColor(tutorial.difficulty)}`}>
                      <BookOpen className="w-3 h-3" />
                      {tutorial.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span>{tutorial.rating}</span>
                  </div>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {tutorial.tags.slice(0, 3).map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                {/* Prerequisite */}
                {tutorial.prerequisite && (
                  <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                    Prerequisito: {tutorial.prerequisite}
                  </div>
                )}
                
                {/* Rewards */}
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <div className="font-medium mb-1">Ricompense:</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Award className="w-3 h-3 text-green-600" />
                      <span>{tutorial.rewards.points} punti</span>
                    </div>
                    {tutorial.rewards.badge && (
                      <div className="text-purple-600">🏆 {tutorial.rewards.badge}</div>
                    )}
                    {tutorial.rewards.unlock && (
                      <div className="text-blue-600">🔓 {tutorial.rewards.unlock}</div>
                    )}
                  </div>
                </div>
                
                {/* Action Button */}
                <div className="pt-2">
                  {tutorial.isCompleted ? (
                    <Button variant="outline" className="w-full" disabled>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Completato
                    </Button>
                  ) : tutorial.completedSteps > 0 ? (
                    <Button 
                      onClick={() => continueTutorial(tutorial)}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Continua Tutorial
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => startTutorial(tutorial)}
                      variant="outline" 
                      className="w-full hover:bg-blue-50"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Inizia Tutorial
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Active Tutorial Modal */}
      <AnimatePresence>
        {activeTutorial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setActiveTutorial(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">{activeTutorial.title}</h2>
                  <Button variant="ghost" onClick={() => setActiveTutorial(null)}>
                    ✕
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <Progress value={(currentStep / activeTutorial.steps) * 100} className="h-3" />
                  <div className="text-center">
                    <p className="text-lg">Passo {currentStep + 1} di {activeTutorial.steps}</p>
                    <p className="text-gray-600">
                      {currentStep === 0 && "Benvenuto nel tutorial! Iniziamo con i materiali necessari."}
                      {currentStep === 1 && "Ora prepariamo il nostro spazio di lavoro per la sicurezza."}
                      {currentStep === 2 && "Iniziamo a trasformare i nostri materiali passo dopo passo."}
                      {currentStep >= 3 && "Ottimo progresso! Continua così per completare il tuo progetto."}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                  >
                    Indietro
                  </Button>
                  
                  {currentStep < activeTutorial.steps - 1 ? (
                    <Button 
                      onClick={() => setCurrentStep(currentStep + 1)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Prossimo
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button 
                      onClick={completeTutorial}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Completa Tutorial
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
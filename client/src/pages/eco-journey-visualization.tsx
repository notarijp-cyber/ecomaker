import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin, 
  Route, 
  Flag, 
  Star, 
  Trophy,
  TreePine,
  Droplets,
  Zap,
  Recycle,
  Target,
  Calendar,
  TrendingUp,
  Award,
  CheckCircle,
  Clock,
  BarChart3,
  Sparkles,
  Mountain,
  Compass,
  Navigation,
  Globe
} from 'lucide-react';

interface JourneyMilestone {
  id: string;
  title: string;
  description: string;
  category: 'energy' | 'water' | 'waste' | 'transport' | 'community' | 'innovation';
  icon: React.ComponentType<any>;
  targetValue: number;
  currentValue: number;
  unit: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  points: number;
  completed: boolean;
  completedDate?: Date;
  estimatedCompletion: Date;
  prerequisites: string[];
  impact: {
    co2Reduction: number;
    costSaving: number;
    environmentalScore: number;
  };
}

interface JourneyPhase {
  id: string;
  name: string;
  description: string;
  color: string;
  milestones: string[];
  requiredProgress: number;
  currentProgress: number;
  unlocked: boolean;
  timeframe: string;
}

interface UserJourneyStats {
  totalDistance: number;
  milestonesCompleted: number;
  totalMilestones: number;
  currentPhase: string;
  journeyStartDate: Date;
  totalImpact: {
    co2Saved: number;
    moneySaved: number;
    materialsRecycled: number;
    energySaved: number;
  };
  streakDays: number;
  level: number;
  nextLevelProgress: number;
}

export default function EcoJourneyVisualization() {
  const [milestones, setMilestones] = useState<JourneyMilestone[]>([]);
  const [phases, setPhases] = useState<JourneyPhase[]>([]);
  const [userStats, setUserStats] = useState<UserJourneyStats | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'timeline' | 'map' | 'progress'>('timeline');

  useEffect(() => {
    // Initialize journey data
    const journeyMilestones: JourneyMilestone[] = [
      {
        id: 'waste_001',
        title: 'Primo Riciclo',
        description: 'Ricicla il tuo primo materiale e inizia il viaggio sostenibile',
        category: 'waste',
        icon: Recycle,
        targetValue: 1,
        currentValue: 1,
        unit: 'materiali',
        difficulty: 'beginner',
        points: 50,
        completed: true,
        completedDate: new Date('2024-06-01'),
        estimatedCompletion: new Date('2024-06-01'),
        prerequisites: [],
        impact: {
          co2Reduction: 0.5,
          costSaving: 2,
          environmentalScore: 10
        }
      },
      {
        id: 'waste_002',
        title: 'Riciclatore Abitudinario',
        description: 'Ricicla 10 materiali diversi in una settimana',
        category: 'waste',
        icon: Recycle,
        targetValue: 10,
        currentValue: 7,
        unit: 'materiali',
        difficulty: 'intermediate',
        points: 200,
        completed: false,
        estimatedCompletion: new Date('2024-06-25'),
        prerequisites: ['waste_001'],
        impact: {
          co2Reduction: 5.2,
          costSaving: 15,
          environmentalScore: 45
        }
      },
      {
        id: 'energy_001',
        title: 'Guardiano Energetico',
        description: 'Risparmia 100 kWh di energia con ottimizzazioni smart',
        category: 'energy',
        icon: Zap,
        targetValue: 100,
        currentValue: 67,
        unit: 'kWh',
        difficulty: 'intermediate',
        points: 300,
        completed: false,
        estimatedCompletion: new Date('2024-07-10'),
        prerequisites: ['waste_001'],
        impact: {
          co2Reduction: 45.6,
          costSaving: 25,
          environmentalScore: 85
        }
      },
      {
        id: 'water_001',
        title: 'Conservatore Idrico',
        description: 'Conserva 500 litri d\'acqua con tecniche intelligenti',
        category: 'water',
        icon: Droplets,
        targetValue: 500,
        currentValue: 312,
        unit: 'litri',
        difficulty: 'intermediate',
        points: 250,
        completed: false,
        estimatedCompletion: new Date('2024-07-05'),
        prerequisites: ['waste_001'],
        impact: {
          co2Reduction: 12.5,
          costSaving: 18,
          environmentalScore: 60
        }
      },
      {
        id: 'community_001',
        title: 'Influencer Verde',
        description: 'Coinvolgi 5 persone nel tuo viaggio sostenibile',
        category: 'community',
        icon: TreePine,
        targetValue: 5,
        currentValue: 2,
        unit: 'persone',
        difficulty: 'advanced',
        points: 500,
        completed: false,
        estimatedCompletion: new Date('2024-08-01'),
        prerequisites: ['waste_002', 'energy_001'],
        impact: {
          co2Reduction: 125.0,
          costSaving: 200,
          environmentalScore: 250
        }
      },
      {
        id: 'innovation_001',
        title: 'Innovatore Sostenibile',
        description: 'Crea una soluzione innovativa per un problema ambientale',
        category: 'innovation',
        icon: Sparkles,
        targetValue: 1,
        currentValue: 0,
        unit: 'soluzioni',
        difficulty: 'expert',
        points: 1000,
        completed: false,
        estimatedCompletion: new Date('2024-09-15'),
        prerequisites: ['community_001'],
        impact: {
          co2Reduction: 500.0,
          costSaving: 1000,
          environmentalScore: 1000
        }
      }
    ];

    const journeyPhases: JourneyPhase[] = [
      {
        id: 'explorer',
        name: 'Esploratore Verde',
        description: 'Scopri le basi della sostenibilità e inizia il tuo viaggio',
        color: 'from-green-400 to-emerald-600',
        milestones: ['waste_001'],
        requiredProgress: 1,
        currentProgress: 1,
        unlocked: true,
        timeframe: '0-1 mesi'
      },
      {
        id: 'practitioner',
        name: 'Praticante Sostenibile',
        description: 'Sviluppa abitudini costanti e amplia il tuo impatto',
        color: 'from-blue-400 to-cyan-600',
        milestones: ['waste_002', 'energy_001', 'water_001'],
        requiredProgress: 3,
        currentProgress: 0,
        unlocked: true,
        timeframe: '1-6 mesi'
      },
      {
        id: 'advocate',
        name: 'Sostenitore Attivo',
        description: 'Coinvolgi la community e diventa un leader del cambiamento',
        color: 'from-purple-400 to-indigo-600',
        milestones: ['community_001'],
        requiredProgress: 1,
        currentProgress: 0,
        unlocked: false,
        timeframe: '6-12 mesi'
      },
      {
        id: 'innovator',
        name: 'Innovatore del Futuro',
        description: 'Crea soluzioni innovative per un mondo più sostenibile',
        color: 'from-yellow-400 to-orange-600',
        milestones: ['innovation_001'],
        requiredProgress: 1,
        currentProgress: 0,
        unlocked: false,
        timeframe: '12+ mesi'
      }
    ];

    const stats: UserJourneyStats = {
      totalDistance: 2.4,
      milestonesCompleted: 1,
      totalMilestones: 6,
      currentPhase: 'practitioner',
      journeyStartDate: new Date('2024-06-01'),
      totalImpact: {
        co2Saved: 0.5,
        moneySaved: 2,
        materialsRecycled: 1,
        energySaved: 0
      },
      streakDays: 21,
      level: 2,
      nextLevelProgress: 65
    };

    setMilestones(journeyMilestones);
    setPhases(journeyPhases);
    setUserStats(stats);
  }, []);

  const getCategoryColor = (category: string) => {
    const colors = {
      waste: 'text-green-400 bg-green-500/20',
      energy: 'text-yellow-400 bg-yellow-500/20',
      water: 'text-blue-400 bg-blue-500/20',
      transport: 'text-purple-400 bg-purple-500/20',
      community: 'text-pink-400 bg-pink-500/20',
      innovation: 'text-orange-400 bg-orange-500/20'
    };
    return colors[category as keyof typeof colors] || 'text-gray-400 bg-gray-500/20';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: 'text-green-400',
      intermediate: 'text-yellow-400',
      advanced: 'text-orange-400',
      expert: 'text-red-400'
    };
    return colors[difficulty as keyof typeof colors] || 'text-gray-400';
  };

  const filteredMilestones = milestones.filter(milestone => 
    selectedCategory === 'all' || milestone.category === selectedCategory
  );

  if (!userStats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8 min-h-screen futuristic-bg">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent">
          Eco-Journey Progress Visualization
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Traccia il tuo viaggio sostenibile attraverso milestone interattive, fasi progressive e visualizzazioni coinvolgenti
        </p>
      </div>

      {/* User Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-morph border-green-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-300">Livello Attuale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="text-3xl font-bold text-white">{userStats.level}</div>
              <div className="flex-1">
                <Progress value={userStats.nextLevelProgress} className="h-2" />
                <div className="text-xs text-gray-400 mt-1">{userStats.nextLevelProgress}% al prossimo livello</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morph border-blue-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-300">Milestone Completate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {userStats.milestonesCompleted}/{userStats.totalMilestones}
            </div>
            <div className="text-xs text-blue-400">
              {Math.round((userStats.milestonesCompleted / userStats.totalMilestones) * 100)}% del viaggio
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morph border-purple-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">Streak Giorni</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-3xl font-bold text-white">{userStats.streakDays}</div>
              <div className="text-2xl">🔥</div>
            </div>
            <div className="text-xs text-purple-400">
              giorni consecutivi attivi
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morph border-orange-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-300">CO2 Risparmiata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {userStats.totalImpact.co2Saved.toFixed(1)}kg
            </div>
            <div className="text-xs text-orange-400">
              impatto ambientale totale
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Journey Phases */}
      <Card className="glass-morph border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-xl text-cyan-300 flex items-center">
            <Route className="w-5 h-5 mr-2" />
            Fasi del Viaggio Sostenibile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {phases.map((phase, index) => (
              <Card
                key={phase.id}
                className={`glass-morph transition-all duration-300 hover:scale-105 ${
                  phase.unlocked ? 'border-cyan-500/50' : 'border-gray-600/30 opacity-50'
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm text-white">{phase.name}</CardTitle>
                    {phase.currentProgress >= phase.requiredProgress && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-gray-300">{phase.description}</p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Progresso:</span>
                    <span className="text-cyan-400">
                      {phase.currentProgress}/{phase.requiredProgress}
                    </span>
                  </div>
                  
                  <Progress 
                    value={(phase.currentProgress / phase.requiredProgress) * 100} 
                    className="h-2"
                  />
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Timeframe:</span>
                    <span className="text-purple-400">{phase.timeframe}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* View Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'timeline' ? 'default' : 'outline'}
            onClick={() => setViewMode('timeline')}
            className="cyber-button-small"
          >
            <Calendar className="w-4 h-4 mr-1" />
            Timeline
          </Button>
          <Button
            variant={viewMode === 'map' ? 'default' : 'outline'}
            onClick={() => setViewMode('map')}
            className="cyber-button-small"
          >
            <MapPin className="w-4 h-4 mr-1" />
            Mappa
          </Button>
          <Button
            variant={viewMode === 'progress' ? 'default' : 'outline'}
            onClick={() => setViewMode('progress')}
            className="cyber-button-small"
          >
            <BarChart3 className="w-4 h-4 mr-1" />
            Progress
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('all')}
            className="cyber-button-small"
          >
            Tutti
          </Button>
          {['waste', 'energy', 'water', 'transport', 'community', 'innovation'].map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className="cyber-button-small"
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Milestone Visualization */}
      {viewMode === 'timeline' && (
        <Card className="glass-morph border-green-500/30">
          <CardHeader>
            <CardTitle className="text-xl text-green-300 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Timeline delle Milestone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {filteredMilestones.map((milestone, index) => {
                const IconComponent = milestone.icon;
                
                return (
                  <div key={milestone.id} className="relative">
                    {/* Timeline Line */}
                    {index < filteredMilestones.length - 1 && (
                      <div className="absolute left-6 top-16 w-0.5 h-20 bg-gradient-to-b from-cyan-500 to-transparent"></div>
                    )}
                    
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        milestone.completed 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                          : 'bg-gradient-to-r from-gray-600 to-gray-700'
                      }`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      
                      <Card className={`flex-1 glass-morph ${
                        milestone.completed ? 'border-green-500/30' : 'border-gray-600/30'
                      }`}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg text-white">{milestone.title}</CardTitle>
                            <div className="flex items-center space-x-2">
                              <Badge className={getCategoryColor(milestone.category)}>
                                {milestone.category}
                              </Badge>
                              <Badge className={getDifficultyColor(milestone.difficulty)}>
                                {milestone.difficulty}
                              </Badge>
                              {milestone.completed && (
                                <CheckCircle className="w-5 h-5 text-green-400" />
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-gray-300">{milestone.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <div className="text-sm text-gray-400">Progresso</div>
                              <div className="flex items-center space-x-2">
                                <Progress 
                                  value={(milestone.currentValue / milestone.targetValue) * 100} 
                                  className="flex-1 h-2"
                                />
                                <span className="text-sm text-cyan-400">
                                  {milestone.currentValue}/{milestone.targetValue} {milestone.unit}
                                </span>
                              </div>
                            </div>
                            
                            <div>
                              <div className="text-sm text-gray-400">Punti</div>
                              <div className="flex items-center space-x-1">
                                <Trophy className="w-4 h-4 text-yellow-400" />
                                <span className="text-yellow-400 font-semibold">{milestone.points}</span>
                              </div>
                            </div>
                            
                            <div>
                              <div className="text-sm text-gray-400">Stima Completamento</div>
                              <div className="text-sm text-white">
                                {milestone.estimatedCompletion.toLocaleDateString('it-IT')}
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="text-center">
                              <div className="text-green-400 font-semibold">-{milestone.impact.co2Reduction}kg</div>
                              <div className="text-xs text-gray-400">CO2</div>
                            </div>
                            <div className="text-center">
                              <div className="text-blue-400 font-semibold">€{milestone.impact.costSaving}</div>
                              <div className="text-xs text-gray-400">Risparmio</div>
                            </div>
                            <div className="text-center">
                              <div className="text-purple-400 font-semibold">{milestone.impact.environmentalScore}</div>
                              <div className="text-xs text-gray-400">Eco Score</div>
                            </div>
                          </div>
                          
                          {milestone.prerequisites.length > 0 && (
                            <div className="text-xs text-gray-400">
                              Prerequisiti: {milestone.prerequisites.join(', ')}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Map View */}
      {viewMode === 'map' && (
        <Card className="glass-morph border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-xl text-purple-300 flex items-center">
              <Navigation className="w-5 h-5 mr-2" />
              Mappa del Viaggio Sostenibile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
              {/* Journey Path */}
              <svg className="absolute inset-0 w-full h-full">
                <defs>
                  <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
                <path
                  d="M 50 300 Q 150 200 250 250 Q 350 300 450 200 Q 550 100 650 150"
                  stroke="url(#pathGradient)"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray="10,5"
                  className="animate-pulse"
                />
              </svg>
              
              {/* Milestone Markers */}
              {filteredMilestones.map((milestone, index) => {
                const IconComponent = milestone.icon;
                const positions = [
                  { x: 50, y: 300 },
                  { x: 250, y: 250 },
                  { x: 450, y: 200 },
                  { x: 650, y: 150 },
                  { x: 550, y: 100 },
                  { x: 750, y: 120 }
                ];
                const pos = positions[index] || { x: 100 + index * 120, y: 200 };
                
                return (
                  <div
                    key={milestone.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                    style={{ left: pos.x, top: pos.y }}
                    onClick={() => console.log('Milestone clicked:', milestone.title)}
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                      milestone.completed 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/50' 
                        : 'bg-gradient-to-r from-gray-600 to-gray-700 shadow-lg shadow-gray-500/30'
                    }`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center">
                      <div className="bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        {milestone.title}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {Math.round((milestone.currentValue / milestone.targetValue) * 100)}%
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Current Position Indicator */}
              <div className="absolute top-4 left-4 bg-black/80 text-white p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm">Posizione Attuale: {userStats.currentPhase}</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Distanza percorsa: {userStats.totalDistance}km
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress View */}
      {viewMode === 'progress' && (
        <Card className="glass-morph border-orange-500/30">
          <CardHeader>
            <CardTitle className="text-xl text-orange-300 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Analisi Progressi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Progressi per Categoria</h3>
                {['waste', 'energy', 'water', 'community', 'innovation'].map(category => {
                  const categoryMilestones = milestones.filter(m => m.category === category);
                  const completed = categoryMilestones.filter(m => m.completed).length;
                  const total = categoryMilestones.length;
                  const percentage = total > 0 ? (completed / total) * 100 : 0;
                  
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm capitalize text-gray-300">{category}</span>
                        <span className="text-sm text-cyan-400">{completed}/{total}</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Impatto Cumulativo</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg glass-morph">
                    <div className="flex items-center space-x-2">
                      <Globe className="w-5 h-5 text-green-400" />
                      <span className="text-sm text-gray-300">CO2 Risparmiata</span>
                    </div>
                    <span className="text-green-400 font-semibold">
                      {userStats.totalImpact.co2Saved.toFixed(1)}kg
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg glass-morph">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <span className="text-sm text-gray-300">Denaro Risparmiato</span>
                    </div>
                    <span className="text-yellow-400 font-semibold">
                      €{userStats.totalImpact.moneySaved}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg glass-morph">
                    <div className="flex items-center space-x-2">
                      <Recycle className="w-5 h-5 text-blue-400" />
                      <span className="text-sm text-gray-300">Materiali Riciclati</span>
                    </div>
                    <span className="text-blue-400 font-semibold">
                      {userStats.totalImpact.materialsRecycled}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
          .cyber-button-small {
            background: linear-gradient(to right, rgb(6 182 212), rgb(37 99 235));
            transition: all 0.3s ease;
            color: white;
            border: none;
            font-size: 0.875rem;
            padding: 0.5rem 1rem;
          }
          .cyber-button-small:hover {
            background: linear-gradient(to right, rgb(34 211 238), rgb(59 130 246));
            box-shadow: 0 10px 15px -3px rgba(6, 182, 212, 0.25);
          }
        `
      }} />
    </div>
  );
}
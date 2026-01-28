import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Leaf, 
  Droplets, 
  Zap, 
  Recycle,
  TrendingUp,
  Award,
  Target,
  Calendar,
  BarChart3,
  Sparkles,
  TreePine,
  Flame,
  Globe
} from "lucide-react";

interface SustainabilityMetric {
  category: string;
  current: number;
  target: number;
  unit: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  change: number;
  icon: any;
  color: string;
  description: string;
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  date?: Date;
  progress: number;
  requirement: number;
}

export function AdvancedSustainabilityTracker() {
  const [metrics, setMetrics] = useState<SustainabilityMetric[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [sustainabilityScore, setSustainabilityScore] = useState(0);

  useEffect(() => {
    initializeSustainabilityData();
    calculateSustainabilityScore();
  }, [selectedPeriod]);

  const initializeSustainabilityData = () => {
    const sustainabilityMetrics: SustainabilityMetric[] = [
      {
        category: 'Riduzione CO2',
        current: 156.7,
        target: 200,
        unit: 'kg',
        trend: 'increasing',
        change: 12.3,
        icon: Leaf,
        color: 'green',
        description: 'CO2 risparmiata attraverso progetti di riciclo'
      },
      {
        category: 'Risparmio Idrico',
        current: 2340,
        target: 3000,
        unit: 'litri',
        trend: 'increasing',
        change: 8.7,
        icon: Droplets,
        color: 'blue',
        description: 'Acqua risparmiata con sistemi di raccolta'
      },
      {
        category: 'Energia Rinnovabile',
        current: 485,
        target: 600,
        unit: 'kWh',
        trend: 'increasing',
        change: 15.2,
        icon: Zap,
        color: 'yellow',
        description: 'Energia prodotta da fonti rinnovabili'
      },
      {
        category: 'Materiali Riciclati',
        current: 78.5,
        target: 100,
        unit: 'kg',
        trend: 'increasing',
        change: 6.8,
        icon: Recycle,
        color: 'purple',
        description: 'Peso totale dei materiali riciclati'
      },
      {
        category: 'Biodiversità',
        current: 23,
        target: 30,
        unit: 'specie',
        trend: 'increasing',
        change: 4.5,
        icon: TreePine,
        color: 'emerald',
        description: 'Specie vegetali introdotte nel giardino'
      },
      {
        category: 'Riduzione Rifiuti',
        current: 89.2,
        target: 95,
        unit: '%',
        trend: 'increasing',
        change: 2.1,
        icon: Globe,
        color: 'orange',
        description: 'Percentuale di riduzione rifiuti domestici'
      }
    ];

    const sustainabilityAchievements: Achievement[] = [
      {
        id: 1,
        title: 'Eco Pioniere',
        description: 'Hai completato il tuo primo progetto di sostenibilità',
        icon: '🌱',
        unlocked: true,
        date: new Date('2025-05-15'),
        progress: 100,
        requirement: 1
      },
      {
        id: 2,
        title: 'Maestro del Riciclo',
        description: 'Hai riciclato 50kg di materiali',
        icon: '♻️',
        unlocked: true,
        date: new Date('2025-06-01'),
        progress: 100,
        requirement: 50
      },
      {
        id: 3,
        title: 'Guardiano del Carbonio',
        description: 'Riduci 100kg di CO2 attraverso i tuoi progetti',
        icon: '🍃',
        unlocked: true,
        date: new Date('2025-06-10'),
        progress: 100,
        requirement: 100
      },
      {
        id: 4,
        title: 'Innovatore Verde',
        description: 'Crea 10 progetti di sostenibilità innovativi',
        icon: '💡',
        unlocked: false,
        progress: 70,
        requirement: 10
      },
      {
        id: 5,
        title: 'Comunità Sostenibile',
        description: 'Coinvolgi 50 persone nei tuoi progetti',
        icon: '👥',
        unlocked: false,
        progress: 45,
        requirement: 50
      },
      {
        id: 6,
        title: 'Zero Waste Hero',
        description: 'Raggiungi il 95% di riduzione rifiuti',
        icon: '🎯',
        unlocked: false,
        progress: 94,
        requirement: 95
      }
    ];

    setMetrics(sustainabilityMetrics);
    setAchievements(sustainabilityAchievements);
  };

  const calculateSustainabilityScore = () => {
    // Advanced scoring algorithm based on multiple factors
    const baseScore = metrics.reduce((acc, metric) => {
      const completion = (metric.current / metric.target) * 100;
      return acc + Math.min(completion, 100);
    }, 0) / metrics.length;

    const trendBonus = metrics.reduce((acc, metric) => {
      return acc + (metric.trend === 'increasing' ? 5 : 0);
    }, 0) / metrics.length;

    const achievementBonus = achievements.filter(a => a.unlocked).length * 3;
    
    const finalScore = Math.min(100, baseScore + trendBonus + achievementBonus);
    setSustainabilityScore(Math.round(finalScore));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Eccellente';
    if (score >= 80) return 'Ottimo';
    if (score >= 70) return 'Buono';
    if (score >= 60) return 'Discreto';
    if (score >= 40) return 'Sufficiente';
    return 'Da migliorare';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'decreasing': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default: return <BarChart3 className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-green-600" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Tracker Sostenibilità Avanzato
          </h2>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Monitora il tuo impatto ambientale con metriche avanzate, obiettivi personalizzati e riconoscimenti per i tuoi successi.
        </p>
      </div>

      {/* Sustainability Score */}
      <Card className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Award className="h-6 w-6 text-green-600" />
            Punteggio Sostenibilità Globale
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className={`text-6xl font-bold ${getScoreColor(sustainabilityScore)}`}>
            {sustainabilityScore}
          </div>
          <div className="text-lg text-gray-600">{getScoreLabel(sustainabilityScore)}</div>
          <Progress value={sustainabilityScore} className="h-4 max-w-md mx-auto" />
          <div className="text-sm text-gray-500">
            Basato su 6 categorie di impatto ambientale e 3 achievement sbloccati
          </div>
        </CardContent>
      </Card>

      {/* Period Selector */}
      <div className="flex justify-center">
        <div className="flex bg-gray-100 rounded-lg p-1">
          {[
            { key: 'week', label: 'Settimana' },
            { key: 'month', label: 'Mese' },
            { key: 'year', label: 'Anno' }
          ].map(({ key, label }) => (
            <Button
              key={key}
              variant={selectedPeriod === key ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedPeriod(key as any)}
              className="transition-all"
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="metrics">Metriche Ambientali</TabsTrigger>
          <TabsTrigger value="achievements">Achievement & Obiettivi</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-6">
          {/* Environmental Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              const completion = (metric.current / metric.target) * 100;
              
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-5 w-5 text-${metric.color}-600`} />
                        <CardTitle className="text-lg">{metric.category}</CardTitle>
                      </div>
                      {getTrendIcon(metric.trend)}
                    </div>
                    <CardDescription>{metric.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Current vs Target */}
                    <div className="flex justify-between items-end">
                      <div>
                        <div className={`text-2xl font-bold text-${metric.color}-600`}>
                          {metric.current}
                        </div>
                        <div className="text-sm text-gray-600">
                          di {metric.target} {metric.unit}
                        </div>
                      </div>
                      <Badge 
                        className={
                          metric.trend === 'increasing' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }
                      >
                        {metric.trend === 'increasing' ? '+' : ''}{metric.change}%
                      </Badge>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progresso</span>
                        <span>{Math.round(completion)}%</span>
                      </div>
                      <Progress value={completion} className="h-3" />
                    </div>

                    {/* Status */}
                    <div className="text-center">
                      {completion >= 100 ? (
                        <Badge className="bg-green-100 text-green-800">
                          🎯 Obiettivo Raggiunto!
                        </Badge>
                      ) : completion >= 80 ? (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          🔥 Quasi Fatto!
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          💪 In Progresso
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Monthly Trend Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Andamento Mensile
              </CardTitle>
              <CardDescription>
                Visualizzazione dei progressi nelle diverse categorie ambientali
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                  <div>Grafico interattivo dei trend mensili</div>
                  <div className="text-sm">Implementazione con libreria charting</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          {/* Achievement Progress Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardContent className="p-4 text-center">
                <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">
                  {achievements.filter(a => a.unlocked).length}
                </div>
                <div className="text-sm text-gray-600">Achievement Sbloccati</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-blue-50 to-cyan-50">
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">
                  {achievements.filter(a => !a.unlocked).length}
                </div>
                <div className="text-sm text-gray-600">Obiettivi Attivi</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardContent className="p-4 text-center">
                <Sparkles className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(achievements.reduce((acc, a) => acc + a.progress, 0) / achievements.length)}%
                </div>
                <div className="text-sm text-gray-600">Progresso Medio</div>
              </CardContent>
            </Card>
          </div>

          {/* Achievements List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement) => (
              <Card 
                key={achievement.id} 
                className={`transition-all duration-300 ${
                  achievement.unlocked 
                    ? 'border-green-200 bg-green-50' 
                    : 'hover:shadow-md'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div>
                        <CardTitle className="text-lg">{achievement.title}</CardTitle>
                        <CardDescription>{achievement.description}</CardDescription>
                      </div>
                    </div>
                    {achievement.unlocked && (
                      <Badge className="bg-green-100 text-green-800">
                        ✓ Completato
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progresso</span>
                      <span>{achievement.progress}%</span>
                    </div>
                    <Progress value={achievement.progress} className="h-2" />
                  </div>

                  {/* Achievement Details */}
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Obiettivo: {achievement.requirement}</span>
                    {achievement.unlocked && achievement.date && (
                      <span>Completato: {achievement.date.toLocaleDateString()}</span>
                    )}
                  </div>

                  {/* Action Button */}
                  {!achievement.unlocked && (
                    <Button size="sm" variant="outline" className="w-full">
                      <Target className="h-4 w-4 mr-2" />
                      Lavora per questo obiettivo
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
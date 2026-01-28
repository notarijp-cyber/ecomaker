import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Lightbulb, 
  Leaf, 
  Recycle, 
  Star,
  Clock,
  Filter,
  Sparkles,
  ChevronRight,
  User,
  Settings,
  BookOpen,
  Heart,
  BarChart3
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface UserProfile {
  id: string;
  preferences: {
    materials: string[];
    difficulty: 'principiante' | 'intermedio' | 'avanzato';
    timeAvailable: number; // minuti
    interests: string[];
    sustainabilityGoals: string[];
  };
  history: {
    completedProjects: number;
    favoriteMaterials: string[];
    averageProjectTime: number;
    co2Saved: number;
    strongestSkills: string[];
  };
  personalityType: string;
  engagement: {
    loginStreak: number;
    lastActivity: Date;
    preferredTime: string;
    sessionDuration: number;
  };
}

interface SmartRecommendation {
  id: string;
  type: 'progetto' | 'materiale' | 'sfida' | 'apprendimento' | 'community';
  title: string;
  description: string;
  confidenceScore: number;
  reasonings: string[];
  category: string;
  estimatedTime: number;
  difficulty: string;
  sustainabilityImpact: number;
  personalizedScore: number;
  trending: boolean;
  newForUser: boolean;
  urgency: 'bassa' | 'media' | 'alta';
  materials?: string[];
  steps?: string[];
  expectedOutcome: string;
  tags: string[];
}

interface AIInsight {
  id: string;
  title: string;
  insight: string;
  actionable: boolean;
  category: 'comportamento' | 'preferenze' | 'opportunità' | 'tendenze';
  confidence: number;
  priority: 'bassa' | 'media' | 'alta';
  suggestedActions: string[];
}

export default function PersonalizedRecommendations() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('tutti');
  const [isPersonalizing, setIsPersonalizing] = useState(false);

  useEffect(() => {
    // Simula caricamento profilo utente personalizzato
    const profileData: UserProfile = {
      id: 'user_001',
      preferences: {
        materials: ['plastica', 'carta', 'vetro'],
        difficulty: 'intermedio',
        timeAvailable: 45,
        interests: ['arredamento', 'giardino', 'arte'],
        sustainabilityGoals: ['riduzione_co2', 'zero_waste', 'economia_circolare']
      },
      history: {
        completedProjects: 23,
        favoriteMaterials: ['plastica_pet', 'cartone', 'latta'],
        averageProjectTime: 38,
        co2Saved: 47.2,
        strongestSkills: ['assemblaggio', 'design', 'pittura']
      },
      personalityType: 'creativo_pragmatico',
      engagement: {
        loginStreak: 12,
        lastActivity: new Date(),
        preferredTime: 'sera',
        sessionDuration: 28
      }
    };

    // Raccomandazioni AI personalizzate
    const recommendationsData: SmartRecommendation[] = [
      {
        id: 'rec_001',
        type: 'progetto',
        title: 'Lampada da Tavolo con Bottiglie di Vetro',
        description: 'Trasforma le tue bottiglie di vetro in una elegante lampada da tavolo con sistema LED',
        confidenceScore: 94,
        reasonings: [
          'Hai esperienza con il vetro (8 progetti completati)',
          'Ti piacciono i progetti di arredamento (85% dei tuoi progetti)',
          'Tempo stimato (35 min) perfetto per le tue sessioni',
          'Alta sostenibilità ambientale (+15kg CO2 risparmiata)'
        ],
        category: 'arredamento',
        estimatedTime: 35,
        difficulty: 'intermedio',
        sustainabilityImpact: 89,
        personalizedScore: 94,
        trending: true,
        newForUser: false,
        urgency: 'media',
        materials: ['bottiglia_vetro', 'led_strip', 'cavo_elettrico', 'interruttore'],
        steps: [
          'Pulisci e prepara la bottiglia',
          'Installa il sistema LED interno',
          'Crea il supporto di base',
          'Assembla e testa il funzionamento'
        ],
        expectedOutcome: 'Lampada funzionale che riduce i rifiuti di vetro',
        tags: ['illuminazione', 'design', 'riciclo_vetro', 'eco_friendly']
      },
      {
        id: 'rec_002',
        type: 'sfida',
        title: 'Sfida Zero Plastica Monouso',
        description: 'Elimina completamente la plastica monouso per 21 giorni consecutivi',
        confidenceScore: 87,
        reasonings: [
          'Sei già a 12 giorni di streak quotidiano',
          'Obiettivo zero_waste nel tuo profilo',
          'Precedenti sfide completate con successo',
          'Comunità attiva per supporto (2.3k partecipanti)'
        ],
        category: 'sostenibilità',
        estimatedTime: 15,
        difficulty: 'intermedio',
        sustainabilityImpact: 95,
        personalizedScore: 87,
        trending: false,
        newForUser: true,
        urgency: 'alta',
        expectedOutcome: 'Riduzione significativa impatto ambientale personale',
        tags: ['zero_waste', 'stile_vita', 'community', 'impatto_alto']
      },
      {
        id: 'rec_003',
        type: 'apprendimento',
        title: 'Masterclass: Tecniche Avanzate di Upcycling',
        description: 'Corso online per tecniche professionali di trasformazione materiali',
        confidenceScore: 82,
        reasonings: [
          'Livello intermedio raggiunto (23 progetti)',
          'Interesse per miglioramento skills evidenziato',
          'Tempo medio sessione (28 min) adatto per lezioni',
          'Focus su creatività allineato con personalità'
        ],
        category: 'educazione',
        estimatedTime: 120,
        difficulty: 'avanzato',
        sustainabilityImpact: 75,
        personalizedScore: 82,
        trending: true,
        newForUser: true,
        urgency: 'bassa',
        expectedOutcome: 'Competenze avanzate per progetti più complessi',
        tags: ['formazione', 'competenze', 'upcycling', 'professionale']
      },
      {
        id: 'rec_004',
        type: 'community',
        title: 'Evento: Swap Party Locale',
        description: 'Organizza uno scambio di materiali e oggetti nel tuo quartiere',
        confidenceScore: 78,
        reasonings: [
          'Alta attività nella sezione community',
          'Precedenti eventi organizzati con successo',
          'Obiettivo economia_circolare nel profilo',
          'Network locale identificato (23 utenti zona)'
        ],
        category: 'sociale',
        estimatedTime: 180,
        difficulty: 'intermedio',
        sustainabilityImpact: 88,
        personalizedScore: 78,
        trending: false,
        newForUser: false,
        urgency: 'media',
        expectedOutcome: 'Rete locale più forte e materiali condivisi',
        tags: ['evento', 'comunità', 'scambio', 'networking']
      },
      {
        id: 'rec_005',
        type: 'materiale',
        title: 'Nuova Categoria: Pneumatici Usati',
        description: 'Esplora il potenziale degli pneumatici per progetti di giardinaggio',
        confidenceScore: 71,
        reasonings: [
          'Interesse per progetti giardino (30% portfolio)',
          'Pneumatici abbondanti nella tua zona',
          'Impatto ambientale significativo (+25kg CO2)',
          'Progetti pneumatici trending (+145% ultimo mese)'
        ],
        category: 'giardino',
        estimatedTime: 60,
        difficulty: 'intermedio',
        sustainabilityImpact: 91,
        personalizedScore: 71,
        trending: true,
        newForUser: true,
        urgency: 'bassa',
        materials: ['pneumatico_auto', 'terra', 'semi', 'vernice_atossica'],
        expectedOutcome: 'Fioriere durature e originali per il giardino',
        tags: ['giardinaggio', 'pneumatici', 'fioriere', 'outdoor']
      }
    ];

    // AI Insights personalizzati
    const insightsData: AIInsight[] = [
      {
        id: 'insight_001',
        title: 'Pattern di Produttività Ottimale',
        insight: 'I tuoi progetti più riusciti vengono completati tra le 20:00-22:00 con sessioni di 35-45 minuti',
        actionable: true,
        category: 'comportamento',
        confidence: 92,
        priority: 'alta',
        suggestedActions: [
          'Pianifica progetti complessi in orario serale',
          'Dividi progetti lunghi in sessioni da 40 minuti',
          'Imposta promemoria alle 19:45 per iniziare'
        ]
      },
      {
        id: 'insight_002',
        title: 'Potenziale di Crescita Competenze',
        insight: 'Hai una forte affinità per il design ma potresti migliorare nelle tecniche di assemblaggio meccanico',
        actionable: true,
        category: 'opportunità',
        confidence: 85,
        priority: 'media',
        suggestedActions: [
          'Segui tutorial specifici per assemblaggio',
          'Prova progetti con componenti meccanici',
          'Unisciti al gruppo "Meccanici del Riciclo"'
        ]
      },
      {
        id: 'insight_003',
        title: 'Trend di Sostenibilità Personale',
        insight: 'Negli ultimi 3 mesi hai aumentato il tuo impatto ambientale positivo del 340%',
        actionable: false,
        category: 'tendenze',
        confidence: 96,
        priority: 'bassa',
        suggestedActions: [
          'Condividi i tuoi progressi sui social',
          'Inspira altri utenti con i tuoi risultati'
        ]
      }
    ];

    setUserProfile(profileData);
    setRecommendations(recommendationsData);
    setAiInsights(insightsData);
  }, []);

  const personalizeRecommendations = async () => {
    setIsPersonalizing(true);
    // Simula AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Riordina raccomandazioni basandosi su nuovo input
    const shuffled = [...recommendations].sort(() => Math.random() - 0.5);
    setRecommendations(shuffled);
    setIsPersonalizing(false);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'alta': return 'border-l-red-500 bg-red-500/10';
      case 'media': return 'border-l-yellow-500 bg-yellow-500/10';
      case 'bassa': return 'border-l-green-500 bg-green-500/10';
      default: return 'border-l-gray-500 bg-gray-500/10';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'progetto': return Target;
      case 'sfida': return Star;
      case 'apprendimento': return BookOpen;
      case 'community': return User;
      case 'materiale': return Recycle;
      default: return Lightbulb;
    }
  };

  const filteredRecommendations = selectedCategory === 'tutti' 
    ? recommendations 
    : recommendations.filter(r => r.category === selectedCategory);

  const categories = ['tutti', 'arredamento', 'sostenibilità', 'educazione', 'sociale', 'giardino'];

  if (!userProfile) {
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
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
          Raccomandazioni AI Personalizzate
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Scopri progetti, sfide e opportunità su misura per te grazie all'intelligenza artificiale avanzata
        </p>
      </div>

      {/* User Profile Overview */}
      <Card className="glass-morph border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-cyan-300 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Il Tuo Profilo Personalizzato
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Statistiche Personali</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Progetti Completati</span>
                  <span className="text-white font-medium">{userProfile.history.completedProjects}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">CO2 Risparmiata</span>
                  <span className="text-green-400 font-medium">{userProfile.history.co2Saved}kg</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Streak Giorni</span>
                  <span className="text-orange-400 font-medium">{userProfile.engagement.loginStreak}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Preferenze</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-400 text-sm">Materiali Preferiti</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {userProfile.preferences.materials.map(material => (
                      <Badge key={material} variant="outline" className="text-xs">
                        {material}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Interessi</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {userProfile.preferences.interests.map(interest => (
                      <Badge key={interest} variant="outline" className="text-xs bg-cyan-500/20">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">AI Profiling</h3>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-gray-400">Tipo Personalità</span>
                  <div className="text-purple-400 font-medium">{userProfile.personalityType}</div>
                </div>
                <div className="text-sm">
                  <span className="text-gray-400">Livello Esperienza</span>
                  <div className="text-blue-400 font-medium">{userProfile.preferences.difficulty}</div>
                </div>
                <div className="text-sm">
                  <span className="text-gray-400">Orario Ottimale</span>
                  <div className="text-yellow-400 font-medium">{userProfile.engagement.preferredTime}</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="recommendations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 glass-morph">
          <TabsTrigger value="recommendations" className="cyber-button">
            <Sparkles className="w-4 h-4 mr-2" />
            Raccomandazioni
          </TabsTrigger>
          <TabsTrigger value="insights" className="cyber-button">
            <Brain className="w-4 h-4 mr-2" />
            AI Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-6">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Categoria:</span>
            </div>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="cyber-button text-xs"
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
            
            <Button 
              onClick={personalizeRecommendations}
              disabled={isPersonalizing}
              className="cyber-button ml-auto"
            >
              {isPersonalizing ? (
                <>
                  <Settings className="w-4 h-4 mr-2 animate-spin" />
                  Personalizzando...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Aggiorna AI
                </>
              )}
            </Button>
          </div>

          {/* Recommendations */}
          <div className="space-y-6">
            {filteredRecommendations.map((rec, index) => {
              const IconComponent = getTypeIcon(rec.type);
              return (
                <Card key={rec.id} className={`glass-morph border-l-4 ${getUrgencyColor(rec.urgency)}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 rounded-full bg-cyan-500/20">
                          <IconComponent className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <CardTitle className="text-lg text-white">{rec.title}</CardTitle>
                            {rec.trending && <Badge className="bg-red-500 text-white text-xs">Trending</Badge>}
                            {rec.newForUser && <Badge className="bg-green-500 text-white text-xs">Nuovo</Badge>}
                          </div>
                          <CardDescription className="text-gray-300">{rec.description}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-2xl font-bold text-cyan-400">{rec.personalizedScore}%</div>
                        <div className="text-xs text-gray-400">Match AI</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Tempo</span>
                        <div className="text-white font-medium flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {rec.estimatedTime}min
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-400">Difficoltà</span>
                        <div className="text-yellow-400 font-medium">{rec.difficulty}</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Impatto</span>
                        <div className="text-green-400 font-medium flex items-center">
                          <Leaf className="w-3 h-3 mr-1" />
                          {rec.sustainabilityImpact}%
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-400">Urgenza</span>
                        <div className="text-white font-medium">{rec.urgency}</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-2">Perché è perfetto per te:</h4>
                        <ul className="space-y-1">
                          {rec.reasonings.map((reason, idx) => (
                            <li key={idx} className="text-sm text-gray-300 flex items-start">
                              <ChevronRight className="w-3 h-3 mr-1 mt-0.5 text-cyan-400 flex-shrink-0" />
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-white mb-2">Risultato Atteso:</h4>
                        <p className="text-sm text-gray-300">{rec.expectedOutcome}</p>
                      </div>

                      {rec.materials && (
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-2">Materiali Necessari:</h4>
                          <div className="flex flex-wrap gap-1">
                            {rec.materials.map(material => (
                              <Badge key={material} variant="outline" className="text-xs">
                                {material}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1">
                        {rec.tags.map(tag => (
                          <Badge key={tag} className="bg-gray-700 text-gray-300 text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                      <div className="flex items-center space-x-2">
                        <div className="text-xs text-gray-400">Confidenza AI:</div>
                        <Progress value={rec.confidenceScore} className="w-20 h-2" />
                        <div className="text-xs text-white">{rec.confidenceScore}%</div>
                      </div>
                      <Button className="cyber-button">
                        Inizia Ora
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiInsights.map(insight => (
              <Card key={insight.id} className="glass-morph border-cyan-500/30">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg text-white">{insight.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        className={`text-xs ${insight.priority === 'alta' ? 'bg-red-500' : 
                                              insight.priority === 'media' ? 'bg-yellow-500' : 'bg-green-500'}`}
                      >
                        {insight.priority}
                      </Badge>
                      <div className="text-sm text-cyan-400">{insight.confidence}%</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300">{insight.insight}</p>
                  
                  {insight.actionable && insight.suggestedActions.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">Azioni Suggerite:</h4>
                      <ul className="space-y-1">
                        {insight.suggestedActions.map((action, idx) => (
                          <li key={idx} className="text-sm text-gray-300 flex items-start">
                            <ChevronRight className="w-3 h-3 mr-1 mt-0.5 text-cyan-400 flex-shrink-0" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {insight.category}
                    </Badge>
                    {insight.actionable && (
                      <Button size="sm" className="cyber-button">
                        <Target className="w-3 h-3 mr-1" />
                        Applica
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

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
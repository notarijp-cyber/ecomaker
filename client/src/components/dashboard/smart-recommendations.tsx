import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Lightbulb, 
  TrendingUp, 
  Zap,
  Target,
  Clock,
  Star,
  ArrowRight,
  ChevronRight,
  Sparkles
} from "lucide-react";

interface SmartRecommendation {
  id: number;
  type: 'project' | 'material' | 'technique' | 'event';
  title: string;
  description: string;
  aiConfidence: number;
  impact: 'low' | 'medium' | 'high';
  timeEstimate: string;
  difficulty: 'facile' | 'medio' | 'avanzato';
  materials: string[];
  potentialSavings: number;
  carbonReduction: number;
  trending: boolean;
  personalizedReason: string;
}

export function SmartRecommendations() {
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate AI-powered recommendations based on user behavior
    generateSmartRecommendations();
  }, []);

  const generateSmartRecommendations = () => {
    setIsLoading(true);
    
    // Simulate AI analysis delay
    setTimeout(() => {
      const smartRecs: SmartRecommendation[] = [
        {
          id: 1,
          type: 'project',
          title: 'Giardino Verticale Smart con Sensori IoT',
          description: 'Crea un sistema di irrigazione automatico utilizzando bottiglie di plastica e sensori di umidità.',
          aiConfidence: 94,
          impact: 'high',
          timeEstimate: '3-4 ore',
          difficulty: 'medio',
          materials: ['Bottiglie PET', 'Arduino Nano', 'Sensori umidità', 'Tubo micro'],
          potentialSavings: 150,
          carbonReduction: 12,
          trending: true,
          personalizedReason: 'Basato sui tuoi progetti passati con elettronica e giardinaggio'
        },
        {
          id: 2,
          type: 'technique',
          title: 'Stampa 3D con Filamento Riciclato',
          description: 'Tecnica avanzata per trasformare bottiglie PET in filamento per stampante 3D di qualità.',
          aiConfidence: 87,
          impact: 'high',
          timeEstimate: '2 ore setup + produzione continua',
          difficulty: 'avanzato',
          materials: ['Bottiglie PET', 'Estrusore filamento', 'Termometro digitale'],
          potentialSavings: 300,
          carbonReduction: 25,
          trending: true,
          personalizedReason: 'Hai mostrato interesse per progetti di stampa 3D sostenibile'
        },
        {
          id: 3,
          type: 'material',
          title: 'Bioplastica da Scarti Alimentari',
          description: 'Innovativo processo per creare bioplastica biodegradabile da bucce di patate e mais.',
          aiConfidence: 91,
          impact: 'medium',
          timeEstimate: '1-2 ore',
          difficulty: 'facile',
          materials: ['Bucce di patate', 'Amido di mais', 'Glicerina', 'Aceto'],
          potentialSavings: 80,
          carbonReduction: 8,
          trending: false,
          personalizedReason: 'Perfetto per il tuo interesse nella ricerca sui materiali sostenibili'
        },
        {
          id: 4,
          type: 'project',
          title: 'Sistema di Raccolta Acqua Piovana Modulare',
          description: 'Design modulare per raccogliere e filtrare acqua piovana utilizzando contenitori riciclati.',
          aiConfidence: 89,
          impact: 'high',
          timeEstimate: '4-6 ore',
          difficulty: 'medio',
          materials: ['Contenitori grandi', 'Filtri sabbia', 'Tubi PVC', 'Rubinetti'],
          potentialSavings: 200,
          carbonReduction: 15,
          trending: false,
          personalizedReason: 'Allineato con i tuoi progetti di sostenibilità domestica'
        },
        {
          id: 5,
          type: 'event',
          title: 'Workshop Collaborativo: Mobili da Pallet',
          description: 'Evento di gruppo per creare mobili di design utilizzando pallet dismessi.',
          aiConfidence: 85,
          impact: 'medium',
          timeEstimate: 'Evento di 1 giornata',
          difficulty: 'facile',
          materials: ['Pallet dismessi', 'Carta vetrata', 'Viti', 'Cuscini'],
          potentialSavings: 500,
          carbonReduction: 30,
          trending: true,
          personalizedReason: 'Hai partecipato a eventi di community making simili'
        }
      ];
      
      setRecommendations(smartRecs);
      setIsLoading(false);
    }, 1500);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'facile': return 'bg-green-100 text-green-800';
      case 'medio': return 'bg-yellow-100 text-yellow-800';
      case 'avanzato': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'project': return <Lightbulb className="h-4 w-4" />;
      case 'material': return <Zap className="h-4 w-4" />;
      case 'technique': return <Target className="h-4 w-4" />;
      case 'event': return <Star className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const filteredRecommendations = selectedCategory === 'all' 
    ? recommendations 
    : recommendations.filter(rec => rec.type === selectedCategory);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <h3 className="text-lg font-semibold">AI sta analizzando i tuoi dati...</h3>
          <p className="text-gray-600">Generando raccomandazioni personalizzate</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-purple-600" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Raccomandazioni AI Personalizzate
          </h2>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Il nostro sistema AI analizza i tuoi progetti, materiali e interessi per suggerirti nuove opportunità di sostenibilità.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {[
          { key: 'all', label: 'Tutti', icon: Brain },
          { key: 'project', label: 'Progetti', icon: Lightbulb },
          { key: 'material', label: 'Materiali', icon: Zap },
          { key: 'technique', label: 'Tecniche', icon: Target },
          { key: 'event', label: 'Eventi', icon: Star }
        ].map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            variant={selectedCategory === key ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(key)}
            className="flex items-center gap-2"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Button>
        ))}
      </div>

      {/* AI Insights Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
          <CardContent className="p-4 text-center">
            <Brain className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">94%</div>
            <div className="text-sm text-gray-600">Precisione AI</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">€1,230</div>
            <div className="text-sm text-gray-600">Risparmio Potenziale</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardContent className="p-4 text-center">
            <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">90kg</div>
            <div className="text-sm text-gray-600">CO2 Risparmiata</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-orange-50 to-yellow-50">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">12h</div>
            <div className="text-sm text-gray-600">Tempo Totale</div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredRecommendations.map((rec) => (
          <Card key={rec.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(rec.type)}
                  <Badge variant="outline" className="text-xs">
                    {rec.type}
                  </Badge>
                  {rec.trending && (
                    <Badge className="bg-red-500 text-white text-xs">
                      🔥 Trending
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">AI Confidence</div>
                  <div className="text-sm font-bold text-purple-600">{rec.aiConfidence}%</div>
                </div>
              </div>
              <CardTitle className="text-lg leading-tight">{rec.title}</CardTitle>
              <CardDescription className="text-sm">
                {rec.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* AI Confidence Bar */}
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Precisione AI</span>
                  <span>{rec.aiConfidence}%</span>
                </div>
                <Progress value={rec.aiConfidence} className="h-2" />
              </div>

              {/* Key Metrics */}
              <div className="flex justify-between items-center text-sm">
                <div className="flex gap-2">
                  <Badge className={getImpactColor(rec.impact)}>
                    {rec.impact}
                  </Badge>
                  <Badge className={getDifficultyColor(rec.difficulty)}>
                    {rec.difficulty}
                  </Badge>
                </div>
                <div className="text-gray-600">{rec.timeEstimate}</div>
              </div>

              {/* Impact Metrics */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="font-bold text-green-600">€{rec.potentialSavings}</div>
                  <div className="text-xs text-gray-600">Risparmio</div>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="font-bold text-blue-600">{rec.carbonReduction}kg</div>
                  <div className="text-xs text-gray-600">CO2 evitata</div>
                </div>
              </div>

              {/* Materials Preview */}
              <div>
                <div className="text-xs text-gray-600 mb-1">Materiali necessari:</div>
                <div className="flex flex-wrap gap-1">
                  {rec.materials.slice(0, 3).map((material, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {material}
                    </Badge>
                  ))}
                  {rec.materials.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{rec.materials.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Personalization Reason */}
              <div className="bg-purple-50 p-3 rounded text-xs">
                <div className="flex items-center gap-1 text-purple-600 mb-1">
                  <Brain className="h-3 w-3" />
                  <span className="font-medium">Perché te lo consigliamo:</span>
                </div>
                <div className="text-gray-700">{rec.personalizedReason}</div>
              </div>

              {/* Action Button */}
              <Button className="w-full group" size="sm">
                Scopri di più
                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More Button */}
      {filteredRecommendations.length > 0 && (
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={generateSmartRecommendations}
            className="flex items-center gap-2"
          >
            <Brain className="h-4 w-4" />
            Genera nuove raccomandazioni AI
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
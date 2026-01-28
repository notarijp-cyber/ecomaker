import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Sparkles, Clock, TrendingUp, Target, ArrowRight, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIRecommendation {
  id: string;
  type: 'project' | 'material' | 'optimization' | 'learning' | 'community';
  title: string;
  description: string;
  reason: string;
  difficulty: 'Facile' | 'Medio' | 'Difficile';
  estimatedTime: number;
  timeUnit: string;
  impactScore: number;
  materials?: string[];
  tools?: string[];
  actionUrl?: string;
  actionText?: string;
  priority: 'low' | 'medium' | 'high';
  confidence: number;
}

interface AIRecommendationsProps {
  userId: number;
}

export function AIRecommendations({ userId }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: projects } = useQuery({ queryKey: ['/api/projects'] });
  const { data: materials } = useQuery({ queryKey: ['/api/materials'] });
  const { data: impact } = useQuery({ queryKey: ['/api/environmental-impact', userId] });

  // Generate AI-powered recommendations based on user data
  const generateRecommendations = () => {
    if (!projects || !materials || !impact) return [];

    const userProjects = (projects || []).filter((p: any) => p.userId === userId);
    const availableMaterials = (materials || []).filter((m: any) => m.isAvailable);
    
    const recommendations: AIRecommendation[] = [];

    // Project recommendations based on completed projects and available materials
    if (userProjects.some((p: any) => p.name.toLowerCase().includes('lampada'))) {
      recommendations.push({
        id: 'lighting-series',
        type: 'project',
        title: 'Serie Illuminazione Sostenibile',
        description: 'Crea una collezione di lampade uniche utilizzando diversi materiali riciclati per diversi ambienti della casa.',
        reason: 'Hai già creato una lampada con successo. Espandi questa competenza!',
        difficulty: 'Medio',
        estimatedTime: 6,
        timeUnit: 'ore',
        impactScore: 85,
        materials: ['Bottiglie di vetro', 'Lattine di alluminio', 'Cartone ondulato'],
        tools: ['Trapano', 'LED', 'Trasformatore'],
        actionUrl: '/create-project',
        actionText: 'Inizia Serie',
        priority: 'high',
        confidence: 92
      });
    }

    // Material optimization suggestions
    const plasticMaterials = availableMaterials.filter((m: any) => 
      m.name.toLowerCase().includes('plastica')
    );
    
    if (plasticMaterials.length >= 3) {
      recommendations.push({
        id: 'plastic-optimization',
        type: 'optimization',
        title: 'Ottimizzazione Materiali Plastici',
        description: 'Hai accumulato molti materiali plastici. Trasformali in organizer modulari per la casa.',
        reason: `${plasticMaterials.length} tipi di plastica disponibili - perfetti per progetti modulari`,
        difficulty: 'Facile',
        estimatedTime: 3,
        timeUnit: 'ore',
        impactScore: 75,
        materials: plasticMaterials.slice(0, 3).map((m: any) => m.name),
        tools: ['Taglierino', 'Colla', 'Righello'],
        actionUrl: '/inventory',
        actionText: 'Vedi Materiali',
        priority: 'medium',
        confidence: 88
      });
    }

    // Learning recommendations based on user progress
    if (impact && (impact as any).materialsRecycled > 20 && userProjects.length < 3) {
      recommendations.push({
        id: 'advanced-techniques',
        type: 'learning',
        title: 'Tecniche Avanzate di Upcycling',
        description: 'Impara tecniche professionali di restauro e trasformazione per progetti più complessi.',
        reason: 'Hai dimostrato dedizione nel riciclo. È ora di elevare le tue competenze!',
        difficulty: 'Difficile',
        estimatedTime: 12,
        timeUnit: 'ore',
        impactScore: 95,
        actionUrl: '/material-science',
        actionText: 'Inizia Corso',
        priority: 'medium',
        confidence: 85
      });
    }

    // Community engagement suggestions
    if (userProjects.length >= 2) {
      recommendations.push({
        id: 'community-workshop',
        type: 'community',
        title: 'Organizza Workshop Comunitario',
        description: 'Condividi le tue competenze organizzando un workshop per altri eco-makers nella tua zona.',
        reason: 'La tua esperienza può ispirare altri. Diventa un leader della sostenibilità!',
        difficulty: 'Medio',
        estimatedTime: 8,
        timeUnit: 'ore',
        impactScore: 100,
        actionUrl: '/events',
        actionText: 'Crea Evento',
        priority: 'high',
        confidence: 78
      });
    }

    // Seasonal and trending recommendations
    const currentMonth = new Date().getMonth();
    if (currentMonth >= 2 && currentMonth <= 4) { // Primavera
      recommendations.push({
        id: 'spring-garden',
        type: 'project',
        title: 'Giardino Verticale Primaverile',
        description: 'Crea un sistema di coltivazione verticale usando materiali riciclati per la stagione di crescita.',
        reason: 'È il momento perfetto per progetti di giardinaggio sostenibile!',
        difficulty: 'Medio',
        estimatedTime: 5,
        timeUnit: 'ore',
        impactScore: 90,
        materials: ['Bottiglie di plastica', 'Pallet di legno', 'Tubi PVC'],
        tools: ['Trapano', 'Cutter', 'Metro'],
        actionUrl: '/create-project',
        actionText: 'Inizia Progetto',
        priority: 'medium',
        confidence: 82
      });
    }

    // Smart combination recommendations
    if (availableMaterials.length > 5) {
      recommendations.push({
        id: 'multi-material-project',
        type: 'project',
        title: 'Progetto Multi-Materiale Innovativo',
        description: 'Combina diversi tipi di materiali in un progetto che massimizza l\'impatto ambientale.',
        reason: 'Hai una grande varietà di materiali - perfetto per un progetto ambizioso!',
        difficulty: 'Difficile',
        estimatedTime: 10,
        timeUnit: 'ore',
        impactScore: 98,
        materials: availableMaterials.slice(0, 4).map((m: any) => m.name),
        actionUrl: '/ai-assistant',
        actionText: 'Design con AI',
        priority: 'high',
        confidence: 88
      });
    }

    return recommendations.sort((a, b) => {
      if (a.priority !== b.priority) {
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return b.confidence - a.confidence;
    });
  };

  useEffect(() => {
    if (projects && materials && impact) {
      setRecommendations(generateRecommendations());
    }
  }, [projects, materials, impact]);

  const refreshRecommendations = async () => {
    setIsGenerating(true);
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRecommendations(generateRecommendations());
    setIsGenerating(false);
  };

  const getTypeIcon = (type: AIRecommendation['type']) => {
    switch (type) {
      case 'project': return Target;
      case 'material': return RefreshCw;
      case 'optimization': return TrendingUp;
      case 'learning': return Lightbulb;
      case 'community': return Sparkles;
    }
  };

  const getTypeColor = (type: AIRecommendation['type']) => {
    switch (type) {
      case 'project': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'material': return 'bg-green-100 text-green-800 border-green-200';
      case 'optimization': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'learning': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'community': return 'bg-pink-100 text-pink-800 border-pink-200';
    }
  };

  const getPriorityColor = (priority: AIRecommendation['priority']) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <CardTitle>Raccomandazioni AI Personalizzate</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshRecommendations}
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", isGenerating && "animate-spin")} />
            {isGenerating ? 'Generando...' : 'Aggiorna'}
          </Button>
        </div>
        <CardDescription>
          Suggerimenti intelligenti basati sui tuoi progressi e materiali disponibili
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nessuna raccomandazione disponibile al momento</p>
            <p className="text-sm">Completa più progetti per ricevere suggerimenti personalizzati!</p>
          </div>
        ) : (
          recommendations.slice(0, 4).map((recommendation) => {
            const Icon = getTypeIcon(recommendation.type);
            return (
              <div
                key={recommendation.id}
                className={cn(
                  "p-4 rounded-lg border-l-4 transition-all hover:shadow-md",
                  getPriorityColor(recommendation.priority)
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-full border",
                      getTypeColor(recommendation.type)
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{recommendation.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {recommendation.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {recommendation.difficulty}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          {recommendation.estimatedTime} {recommendation.timeUnit}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      {recommendation.impactScore}
                    </div>
                    <div className="text-xs text-gray-500">Impatto</div>
                  </div>
                </div>

                <p className="text-gray-700 mb-2">{recommendation.description}</p>
                
                <div className="bg-blue-50 p-2 rounded text-sm text-blue-800 mb-3">
                  <strong>Perché questo suggerimento:</strong> {recommendation.reason}
                </div>

                {recommendation.materials && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-gray-600 mb-1">Materiali necessari:</p>
                    <div className="flex flex-wrap gap-1">
                      {recommendation.materials.map((material, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {material}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {recommendation.tools && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-gray-600 mb-1">Strumenti richiesti:</p>
                    <div className="flex flex-wrap gap-1">
                      {recommendation.tools.map((tool, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <TrendingUp className="h-3 w-3" />
                    <span>Confidenza AI: {recommendation.confidence}%</span>
                  </div>
                  
                  {recommendation.actionUrl && (
                    <Button size="sm" className="flex items-center gap-1">
                      {recommendation.actionText}
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}

        {recommendations.length > 4 && (
          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              +{recommendations.length - 4} altre raccomandazioni disponibili
            </p>
            <Button variant="ghost" size="sm" className="mt-2">
              Vedi Tutte le Raccomandazioni
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
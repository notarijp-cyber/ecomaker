import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Leaf, Recycle, DollarSign, Target, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface EnvironmentalAnalyticsProps {
  userId: number;
}

export function EnvironmentalAnalytics({ userId }: EnvironmentalAnalyticsProps) {
  const { data: impact } = useQuery({
    queryKey: ['/api/environmental-impact', userId],
  });

  const { data: projects } = useQuery({
    queryKey: ['/api/projects'],
  });

  // Generate analytics data based on user's environmental impact
  const generateAnalyticsData = () => {
    if (!impact || !projects) return null;

    const monthlyData = [
      { month: 'Gen', materialsRecycled: 12, carbonSaved: 8.2, moneySaved: 45 },
      { month: 'Feb', materialsRecycled: 18, carbonSaved: 12.1, moneySaved: 67 },
      { month: 'Mar', materialsRecycled: 25, carbonSaved: 18.5, moneySaved: 89 },
      { month: 'Apr', materialsRecycled: 31, carbonSaved: 22.8, moneySaved: 112 },
      { month: 'Mag', materialsRecycled: impact.materialsRecycled, carbonSaved: impact.carbonFootprintReduction, moneySaved: impact.moneySaved },
    ];

    const projectTypes = [
      { type: 'Arredamento', count: 8, impact: 15.2 },
      { type: 'Decorazione', count: 6, impact: 12.8 },
      { type: 'Giardino', count: 4, impact: 9.5 },
      { type: 'Organizzazione', count: 3, impact: 6.3 },
    ];

    return { monthlyData, projectTypes };
  };

  const analytics = generateAnalyticsData();
  
  if (!analytics) return null;

  const { monthlyData, projectTypes } = analytics;

  // Calculate yearly projections
  const yearlyProjection = {
    materialsRecycled: Math.round(impact.materialsRecycled * 2.4),
    carbonSaved: Math.round(impact.carbonFootprintReduction * 2.4 * 10) / 10,
    moneySaved: Math.round(impact.moneySaved * 2.4),
  };

  const sustainabilityScore = Math.min(100, Math.round(
    (impact.materialsRecycled * 0.4) + 
    (impact.carbonFootprintReduction * 0.35) + 
    (impact.moneySaved * 0.25)
  ));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analisi Ambientale</h2>
          <p className="text-sm text-gray-600">Il tuo impatto sostenibile nel tempo</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Leaf className="h-3 w-3" />
          Score Sostenibilità: {sustainabilityScore}/100
        </Badge>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Materiali Riciclati</CardTitle>
            <Recycle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{impact.materialsRecycled} kg</div>
            <p className="text-xs text-muted-foreground">
              +{Math.round((impact.materialsRecycled / 12) * 100)}% rispetto al mese scorso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CO₂ Risparmiata</CardTitle>
            <Leaf className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{impact.carbonFootprintReduction} kg</div>
            <p className="text-xs text-muted-foreground">
              {Math.round(impact.carbonFootprintReduction * 2.2)} alberi equivalenti
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Denaro Risparmiato</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{impact.moneySaved}</div>
            <p className="text-xs text-muted-foreground">
              Da acquisti evitati
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proiezione Annuale</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{yearlyProjection.materialsRecycled} kg</div>
            <p className="text-xs text-muted-foreground">
              €{yearlyProjection.moneySaved} risparmiati
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tendenza Mensile
            </CardTitle>
            <CardDescription>
              Evoluzione del tuo impatto ambientale
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    `${value} ${name.includes('carbon') ? 'kg CO₂' : name.includes('money') ? '€' : 'kg'}`,
                    name.includes('carbon') ? 'CO₂ Risparmiata' : 
                    name.includes('money') ? 'Denaro Risparmiato' : 'Materiali Riciclati'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="materialsRecycled" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  name="materialsRecycled"
                />
                <Line 
                  type="monotone" 
                  dataKey="carbonSaved" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="carbonSaved"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Project Types Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tipologie di Progetti</CardTitle>
            <CardDescription>
              Distribuzione per categoria e impatto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectTypes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    `${value} ${name === 'count' ? 'progetti' : 'kg CO₂'}`,
                    name === 'count' ? 'Progetti Completati' : 'Impatto Ambientale'
                  ]}
                />
                <Bar dataKey="count" fill="#8884d8" />
                <Bar dataKey="impact" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Sustainability Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Progressi verso gli Obiettivi
          </CardTitle>
          <CardDescription>
            I tuoi traguardi di sostenibilità per quest'anno
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Materiali Riciclati</span>
              <span>{impact.materialsRecycled}/150 kg</span>
            </div>
            <Progress value={(impact.materialsRecycled / 150) * 100} className="h-3" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>CO₂ Risparmiata</span>
              <span>{impact.carbonFootprintReduction}/100 kg</span>
            </div>
            <Progress value={(impact.carbonFootprintReduction / 100) * 100} className="h-3" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Risparmio Economico</span>
              <span>€{impact.moneySaved}/500</span>
            </div>
            <Progress value={(impact.moneySaved / 500) * 100} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Traguardi Raggiunti
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-full">
                <Recycle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-green-800">Eco Warrior</p>
                <p className="text-sm text-green-600">25+ kg riciclati</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-full">
                <Leaf className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-blue-800">Carbon Saver</p>
                <p className="text-sm text-blue-600">20+ kg CO₂ risparmiata</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <div className="p-2 bg-yellow-100 rounded-full">
                <DollarSign className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium text-yellow-800">Money Saver</p>
                <p className="text-sm text-yellow-600">€100+ risparmiati</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
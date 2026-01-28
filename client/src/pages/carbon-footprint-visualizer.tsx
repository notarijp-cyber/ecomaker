import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Leaf, 
  TrendingDown, 
  TrendingUp,
  BarChart3,
  Calendar,
  MapPin,
  Zap,
  Car,
  Home,
  ShoppingBag,
  Recycle,
  Target,
  Award,
  Globe,
  Activity
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar, AreaChart, Area } from 'recharts';

interface CarbonData {
  date: string;
  daily: number;
  cumulative: number;
  saved: number;
  category: {
    transport: number;
    energy: number;
    waste: number;
    consumption: number;
  };
  projects: {
    id: string;
    name: string;
    impact: number;
    type: string;
  }[];
}

interface CarbonGoal {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  target: number;
  current: number;
  unit: string;
  deadline: Date;
}

interface GlobalComparison {
  userAverage: number;
  cityAverage: number;
  countryAverage: number;
  globalAverage: number;
  ranking: {
    percentile: number;
    position: number;
    totalUsers: number;
  };
}

interface RealTimeMetrics {
  currentDailyFootprint: number;
  todayReduction: number;
  weeklyTrend: number;
  monthlyProjection: number;
  co2PerMinute: number;
  lastUpdate: Date;
}

export default function CarbonFootprintVisualizer() {
  const [timeRange, setTimeRange] = useState('7days');
  const [viewMode, setViewMode] = useState('trend');
  const [carbonData, setCarbonData] = useState<CarbonData[]>([]);
  const [carbonGoals, setCarbonGoals] = useState<CarbonGoal[]>([]);
  const [globalComparison, setGlobalComparison] = useState<GlobalComparison | null>(null);
  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeMetrics | null>(null);
  const [isRealTime, setIsRealTime] = useState(true);

  useEffect(() => {
    // Simula dati storici dell'impronta di carbonio
    const generateCarbonData = () => {
      const data: CarbonData[] = [];
      const days = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 365;
      
      for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        const baseFootprint = 45 + Math.random() * 20; // kg CO2 giornalieri
        const projectsImpact = Math.random() * 8; // riduzione da progetti
        const dailyFootprint = Math.max(5, baseFootprint - projectsImpact);
        
        data.push({
          date: date.toISOString().split('T')[0],
          daily: Number(dailyFootprint.toFixed(2)),
          cumulative: Number((data[data.length - 1]?.cumulative || 0) + dailyFootprint).toFixed(2),
          saved: Number(projectsImpact.toFixed(2)),
          category: {
            transport: Number((dailyFootprint * 0.35).toFixed(2)),
            energy: Number((dailyFootprint * 0.30).toFixed(2)),
            waste: Number((dailyFootprint * 0.20).toFixed(2)),
            consumption: Number((dailyFootprint * 0.15).toFixed(2))
          },
          projects: [
            {
              id: `proj_${i}_1`,
              name: 'Progetto Riciclo Plastica',
              impact: Number((projectsImpact * 0.6).toFixed(2)),
              type: 'riciclo'
            },
            {
              id: `proj_${i}_2`,
              name: 'Trasporto Sostenibile',
              impact: Number((projectsImpact * 0.4).toFixed(2)),
              type: 'mobilità'
            }
          ]
        });
      }
      return data;
    };

    // Obiettivi di carbonio
    const goalsData: CarbonGoal[] = [
      {
        type: 'daily',
        target: 30,
        current: 28.5,
        unit: 'kg CO2',
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000)
      },
      {
        type: 'weekly',
        target: 200,
        current: 185.2,
        unit: 'kg CO2',
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      },
      {
        type: 'monthly',
        target: 800,
        current: 720.8,
        unit: 'kg CO2',
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
      }
    ];

    // Confronto globale
    const globalData: GlobalComparison = {
      userAverage: 28.5,
      cityAverage: 42.3,
      countryAverage: 47.8,
      globalAverage: 52.1,
      ranking: {
        percentile: 15,
        position: 2847,
        totalUsers: 18956
      }
    };

    // Metriche in tempo reale
    const realTimeData: RealTimeMetrics = {
      currentDailyFootprint: 28.5,
      todayReduction: 6.8,
      weeklyTrend: -12.5,
      monthlyProjection: 720,
      co2PerMinute: 0.0198,
      lastUpdate: new Date()
    };

    setCarbonData(generateCarbonData());
    setCarbonGoals(goalsData);
    setGlobalComparison(globalData);
    setRealTimeMetrics(realTimeData);
  }, [timeRange]);

  // Aggiornamento real-time ogni 30 secondi
  useEffect(() => {
    if (!isRealTime) return;

    const interval = setInterval(() => {
      setRealTimeMetrics(prev => prev ? {
        ...prev,
        currentDailyFootprint: prev.currentDailyFootprint + (Math.random() - 0.5) * 0.1,
        co2PerMinute: 0.015 + Math.random() * 0.01,
        lastUpdate: new Date()
      } : null);
    }, 30000);

    return () => clearInterval(interval);
  }, [isRealTime]);

  const categoryColors = {
    transport: '#EF4444',
    energy: '#F59E0B',
    waste: '#10B981',
    consumption: '#8B5CF6'
  };

  const categoryData = carbonData.length > 0 ? [
    { name: 'Trasporti', value: carbonData[carbonData.length - 1].category.transport, color: categoryColors.transport },
    { name: 'Energia', value: carbonData[carbonData.length - 1].category.energy, color: categoryColors.energy },
    { name: 'Rifiuti', value: carbonData[carbonData.length - 1].category.waste, color: categoryColors.waste },
    { name: 'Consumi', value: carbonData[carbonData.length - 1].category.consumption, color: categoryColors.consumption }
  ] : [];

  const getGoalProgress = (goal: CarbonGoal) => {
    return Math.min(100, (goal.current / goal.target) * 100);
  };

  const getGoalStatus = (goal: CarbonGoal) => {
    const progress = getGoalProgress(goal);
    if (progress <= 70) return { color: 'text-green-400', status: 'Eccellente' };
    if (progress <= 85) return { color: 'text-yellow-400', status: 'Buono' };
    if (progress <= 100) return { color: 'text-orange-400', status: 'Limite' };
    return { color: 'text-red-400', status: 'Superato' };
  };

  if (!realTimeMetrics || !globalComparison) {
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
          Visualizzatore Impronta di Carbonio Real-Time
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Monitora, analizza e riduci la tua impronta di carbonio con dati in tempo reale e insights intelligenti
        </p>
      </div>

      {/* Real-Time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-morph border-green-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-300 flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              CO2 Oggi
              {isRealTime && <div className="w-2 h-2 bg-green-400 rounded-full ml-auto animate-pulse" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{realTimeMetrics.currentDailyFootprint.toFixed(1)}kg</div>
            <div className="flex items-center text-sm">
              <TrendingDown className="w-3 h-3 mr-1 text-green-400" />
              <span className="text-green-400">-{realTimeMetrics.todayReduction.toFixed(1)}kg rispetto a ieri</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morph border-blue-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-300">Trend Settimanale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{realTimeMetrics.weeklyTrend.toFixed(1)}%</div>
            <div className="flex items-center text-sm">
              <TrendingDown className="w-3 h-3 mr-1 text-green-400" />
              <span className="text-green-400">Miglioramento costante</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morph border-purple-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">Proiezione Mensile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{realTimeMetrics.monthlyProjection}kg</div>
            <div className="flex items-center text-sm">
              <Target className="w-3 h-3 mr-1 text-purple-400" />
              <span className="text-purple-400">Obiettivo: 800kg</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morph border-orange-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-300">CO2/Minuto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{(realTimeMetrics.co2PerMinute * 1000).toFixed(1)}g</div>
            <div className="text-xs text-gray-400">
              Ultimo aggiornamento: {realTimeMetrics.lastUpdate.toLocaleTimeString('it-IT')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48 glass-morph">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Ultimi 7 giorni</SelectItem>
            <SelectItem value="30days">Ultimi 30 giorni</SelectItem>
            <SelectItem value="365days">Ultimo anno</SelectItem>
          </SelectContent>
        </Select>

        <Select value={viewMode} onValueChange={setViewMode}>
          <SelectTrigger className="w-48 glass-morph">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="trend">Trend Temporale</SelectItem>
            <SelectItem value="categories">Per Categoria</SelectItem>
            <SelectItem value="projects">Impatto Progetti</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant={isRealTime ? "default" : "outline"}
          onClick={() => setIsRealTime(!isRealTime)}
          className="cyber-button"
        >
          <Activity className="w-4 h-4 mr-2" />
          Real-Time {isRealTime ? 'ON' : 'OFF'}
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 glass-morph">
          <TabsTrigger value="overview" className="cyber-button">
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="goals" className="cyber-button">
            <Target className="w-4 h-4 mr-2" />
            Obiettivi
          </TabsTrigger>
          <TabsTrigger value="comparison" className="cyber-button">
            <Globe className="w-4 h-4 mr-2" />
            Confronto
          </TabsTrigger>
          <TabsTrigger value="insights" className="cyber-button">
            <Award className="w-4 h-4 mr-2" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trend Chart */}
            <Card className="glass-morph border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-xl text-white">Trend Impronta di Carbonio</CardTitle>
                <CardDescription>Evoluzione giornaliera e CO2 risparmiata</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={carbonData}>
                    <defs>
                      <linearGradient id="colorDaily" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorSaved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9CA3AF"
                      tickFormatter={(date) => new Date(date).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' })}
                    />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                      labelFormatter={(date) => new Date(date).toLocaleDateString('it-IT')}
                    />
                    <Area
                      type="monotone"
                      dataKey="daily"
                      stroke="#EF4444"
                      fillOpacity={1}
                      fill="url(#colorDaily)"
                      name="CO2 Giornaliera (kg)"
                    />
                    <Area
                      type="monotone"
                      dataKey="saved"
                      stroke="#10B981"
                      fillOpacity={1}
                      fill="url(#colorSaved)"
                      name="CO2 Risparmiata (kg)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card className="glass-morph border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-xl text-white">Breakdown per Categoria</CardTitle>
                <CardDescription>Distribuzione odierna delle emissioni</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ResponsiveContainer width="100%" height={200}>
                    <RechartsPieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                        formatter={(value: number) => [`${value.toFixed(1)}kg`, 'CO2']}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  
                  <div className="space-y-2">
                    {categoryData.map(category => (
                      <div key={category.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="text-sm text-gray-300">{category.name}</span>
                        </div>
                        <span className="text-sm font-medium text-white">{category.value.toFixed(1)}kg</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {carbonGoals.map(goal => {
              const status = getGoalStatus(goal);
              const progress = getGoalProgress(goal);
              const daysLeft = Math.ceil((goal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              
              return (
                <Card key={goal.type} className="glass-morph border-cyan-500/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-white capitalize">
                        Obiettivo {goal.type === 'daily' ? 'Giornaliero' : 
                                   goal.type === 'weekly' ? 'Settimanale' : 'Mensile'}
                      </CardTitle>
                      <Badge className={`${status.color} border-current`} variant="outline">
                        {status.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">
                        {goal.current.toFixed(1)} / {goal.target}
                      </div>
                      <div className="text-sm text-gray-400">{goal.unit}</div>
                    </div>
                    
                    <Progress value={progress} className="h-3" />
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Progresso: {progress.toFixed(1)}%</span>
                      <span className="text-gray-400">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {daysLeft} giorni rimasti
                      </span>
                    </div>
                    
                    <div className="text-center">
                      <Button size="sm" className="cyber-button">
                        Ottimizza Strategia
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <Card className="glass-morph border-cyan-500/30">
            <CardHeader>
              <CardTitle className="text-xl text-white">Confronto Globale</CardTitle>
              <CardDescription>Come ti posizioni rispetto ad altri utenti e medie globali</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Medie di Confronto</h3>
                  
                  {[
                    { label: 'La tua media', value: globalComparison.userAverage, color: 'bg-green-500' },
                    { label: 'Media città', value: globalComparison.cityAverage, color: 'bg-blue-500' },
                    { label: 'Media nazionale', value: globalComparison.countryAverage, color: 'bg-yellow-500' },
                    { label: 'Media globale', value: globalComparison.globalAverage, color: 'bg-red-500' }
                  ].map(item => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-300">{item.label}</span>
                        <span className="text-sm font-medium text-white">{item.value.toFixed(1)}kg/giorno</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${item.color}`}
                          style={{ width: `${(item.value / Math.max(...[globalComparison.userAverage, globalComparison.cityAverage, globalComparison.countryAverage, globalComparison.globalAverage])) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">La Tua Posizione</h3>
                  
                  <div className="text-center space-y-2">
                    <div className="text-4xl font-bold text-green-400">
                      {globalComparison.ranking.percentile}°
                    </div>
                    <div className="text-sm text-gray-400">percentile</div>
                    <div className="text-xs text-gray-500">
                      Sei meglio dell'85% degli utenti
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Posizione globale</span>
                      <span className="text-white">#{globalComparison.ranking.position.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Utenti totali</span>
                      <span className="text-white">{globalComparison.ranking.totalUsers.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Badge className="bg-green-500 text-white">
                      <Award className="w-3 h-3 mr-1" />
                      Eco-Warrior
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-morph border-green-500/30">
              <CardHeader>
                <CardTitle className="text-lg text-green-300">Miglior Strategia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-300">
                  Concentrati sui trasporti (35% delle emissioni) per massimizzare la riduzione.
                </p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• Usa trasporto pubblico 3x/settimana: -15kg CO2/mese</li>
                  <li>• Progetti upcycling plastica: -8kg CO2/mese</li>
                  <li>• Ottimizza riscaldamento: -12kg CO2/mese</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="glass-morph border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-lg text-blue-300">Trend Prediction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-300">
                  Mantenendo il trend attuale raggiungerai l'obiettivo annuale con 2 mesi di anticipo.
                </p>
                <div className="text-sm text-gray-400">
                  <div>Proiezione annuale: 9.2 tonnellate CO2</div>
                  <div>Obiettivo: 11 tonnellate CO2</div>
                  <div className="text-green-400">Risparmio: 1.8 tonnellate</div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-morph border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-lg text-purple-300">AI Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-300">
                  L'AI ha identificato 3 opportunità di miglioramento immediate.
                </p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• Progetto bottiglie vetro: -2.5kg CO2</li>
                  <li>• Carpooling community: -4.1kg CO2</li>
                  <li>• Solar panel DIY: -6.8kg CO2</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="glass-morph border-yellow-500/30">
              <CardHeader>
                <CardTitle className="text-lg text-yellow-300">Impact Score</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-400">8.7</div>
                  <div className="text-sm text-gray-400">su 10</div>
                </div>
                <p className="text-gray-300 text-sm text-center">
                  Il tuo impatto ambientale è eccellente. Stai ispirando la community!
                </p>
              </CardContent>
            </Card>
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
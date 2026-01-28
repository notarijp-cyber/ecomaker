import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Star, 
  Target, 
  Users, 
  Leaf, 
  Recycle, 
  Award, 
  TrendingUp,
  Calendar,
  Medal,
  Crown,
  Zap,
  Flame,
  Shield
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface Achievement {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ComponentType<any>;
  difficulty: 'facile' | 'medio' | 'difficile' | 'esperto';
  points: number;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  unlockedDate?: Date;
  rarity: 'comune' | 'raro' | 'epico' | 'leggendario';
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number; // giorni
  reward: number;
  participants: number;
  deadline: Date;
  status: 'attiva' | 'completata' | 'scaduta';
  difficulty: string;
  icon: React.ComponentType<any>;
}

interface UserStats {
  totalPoints: number;
  level: number;
  nextLevelPoints: number;
  rank: number;
  totalUsers: number;
  achievementsUnlocked: number;
  totalAchievements: number;
  streakDays: number;
  co2Saved: number;
  materialsRecycled: number;
  projectsCompleted: number;
}

export default function EcoGamificationSystem() {
  const [selectedCategory, setSelectedCategory] = useState('tutti');
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  // Simula caricamento dati gamification
  useEffect(() => {
    // Dati achievements simulati
    const achievementsData: Achievement[] = [
      {
        id: 'first_recycle',
        name: 'Primo Riciclo',
        description: 'Completa il tuo primo progetto di riciclo',
        category: 'principiante',
        icon: Recycle,
        difficulty: 'facile',
        points: 100,
        unlocked: true,
        progress: 1,
        maxProgress: 1,
        unlockedDate: new Date('2024-01-15'),
        rarity: 'comune'
      },
      {
        id: 'eco_warrior',
        name: 'Guerriero Ecologico',
        description: 'Risparmia 50kg di CO2 con i tuoi progetti',
        category: 'ambientale',
        icon: Shield,
        difficulty: 'medio',
        points: 500,
        unlocked: true,
        progress: 47,
        maxProgress: 50,
        unlockedDate: new Date('2024-02-20'),
        rarity: 'raro'
      },
      {
        id: 'innovation_master',
        name: 'Maestro dell\'Innovazione',
        description: 'Crea 10 progetti unici con materiali inusuali',
        category: 'creatività',
        icon: Crown,
        difficulty: 'difficile',
        points: 1000,
        unlocked: false,
        progress: 7,
        maxProgress: 10,
        rarity: 'epico'
      },
      {
        id: 'community_leader',
        name: 'Leader della Comunità',
        description: 'Ispira 100 persone a unirsi alla piattaforma',
        category: 'sociale',
        icon: Users,
        difficulty: 'esperto',
        points: 2000,
        unlocked: false,
        progress: 23,
        maxProgress: 100,
        rarity: 'leggendario'
      },
      {
        id: 'streak_master',
        name: 'Maestro della Costanza',
        description: 'Mantieni una streak di 30 giorni',
        category: 'abitudine',
        icon: Flame,
        difficulty: 'medio',
        points: 750,
        unlocked: false,
        progress: 18,
        maxProgress: 30,
        rarity: 'raro'
      },
      {
        id: 'material_expert',
        name: 'Esperto dei Materiali',
        description: 'Identifica correttamente 50 materiali con la camera',
        category: 'conoscenza',
        icon: Target,
        difficulty: 'medio',
        points: 600,
        unlocked: true,
        progress: 50,
        maxProgress: 50,
        unlockedDate: new Date('2024-03-10'),
        rarity: 'raro'
      }
    ];

    const challengesData: Challenge[] = [
      {
        id: 'weekly_recycle',
        title: 'Sfida Settimanale del Riciclo',
        description: 'Completa 3 progetti di riciclo questa settimana',
        category: 'settimanale',
        duration: 7,
        reward: 300,
        participants: 1247,
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        status: 'attiva',
        difficulty: 'medio',
        icon: Recycle
      },
      {
        id: 'plastic_free_month',
        title: 'Mese Plastic-Free',
        description: 'Evita la plastica monouso per un mese intero',
        category: 'mensile',
        duration: 30,
        reward: 1500,
        participants: 3421,
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        status: 'attiva',
        difficulty: 'difficile',
        icon: Leaf
      },
      {
        id: 'community_project',
        title: 'Progetto Comunitario',
        description: 'Organizza un evento di riciclo nel tuo quartiere',
        category: 'sociale',
        duration: 14,
        reward: 2000,
        participants: 89,
        deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        status: 'attiva',
        difficulty: 'esperto',
        icon: Users
      }
    ];

    const userStatsData: UserStats = {
      totalPoints: 3420,
      level: 12,
      nextLevelPoints: 4000,
      rank: 247,
      totalUsers: 15789,
      achievementsUnlocked: 8,
      totalAchievements: 25,
      streakDays: 18,
      co2Saved: 127.5,
      materialsRecycled: 89,
      projectsCompleted: 23
    };

    setAchievements(achievementsData);
    setChallenges(challengesData);
    setUserStats(userStatsData);
  }, []);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'comune': return 'bg-gray-500';
      case 'raro': return 'bg-blue-500';
      case 'epico': return 'bg-purple-500';
      case 'leggendario': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'facile': return 'text-green-400';
      case 'medio': return 'text-yellow-400';
      case 'difficile': return 'text-orange-400';
      case 'esperto': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'attiva': return 'bg-green-500';
      case 'completata': return 'bg-blue-500';
      case 'scaduta': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredAchievements = selectedCategory === 'tutti' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const categories = ['tutti', 'principiante', 'ambientale', 'creatività', 'sociale', 'abitudine', 'conoscenza'];

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
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
          Sistema di Gamification Ecologica
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Trasforma le tue azioni sostenibili in un'avventura coinvolgente con achievements, sfide e ricompense
        </p>
      </div>

      {/* User Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-morph border-cyan-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-cyan-300">Livello Attuale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{userStats.level}</div>
                <Progress value={(userStats.totalPoints / userStats.nextLevelPoints) * 100} className="w-20 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morph border-cyan-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-cyan-300">Punti Totali</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500 to-orange-600">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{userStats.totalPoints.toLocaleString()}</div>
                <div className="text-xs text-gray-400">Prossimo livello: {userStats.nextLevelPoints}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morph border-cyan-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-cyan-300">Classifica</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-600">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">#{userStats.rank}</div>
                <div className="text-xs text-gray-400">su {userStats.totalUsers.toLocaleString()} utenti</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morph border-cyan-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-cyan-300">Streak Giorni</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-pink-600">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{userStats.streakDays}</div>
                <div className="text-xs text-gray-400">giorni consecutivi</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Environmental Impact Stats */}
      <Card className="glass-morph border-green-500/30">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-green-300 flex items-center">
            <Leaf className="w-5 h-5 mr-2" />
            Impatto Ambientale Personale
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{userStats.co2Saved}kg</div>
              <div className="text-sm text-gray-400">CO2 Risparmiata</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">{userStats.materialsRecycled}</div>
              <div className="text-sm text-gray-400">Materiali Riciclati</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">{userStats.projectsCompleted}</div>
              <div className="text-sm text-gray-400">Progetti Completati</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultValue="achievements" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 glass-morph">
          <TabsTrigger value="achievements" className="cyber-button">
            <Trophy className="w-4 h-4 mr-2" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="challenges" className="cyber-button">
            <Target className="w-4 h-4 mr-2" />
            Sfide
          </TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-6">
          {/* Achievement Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="cyber-button"
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map(achievement => {
              const IconComponent = achievement.icon;
              return (
                <Card 
                  key={achievement.id} 
                  className={`glass-morph border-cyan-500/30 transition-all duration-300 ${
                    achievement.unlocked ? 'border-green-500/50 shadow-green-500/20' : 'opacity-75'
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${achievement.unlocked ? 'bg-green-500/20' : 'bg-gray-500/20'}`}>
                          <IconComponent className={`w-6 h-6 ${achievement.unlocked ? 'text-green-400' : 'text-gray-400'}`} />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-medium text-white">{achievement.name}</CardTitle>
                          <Badge className={`${getRarityColor(achievement.rarity)} text-white text-xs`}>
                            {achievement.rarity}
                          </Badge>
                        </div>
                      </div>
                      {achievement.unlocked && <Award className="w-5 h-5 text-yellow-400" />}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-300">{achievement.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Progresso</span>
                        <span className="text-white">{achievement.progress}/{achievement.maxProgress}</span>
                      </div>
                      <Progress 
                        value={(achievement.progress / achievement.maxProgress) * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-medium text-white">{achievement.points} pts</span>
                      </div>
                      <Badge variant="outline" className={getDifficultyColor(achievement.difficulty)}>
                        {achievement.difficulty}
                      </Badge>
                    </div>
                    
                    {achievement.unlocked && achievement.unlockedDate && (
                      <div className="text-xs text-green-400">
                        Sbloccato il {achievement.unlockedDate.toLocaleDateString('it-IT')}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {challenges.map(challenge => {
              const IconComponent = challenge.icon;
              const daysLeft = Math.ceil((challenge.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              
              return (
                <Card key={challenge.id} className="glass-morph border-cyan-500/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-full bg-cyan-500/20">
                          <IconComponent className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-white">{challenge.title}</CardTitle>
                          <Badge className={`${getStatusColor(challenge.status)} text-white text-xs`}>
                            {challenge.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-yellow-400">{challenge.reward} pts</div>
                        <div className="text-xs text-gray-400">{challenge.participants} partecipanti</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-300">{challenge.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 text-blue-400" />
                          <span className="text-sm text-white">{daysLeft} giorni rimasti</span>
                        </div>
                        <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                          {challenge.difficulty}
                        </Badge>
                      </div>
                    </div>
                    
                    <Button className="w-full cyber-button">
                      <Zap className="w-4 h-4 mr-2" />
                      Partecipa alla Sfida
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
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
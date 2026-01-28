import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Zap, Target, Crown, Medal, Award, Gift, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'recycling' | 'projects' | 'community' | 'innovation' | 'sustainability';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  unlockedAt?: Date;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  target: number;
  progress: number;
  reward: {
    points: number;
    badge?: string;
    title?: string;
  };
  expiresAt: Date;
  completed: boolean;
}

interface GamificationSystemProps {
  userId: number;
}

export function GamificationSystem({ userId }: GamificationSystemProps) {
  const [activeTab, setActiveTab] = useState<'achievements' | 'challenges' | 'leaderboard'>('achievements');

  const { data: impact } = useQuery({ queryKey: ['/api/environmental-impact', userId] });
  const { data: projects } = useQuery({ queryKey: ['/api/projects'] });

  // Generate achievements based on user progress
  const generateAchievements = (): Achievement[] => {
    if (!impact || !projects) return [];

    const userProjects = projects.filter((p: any) => p.userId === userId);
    
    return [
      {
        id: 'first-recycle',
        title: 'Primo Riciclo',
        description: 'Ricicla il tuo primo materiale',
        icon: Star,
        category: 'recycling',
        rarity: 'common',
        points: 10,
        unlocked: impact.materialsRecycled > 0,
        unlockedAt: impact.materialsRecycled > 0 ? new Date() : undefined
      },
      {
        id: 'eco-warrior',
        title: 'Eco Guerriero',
        description: 'Ricicla 25kg di materiali',
        icon: Medal,
        category: 'recycling',
        rarity: 'rare',
        points: 50,
        unlocked: impact.materialsRecycled >= 25,
        progress: Math.min(impact.materialsRecycled, 25),
        maxProgress: 25,
        unlockedAt: impact.materialsRecycled >= 25 ? new Date() : undefined
      },
      {
        id: 'sustainability-master',
        title: 'Maestro della Sostenibilità',
        description: 'Ricicla 100kg di materiali',
        icon: Crown,
        category: 'sustainability',
        rarity: 'epic',
        points: 200,
        unlocked: impact.materialsRecycled >= 100,
        progress: Math.min(impact.materialsRecycled, 100),
        maxProgress: 100,
        unlockedAt: impact.materialsRecycled >= 100 ? new Date() : undefined
      },
      {
        id: 'project-creator',
        title: 'Creatore di Progetti',
        description: 'Completa il tuo primo progetto',
        icon: Trophy,
        category: 'projects',
        rarity: 'common',
        points: 25,
        unlocked: userProjects.some((p: any) => p.completionPercentage === 100),
        unlockedAt: userProjects.some((p: any) => p.completionPercentage === 100) ? new Date() : undefined
      },
      {
        id: 'innovation-pioneer',
        title: 'Pioniere dell\'Innovazione',
        description: 'Crea 5 progetti innovativi',
        icon: Zap,
        category: 'innovation',
        rarity: 'epic',
        points: 150,
        unlocked: userProjects.length >= 5,
        progress: Math.min(userProjects.length, 5),
        maxProgress: 5,
        unlockedAt: userProjects.length >= 5 ? new Date() : undefined
      },
      {
        id: 'community-hero',
        title: 'Eroe della Comunità',
        description: 'Partecipa a 3 progetti comunitari',
        icon: Award,
        category: 'community',
        rarity: 'rare',
        points: 100,
        unlocked: false, // Would need to track community participation
        progress: 1,
        maxProgress: 3
      },
      {
        id: 'carbon-saver-legend',
        title: 'Leggenda del Carbonio',
        description: 'Risparmia 50kg di CO₂',
        icon: Target,
        category: 'sustainability',
        rarity: 'legendary',
        points: 500,
        unlocked: impact.carbonFootprintReduction >= 50,
        progress: Math.min(impact.carbonFootprintReduction, 50),
        maxProgress: 50,
        unlockedAt: impact.carbonFootprintReduction >= 50 ? new Date() : undefined
      }
    ];
  };

  // Generate daily/weekly challenges
  const generateChallenges = (): Challenge[] => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);

    return [
      {
        id: 'daily-recycle',
        title: 'Riciclo Quotidiano',
        description: 'Ricicla 2kg di materiali oggi',
        type: 'daily',
        target: 2,
        progress: Math.min(impact?.materialsRecycled * 0.1 || 0, 2),
        reward: { points: 20 },
        expiresAt: tomorrow,
        completed: (impact?.materialsRecycled * 0.1 || 0) >= 2
      },
      {
        id: 'weekly-project',
        title: 'Progetto Settimanale',
        description: 'Completa 1 progetto questa settimana',
        type: 'weekly',
        target: 1,
        progress: 0,
        reward: { points: 100, badge: 'Costruttore Settimanale' },
        expiresAt: nextWeek,
        completed: false
      },
      {
        id: 'community-challenge',
        title: 'Sfida Comunitaria',
        description: 'Unisciti a un evento della comunità',
        type: 'weekly',
        target: 1,
        progress: 0,
        reward: { points: 75, title: 'Partecipante Attivo' },
        expiresAt: nextWeek,
        completed: false
      }
    ];
  };

  const achievements = generateAchievements();
  const challenges = generateChallenges();
  
  const totalPoints = achievements
    .filter(a => a.unlocked)
    .reduce((sum, a) => sum + a.points, 0);
    
  const level = Math.floor(totalPoints / 100) + 1;
  const pointsToNextLevel = (level * 100) - totalPoints;

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50';
      case 'rare': return 'border-blue-300 bg-blue-50';
      case 'epic': return 'border-purple-300 bg-purple-50';
      case 'legendary': return 'border-yellow-300 bg-yellow-50';
    }
  };

  const getCategoryIcon = (category: Achievement['category']) => {
    switch (category) {
      case 'recycling': return Trophy;
      case 'projects': return Target;
      case 'community': return Award;
      case 'innovation': return Zap;
      case 'sustainability': return Crown;
    }
  };

  return (
    <div className="space-y-6">
      {/* User Level and Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                Livello {level} - Eco Maker
              </CardTitle>
              <CardDescription>
                {totalPoints} punti totali • {pointsToNextLevel} punti al prossimo livello
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {totalPoints} pts
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progressi al Livello {level + 1}</span>
                <span>{totalPoints % 100}/100</span>
              </div>
              <Progress value={(totalPoints % 100)} className="h-3" />
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-green-600">
                  {achievements.filter(a => a.unlocked).length}
                </div>
                <div className="text-sm text-gray-600">Traguardi</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-blue-600">
                  {challenges.filter(c => c.completed).length}
                </div>
                <div className="text-sm text-gray-600">Sfide Completate</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-purple-600">
                  {level}
                </div>
                <div className="text-sm text-gray-600">Livello</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'achievements', label: 'Traguardi', icon: Trophy },
          { id: 'challenges', label: 'Sfide', icon: Target },
          { id: 'leaderboard', label: 'Classifica', icon: TrendingUp }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors",
              activeTab === id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Content based on active tab */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => {
            const IconComponent = achievement.icon;
            return (
              <Card
                key={achievement.id}
                className={cn(
                  "transition-all hover:shadow-md",
                  getRarityColor(achievement.rarity),
                  achievement.unlocked ? "opacity-100" : "opacity-60"
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-full",
                        achievement.unlocked ? "bg-green-100" : "bg-gray-100"
                      )}>
                        <IconComponent className={cn(
                          "h-5 w-5",
                          achievement.unlocked ? "text-green-600" : "text-gray-400"
                        )} />
                      </div>
                      <div>
                        <CardTitle className="text-sm">{achievement.title}</CardTitle>
                        <Badge variant="outline" className="text-xs capitalize">
                          {achievement.rarity}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{achievement.points}</div>
                      <div className="text-xs text-gray-500">pts</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                  
                  {achievement.maxProgress && (
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progresso</span>
                        <span>{achievement.progress}/{achievement.maxProgress}</span>
                      </div>
                      <Progress 
                        value={(achievement.progress! / achievement.maxProgress) * 100} 
                        className="h-2"
                      />
                    </div>
                  )}
                  
                  {achievement.unlocked && achievement.unlockedAt && (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <Gift className="h-3 w-3" />
                      Sbloccato!
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {activeTab === 'challenges' && (
        <div className="space-y-4">
          {challenges.map((challenge) => (
            <Card key={challenge.id} className="relative overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {challenge.title}
                      <Badge variant={challenge.type === 'daily' ? 'default' : 'secondary'}>
                        {challenge.type}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{challenge.description}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{challenge.reward.points} pts</div>
                    {challenge.reward.badge && (
                      <Badge variant="outline" className="text-xs">
                        {challenge.reward.badge}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progresso</span>
                    <span>{challenge.progress}/{challenge.target}</span>
                  </div>
                  <Progress value={(challenge.progress / challenge.target) * 100} className="h-3" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Scade: {challenge.expiresAt.toLocaleDateString('it-IT')}
                  </div>
                  {challenge.completed ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Completata!
                    </Badge>
                  ) : (
                    <Button size="sm" variant="outline">
                      Continua
                    </Button>
                  )}
                </div>
              </CardContent>
              
              {challenge.completed && (
                <div className="absolute inset-0 bg-green-50 bg-opacity-50 flex items-center justify-center">
                  <div className="bg-green-100 p-4 rounded-full">
                    <Trophy className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <Card>
          <CardHeader>
            <CardTitle>Classifica Globale</CardTitle>
            <CardDescription>Top eco-makers della settimana</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { rank: 1, name: 'Marco Eco', points: 1250, badge: 'Leggenda Verde' },
                { rank: 2, name: 'Tu', points: totalPoints, badge: 'Eco Maker', current: true },
                { rank: 3, name: 'Sofia Green', points: 890, badge: 'Innovatrice' },
                { rank: 4, name: 'Luca Recycle', points: 750, badge: 'Pioniere' },
                { rank: 5, name: 'Anna Sostenibile', points: 650, badge: 'Guerriera' }
              ].map((user) => (
                <div
                  key={user.rank}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg",
                    user.current ? "bg-blue-50 border border-blue-200" : "bg-gray-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                      user.rank === 1 ? "bg-yellow-100 text-yellow-800" :
                      user.rank === 2 ? "bg-gray-100 text-gray-800" :
                      user.rank === 3 ? "bg-orange-100 text-orange-800" :
                      "bg-gray-100 text-gray-600"
                    )}>
                      {user.rank}
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.badge}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{user.points} pts</div>
                    {user.rank <= 3 && (
                      <Medal className={cn(
                        "h-4 w-4 mx-auto",
                        user.rank === 1 ? "text-yellow-500" :
                        user.rank === 2 ? "text-gray-500" :
                        "text-orange-500"
                      )} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
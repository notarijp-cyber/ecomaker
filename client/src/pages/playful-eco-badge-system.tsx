import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Star, 
  Leaf, 
  Recycle, 
  Award, 
  Sparkles,
  Zap,
  Crown,
  Medal,
  Shield,
  Gift,
  Target,
  Flame,
  Globe,
  Heart,
  Mountain,
  TreePine,
  Wind,
  Droplets,
  Sun,
  Moon
} from 'lucide-react';

interface EcoBadge {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'recycling' | 'energy' | 'water' | 'transportation' | 'innovation' | 'community';
  rarity: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  points: number;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  unlockedAt?: Date;
  animationState: 'idle' | 'earning' | 'unlocked' | 'celebrate';
  glowIntensity: number;
  sparkleCount: number;
}

interface Achievement {
  id: string;
  badgeId: string;
  action: string;
  timestamp: Date;
  impact: number;
  celebration: boolean;
}

export default function PlayfulEcoBadgeSystem() {
  const [badges, setBadges] = useState<EcoBadge[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [animatingBadges, setAnimatingBadges] = useState<Set<string>>(new Set());
  const [celebrationMode, setCelebrationMode] = useState(false);

  useEffect(() => {
    // Simula caricamento badges con animazioni
    const badgesData: EcoBadge[] = [
      {
        id: 'recycling_master',
        name: 'Maestro del Riciclo',
        description: 'Ricicla 100 materiali diversi',
        icon: Recycle,
        category: 'recycling',
        rarity: 'gold',
        points: 1000,
        unlocked: true,
        progress: 100,
        maxProgress: 100,
        unlockedAt: new Date('2024-06-15'),
        animationState: 'celebrate',
        glowIntensity: 100,
        sparkleCount: 15
      },
      {
        id: 'energy_saver',
        name: 'Guardiano dell\'Energia',
        description: 'Risparmia 500 kWh di energia',
        icon: Zap,
        category: 'energy',
        rarity: 'silver',
        points: 750,
        unlocked: true,
        progress: 500,
        maxProgress: 500,
        unlockedAt: new Date('2024-06-10'),
        animationState: 'unlocked',
        glowIntensity: 80,
        sparkleCount: 10
      },
      {
        id: 'water_guardian',
        name: 'Custode dell\'Acqua',
        description: 'Conserva 1000 litri d\'acqua',
        icon: Droplets,
        category: 'water',
        rarity: 'platinum',
        points: 1500,
        unlocked: false,
        progress: 750,
        maxProgress: 1000,
        animationState: 'earning',
        glowIntensity: 60,
        sparkleCount: 5
      },
      {
        id: 'solar_champion',
        name: 'Campione Solare',
        description: 'Usa energia solare per 30 giorni',
        icon: Sun,
        category: 'energy',
        rarity: 'diamond',
        points: 2000,
        unlocked: false,
        progress: 18,
        maxProgress: 30,
        animationState: 'earning',
        glowIntensity: 40,
        sparkleCount: 3
      },
      {
        id: 'community_builder',
        name: 'Costruttore di Comunità',
        description: 'Coinvolgi 50 persone in progetti eco',
        icon: Heart,
        category: 'community',
        rarity: 'gold',
        points: 1200,
        unlocked: false,
        progress: 32,
        maxProgress: 50,
        animationState: 'earning',
        glowIntensity: 45,
        sparkleCount: 4
      },
      {
        id: 'innovation_pioneer',
        name: 'Pioniere dell\'Innovazione',
        description: 'Crea 5 soluzioni innovative',
        icon: Sparkles,
        category: 'innovation',
        rarity: 'platinum',
        points: 1800,
        unlocked: false,
        progress: 2,
        maxProgress: 5,
        animationState: 'idle',
        glowIntensity: 20,
        sparkleCount: 1
      }
    ];

    setBadges(badgesData);

    // Simula achievement recenti
    const achievementsData: Achievement[] = [
      {
        id: 'ach_001',
        badgeId: 'recycling_master',
        action: 'Completato riciclo di 100 materiali',
        timestamp: new Date('2024-06-15T14:30:00'),
        impact: 85.5,
        celebration: true
      },
      {
        id: 'ach_002',
        badgeId: 'energy_saver',
        action: 'Raggiunto risparmio energetico di 500 kWh',
        timestamp: new Date('2024-06-10T09:15:00'),
        impact: 67.2,
        celebration: true
      }
    ];

    setAchievements(achievementsData);
  }, []);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'bronze': return 'from-orange-600 to-yellow-600';
      case 'silver': return 'from-gray-400 to-gray-600';
      case 'gold': return 'from-yellow-400 to-yellow-600';
      case 'platinum': return 'from-purple-400 to-purple-600';
      case 'diamond': return 'from-cyan-400 to-blue-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'recycling': return Recycle;
      case 'energy': return Zap;
      case 'water': return Droplets;
      case 'transportation': return Wind;
      case 'innovation': return Sparkles;
      case 'community': return Heart;
      default: return Star;
    }
  };

  const triggerBadgeAnimation = (badgeId: string) => {
    setAnimatingBadges(prev => new Set([...prev, badgeId]));
    setCelebrationMode(true);
    
    setTimeout(() => {
      setAnimatingBadges(prev => {
        const newSet = new Set(prev);
        newSet.delete(badgeId);
        return newSet;
      });
      setCelebrationMode(false);
    }, 3000);
  };

  const filteredBadges = badges.filter(badge => 
    selectedCategory === 'all' || badge.category === selectedCategory
  );

  return (
    <div className="container mx-auto p-6 space-y-8 min-h-screen futuristic-bg">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-600 bg-clip-text text-transparent">
          Sistema Badge Eco-Playful
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Sblocca badge animati, celebra i tuoi successi sostenibili e ispira la community con micro-interazioni coinvolgenti
        </p>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-morph border-yellow-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-300">Badge Sbloccati</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {badges.filter(b => b.unlocked).length}/{badges.length}
            </div>
            <div className="text-xs text-gray-400">
              {Math.round((badges.filter(b => b.unlocked).length / badges.length) * 100)}% completato
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morph border-purple-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">Punti Totali</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {badges.filter(b => b.unlocked).reduce((sum, b) => sum + b.points, 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">
              Da {badges.filter(b => b.unlocked).length} badge
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morph border-green-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-300">Impatto Ambientale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {achievements.reduce((sum, a) => sum + a.impact, 0).toFixed(1)}kg
            </div>
            <div className="text-xs text-gray-400">
              CO2 risparmiata
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morph border-cyan-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-cyan-300">Streak Attuale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">23</div>
            <div className="text-xs text-gray-400">
              giorni consecutivi
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('all')}
          className="cyber-button-small"
        >
          Tutti
        </Button>
        {['recycling', 'energy', 'water', 'transportation', 'innovation', 'community'].map(category => (
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

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBadges.map(badge => {
          const IconComponent = badge.icon;
          const isAnimating = animatingBadges.has(badge.id);
          
          return (
            <Card 
              key={badge.id} 
              className={`glass-morph border-2 transition-all duration-500 relative overflow-hidden ${
                badge.unlocked 
                  ? `border-gradient-${getRarityColor(badge.rarity)} shadow-2xl` 
                  : 'border-gray-600/30'
              } ${isAnimating ? 'animate-bounce scale-105' : ''}`}
              style={{
                boxShadow: badge.unlocked 
                  ? `0 0 ${badge.glowIntensity}px rgba(34, 211, 238, 0.${badge.glowIntensity})`
                  : 'none'
              }}
            >
              {/* Sparkles Animation */}
              {badge.unlocked && (
                <div className="absolute inset-0 pointer-events-none">
                  {Array.from({ length: badge.sparkleCount }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute animate-pulse"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${2 + Math.random() * 2}s`
                      }}
                    >
                      <Star className="w-2 h-2 text-yellow-400 fill-current" />
                    </div>
                  ))}
                </div>
              )}

              <CardHeader className="text-center">
                <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 bg-gradient-to-r ${getRarityColor(badge.rarity)} ${
                  badge.animationState === 'celebrate' ? 'animate-spin' : 
                  badge.animationState === 'earning' ? 'animate-pulse' : ''
                }`}>
                  <IconComponent className={`w-10 h-10 text-white ${
                    badge.unlocked ? 'drop-shadow-glow' : 'opacity-50'
                  }`} />
                </div>
                
                <CardTitle className={`text-lg ${badge.unlocked ? 'text-white' : 'text-gray-400'}`}>
                  {badge.name}
                </CardTitle>
                
                <Badge className={`bg-gradient-to-r ${getRarityColor(badge.rarity)} text-white border-none`}>
                  {badge.rarity.toUpperCase()}
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className={`text-sm text-center ${badge.unlocked ? 'text-gray-300' : 'text-gray-500'}`}>
                  {badge.description}
                </p>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Progresso</span>
                    <span className={badge.unlocked ? 'text-green-400' : 'text-cyan-400'}>
                      {badge.progress}/{badge.maxProgress}
                    </span>
                  </div>
                  <Progress 
                    value={(badge.progress / badge.maxProgress) * 100} 
                    className="h-2"
                  />
                </div>

                {/* Points */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-300">{badge.points} punti</span>
                  </div>
                  
                  {badge.unlocked && badge.unlockedAt && (
                    <div className="text-xs text-gray-400">
                      {badge.unlockedAt.toLocaleDateString('it-IT')}
                    </div>
                  )}
                </div>

                {/* Action Button */}
                {!badge.unlocked && badge.progress > 0 && (
                  <Button 
                    onClick={() => triggerBadgeAnimation(badge.id)}
                    className="w-full cyber-button"
                    disabled={isAnimating}
                  >
                    {isAnimating ? 'Progredendo...' : 'Continua Progresso'}
                  </Button>
                )}

                {badge.unlocked && (
                  <Button 
                    onClick={() => triggerBadgeAnimation(badge.id)}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    🎉 Celebra Achievement
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Achievements */}
      <Card className="glass-morph border-green-500/30">
        <CardHeader>
          <CardTitle className="text-xl text-green-300 flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Achievement Recenti
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {achievements.map(achievement => {
              const badge = badges.find(b => b.id === achievement.badgeId);
              const IconComponent = badge?.icon || Star;
              
              return (
                <div key={achievement.id} className="flex items-center space-x-4 p-4 rounded-lg glass-morph">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r ${
                    badge ? getRarityColor(badge.rarity) : 'from-gray-400 to-gray-600'
                  }`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-semibold text-white">{badge?.name || 'Achievement'}</div>
                    <div className="text-sm text-gray-300">{achievement.action}</div>
                    <div className="text-xs text-gray-400">
                      {achievement.timestamp.toLocaleString('it-IT')} • 
                      Impatto: +{achievement.impact}kg CO2 risparmiata
                    </div>
                  </div>
                  
                  {achievement.celebration && (
                    <div className="text-2xl animate-bounce">🎉</div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Celebration Overlay */}
      {celebrationMode && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-8xl animate-ping">🎊</div>
          <div className="absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`
                }}
              >
                <span className="text-2xl">
                  {['🌟', '✨', '🎉', '🎊', '🏆', '🥇'][Math.floor(Math.random() * 6)]}
                </span>
              </div>
            ))}
          </div>
        </div>
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
          .drop-shadow-glow {
            filter: drop-shadow(0 0 10px rgba(34, 211, 238, 0.5));
          }
          @keyframes sparkle {
            0%, 100% { opacity: 0; transform: scale(0.5); }
            50% { opacity: 1; transform: scale(1); }
          }
          .animate-sparkle {
            animation: sparkle 2s infinite;
          }
        `
      }} />
    </div>
  );
}
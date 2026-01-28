import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
}

interface AchievementToastProps {
  achievement: Achievement;
  onDismiss: () => void;
}

export function AchievementToast({ achievement, onDismiss }: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsLeaving(true);
    setTimeout(onDismiss, 300);
  };

  const getRarityConfig = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common':
        return {
          bg: 'bg-gradient-to-r from-gray-500 to-gray-600',
          border: 'border-gray-400',
          glow: 'shadow-gray-400/50',
          particles: '🎯'
        };
      case 'rare':
        return {
          bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
          border: 'border-blue-400',
          glow: 'shadow-blue-400/50',
          particles: '💎'
        };
      case 'epic':
        return {
          bg: 'bg-gradient-to-r from-purple-500 to-purple-600',
          border: 'border-purple-400',
          glow: 'shadow-purple-400/50',
          particles: '⚡'
        };
      case 'legendary':
        return {
          bg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
          border: 'border-yellow-400',
          glow: 'shadow-yellow-400/50',
          particles: '🌟'
        };
    }
  };

  const config = getRarityConfig(achievement.rarity);
  const IconComponent = achievement.icon;

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 transition-all duration-500 transform",
        isVisible && !isLeaving ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
    >
      <Card className={cn(
        "relative overflow-hidden border-2 shadow-2xl animate-pulse",
        config.border,
        config.glow
      )}>
        {/* Animated background with particles */}
        <div className={cn("absolute inset-0", config.bg)}>
          <div className="absolute inset-0 opacity-20">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '2s'
                }}
              >
                {config.particles}
              </div>
            ))}
          </div>
        </div>

        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />

        <CardContent className="relative p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                <IconComponent className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Traguardo Sbloccato!</h3>
                <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                  {achievement.rarity.toUpperCase()}
                </Badge>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-white">{achievement.title}</h4>
            <p className="text-sm text-white/90">{achievement.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-300" />
                <span className="font-bold">{achievement.points} punti</span>
              </div>
              <Sparkles className="h-5 w-5 text-yellow-300 animate-spin" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Achievement System Manager
interface AchievementSystemProps {
  userId: number;
}

export function AchievementSystem({ userId }: AchievementSystemProps) {
  const [activeAchievements, setActiveAchievements] = useState<Achievement[]>([]);
  const [achievementQueue, setAchievementQueue] = useState<Achievement[]>([]);

  // Simulate achievement unlocking based on user actions
  useEffect(() => {
    const checkForAchievements = () => {
      // In a real app, this would check user progress against achievement criteria
      const newAchievements: Achievement[] = [];

      // Example: First login achievement
      if (Math.random() > 0.8) { // 20% chance for demo
        newAchievements.push({
          id: 'first-login',
          title: 'Benvenuto in EcoMaker',
          description: 'Hai fatto il tuo primo accesso alla piattaforma!',
          icon: Trophy,
          rarity: 'common',
          points: 10
        });
      }

      // Example: Environmental hero achievement
      if (Math.random() > 0.9) { // 10% chance for demo
        newAchievements.push({
          id: 'eco-hero',
          title: 'Eroe Ambientale',
          description: 'Hai risparmiato 10kg di CO₂ con i tuoi progetti!',
          icon: Star,
          rarity: 'epic',
          points: 100
        });
      }

      if (newAchievements.length > 0) {
        setAchievementQueue(prev => [...prev, ...newAchievements]);
      }
    };

    const interval = setInterval(checkForAchievements, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [userId]);

  // Display achievements one by one
  useEffect(() => {
    if (achievementQueue.length > 0 && activeAchievements.length === 0) {
      const nextAchievement = achievementQueue[0];
      setActiveAchievements([nextAchievement]);
      setAchievementQueue(prev => prev.slice(1));
    }
  }, [achievementQueue, activeAchievements]);

  const dismissAchievement = (achievementId: string) => {
    setActiveAchievements(prev => prev.filter(a => a.id !== achievementId));
  };

  return (
    <>
      {activeAchievements.map(achievement => (
        <AchievementToast
          key={achievement.id}
          achievement={achievement}
          onDismiss={() => dismissAchievement(achievement.id)}
        />
      ))}
    </>
  );
}
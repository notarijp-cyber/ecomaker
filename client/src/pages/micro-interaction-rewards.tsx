import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  Sparkles, 
  Star, 
  Gift,
  Coins,
  Heart,
  Target,
  Leaf,
  Droplets,
  Recycle,
  Sun,
  Wind,
  TreePine,
  Mountain,
  Globe
} from 'lucide-react';

interface MicroReward {
  id: string;
  type: 'instant' | 'accumulative' | 'streak' | 'milestone';
  action: string;
  points: number;
  visualFeedback: {
    icon: React.ComponentType<any>;
    color: string;
    animation: 'bounce' | 'pulse' | 'spin' | 'glow' | 'confetti';
    sound?: string;
    haptic?: boolean;
  };
  triggerCondition: string;
  impactMessage: string;
  timestamp: Date;
}

interface AnimationParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  icon: string;
}

export default function MicroInteractionRewards() {
  const [activeRewards, setActiveRewards] = useState<MicroReward[]>([]);
  const [particles, setParticles] = useState<AnimationParticle[]>([]);
  const [recentActions, setRecentActions] = useState<string[]>([]);
  const [dailyPoints, setDailyPoints] = useState(0);
  const [streakCount, setStreakCount] = useState(5);
  const [floatingMessages, setFloatingMessages] = useState<Array<{
    id: string;
    message: string;
    x: number;
    y: number;
    color: string;
  }>>([]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    // Initialize with sample rewards
    const sampleRewards: MicroReward[] = [
      {
        id: 'plastic_recycle',
        type: 'instant',
        action: 'Riciclo Plastica',
        points: 10,
        visualFeedback: {
          icon: Recycle,
          color: '#10b981',
          animation: 'bounce',
          sound: 'success',
          haptic: true
        },
        triggerCondition: 'onPlasticRecycle',
        impactMessage: '+10 punti per aver riciclato plastica!',
        timestamp: new Date()
      },
      {
        id: 'energy_save',
        type: 'accumulative',
        action: 'Risparmio Energetico',
        points: 25,
        visualFeedback: {
          icon: Zap,
          color: '#f59e0b',
          animation: 'glow',
          sound: 'energy',
          haptic: true
        },
        triggerCondition: 'onEnergySave',
        impactMessage: '+25 punti per risparmio energetico!',
        timestamp: new Date()
      }
    ];

    setActiveRewards(sampleRewards);
    animateParticles();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const animateParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      setParticles(currentParticles => {
        return currentParticles
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vy: particle.vy + 0.1, // gravity
            life: particle.life - 1,
            size: particle.size * 0.99
          }))
          .filter(particle => particle.life > 0);
      });

      particles.forEach(particle => {
        const alpha = particle.life / particle.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = particle.color;
        ctx.font = `${particle.size}px Arial`;
        ctx.fillText(particle.icon, particle.x, particle.y);
        ctx.restore();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const triggerMicroReward = (action: string) => {
    const rewardTypes = [
      { action: 'Riciclo Materiale', points: 15, icon: Recycle, color: '#10b981', message: 'Fantastico riciclo!' },
      { action: 'Risparmio Acqua', points: 20, icon: Droplets, color: '#3b82f6', message: 'Acqua salvata!' },
      { action: 'Energia Rinnovabile', points: 30, icon: Sun, color: '#f59e0b', message: 'Energia pulita!' },
      { action: 'Trasporto Verde', points: 25, icon: Wind, color: '#8b5cf6', message: 'Mobilità sostenibile!' },
      { action: 'Piantare Albero', points: 50, icon: TreePine, color: '#059669', message: 'Nuovo albero piantato!' }
    ];

    const reward = rewardTypes[Math.floor(Math.random() * rewardTypes.length)];
    
    // Add floating message
    const messageId = `msg_${Date.now()}`;
    setFloatingMessages(prev => [...prev, {
      id: messageId,
      message: `+${reward.points} ${reward.message}`,
      x: Math.random() * window.innerWidth,
      y: window.innerHeight * 0.7,
      color: reward.color
    }]);

    // Remove floating message after animation
    setTimeout(() => {
      setFloatingMessages(prev => prev.filter(msg => msg.id !== messageId));
    }, 2000);

    // Add particles
    const newParticles: AnimationParticle[] = [];
    for (let i = 0; i < 15; i++) {
      newParticles.push({
        id: `particle_${Date.now()}_${i}`,
        x: window.innerWidth / 2 + (Math.random() - 0.5) * 100,
        y: window.innerHeight / 2,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10 - 5,
        size: 20 + Math.random() * 10,
        color: reward.color,
        life: 60,
        maxLife: 60,
        icon: ['✨', '⭐', '💚', '🌟', '🎉'][Math.floor(Math.random() * 5)]
      });
    }

    setParticles(prev => [...prev, ...newParticles]);
    setDailyPoints(prev => prev + reward.points);
    setRecentActions(prev => [reward.action, ...prev.slice(0, 4)]);

    // Trigger haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
  };

  const triggerStreakReward = () => {
    setStreakCount(prev => prev + 1);
    
    // Special streak particles
    const streakParticles: AnimationParticle[] = [];
    for (let i = 0; i < 25; i++) {
      streakParticles.push({
        id: `streak_${Date.now()}_${i}`,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        vx: Math.cos((i / 25) * Math.PI * 2) * 8,
        vy: Math.sin((i / 25) * Math.PI * 2) * 8,
        size: 25,
        color: '#f59e0b',
        life: 90,
        maxLife: 90,
        icon: '🔥'
      });
    }

    setParticles(prev => [...prev, ...streakParticles]);
    setDailyPoints(prev => prev + streakCount * 10);

    setFloatingMessages(prev => [...prev, {
      id: `streak_${Date.now()}`,
      message: `🔥 Streak x${streakCount}! +${streakCount * 10} punti bonus!`,
      x: window.innerWidth / 2 - 150,
      y: window.innerHeight / 2 - 50,
      color: '#f59e0b'
    }]);
  };

  const triggerMilestoneReward = () => {
    // Epic milestone celebration
    const milestoneParticles: AnimationParticle[] = [];
    for (let i = 0; i < 50; i++) {
      milestoneParticles.push({
        id: `milestone_${Date.now()}_${i}`,
        x: Math.random() * window.innerWidth,
        y: -50,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        size: 30 + Math.random() * 20,
        color: ['#f59e0b', '#8b5cf6', '#10b981', '#ef4444', '#3b82f6'][Math.floor(Math.random() * 5)],
        life: 120,
        maxLife: 120,
        icon: ['🏆', '🎊', '🌟', '💎', '👑'][Math.floor(Math.random() * 5)]
      });
    }

    setParticles(prev => [...prev, ...milestoneParticles]);
    setDailyPoints(prev => prev + 1000);

    setFloatingMessages(prev => [...prev, {
      id: `milestone_${Date.now()}`,
      message: '🏆 MILESTONE RAGGIUNTO! +1000 punti!',
      x: window.innerWidth / 2 - 200,
      y: window.innerHeight / 2,
      color: '#f59e0b'
    }]);
  };

  return (
    <div className="container mx-auto p-6 space-y-8 min-h-screen futuristic-bg relative overflow-hidden">
      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-10"
        style={{ background: 'transparent' }}
      />

      {/* Floating Messages */}
      {floatingMessages.map(msg => (
        <div
          key={msg.id}
          className="fixed z-20 pointer-events-none animate-bounce"
          style={{
            left: msg.x,
            top: msg.y,
            color: msg.color,
            fontSize: '1.5rem',
            fontWeight: 'bold',
            textShadow: '0 0 10px rgba(255,255,255,0.5)',
            animation: 'float-up 2s ease-out forwards'
          }}
        >
          {msg.message}
        </div>
      ))}

      {/* Header */}
      <div className="text-center space-y-4 relative z-30">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent">
          Micro-Interaction Sustainability Rewards
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Ogni azione sostenibile viene ricompensata istantaneamente con feedback visivi, sonori e tattili coinvolgenti
        </p>
      </div>

      {/* Live Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-30">
        <Card className="glass-morph border-green-500/30 hover:scale-105 transition-transform duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-300">Punti Oggi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white animate-pulse">
              {dailyPoints.toLocaleString()}
            </div>
            <div className="text-xs text-green-400">
              +{Math.floor(Math.random() * 50)} negli ultimi 5 min
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morph border-orange-500/30 hover:scale-105 transition-transform duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-300">Streak Corrente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-3xl font-bold text-white">{streakCount}</div>
              <div className="text-2xl animate-bounce">🔥</div>
            </div>
            <div className="text-xs text-orange-400">
              giorni consecutivi
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morph border-purple-500/30 hover:scale-105 transition-transform duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">Azioni Oggi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {recentActions.length + 12}
            </div>
            <div className="text-xs text-purple-400">
              micro-interazioni positive
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morph border-cyan-500/30 hover:scale-105 transition-transform duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-cyan-300">Impatto CO2</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {(dailyPoints * 0.01).toFixed(1)}kg
            </div>
            <div className="text-xs text-cyan-400">
              risparmiata oggi
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Triggers */}
      <Card className="glass-morph border-blue-500/30 relative z-30">
        <CardHeader>
          <CardTitle className="text-xl text-blue-300 flex items-center">
            <Sparkles className="w-5 h-5 mr-2" />
            Trigger Micro-Rewards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Button
              onClick={() => triggerMicroReward('Riciclo')}
              className="h-20 flex flex-col items-center space-y-2 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transform hover:scale-110 transition-all duration-200"
            >
              <Recycle className="w-6 h-6" />
              <span className="text-xs">Ricicla</span>
            </Button>

            <Button
              onClick={() => triggerMicroReward('Acqua')}
              className="h-20 flex flex-col items-center space-y-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transform hover:scale-110 transition-all duration-200"
            >
              <Droplets className="w-6 h-6" />
              <span className="text-xs">Risparmia H2O</span>
            </Button>

            <Button
              onClick={() => triggerMicroReward('Energia')}
              className="h-20 flex flex-col items-center space-y-2 bg-gradient-to-br from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 transform hover:scale-110 transition-all duration-200"
            >
              <Sun className="w-6 h-6" />
              <span className="text-xs">Energia Verde</span>
            </Button>

            <Button
              onClick={triggerStreakReward}
              className="h-20 flex flex-col items-center space-y-2 bg-gradient-to-br from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 transform hover:scale-110 transition-all duration-200"
            >
              <Target className="w-6 h-6" />
              <span className="text-xs">Streak Bonus</span>
            </Button>

            <Button
              onClick={triggerMilestoneReward}
              className="h-20 flex flex-col items-center space-y-2 bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 transform hover:scale-110 transition-all duration-200"
            >
              <Star className="w-6 h-6" />
              <span className="text-xs">Milestone!</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Actions Feed */}
      <Card className="glass-morph border-green-500/30 relative z-30">
        <CardHeader>
          <CardTitle className="text-xl text-green-300 flex items-center">
            <Heart className="w-5 h-5 mr-2" />
            Azioni Recenti
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActions.map((action, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-3 rounded-lg glass-morph animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center animate-pulse">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white">{action}</div>
                  <div className="text-xs text-gray-400">
                    {new Date().toLocaleTimeString('it-IT')} • +{15 + Math.floor(Math.random() * 35)} punti
                  </div>
                </div>
                <div className="text-lg animate-bounce">✨</div>
              </div>
            ))}
            
            {recentActions.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                Inizia a compiere azioni sostenibili per vedere i tuoi reward istantanei!
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progress Rings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-30">
        <Card className="glass-morph border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-lg text-cyan-300">Obiettivo Giornaliero</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="rgba(75, 85, 99, 0.3)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="rgb(34, 211, 238)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - Math.min(dailyPoints / 1000, 1))}`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{Math.round((dailyPoints / 1000) * 100)}%</div>
                  <div className="text-xs text-gray-400">1000 punti</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morph border-yellow-500/30">
          <CardHeader>
            <CardTitle className="text-lg text-yellow-300">Streak Settimanale</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="rgba(75, 85, 99, 0.3)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="rgb(245, 158, 11)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - Math.min(streakCount / 7, 1))}`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{streakCount}</div>
                  <div className="text-xs text-gray-400">/ 7 giorni</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morph border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-lg text-purple-300">Impatto Mensile</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="rgba(75, 85, 99, 0.3)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="rgb(139, 92, 246)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - 0.65)}`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">65%</div>
                  <div className="text-xs text-gray-400">obiettivo</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float-up {
            from {
              opacity: 1;
              transform: translateY(0);
            }
            to {
              opacity: 0;
              transform: translateY(-100px);
            }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
          }
        `
      }} />
    </div>
  );
}
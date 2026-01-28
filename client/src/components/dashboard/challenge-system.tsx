import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Target, 
  Clock, 
  Users, 
  Zap, 
  Leaf,
  Star,
  Gift,
  CheckCircle2,
  Timer
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Challenge {
  id: number;
  title: string;
  description: string;
  category: 'daily' | 'weekly' | 'monthly' | 'special';
  difficulty: 'facile' | 'medio' | 'difficile';
  progress: number;
  target: number;
  reward: {
    points: number;
    badge?: string;
    unlock?: string;
  };
  timeLeft?: string;
  isCompleted: boolean;
  isActive: boolean;
}

interface ChallengeSystemProps {
  userId: number;
}

export function ChallengeSystem({ userId }: ChallengeSystemProps) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [completedToday, setCompletedToday] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  useEffect(() => {
    // Simula il caricamento delle sfide
    const mockChallenges: Challenge[] = [
      {
        id: 1,
        title: "Eco-Warrior Giornaliero",
        description: "Completa 3 progetti di riciclo oggi",
        category: 'daily',
        difficulty: 'facile',
        progress: 2,
        target: 3,
        reward: { points: 100, badge: "Guerriero Verde" },
        timeLeft: "6h 23m",
        isCompleted: false,
        isActive: true
      },
      {
        id: 2,
        title: "Maestro del Riutilizzo",
        description: "Ricicla 10 oggetti diversi questa settimana",
        category: 'weekly',
        difficulty: 'medio',
        progress: 7,
        target: 10,
        reward: { points: 500, unlock: "Nuove categorie materiali" },
        timeLeft: "2g 14h",
        isCompleted: false,
        isActive: true
      },
      {
        id: 3,
        title: "Innovatore Sostenibile",
        description: "Crea un progetto originale con materiali misti",
        category: 'special',
        difficulty: 'difficile',
        progress: 0,
        target: 1,
        reward: { points: 1000, badge: "Innovatore", unlock: "Modalità AR avanzata" },
        isCompleted: false,
        isActive: true
      },
      {
        id: 4,
        title: "Comunità Verde",
        description: "Condividi 5 progetti sui social",
        category: 'weekly',
        difficulty: 'facile',
        progress: 5,
        target: 5,
        reward: { points: 300, badge: "Influencer Eco" },
        isCompleted: true,
        isActive: false
      }
    ];

    setChallenges(mockChallenges);
    setCompletedToday(2);
    setStreak(7);
  }, [userId]);

  const getCategoryIcon = (category: Challenge['category']) => {
    switch (category) {
      case 'daily': return <Clock className="w-4 h-4" />;
      case 'weekly': return <Target className="w-4 h-4" />;
      case 'monthly': return <Trophy className="w-4 h-4" />;
      case 'special': return <Star className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: Challenge['category']) => {
    switch (category) {
      case 'daily': return 'bg-blue-500';
      case 'weekly': return 'bg-green-500';
      case 'monthly': return 'bg-purple-500';
      case 'special': return 'bg-yellow-500';
    }
  };

  const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
    switch (difficulty) {
      case 'facile': return 'bg-green-100 text-green-800';
      case 'medio': return 'bg-yellow-100 text-yellow-800';
      case 'difficile': return 'bg-red-100 text-red-800';
    }
  };

  const handleChallengeClick = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
  };

  const handleClaimReward = (challengeId: number) => {
    setChallenges(prev => 
      prev.map(c => 
        c.id === challengeId 
          ? { ...c, isActive: false }
          : c
      )
    );
    setSelectedChallenge(null);
  };

  const activeChallenges = challenges.filter(c => c.isActive);
  const completedChallenges = challenges.filter(c => c.isCompleted);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 rounded-lg border-2 border-green-200"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500 rounded-full">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-600">Completate Oggi</p>
              <p className="text-2xl font-bold text-green-800">{completedToday}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-50 to-cyan-100 p-4 rounded-lg border-2 border-blue-200"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-full">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-600">Streak Giorni</p>
              <p className="text-2xl font-bold text-blue-800">{streak}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-50 to-violet-100 p-4 rounded-lg border-2 border-purple-200"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 rounded-full">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-600">Sfide Attive</p>
              <p className="text-2xl font-bold text-purple-800">{activeChallenges.length}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Active Challenges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            Sfide Attive
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeChallenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${
                  challenge.isCompleted 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-white border-gray-200 hover:border-green-300'
                }`}
                onClick={() => handleChallengeClick(challenge)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-1 rounded-full ${getCategoryColor(challenge.category)}`}>
                        {getCategoryIcon(challenge.category)}
                      </div>
                      <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
                      <Badge className={getDifficultyColor(challenge.difficulty)}>
                        {challenge.difficulty}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          Progresso: {challenge.progress}/{challenge.target}
                        </span>
                        {challenge.timeLeft && (
                          <span className="flex items-center gap-1 text-orange-600">
                            <Timer className="w-3 h-3" />
                            {challenge.timeLeft}
                          </span>
                        )}
                      </div>
                      
                      <Progress 
                        value={(challenge.progress / challenge.target) * 100} 
                        className="h-2"
                      />
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1 text-green-600">
                            <Gift className="w-3 h-3" />
                            {challenge.reward.points} punti
                          </span>
                          {challenge.reward.badge && (
                            <span className="text-purple-600">
                              🏆 {challenge.reward.badge}
                            </span>
                          )}
                        </div>
                        
                        {challenge.isCompleted && (
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClaimReward(challenge.id);
                            }}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Riscatta
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Completed Challenges Today */}
      {completedChallenges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Completate Oggi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {completedChallenges.map((challenge) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">{challenge.title}</p>
                      <p className="text-sm text-green-600">
                        +{challenge.reward.points} punti guadagnati
                      </p>
                    </div>
                  </div>
                  {challenge.reward.badge && (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      🏆 {challenge.reward.badge}
                    </Badge>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Challenge Detail Modal */}
      <AnimatePresence>
        {selectedChallenge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedChallenge(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center space-y-4">
                <div className={`w-16 h-16 rounded-full ${getCategoryColor(selectedChallenge.category)} flex items-center justify-center mx-auto`}>
                  {getCategoryIcon(selectedChallenge.category)}
                </div>
                
                <h2 className="text-xl font-bold">{selectedChallenge.title}</h2>
                <p className="text-gray-600">{selectedChallenge.description}</p>
                
                <div className="space-y-3">
                  <Progress 
                    value={(selectedChallenge.progress / selectedChallenge.target) * 100} 
                    className="h-3"
                  />
                  <p className="text-sm text-gray-500">
                    {selectedChallenge.progress}/{selectedChallenge.target} completato
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Ricompense:</h3>
                  <ul className="text-sm space-y-1">
                    <li>🎯 {selectedChallenge.reward.points} punti esperienza</li>
                    {selectedChallenge.reward.badge && (
                      <li>🏆 Badge: {selectedChallenge.reward.badge}</li>
                    )}
                    {selectedChallenge.reward.unlock && (
                      <li>🔓 Sblocca: {selectedChallenge.reward.unlock}</li>
                    )}
                  </ul>
                </div>
                
                <Button 
                  onClick={() => setSelectedChallenge(null)}
                  className="w-full"
                >
                  Continua la Sfida
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
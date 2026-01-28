import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Crown, 
  Medal, 
  Trophy, 
  TrendingUp, 
  Users, 
  Leaf,
  Target,
  Star,
  ChevronUp,
  ChevronDown,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

interface LeaderboardUser {
  id: number;
  name: string;
  avatar?: string;
  points: number;
  level: number;
  rank: number;
  previousRank?: number;
  streak: number;
  projectsCompleted: number;
  materialsRecycled: number;
  badges: string[];
  isCurrentUser?: boolean;
}

interface CommunityLeaderboardProps {
  userId: number;
}

export function CommunityLeaderboard({ userId }: CommunityLeaderboardProps) {
  const [leaderboardData, setLeaderboardData] = useState<{
    weekly: LeaderboardUser[];
    monthly: LeaderboardUser[];
    allTime: LeaderboardUser[];
  }>({
    weekly: [],
    monthly: [],
    allTime: []
  });
  
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'allTime'>('weekly');
  const [currentUserRank, setCurrentUserRank] = useState<LeaderboardUser | null>(null);

  useEffect(() => {
    // Simula il caricamento dei dati della classifica
    const mockData = {
      weekly: [
        {
          id: 1,
          name: "Marco Verdi",
          avatar: "/avatars/marco.jpg",
          points: 2850,
          level: 15,
          rank: 1,
          previousRank: 3,
          streak: 12,
          projectsCompleted: 28,
          materialsRecycled: 156,
          badges: ["Eco-Warrior", "Innovatore", "Maestro Verde"]
        },
        {
          id: 2,
          name: "Elena Rossi",
          avatar: "/avatars/elena.jpg",
          points: 2720,
          level: 14,
          rank: 2,
          previousRank: 1,
          streak: 8,
          projectsCompleted: 25,
          materialsRecycled: 142,
          badges: ["Riciclatore Pro", "Community Leader"]
        },
        {
          id: userId,
          name: "Tu",
          points: 1850,
          level: 9,
          rank: 8,
          previousRank: 12,
          streak: 5,
          projectsCompleted: 18,
          materialsRecycled: 89,
          badges: ["Eco-Rookie", "Innovatore"],
          isCurrentUser: true
        }
      ],
      monthly: [
        {
          id: 1,
          name: "Sofia Bianchi",
          points: 8450,
          level: 22,
          rank: 1,
          previousRank: 2,
          streak: 25,
          projectsCompleted: 67,
          materialsRecycled: 324,
          badges: ["Leggenda Verde", "Maestro Supreme", "Eco-Champion"]
        },
        {
          id: userId,
          name: "Tu",
          points: 5220,
          level: 9,
          rank: 15,
          previousRank: 18,
          streak: 5,
          projectsCompleted: 42,
          materialsRecycled: 189,
          badges: ["Eco-Rookie", "Innovatore"],
          isCurrentUser: true
        }
      ],
      allTime: [
        {
          id: 1,
          name: "Alessandro Neri",
          points: 45850,
          level: 58,
          rank: 1,
          streak: 127,
          projectsCompleted: 289,
          materialsRecycled: 1456,
          badges: ["Leggenda Assoluta", "Eco-God", "Pioniere Verde"]
        },
        {
          id: userId,
          name: "Tu",
          points: 12420,
          level: 9,
          rank: 89,
          previousRank: 95,
          streak: 5,
          projectsCompleted: 82,
          materialsRecycled: 389,
          badges: ["Eco-Rookie", "Innovatore"],
          isCurrentUser: true
        }
      ]
    };

    setLeaderboardData(mockData);
    setCurrentUserRank(mockData.weekly.find(u => u.isCurrentUser) || null);
  }, [userId]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Trophy className="w-5 h-5 text-amber-600" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankChange = (rank: number, previousRank?: number) => {
    if (!previousRank) return null;
    
    const change = previousRank - rank;
    if (change > 0) {
      return (
        <div className="flex items-center text-green-600 text-xs">
          <ChevronUp className="w-3 h-3" />
          +{change}
        </div>
      );
    } else if (change < 0) {
      return (
        <div className="flex items-center text-red-600 text-xs">
          <ChevronDown className="w-3 h-3" />
          {change}
        </div>
      );
    }
    return <div className="text-gray-400 text-xs">-</div>;
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const renderLeaderboardList = (users: LeaderboardUser[]) => (
    <div className="space-y-3">
      {users.slice(0, 10).map((user, index) => (
        <motion.div
          key={user.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`p-4 rounded-lg border-2 transition-all ${
            user.isCurrentUser 
              ? 'bg-green-50 border-green-300 shadow-lg' 
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {getRankIcon(user.rank)}
                {getRankChange(user.rank, user.previousRank)}
              </div>
              
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
              </Avatar>
              
              <div>
                <div className="flex items-center gap-2">
                  <h3 className={`font-semibold ${user.isCurrentUser ? 'text-green-800' : 'text-gray-900'}`}>
                    {user.name}
                  </h3>
                  {user.isCurrentUser && (
                    <Badge className="bg-green-100 text-green-800 text-xs">Tu</Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Livello {user.level}</span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {user.streak} giorni
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    {user.projectsCompleted} progetti
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-bold text-lg text-green-600">
                {user.points.toLocaleString()} pt
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Leaf className="w-3 h-3" />
                {user.materialsRecycled} materiali
              </div>
            </div>
          </div>
          
          {user.badges.length > 0 && (
            <div className="flex items-center justify-between mt-2">
              <div className="flex gap-1">
                {user.badges.slice(0, 3).map((badge, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {badge}
                  </Badge>
                ))}
                {user.badges.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{user.badges.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Current User Rank Card */}
      {currentUserRank && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Star className="w-5 h-5" />
              La Tua Posizione
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">#{currentUserRank.rank}</div>
                  <div className="text-xs text-green-600">Posizione</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{currentUserRank.points}</div>
                  <div className="text-xs text-green-600">Punti</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{currentUserRank.level}</div>
                  <div className="text-xs text-green-600">Livello</div>
                </div>
              </div>
              
              <div className="text-right">
                {getRankChange(currentUserRank.rank, currentUserRank.previousRank)}
                <div className="text-xs text-gray-500 mt-1">
                  vs settimana scorsa
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            Classifica Comunità
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="weekly" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Settimanale
              </TabsTrigger>
              <TabsTrigger value="monthly" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Mensile
              </TabsTrigger>
              <TabsTrigger value="allTime" className="flex items-center gap-2">
                <Crown className="w-4 h-4" />
                Sempre
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="weekly" className="mt-6">
              {renderLeaderboardList(leaderboardData.weekly)}
            </TabsContent>
            
            <TabsContent value="monthly" className="mt-6">
              {renderLeaderboardList(leaderboardData.monthly)}
            </TabsContent>
            
            <TabsContent value="allTime" className="mt-6">
              {renderLeaderboardList(leaderboardData.allTime)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Challenge Others Button */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-blue-800">Sfida i Tuoi Amici!</h3>
              <p className="text-sm text-blue-600">
                Invita amici e colleghi a competere in sfide eco-sostenibili
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Invita Amici
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
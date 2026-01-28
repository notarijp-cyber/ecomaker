import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Users, 
  BookOpen, 
  Camera, 
  Zap,
  ArrowLeft
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

// Import all advanced components
import { ChallengeSystem } from "@/components/dashboard/challenge-system";
import { CommunityLeaderboard } from "@/components/dashboard/community-leaderboard";
import { InteractiveTutorials } from "@/components/dashboard/interactive-tutorials";
import { AdvancedARFeatures } from "@/components/dashboard/advanced-ar-features";

export default function AdvancedFeatures() {
  const [activeTab, setActiveTab] = useState("challenges");
  const userId = 1; // Mock user ID

  const features = [
    {
      id: "challenges",
      title: "Sistema Sfide",
      description: "Sfide giornaliere, settimanali e speciali per aumentare il coinvolgimento",
      icon: Trophy,
      color: "from-green-500 to-emerald-600"
    },
    {
      id: "leaderboard", 
      title: "Classifica Comunità",
      description: "Compete con altri utenti e raggiungi la vetta della sostenibilità",
      icon: Users,
      color: "from-blue-500 to-cyan-600"
    },
    {
      id: "tutorials",
      title: "Tutorial Interattivi", 
      description: "Guide passo-passo con video, AR e modalità hands-on",
      icon: BookOpen,
      color: "from-purple-500 to-violet-600"
    },
    {
      id: "ar",
      title: "AR Avanzata",
      description: "Realtà aumentata con scansione materiali e visualizzazione 3D",
      icon: Camera,
      color: "from-orange-500 to-red-600"
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Funzionalità Avanzate</h1>
          <p className="text-gray-600 mt-2">
            Esplora le caratteristiche più accattivanti di EcoMaker
          </p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Torna alla Dashboard
          </Button>
        </Link>
      </motion.div>

      {/* Feature Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature, index) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                activeTab === feature.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
              }`}
              onClick={() => setActiveTab(feature.id)}
            >
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Sfide
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Classifica
            </TabsTrigger>
            <TabsTrigger value="tutorials" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Tutorial
            </TabsTrigger>
            <TabsTrigger value="ar" className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              AR
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="challenges" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <ChallengeSystem userId={userId} />
              </motion.div>
            </TabsContent>

            <TabsContent value="leaderboard" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <CommunityLeaderboard userId={userId} />
              </motion.div>
            </TabsContent>

            <TabsContent value="tutorials" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <InteractiveTutorials userId={userId} />
              </motion.div>
            </TabsContent>

            <TabsContent value="ar" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <AdvancedARFeatures userId={userId} />
              </motion.div>
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>

      {/* Stats Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-12"
      >
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="flex items-center justify-center mb-2">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">15+</div>
                <div className="text-sm text-gray-600">Sfide Attive</div>
              </div>
              <div>
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600">2.5K+</div>
                <div className="text-sm text-gray-600">Utenti Attivi</div>
              </div>
              <div>
                <div className="flex items-center justify-center mb-2">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-600">25+</div>
                <div className="text-sm text-gray-600">Tutorial Disponibili</div>
              </div>
              <div>
                <div className="flex items-center justify-center mb-2">
                  <Camera className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-orange-600">50+</div>
                <div className="text-sm text-gray-600">Modelli AR</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
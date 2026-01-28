import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Instagram, Twitter, Facebook, Copy, Camera, Download, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

interface SocialSharingProps {
  userId: number;
}

export function SocialSharing({ userId }: SocialSharingProps) {
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const [generatedCard, setGeneratedCard] = useState<string | null>(null);

  const { data: impact } = useQuery({ queryKey: ['/api/environmental-impact', userId] });
  const { data: projects } = useQuery({ queryKey: ['/api/projects'] });

  const userProjects = (projects || []).filter((p: any) => p.userId === userId);
  const completedProjects = userProjects.filter((p: any) => p.completionPercentage === 100);

  const generateSocialCard = async () => {
    setIsGeneratingCard(true);
    // Simulate card generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, this would generate an actual image
    setGeneratedCard(`data:image/svg+xml,${encodeURIComponent(`
      <svg width="600" height="315" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="600" height="315" fill="url(#bg)"/>
        <text x="50" y="80" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white">EcoMaker</text>
        <text x="50" y="130" font-family="Arial, sans-serif" font-size="20" fill="white">🌱 ${impact?.materialsRecycled || 0}kg di materiali riciclati</text>
        <text x="50" y="160" font-family="Arial, sans-serif" font-size="20" fill="white">🌍 ${impact?.carbonFootprintReduction || 0}kg CO₂ risparmiati</text>
        <text x="50" y="190" font-family="Arial, sans-serif" font-size="20" fill="white">🏆 ${completedProjects.length} progetti completati</text>
        <text x="50" y="250" font-family="Arial, sans-serif" font-size="16" fill="white" opacity="0.9">#EcoMaker #Sostenibilità #Riciclo #UpcyclingChallenge</text>
      </svg>
    `)}`);
    
    setIsGeneratingCard(false);
  };

  const shareTexts = {
    general: `🌱 Sto facendo la differenza con EcoMaker! Ho riciclato ${impact?.materialsRecycled || 0}kg di materiali e risparmiato ${impact?.carbonFootprintReduction || 0}kg di CO₂. Unisciti alla rivoluzione green! #EcoMaker #Sostenibilità`,
    instagram: `🌍✨ La mia journey verso un futuro più sostenibile continua!
    
🔹 ${impact?.materialsRecycled || 0}kg di materiali trasformati
🔹 ${impact?.carbonFootprintReduction || 0}kg di CO₂ risparmiati  
🔹 ${completedProjects.length} progetti creativi completati

Ogni piccolo gesto conta! 💚 Qual è il tuo prossimo progetto green?

#EcoMaker #UpcyclingChallenge #Sostenibilità #ZeroWaste #CreativityMeetsEcology #GreenLiving #RecycleArt`,
    twitter: `🌱 Update sostenibilità: ${impact?.materialsRecycled || 0}kg riciclati, ${impact?.carbonFootprintReduction || 0}kg CO₂ risparmiati con @EcoMaker! 

Chi si unisce alla sfida? 🌍💚 #UpcyclingChallenge #Sostenibilità`,
    facebook: `🌍 Piccoli gesti, grandi risultati! 

Grazie a EcoMaker ho scoperto quanto sia gratificante trasformare materiali di scarto in oggetti utili e belli. 

📊 I miei progressi:
• ${impact?.materialsRecycled || 0}kg di materiali riciclati
• ${impact?.carbonFootprintReduction || 0}kg di CO₂ risparmiati
• ${completedProjects.length} progetti creativi completati

L'upcycling non è solo ecologia, è creatività, risparmio e soddisfazione personale! 

Chi vuole iniziare questa avventura green con me? 💚

#EcoMaker #Sostenibilità #Upcycling #Riciclo #DIY`
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const shareToSocial = (platform: string, text: string) => {
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`,
      instagram: `https://www.instagram.com/` // Instagram requires the app
    };
    
    if (platform === 'instagram') {
      copyToClipboard(text);
      alert('Testo copiato! Aprire Instagram e incollare nel post.');
    } else {
      window.open(urls[platform as keyof typeof urls], '_blank');
    }
  };

  return (
    <Card className="relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-green-400 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <CardHeader>
        <div className="flex items-center gap-2">
          <Share2 className="h-5 w-5 text-green-600" />
          <CardTitle>Condividi i Tuoi Progressi</CardTitle>
          <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
        </div>
        <CardDescription>
          Inspira altri a unirsi alla rivoluzione sostenibile
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Summary */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{impact?.materialsRecycled || 0}</div>
            <div className="text-xs text-gray-600">kg riciclati</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{impact?.carbonFootprintReduction || 0}</div>
            <div className="text-xs text-gray-600">kg CO₂ salvati</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{completedProjects.length}</div>
            <div className="text-xs text-gray-600">progetti</div>
          </div>
        </div>

        {/* Generate Social Card */}
        <div className="space-y-4">
          <Button 
            onClick={generateSocialCard}
            disabled={isGeneratingCard}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
          >
            <Camera className="h-4 w-4 mr-2" />
            {isGeneratingCard ? 'Generando...' : 'Genera Card Social'}
          </Button>

          {generatedCard && (
            <div className="relative">
              <img 
                src={generatedCard} 
                alt="Social Media Card" 
                className="w-full rounded-lg shadow-lg animate-pulse-green"
              />
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-2 right-2"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = generatedCard;
                  link.download = 'ecomaker-progress.svg';
                  link.click();
                }}
              >
                <Download className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        {/* Social Platform Buttons */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-700">Condividi su:</h4>
          
          <div className="grid grid-cols-1 gap-3">
            {/* Instagram */}
            <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <Instagram className="h-5 w-5 text-pink-600" />
              <div className="flex-1">
                <div className="font-medium">Instagram</div>
                <div className="text-xs text-gray-500">Post con hashtag e stories</div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(shareTexts.instagram)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => shareToSocial('instagram', shareTexts.instagram)}
                  className="bg-pink-600 hover:bg-pink-700"
                >
                  Condividi
                </Button>
              </div>
            </div>

            {/* Twitter */}
            <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <Twitter className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <div className="font-medium">Twitter</div>
                <div className="text-xs text-gray-500">Tweet i tuoi risultati</div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(shareTexts.twitter)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => shareToSocial('twitter', shareTexts.twitter)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Tweet
                </Button>
              </div>
            </div>

            {/* Facebook */}
            <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <Facebook className="h-5 w-5 text-blue-800" />
              <div className="flex-1">
                <div className="font-medium">Facebook</div>
                <div className="text-xs text-gray-500">Condividi con amici e famiglia</div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(shareTexts.facebook)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => shareToSocial('facebook', shareTexts.facebook)}
                  className="bg-blue-800 hover:bg-blue-900"
                >
                  Condividi
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Challenges and Hashtags */}
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h4 className="font-semibold text-yellow-800 mb-2">💡 Sfide Social</h4>
          <div className="space-y-2 text-sm text-yellow-700">
            <div>🏆 <strong>#30GiorniEcoMaker:</strong> Condividi un progetto al giorno</div>
            <div>🌱 <strong>#UpcyclingChallenge:</strong> Sfida i tuoi amici a riciclare</div>
            <div>📸 <strong>#BeforeAfterEco:</strong> Mostra la trasformazione</div>
          </div>
        </div>

        {/* Popular Hashtags */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Hashtag Popolari:</h4>
          <div className="flex flex-wrap gap-2">
            {[
              '#EcoMaker', '#Sostenibilità', '#Upcycling', '#ZeroWaste', 
              '#DIYEco', '#RecycleArt', '#GreenLiving', '#UpcyclingChallenge'
            ].map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="cursor-pointer hover:bg-green-100"
                onClick={() => copyToClipboard(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
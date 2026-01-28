import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark,
  Play,
  Pause,
  Volume2,
  Camera,
  MapPin,
  Calendar,
  Users,
  Trophy,
  Sparkles,
  Eye,
  ThumbsUp,
  Award,
  Globe,
  Filter,
  Search,
  PlusCircle,
  Mic,
  Image as ImageIcon,
  Video,
  TrendingUp
} from 'lucide-react';

interface Story {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    level: number;
    badges: string[];
  };
  category: 'trasformazione' | 'ispirazione' | 'tutorial' | 'sfida' | 'risultato';
  type: 'text' | 'image' | 'video' | 'audio';
  media?: {
    url: string;
    thumbnail?: string;
    duration?: number;
  };
  location?: {
    city: string;
    country: string;
    coordinates?: [number, number];
  };
  project?: {
    id: string;
    name: string;
    beforeImage: string;
    afterImage: string;
    materialsSaved: string[];
    co2Reduction: number;
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    bookmarks: number;
    views: number;
  };
  impact: {
    inspirationScore: number;
    educationalValue: number;
    communityReach: number;
    environmentalImpact: number;
  };
  tags: string[];
  publishedAt: Date;
  featured: boolean;
  verified: boolean;
}

interface CommunityStats {
  totalStories: number;
  totalViews: number;
  totalInspired: number;
  globalCO2Saved: number;
  topContributors: Array<{
    id: string;
    name: string;
    avatar: string;
    storiesCount: number;
    totalImpact: number;
  }>;
  trendingTopics: string[];
  monthlyGrowth: number;
}

export default function CommunityStorytellingPlatform() {
  const [stories, setStories] = useState<Story[]>([]);
  const [communityStats, setCommunityStats] = useState<CommunityStats | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('tutti');
  const [selectedType, setSelectedType] = useState('tutti');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingStory, setIsCreatingStory] = useState(false);
  const [playingStory, setPlayingStory] = useState<string | null>(null);

  useEffect(() => {
    // Simula caricamento storie della community
    const storiesData: Story[] = [
      {
        id: 'story_001',
        title: 'Da Pneumatico Abbandonato a Giardino Verticale',
        content: 'Ho trovato questo pneumatico abbandonato nel mio quartiere e ho deciso di trasformarlo in qualcosa di bello. Con un po\' di creatività e alcune piante grasse, è diventato il centro del mio piccolo giardino urbano. La soddisfazione di vedere qualcosa di inutile diventare fonte di vita è indescrivibile!',
        author: {
          id: 'user_001',
          name: 'Marco Verdi',
          avatar: '/api/placeholder/40/40',
          level: 8,
          badges: ['eco_warrior', 'creative_genius', 'community_leader']
        },
        category: 'trasformazione',
        type: 'image',
        media: {
          url: '/api/placeholder/600/400',
          thumbnail: '/api/placeholder/200/150'
        },
        location: {
          city: 'Milano',
          country: 'Italia',
          coordinates: [45.4642, 9.1900]
        },
        project: {
          id: 'proj_001',
          name: 'Giardino Verticale da Pneumatico',
          beforeImage: '/api/placeholder/300/200',
          afterImage: '/api/placeholder/300/200',
          materialsSaved: ['pneumatico_auto', 'terra', 'piante_grasse'],
          co2Reduction: 12.5
        },
        engagement: {
          likes: 247,
          comments: 32,
          shares: 18,
          bookmarks: 56,
          views: 1250
        },
        impact: {
          inspirationScore: 92,
          educationalValue: 88,
          communityReach: 85,
          environmentalImpact: 90
        },
        tags: ['pneumatici', 'giardinaggio', 'urbano', 'fai_da_te', 'verde'],
        publishedAt: new Date('2024-06-20'),
        featured: true,
        verified: true
      },
      {
        id: 'story_002',
        title: 'La Sfida dei 30 Giorni Zero Plastica',
        content: 'Ho accettato la sfida della community di vivere 30 giorni senza plastica monouso. Non credevo fosse possibile, ma con creatività e determinazione ce l\'ho fatta! Ecco tutti i trucchi che ho imparato...',
        author: {
          id: 'user_002',
          name: 'Sofia Bianchi',
          avatar: '/api/placeholder/40/40',
          level: 12,
          badges: ['zero_waste', 'influencer', 'challenge_master']
        },
        category: 'sfida',
        type: 'video',
        media: {
          url: '/api/placeholder/600/400',
          thumbnail: '/api/placeholder/200/150',
          duration: 180
        },
        location: {
          city: 'Roma',
          country: 'Italia'
        },
        engagement: {
          likes: 412,
          comments: 67,
          shares: 89,
          bookmarks: 123,
          views: 2850
        },
        impact: {
          inspirationScore: 96,
          educationalValue: 94,
          communityReach: 92,
          environmentalImpact: 88
        },
        tags: ['zero_plastica', 'sfida', 'stile_vita', 'sostenibilità'],
        publishedAt: new Date('2024-06-18'),
        featured: true,
        verified: true
      },
      {
        id: 'story_003',
        title: 'Tutorial: Lampada da Bottiglia di Vino',
        content: 'Step by step per creare una lampada elegante da bottiglie di vino. Materiali semplici, risultato professionale!',
        author: {
          id: 'user_003',
          name: 'Alessandro Rossi',
          avatar: '/api/placeholder/40/40',
          level: 6,
          badges: ['maker', 'tutorial_expert']
        },
        category: 'tutorial',
        type: 'audio',
        media: {
          url: '/api/placeholder/600/400',
          duration: 420
        },
        location: {
          city: 'Firenze',
          country: 'Italia'
        },
        project: {
          id: 'proj_003',
          name: 'Lampada Bottiglia Vino',
          beforeImage: '/api/placeholder/300/200',
          afterImage: '/api/placeholder/300/200',
          materialsSaved: ['bottiglia_vetro', 'led_strip', 'cavo'],
          co2Reduction: 8.2
        },
        engagement: {
          likes: 189,
          comments: 28,
          shares: 45,
          bookmarks: 78,
          views: 920
        },
        impact: {
          inspirationScore: 85,
          educationalValue: 95,
          communityReach: 78,
          environmentalImpact: 82
        },
        tags: ['vetro', 'illuminazione', 'tutorial', 'vino', 'elegante'],
        publishedAt: new Date('2024-06-15'),
        featured: false,
        verified: true
      },
      {
        id: 'story_004',
        title: 'Come ho Coinvolto la Mia Scuola nel Riciclo',
        content: 'La mia esperienza nell\'organizzare un programma di riciclo nella scuola di mio figlio. Dai primi rifiuti alla trasformazione completa della mentalità!',
        author: {
          id: 'user_004',
          name: 'Laura Neri',
          avatar: '/api/placeholder/40/40',
          level: 10,
          badges: ['educator', 'community_builder', 'parent_hero']
        },
        category: 'ispirazione',
        type: 'text',
        location: {
          city: 'Bologna',
          country: 'Italia'
        },
        engagement: {
          likes: 156,
          comments: 42,
          shares: 67,
          bookmarks: 89,
          views: 1420
        },
        impact: {
          inspirationScore: 94,
          educationalValue: 90,
          communityReach: 96,
          environmentalImpact: 85
        },
        tags: ['educazione', 'scuola', 'comunità', 'bambini', 'sensibilizzazione'],
        publishedAt: new Date('2024-06-12'),
        featured: false,
        verified: true
      }
    ];

    const statsData: CommunityStats = {
      totalStories: 1247,
      totalViews: 89450,
      totalInspired: 15678,
      globalCO2Saved: 2847.5,
      topContributors: [
        { id: 'user_001', name: 'Marco Verdi', avatar: '/api/placeholder/40/40', storiesCount: 23, totalImpact: 245.8 },
        { id: 'user_002', name: 'Sofia Bianchi', avatar: '/api/placeholder/40/40', storiesCount: 19, totalImpact: 198.2 },
        { id: 'user_003', name: 'Alessandro Rossi', avatar: '/api/placeholder/40/40', storiesCount: 15, totalImpact: 167.9 }
      ],
      trendingTopics: ['zero_plastica', 'upcycling', 'pneumatici', 'vetro', 'giardino_urbano'],
      monthlyGrowth: 34.5
    };

    setStories(storiesData);
    setCommunityStats(statsData);
  }, []);

  const filteredStories = stories.filter(story => {
    const matchesCategory = selectedCategory === 'tutti' || story.category === selectedCategory;
    const matchesType = selectedType === 'tutti' || story.type === selectedType;
    const matchesSearch = searchQuery === '' || 
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesType && matchesSearch;
  });

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image': return ImageIcon;
      case 'video': return Video;
      case 'audio': return Mic;
      default: return MessageCircle;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'trasformazione': return 'bg-green-500';
      case 'ispirazione': return 'bg-blue-500';
      case 'tutorial': return 'bg-purple-500';
      case 'sfida': return 'bg-orange-500';
      case 'risultato': return 'bg-cyan-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleLike = (storyId: string) => {
    setStories(prev => prev.map(story => 
      story.id === storyId 
        ? { ...story, engagement: { ...story.engagement, likes: story.engagement.likes + 1 } }
        : story
    ));
  };

  const handleBookmark = (storyId: string) => {
    setStories(prev => prev.map(story => 
      story.id === storyId 
        ? { ...story, engagement: { ...story.engagement, bookmarks: story.engagement.bookmarks + 1 } }
        : story
    ));
  };

  const toggleAudioPlay = (storyId: string) => {
    setPlayingStory(playingStory === storyId ? null : storyId);
  };

  if (!communityStats) {
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
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Community Impact Storytelling
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Condividi la tua storia, ispira la comunità e amplifica l'impatto ambientale attraverso il potere del racconto
        </p>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-morph border-purple-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">Storie Totali</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{communityStats.totalStories.toLocaleString()}</div>
            <div className="flex items-center text-sm text-green-400">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{communityStats.monthlyGrowth}% questo mese
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morph border-blue-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-300">Visualizzazioni</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{communityStats.totalViews.toLocaleString()}</div>
            <div className="flex items-center text-sm text-blue-400">
              <Eye className="w-3 h-3 mr-1" />
              Engagement alto
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morph border-green-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-300">Persone Ispirate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{communityStats.totalInspired.toLocaleString()}</div>
            <div className="flex items-center text-sm text-green-400">
              <Sparkles className="w-3 h-3 mr-1" />
              Impatto crescente
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morph border-orange-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-300">CO2 Risparmiata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{communityStats.globalCO2Saved.toFixed(1)}kg</div>
            <div className="flex items-center text-sm text-orange-400">
              <Globe className="w-3 h-3 mr-1" />
              Impatto globale
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Contributors */}
      <Card className="glass-morph border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-xl text-cyan-300 flex items-center">
            <Trophy className="w-5 h-5 mr-2" />
            Top Contributors della Community
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {communityStats.topContributors.map((contributor, index) => (
              <div key={contributor.id} className="flex items-center space-x-3 p-3 rounded-lg glass-morph">
                <div className="relative">
                  <img 
                    src={contributor.avatar} 
                    alt={contributor.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                  }`}>
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white">{contributor.name}</div>
                  <div className="text-sm text-gray-400">{contributor.storiesCount} storie</div>
                  <div className="text-xs text-green-400">+{contributor.totalImpact.toFixed(1)}kg CO2</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Controls and Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="Cerca storie, tag, autori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-morph border-gray-600"
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48 glass-morph">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tutti">Tutte le categorie</SelectItem>
            <SelectItem value="trasformazione">Trasformazione</SelectItem>
            <SelectItem value="ispirazione">Ispirazione</SelectItem>
            <SelectItem value="tutorial">Tutorial</SelectItem>
            <SelectItem value="sfida">Sfida</SelectItem>
            <SelectItem value="risultato">Risultato</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-48 glass-morph">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tutti">Tutti i formati</SelectItem>
            <SelectItem value="text">Testo</SelectItem>
            <SelectItem value="image">Immagine</SelectItem>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="audio">Audio</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={() => setIsCreatingStory(true)} className="cyber-button">
          <PlusCircle className="w-4 h-4 mr-2" />
          Racconta la Tua Storia
        </Button>
      </div>

      {/* Trending Topics */}
      <Card className="glass-morph border-pink-500/30">
        <CardHeader>
          <CardTitle className="text-lg text-pink-300">Trending Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {communityStats.trendingTopics.map(topic => (
              <Badge key={topic} className="bg-pink-500/20 text-pink-300 border-pink-500/30 cursor-pointer hover:bg-pink-500/30">
                #{topic}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stories Feed */}
      <div className="space-y-6">
        {filteredStories.map(story => {
          const MediaIcon = getMediaIcon(story.type);
          
          return (
            <Card key={story.id} className={`glass-morph ${story.featured ? 'border-yellow-500/50 shadow-yellow-500/20' : 'border-cyan-500/30'}`}>
              {story.featured && (
                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-2 border-b border-yellow-500/30">
                  <div className="flex items-center text-yellow-300 text-sm font-medium">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Storia in Evidenza
                  </div>
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <img 
                      src={story.author.avatar} 
                      alt={story.author.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-lg text-white">{story.title}</CardTitle>
                        {story.verified && (
                          <Badge className="bg-blue-500 text-white text-xs">
                            <Award className="w-3 h-3 mr-1" />
                            Verificata
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <span className="font-medium text-cyan-300">{story.author.name}</span>
                        <span>•</span>
                        <span>Livello {story.author.level}</span>
                        {story.location && (
                          <>
                            <span>•</span>
                            <MapPin className="w-3 h-3 inline" />
                            <span>{story.location.city}</span>
                          </>
                        )}
                        <span>•</span>
                        <Calendar className="w-3 h-3 inline" />
                        <span>{story.publishedAt.toLocaleDateString('it-IT')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getCategoryColor(story.category)} text-white text-xs`}>
                      {story.category}
                    </Badge>
                    <MediaIcon className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">{story.content}</p>
                
                {/* Media Content */}
                {story.media && (
                  <div className="rounded-lg overflow-hidden">
                    {story.type === 'image' && (
                      <img 
                        src={story.media.url} 
                        alt={story.title}
                        className="w-full h-64 object-cover"
                      />
                    )}
                    
                    {story.type === 'video' && (
                      <div className="relative">
                        <img 
                          src={story.media.thumbnail} 
                          alt={story.title}
                          className="w-full h-64 object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Button size="lg" className="rounded-full bg-white/20 backdrop-blur-sm">
                            <Play className="w-6 h-6 text-white" />
                          </Button>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {formatDuration(story.media.duration || 0)}
                        </div>
                      </div>
                    )}
                    
                    {story.type === 'audio' && (
                      <div className="bg-gray-800 rounded-lg p-4 flex items-center space-x-4">
                        <Button 
                          size="sm" 
                          onClick={() => toggleAudioPlay(story.id)}
                          className="rounded-full"
                        >
                          {playingStory === story.id ? 
                            <Pause className="w-4 h-4" /> : 
                            <Play className="w-4 h-4" />
                          }
                        </Button>
                        <div className="flex-1">
                          <div className="w-full bg-gray-600 rounded-full h-2">
                            <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '30%' }} />
                          </div>
                        </div>
                        <div className="text-sm text-gray-400">
                          {formatDuration(story.media.duration || 0)}
                        </div>
                        <Volume2 className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                )}
                
                {/* Project Before/After */}
                {story.project && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-800/50 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Prima</h4>
                      <img 
                        src={story.project.beforeImage} 
                        alt="Prima"
                        className="w-full h-32 object-cover rounded"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Dopo</h4>
                      <img 
                        src={story.project.afterImage} 
                        alt="Dopo"
                        className="w-full h-32 object-cover rounded"
                      />
                    </div>
                    <div className="col-span-2 pt-2 border-t border-gray-700">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">CO2 Risparmiata:</span>
                        <span className="text-green-400 font-medium">+{story.project.co2Reduction}kg</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {story.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs text-gray-400 border-gray-600">
                      #{tag}
                    </Badge>
                  ))}
                </div>
                
                {/* Impact Metrics */}
                <div className="grid grid-cols-4 gap-4 p-3 bg-gray-800/30 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold text-cyan-400">{story.impact.inspirationScore}</div>
                    <div className="text-xs text-gray-400">Ispirazione</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-400">{story.impact.educationalValue}</div>
                    <div className="text-xs text-gray-400">Educativo</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-400">{story.impact.communityReach}</div>
                    <div className="text-xs text-gray-400">Diffusione</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400">{story.impact.environmentalImpact}</div>
                    <div className="text-xs text-gray-400">Ambiente</div>
                  </div>
                </div>
                
                {/* Engagement Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="flex items-center space-x-6">
                    <button 
                      onClick={() => handleLike(story.id)}
                      className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Heart className="w-5 h-5" />
                      <span className="text-sm">{story.engagement.likes}</span>
                    </button>
                    
                    <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">{story.engagement.comments}</span>
                    </button>
                    
                    <button className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors">
                      <Share2 className="w-5 h-5" />
                      <span className="text-sm">{story.engagement.shares}</span>
                    </button>
                    
                    <button 
                      onClick={() => handleBookmark(story.id)}
                      className="flex items-center space-x-2 text-gray-400 hover:text-yellow-400 transition-colors"
                    >
                      <Bookmark className="w-5 h-5" />
                      <span className="text-sm">{story.engagement.bookmarks}</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-400 text-sm">
                    <Eye className="w-4 h-4" />
                    <span>{story.engagement.views.toLocaleString()} visualizzazioni</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

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
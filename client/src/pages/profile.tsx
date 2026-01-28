import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { auth, db, storage } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useSocial } from '@/context/social-context';
import { 
  Camera, Edit2, MapPin, Calendar, Shield, Zap, Leaf, Trophy, 
  Image as ImageIcon, Send, Search, Package
} from "lucide-react";

// EMOTICON PvZ STYLE
const REACTIONS = [
    { id: 'happy', icon: '🌻', label: 'Felice' },
    { id: 'brain', icon: '🧠', label: 'Geniale' },
    { id: 'zombie', icon: '🧟', label: 'Confuso' },
    { id: 'science', icon: '🧪', label: 'Scienza' },
    { id: 'gem', icon: '💎', label: 'Prezioso' },
];

export default function ProfilePage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { addPost, posts } = useSocial();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [showMaterialSearch, setShowMaterialSearch] = useState(false);

  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) return;
      const userRef = doc(db, "users", auth.currentUser.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        setUserData(snap.data());
      } else {
        // Fallback
        setUserData({
            displayName: auth.currentUser.displayName || "Maker",
            photoURL: auth.currentUser.photoURL,
            coverURL: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809",
            level: 1, experience: 0, credits: 0, projectsCompleted: 0, co2Saved: 0,
            location: "Terra Base", joinDate: new Date().getFullYear(), bio: "Nessuna biografia."
        });
      }
      setLoading(false);
    };
    fetchUserData();
  }, []);

  const handleImageUpload = async (file: File, type: 'profile' | 'cover') => {
      if (!auth.currentUser) return;
      setUploading(true);
      try {
          const storageRef = ref(storage, `users/${auth.currentUser.uid}/${type}_${Date.now()}`);
          await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(storageRef);
          
          const updateData = type === 'profile' ? { photoURL: downloadURL } : { coverURL: downloadURL };
          await updateDoc(doc(db, "users", auth.currentUser.uid), updateData);
          
          setUserData((prev: any) => ({ ...prev, ...updateData }));
          toast({ title: "Immagine Aggiornata!", className: "bg-green-600 text-white" });
      } catch (error) {
          console.error(error);
          toast({ title: "Errore Upload", description: "Riprova più tardi.", variant: "destructive" });
      } finally {
          setUploading(false);
      }
  };

  const handlePostStatus = () => {
      if(!newStatus.trim() || !auth.currentUser) return;
      
      addPost({
          author: userData.displayName,
          avatar: userData.photoURL,
          content: newStatus,
          type: 'STATUS'
      });

      setNewStatus("");
      toast({ title: "Pubblicato!", description: "Il post è ora visibile sul tuo profilo e nella community." });
  };

  const handleRequestMaterial = () => {
      setShowMaterialSearch(false);
      setNewStatus(prev => prev + " [Cerco: PET Riciclato ♻️] ");
      toast({ title: "Materiale Aggiunto", description: "Completa il post per pubblicare la richiesta." });
  };

  const userPosts = posts.filter(post => post.author === userData?.displayName || post.author === "Tu (EcoMaker)");

  if (loading) return <div className="p-20 text-center animate-pulse text-cyan-500">Caricamento Profilo...</div>;

  const xpForNextLevel = userData.level * 1000;
  const xpPercentage = Math.min(100, (userData.experience / xpForNextLevel) * 100);

  return (
    <div className="container mx-auto p-0 md:p-4 min-h-screen text-white pb-20 animate-in fade-in relative">

      <input type="file" ref={profileImageInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'profile')} />
      <input type="file" ref={coverImageInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'cover')} />
      
      {/* COPERTINA & AVATAR */}
      <div className="relative mb-24 md:mb-32 group">
          <div className="h-48 md:h-80 w-full relative overflow-hidden md:rounded-b-3xl bg-slate-900">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f111a] via-transparent to-transparent z-10"></div>
              {userData.coverURL && <img src={userData.coverURL} alt="Cover" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />}
              <Button 
                  size="sm" variant="secondary" 
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => coverImageInputRef.current?.click()}
                  disabled={uploading}
              >
                  <Camera className="w-4 h-4 mr-2"/> Cambia Copertina
              </Button>
          </div>

          <div className="absolute -bottom-20 md:-bottom-24 left-4 md:left-10 flex items-end gap-6 z-20">
              <div className="relative group/avatar">
                  <Avatar className="w-32 h-32 md:w-48 md:h-48 border-4 border-[#0f111a] shadow-2xl relative z-10">
                      <AvatarImage src={userData.photoURL} className="object-cover"/>
                      <AvatarFallback className="text-4xl bg-slate-800">{userData.displayName?.[0]}</AvatarFallback>
                  </Avatar>
                   <Button 
                      size="icon" variant="secondary" 
                      className="absolute bottom-2 right-2 bg-cyan-600/80 hover:bg-cyan-500 text-white rounded-full w-10 h-10 border-2 border-[#0f111a] z-20 opacity-0 group-hover/avatar:opacity-100 transition-opacity"
                      onClick={() => profileImageInputRef.current?.click()}
                      disabled={uploading}
                  >
                      <Camera className="w-5 h-5"/>
                  </Button>
              </div>
              
              <div className="mb-4 md:mb-6 hidden md:block">
                  <div className="flex items-center gap-3 mb-1">
                      <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-lg">{userData.displayName}</h1>
                      <Badge className="bg-cyan-600 hover:bg-cyan-500 text-sm px-3 py-1 border border-cyan-400/50">LVL {userData.level}</Badge>
                  </div>
                   <div className="flex items-center gap-4 text-slate-300 text-sm font-medium">
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-slate-400"/> {userData.location}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-slate-400"/> Iscritto nel {userData.joinDate}</span>
                  </div>
              </div>
          </div>
      </div>

      {/* MOBILE NAME */}
      <div className="md:hidden px-4 mb-6 mt-2 text-center">
          <h1 className="text-3xl font-black text-white mb-2">{userData.displayName}</h1>
          <Badge className="bg-cyan-600 text-sm px-3 py-1 mx-auto">LVL {userData.level}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
          
          {/* SX: STATS */}
          <div className="lg:col-span-1 space-y-8">
              <Card className="bg-[#1a1d2d]/80 backdrop-blur-xl border-slate-700/50 shadow-xl overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500"></div>
                  <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-white"><Shield className="w-5 h-5 text-cyan-400"/> Stato Maker</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                       <div className="grid grid-cols-2 gap-4 text-center">
                          <div className="bg-black/30 p-3 rounded-xl border border-slate-800">
                              <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-1"/>
                              <div className="text-2xl font-black text-white">{userData.credits}</div>
                              <div className="text-xs text-slate-400 font-bold uppercase">Crediti QC</div>
                          </div>
                           <div className="bg-black/30 p-3 rounded-xl border border-slate-800">
                              <Trophy className="w-6 h-6 text-purple-400 mx-auto mb-1"/>
                              <div className="text-2xl font-black text-white">{userData.projectsCompleted}</div>
                              <div className="text-xs text-slate-400 font-bold uppercase">Progetti</div>
                          </div>
                       </div>
                       <div className="space-y-2">
                          <div className="flex justify-between text-sm font-bold">
                              <span className="text-cyan-400">XP Livello {userData.level}</span>
                              <span className="text-slate-400">{userData.experience} / {xpForNextLevel}</span>
                          </div>
                          <Progress value={xpPercentage} className="h-3 bg-slate-800/50" indicatorClassName="bg-gradient-to-r from-cyan-500 to-purple-500"/>
                       </div>
                  </CardContent>
              </Card>

              <Card className="bg-[#1a1d2d]/80 backdrop-blur-xl border-slate-700/50 shadow-xl relative">
                   <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-white text-lg">Bio</CardTitle>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-white"><Edit2 className="w-4 h-4"/></Button>
                  </CardHeader>
                  <CardContent>
                      <p className="text-slate-300 italic leading-relaxed">"{userData.bio}"</p>
                  </CardContent>
              </Card>
          </div>

          {/* DX: FEED & ATTIVITÀ */}
          <div className="lg:col-span-2">
              <Tabs defaultValue="posts" className="w-full">
                  <TabsList className="w-full justify-start bg-[#1a1d2d]/80 border border-slate-700/50 p-1 h-auto rounded-xl mb-6">
                      <TabsTrigger value="posts" className="flex-1 text-slate-400 py-3 data-[state=active]:text-white data-[state=active]:bg-cyan-900/50">Attività & Post</TabsTrigger>
                      <TabsTrigger value="projects" className="flex-1 text-slate-400 py-3 data-[state=active]:text-white data-[state=active]:bg-cyan-900/50">Vetrina</TabsTrigger>
                  </TabsList>

                  <TabsContent value="posts" className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                      
                      {/* BOX CREAZIONE POST */}
                      <Card className="bg-[#1a1d2d] border-slate-700 shadow-xl relative overflow-hidden group">
                          <CardContent className="p-4 relative z-10">
                              <div className="flex gap-4">
                                  <Avatar className="w-12 h-12 border-2 border-cyan-500/30"><AvatarImage src={userData.photoURL} /></Avatar>
                                  <Input 
                                      placeholder={`Condividi un'idea o una richiesta, ${userData.displayName}...`} 
                                      className="bg-black/30 border-slate-700 text-white h-12 rounded-full px-6"
                                      value={newStatus}
                                      onChange={(e) => setNewStatus(e.target.value)}
                                  />
                              </div>
                              <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-800/50">
                                  <div className="flex gap-2">
                                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-cyan-400 gap-2">
                                          <ImageIcon className="w-5 h-5"/>
                                      </Button>
                                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-purple-400 gap-2" onClick={() => setShowMaterialSearch(!showMaterialSearch)}>
                                          <Package className="w-5 h-5"/> <span className="hidden md:inline text-xs font-bold">Richiedi Materiale</span>
                                      </Button>
                                  </div>
                                  <Button className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-full px-6 font-bold" onClick={handlePostStatus}>
                                      Pubblica <Send className="w-4 h-4 ml-2"/>
                                  </Button>
                              </div>
                              
                              {/* POPUP RICERCA MATERIALI (SIMULATO) */}
                              {showMaterialSearch && (
                                  <div className="absolute top-16 left-4 right-4 bg-[#0f111a] border border-slate-700 p-4 rounded-xl shadow-2xl z-50 animate-in zoom-in-95">
                                      <h4 className="text-sm font-bold text-white mb-2">Libreria Bot Materiali</h4>
                                      <div className="flex gap-2 mb-2">
                                          <Input placeholder="Cerca materiale (es. Vetro)..." className="h-8 bg-black/50 border-slate-700"/>
                                          <Button size="sm" className="h-8"><Search className="w-4 h-4"/></Button>
                                      </div>
                                      <div className="space-y-1">
                                          <div className="p-2 hover:bg-slate-800 rounded cursor-pointer text-xs text-slate-300" onClick={handleRequestMaterial}>PET Riciclato (Bot Gen #239)</div>
                                          <div className="p-2 hover:bg-slate-800 rounded cursor-pointer text-xs text-slate-300" onClick={handleRequestMaterial}>Legno Composito (Bot Gen #110)</div>
                                      </div>
                                  </div>
                              )}
                          </CardContent>
                      </Card>
                      
                      {/* LISTA POST UTENTE */}
                      {userPosts.length > 0 ? (
                          userPosts.map((post) => (
                            <Card key={post.id} className="bg-[#1a1d2d] border-slate-700/80 animate-in fade-in">
                                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                    <Avatar><AvatarImage src={post.avatar} /></Avatar>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-white">{post.author}</h4>
                                        <p className="text-xs text-slate-500">{post.timestamp}</p>
                                    </div>
                                </CardHeader>
                                <CardContent className="pb-2">
                                    <p className="text-slate-200 text-base">{post.content}</p>
                                </CardContent>
                                <CardFooter className="pt-2 border-t border-slate-800 flex gap-2 overflow-x-auto pb-2">
                                    {/* REAZIONI PvZ STYLE */}
                                    {REACTIONS.map((react) => (
                                        <Button key={react.id} variant="ghost" className="h-8 px-2 text-lg hover:bg-white/10 rounded-full" title={react.label}>
                                            {react.icon}
                                        </Button>
                                    ))}
                                </CardFooter>
                            </Card>
                          ))
                      ) : (
                          <div className="text-center py-12 bg-[#1a1d2d]/50 rounded-xl border border-slate-800 border-dashed">
                              <p className="text-slate-400 font-medium">Non hai ancora pubblicato nulla.</p>
                          </div>
                      )}
                  </TabsContent>

                  <TabsContent value="projects">
                      {/* Placeholder Vetrina */}
                      <Card className="bg-[#1a1d2d] border-slate-700 text-center p-12">
                          <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                          <h3 className="text-xl font-bold text-white mb-2">Vetrina Vuota</h3>
                          <p className="text-slate-400 mb-6">Completa il tuo primo progetto per mostrarlo qui.</p>
                          <Button onClick={() => setLocation('/ar-material-scan')} className="bg-purple-600 hover:bg-purple-500 text-white">Inizia Progetto</Button>
                      </Card>
                  </TabsContent>
              </Tabs>
          </div>
      </div>
    </div>
  );
}
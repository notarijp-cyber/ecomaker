import React, { useState } from 'react';
import { useSocial } from '@/context/social-context';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, Image as ImageIcon, MoreHorizontal, UserPlus, X, Send, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function Community() {
  const { posts, addPost, shareToExternal } = useSocial();
  const [newPostContent, setNewPostContent] = useState("");
  const [activeChat, setActiveChat] = useState<string | null>(null);

  const STORIES = [
      { id: 0, user: "Tu", img: "https://github.com/shadcn.png", isAdd: true },
      { id: 1, user: "Maker_King", img: "https://i.pravatar.cc/150?u=a042581f4e29026024d", active: true },
      { id: 2, user: "GreenSoul", img: "https://i.pravatar.cc/150?u=a042581f4e29026704d", active: true },
      { id: 3, user: "ArtBot", img: "https://i.pravatar.cc/150?u=a04258114e29026302d", active: false },
  ];

  const handlePost = () => {
      if(!newPostContent) return;
      addPost({
          author: "Tu (EcoMaker)",
          avatar: "https://github.com/shadcn.png",
          content: newPostContent,
          type: 'STATUS'
      });
      setNewPostContent("");
  };

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen text-white grid grid-cols-1 lg:grid-cols-4 gap-8 relative">
        
        {/* SIDEBAR SX: PROFILO */}
        <div className="hidden lg:block space-y-6">
            <Card className="bg-[#1a1d2d] border-slate-700 text-center p-6 sticky top-24">
                <div className="relative inline-block">
                    <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-cyan-500">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>TU</AvatarFallback>
                    </Avatar>
                    <Badge className="absolute bottom-4 right-0 bg-cyan-600 border-2 border-[#1a1d2d] rounded-full w-6 h-6 p-0 flex items-center justify-center"><Plus className="w-4 h-4 text-white"/></Badge>
                </div>
                <h3 className="font-bold text-white text-xl">Eco Maker</h3>
                <p className="text-slate-400 text-sm mb-4">Quantum Architect Lvl. 5</p>
                <div className="flex justify-center gap-4 text-sm font-bold border-t border-slate-700 pt-4">
                    <div className="text-center"><span className="block text-lg text-white">1.2k</span>Follower</div>
                    <div className="text-center"><span className="block text-lg text-white">45</span>Seguiti</div>
                </div>
                <Button variant="outline" className="w-full mt-4 border-slate-600 hover:bg-slate-800">Modifica Profilo</Button>
            </Card>
        </div>

        {/* FEED CENTRALE */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* STORIES BAR */}
            <ScrollArea className="w-full whitespace-nowrap rounded-xl bg-[#1a1d2d] border border-slate-700 p-4">
                <div className="flex w-max space-x-4">
                    {STORIES.map((story) => (
                        <div key={story.id} className="flex flex-col items-center gap-2 cursor-pointer group">
                            <div className={`p-[2px] rounded-full ${story.active ? 'bg-gradient-to-tr from-yellow-400 to-fuchsia-600' : 'bg-slate-700'} ${story.isAdd ? 'border-2 border-dashed border-slate-500 p-1' : ''}`}>
                                <Avatar className="w-16 h-16 border-2 border-[#1a1d2d] group-hover:scale-95 transition-transform">
                                    <AvatarImage src={story.img} />
                                    <AvatarFallback>{story.user[0]}</AvatarFallback>
                                </Avatar>
                            </div>
                            <span className="text-xs text-slate-300">{story.user}</span>
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>

            {/* BOX CREAZIONE */}
            <Card className="bg-[#1a1d2d] border-slate-700">
                <CardContent className="p-4">
                    <div className="flex gap-4">
                        <Avatar><AvatarImage src="https://github.com/shadcn.png" /></Avatar>
                        <Input 
                            placeholder="Condividi un progetto o un pensiero..." 
                            className="bg-black/30 border-slate-700 text-white rounded-full px-6"
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end mt-3">
                        <Button className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-full px-6" onClick={handlePost}>Pubblica</Button>
                    </div>
                </CardContent>
            </Card>

            {/* POST FEED */}
            {posts.map((post) => (
                <Card key={post.id} className="bg-[#1a1d2d] border-slate-700">
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                        <Avatar className="cursor-pointer hover:opacity-80"><AvatarImage src={post.avatar} /></Avatar>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h4 className="font-bold text-white cursor-pointer hover:underline">{post.author}</h4>
                                <Button size="sm" variant="link" className="h-auto p-0 text-cyan-400 text-xs font-bold">Segui</Button>
                            </div>
                            <p className="text-xs text-slate-500">{post.timestamp}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="text-slate-500"><MoreHorizontal className="w-5 h-5"/></Button>
                    </CardHeader>
                    <CardContent className="pb-2">
                        <p className="text-slate-200 mb-4 text-base">{post.content}</p>
                        {post.image && (
                            <div className="rounded-xl overflow-hidden mb-4 border border-slate-800">
                                <img src={post.image} alt="Post" className="w-full object-cover max-h-[500px]" />
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="pt-2 border-t border-slate-800 flex justify-between">
                        <Button variant="ghost" className="text-slate-400 hover:text-red-500 gap-2"><Heart className="w-5 h-5"/> {post.likes}</Button>
                        <Button variant="ghost" className="text-slate-400 hover:text-cyan-500 gap-2"><MessageCircle className="w-5 h-5"/> {post.comments}</Button>
                        <Button variant="ghost" className="text-slate-400 hover:text-green-500 gap-2" onClick={() => shareToExternal("Social", post.content)}><Share2 className="w-5 h-5"/></Button>
                    </CardFooter>
                </Card>
            ))}
        </div>

        {/* SIDEBAR DX: SUGGERIMENTI & CHAT */}
        <div className="hidden lg:block space-y-6">
            <Card className="bg-[#1a1d2d] border-slate-700 p-4 sticky top-24">
                <h4 className="font-bold text-white mb-4 text-sm uppercase text-slate-400">Suggeriti per te</h4>
                <ul className="space-y-4">
                    {["Maker_King", "GreenSoul", "ArtBot_20"].map((user, i) => (
                        <li key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveChat(user)}>
                                <Avatar className="w-10 h-10"><AvatarFallback className="bg-slate-700">{user[0]}</AvatarFallback></Avatar>
                                <div>
                                    <h5 className="font-bold text-white text-sm hover:underline">{user}</h5>
                                    <p className="text-slate-500 text-[10px]">Nuovo iscritto</p>
                                </div>
                            </div>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-cyan-400 bg-cyan-900/20 hover:bg-cyan-900/40 rounded-full"><UserPlus className="w-4 h-4"/></Button>
                        </li>
                    ))}
                </ul>
                <Button variant="outline" className="w-full mt-6 border-slate-700 text-xs">Cerca Amici (Email/Contatti)</Button>
            </Card>
        </div>

        {/* CHAT WINDOW FLOATING */}
        {activeChat && (
            <div className="fixed bottom-0 right-8 w-80 bg-[#1a1d2d] border border-slate-700 rounded-t-xl shadow-2xl z-50 animate-in slide-in-from-bottom-10">
                <div className="flex items-center justify-between p-3 border-b border-slate-700 bg-cyan-950/30 rounded-t-xl cursor-pointer" onClick={() => setActiveChat(null)}>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="font-bold text-white">{activeChat}</span>
                    </div>
                    <X className="w-4 h-4 text-slate-400 hover:text-white" />
                </div>
                <div className="h-64 p-4 overflow-y-auto space-y-3 bg-[#0f111a]">
                    <div className="flex justify-start"><span className="bg-slate-800 text-slate-200 text-sm py-1 px-3 rounded-tr-xl rounded-br-xl rounded-bl-xl">Ciao! Hai quel materiale?</span></div>
                    <div className="flex justify-end"><span className="bg-cyan-700 text-white text-sm py-1 px-3 rounded-tl-xl rounded-bl-xl rounded-br-xl">Sì, certo! Controlla il market.</span></div>
                </div>
                <div className="p-3 border-t border-slate-700 flex gap-2">
                    <Input placeholder="Scrivi..." className="h-8 bg-black/30 border-slate-600 text-xs text-white"/>
                    <Button size="icon" className="h-8 w-8 bg-cyan-600 hover:bg-cyan-500"><Send className="w-4 h-4"/></Button>
                </div>
            </div>
        )}
    </div>
  );
}
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

// TIPI DI DATI
export type NewsItem = {
    id: number;
    category: 'GLOBAL' | 'TECH' | 'ACTIVISM' | 'MARKET';
    text: string;
    source: string;
    time: string;
};

export type SocialPost = {
    id: number;
    author: string;
    avatar: string;
    content: string;
    image?: string;
    likes: number;
    comments: number;
    type: 'PROJECT' | 'EVENT' | 'STATUS' | 'SALE';
    timestamp: string;
};

type SocialContextType = {
    news: NewsItem[];
    posts: SocialPost[];
    addPost: (post: Omit<SocialPost, 'id' | 'likes' | 'comments' | 'timestamp'>) => void;
    shareToExternal: (platform: string, content: string) => void;
};

const SocialContext = createContext<SocialContextType | undefined>(undefined);

// NOTIZIE SIMULATE (Mix Realtà/Fantasia)
const MOCK_NEWS: NewsItem[] = [
    { id: 1, category: 'GLOBAL', text: "Friday For Future: 1,2 Milioni di studenti in piazza a Berlino per il clima.", source: "Reuters", time: "10 min fa" },
    { id: 2, category: 'TECH', text: "Nuovo polimero biodegradabile scoperto al MIT: Potrebbe sostituire il PET?", source: "TechCrunch", time: "25 min fa" },
    { id: 3, category: 'MARKET', text: "Il prezzo del Rame riciclato sale del 15% nel Mercato Quantum.", source: "EcoMarket Cap", time: "1 ora fa" },
    { id: 4, category: 'ACTIVISM', text: "Ocean Cleanup: Interceptor 004 raggiunge l'obiettivo mensile a Rio.", source: "GreenPeace News", time: "2 ore fa" },
    { id: 5, category: 'GLOBAL', text: "L'UE approva la nuova direttiva sul 'Diritto alla Riparazione' per gli smartphone.", source: "Euronews", time: "3 ore fa" },
];

const INITIAL_POSTS: SocialPost[] = [
    { id: 1, author: "Maker_Pro_99", avatar: "https://github.com/shadcn.png", content: "Appena finita la mia Lampada in Vinile! 🎸 Che ne pensate?", image: "https://images.unsplash.com/photo-1605111956046-249767215320?auto=format&fit=crop&q=80&w=800", likes: 45, comments: 12, type: 'PROJECT', timestamp: "Oggi, 10:30" },
    { id: 2, author: "GreenSoul", avatar: "https://github.com/shadcn.png", content: "Parteciperò al Friday for Quantum a Milano! Chi viene con me?", likes: 120, comments: 34, type: 'EVENT', timestamp: "Oggi, 09:15" },
];

export const SocialProvider = ({ children }: { children: React.ReactNode }) => {
    const [news, setNews] = useState<NewsItem[]>(MOCK_NEWS);
    const [posts, setPosts] = useState<SocialPost[]>(INITIAL_POSTS);
    const { toast } = useToast();

    // Simulazione rotazione News Ticker
    useEffect(() => {
        const interval = setInterval(() => {
            setNews(prev => {
                const [first, ...rest] = prev;
                return [...rest, first];
            });
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const addPost = (newPost: Omit<SocialPost, 'id' | 'likes' | 'comments' | 'timestamp'>) => {
        const post: SocialPost = {
            id: Date.now(),
            ...newPost,
            likes: 0,
            comments: 0,
            timestamp: "Appena adesso"
        };
        setPosts(prev => [post, ...prev]);
        toast({ title: "Condiviso nella Community!", className: "bg-purple-600 text-white border-purple-500" });
    };

    const shareToExternal = (platform: string, content: string) => {
        // Simulazione condivisione esterna
        navigator.clipboard.writeText(content);
        toast({ title: `Apertura ${platform}...`, description: "Link copiato negli appunti!", className: "bg-blue-600 text-white border-blue-500" });
    };

    return (
        <SocialContext.Provider value={{ news, posts, addPost, shareToExternal }}>
            {children}
        </SocialContext.Provider>
    );
};

export const useSocial = () => {
    const context = useContext(SocialContext);
    if (!context) throw new Error("useSocial deve essere usato all'interno di un SocialProvider");
    return context;
};
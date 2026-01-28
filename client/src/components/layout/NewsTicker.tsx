import React from 'react';
import { useSocial } from '@/context/social-context';
import { Globe, TrendingUp, Cpu, Leaf } from 'lucide-react';

export const NewsTicker = () => {
    const { news } = useSocial();
    const currentNews = news[0]; 

    const getIcon = (cat: string) => {
        switch(cat) {
            case 'GLOBAL': return <Globe className="w-4 h-4 text-blue-400"/>;
            case 'MARKET': return <TrendingUp className="w-4 h-4 text-yellow-400"/>;
            case 'TECH': return <Cpu className="w-4 h-4 text-purple-400"/>;
            default: return <Leaf className="w-4 h-4 text-green-400"/>;
        }
    };

    return (
        <div className="w-full bg-black/60 border-y border-slate-800 backdrop-blur-md h-10 flex items-center overflow-hidden relative z-20">
            <div className="bg-cyan-950/90 px-4 h-full flex items-center z-10 border-r border-cyan-500/30">
                <span className="text-[10px] md:text-xs font-black text-cyan-400 uppercase tracking-widest animate-pulse flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"/> LIVE NEWS
                </span>
            </div>
            
            <div className="flex-1 flex items-center px-4 animate-in fade-in slide-in-from-right duration-700 key={currentNews.id}">
                <span className="mr-3">{getIcon(currentNews.category)}</span>
                <span className="text-xs font-bold text-cyan-200 mr-2">[{currentNews.source}]</span>
                <p className="text-sm text-white truncate font-medium">{currentNews.text}</p>
                <span className="ml-auto text-xs text-slate-500 font-mono hidden md:block">{currentNews.time}</span>
            </div>
        </div>
    );
};
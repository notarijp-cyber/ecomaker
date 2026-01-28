import React, { useState, useEffect } from 'react';
import { Globe, ArrowUpRight } from 'lucide-react';

const newsItems = [
  { title: "Prezzo del Rame riciclato sale del 15% nel Mercato Quantum", source: "EcoMarket Cap", url: "#" },
  { title: "Friday For Future: 1.2 Milioni di studenti a Berlino", source: "Reuters", url: "https://reuters.com" },
  { title: "Nuova lega di alluminio a zero emissioni scoperta", source: "Material Science", url: "https://nature.com" },
  { title: "UE: Approvata legge sul diritto alla riparazione", source: "Euronews", url: "https://euronews.com" },
];

const LiveNews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % newsItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-black/40 border-y border-cyan-500/20 backdrop-blur-sm overflow-hidden flex items-center h-10">
      <div className="bg-cyan-900/80 h-full px-4 flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider z-10 shadow-[0_0_15px_rgba(8,145,178,0.5)]">
        <Globe className="w-3 h-3 animate-pulse" />
        Live News
      </div>
      <div className="flex-1 relative h-full flex items-center overflow-hidden">
        {newsItems.map((item, idx) => (
          <a 
            key={idx}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`absolute w-full px-4 flex items-center gap-3 transition-all duration-700 ease-in-out cursor-pointer hover:text-cyan-300 group ${
              idx === currentIndex ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            }`}
          >
            <span className="text-gray-400 text-xs font-mono">[{item.source}]</span>
            <span className="text-gray-200 text-sm truncate">{item.title}</span>
            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default LiveNews;
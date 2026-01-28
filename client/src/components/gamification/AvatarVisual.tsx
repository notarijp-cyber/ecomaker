import React from 'react';
import { AvatarType, AVATAR_LORE } from '@/lib/avatar-lore';

interface AvatarVisualProps {
  type: AvatarType;
  level: number;
  className?: string;
  onClick?: () => void;
}

export function AvatarVisual({ type, level, className = "", onClick }: AvatarVisualProps) {
  const config = AVATAR_LORE[type] || AVATAR_LORE['EchoBot'];
  
  // Calcola complessità visiva in base al livello (1-5)
  const complexity = Math.min(level, 5);
  
  return (
    <div 
      className={`relative group cursor-pointer transition-transform hover:scale-105 ${className}`} 
      onClick={onClick}
    >
      {/* AURA ENERGETICA (Cambia colore) */}
      <div 
        className="absolute inset-0 rounded-full blur-2xl animate-pulse opacity-40"
        style={{ backgroundColor: config.colors.primary }}
      ></div>

      {/* RENDER SVG DINAMICO */}
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl relative z-10">
        
        {/* CORPO BASE (Diverso per tipo) */}
        {type === 'EchoBot' && (
           <g className="animate-float">
              <circle cx="100" cy="100" r={40 + (complexity * 5)} fill="#1e293b" stroke={config.colors.primary} strokeWidth="3" />
              <path d="M100 170 Q100 140 100 140" stroke={config.colors.secondary} strokeWidth="4" className="animate-pulse"/>
           </g>
        )}
        
        {type === 'GreenGuardian' && (
           <g className="animate-float">
              <path d="M100 160 Q60 100 100 40 Q140 100 100 160 Z" fill="#1e293b" stroke={config.colors.primary} strokeWidth="3" />
              {/* Foglie che crescono col livello */}
              {[...Array(complexity)].map((_, i) => (
                 <circle key={i} cx={60 + (i*20)} cy={100 + (i%2 === 0 ? -10 : 10)} r="8" fill={config.colors.secondary} className="animate-bounce" style={{animationDelay: `${i*0.2}s`}}/>
              ))}
           </g>
        )}

        {type === 'TrashTitan' && (
           <g className="animate-float">
              <rect x="70" y="70" width="60" height={60 + (complexity * 5)} rx="8" fill="#1e293b" stroke={config.colors.primary} strokeWidth="3" />
              <rect x="60" y="100" width="10" height="40" fill={config.colors.secondary} /> {/* Braccio SX */}
              <rect x="130" y="100" width="10" height="40" fill={config.colors.secondary} /> {/* Braccio DX */}
           </g>
        )}

        {/* FACCIA (Occhi ed espressione) */}
        <g transform={`translate(${type === 'TrashTitan' ? 0 : 0}, ${type === 'GreenGuardian' ? -10 : 0})`}>
            {/* Visore */}
            <rect x="75" y="85" width="50" height="20" rx="5" fill="#000" />
            
            {/* Occhi (blink animation) */}
            <circle cx="90" cy="95" r={3 + (complexity)} fill={config.colors.secondary} className="animate-blink" />
            <circle cx="110" cy="95" r={3 + (complexity)} fill={config.colors.secondary} className="animate-blink" style={{animationDelay: '0.2s'}} />
        </g>

        {/* ACCESSORI LIVELLO (Unlock visivi) */}
        {level >= 2 && <circle cx="100" cy="50" r="5" fill={config.colors.primary} className="animate-ping" />} {/* Antenna */}
        {level >= 3 && <path d="M50 100 L20 80 M150 100 L180 80" stroke={config.colors.secondary} strokeWidth="2" />} {/* Ali/Estensioni */}
        {level >= 5 && <circle cx="100" cy="100" r="90" stroke={config.colors.glow} strokeWidth="1" fill="none" className="animate-spin-slow" />} {/* Halo Finale */}

      </svg>

      {/* BADGE LIVELLO */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 rounded-full px-3 py-0.5 text-[10px] font-mono text-white shadow-lg">
         LVL {level}
      </div>
    </div>
  );
}
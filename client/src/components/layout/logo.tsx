import React from 'react';

export const QuantumHeartLogo = ({ className = "w-12 h-12" }: { className?: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={`${className} overflow-visible`}>
      <defs>
        {/* Gradiente Quantum: Natura (Verde) -> Tech (Ciano) -> Infinito (Viola) */}
        <linearGradient id="quantum-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22c55e" /> {/* Green */}
          <stop offset="50%" stopColor="#06b6d4" /> {/* Cyan */}
          <stop offset="100%" stopColor="#a855f7" /> {/* Purple */}
        </linearGradient>
        
        {/* Filtro Glow per l'effetto luminoso */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Gruppo Principale con animazione pulsante */}
      <g className="animate-pulse-slow" filter="url(#glow)">
          {/* Forma Base: Ibrido Cuore/Foglia Organico */}
          <path
            d="M 50 95 C 20 75, 0 50, 0 30 C 0 10, 20 0, 40 10 C 45 12, 48 15, 50 20 C 52 15, 55 12, 60 10 C 80 0, 100 10, 100 30 C 100 50, 80 75, 50 95 Z"
            fill="none"
            stroke="url(#quantum-grad)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Simbolo dell'Infinito intrecciato al centro */}
          <path
            d="M 30 35 C 30 50, 70 50, 70 35 C 70 20, 30 20, 30 35 Z M 30 35 C 15 35, 15 55, 30 55 C 45 55, 45 35, 30 35 Z M 70 35 C 85 35, 85 55, 70 55 C 55 55, 55 35, 70 35 Z"
            fill="none"
            stroke="url(#quantum-grad)"
            strokeWidth="1.5"
            opacity="0.8"
          />

          {/* Tracce di Circuito (Tech) che collegano i punti */}
          <g stroke="url(#quantum-grad)" strokeWidth="1.5" fill="none">
             <path d="M 50 20 L 50 30 M 30 55 L 50 75 L 70 55" />
             {/* Nodi energetici */}
             <circle cx="50" cy="30" r="2.5" fill="#06b6d4" />
             <circle cx="30" cy="55" r="2" fill="#22c55e" />
             <circle cx="70" cy="55" r="2" fill="#a855f7" />
             <circle cx="50" cy="75" r="2.5" fill="#ffffff" />
          </g>
      </g>
    </svg>
  );
};
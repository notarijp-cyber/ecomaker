import React, { createContext, useContext, useState, ReactNode } from 'react';

type BotStats = {
  mined: number;
  complexity: number;
  lastAction: string;
};

type BotContextType = {
  status: string;
  setStatus: (s: string) => void;
  logs: string[];
  addLog: (l: string) => void;
  stats: BotStats;
  setStats: React.Dispatch<React.SetStateAction<BotStats>>;
  isBotActive: boolean;
  setIsBotActive: (b: boolean) => void;
  // Gamification
  xp: number;
  addXp: (amount: number) => void;
  credits: number;
  addCredits: (amount: number) => void;
};

const BotContext = createContext<BotContextType | undefined>(undefined);

export function BotProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState("In attesa...");
  const [logs, setLogs] = useState<string[]>([]);
  const [isBotActive, setIsBotActive] = useState(false);
  const [stats, setStats] = useState<BotStats>({ mined: 0, complexity: 0, lastAction: "-" });
  
  // Dati di gioco (Crediti e XP)
  const [xp, setXp] = useState(65);
  const [credits, setCredits] = useState(350);

  const addLog = (log: string) => {
    setLogs(prev => [log, ...prev].slice(0, 10)); 
  };

  const addXp = (amount: number) => setXp(prev => Math.min(100, prev + amount));
  const addCredits = (amount: number) => setCredits(prev => prev + amount);

  return (
    <BotContext.Provider value={{ 
      status, setStatus, 
      logs, addLog, 
      stats, setStats, 
      isBotActive, setIsBotActive,
      xp, addXp,
      credits, addCredits
    }}>
      {children}
    </BotContext.Provider>
  );
}

export const useBotContext = () => {
  const context = useContext(BotContext);
  if (!context) throw new Error("useBotContext must be used within BotProvider");
  return context;
};
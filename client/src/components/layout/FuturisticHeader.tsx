import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { 
  Menu, Home, Scan, FileText, Users, Download, Calendar,
  ShoppingBag, BarChart3, Lightbulb, Play, Zap, Brain,
  TrendingUp, Monitor, Atom, RotateCcw, Trophy, Sparkles,
  Activity, MapPin, User, LogOut, Settings, LayoutGrid, ChevronDown
} from "lucide-react";
import { Link, useLocation } from "wouter";

// FIREBASE IMPORTS
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

interface HeaderProps {
  onProfileClick?: () => void;
}

export function FuturisticHeader({ onProfileClick }: HeaderProps) {
  const [location, setLocation] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>({
    credits: 0,
    level: 1,
    username: "Maker"
  });

  // ASCOLTA I DATI REALI DAL DATABASE
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const unsubDb = onSnapshot(doc(db, "users", currentUser.uid), (docSnapshot) => {
          if (docSnapshot.exists()) {
            setUserData(docSnapshot.data());
          }
        });
        return () => unsubDb();
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setLocation("/"); // Torna alla Landing Page
  };

  return (
    <header className="glass-morph-dark border-b border-cyan-500/30 sticky top-0 z-50 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* 1. LOGO (Link forzato a /dashboard per evitare loop) */}
          <Link href="/dashboard" className="flex items-center space-x-3 cursor-pointer">
            <div className="rounded-lg cyber-button p-2 pulse-glow">
              <span className="text-lg font-bold text-white">🌱</span>
            </div>
            <span className="text-xl font-bold holographic-text">EcoMaker</span>
            <div className="text-xs bg-gradient-to-r from-cyan-400 to-purple-500 text-white px-2 py-1 rounded-full font-semibold hidden sm:block">
              QUANTUM
            </div>
          </Link>

          {/* 2. DESKTOP NAVIGATION */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8">
            <Link href="/dashboard" className={`text-sm font-medium transition-all duration-300 ${location === "/dashboard" ? "text-cyan-400 holographic-text" : "text-cyan-100 hover:text-cyan-300"}`}>
              Dashboard
            </Link>
            <Link href="/inventory" className={`text-sm font-medium transition-all duration-300 ${location === "/inventory" ? "text-cyan-400 holographic-text" : "text-cyan-100 hover:text-cyan-300"}`}>
              Inventario
            </Link>
            <Link href="/my-projects" className={`text-sm font-medium transition-all duration-300 ${location === "/my-projects" ? "text-cyan-400 holographic-text" : "text-cyan-100 hover:text-cyan-300"}`}>
              Progetti
            </Link>
            <Link href="/community" className={`text-sm font-medium transition-all duration-300 ${location === "/community" ? "text-cyan-400 holographic-text" : "text-cyan-100 hover:text-cyan-300"}`}>
              Community
            </Link>
          </nav>

          {/* 3. RIGHT SIDE (Menu Quantum, Crediti, Profilo) */}
          <div className="flex items-center space-x-4">
            
            {/* CREDITI REALI (Visibili se loggato) */}
            {user && (
              <div className="hidden md:flex items-center gap-2 bg-slate-900/80 border border-purple-500/30 px-3 py-1.5 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.15)] animate-in fade-in">
                <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-pulse" />
                <span className="font-mono font-bold text-white text-sm">{userData.credits}</span>
              </div>
            )}

            {/* Menu Quantum (Funzionalità Avanzate) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="cyber-button hidden md:flex" size="sm">
                  <Atom className="w-4 h-4 mr-2" />
                  Quantum
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 glass-morph-dark border-cyan-500/30 max-h-[80vh] overflow-y-auto text-cyan-100">
                 <DropdownMenuItem asChild><Link href="/advanced-features" className="cursor-pointer"><Lightbulb className="w-4 h-4 mr-2 text-yellow-400"/> Funzionalità Avanzate</Link></DropdownMenuItem>
                 <DropdownMenuItem asChild><Link href="/smart-recommendations" className="cursor-pointer"><Brain className="w-4 h-4 mr-2 text-purple-400"/> Raccomandazioni AI</Link></DropdownMenuItem>
                 <DropdownMenuItem asChild><Link href="/eco-gamification" className="cursor-pointer"><Trophy className="w-4 h-4 mr-2 text-yellow-400"/> Eco Gamification</Link></DropdownMenuItem>
                 <DropdownMenuItem asChild><Link href="/lab" className="cursor-pointer"><LayoutGrid className="w-4 h-4 mr-2 text-cyan-400"/> Quantum Lab (Beta)</Link></DropdownMenuItem>
                 <DropdownMenuSeparator className="bg-cyan-500/30" />
                 <DropdownMenuItem asChild><Link href="/kickstarter-downloads" className="cursor-pointer"><Download className="w-4 h-4 mr-2 text-green-400"/> Download Kickstarter</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* PROFILO UTENTE REALE (Dropdown con Logout) */}
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer pl-2 border-l border-cyan-500/30 hover:opacity-80 transition-opacity">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 p-[2px]">
                      <div className="h-full w-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                          {/* Iniziale del nome come Avatar */}
                          <div className="text-white font-bold text-sm">
                            {userData.username ? userData.username.charAt(0).toUpperCase() : "M"}
                          </div>
                      </div>
                    </div>
                    
                    <div className="hidden lg:block text-left">
                        <div className="text-xs font-bold text-white leading-none">{userData.username}</div>
                        <div className="text-[10px] text-cyan-400">Lv. {userData.level}</div>
                    </div>
                    <ChevronDown className="w-3 h-3 text-slate-400 hidden lg:block" />
                  </div>
               </DropdownMenuTrigger>
               
               <DropdownMenuContent align="end" className="w-56 glass-morph-dark border-cyan-500/30 text-cyan-100">
                  <DropdownMenuLabel>Il mio Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-cyan-500/30" />
                  
                  {/* LINK AGGIUNTO: IL MIO PROFILO */}
                  <Link href="/profile">
                    <DropdownMenuItem className="cursor-pointer hover:bg-cyan-500/20 hover:text-cyan-200">
                      <User className="w-4 h-4 mr-2" /> Il Mio Profilo
                    </DropdownMenuItem>
                  </Link>

                  <Link href="/settings">
                    <DropdownMenuItem className="cursor-pointer hover:bg-cyan-500/20 hover:text-cyan-200">
                      <Settings className="w-4 h-4 mr-2" /> Impostazioni
                    </DropdownMenuItem>
                  </Link>

                  <Link href="/inventory">
                    <DropdownMenuItem className="cursor-pointer hover:bg-cyan-500/20 hover:text-cyan-200">
                       <ShoppingBag className="w-4 h-4 mr-2" /> Inventario
                    </DropdownMenuItem>
                  </Link>
                  
                  <DropdownMenuSeparator className="bg-cyan-500/30" />
                  
                  <DropdownMenuItem onClick={handleLogout} className="text-red-400 cursor-pointer hover:bg-red-500/10 hover:text-red-300 focus:bg-red-500/10 focus:text-red-300">
                    <LogOut className="w-4 h-4 mr-2" /> Disconnetti
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>

            {/* Tasto Menu Mobile */}
            <Button variant="ghost" size="icon" className="md:hidden text-cyan-400" onClick={onProfileClick}>
               <Menu className="w-6 h-6" />
            </Button>

          </div>
        </div>
      </div>
    </header>
  );
}
import React, { useState } from "react";
import { useLocation } from "wouter";
import { Search, Bell, Menu, Sparkles, Plus, User, LogOut, Gavel, Store, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { QuantumHeartLogo } from './logo'; 
import { auth } from "@/lib/firebase"; 

export function Header() {
  const [location, setLocation] = useLocation();
  const isMobile = useIsMobile();
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false); // Metti true per testare il pallino

  const navigate = (path: string) => setLocation(path);
  const isActive = (path: string) => location === path;

  // FUNZIONE LOGOUT
  const handleLogout = async () => {
    try {
        await auth.signOut();
        window.location.href = '/auth'; 
    } catch (error) {
        console.error("Errore logout", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0f111a]/95 backdrop-blur-xl border-b border-cyan-900/30 shadow-2xl shadow-black/50">
      <div className="max-w-full mx-auto px-4 py-3 flex justify-between items-center relative">
        
        {/* LOGO PULSANTE - Interattivo */}
        <div 
            className="flex items-center space-x-3 cursor-pointer group select-none" 
            onClick={() => navigate('/')}
            onMouseEnter={() => setIsLogoHovered(true)}
            onMouseLeave={() => setIsLogoHovered(false)}
        >
          <div className={`relative p-1 transition-transform duration-500 ${isLogoHovered ? 'scale-110' : ''}`}>
             {/* Se Hover: Fermo e grande. Se No Hover: Battito cardiaco */}
             <div className={isLogoHovered ? '' : 'animate-heartbeat'}>
                <QuantumHeartLogo className="w-10 h-10 md:w-12 md:h-12 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
             </div>
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-xl md:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-green-400 tracking-tight leading-none filter drop-shadow-lg">
              EcoMaker
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-300 flex items-center mt-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
              Quantum Evolution <Sparkles className="w-2 h-2 ml-1 text-purple-400"/>
            </span>
          </div>
        </div>

        {/* NAVIGAZIONE DESKTOP */}
        {!isMobile && (
          <nav className="hidden xl:flex items-center space-x-1 bg-black/20 p-1 rounded-full border border-white/5">
            <Button variant="ghost" onClick={() => navigate('/')} className={`font-bold rounded-full ${isActive("/") ? "text-cyan-400 bg-cyan-950/40 border border-cyan-500/30" : "text-slate-400 hover:text-white"}`}>Dashboard</Button>
            <Button variant="ghost" onClick={() => navigate('/my-projects')} className={`font-bold rounded-full ${isActive("/my-projects") ? "text-cyan-400 bg-cyan-950/40 border border-cyan-500/30" : "text-slate-400 hover:text-white"}`}>Progetti</Button>
            <Button variant="ghost" onClick={() => navigate('/inventory')} className={`font-bold rounded-full ${isActive("/inventory") ? "text-cyan-400 bg-cyan-950/40 border border-cyan-500/30" : "text-slate-400 hover:text-white"}`}>Inventario</Button>
            
            <div className="h-6 w-px bg-slate-800 mx-2"></div>

            <Button variant="ghost" size="icon" onClick={() => navigate('/auction-house')} className="text-slate-400 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-full">
                <Gavel className="w-4 h-4"/>
            </Button>
             <Button variant="ghost" size="icon" onClick={() => navigate('/marketplace')} className="text-slate-400 hover:text-green-400 hover:bg-green-400/10 rounded-full">
                <Store className="w-4 h-4"/>
            </Button>
          </nav>
        )}

        <div className="flex items-center space-x-2 md:space-x-4">
          
          {/* NOTIFICHE */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-white hover:bg-white/5 rounded-full">
                    <Bell className="h-5 w-5" />
                    {hasNotifications && (
                        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border border-[#0f111a]"></span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-[#1a1d2d] border-slate-700 text-white z-50 shadow-2xl">
                <DropdownMenuLabel>Centro Notifiche</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-700"/>
                <div className="p-8 text-center text-slate-500 text-sm flex flex-col items-center">
                    <Bell className="w-8 h-8 mb-2 opacity-20"/>
                    Nessuna nuova notifica
                </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* MENU UTENTE */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Avatar className="w-9 h-9 cursor-pointer border-2 border-slate-700 hover:border-cyan-400 transition-colors">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback className="bg-slate-800 text-cyan-400 font-bold">TU</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#1a1d2d] border-slate-700 text-white z-50 shadow-2xl">
               <DropdownMenuLabel className="text-cyan-400">Il mio Account</DropdownMenuLabel>
               <DropdownMenuSeparator className="bg-slate-700"/>
               <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer hover:bg-slate-800">
                  <User className="w-4 h-4 mr-2 text-slate-400"/> Profilo
               </DropdownMenuItem>
               <DropdownMenuSeparator className="bg-slate-700"/>
               <DropdownMenuItem onClick={handleLogout} className="text-red-400 cursor-pointer hover:bg-red-900/20 font-bold">
                  <LogOut className="w-4 h-4 mr-2"/> Disconnetti
               </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

           {/* MOBILE MENU */}
           {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-300">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#0f111a] border-l border-slate-800 text-white w-[85vw]">
                  {/* Contenuto menu mobile */}
                  <div className="flex flex-col space-y-4 mt-6">
                      <Button variant="ghost" onClick={() => navigate('/')}>Dashboard</Button>
                      <Button variant="ghost" onClick={() => navigate('/inventory')}>Inventario</Button>
                      <Button variant="ghost" onClick={handleLogout} className="text-red-400">Esci</Button>
                  </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}
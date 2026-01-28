import React from 'react';
import { useLocation } from "wouter";
import { LayoutGrid, Box, Layers, Users, Calendar, BarChart3, Lightbulb, BookOpen, Settings, LogOut, X, Store, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';

export default function Sidebar({ mobileOpen, onClose, className = "" }: { mobileOpen: boolean, onClose: () => void, className?: string }) {
  const [location, setLocation] = useLocation();

  const handleNav = (path: string) => {
    setLocation(path);
    if (mobileOpen) onClose();
  };

  const MENU_ITEMS = [
    { label: "Panoramica", icon: Home, path: "/overview", highlight: true },
    { label: "Quantum Hub", icon: LayoutGrid, path: "/dashboard" },
    { label: "Market Exchange", icon: Store, path: "/market-hub" },
    { label: "Inventario", icon: Box, path: "/inventory" },
    { label: "I Miei Progetti", icon: Layers, path: "/my-projects" }, // LINK AL FILE APPENA FIXATO
    { label: "Community", icon: Users, path: "/community" },
    { label: "Eventi Globali", icon: Calendar, path: "/events" },
    { label: "Analytics", icon: BarChart3, path: "/analytics" },
    { label: "Innovazione", icon: Lightbulb, path: "/innovation" },
    { label: "Guide Riciclo", icon: BookOpen, path: "/recycle-guides" },
    { label: "Impostazioni", icon: Settings, path: "/settings" },
  ];

  return (
    <>
      {mobileOpen && <div className="fixed inset-0 bg-black/80 z-40 md:hidden" onClick={onClose}></div>}

      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#0a0a0c] border-r border-cyan-900/20 transform transition-transform duration-300 ease-in-out flex flex-col h-screen ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} ${className}`}>
        
        <div className="absolute top-4 right-4 md:hidden z-50">
           <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white" onClick={onClose}><X className="w-6 h-6"/></Button>
        </div>

        <div className="pt-24 md:pt-6"></div> 
        <div className="px-6 mb-2"><p className="text-[10px] font-black text-cyan-500/80 uppercase tracking-[0.2em]">Navigazione</p></div>

        <div className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar py-2">
            {MENU_ITEMS.map((item) => {
                const isActive = location === item.path;
                return (
                    <div key={item.path} className="relative group">
                        {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-cyan-400 rounded-r-full shadow-[0_0_10px_#22d3ee]"></div>}
                        <button onClick={() => handleNav(item.path)} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-cyan-900/30 to-blue-900/10 text-cyan-300 shadow-[inset_0_0_20px_rgba(8,145,178,0.1)] border border-cyan-500/10' : 'text-gray-400 hover:text-gray-100 hover:bg-white/5'}`}>
                            <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]' : 'text-slate-500 group-hover:scale-110'}`} />
                            <span className={isActive ? 'font-bold tracking-wide' : ''}>{item.label}</span>
                        </button>
                    </div>
                );
            })}
        </div>

        <div className="p-4 border-t border-cyan-900/20 bg-[#0a0a0c]/50 backdrop-blur-sm">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/10 rounded-xl transition-all" onClick={() => auth.signOut()}>
                <LogOut className="w-5 h-5" /> <span>Disconnetti</span>
            </button>
        </div>
      </aside>
    </>
  );
}
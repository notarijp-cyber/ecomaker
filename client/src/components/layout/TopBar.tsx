import React from 'react';
import { useLocation, Link } from "wouter";
import { Search, User, LogOut, Menu, ShieldAlert, Bell } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/use-user';

export default function TopBar({ onMobileMenuClick }: { onMobileMenuClick?: () => void }) {
  const [location] = useLocation();
  const { user } = useUser();
  const MASTER_EMAIL = "ecomakerteamtest@gmail.com";
  const isMaster = user?.email === MASTER_EMAIL;

  const getTitle = () => {
    if (location.includes('dashboard')) return 'Dashboard';
    if (location.includes('inventory')) return 'Inventario';
    if (location.includes('innovation')) return 'Innovation Lab';
    if (location.includes('analytics')) return 'Analytics';
    if (location.includes('community')) return 'Community';
    if (location.includes('admin')) return 'Admin Core';
    return 'EcoMaker Hub';
  };

  return (
    <header className="h-16 border-b border-gray-800 bg-[#0a0a0c]/95 backdrop-blur-md flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden text-gray-400" onClick={onMobileMenuClick}>
           <Menu className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          {getTitle()} <span className="text-cyan-500 hidden sm:inline-block">Quantum</span>
        </h1>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        
        {/* TASTO ADMIN (SOLO PER MASTER) */}
        {isMaster && (
            <Link href="/admin/console">
                <Button variant="destructive" size="sm" className="hidden sm:flex animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.6)] font-bold border border-red-400 gap-2">
                    <ShieldAlert className="w-4 h-4" /> ADMIN CORE
                </Button>
            </Link>
        )}

        <div className="relative hidden md:block">
           <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
           <input type="text" placeholder="Cerca..." className="bg-gray-900 border border-gray-800 rounded-full pl-9 pr-4 py-1.5 text-sm text-gray-300 w-48 focus:border-cyan-500 focus:outline-none transition-all" />
        </div>
        
        <div className="h-6 w-[1px] bg-gray-800 hidden sm:block"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
             <p className="text-sm font-bold text-white leading-none">{user?.email?.split('@')[0]}</p>
             <p className="text-[10px] text-green-400 uppercase tracking-wider font-mono mt-1">OPERATIVO</p>
          </div>
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full border border-gray-700 flex items-center justify-center shadow-lg">
             <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
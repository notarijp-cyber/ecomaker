import React, { ReactNode } from "react";
import { Footer } from "@/components/layout/footer";
import { TabNavigation } from "@/components/layout/tab-navigation";
import { FloatingActionButton } from "@/components/layout/floating-action-button";
import Sidebar from "@/components/layout/Sidebar"; 
import { useLocation } from "wouter";

interface PageLayoutProps {
  children: ReactNode;
  showTabs?: boolean;
  showFab?: boolean;
  containerClassName?: string;
}

export function PageLayout({ 
  children, 
  showTabs = true, 
  showFab = true,
  containerClassName = ""
}: PageLayoutProps) {
  const [location] = useLocation();

  // Nascondiamo i Tab su desktop (usiamo la Sidebar Quantum)
  // Li mostriamo solo su mobile se necessario
  const hideTabsOnPages = ['/', '/ai-assistant'];
  const shouldShowTabs = showTabs && !hideTabsOnPages.includes(location);
  
  return (
    // LAYOUT QUANTUM:
    // 1. Sfondo scuro (Slate-950) per dare profondità "spaziale"
    // 2. Testo chiaro di base
    // 3. h-screen + overflow-hidden per bloccare la pagina come una App/Gioco
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans selection:bg-purple-500 selection:text-white">
      
      {/* ZONA DI COMANDO (Sinistra - Solo Desktop) */}
      {/* Qui vive il tuo Avatar e i controlli principali */}
      <div className="hidden md:block flex-shrink-0 z-30 h-full border-r border-slate-800 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
        <Sidebar />
      </div>

      {/* ZONA CONTENUTO (Destra - Fluida) */}
      {/* Questa è la finestra sul mondo (Dashboard, Mappa, Progetti) */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        
        {/* Navigazione Mobile (Visibile solo su smartphone) */}
        <div className="md:hidden z-20 sticky top-0 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
           {shouldShowTabs && <TabNavigation />}
        </div>
        
        {/* Area di scorrimento principale */}
        <main className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar">
          {/* Aggiunto padding e max-width per centrare l'esperienza visiva */}
          <div className={`container mx-auto px-4 py-8 max-w-7xl ${containerClassName}`}>
            {children}
          </div>
          
          <div className="opacity-60 hover:opacity-100 transition-opacity">
            <Footer />
          </div>
        </main>
        
        {/* Pulsante Fluttuante (rimane in sovrimpressione per scansioni rapide) */}
        {showFab && <FloatingActionButton />}
      </div>
    </div>
  );
}
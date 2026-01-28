import { useState, useEffect } from "react";
import { Switch, Route, useLocation, Redirect } from "wouter";
import { onAuthStateChanged } from "firebase/auth"; 
import { auth } from "@/lib/firebase"; 
import { Atom } from "lucide-react"; 
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";

// CONTEXT
import { SocialProvider } from "@/context/social-context";
import { BotProvider } from "@/context/bot-context";
import { EcoBotManager } from "@/components/EcoBotManager"; 

// LAYOUT
import { Header } from "@/components/layout/header"; 
import Sidebar from "@/components/layout/Sidebar"; 

// PAGES
import AuthPage from "@/pages/login"; 
import VerifyEmailPage from "@/pages/verify-email";
import Overview from "@/pages/overview";    // NUOVA HOME
import Dashboard from "@/pages/dashboard";  // QUANTUM HUB
import MarketHub from "@/pages/market-hub"; // NUOVO MARKET HUB
import Inventory from "@/pages/inventory";
import Innovation from "@/pages/innovation"; 
import Analytics from "@/pages/analytics"; 
import FridayForQuantum from "@/pages/friday-for-quantum";
import AdminBotConsole from "@/pages/admin-console"; 
import Settings from "@/pages/settings"; 
import NotFound from "@/pages/not-found";
import GlobalEventsMap from "@/pages/events-map";
import Community from "@/pages/community";
import WalletPage from "@/pages/wallet";
import AuctionHouse from "@/pages/auction-house";
import Marketplace from "@/pages/marketplace";
import ProfilePage from "@/pages/profile";
import ProjectDetail from "@/pages/project-detail";
import RecycleGuides from "@/pages/recycle-guides";
import Events from "@/pages/events";
import MyProjects from "@/pages/my-projects";

function PrivateLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#0f111a] text-slate-100 overflow-hidden">
      <Header onMobileMenuClick={() => setMobileMenuOpen(true)} />
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-64px)]">
        <Sidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} className="hidden md:flex w-64 flex-col border-r border-slate-800 bg-[#0f111a]" />
        <main className="flex-1 overflow-y-auto custom-scrollbar relative flex flex-col p-4 md:p-6 bg-[#0f111a]">
          <div className="flex-1 max-w-7xl mx-auto w-full pb-20">{children}</div>
        </main>
      </div>
    </div>
  );
}

function AppRouter() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="flex h-screen w-screen bg-[#0a0a0c] items-center justify-center"><Atom className="w-16 h-16 text-cyan-400 animate-spin"/></div>;

  // GESTIONE LOGIN / LOGOUT
  if (!user) {
    if (location !== "/login") return <Redirect to="/login" />;
    return <Switch><Route path="/login" component={AuthPage} /></Switch>;
  }

  // REDIRECT AUTOMATICO DALLA ROOT
  if (location === "/" || location === "/login") return <Redirect to="/overview" />;

  return (
    <PrivateLayout>
      <Switch>
        {/* ROTTE PRINCIPALI */}
        <Route path="/overview" component={Overview} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/market-hub" component={MarketHub} />
        
        {/* ALTRE ROTTE */}
        <Route path="/inventory" component={Inventory} />
        <Route path="/marketplace" component={Marketplace} />
        <Route path="/wallet" component={WalletPage} />
        <Route path="/auction-house" component={AuctionHouse} />
        <Route path="/admin/console" component={AdminBotConsole} />
        <Route path="/innovation" component={Innovation} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/friday-for-quantum" component={FridayForQuantum} />
        <Route path="/community" component={Community} />
        <Route path="/events-map" component={GlobalEventsMap} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/my-projects" component={MyProjects} />
        <Route path="/events" component={Events} />
        <Route path="/recycle-guides" component={RecycleGuides} />
        <Route path="/project-detail/:id" component={ProjectDetail} />
        <Route path="/settings" component={Settings} />
        
        {/* CATCH ALL 404 -> Redirect to Overview */}
        <Route path="/:rest*">
           {() => <Redirect to="/overview" />}
        </Route>
      </Switch>
    </PrivateLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SocialProvider>
         <BotProvider>
            <EcoBotManager /> 
            <AppRouter />
         </BotProvider>
      </SocialProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
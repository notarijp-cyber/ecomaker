import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, Package, Recycle, Users, PlusCircle, Box } from "lucide-react";

export default function MobileNav() {
  const [location] = useLocation();
  
  const isActive = (path: string) => location === path;
  
  const navItems = [
    { path: "/", label: "Home", icon: <Home className="h-5 w-5" /> },
    { path: "/inventory", label: "Materiali", icon: <Package className="h-5 w-5" /> },
    { path: "/my-projects", label: "Progetti", icon: <Recycle className="h-5 w-5" /> },
    { path: "/thingiverse-models", label: "Modelli 3D", icon: <Box className="h-5 w-5" /> },
    { path: "/ai-assistant", label: "AI", icon: <PlusCircle className="h-5 w-5" /> },
  ];
  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg flex justify-around z-50">
      {navItems.map(item => (
        <div
          key={item.path}
          onClick={() => window.location.href = item.path}
          className={cn(
            "flex flex-col items-center py-2 px-2 cursor-pointer", 
            isActive(item.path)
              ? "text-primary"
              : "text-neutral-500 hover:text-primary"
          )}
        >
          <div className={cn(
            "p-1 rounded-full",
            isActive(item.path) 
              ? "bg-primary/10" 
              : "bg-transparent"
          )}>
            {item.icon}
          </div>
          <span className="text-xs mt-1 font-medium">{item.label}</span>
        </div>
      ))}
    </nav>
  );
}

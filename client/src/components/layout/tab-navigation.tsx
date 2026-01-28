import React from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, Package, Layers, Users, Calendar, Globe } from "lucide-react";

interface TabNavigationProps {
  className?: string;
}

export function TabNavigation({ className }: TabNavigationProps) {
  const [location] = useLocation();

  const tabs = [
    { name: "Dashboard", href: "/", icon: <Home className="h-5 w-5" /> },
    { name: "I Miei Progetti", href: "/my-projects", icon: <Layers className="h-5 w-5" /> },
    { name: "Inventario", href: "/inventory", icon: <Package className="h-5 w-5" /> },
    { name: "Community", href: "/community", icon: <Users className="h-5 w-5" /> },
    { name: "Eventi", href: "/events", icon: <Calendar className="h-5 w-5" /> },
    { name: "Impatto Ambientale", href: "/environmental-impact", icon: <Globe className="h-5 w-5" /> },
  ];

  return (
    <div className={cn("bg-white border-b sticky top-0 z-10 shadow-sm eco-pattern-bg", className)}>
      <div className="container mx-auto px-4">
        <nav className="flex space-x-4 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => (
            <Link 
              key={tab.href} 
              href={tab.href}
              className={cn(
                "py-3 px-4 rounded-md whitespace-nowrap flex items-center space-x-2 transition-all font-medium text-sm",
                location === tab.href
                  ? "bg-primary/10 text-primary border-primary border-b-2"
                  : "text-neutral-medium hover:text-neutral-dark hover:bg-neutral-50 border-transparent border-b-2"
              )}
            >
              <span className={cn(
                location === tab.href ? "text-primary" : "text-neutral-medium"
              )}>
                {tab.icon}
              </span>
              <span>{tab.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

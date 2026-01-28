import React from "react";
import { Home, MessageCircle, Plus, BookOpen, Recycle, Heart, Instagram, Facebook, Twitter, Leaf, Globe } from "lucide-react";
import { Link, useLocation } from "wouter";

export function Footer() {
  const [location] = useLocation();

  const mainLinks = [
    { name: "Home", href: "/", icon: <Home className="h-4 w-4" /> },
    { name: "Community", href: "/community", icon: <MessageCircle className="h-4 w-4" /> },
    { name: "Crea Progetto", href: "/create-project", icon: <Plus className="h-4 w-4" /> },
    { name: "I Miei Progetti", href: "/my-projects", icon: <BookOpen className="h-4 w-4" /> },
  ];

  const resourceLinks = [
    { name: "Guide al Riciclo", href: "/recycle-guides" },
    { name: "Blog Sostenibilità", href: "/sustainability-blog" },
    { name: "FAQ", href: "/faq" },
    { name: "Contattaci", href: "/contact" },
  ];

  const socialLinks = [
    { name: "Instagram", href: "#", icon: <Instagram className="h-4 w-4" /> },
    { name: "Facebook", href: "#", icon: <Facebook className="h-4 w-4" /> },
    { name: "Twitter", href: "#", icon: <Twitter className="h-4 w-4" /> },
  ];

  return (
    <footer className="relative bg-[#0f111a] border-t border-slate-800/50 pt-12 pb-6 mt-auto">
       {/* Background accent - Texture sottile per dare profondità */}
       <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          
          {/* Logo Section */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative bg-purple-500/10 p-2 rounded-xl border border-purple-500/20">
                <Recycle className="h-6 w-6 text-purple-400" />
                <span className="absolute -top-1 -right-1 bg-[#0f111a] rounded-full p-0.5 border border-purple-500/30">
                  <Leaf className="h-3 w-3 text-cyan-400" />
                </span>
              </div>
              <div>
                 <h2 className="text-xl font-bold text-white tracking-tight">EcoMaker</h2>
                 <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-900/20 px-1.5 py-0.5 rounded border border-cyan-500/20">Quantum</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-6 text-center md:text-left leading-relaxed">
              Trasforma i tuoi rifiuti in risorse preziose. Dai nuova vita ai materiali con l'ecosistema di gamification più avanzato.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((link, i) => (
                <a 
                  key={i}
                  href={link.href}
                  className="bg-slate-800/50 hover:bg-purple-600/20 hover:text-purple-400 p-2 rounded-lg text-slate-400 transition-all border border-slate-700 hover:border-purple-500/30"
                  aria-label={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
          
          {/* Main Links */}
          <div className="md:col-span-3">
            <h3 className="font-bold text-white mb-4 text-center md:text-left text-sm uppercase tracking-wider">
              Navigazione
            </h3>
            <ul className="space-y-2">
              {mainLinks.map((link, i) => (
                <li key={i}>
                  <Link href={link.href}>
                    <div className={`flex items-center space-x-2 text-sm py-1 cursor-pointer transition-colors ${location === link.href ? "text-purple-400 font-medium" : "text-slate-400 hover:text-purple-300"}`}>
                       {link.icon}
                       <span>{link.name}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Resources */}
          <div className="md:col-span-3">
            <h3 className="font-bold text-white mb-4 text-center md:text-left text-sm uppercase tracking-wider">
              Risorse
            </h3>
            <ul className="space-y-2">
              {resourceLinks.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="text-sm text-slate-400 hover:text-cyan-400 transition-colors block py-1">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contribute */}
          <div className="md:col-span-2">
            <h3 className="font-bold text-white mb-4 text-center md:text-left text-sm uppercase tracking-wider">
              Contribuisci
            </h3>
            <div className="flex flex-col space-y-3">
              <a href="/donate" className="flex items-center space-x-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors p-2 rounded-lg hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/20">
                <Heart className="h-4 w-4" />
                <span>Dona alla causa</span>
              </a>
              <a href="/events" className="flex items-center space-x-2 text-sm text-blue-400 hover:text-blue-300 transition-colors p-2 rounded-lg hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20">
                <Globe className="h-4 w-4" />
                <span>Eventi Globali</span>
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="pt-6 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-slate-500 text-xs font-medium">
            © Jacopo Primo Notari 2025 - All rights reserved.
          </div>
          <div className="flex space-x-6 text-xs text-slate-500">
            <a href="/privacy-policy" className="hover:text-purple-400 transition-colors">Privacy Policy</a>
            <a href="/terms-of-service" className="hover:text-purple-400 transition-colors">Termini</a>
            <a href="/cookie-policy" className="hover:text-purple-400 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
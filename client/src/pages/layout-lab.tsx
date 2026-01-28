import React from "react";
import { Link } from "wouter";
import { 
  Play, FlaskConical, Database, Layers, 
  Download 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LayoutLab() {
  return (
    <div className="min-h-full bg-[#0f111a] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* HEADER */}
        <div className="text-center space-y-4 py-8">
           <div className="inline-flex items-center justify-center p-4 bg-cyan-500/10 rounded-full border border-cyan-500/20 mb-4 animate-pulse">
              <FlaskConical className="w-10 h-10 text-cyan-400" />
           </div>
           <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
             Quantum <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Laboratory</span>
           </h1>
           <p className="text-slate-400 text-lg max-w-2xl mx-auto">
             Area sperimentale e archivio funzionalità beta.
           </p>
        </div>

        {/* KICKSTARTER DEMO */}
        <section className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5">
              <Play className="w-64 h-64 text-white" />
           </div>
           
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4">
                 <div className="flex items-center gap-2 text-green-400 font-mono text-sm uppercase tracking-widest">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                    Live Demo
                 </div>
                 <h2 className="text-3xl font-bold text-white">Kickstarter Integration Demo</h2>
                 <p className="text-slate-300 max-w-lg">
                    Testa il flusso di donazione simulato da €2.
                 </p>
              </div>

              <Link href="/kickstarter-demo">
                <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-8 py-6 rounded-xl">
                  <Play className="w-5 h-5 mr-3 fill-current" />
                  Lancia Demo €2
                </Button>
              </Link>
           </div>
        </section>

        {/* ALTRI ESPERIMENTI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {/* Card 1 */}
           <div className="bg-[#1a1d2d] rounded-2xl p-6 border border-slate-700/50 hover:border-cyan-500/50 transition-colors group">
              <div className="bg-cyan-900/20 p-3 rounded-lg w-fit mb-4">
                 <Database className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Database Materiali</h3>
              <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800 text-slate-300">Esplora Dati</Button>
           </div>

           {/* Card 2 */}
           <div className="bg-[#1a1d2d] rounded-2xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-colors group">
              <div className="bg-purple-900/20 p-3 rounded-lg w-fit mb-4">
                 <Layers className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">UI Kit & Assets</h3>
              <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800 text-slate-300">Vedi Libreria</Button>
           </div>

           {/* Card 3 */}
           <div className="bg-[#1a1d2d] rounded-2xl p-6 border border-slate-700/50 hover:border-yellow-500/50 transition-colors group">
              <div className="bg-yellow-900/20 p-3 rounded-lg w-fit mb-4">
                 <Download className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Area Download</h3>
              <Link href="/kickstarter-downloads">
                 <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800 text-slate-300">Vai ai Download</Button>
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
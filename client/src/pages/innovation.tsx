import React from 'react';
import { Beaker, Layers, ArrowRight, Globe } from 'lucide-react';

const materials = [
  {
    category: "Bioplastica",
    title: "Plastica dalle alghe marine",
    desc: "Nuovo polimero biodegradabile al 100% creato dagli scarti della lavorazione delle alghe. Sostituisce il PET.",
    date: "2 min fa",
    image: "bg-green-900"
  },
  {
    category: "Edilizia",
    title: "Cemento che assorbe CO2",
    desc: "Calcestruzzo infuso con biochar che cattura carbonio durante la fase di indurimento.",
    date: "1 ora fa",
    image: "bg-gray-700"
  },
  {
    category: "Energia",
    title: "Pannelli Solari Perovskite",
    desc: "Efficienza aumentata del 30% rispetto al silicio tradizionale. Costi di produzione dimezzati.",
    date: "4 ore fa",
    image: "bg-blue-900"
  }
];

const Innovation = () => {
  return (
    <div className="p-6 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Beaker className="text-cyan-400 w-8 h-8" />
            Innovation Lab
          </h1>
          <p className="text-gray-400">Database nuovi materiali e tecnologie green.</p>
        </div>
        <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Proponi Innovazione
        </button>
      </div>

      {/* Featured Section */}
      <div className="bg-gradient-to-r from-gray-900 to-indigo-900/40 border border-indigo-500/30 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 blur-[100px] rounded-full"></div>
        <div className="relative z-10 max-w-2xl">
          <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2 py-1 rounded border border-indigo-500/30 mb-4 inline-block">
            TRENDING NOW
          </span>
          <h2 className="text-3xl text-white font-bold mb-4">Grafene Riciclato</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            Scoperta una nuova tecnica per estrarre grafene da vecchi pneumatici. 
            Questa innovazione potrebbe rivoluzionare la produzione di batterie per auto elettriche, 
            aumentando la capacità del 400%.
          </p>
          <button className="flex items-center gap-2 text-white border-b border-indigo-400 pb-1 hover:text-indigo-400 transition-colors">
            Leggi lo studio completo <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Materials Grid & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {materials.map((mat, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 hover:border-cyan-500/50 rounded-xl p-5 transition-all hover:-translate-y-1 group cursor-pointer">
              <div className={`h-32 rounded-lg mb-4 ${mat.image} flex items-center justify-center relative overflow-hidden`}>
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                 <Layers className="text-white/20 w-12 h-12 relative z-10" />
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-cyan-500 uppercase tracking-wide">{mat.category}</span>
                <span className="text-xs text-gray-500">{mat.date}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{mat.title}</h3>
              <p className="text-sm text-gray-400 line-clamp-2">{mat.desc}</p>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-gray-900/80 border border-gray-800 p-6 rounded-xl">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-green-500" /> Impatto Globale
              </h3>
              <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Nuovi Brevetti</span>
                      <span className="text-white font-mono">1,240</span>
                  </div>
                  <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full w-[70%]"></div>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Innovation;
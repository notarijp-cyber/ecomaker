import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Lock, Eye, Server, FileText } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    // NOTA: Abbiamo rimosso PageLayout per evitare la doppia sidebar.
    // Usiamo lo sfondo scuro #0f111a per coerenza con la Dashboard.
    <div className="min-h-full w-full bg-[#0f111a] text-slate-300 font-sans selection:bg-purple-500 overflow-x-hidden">
      
      {/* HEADER con tasto indietro */}
      <div className="sticky top-0 z-10 bg-[#0f111a]/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/settings">
            <Button variant="ghost" className="text-slate-400 hover:text-white pl-0 hover:bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" /> Torna alle Impostazioni
            </Button>
          </Link>
          <span className="text-[10px] md:text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
            GDPR COMPLIANT
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-6 md:p-12 space-y-12">
        
        {/* TITOLO PRINCIPALE */}
        <div className="text-center space-y-4">
           <div className="inline-flex items-center justify-center p-3 bg-purple-500/10 rounded-full mb-4 ring-1 ring-purple-500/30">
              <Shield className="w-8 h-8 text-purple-400" />
           </div>
           <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
             Informativa sulla Privacy
           </h1>
           <p className="text-slate-400">
             Ultimo aggiornamento: <span className="text-white">21 Gennaio 2026</span>
           </p>
        </div>

        {/* CONTENUTO LEGALE */}
        <div className="space-y-8 bg-[#1a1d2d] p-6 md:p-8 rounded-3xl border border-slate-700/50 shadow-2xl">
          
          {/* 1. INTRODUZIONE */}
          <section className="space-y-3">
            <h2 className="flex items-center gap-3 text-xl font-bold text-white">
              <FileText className="w-5 h-5 text-indigo-400" /> 1. Introduzione
            </h2>
            <p className="leading-relaxed">
              Benvenuto su <strong>EcoMaker Quantum Hub</strong> ("Noi", "Piattaforma"). La tua privacy è fondamentale per noi. 
              Questa informativa descrive come raccogliamo, utilizziamo e proteggiamo i tuoi dati personali 
              in conformità con il Regolamento Generale sulla Protezione dei Dati (<strong>GDPR</strong> - Regolamento UE 2016/679).
            </p>
          </section>

          <div className="h-px bg-slate-700/50 my-6" />

          {/* 2. DATI RACCOLTI */}
          <section className="space-y-3">
            <h2 className="flex items-center gap-3 text-xl font-bold text-white">
              <Eye className="w-5 h-5 text-indigo-400" /> 2. Dati che raccogliamo
            </h2>
            <ul className="list-disc pl-5 space-y-2 marker:text-indigo-500">
              <li><strong>Dati di Account:</strong> Email, Nome Utente, Numero di Telefono (utilizzato esclusivamente per la verifica di sicurezza OTP).</li>
              <li><strong>Dati di Utilizzo:</strong> Scansioni effettuate, materiali riciclati, interazioni con il sistema di gamification.</li>
              <li><strong>Dati Tecnici:</strong> Indirizzo IP anonimizzato, tipo di dispositivo, log di sistema per la sicurezza.</li>
            </ul>
          </section>

          <div className="h-px bg-slate-700/50 my-6" />

          {/* 3. FINALITÀ */}
          <section className="space-y-3">
            <h2 className="flex items-center gap-3 text-xl font-bold text-white">
              <Server className="w-5 h-5 text-indigo-400" /> 3. Finalità del trattamento
            </h2>
            <p>Utilizziamo i tuoi dati per:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 text-sm flex items-center gap-2">
                <span className="text-emerald-400">✅</span> Fornire il servizio Quantum Hub
              </div>
              <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 text-sm flex items-center gap-2">
                <span className="text-emerald-400">✅</span> Verificare l'identità (OTP)
              </div>
              <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 text-sm flex items-center gap-2">
                <span className="text-emerald-400">✅</span> Gestire Crediti e Premi
              </div>
              <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 text-sm flex items-center gap-2">
                <span className="text-emerald-400">✅</span> Migliorare l'AI (Dati anonimi)
              </div>
            </div>
          </section>

          <div className="h-px bg-slate-700/50 my-6" />

          {/* 4. I TUOI DIRITTI */}
          <section className="space-y-3">
            <h2 className="flex items-center gap-3 text-xl font-bold text-white">
              <Lock className="w-5 h-5 text-indigo-400" /> 4. I tuoi diritti (GDPR)
            </h2>
            <p>Hai il diritto di:</p>
            <ul className="list-disc pl-5 space-y-2 marker:text-indigo-500">
              <li>Accedere ai tuoi dati personali e richiederne una copia.</li>
              <li>Chiedere la rettifica o la cancellazione completa dei dati ("Diritto all'oblio").</li>
              <li>Revocare il consenso al trattamento in qualsiasi momento tramite le impostazioni.</li>
            </ul>
            
            <div className="mt-6 bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl">
              <p className="text-sm text-indigo-200">
                Per esercitare questi diritti, scrivi al nostro Responsabile della Protezione Dati (DPO):<br/>
                <a href="mailto:privacy@ecomaker.app" className="text-white font-bold hover:underline">privacy@ecomaker.app</a>
              </p>
            </div>
          </section>

        </div>

        {/* FOOTER */}
        <div className="text-center text-xs text-slate-500 pb-8">
          © 2026 EcoMaker Inc. Tutti i diritti riservati.
        </div>

      </div>
    </div>
  );
}
import { Download, FileText, Presentation, DollarSign, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function KickstarterDownloads() {
  const downloadFile = (filename: string) => {
    window.open(`/api/kickstarter/download/${filename}`, '_blank');
  };

  const openPdfGenerator = () => {
    window.open('/api/kickstarter/download/generate_kickstarter_pdf.html', '_blank');
  };

  const files = [
    {
      id: 'campaign',
      title: 'Documento Principale Kickstarter',
      description: 'Documento completo di 50+ pagine con tutte le funzionalità, livelli di donazione, analisi costi e roadmap quinquennale.',
      filename: 'EcoMaker_Kickstarter_Campaign.md',
      size: '~100KB',
      format: 'Markdown',
      icon: FileText,
      color: 'bg-gradient-to-r from-green-500 to-emerald-600',
      features: [
        'Panoramica completa progetto',
        'Funzionalità AI e gamificazione',
        'Livelli donazione €25-€5.000+',
        'Analisi costi €59.250',
        'Roadmap quinquennale',
        'Impatto ambientale'
      ]
    },
    {
      id: 'pdf',
      title: 'Presentazione PDF Professionale',
      description: 'Documento HTML elegante pronto per conversione PDF con design professionale e layout ottimizzato.',
      filename: 'generate_kickstarter_pdf.html',
      size: '~50KB',
      format: 'HTML → PDF',
      icon: Presentation,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-600',
      features: [
        'Design professionale',
        'Layout ottimizzato stampa',
        'Branding EcoMaker',
        'Grafici e tabelle',
        'Conversione PDF facile',
        'Pronto per presentazioni'
      ]
    },
    {
      id: 'executive',
      title: 'Executive Summary Finanziario',
      description: 'Analisi finanziaria dettagliata con market analysis, proiezioni revenue, unit economics per investitori.',
      filename: 'EcoMaker_Executive_Summary.md',
      size: '~80KB',
      format: 'Markdown',
      icon: DollarSign,
      color: 'bg-gradient-to-r from-purple-500 to-violet-600',
      features: [
        'Market analysis €2.1T TAM',
        'Proiezioni €360K-€420M ARR',
        'Unit economics LTV/CAC 25:1',
        'Go-to-market strategy',
        'Risk assessment',
        'Exit strategy €500M-€2B'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-6">🌱</div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 mb-4">
            EcoMaker Kickstarter Files
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Scarica tutti i documenti professionali per la campagna Kickstarter. 
            Pacchetto completo con analisi finanziaria, prospetti di crescita e livelli di partecipazione.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="glass-morph border-cyber text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-green-400">€250K</div>
              <div className="text-sm text-slate-400">Obiettivo Kickstarter</div>
            </CardContent>
          </Card>
          <Card className="glass-morph border-cyber text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-400">€59K</div>
              <div className="text-sm text-slate-400">Costi Sviluppo Reali</div>
            </CardContent>
          </Card>
          <Card className="glass-morph border-cyber text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-purple-400">25:1</div>
              <div className="text-sm text-slate-400">LTV/CAC Ratio</div>
            </CardContent>
          </Card>
          <Card className="glass-morph border-cyber text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-cyan-400">€2B</div>
              <div className="text-sm text-slate-400">Exit Valuation Target</div>
            </CardContent>
          </Card>
        </div>

        {/* Download Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {files.map((file) => {
            const IconComponent = file.icon;
            return (
              <Card key={file.id} className="glass-morph border-cyber hover:border-neon-green transition-all duration-300 group">
                <CardHeader>
                  <div className={`w-16 h-16 rounded-xl ${file.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">{file.title}</CardTitle>
                  <CardDescription className="text-slate-400">
                    {file.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="border-cyan-500 text-cyan-400">
                      {file.format}
                    </Badge>
                    <span className="text-sm text-slate-400">{file.size}</span>
                  </div>
                  
                  <Separator className="bg-slate-700" />
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-slate-300">Contenuti Inclusi:</h4>
                    <ul className="space-y-1">
                      {file.features.map((feature, index) => (
                        <li key={index} className="text-xs text-slate-400 flex items-center">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="pt-4">
                    {file.id === 'pdf' ? (
                      <Button 
                        onClick={openPdfGenerator}
                        className="w-full cyber-button text-white"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Apri & Converti PDF
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => downloadFile(file.filename)}
                        className="w-full cyber-button text-white"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Scarica File
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Instructions */}
        <Card className="glass-morph border-cyber mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center">
              💡 Come Utilizzare i File
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-green-400">📋 Per Kickstarter</h3>
                <ul className="space-y-2 text-slate-300">
                  <li>• Copia il contenuto del documento principale</li>
                  <li>• Personalizza con i tuoi dati di contatto</li>
                  <li>• Carica su Kickstarter seguendo le guidelines</li>
                  <li>• Usa il PDF per presentazioni visual</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-blue-400">💼 Per Investitori</h3>
                <ul className="space-y-2 text-slate-300">
                  <li>• Condividi l'Executive Summary</li>
                  <li>• Evidenzia le proiezioni finanziarie</li>
                  <li>• Mostra l'analisi di mercato TAM/SAM</li>
                  <li>• Presenta le opportunità di exit</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Highlights */}
        <Card className="glass-morph border-cyber">
          <CardHeader>
            <CardTitle className="text-2xl text-white text-center">
              🎯 Highlights Campagna Kickstarter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-2">🤖</div>
                <h3 className="text-lg font-semibold text-green-400 mb-1">AI Proprietaria</h3>
                <p className="text-sm text-slate-400">94% precisione riconoscimento materiali</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🔐</div>
                <h3 className="text-lg font-semibold text-blue-400 mb-1">Database 150424</h3>
                <p className="text-sm text-slate-400">Crittografia militare AES-256</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🌍</div>
                <h3 className="text-lg font-semibold text-purple-400 mb-1">Impatto Globale</h3>
                <p className="text-sm text-slate-400">500T CO₂ risparmiate/anno</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">💰</div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-1">ROI Investimento</h3>
                <p className="text-sm text-slate-400">€420M ARR proiettati anno 5</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 text-slate-400">
          <p className="text-lg font-semibold mb-2">© 2025 Jacopo Primo Notari</p>
          <p>Tutti i documenti sono pronti per l'uso immediato nella campagna Kickstarter</p>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Database, 
  Activity, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Lock,
  Key,
  FileText,
  Cpu,
  HardDrive,
  Zap,
  Eye,
  EyeOff
} from 'lucide-react';

interface SystemStats {
  totalRecords: number;
  totalArchitecture: number;
  totalIP: number;
  databaseSize: number;
  created: string;
  lastModified: string;
  accessLogs: number;
  integrityVerified: boolean;
}

interface SecurityReport {
  protectionLevel: string;
  encryption: string;
  fingerprint: string;
  integrityHash: string;
  lastAccess: any;
  totalAccesses: number;
  securityScore: number;
}

export default function System150424Admin() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [security, setSecurity] = useState<SecurityReport | null>(null);
  const [integrity, setIntegrity] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showSensitiveData, setShowSensitiveData] = useState(false);

  useEffect(() => {
    loadSystemData();
  }, []);

  const loadSystemData = async () => {
    try {
      setLoading(true);
      
      // Carica statistiche
      const statsResponse = await fetch('/api/system/150424/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.data);
      }

      // Carica report sicurezza
      const securityResponse = await fetch('/api/system/150424/security');
      if (securityResponse.ok) {
        const securityData = await securityResponse.json();
        setSecurity(securityData.data);
      }

      // Verifica integrità
      const integrityResponse = await fetch('/api/system/150424/integrity');
      if (integrityResponse.ok) {
        const integrityData = await integrityResponse.json();
        setIntegrity(integrityData.data.integrityVerified);
      }
    } catch (error) {
      console.error('Errore caricamento dati sistema 150424:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('it-IT');
  };

  const getSecurityColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const toggleSensitiveData = () => {
    setShowSensitiveData(!showSensitiveData);
  };

  const maskSensitiveData = (data: string) => {
    if (showSensitiveData) return data;
    return data.substring(0, 8) + '••••••••' + data.substring(data.length - 8);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
              <p className="text-cyan-300">Accesso sistema crittografato 150424...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
              <Shield className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Sistema Crittografato 150424
              </h1>
              <p className="text-gray-400">Database sicuro per protezione proprietà intellettuale</p>
            </div>
          </div>
          
          {/* Status Indicators */}
          <div className="flex gap-4">
            <Badge variant={integrity ? "default" : "destructive"} className="flex items-center gap-2">
              {integrity ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              Integrità: {integrity ? 'VERIFICATA' : 'COMPROMESSA'}
            </Badge>
            {security && (
              <Badge variant="secondary" className={`flex items-center gap-2 ${getSecurityColor(security.securityScore)}`}>
                <Lock className="w-4 h-4" />
                Sicurezza: {security.securityScore}%
              </Badge>
            )}
            <Badge variant="outline" className="flex items-center gap-2 text-cyan-400 border-cyan-400/20">
              <Database className="w-4 h-4" />
              AES-256-CBC
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-cyan-500/20">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300"
            >
              Panoramica
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300"
            >
              Sicurezza
            </TabsTrigger>
            <TabsTrigger 
              value="architecture" 
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300"
            >
              Architettura
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats && (
                <>
                  <Card className="bg-slate-800/50 border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">
                        Record Storia
                      </CardTitle>
                      <FileText className="h-4 w-4 text-cyan-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-cyan-300">{stats.totalRecords}</div>
                      <p className="text-xs text-gray-400">
                        Versioni archiviate
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">
                        Architetture
                      </CardTitle>
                      <Cpu className="h-4 w-4 text-purple-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-300">{stats.totalArchitecture}</div>
                      <p className="text-xs text-gray-400">
                        Sistemi documentati
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">
                        Proprietà IP
                      </CardTitle>
                      <Shield className="h-4 w-4 text-green-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-300">{stats.totalIP}</div>
                      <p className="text-xs text-gray-400">
                        Brevetti protetti
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">
                        Dimensione DB
                      </CardTitle>
                      <HardDrive className="h-4 w-4 text-yellow-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-yellow-300">{formatBytes(stats.databaseSize)}</div>
                      <p className="text-xs text-gray-400">
                        Dati crittografati
                      </p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {stats && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="text-cyan-300 flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Timeline Database
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Creazione:</span>
                      <span className="text-cyan-300">{formatDate(stats.created)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Ultima modifica:</span>
                      <span className="text-cyan-300">{formatDate(stats.lastModified)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Log accessi:</span>
                      <span className="text-cyan-300">{stats.accessLogs}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="text-cyan-300 flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Stato Sistema
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Integrità:</span>
                      <Badge variant={integrity ? "default" : "destructive"}>
                        {integrity ? 'VERIFICATA' : 'COMPROMESSA'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Crittografia:</span>
                      <Badge variant="secondary" className="text-green-300">
                        AES-256-CBC
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Protezione:</span>
                      <Badge variant="outline" className="text-red-300 border-red-400/20">
                        MASSIMA
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            {security && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="text-cyan-300 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Report Sicurezza
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Stato dei protocolli di sicurezza attivi
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Score Sicurezza</span>
                        <span className={`font-bold ${getSecurityColor(security.securityScore)}`}>
                          {security.securityScore}%
                        </span>
                      </div>
                      <Progress 
                        value={security.securityScore} 
                        className="h-2 bg-slate-700"
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Livello Protezione:</span>
                      <Badge variant="destructive" className="bg-red-500/20 text-red-300">
                        {security.protectionLevel}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Algoritmo:</span>
                      <Badge variant="secondary" className="text-green-300">
                        {security.encryption}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Accessi totali:</span>
                      <span className="text-cyan-300">{security.totalAccesses}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="text-cyan-300 flex items-center gap-2">
                      <Key className="w-5 h-5" />
                      Fingerprint Sistema
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleSensitiveData}
                        className="ml-auto"
                      >
                        {showSensitiveData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Identificatori univoci di sicurezza
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400">Fingerprint:</label>
                      <div className="mt-1 p-2 bg-slate-900/50 rounded border border-cyan-500/20 font-mono text-xs text-cyan-300 break-all">
                        {maskSensitiveData(security.fingerprint)}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-400">Hash Integrità:</label>
                      <div className="mt-1 p-2 bg-slate-900/50 rounded border border-cyan-500/20 font-mono text-xs text-cyan-300 break-all">
                        {maskSensitiveData(security.integrityHash)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Architecture Tab */}
          <TabsContent value="architecture" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-cyan-300 flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Struttura Database
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Storia App:</span>
                    <span className="text-cyan-300">{stats?.totalRecords || 0} records</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Architetture:</span>
                    <span className="text-purple-300">{stats?.totalArchitecture || 0} sistemi</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Proprietà IP:</span>
                    <span className="text-green-300">{stats?.totalIP || 0} brevetti</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-cyan-300 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Prestazioni
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Dimensione:</span>
                    <span className="text-yellow-300">{formatBytes(stats?.databaseSize || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Compressione:</span>
                    <span className="text-green-300">Attiva</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Velocità:</span>
                    <span className="text-cyan-300">Ottimale</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-cyan-300 flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Protezione
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Crittografia:</span>
                    <span className="text-green-300">AES-256</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Autenticazione:</span>
                    <span className="text-green-300">Attiva</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Integrità:</span>
                    <span className={integrity ? "text-green-300" : "text-red-300"}>
                      {integrity ? "Verificata" : "Compromessa"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-slate-800/50 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-cyan-300 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Metriche di Sistema
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Analisi dell'utilizzo e delle prestazioni del database crittografato
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Shield className="w-16 h-16 text-cyan-400 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">
                    Dati Analytics Protetti
                  </h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    Le metriche dettagliate sono disponibili solo tramite accesso autorizzato 
                    con credenziali di sicurezza di livello massimo.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4 border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/10"
                    disabled
                  >
                    Richiedi Accesso Privilegiato
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Sistema Crittografato 150424 - Protezione Proprietà Intellettuale</p>
          <p>Ultimo accesso: {new Date().toLocaleString('it-IT')}</p>
        </div>
      </div>
    </div>
  );
}
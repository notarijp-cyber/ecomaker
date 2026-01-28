import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle, Mail, Lock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function EmailSetup() {
  const [formData, setFormData] = useState({
    user: "",
    password: "",
    service: "gmail"
  });
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const { toast } = useToast();

  const handleConfigure = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfiguring(true);

    try {
      const response = await apiRequest("POST", "/api/email/configure", formData);
      const result = await response.json();

      if (result.success) {
        setIsConfigured(true);
        toast({
          title: "Email Configurato",
          description: "Il servizio email è stato configurato con successo",
        });
      } else {
        toast({
          title: "Errore Configurazione",
          description: result.message || "Errore durante la configurazione",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Errore",
        description: "Errore durante la configurazione del servizio email",
        variant: "destructive",
      });
    } finally {
      setIsConfiguring(false);
    }
  };

  const handleTestEmail = async () => {
    if (!testEmail) {
      toast({
        title: "Email Richiesta",
        description: "Inserisci un indirizzo email per il test",
        variant: "destructive",
      });
      return;
    }

    setIsTesting(true);

    try {
      const response = await apiRequest("POST", "/api/email/test", { email: testEmail });
      const result = await response.json();

      if (result.success) {
        toast({
          title: "Email di Test Inviata",
          description: `Email inviata con successo a ${testEmail}. Codice test: ${result.testCode}`,
        });
      } else {
        toast({
          title: "Errore Invio Email",
          description: result.message || "Errore durante l'invio dell'email di test",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Errore",
        description: "Errore durante l'invio dell'email di test",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 to-blue-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🌱 EcoMaker Email Setup
          </h1>
          <p className="text-cyan-200 text-lg">
            Configura il servizio email per l'invio automatico dei codici di accesso
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Configurazione Email */}
          <Card className="glass-morph border-cyan-400/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-100">
                <Mail className="h-5 w-5" />
                Configurazione Email
              </CardTitle>
              <CardDescription className="text-cyan-200">
                Configura il servizio email usando Gmail
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleConfigure} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-cyan-200 mb-2">
                    Email Gmail
                  </label>
                  <Input
                    type="email"
                    value={formData.user}
                    onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                    placeholder="tuo.email@gmail.com"
                    className="bg-black/20 border-cyan-400/30 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-cyan-200 mb-2">
                    App Password Gmail
                  </label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Password app Gmail"
                    className="bg-black/20 border-cyan-400/30 text-white"
                    required
                  />
                  <p className="text-xs text-cyan-300 mt-1">
                    Usa una App Password generata nelle impostazioni Google
                  </p>
                </div>

                <Button 
                  type="submit" 
                  disabled={isConfiguring}
                  className="w-full bg-cyan-600 hover:bg-cyan-700"
                >
                  {isConfiguring ? "Configurando..." : "Configura Email"}
                </Button>

                {isConfigured && (
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    Servizio email configurato con successo
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Test Email */}
          <Card className="glass-morph border-cyan-400/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-100">
                <Mail className="h-5 w-5" />
                Test Email
              </CardTitle>
              <CardDescription className="text-cyan-200">
                Testa l'invio email con un messaggio di prova
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-cyan-200 mb-2">
                    Email di Test
                  </label>
                  <Input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="test@example.com"
                    className="bg-black/20 border-cyan-400/30 text-white"
                  />
                </div>

                <Button 
                  onClick={handleTestEmail}
                  disabled={!isConfigured || isTesting}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isTesting ? "Inviando..." : "Invia Email di Test"}
                </Button>

                {!isConfigured && (
                  <div className="flex items-center gap-2 text-yellow-400 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    Configura prima il servizio email
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Istruzioni */}
        <Card className="glass-morph border-cyan-400/30 mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyan-100">
              <Lock className="h-5 w-5" />
              Come Configurare Gmail App Password
            </CardTitle>
          </CardHeader>
          <CardContent className="text-cyan-200">
            <ol className="list-decimal list-inside space-y-2">
              <li>Vai su <a href="https://myaccount.google.com/security" target="_blank" className="text-cyan-400 underline">Google Account Security</a></li>
              <li>Abilita l'autenticazione a 2 fattori se non è già attiva</li>
              <li>Cerca "App passwords" nelle impostazioni</li>
              <li>Genera una nuova App Password per "Mail"</li>
              <li>Usa quella password nel campo sopra (non la tua password normale)</li>
              <li>Testa l'invio email per verificare che funzioni</li>
            </ol>
            
            <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-400/30 rounded">
              <p className="text-yellow-200 text-sm">
                <strong>Importante:</strong> Mai usare la tua password normale Gmail. 
                Usa sempre una App Password generata specificamente per questa applicazione.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Collegamenti */}
        <div className="text-center mt-8">
          <div className="space-x-4">
            <Button 
              onClick={() => window.location.href = "/kickstarter-demo"}
              className="bg-purple-600 hover:bg-purple-700"
            >
              🚀 Vai alla Demo Kickstarter
            </Button>
            <Button 
              onClick={() => window.location.href = "/"}
              variant="outline"
              className="border-cyan-400/30 text-cyan-200 hover:bg-cyan-900/20"
            >
              🏠 Torna alla Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
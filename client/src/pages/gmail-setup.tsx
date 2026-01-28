import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function GmailSetup() {
  const [gmailStatus, setGmailStatus] = useState<any>(null);
  const [authUrl, setAuthUrl] = useState<string>("");
  const [authCode, setAuthCode] = useState<string>("");
  const [tokens, setTokens] = useState<any>(null);
  const [testEmail, setTestEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Controlla status Gmail all'avvio
  useEffect(() => {
    checkGmailStatus();
  }, []);

  const checkGmailStatus = async () => {
    try {
      const response = await apiRequest("GET", "/api/gmail/status");
      const data = await response.json();
      setGmailStatus(data);
    } catch (error) {
      console.error("Errore controllo status Gmail:", error);
    }
  };

  const getAuthUrl = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest("GET", "/api/gmail/auth-url");
      const data = await response.json();
      
      if (data.success) {
        setAuthUrl(data.authUrl);
        toast({
          title: "URL Autorizzazione Generato",
          description: "Clicca sul link per autorizzare Gmail API",
        });
      }
    } catch (error) {
      console.error("Errore generazione URL auth:", error);
      toast({
        title: "Errore",
        description: "Impossibile generare URL di autorizzazione",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exchangeToken = async () => {
    if (!authCode) {
      toast({
        title: "Codice Richiesto",
        description: "Inserisci il codice di autorizzazione ricevuto da Google",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiRequest("POST", "/api/gmail/exchange-token", {
        authCode: authCode
      });
      const data = await response.json();
      
      if (data.success) {
        setTokens(data);
        await checkGmailStatus(); // Aggiorna status
        toast({
          title: "Gmail Configurato",
          description: "Gmail API è ora attivo e pronto per l'invio email",
        });
      } else {
        toast({
          title: "Errore Configurazione",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Errore scambio token:", error);
      toast({
        title: "Errore",
        description: "Impossibile configurare Gmail API",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testEmailSending = async () => {
    if (!testEmail) {
      toast({
        title: "Email Richiesta",
        description: "Inserisci un'email per il test di invio",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiRequest("POST", "/api/gmail/test-email", {
        email: testEmail
      });
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Email Test Inviata",
          description: `Email di test inviata a ${testEmail} con codice: ${data.testCode}`,
        });
      } else {
        toast({
          title: "Errore Test",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Errore test email:", error);
      toast({
        title: "Errore",
        description: "Impossibile inviare email di test",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            📧 Gmail API Setup
          </h1>
          <p className="text-xl text-slate-300">
            Configura l'integrazione Gmail per l'invio automatico dei codici di accesso demo
          </p>
        </div>

        {/* Status Card */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Gmail Status
              <Badge variant={gmailStatus?.isAuthenticated ? "default" : "secondary"}>
                {gmailStatus?.isAuthenticated ? "Attivo" : "Non Configurato"}
              </Badge>
            </CardTitle>
            <CardDescription>
              Stato attuale dell'integrazione Gmail API
            </CardDescription>
          </CardHeader>
          <CardContent>
            {gmailStatus && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-300">Autenticazione:</span>
                  <span className={gmailStatus.isAuthenticated ? "text-green-400" : "text-red-400"}>
                    {gmailStatus.isAuthenticated ? "✅ Configurata" : "❌ Non configurata"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Test Connessione:</span>
                  <span className={gmailStatus.connectionTest ? "text-green-400" : "text-red-400"}>
                    {gmailStatus.connectionTest ? "✅ Successo" : "❌ Fallito"}
                  </span>
                </div>
                <p className="text-sm text-slate-400">{gmailStatus.message}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={checkGmailStatus}
                  className="border-slate-600"
                >
                  Aggiorna Status
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {!gmailStatus?.isAuthenticated && (
          <>
            {/* Step 1: Get Authorization URL */}
            <Card className="bg-slate-800/50 border-slate-700 mb-6">
              <CardHeader>
                <CardTitle>Step 1: Autorizzazione Google</CardTitle>
                <CardDescription>
                  Genera URL per autorizzare l'accesso a Gmail API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={getAuthUrl}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? "Generazione..." : "Genera URL Autorizzazione"}
                </Button>
                
                {authUrl && (
                  <Alert>
                    <AlertDescription>
                      <strong>Autorizza Gmail API:</strong><br />
                      <a 
                        href={authUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline break-all"
                      >
                        {authUrl}
                      </a>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Step 2: Exchange Authorization Code */}
            <Card className="bg-slate-800/50 border-slate-700 mb-6">
              <CardHeader>
                <CardTitle>Step 2: Inserisci Codice Autorizzazione</CardTitle>
                <CardDescription>
                  Dopo aver autorizzato, copia il codice ricevuto da Google
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Codice Autorizzazione</label>
                  <Input
                    type="text"
                    placeholder="4/0AeaYSHA_..."
                    value={authCode}
                    onChange={(e) => setAuthCode(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                
                <Button 
                  onClick={exchangeToken}
                  disabled={isLoading || !authCode}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? "Configurazione..." : "Configura Gmail API"}
                </Button>

                {tokens && (
                  <Alert>
                    <AlertDescription>
                      <strong>✅ Gmail API Configurato!</strong><br />
                      Refresh Token ricevuto e salvato. Il sistema è ora pronto per l'invio automatico delle email.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Test Email Section */}
        {gmailStatus?.isAuthenticated && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-green-400">🎯 Test Invio Email</CardTitle>
              <CardDescription>
                Testa l'invio di email con codice di accesso demo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Email di Test</label>
                <Input
                  type="email"
                  placeholder="test@esempio.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              
              <Button 
                onClick={testEmailSending}
                disabled={isLoading || !testEmail}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? "Invio..." : "Invia Email di Test"}
              </Button>

              <Alert>
                <AlertDescription>
                  <strong>Info:</strong> L'email di test conterrà il codice "TEST1234" 
                  e utilizzerà lo stesso template delle email demo reali.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="bg-gradient-to-r from-green-800/30 to-blue-800/30 border-green-500/50 mt-6">
          <CardHeader>
            <CardTitle>📋 Istruzioni Setup</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-slate-300">
              <li>Clicca "Genera URL Autorizzazione" per ottenere il link di autorizzazione Google</li>
              <li>Visita il link e accedi con l'account Gmail da utilizzare per inviare le email</li>
              <li>Autorizza l'applicazione EcoMaker ad accedere a Gmail</li>
              <li>Copia il codice di autorizzazione restituito da Google</li>
              <li>Incolla il codice nel campo sopra e clicca "Configura Gmail API"</li>
              <li>Una volta configurato, testa l'invio con un'email di prova</li>
            </ol>
            
            <Alert className="mt-4">
              <AlertDescription>
                <strong>Nota:</strong> Questa configurazione è necessaria solo una volta. 
                Il refresh token verrà salvato e utilizzato automaticamente per tutti gli invii futuri.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
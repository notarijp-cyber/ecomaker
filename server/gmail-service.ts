/**
 * Servizio Gmail API per invio automatico email con codici di accesso
 * Integrazione completa con Google Cloud OAuth2
 */

import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

// Configurazione credenziali Gmail usando variabili d'ambiente
if (!process.env.GMAIL_CLIENT_ID || !process.env.GMAIL_CLIENT_SECRET) {
  throw new Error("GMAIL_CLIENT_ID e GMAIL_CLIENT_SECRET devono essere configurati nei Replit Secrets");
}

const GMAIL_CREDENTIALS = {
  client_id: process.env.GMAIL_CLIENT_ID,
  client_secret: process.env.GMAIL_CLIENT_SECRET,
  redirect_uri: "urn:ietf:wg:oauth:2.0:oob" // Out-of-band flow per semplicità
};

interface EmailData {
  to: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
}

interface AccessCodeEmailData {
  email: string;
  accessCode: string;
  paymentAmount: number;
  expirationDate: string;
}

/**
 * Classe per gestione Gmail API
 */
export class GmailService {
  private oauth2Client: any;
  private gmail: any;
  private isAuthenticated = false;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      GMAIL_CREDENTIALS.client_id,
      GMAIL_CREDENTIALS.client_secret,
      GMAIL_CREDENTIALS.redirect_uri
    );

    // Configura Gmail API
    this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
  }

  /**
   * Inizializza l'autenticazione con refresh token
   */
  async initialize(refreshToken?: string): Promise<boolean> {
    try {
      if (refreshToken) {
        this.oauth2Client.setCredentials({
          refresh_token: refreshToken
        });
        
        // Rinnova il token di accesso
        await this.oauth2Client.getAccessToken();
        this.isAuthenticated = true;
        console.log('Gmail Service autenticato con successo');
        return true;
      } else {
        console.log('Gmail Service: refresh token non fornito');
        return false;
      }
    } catch (error) {
      console.error('Errore autenticazione Gmail:', error);
      this.isAuthenticated = false;
      return false;
    }
  }

  /**
   * Genera URL per autorizzazione OAuth2
   */
  getAuthUrl(): string {
    console.log('🔍 DEBUG Gmail Credentials:', {
      client_id: GMAIL_CREDENTIALS.client_id ? `${GMAIL_CREDENTIALS.client_id.substring(0, 15)}...` : 'MISSING',
      client_secret: GMAIL_CREDENTIALS.client_secret ? 'SET' : 'MISSING',
      redirect_uri: GMAIL_CREDENTIALS.redirect_uri
    });

    const scopes = [
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/gmail.compose'
    ];

    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });

    console.log('🔗 Generated Auth URL:', authUrl);
    return authUrl;
  }

  /**
   * Scambia codice autorizzazione con token
   */
  async getTokenFromCode(authCode: string): Promise<any> {
    try {
      const { tokens } = await this.oauth2Client.getToken(authCode);
      this.oauth2Client.setCredentials(tokens);
      this.isAuthenticated = true;
      return tokens;
    } catch (error) {
      console.error('Errore ottenimento token:', error);
      throw error;
    }
  }

  /**
   * Invia email generica
   */
  async sendEmail(emailData: EmailData): Promise<boolean> {
    if (!this.isAuthenticated) {
      console.error('Gmail Service non autenticato');
      return false;
    }

    try {
      const emailLines = [
        `To: ${emailData.to}`,
        `Subject: ${emailData.subject}`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        '',
        emailData.htmlContent
      ];

      const email = emailLines.join('\r\n');
      const encodedEmail = Buffer.from(email).toString('base64url');

      const response = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedEmail
        }
      });

      console.log('Email inviata con successo:', response.data.id);
      return true;
    } catch (error) {
      console.error('Errore invio email:', error);
      return false;
    }
  }

  /**
   * Invia email con codice di accesso demo
   */
  async sendAccessCodeEmail(data: AccessCodeEmailData): Promise<boolean> {
    const htmlContent = this.generateAccessCodeEmailHTML(data);
    
    return await this.sendEmail({
      to: data.email,
      subject: '🔑 Il Tuo Codice di Accesso EcoMaker Demo',
      htmlContent: htmlContent
    });
  }

  /**
   * Genera HTML per email codice di accesso
   */
  private generateAccessCodeEmailHTML(data: AccessCodeEmailData): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Codice Accesso EcoMaker Demo</title>
        <style>
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                margin: 0; 
                padding: 20px; 
                background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                color: #fff;
            }
            .container { 
                max-width: 600px; 
                margin: 0 auto; 
                background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                border-radius: 16px; 
                overflow: hidden;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
            }
            .header { 
                background: linear-gradient(135deg, #059669 0%, #10b981 100%);
                padding: 30px; 
                text-align: center; 
            }
            .header h1 { 
                margin: 0; 
                font-size: 28px; 
                font-weight: bold;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            }
            .content { 
                padding: 40px 30px; 
            }
            .access-code { 
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                border-radius: 12px; 
                padding: 25px; 
                text-align: center; 
                margin: 25px 0;
                border: 2px solid #60a5fa;
            }
            .access-code h2 { 
                margin: 0 0 15px 0; 
                font-size: 18px; 
                color: #e0f2fe;
            }
            .code { 
                font-size: 32px; 
                font-weight: bold; 
                letter-spacing: 4px; 
                font-family: 'Courier New', monospace;
                background: rgba(255, 255, 255, 0.2);
                padding: 15px 25px;
                border-radius: 8px;
                display: inline-block;
                border: 2px dashed #e0f2fe;
            }
            .info-box { 
                background: rgba(34, 197, 94, 0.1);
                border: 1px solid #22c55e;
                border-radius: 8px; 
                padding: 20px; 
                margin: 20px 0;
            }
            .info-box h3 { 
                margin: 0 0 15px 0; 
                color: #22c55e; 
                font-size: 16px;
            }
            .info-box ul { 
                margin: 0; 
                padding-left: 20px; 
                color: #cbd5e1;
            }
            .info-box li { 
                margin: 8px 0; 
            }
            .button { 
                display: inline-block; 
                background: linear-gradient(135deg, #059669 0%, #10b981 100%);
                color: white; 
                padding: 15px 30px; 
                text-decoration: none; 
                border-radius: 8px; 
                font-weight: bold;
                text-align: center;
                margin: 20px 0;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                transition: all 0.3s ease;
            }
            .footer { 
                background: #0f172a;
                padding: 25px; 
                text-align: center; 
                color: #94a3b8;
                font-size: 14px;
            }
            .highlight { 
                color: #22c55e; 
                font-weight: bold; 
            }
            .warning { 
                background: rgba(245, 158, 11, 0.1);
                border: 1px solid #f59e0b;
                border-radius: 6px;
                padding: 15px;
                margin: 15px 0;
                color: #fbbf24;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🌱 EcoMaker Demo</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
                    Il futuro dell'upcycling sostenibile
                </p>
            </div>
            
            <div class="content">
                <h2 style="color: #22c55e; margin-top: 0;">Grazie per il tuo deposito!</h2>
                <p style="font-size: 16px; line-height: 1.6; color: #e2e8f0;">
                    Il tuo pagamento di <span class="highlight">€${data.paymentAmount}</span> è stato confermato con successo. 
                    Ecco il tuo codice di accesso personale per la demo EcoMaker:
                </p>
                
                <div class="access-code">
                    <h2>🔑 Il Tuo Codice di Accesso</h2>
                    <div class="code">${data.accessCode}</div>
                    <p style="margin: 15px 0 0 0; font-size: 14px; color: #e0f2fe;">
                        Inserisci questo codice nella pagina demo per accedere
                    </p>
                </div>
                
                <div class="info-box">
                    <h3>📋 Informazioni Importanti</h3>
                    <ul>
                        <li><strong>Validità:</strong> Il codice scade il ${data.expirationDate}</li>
                        <li><strong>Rimborso:</strong> Deposito 100% rimborsabile entro 30 giorni</li>
                        <li><strong>Accesso:</strong> Utilizza il codice una sola volta per attivare la demo</li>
                        <li><strong>Supporto:</strong> Contattaci per qualsiasi problema</li>
                    </ul>
                </div>
                
                <div class="warning">
                    <strong>⚠️ Attenzione:</strong> Conserva questo codice al sicuro. Non condividerlo con altri utenti.
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://ecomaker.replit.app/kickstarter-demo" class="button">
                        🚀 Accedi alla Demo Ora
                    </a>
                </div>
                
                <div class="info-box">
                    <h3>🎯 Cosa Puoi Fare nella Demo</h3>
                    <ul>
                        <li><strong>AI Scanner:</strong> Riconosci materiali con la fotocamera</li>
                        <li><strong>Project Generator:</strong> Genera progetti upcycling personalizzati</li>
                        <li><strong>Eco-Impact Tracker:</strong> Monitora il tuo impatto ambientale</li>
                        <li><strong>Tutorial Guidati:</strong> Impara ad usare tutte le funzionalità</li>
                    </ul>
                </div>
                
                <p style="font-size: 16px; line-height: 1.6; color: #e2e8f0; margin-top: 25px;">
                    <strong>Ti piace EcoMaker?</strong> Supporta il nostro progetto Kickstarter e aiutaci a 
                    rivoluzionare l'upcycling globale. Ogni contributo ci avvicina al lancio ufficiale!
                </p>
            </div>
            
            <div class="footer">
                <p><strong>EcoMaker Team</strong></p>
                <p>🌍 Trasformiamo i rifiuti in opportunità • 💚 Insieme per un futuro sostenibile</p>
                <p style="margin-top: 15px; font-size: 12px;">
                    Questa email è stata generata automaticamente dal sistema EcoMaker Demo.<br>
                    Per assistenza: <a href="mailto:support@ecomaker.app" style="color: #22c55e;">support@ecomaker.app</a>
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  /**
   * Verifica stato autenticazione
   */
  isReady(): boolean {
    return this.isAuthenticated;
  }

  /**
   * Test connessione Gmail
   */
  async testConnection(): Promise<boolean> {
    if (!this.isAuthenticated) {
      return false;
    }

    try {
      const response = await this.gmail.users.getProfile({
        userId: 'me'
      });
      console.log('Test Gmail connessione riuscito:', response.data.emailAddress);
      return true;
    } catch (error) {
      console.error('Test Gmail connessione fallito:', error);
      return false;
    }
  }
}

// Istanza globale del servizio Gmail
export const gmailService = new GmailService();

/**
 * Inizializza servizio Gmail con token di refresh
 */
export async function initializeGmailService(): Promise<boolean> {
  // Per ora usiamo un token mock - sarà sostituito con quello reale dopo l'autorizzazione
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
  
  if (refreshToken) {
    return await gmailService.initialize(refreshToken);
  } else {
    console.log('Gmail Service: configurazione token necessaria');
    return false;
  }
}

/**
 * Invia email con codice di accesso
 */
export async function sendAccessCodeEmail(
  email: string, 
  accessCode: string, 
  paymentAmount: number = 2
): Promise<boolean> {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 30);
  
  const emailData: AccessCodeEmailData = {
    email,
    accessCode,
    paymentAmount,
    expirationDate: expirationDate.toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  };

  return await gmailService.sendAccessCodeEmail(emailData);
}
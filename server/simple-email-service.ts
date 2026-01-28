/**
 * Sistema Email Semplice per EcoMaker Kickstarter Demo
 * Alternativa semplice e affidabile senza OAuth2 complesso
 */

import nodemailer from 'nodemailer';

interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface EmailConfig {
  service: 'gmail' | 'smtp';
  user: string;
  pass: string;
  from?: string;
}

class SimpleEmailService {
  private transporter: nodemailer.Transporter | null = null;
  private config: EmailConfig | null = null;
  private isConfigured = false;

  /**
   * Configura il servizio email
   */
  configure(config: EmailConfig): void {
    this.config = config;
    
    if (config.service === 'gmail') {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: config.user,
          pass: config.pass // App Password o OAuth2
        }
      });
    } else {
      this.transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: config.user,
          pass: config.pass
        }
      });
    }

    this.isConfigured = true;
    console.log('✅ Simple Email Service configurato con successo');
  }

  /**
   * Verifica se il servizio è configurato
   */
  isReady(): boolean {
    return this.isConfigured && this.transporter !== null;
  }

  /**
   * Testa la connessione email
   */
  async testConnection(): Promise<boolean> {
    if (!this.transporter) {
      console.error('❌ Email service non configurato');
      return false;
    }

    try {
      await this.transporter.verify();
      console.log('✅ Connessione email verificata con successo');
      return true;
    } catch (error) {
      console.error('❌ Errore verifica connessione email:', error);
      return false;
    }
  }

  /**
   * Invia email generica
   */
  async sendEmail(emailData: EmailData): Promise<boolean> {
    if (!this.isReady()) {
      console.error('❌ Email service non pronto');
      return false;
    }

    try {
      const mailOptions = {
        from: this.config?.from || this.config?.user,
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text || this.stripHtml(emailData.html)
      };

      const result = await this.transporter!.sendMail(mailOptions);
      console.log('✅ Email inviata con successo:', result.messageId);
      return true;
    } catch (error) {
      console.error('❌ Errore invio email:', error);
      return false;
    }
  }

  /**
   * Invia codice di accesso Kickstarter
   */
  async sendKickstarterAccessCode(email: string, accessCode: string): Promise<boolean> {
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0891b2, #06b6d4); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
          .code-box { background: #0891b2; color: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
          .code { font-size: 32px; font-weight: bold; letter-spacing: 4px; }
          .button { display: inline-block; background: #0891b2; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 14px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌱 EcoMaker Kickstarter Demo</h1>
            <p>Il tuo codice di accesso è pronto!</p>
          </div>
          <div class="content">
            <h2>Benvenuto nel futuro del ricicling!</h2>
            <p>Grazie per aver supportato la nostra campagna Kickstarter con il deposito di €2 rimborsabile.</p>
            
            <div class="code-box">
              <p>Il tuo codice di accesso:</p>
              <div class="code">${accessCode}</div>
            </div>
            
            <p><strong>Come usare il codice:</strong></p>
            <ol>
              <li>Vai su <a href="https://ecomaker.replit.app/kickstarter-demo">EcoMaker Kickstarter Demo</a></li>
              <li>Inserisci il codice sopra nel campo "Codice di Accesso"</li>
              <li>Esplora tutte le funzionalità avanzate della piattaforma</li>
              <li>Testa AI Scanner, Project Generator, e Eco-Impact Tracker</li>
            </ol>
            
            <div style="text-align: center;">
              <a href="https://ecomaker.replit.app/kickstarter-demo" class="button">
                🚀 Accedi alla Demo
              </a>
            </div>
            
            <p><strong>🔄 Garanzia di rimborso:</strong> Il tuo deposito di €2 verrà completamente rimborsato entro 30 giorni dalla fine della campagna Kickstarter.</p>
            
            <p><strong>💡 Supporta il progetto:</strong> Se ti piace la demo, considera di diventare un backer ufficiale della nostra campagna Kickstarter!</p>
          </div>
          <div class="footer">
            <p>EcoMaker Team | Trasformiamo il mondo, un rifiuto alla volta</p>
            <p>Per supporto: <a href="mailto:support@ecomaker.app">support@ecomaker.app</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: '🌱 EcoMaker: Il tuo codice di accesso Kickstarter Demo',
      html: htmlTemplate
    });
  }

  /**
   * Rimuove HTML da testo
   */
  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }

  /**
   * Genera codice di accesso casuale
   */
  generateAccessCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result.match(/.{1,4}/g)?.join('-') || result;
  }
}

// Istanza singleton
export const emailService = new SimpleEmailService();

// Configurazione automatica se le variabili sono disponibili
if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
  emailService.configure({
    service: 'gmail',
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
    from: `EcoMaker Team <${process.env.GMAIL_USER}>`
  });
}

export { EmailData, EmailConfig };
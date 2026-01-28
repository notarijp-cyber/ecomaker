/**
 * Sistema di accesso demo con codici casuali e invio email
 * Gestisce pagamenti Stripe, generazione codici e notifiche email
 */

import { randomBytes, createHash } from 'crypto';
import { emailService } from './simple-email-service';

// Interfacce per il sistema demo
export interface DemoPayment {
  id: string;
  email: string;
  paymentIntentId: string;
  accessCode: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'refunded';
  createdAt: Date;
  expiresAt: Date;
  usedAt?: Date;
}

export interface AccessCodeValidation {
  isValid: boolean;
  payment?: DemoPayment;
  message: string;
}

// Storage in-memory per i pagamenti demo (in produzione usare database)
const demoPayments = new Map<string, DemoPayment>();
const accessCodes = new Map<string, string>(); // code -> paymentId

/**
 * Genera codice di accesso casuale a 8 caratteri alfanumerici
 */
export function generateAccessCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const length = 8;
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  
  return result;
}

/**
 * Crea hash del codice per sicurezza
 */
function hashCode(code: string): string {
  return createHash('sha256').update(code).digest('hex');
}

/**
 * Crea nuovo pagamento demo con codice di accesso
 */
export function createDemoPayment(
  email: string, 
  paymentIntentId: string, 
  amount: number = 2
): DemoPayment {
  const id = randomBytes(16).toString('hex');
  const accessCode = generateAccessCode();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // Scade dopo 30 giorni
  
  const payment: DemoPayment = {
    id,
    email,
    paymentIntentId,
    accessCode,
    amount,
    currency: 'EUR',
    status: 'pending',
    createdAt: new Date(),
    expiresAt
  };
  
  demoPayments.set(id, payment);
  accessCodes.set(accessCode, id);
  
  return payment;
}

/**
 * Conferma pagamento e invia codice via email
 */
export async function confirmPaymentAndSendCode(paymentIntentId: string): Promise<{ success: boolean; accessCode?: string }> {
  // Trova il pagamento tramite payment intent ID
  const payment = Array.from(demoPayments.values())
    .find(p => p.paymentIntentId === paymentIntentId);
  
  if (!payment) {
    console.error('Pagamento non trovato:', paymentIntentId);
    return { success: false };
  }
  
  // Aggiorna stato
  payment.status = 'completed';
  demoPayments.set(payment.id, payment);
  
  // Restituisce il codice di accesso per l'invio email
  return { 
    success: true, 
    accessCode: payment.accessCode 
  };
}

/**
 * Invia email con codice di accesso usando Simple Email Service
 */
async function sendAccessCodeEmail(payment: DemoPayment): Promise<boolean> {
  if (!emailService.isReady()) {
    console.log('Email service non configurato, simulando invio email...');
    console.log(`[DEMO] Email inviata a ${payment.email} con codice: ${payment.accessCode}`);
    return true;
  }
  
  try {
    const success = await emailService.sendKickstarterAccessCode(
      payment.email,
      payment.accessCode
    );
    
    if (success) {
      console.log(`✅ Codice di accesso inviato a ${payment.email}`);
    } else {
      console.error(`❌ Errore invio email a ${payment.email}`);
    }
    
    return success;
  } catch (error) {
    console.error('Errore invio email:', error);
    return false;
  }
}

/**
 * Genera contenuto email per il codice di accesso (LEGACY - ora gestito da Simple Email Service)
 */
function generateAccessCodeEmailContent(payment: DemoPayment): {html: string, text: string} {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Codice Accesso EcoMaker Demo</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 8px; text-align: center; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 8px; margin: 20px 0; }
            .code-box { background: #e7f3ff; border: 2px solid #10b981; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
            .code { font-size: 24px; font-weight: bold; color: #059669; letter-spacing: 3px; }
            .footer { text-align: center; color: #666; font-size: 12px; }
            .button { display: inline-block; background: #10b981; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; margin: 10px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🌱 EcoMaker Demo</h1>
                <p>Benvenuto nella rivoluzione dell'upcycling sostenibile!</p>
            </div>
            
            <div class="content">
                <h2>Il tuo codice di accesso è pronto!</h2>
                <p>Grazie per aver effettuato il deposito di €${payment.amount} per accedere alla demo EcoMaker.</p>
                
                <div class="code-box">
                    <p>Il tuo codice di accesso demo è:</p>
                    <div class="code">${payment.accessCode}</div>
                </div>
                
                <p><strong>Importante:</strong></p>
                <ul>
                    <li>Questo codice è valido fino al ${payment.expiresAt.toLocaleDateString('it-IT')}</li>
                    <li>Il deposito di €${payment.amount} è completamente rimborsabile entro 30 giorni</li>
                    <li>Usa il codice per accedere a tutte le funzionalità demo dell'app</li>
                </ul>
                
                <div style="text-align: center;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5000'}/kickstarter-demo" class="button">
                        🚀 Accedi alla Demo
                    </a>
                </div>
            </div>
            
            <div class="footer">
                <p>EcoMaker - Trasformiamo i rifiuti in risorse</p>
                <p>Questo codice è personale e non deve essere condiviso</p>
            </div>
        </div>
    </body>
    </html>
  `;
  
  const text = `
    🌱 EcoMaker Demo - Il tuo codice di accesso
    
    Grazie per aver effettuato il deposito di €${payment.amount} per accedere alla demo EcoMaker.
    
    Il tuo codice di accesso demo è: ${payment.accessCode}
    
    Importante:
    - Questo codice è valido fino al ${payment.expiresAt.toLocaleDateString('it-IT')}
    - Il deposito di €${payment.amount} è completamente rimborsabile entro 30 giorni
    - Usa il codice per accedere a tutte le funzionalità demo dell'app
    
    Accedi alla demo: ${process.env.FRONTEND_URL || 'http://localhost:5000'}/kickstarter-demo
    
    EcoMaker - Trasformiamo i rifiuti in risorse
    Questo codice è personale e non deve essere condiviso
  `;
  
  return { html, text };
}

/**
 * Valida codice di accesso
 */
export function validateAccessCode(code: string): AccessCodeValidation {
  const paymentId = accessCodes.get(code.toUpperCase());
  
  if (!paymentId) {
    return {
      isValid: false,
      message: 'Codice di accesso non valido'
    };
  }
  
  const payment = demoPayments.get(paymentId);
  
  if (!payment) {
    return {
      isValid: false,
      message: 'Pagamento non trovato'
    };
  }
  
  if (payment.status !== 'completed') {
    return {
      isValid: false,
      message: 'Pagamento non completato'
    };
  }
  
  if (new Date() > payment.expiresAt) {
    return {
      isValid: false,
      message: 'Codice di accesso scaduto'
    };
  }
  
  return {
    isValid: true,
    payment,
    message: 'Codice valido'
  };
}

/**
 * Marca codice come utilizzato
 */
export function markCodeAsUsed(code: string): boolean {
  const validation = validateAccessCode(code);
  
  if (!validation.isValid || !validation.payment) {
    return false;
  }
  
  validation.payment.usedAt = new Date();
  demoPayments.set(validation.payment.id, validation.payment);
  
  return true;
}

/**
 * Ottiene statistiche dei pagamenti demo
 */
export function getDemoPaymentStats(): any {
  const payments = Array.from(demoPayments.values());
  
  return {
    total: payments.length,
    completed: payments.filter(p => p.status === 'completed').length,
    pending: payments.filter(p => p.status === 'pending').length,
    refunded: payments.filter(p => p.status === 'refunded').length,
    used: payments.filter(p => p.usedAt).length,
    totalRevenue: payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0)
  };
}

/**
 * Gestisce rimborso del deposito
 */
export async function processRefund(paymentIntentId: string): Promise<boolean> {
  const payment = Array.from(demoPayments.values())
    .find(p => p.paymentIntentId === paymentIntentId);
  
  if (!payment) {
    return false;
  }
  
  // In produzione: effettuare rimborso tramite Stripe
  payment.status = 'refunded';
  demoPayments.set(payment.id, payment);
  
  // Rimuovi codice di accesso
  accessCodes.delete(payment.accessCode);
  
  return true;
}

export { demoPayments, accessCodes };
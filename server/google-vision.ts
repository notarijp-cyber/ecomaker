import vision from '@google-cloud/vision';
import { MaterialAnalysisResult } from './openai';
import { MaterialPhysicalProperties, ExtendedMaterialData, getExtendedMaterialData } from './materials-project';

// Configurazione per Google Vision API
// Utilizziamo sia API Key che Client ID per una configurazione completa
const GOOGLE_VISION_API_KEY = process.env.GOOGLE_VISION_API_KEY as string;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_OAUTH_CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET;

// Configurazione di autenticazione per Google API
let authConfig;
try {
  authConfig = {
    apiKey: GOOGLE_VISION_API_KEY,
    // Utilizziamo il client ID quando disponibile
    clientOptions: GOOGLE_CLIENT_ID ? {
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_OAUTH_CLIENT_SECRET
    } : undefined
  };
  
  if (!GOOGLE_VISION_API_KEY) {
    console.warn('GOOGLE_VISION_API_KEY non impostata. Alcune funzionalità di analisi immagine potrebbero non funzionare correttamente.');
  }
  
  console.log('Google Vision API configurata con successo');
} catch (error: any) {
  console.error('Errore nella configurazione di Google Vision API:', error.message);
  throw new Error(`Errore di configurazione Google Vision: ${error.message}`);
}

// Crea un client per l'API Google Vision con configurazione avanzata
const visionClient = new vision.ImageAnnotatorClient({ 
  apiKey: authConfig.apiKey,
  ...(authConfig.clientOptions || {})
});

// Mappatura di etichette comuni in tipi di materiali
const materialTypeMapping: Record<string, string> = {
  'plastic': 'Plastica',
  'wood': 'Legno',
  'metal': 'Metallo',
  'glass': 'Vetro',
  'paper': 'Carta',
  'cardboard': 'Cartone',
  'textile': 'Tessuto',
  'fabric': 'Tessuto',
  'ceramic': 'Ceramica',
  'rubber': 'Gomma',
  'aluminum': 'Alluminio',
  'steel': 'Acciaio',
  'iron': 'Ferro',
  'copper': 'Rame',
  'brass': 'Ottone',
  'tin': 'Stagno',
  'stone': 'Pietra',
  'concrete': 'Cemento',
  'bottle': 'Vetro',
  'can': 'Alluminio',
  'newspaper': 'Carta',
  'magazine': 'Carta',
  'cardboard box': 'Cartone',
  'plastic bottle': 'Plastica',
  'polyethylene': 'Plastica',
  'polypropylene': 'Plastica',
  'polystyrene': 'Plastica',
  'pvc': 'Plastica',
  'pet': 'Plastica',
  'hdpe': 'Plastica',
  'ldpe': 'Plastica',
  'pp': 'Plastica'
};

// Database di idee di riutilizzo per tipo di materiale
const reuseIdeasByMaterial: Record<string, string[]> = {
  'Plastica': [
    'Creare vasi per piante',
    'Realizzare contenitori per organizzare piccoli oggetti',
    'Costruire giocattoli fai-da-te',
    'Creare mangiatoie per uccelli',
    'Trasformare in complementi d\'arredo'
  ],
  'Legno': [
    'Costruire mensole decorative',
    'Creare cornici per fotografie',
    'Realizzare taglieri da cucina',
    'Costruire giocattoli in legno',
    'Creare supporti per piante'
  ],
  'Metallo': [
    'Creare sculture decorative',
    'Realizzare portacandele originali',
    'Costruire supporti per piante',
    'Creare ganci e appendini',
    'Realizzare accessori per la casa'
  ],
  'Vetro': [
    'Creare vasi e contenitori decorativi',
    'Realizzare terrari per piante',
    'Costruire lampade e portacandele',
    'Creare decorazioni per il giardino',
    'Realizzare mosaici artistici'
  ],
  'Carta': [
    'Creare carta riciclata fatta a mano',
    'Realizzare decorazioni origami',
    'Costruire album fotografici personalizzati',
    'Creare biglietti d\'auguri fatti a mano',
    'Realizzare cestini e contenitori intrecciati'
  ],
  'Cartone': [
    'Creare mobili per bambini',
    'Realizzare organizzatori per la scrivania',
    'Costruire giocattoli e case per animali',
    'Creare decorazioni da parete',
    'Realizzare contenitori per la raccolta differenziata'
  ],
  'Tessuto': [
    'Creare borse e accessori',
    'Realizzare coperte patchwork',
    'Costruire pupazzi e giocattoli morbidi',
    'Creare decorazioni per la casa',
    'Realizzare tappeti intrecciati'
  ]
};

// Database di consigli per il riciclo per tipo di materiale
const recyclingTipsByMaterial: Record<string, string[]> = {
  'Plastica': [
    'Sciacquare i contenitori prima di riciclarli',
    'Separare tappi e coperchi quando possibile',
    'Controllare il codice di riciclo sulla base (1-7)',
    'Comprimere le bottiglie per risparmiare spazio',
    'Non riciclare sacchetti di plastica nei normali bidoni'
  ],
  'Legno': [
    'Rimuovere chiodi, viti e parti metalliche',
    'Separare il legno trattato da quello non trattato',
    'Il legno verniciato richiede un trattamento speciale',
    'Controllare con il centro di riciclo locale per legno trattato',
    'Il legno pulito può essere compostato se tritato finemente'
  ],
  'Metallo': [
    'Sciacquare i contenitori per rimuovere residui',
    'Separare diversi tipi di metalli quando possibile',
    'Schiacciare le lattine per risparmiare spazio',
    'Controllare se il centro locale accetta metalli misti',
    'Piccoli oggetti in metallo possono essere raccolti in un contenitore'
  ],
  'Vetro': [
    'Separare il vetro per colore quando richiesto',
    'Rimuovere tappi e coperchi',
    'Non includere ceramica, cristalli o pyrex nel riciclo del vetro',
    'Sciacquare i contenitori prima del riciclo',
    'Il vetro può essere riciclato infinite volte senza perdere qualità'
  ],
  'Carta': [
    'Tenere la carta asciutta e pulita',
    'Rimuovere nastri, graffette e parti non cartacee',
    'Separare carta patinata da carta normale quando possibile',
    'Carta sporca di cibo non è riciclabile',
    'Triturare documenti sensibili prima del riciclo'
  ],
  'Cartone': [
    'Appiattire le scatole per risparmiare spazio',
    'Rimuovere nastro adesivo e graffette',
    'Tenere asciutto prima del riciclo',
    'Cartone sporco di cibo non è riciclabile',
    'Piegare e impilare per facilitare la raccolta'
  ],
  'Tessuto': [
    'Donare vestiti in buone condizioni',
    'Tessuti danneggiati possono essere riutilizzati come stracci',
    'Alcuni centri di riciclo accettano tessuti di qualsiasi condizione',
    'Separare accessori come bottoni e cerniere quando possibile',
    'Informarsi sui programmi di raccolta tessili nella propria area'
  ]
};

/**
 * Analizza un'immagine per riconoscere materiali usando Google Vision API
 * @param imageBase64 - Immagine codificata in base64
 */
export async function analyzeImageWithGoogleVision(imageBase64: string): Promise<{
  labels: string[],
  objects: string[],
  description: string
}> {
  try {
    // Assicurati che l'immagine sia nel formato corretto rimuovendo l'header se presente
    const base64Data = imageBase64.includes(',') 
      ? imageBase64.split(',')[1] 
      : imageBase64;
    
    // Esegui il riconoscimento delle etichette
    let labelResults;
    try {
      [labelResults] = await visionClient.labelDetection({
        image: { content: base64Data }
      });
      console.log('Google Vision API label detection completed successfully');
    } catch (error: any) {
      console.error('Label detection error:', error.message);
      throw new Error(`Google Vision API error: ${error.message}. Check your API key and credentials.`);
    }
    
    // Esegui il riconoscimento degli oggetti
    let objectResults;
    try {
      [objectResults] = await visionClient.objectLocalization({
        image: { content: base64Data }
      });
    } catch (error: any) {
      console.log('Object localization not available:', error.message);
      objectResults = { localizedObjectAnnotations: [] };
    }
    
    // Ottieni una descrizione generale dell'immagine
    let textResults;
    try {
      [textResults] = await visionClient.textDetection({
        image: { content: base64Data }
      });
    } catch (error: any) {
      console.log('Text detection not available:', error.message);
      textResults = { fullTextAnnotation: { text: '' } };
    }
    
    // Estrai le etichette rilevanti
    const labels = (labelResults?.labelAnnotations || []).map(label => (label?.description || '').toLowerCase()).filter(Boolean);
    
    // Estrai gli oggetti rilevati
    const objects = (objectResults?.localizedObjectAnnotations || []).map(obj => (obj?.name || '').toLowerCase()).filter(Boolean);
    
    // Estrai il testo rilevato
    const description = textResults?.fullTextAnnotation?.text || '';
    
    return {
      labels,
      objects,
      description
    };
  } catch (error: any) {
    console.error('Error analyzing image with Google Vision:', error);
    throw new Error(`Google Vision API error: ${error.message}. Check your API key and credentials.`);
  }
}

/**
 * Genera un risultato di analisi dei materiali integrando Google Vision con regole predefinite
 * @param imageBase64 - Immagine codificata in base64
 */
export async function analyzeMaterialWithGoogleVision(imageBase64: string): Promise<MaterialAnalysisResult> {
  try {
    // Analizza l'immagine con Google Vision
    const visionAnalysis = await analyzeImageWithGoogleVision(imageBase64);
    
    // Combina oggetti e etichette per ottenere più possibilità di match
    const allLabels = [...visionAnalysis.labels, ...visionAnalysis.objects];
    
    // Individua il materiale basandoci sui label e oggetti riconosciuti
    let materialType = 'Materiale generico';
    let materialName = '';
    let highestConfidence = 0;
    
    // Cerca corrispondenze nelle etichette per identificare il tipo di materiale
    for (const label of allLabels) {
      for (const [keyword, type] of Object.entries(materialTypeMapping)) {
        if (label.includes(keyword)) {
          // Usa la prima corrispondenza come nome se non ne abbiamo ancora uno
          if (!materialName) {
            materialName = label;
          }
          
          materialType = type;
          break;
        }
      }
    }
    
    // Se non abbiamo trovato un nome specifico, usa l'oggetto più probabile
    if (!materialName && visionAnalysis.objects.length > 0) {
      materialName = visionAnalysis.objects[0];
    } else if (!materialName && visionAnalysis.labels.length > 0) {
      materialName = visionAnalysis.labels[0];
    }
    
    // Formatta il nome del materiale (prima lettera maiuscola)
    materialName = materialName.charAt(0).toUpperCase() + materialName.slice(1);
    
    // Ottieni idee di riutilizzo specifiche per questo tipo di materiale
    const possibleUses = reuseIdeasByMaterial[materialType] || [
      'Riutilizzare come contenitore',
      'Trasformare in decorazione',
      'Incorporare in progetti artistici',
      'Utilizzare per progetti DIY',
      'Ripensare come elemento funzionale'
    ];
    
    // Ottieni consigli per il riciclo specifici per questo tipo di materiale
    const recyclingTips = recyclingTipsByMaterial[materialType] || [
      'Verificare le linee guida locali per il riciclo',
      'Pulire il materiale prima del riciclo',
      'Separare i diversi componenti se presenti',
      'Controllare se esistono programmi di raccolta specifici',
      'Considerare opzioni di upcycling prima del riciclo'
    ];
    
    // Creiamo un oggetto risultato base
    const analysisResult: MaterialAnalysisResult = {
      name: materialName,
      type: materialType,
      possibleUses,
      recyclingTips
    };
    
    // Arricchisci con i dati scientifici da Materials Project API
    try {
      // Estrai il tipo di materiale di base (prima parola del tipo)
      const baseMaterialType = materialType.split(' ')[0].toLowerCase();
      
      // Estrai il nome specifico del materiale (se disponibile)
      let specificName = '';
      
      // Cerca sigle o nomi specifici di materiali nel nome completo
      const nameParts = materialName.split(' ');
      for (let part of nameParts) {
        // Cerchiamo parti che potrebbero essere sigle (tutte maiuscole)
        if (part.length >= 2 && part === part.toUpperCase()) {
          specificName = part;
          break;
        }
      }
      
      console.log(`Tentativo di arricchimento con dati scientifici per: ${baseMaterialType} - ${specificName}`);
      
      // Ottieni i dati estesi del materiale
      const scientificData = await getExtendedMaterialData(baseMaterialType, specificName);
      
      if (scientificData) {
        console.log("Dati scientifici ottenuti con successo (Google Vision)", {
          tipo: scientificData.type,
          proprietà: Object.keys(scientificData.properties).length
        });
        
        // Arricchisci l'analisi con i dati scientifici
        analysisResult.physicalProperties = scientificData.properties;
        analysisResult.sustainabilityScore = scientificData.sustainabilityScore;
        analysisResult.environmentalImpact = scientificData.environmentalImpact;
        analysisResult.decompositionTime = scientificData.decompositionTime;
        
        // Aggiungi possibili usi se ne abbiamo di nuovi
        if (scientificData.commonUses && scientificData.commonUses.length > 0) {
          // Unisci gli usi esistenti con quelli nuovi e rimuovi i duplicati
          const allUses = [...analysisResult.possibleUses, ...scientificData.commonUses];
          analysisResult.possibleUses = [...new Set(allUses)];
        }
        
        // Aggiungi consigli di riciclo se ne abbiamo di nuovi
        if (scientificData.recyclingTips && scientificData.recyclingTips.length > 0) {
          // Unisci i consigli esistenti con quelli nuovi e rimuovi i duplicati
          const allTips = [...analysisResult.recyclingTips, ...scientificData.recyclingTips];
          analysisResult.recyclingTips = [...new Set(allTips)];
        }
      }
    } catch (error) {
      console.warn("Non è stato possibile arricchire l'analisi di Google Vision con dati scientifici:", error.message);
      // Continua comunque con l'analisi base
    }
    
    return analysisResult;
  } catch (error) {
    console.error('Error generating material analysis with Google Vision:', error);
    
    // Restituisci un risultato generico in caso di errore
    return {
      name: 'Materiale non identificato',
      type: 'Tipo sconosciuto',
      possibleUses: ['Prova a scattare un\'immagine più chiara'],
      recyclingTips: ['Assicurati che il materiale sia ben illuminato e visibile']
    };
  }
}
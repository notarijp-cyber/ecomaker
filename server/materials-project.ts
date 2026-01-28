import axios from 'axios';

// L'API key dovrebbe essere fornita tramite variabili d'ambiente
const MP_API_KEY = process.env.MATERIALS_PROJECT_API_KEY;
const API_BASE_URL = 'https://next-gen.materialsproject.org/api/v1';

/**
 * Interfaccia per le proprietà fisiche dei materiali
 */
export interface MaterialPhysicalProperties {
  density?: number;         // g/cm³
  electricalConductivity?: number;  // S/m
  thermalConductivity?: number;     // W/(m·K)
  meltingPoint?: number;    // K
  recyclable?: boolean;
  biodegradable?: boolean;
  renewableSource?: boolean;
  toxicity?: string;        // 'none' | 'low' | 'medium' | 'high'
  energyToProcess?: number; // MJ/kg
  co2Footprint?: number;    // kg CO2/kg
  waterUsage?: number;      // L/kg
  durabilityYears?: number;
  insulationRValue?: number;
  flammability?: string;    // 'non-flammable' | 'self-extinguishing' | 'flammable' | 'highly-flammable'
  uvResistance?: string;    // 'poor' | 'fair' | 'good' | 'excellent'
  acidResistance?: string;  // 'poor' | 'fair' | 'good' | 'excellent'
  alkalineResistance?: string; // 'poor' | 'fair' | 'good' | 'excellent'
}

/**
 * Interfaccia per i dati estesi dei materiali
 */
export interface ExtendedMaterialData {
  name: string;
  formula?: string;
  type: string;
  description?: string;
  properties: MaterialPhysicalProperties;
  sustainabilityScore?: number; // Da 0 a 100
  recyclingTips?: string[];
  commonUses?: string[];
  environmentalImpact?: string;
  decompositionTime?: string;
  productionMethods?: string[];
}

/**
 * Verifica se l'API key è configurata
 */
export function isMaterialsProjectConfigured(): boolean {
  return !!MP_API_KEY;
}

/**
 * Cerca materiali per nome
 * @param materialName - Nome del materiale da cercare
 */
export async function searchMaterial(materialName: string): Promise<any> {
  try {
    if (!MP_API_KEY) {
      console.warn('Materials Project API key non configurata');
      return null;
    }

    const response = await axios.get(`${API_BASE_URL}/materials/search`, {
      params: {
        q: materialName,
        page_size: 5
      },
      headers: {
        'X-API-KEY': MP_API_KEY
      }
    });

    return response.data;
  } catch (error: any) {
    console.error('Errore nella ricerca dei materiali:', error.message);
    return null;
  }
}

/**
 * Ottiene dettagli su un materiale specifico
 * @param materialId - ID del materiale
 */
export async function getMaterialDetails(materialId: string): Promise<any> {
  try {
    if (!MP_API_KEY) {
      console.warn('Materials Project API key non configurata');
      return null;
    }

    const response = await axios.get(`${API_BASE_URL}/materials/${materialId}`, {
      headers: {
        'X-API-KEY': MP_API_KEY
      }
    });

    return response.data;
  } catch (error: any) {
    console.error('Errore nel recupero dei dettagli del materiale:', error.message);
    return null;
  }
}

/**
 * Ottiene le proprietà fisiche di un materiale
 * @param materialId - ID del materiale
 */
export async function getMaterialProperties(materialId: string): Promise<any> {
  try {
    if (!MP_API_KEY) {
      console.warn('Materials Project API key non configurata');
      return null;
    }

    const response = await axios.get(`${API_BASE_URL}/materials/${materialId}/properties`, {
      headers: {
        'X-API-KEY': MP_API_KEY
      }
    });

    return response.data;
  } catch (error: any) {
    console.error('Errore nel recupero delle proprietà del materiale:', error.message);
    return null;
  }
}

/**
 * Genera dati estesi sui materiali combinando Materials Project con dati di sostenibilità
 * @param materialType - Tipo di materiale (es. 'plastica', 'legno', 'metallo')
 * @param specificName - Nome specifico del materiale (es. 'PET', 'pino', 'alluminio')
 */
export async function getExtendedMaterialData(materialType: string, specificName: string): Promise<ExtendedMaterialData | null> {
  try {
    // Prima cerchiamo il materiale nell'API di Materials Project
    const searchQuery = specificName || materialType;
    const searchResults = await searchMaterial(searchQuery);
    
    // Dati base del materiale
    const materialData: ExtendedMaterialData = {
      name: specificName || materialType,
      type: materialType,
      properties: {},
      recyclingTips: [],
      commonUses: []
    };
    
    // Se abbiamo risultati dall'API, cerchiamo di arricchire i dati
    if (searchResults && searchResults.data && searchResults.data.length > 0) {
      const materialId = searchResults.data[0].material_id;
      const details = await getMaterialDetails(materialId);
      const properties = await getMaterialProperties(materialId);
      
      if (details) {
        materialData.formula = details.formula;
        materialData.description = `${specificName || materialType} (${details.formula})`;
      }
      
      if (properties) {
        // Mappiamo le proprietà scientifiche in base ai dati disponibili
        if (properties.density) materialData.properties.density = properties.density;
        if (properties.elastic) materialData.properties.electricalConductivity = properties.elastic.elastic_tensor?.average_bulk_modulus;
        if (properties.thermo) materialData.properties.meltingPoint = properties.thermo.melting_point;
      }
    }
    
    // Arricchiamo con dati di sostenibilità specifici per tipo di materiale
    enrichWithSustainabilityData(materialData);
    
    return materialData;
  } catch (error: any) {
    console.error('Errore nella generazione dei dati estesi del materiale:', error.message);
    return null;
  }
}

/**
 * Arricchisce i dati del materiale con informazioni di sostenibilità
 * @param materialData - Dati del materiale da arricchire
 */
function enrichWithSustainabilityData(materialData: ExtendedMaterialData): void {
  // Database semplificato di dati di sostenibilità per tipo di materiale
  const sustainabilityDb: Record<string, Partial<MaterialPhysicalProperties & {
    recyclingTips: string[],
    commonUses: string[],
    sustainabilityScore: number,
    environmentalImpact: string,
    decompositionTime: string
  }>> = {
    'plastica': {
      recyclable: true,
      biodegradable: false,
      renewableSource: false,
      toxicity: 'medium',
      energyToProcess: 80,
      co2Footprint: 6,
      waterUsage: 185,
      durabilityYears: 50,
      flammability: 'flammable',
      uvResistance: 'poor',
      sustainabilityScore: 30,
      recyclingTips: [
        'Separare per tipo di plastica',
        'Rimuovere etichette e residui',
        'Schiacciare per ridurre il volume'
      ],
      commonUses: [
        'Contenitori', 'Imballaggi', 'Componenti elettronici'
      ],
      environmentalImpact: 'Elevato impatto ambientale, specialmente negli oceani',
      decompositionTime: '450+ anni'
    },
    'vetro': {
      recyclable: true,
      biodegradable: false,
      renewableSource: false,
      toxicity: 'low',
      energyToProcess: 15,
      co2Footprint: 0.85,
      waterUsage: 50,
      durabilityYears: 1000,
      flammability: 'non-flammable',
      uvResistance: 'excellent',
      sustainabilityScore: 65,
      recyclingTips: [
        'Separare per colore',
        'Rimuovere tappi e coperchi',
        'Sciacquare prima del riciclo'
      ],
      commonUses: [
        'Contenitori per alimenti', 'Bottiglie', 'Finestre'
      ],
      environmentalImpact: 'Medio impatto nella produzione, basso nello smaltimento',
      decompositionTime: '1+ milione di anni'
    },
    'metallo': {
      recyclable: true,
      biodegradable: false,
      renewableSource: false,
      toxicity: 'low',
      energyToProcess: 95,
      co2Footprint: 1.85,
      waterUsage: 50,
      durabilityYears: 100,
      flammability: 'non-flammable',
      uvResistance: 'excellent',
      sustainabilityScore: 80,
      recyclingTips: [
        'Separare per tipo di metallo',
        'Rimuovere componenti non metallici',
        'Pulire da residui'
      ],
      commonUses: [
        'Strutture', 'Contenitori', 'Componenti elettronici'
      ],
      environmentalImpact: 'Elevato nella produzione, basso nel riciclo',
      decompositionTime: '200+ anni'
    },
    'carta': {
      recyclable: true,
      biodegradable: true,
      renewableSource: true,
      toxicity: 'none',
      energyToProcess: 35,
      co2Footprint: 1.1,
      waterUsage: 400,
      durabilityYears: 5,
      flammability: 'highly-flammable',
      uvResistance: 'poor',
      sustainabilityScore: 75,
      recyclingTips: [
        'Mantenere asciutta',
        'Rimuovere nastri adesivi e graffette',
        'Separare da altri materiali'
      ],
      commonUses: [
        'Imballaggi', 'Stampa', 'Prodotti sanitari'
      ],
      environmentalImpact: 'Basso se da fonti sostenibili e riciclata',
      decompositionTime: '2-6 mesi'
    },
    'legno': {
      recyclable: true,
      biodegradable: true,
      renewableSource: true,
      toxicity: 'none',
      energyToProcess: 10,
      co2Footprint: 0.45,
      waterUsage: 20,
      durabilityYears: 25,
      flammability: 'flammable',
      uvResistance: 'fair',
      sustainabilityScore: 85,
      recyclingTips: [
        'Rimuovere chiodi e viti',
        'Separare da legno trattato',
        'Compostare se non trattato'
      ],
      commonUses: [
        'Mobili', 'Costruzioni', 'Utensili'
      ],
      environmentalImpact: 'Basso se da foreste gestite in modo sostenibile',
      decompositionTime: '10-15 anni'
    },
    'tessile': {
      recyclable: true,
      biodegradable: true,
      renewableSource: true,
      toxicity: 'low',
      energyToProcess: 55,
      co2Footprint: 3.4,
      waterUsage: 2700,
      durabilityYears: 10,
      flammability: 'flammable',
      uvResistance: 'fair',
      sustainabilityScore: 55,
      recyclingTips: [
        'Donare se in buone condizioni',
        'Separare per tipo di fibra',
        'Riutilizzare per altri scopi'
      ],
      commonUses: [
        'Abbigliamento', 'Arredamento', 'Isolamento'
      ],
      environmentalImpact: 'Varia molto in base al tipo di fibra e processo',
      decompositionTime: '1-5 anni per fibre naturali, 200+ per sintetiche'
    },
    'elettronica': {
      recyclable: true,
      biodegradable: false,
      renewableSource: false,
      toxicity: 'high',
      energyToProcess: 150,
      co2Footprint: 16,
      waterUsage: 1500,
      durabilityYears: 7,
      flammability: 'flammable',
      uvResistance: 'good',
      sustainabilityScore: 25,
      recyclingTips: [
        'Portare a centri di raccolta specifici',
        'Rimuovere batterie',
        'Considerare la riparazione prima dello smaltimento'
      ],
      commonUses: [
        'Dispositivi elettronici', 'Elettrodomestici', 'Strumenti di comunicazione'
      ],
      environmentalImpact: 'Molto elevato, contiene metalli rari e sostanze tossiche',
      decompositionTime: 'Indefinito per molti componenti'
    }
  };
  
  // Determiniamo il tipo base di materiale per la ricerca nel db
  const normalizedType = materialData.type.toLowerCase();
  let baseType = '';
  
  if (normalizedType.includes('plastic') || normalizedType.includes('plastica')) baseType = 'plastica';
  else if (normalizedType.includes('glass') || normalizedType.includes('vetro')) baseType = 'vetro';
  else if (normalizedType.includes('metal') || normalizedType.includes('metallo')) baseType = 'metallo';
  else if (normalizedType.includes('paper') || normalizedType.includes('carta')) baseType = 'carta';
  else if (normalizedType.includes('wood') || normalizedType.includes('legno')) baseType = 'legno';
  else if (normalizedType.includes('textile') || normalizedType.includes('tessile')) baseType = 'tessile';
  else if (normalizedType.includes('electronic') || normalizedType.includes('elettronica')) baseType = 'elettronica';
  else baseType = 'plastica'; // Default
  
  // Arricchiamo con i dati del database
  const sustainabilityData = sustainabilityDb[baseType];
  if (sustainabilityData) {
    materialData.properties = { ...materialData.properties, ...sustainabilityData };
    materialData.recyclingTips = sustainabilityData.recyclingTips || [];
    materialData.commonUses = sustainabilityData.commonUses || [];
    materialData.sustainabilityScore = sustainabilityData.sustainabilityScore;
    materialData.environmentalImpact = sustainabilityData.environmentalImpact;
    materialData.decompositionTime = sustainabilityData.decompositionTime;
  }
}
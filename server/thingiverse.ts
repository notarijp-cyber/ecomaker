import axios from 'axios';

// API key di Thingiverse dalle variabili d'ambiente
const THINGIVERSE_API_KEY = process.env.THINGIVERSE_API_KEY;
const API_BASE_URL = 'https://api.thingiverse.com';

console.log("Thingiverse API Key configurata:", !!THINGIVERSE_API_KEY);

/**
 * Interfaccia per i metadati dei modelli 3D
 */
export interface ThingiverseModel {
  id: number;
  name: string;
  thumbnail: string;
  url: string;
  public_url: string;
  creator: {
    name: string;
    thumbnail: string;
    url: string;
  };
  added: string;
  modified: string;
  description: string;
  instructions: string;
  license: string;
  files_count: number;
  like_count: number;
  download_count: number;
  view_count: number;
  make_count: number;
  tags: string[];
  is_featured: boolean;
  is_published: boolean;
  is_wip: boolean;
  categories: string[];
  file_formats: string[];
}

/**
 * Interfaccia per la risposta di ricerca
 */
export interface ThingiverseSearchResponse {
  total: number;
  hits: ThingiverseModel[];
}

/**
 * Interfaccia per i file di un modello
 */
export interface ThingiverseFile {
  id: number;
  name: string;
  size: number;
  url: string;
  download_url: string;
  thumbnail: string;
  default_image: string;
  date: string;
  formatted_size: string;
  download_count: number;
  direct_url?: string;
}

/**
 * Verifica se l'API key è configurata
 */
export function isThingiverseConfigured(): boolean {
  return !!THINGIVERSE_API_KEY;
}

/**
 * Ricerca modelli su Thingiverse in base a parole chiave
 * @param keywords - Parole chiave per la ricerca
 * @param page - Numero di pagina per i risultati paginati (default: 1)
 * @param perPage - Numero di risultati per pagina (default: 20)
 */
import { 
  searchFallbackModels,
  getFallbackThingDetails,
  getFallbackThingFiles
} from '../data/thingiverse-fallback-data';

export async function searchThingiverseModels(
  keywords: string[],
  page: number = 1,
  perPage: number = 20,
  lang: 'it' | 'en' = 'it'
): Promise<ThingiverseSearchResponse | null> {
  try {
    if (!THINGIVERSE_API_KEY) {
      console.warn('Thingiverse API key non configurata, utilizzando dati locali');
      return searchFallbackModels(keywords, lang);
    }

    const query = keywords.join(' ');
    const response = await axios.get(`${API_BASE_URL}/search/${encodeURIComponent(query)}`, {
      params: {
        page,
        per_page: perPage,
        sort: 'relevant',
        access_token: THINGIVERSE_API_KEY
      }
    });

    return response.data;
  } catch (error: any) {
    console.error('Errore nella ricerca di modelli Thingiverse:', error.message);
    console.log('Utilizzando dati di fallback locali...');
    return searchFallbackModels(keywords, lang);
  }
}

/**
 * Ottiene i dettagli di un modello specifico
 * @param thingId - ID del modello da recuperare
 */
export async function getThingDetails(thingId: number, lang: 'it' | 'en' = 'it'): Promise<ThingiverseModel | null> {
  try {
    if (!THINGIVERSE_API_KEY) {
      console.warn('Thingiverse API key non configurata, utilizzando dati locali');
      return getFallbackThingDetails(thingId, lang);
    }

    const response = await axios.get(`${API_BASE_URL}/things/${thingId}`, {
      params: {
        access_token: THINGIVERSE_API_KEY
      }
    });

    return response.data;
  } catch (error: any) {
    console.error(`Errore nel recupero dei dettagli del modello #${thingId}:`, error.message);
    console.log('Utilizzando dati di fallback locali...');
    return getFallbackThingDetails(thingId, lang);
  }
}

/**
 * Ottiene i file associati a un modello
 * @param thingId - ID del modello
 * @param lang - Lingua per i dati (it o en)
 */
export async function getThingFiles(thingId: number, lang: 'it' | 'en' = 'it'): Promise<ThingiverseFile[] | null> {
  try {
    if (!THINGIVERSE_API_KEY) {
      console.warn('Thingiverse API key non configurata, utilizzando dati locali');
      return getFallbackThingFiles(thingId);
    }

    const response = await axios.get(`${API_BASE_URL}/things/${thingId}/files`, {
      params: {
        access_token: THINGIVERSE_API_KEY
      }
    });

    return response.data;
  } catch (error: any) {
    console.error(`Errore nel recupero dei file del modello #${thingId}:`, error.message);
    console.log('Utilizzando dati di fallback locali...');
    return getFallbackThingFiles(thingId);
  }
}

/**
 * Cerca modelli rilevanti per un progetto di upcycling in base ai materiali
 * @param materials - Array di materiali disponibili
 * @param projectType - Tipo di progetto (opzionale)
 * @param lang - Lingua per i dati (it o en)
 */
export async function findRelevantModelsForProject(
  materials: string[],
  projectType?: string,
  lang: 'it' | 'en' = 'it'
): Promise<ThingiverseModel[] | null> {
  try {
    if (!THINGIVERSE_API_KEY) {
      console.warn('Thingiverse API key non configurata');
      return null;
    }

    // Creiamo una query intelligente combinando i materiali e il tipo di progetto
    let searchTerms = [...materials];
    if (projectType) {
      searchTerms.push(projectType);
    }
    
    // Aggiungiamo termini relativi all'upcycling
    searchTerms.push('upcycle', 'recycle', 'reuse');
    
    // Rimuoviamo duplicati
    const uniqueTerms = [...new Set(searchTerms)];
    
    // Facciamo la ricerca
    const searchResults = await searchThingiverseModels(uniqueTerms, 1, 10, lang);
    
    if (!searchResults || !searchResults.hits || searchResults.hits.length === 0) {
      return null;
    }
    
    return searchResults.hits;
  } catch (error: any) {
    console.error('Errore nella ricerca di modelli rilevanti:', error.message);
    return null;
  }
}

/**
 * Analizza il flusso di lavoro di un progetto esistente
 * @param thingId - ID del modello da analizzare
 * @param lang - Lingua per i dati (it o en)
 */
export async function analyzeProjectWorkflow(thingId: number, lang: 'it' | 'en' = 'it'): Promise<{
  steps: string[];
  materials: string[];
  tools: string[];
  difficulty: string;
  estimatedTime: number;
} | null> {
  try {
    if (!THINGIVERSE_API_KEY) {
      console.warn('Thingiverse API key non configurata');
      return null;
    }
    
    // Otteniamo i dettagli del modello
    const thingDetails = await getThingDetails(thingId, lang);
    
    if (!thingDetails) {
      return null;
    }
    
    // Analizziamo le istruzioni per estrarre informazioni utili
    // Nota: In un'implementazione reale, potremmo utilizzare NLP o OpenAI per analizzare il testo
    // Per semplicità, qui usiamo un'analisi basica basata su parole chiave
    
    let steps: string[] = [];
    let materials: string[] = [];
    let tools: string[] = [];
    let difficulty = "Medio";  // Default
    let estimatedTime = 60;    // Default in minuti
    
    if (thingDetails.instructions) {
      // Dividiamo le istruzioni in paragrafi o elenchi
      const paragraphs = thingDetails.instructions.split('\n\n');
      
      // Estraiamo le fasi del processo
      steps = paragraphs.map(p => p.trim()).filter(p => p.length > 10);
      
      // Cerchiamo materiali comuni nelle istruzioni
      const materialKeywords = ['plastic', 'wood', 'metal', 'glass', 'paper', 'cardboard', 'fabric'];
      materialKeywords.forEach(material => {
        if (thingDetails.instructions.toLowerCase().includes(material)) {
          materials.push(material);
        }
      });
      
      // Cerchiamo strumenti comuni nelle istruzioni
      const toolKeywords = ['scissors', 'glue', 'saw', 'drill', 'hammer', 'printer', 'knife', 'cutter'];
      toolKeywords.forEach(tool => {
        if (thingDetails.instructions.toLowerCase().includes(tool)) {
          tools.push(tool);
        }
      });
      
      // Cerchiamo indizi sulla difficoltà
      if (thingDetails.instructions.toLowerCase().includes('simple') || 
          thingDetails.instructions.toLowerCase().includes('easy')) {
        difficulty = "Facile";
      } else if (thingDetails.instructions.toLowerCase().includes('complex') || 
                thingDetails.instructions.toLowerCase().includes('advanced')) {
        difficulty = "Avanzato";
      }
      
      // Stimiamo il tempo in base alla lunghezza delle istruzioni e al numero di passaggi
      const instructionLength = thingDetails.instructions.length;
      const numSteps = steps.length;
      
      if (instructionLength < 500 && numSteps < 5) {
        estimatedTime = 30;  // Progetto veloce
      } else if (instructionLength > 2000 || numSteps > 10) {
        estimatedTime = 120;  // Progetto complesso
      }
    }
    
    // Se non abbiamo trovato informazioni sufficienti dalle istruzioni,
    // utilizziamo la descrizione e i tag come fallback
    if (materials.length === 0 && thingDetails.tags) {
      const materialKeywords = ['plastic', 'wood', 'metal', 'glass', 'paper', 'cardboard', 'fabric'];
      thingDetails.tags.forEach(tag => {
        if (materialKeywords.includes(tag.toLowerCase())) {
          materials.push(tag);
        }
      });
    }
    
    // Se ancora non abbiamo passaggi, creiamo un singolo passaggio generico
    if (steps.length === 0) {
      steps = ["Follow the instructions provided in the original model."];
    }
    
    return {
      steps,
      materials,
      tools,
      difficulty,
      estimatedTime
    };
  } catch (error: any) {
    console.error(`Errore nell'analisi del flusso di lavoro del progetto #${thingId}:`, error.message);
    return null;
  }
}
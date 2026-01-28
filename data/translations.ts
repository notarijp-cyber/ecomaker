/**
 * Sistema di traduzione per l'applicazione
 * Supporta italiano e inglese
 */

export type Language = 'it' | 'en';

export interface Translations {
  // Interfaccia utente
  ui: {
    search: {
      placeholder: string;
      button: string;
      noResults: string;
      error: string;
      loading: string;
    };
    filters: {
      title: string;
      categories: string;
      formats: string;
      sort: string;
      applyFilters: string;
      clearFilters: string;
    };
    modelCard: {
      downloadButton: string;
      viewDetails: string;
      createdBy: string;
      likes: string;
      downloads: string;
      files: string;
    };
    modelDetails: {
      description: string;
      instructions: string;
      license: string;
      categories: string;
      tags: string;
      files: string;
      fileSize: string;
      downloadCount: string;
      downloadButton: string;
    };
  };
  
  // Categorie
  categories: {
    household: string;
    decor: string;
    garden: string;
    tools: string;
    organization: string;
    art: string;
    education: string;
    machines: string;
    home: string;
  };
  
  // Messaggi di sistema
  system: {
    fallbackMode: string;
    apiError: string;
    downloadStarted: string;
    downloadError: string;
  };
}

// Traduzioni in italiano
const italianTranslations: Translations = {
  ui: {
    search: {
      placeholder: 'Cerca modelli 3D per progetti di riciclo...',
      button: 'Cerca',
      noResults: 'Nessun risultato trovato. Prova con termini di ricerca diversi.',
      error: 'Si è verificato un errore durante la ricerca. Riprova più tardi.',
      loading: 'Ricerca in corso...',
    },
    filters: {
      title: 'Filtri',
      categories: 'Categorie',
      formats: 'Formati',
      sort: 'Ordina per',
      applyFilters: 'Applica filtri',
      clearFilters: 'Cancella filtri',
    },
    modelCard: {
      downloadButton: 'Scarica',
      viewDetails: 'Vedi dettagli',
      createdBy: 'Creato da',
      likes: 'Mi piace',
      downloads: 'Download',
      files: 'File',
    },
    modelDetails: {
      description: 'Descrizione',
      instructions: 'Istruzioni',
      license: 'Licenza',
      categories: 'Categorie',
      tags: 'Tag',
      files: 'File',
      fileSize: 'Dimensione',
      downloadCount: 'Scaricato',
      downloadButton: 'Scarica',
    },
  },
  categories: {
    household: 'Casa',
    decor: 'Decorazioni',
    garden: 'Giardino',
    tools: 'Strumenti',
    organization: 'Organizzazione',
    art: 'Arte',
    education: 'Educazione',
    machines: 'Macchinari',
    home: 'Casa',
  },
  system: {
    fallbackMode: 'Modalità offline: utilizzando dati locali',
    apiError: 'Errore di connessione all\'API. Utilizzando dati locali.',
    downloadStarted: 'Download avviato...',
    downloadError: 'Errore durante il download. Riprova più tardi.',
  },
};

// Traduzioni in inglese
const englishTranslations: Translations = {
  ui: {
    search: {
      placeholder: 'Search 3D models for recycling projects...',
      button: 'Search',
      noResults: 'No results found. Try different search terms.',
      error: 'An error occurred during search. Please try again later.',
      loading: 'Searching...',
    },
    filters: {
      title: 'Filters',
      categories: 'Categories',
      formats: 'Formats',
      sort: 'Sort by',
      applyFilters: 'Apply filters',
      clearFilters: 'Clear filters',
    },
    modelCard: {
      downloadButton: 'Download',
      viewDetails: 'View details',
      createdBy: 'Created by',
      likes: 'Likes',
      downloads: 'Downloads',
      files: 'Files',
    },
    modelDetails: {
      description: 'Description',
      instructions: 'Instructions',
      license: 'License',
      categories: 'Categories',
      tags: 'Tags',
      files: 'Files',
      fileSize: 'Size',
      downloadCount: 'Downloaded',
      downloadButton: 'Download',
    },
  },
  categories: {
    household: 'Household',
    decor: 'Decor',
    garden: 'Garden',
    tools: 'Tools',
    organization: 'Organization',
    art: 'Art',
    education: 'Education',
    machines: 'Machines',
    home: 'Home',
  },
  system: {
    fallbackMode: 'Offline mode: using local data',
    apiError: 'API connection error. Using local data.',
    downloadStarted: 'Download started...',
    downloadError: 'Error during download. Please try again later.',
  },
};

// Mappa delle traduzioni
const translationsMap: Record<Language, Translations> = {
  it: italianTranslations,
  en: englishTranslations,
};

/**
 * Ottiene le traduzioni nella lingua specificata
 * @param lang - Codice lingua (it o en)
 * @returns Traduzioni nella lingua richiesta
 */
export function getTranslations(lang: Language = 'it'): Translations {
  return translationsMap[lang];
}

// Sistema per tradurre anche i dati di fallback
export function translateModelData(model: any, targetLang: Language): any {
  // Se la lingua target è italiano, non c'è bisogno di traduzione (i dati sono già in italiano e inglese)
  if (targetLang === 'it') {
    return model;
  }
  
  // Se la lingua target è inglese e la descrizione è solo in italiano, traduciamola
  if (targetLang === 'en' && !model.description.includes('This is a') && !model.description.includes('Transform')) {
    // Alcuni contenuti già bilingue hanno sia descrizione italiana che inglese
    if (model.description.includes('Una semplice lampada')) {
      return model; // Già bilingue
    }
    
    // Altrimenti forniamo una traduzione
    const italianToEnglishDescriptions: Record<string, string> = {
      'Lampada da Bottiglia di Vino / Wine Bottle Lamp': 
        'Wine Bottle Lamp - This is a simple lamp adapter that fits into a wine bottle. It\'s a great way to recycle and create a unique decoration for your home or garden. You\'ll need a standard E14 socket, a LED bulb (to avoid heat issues), and some basic wiring skills.',
      
      'Contenitore per Tappi di Bottiglia': 
        'Bottle Cap Recycling Bin - A small recycling bin designed to collect plastic bottle caps for recycling programs. Many recycling centers accept caps separately from bottles, and this container helps sort them at home. The design includes recycling symbols and can be customized with different colors.',
      
      'Trituratore di Plastica per Riciclo': 
        'Plastic Shredder for Recycling - A small-scale plastic shredder for home recycling projects. This design allows you to shred plastic bottles, containers, and other recyclables into small pieces that can be melted and molded into new objects. Part of a DIY plastic recycling system for makers.',
      
      'Lampadario da Bottiglie di Plastica Riciclate': 
        'Upcycled Plastic Bottle Chandelier - Turn plastic bottles into an elegant chandelier! This design includes connectors and a central hub to arrange bottles in a circular pattern. Cut the bottles into decorative shapes, attach LED string lights, and create a stunning lighting fixture from waste materials.',
      
      'Sistema di Irrigazione a Goccia da Bottiglie Riciclate': 
        'Upcycled Plastic Bottle Drip Irrigation System - A sustainable drip irrigation system made from upcycled plastic bottles. This design includes connectors, drippers, and distribution components that help you create a water-efficient garden system using waste materials. Perfect for home gardens and educational projects.'
    };
    
    // Cerca una traduzione basata sul nome
    if (italianToEnglishDescriptions[model.name]) {
      // Traduci solo se non è già in inglese
      if (!model.description.includes('This is a') && !model.description.includes('Transform')) {
        model.description = italianToEnglishDescriptions[model.name];
      }
    }
  }
  
  return model;
}

// Determina la lingua del browser dell'utente
export function detectBrowserLanguage(): Language {
  if (typeof window !== 'undefined' && window.navigator) {
    const lang = window.navigator.language.split('-')[0];
    return lang === 'it' ? 'it' : 'en';
  }
  return 'it'; // Default a italiano
}
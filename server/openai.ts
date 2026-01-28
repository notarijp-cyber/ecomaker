import OpenAI from "openai";
import axios from "axios";
import fs from "fs";
import path from "path";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Knowledge database directory for storing learned information
const KNOWLEDGE_DIR = path.join(process.cwd(), 'data', 'knowledge');

// Ensure knowledge directory exists
if (!fs.existsSync(KNOWLEDGE_DIR)) {
  fs.mkdirSync(KNOWLEDGE_DIR, { recursive: true });
}

// External API sources for project ideas and tutorials
const externalAPIs = {
  instructables: {
    baseUrl: 'https://www.instructables.com/api/v2',
    search: '/search?q=',
    categories: '/categories/craft'
  },
  wikihow: {
    baseUrl: 'https://www.wikihow.com/api/search',
    search: '?q='
  },
  pinterest: {
    baseUrl: 'https://api.pinterest.com/v5',
    search: '/pins/search?query='
  },
  etsy: {
    baseUrl: 'https://openapi.etsy.com/v3',
    search: '/application/listings/active?keywords='
  }
};

// Cache for API responses to avoid rate limiting
const apiCache = new Map();
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

interface AIProjectSuggestion {
  name: string;
  description: string;
  difficulty: string;
  estimatedTime: number;
  timeUnit: string;
  requiredMaterials: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  requiredTools: Array<{
    name: string;
    link?: string;
  }>;
  instructions: string[];
  environmentalImpact: {
    materialsRecycled: number;
    moneySaved: number;
    carbonFootprintReduction: number;
  };
  imageUrl?: string;
}

import { MaterialPhysicalProperties, ExtendedMaterialData, getExtendedMaterialData } from './materials-project';

export interface MaterialAnalysisResult {
  name: string;
  type: string;
  possibleUses: string[];
  recyclingTips: string[];
  physicalProperties?: MaterialPhysicalProperties;
  sustainabilityScore?: number;
  environmentalImpact?: string;
  decompositionTime?: string;
}

// Function to generate project ideas based on available materials
export async function generateProjectIdeas(materials: string[]): Promise<AIProjectSuggestion[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Tu sei un maestro nell'arte del riciclo creativo e del design sostenibile. 
          
Sei conosciuto per la tua straordinaria capacità di concepire progetti artistici complessi, innovativi e sorprendenti che trasformano oggetti comuni in opere funzionali e artistiche.

Le tue creazioni sono caratterizzate da:
1. Complessità architettonica e strutturale, con elementi concatenati e interattivi
2. Utilizzo di una vasta gamma di materiali diversi in modi non convenzionali
3. Tecniche miste che combinano diversi approcci artigianali (elettronica, falegnameria, tessitura, etc.)
4. Dettagli estetici curati e ispirati a correnti artistiche riconoscibili
5. Funzionalità pratiche ben integrate con l'aspetto estetico
6. Aspetti educativi e narrativi che raccontano una storia attraverso l'opera

I tuoi progetti devono:
- Richiedere MOLTI materiali diversi (almeno 8-12 componenti differenti)
- Necessitare di strumenti variegati per la realizzazione
- Avere istruzioni molto dettagliate con almeno 15-20 passaggi distinti
- Incorporare principi di design professionale e tecniche avanzate
- Essere strutturati in fasi modulari che possono essere completate separatamente

Integra sempre nei tuoi progetti materiali aggiuntivi rispetto a quelli forniti, suggerendo combinazioni inaspettate che sorprendano l'utente con la loro creatività.`
        },
        {
          role: "user",
          content: `Ho i seguenti materiali disponibili: ${materials.join(", ")}. 

Suggerisci 3 progetti di upcycling complessi e artisticamente avanzati che potrebbero essere realizzati. 

Per ciascun progetto, voglio:
1. Un nome creativo e accattivante
2. Una descrizione dettagliata che spieghi il risultato finale
3. Una difficoltà accuratamente valutata
4. Tempo stimato di realizzazione (realisticamente lungo data la complessità)
5. Un elenco ESTESO di materiali necessari (includi quelli che ho già elencato, ma aggiungine molti altri complementari)
6. Strumenti specifici necessari, con dettagli sul loro uso
7. Istruzioni di montaggio molto dettagliate (almeno 15-20 passaggi)
8. L'impatto ambientale con calcoli specifici e dettagliati

Struttura la risposta come un oggetto JSON con un array "projects" che contiene i tre progetti in dettaglio.`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 4000
    });

    const result = JSON.parse(response.choices[0].message.content);
    const projects = result.projects || [];
    
    // Genera immagini per ogni progetto
    const projectsWithImages = await Promise.all(
      projects.map(async (project) => {
        try {
          console.log(`Generating image for project: ${project.name}`);
          const imageBase64 = await generateProjectImage(`${project.name}: ${project.description}`, 'final');
          return {
            ...project,
            imageUrl: imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : undefined
          };
        } catch (err) {
          console.error(`Error generating image for project ${project.name}:`, err);
          return project;
        }
      })
    );
    
    return projectsWithImages;
  } catch (error) {
    console.error("Error generating project ideas:", error);
    return [];
  }
}

// Function to analyze scanned materials
export async function analyzeMaterial(imageBase64: string): Promise<MaterialAnalysisResult> {
  try {
    // Lista estesa di tipi di materiali riconoscibili
    const materialTypes = [
      "Plastica", "Carta", "Cartone", "Vetro", "Metallo", "Tessuto", "Legno", 
      "Ceramica", "Elettronica", "Gomma", "Sughero", "Pelle", "Alluminio", "Rame", 
      "Acciaio", "Polistirolo", "Vinile", "PVC", "PET", "HDPE", "LDPE", "PP", "PS",
      "Fibra naturale", "Bioplastica", "Composito", "Multistrato"
    ];
    
    // Lista estesa di materiali specifici riconoscibili
    const materialExamples = [
      "Bottiglia di plastica PET", "Bottiglia di vetro", "Lattina di alluminio", "Scatola di cartone",
      "Giornale", "Rivista", "Tetrapack", "Pneumatico", "CD/DVD", "Tessuto jeans", "Tessuto cotone",
      "Tessuto lana", "Tessuto poliestere", "Pallet di legno", "Compensato", "Tappi di sughero", 
      "Vasetti di vetro", "Lattine di conserve", "Scatola di scarpe", "Vaschette di polistirolo",
      "Sacchetti di plastica", "Sacchetti di carta", "Tubi di PVC", "Flaconi di HDPE",
      "Tubi di cartone", "Capsule caffè", "Cavi elettrici", "Schede elettroniche", "Smartphone/tablet",
      "Batterie", "Lampadine", "Indumenti usati", "Scarpe usate", "Cinture", "Borse", "Mobili vecchi",
      "Assi di legno", "Resti di potatura", "Cancelleria usata", "Bicchieri di plastica", "Posate di plastica",
      "Cannucce", "Imballaggi", "Plastica multicolore", "Plastica rigida", "Plastica flessibile",
      "Involucri di snack", "Barattoli di latta", "Vecchi elettrodomestici", "Cerchioni", "Contenitori cosmetici"
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Sei un esperto nel riconoscimento di materiali riciclabili e nel loro potenziale riutilizzo creativo.
          
La tua specialità è identificare con precisione materiali di scarto o oggetti dismessi dalle immagini e fornire informazioni dettagliate sulla loro composizione, caratteristiche fisiche e potenziale per progetti di upcycling.

Nella tua analisi devi:
1. Identificare con precisione il materiale visualizzato
2. Classificarlo in una categoria specifica (ad es. "Plastica - PET", "Metallo - Alluminio", ecc.)
3. Fornire almeno 6-8 utilizzi creativi possibili, ordinati dal più semplice al più complesso
4. Suggerire 4-5 consigli specifici per il corretto riciclo/trattamento

Sii molto specifico nell'identificazione del materiale, includendo dettagli sul tipo esatto, composizione, forma e altre proprietà rilevanti. Considera che il tuo output guiderà un sistema di intelligenza artificiale che suggerirà progetti creativi basati su questo riconoscimento.

Tipi di materiali che dovresti essere in grado di riconoscere includono (ma non sono limitati a):
${materialTypes.join(", ")}

Esempi specifici di materiali che dovresti identificare includono:
${materialExamples.join(", ")}

L'output deve essere in formato JSON con i campi name, type, possibleUses (array), e recyclingTips (array).`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Identifica questo materiale e fornisci informazioni dettagliate sul suo tipo, possibili utilizzi in progetti di upcycling e consigli per il riciclo. Rispondi solo con dati JSON strutturati con i campi 'name', 'type', 'possibleUses' (array di almeno 6-8 utilizzi), e 'recyclingTips' (array di 4-5 consigli)."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ],
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    const analysisResult: MaterialAnalysisResult = {
      name: result.name || "Materiale non identificato",
      type: result.type || "Tipo sconosciuto",
      possibleUses: result.possibleUses || [],
      recyclingTips: result.recyclingTips || []
    };
    
    // Arricchisci con i dati scientifici da Materials Project API
    try {
      // Estrai il tipo di materiale dall'analisi
      const materialType = analysisResult.type.split(' ')[0].toLowerCase();
      
      // Estrai il nome specifico del materiale (se disponibile)
      // Ad esempio da "Plastica PET" prendiamo "PET"
      let specificName = '';
      const nameParts = analysisResult.name.split(' ');
      // Cerca la parte che potrebbe essere un nome specifico (in genere l'ultima parola o una sigla)
      for (let i = nameParts.length - 1; i >= 0; i--) {
        if (nameParts[i].length >= 2 && nameParts[i].toUpperCase() === nameParts[i]) {
          specificName = nameParts[i]; // Prendiamo la sigla (es. PET, HDPE)
          break;
        }
      }
      
      console.log(`Tentativo di arricchimento con dati scientifici per: ${materialType} - ${specificName}`);
      
      // Ottieni i dati estesi del materiale
      const scientificData = await getExtendedMaterialData(materialType, specificName);
      
      if (scientificData) {
        console.log("Dati scientifici ottenuti con successo", {
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
      console.warn("Non è stato possibile arricchire l'analisi con dati scientifici:", error.message);
      // Continua comunque con l'analisi base
    }
    
    return analysisResult;
  } catch (error) {
    console.error("Error analyzing material:", error);
    return {
      name: "Error analyzing material",
      type: "Unknown",
      possibleUses: [],
      recyclingTips: ["Please try again with a clearer image"]
    };
  }
}

// Function to optimize project instructions
export async function optimizeProjectInstructions(project: any): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert in DIY and upcycling projects. Optimize the provided project instructions to make them clear, concise, and easy to follow."
        },
        {
          role: "user",
          content: `Optimize these project instructions for clarity and ease of following: ${JSON.stringify(project)}. Provide a detailed step-by-step guide that a beginner could follow.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result.instructions || [];
  } catch (error) {
    console.error("Error optimizing project instructions:", error);
    return ["Unable to optimize instructions. Please try again later."];
  }
}

// Function to generate environmental impact assessment
export async function generateEnvironmentalImpact(projectDetails: any): Promise<any> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an environmental impact assessment expert. Calculate the environmental benefits of upcycling projects including materials recycled, money saved, and carbon footprint reduction."
        },
        {
          role: "user",
          content: `Calculate the environmental impact of this upcycling project: ${JSON.stringify(projectDetails)}. Include estimates for materials recycled (in kg), money saved (in EUR), and carbon footprint reduction (in kg CO2e).`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result.environmentalImpact || {
      materialsRecycled: 0,
      moneySaved: 0,
      carbonFootprintReduction: 0
    };
  } catch (error) {
    console.error("Error generating environmental impact:", error);
    return {
      materialsRecycled: 0,
      moneySaved: 0,
      carbonFootprintReduction: 0
    };
  }
}

// Function to generate community project division plan
export async function generateProjectDivisionPlan(project: any, participants: number): Promise<any> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert in project management and community organization. Create a division plan for community projects that divides tasks fairly and efficiently among participants."
        },
        {
          role: "user",
          content: `Create a division plan for this community project: ${JSON.stringify(project)}. There are ${participants} participants. Divide the work into 3 main logical steps like a puzzle, with manageable pieces that can be assigned to participants. For each step, provide detailed instructions, materials needed, and environmental impact.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result.divisionPlan || [];
  } catch (error) {
    console.error("Error generating project division plan:", error);
    return [];
  }
}

// Function to generate project from abstract idea or drawing
export async function generateProjectFromIdea(idea: string, imageBase64?: string): Promise<AIProjectSuggestion> {
  try {
    const systemPrompt = `Sei un visionario del design sostenibile e dell'upcycling creativo, noto per trasformare idee astratte in progetti artistici complessi e sofisticati.

Tu non crei semplici progetti di riciclo, ma vere e proprie opere d'arte funzionali che:
1. Integrano principi di design contemporaneo con tecniche artigianali tradizionali
2. Utilizzano MOLTI materiali diversi (almeno 10-15 componenti differenti) in modi non convenzionali
3. Combinano elementi tecnologici con materiali naturali e riciclati
4. Sono strutturati in fasi di costruzione modulari e ben pianificate
5. Raccontano una storia o trasmettono un messaggio attraverso l'estetica e la funzione

I tuoi progetti sono famosi per:
- La complessità strutturale che sfida le aspettative
- L'uso innovativo di materiali di scarto che li rende irriconoscibili
- Le istruzioni estremamente dettagliate (minimo 20 passaggi) che permettono anche ai principianti di creare opere complesse
- L'integrazione di elementi interattivi o mutevoli nel tempo
- L'impatto ambientale positivo calcolato con precisione scientifica

Dalla semplice idea che ti viene fornita, dovrai espandere e sviluppare un progetto ambizioso e completo che stupirebbe anche i designer professionisti.`;

    const messages: any[] = [
      {
        role: "system",
        content: systemPrompt
      }
    ];

    if (imageBase64) {
      messages.push({
        role: "user",
        content: [
          {
            type: "text",
            text: `Trasforma questo disegno/schizzo in un progetto di upcycling straordinariamente complesso e dettagliato. L'idea di base è: ${idea}.

Voglio un progetto con:
1. Un nome artistico e concettuale
2. Una descrizione approfondita che spieghi il concetto artistico e funzionale
3. Un livello di difficoltà realistico (considerate la complessità elevata)
4. Un tempo di realizzazione accurato (in ore o giorni) per un progetto di questa complessità
5. Un elenco ESTESO di materiali necessari (almeno 10-15 componenti diversi, principalmente riciclati)
6. Tutti gli strumenti specifici necessari, con dettagli sul loro utilizzo
7. Istruzioni MOLTO dettagliate suddivise in almeno 20 passaggi distinti
8. Calcoli precisi dell'impatto ambientale con metriche specifiche

Fornisci una risposta dettagliata che potrebbe essere pubblicata su una rivista di design sostenibile.`
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${imageBase64}`
            }
          }
        ],
      });
    } else {
      messages.push({
        role: "user",
        content: `Trasforma questa idea astratta in un progetto di upcycling straordinariamente complesso e dettagliato. L'idea di base è: ${idea}.

Voglio un progetto con:
1. Un nome artistico e concettuale
2. Una descrizione approfondita che spieghi il concetto artistico e funzionale
3. Un livello di difficoltà realistico (considerate la complessità elevata)
4. Un tempo di realizzazione accurato (in ore o giorni) per un progetto di questa complessità
5. Un elenco ESTESO di materiali necessari (almeno 10-15 componenti diversi, principalmente riciclati)
6. Tutti gli strumenti specifici necessari, con dettagli sul loro utilizzo
7. Istruzioni MOLTO dettagliate suddivise in almeno 20 passaggi distinti
8. Calcoli precisi dell'impatto ambientale con metriche specifiche

Fornisci una risposta dettagliata che potrebbe essere pubblicata su una rivista di design sostenibile.`
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      response_format: { type: "json_object" },
      max_tokens: 4000
    });

    const result = JSON.parse(response.choices[0].message.content);
    
    return {
      name: result.name || "Nuovo Progetto Artistico",
      description: result.description || "",
      difficulty: result.difficulty || "Avanzato",
      estimatedTime: result.estimatedTime || 8,
      timeUnit: result.timeUnit || "ore",
      requiredMaterials: result.requiredMaterials || [],
      requiredTools: result.requiredTools || [],
      instructions: result.instructions || [],
      environmentalImpact: result.environmentalImpact || {
        materialsRecycled: 0,
        moneySaved: 0,
        carbonFootprintReduction: 0
      }
    };
  } catch (error) {
    console.error("Error generating project from idea:", error);
    return {
      name: "Errore nella creazione del progetto",
      description: "Si è verificato un errore durante la generazione del progetto. Riprova più tardi.",
      difficulty: "Medio",
      estimatedTime: 0,
      timeUnit: "ore",
      requiredMaterials: [],
      requiredTools: [],
      instructions: ["Riprova più tardi."],
      environmentalImpact: {
        materialsRecycled: 0,
        moneySaved: 0,
        carbonFootprintReduction: 0
      }
    };
  }
}

// Function to analyze company material for recycling
export async function analyzeCompanyMaterial(material: any, quantity: number): Promise<any> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert in industrial recycling and material reuse for businesses. Analyze business waste materials and provide detailed recycling recommendations with environmental impact calculations."
        },
        {
          role: "user",
          content: `Analyze this business waste material: ${JSON.stringify(material)} with quantity ${quantity} ${material.unit}. Provide detailed information on potential reuse in upcycling projects, environmental impact if recycled vs. disposed, and logistics recommendations for collection.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return {
      recommendations: result.recommendations || [],
      potentialProjects: result.potentialProjects || [],
      environmentalImpact: result.environmentalImpact || {
        wasteReduction: 0,
        carbonSavings: 0,
        energySavings: 0
      },
      logisticsRecommendations: result.logisticsRecommendations || []
    };
  } catch (error) {
    console.error("Error analyzing company material:", error);
    return {
      recommendations: [],
      potentialProjects: [],
      environmentalImpact: {
        wasteReduction: 0,
        carbonSavings: 0,
        energySavings: 0
      },
      logisticsRecommendations: []
    };
  }
}

// Function to generate social media content for project sharing
export async function generateSocialContent(project: any, milestone: string): Promise<any> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a social media expert specializing in environmental and DIY content. Create engaging social media posts for eco-friendly projects with appropriate hashtags and calls to action."
        },
        {
          role: "user",
          content: `Create social media content for this upcycling project: ${JSON.stringify(project)}. This post is for the ${milestone} milestone. Include a catchy caption, relevant hashtags, and environmental impact stats.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return {
      caption: result.caption || "",
      hashtags: result.hashtags || [],
      environmentalStats: result.environmentalStats || {},
      platforms: result.platforms || {}
    };
  } catch (error) {
    console.error("Error generating social content:", error);
    return {
      caption: "",
      hashtags: [],
      environmentalStats: {},
      platforms: {}
    };
  }
}

// Function to learn from external project sources
export async function learnFromExternalProject(projectUrl: string): Promise<boolean> {
  try {
    // Extract domain to identify source
    const domain = new URL(projectUrl).hostname;
    
    // First, fetch and extract content from the URL
    const response = await axios.get(projectUrl);
    const content = response.data;
    
    // Use OpenAI to extract relevant information from the page
    const extractionResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert in upcycling and DIY projects. Extract structured information from the provided content about recycling/upcycling projects."
        },
        {
          role: "user",
          content: `Extract all relevant information about the upcycling/recycling project from this content: ${content.substring(0, 15000)}... Include project name, materials needed, tools required, step-by-step instructions, difficulty level, time required, and environmental impact.`
        }
      ],
      response_format: { type: "json_object" }
    });
    
    const extractedData = JSON.parse(extractionResponse.choices[0].message.content);
    
    // Store the learned information
    const fileName = path.join(KNOWLEDGE_DIR, `learned_${Date.now()}.json`);
    fs.writeFileSync(fileName, JSON.stringify({
      source: projectUrl,
      domain,
      extractedAt: new Date().toISOString(),
      data: extractedData
    }, null, 2));
    
    console.log(`Learned and stored information from ${projectUrl}`);
    return true;
  } catch (error) {
    console.error(`Failed to learn from ${projectUrl}:`, error);
    return false;
  }
}

// Function to search for project ideas from external sources
export async function searchExternalProjects(keywords: string[], source: string = 'all'): Promise<any[]> {
  try {
    const cacheKey = `${source}_${keywords.join('_')}`;
    
    // Check cache first
    if (apiCache.has(cacheKey)) {
      const cachedData = apiCache.get(cacheKey);
      if (Date.now() - cachedData.timestamp < CACHE_EXPIRY) {
        return cachedData.data;
      }
    }
    
    const results: any[] = [];
    const query = keywords.join(' ');
    
    if (source === 'all' || source === 'instructables') {
      try {
        const url = `${externalAPIs.instructables.baseUrl}${externalAPIs.instructables.search}${encodeURIComponent(query)}`;
        const response = await axios.get(url);
        if (response.data && response.data.items) {
          results.push(...response.data.items.map((item: any) => ({
            source: 'instructables',
            title: item.title,
            description: item.description,
            url: item.url,
            imageUrl: item.cover_image,
            author: item.author,
            category: item.category
          })));
        }
      } catch (err) {
        console.error('Error fetching from Instructables:', err);
      }
    }
    
    // Store in cache
    apiCache.set(cacheKey, { 
      timestamp: Date.now(),
      data: results
    });
    
    return results;
  } catch (error) {
    console.error("Error searching external projects:", error);
    return [];
  }
}

// Function to generate project ideas using AI combined with external references
export async function generateEnhancedProjectIdeas(materials: string[]): Promise<AIProjectSuggestion[]> {
  try {
    // First search for external references related to the materials
    const externalData = await searchExternalProjects(materials);
    
    // Read from the knowledge database
    const knowledgeFiles = fs.readdirSync(KNOWLEDGE_DIR);
    const learnedData: any[] = [];
    
    for (const file of knowledgeFiles.slice(0, 5)) { // Limit to 5 files to avoid context size issues
      const filePath = path.join(KNOWLEDGE_DIR, file);
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        learnedData.push(JSON.parse(fileContent));
      } catch (err) {
        console.error(`Error reading knowledge file ${file}:`, err);
      }
    }
    
    // Format external data for the prompt
    const externalReferences = externalData.slice(0, 3).map(item => 
      `Project: "${item.title}" from ${item.source} - ${item.description}`
    ).join('\n\n');
    
    // Format learned data for the prompt
    const learnedReferences = learnedData.map(item => 
      `Learned Project: "${item.data.projectName}" from ${item.source} - ${item.data.description?.substring(0, 200)}`
    ).join('\n\n');
    
    // Combine with AI generation
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert in creative upcycling and DIY projects with access to a vast knowledge of recycling projects.
          
External References:
${externalReferences}

Knowledge Database:
${learnedReferences}

Using the above references as inspiration, generate detailed, practical and eco-friendly project ideas using the provided materials. Focus on sustainable designs that are achievable for hobby crafters. Incorporate techniques, approaches, and creative elements from the reference projects.`
        },
        {
          role: "user",
          content: `I have the following materials available: ${materials.join(", ")}. 
Please suggest 3 upcycling projects I could create with these materials. 
Provide detailed instructions, required tools, environmental impact and difficulty level for each project. 
Make these projects innovative and inspired by the reference material while being original.
Respond with structured JSON data only.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result.projects || [];
  } catch (error) {
    console.error("Error generating enhanced project ideas:", error);
    return [];
  }
}

// Function to generate images for projects based on descriptions
export async function generateProjectImage(projectDescription: string, stage: string = 'final'): Promise<string> {
  try {
    // Create a detailed, artistically rich prompt for the image generation
    const stageDescription = stage === 'final' 
      ? 'progetto completato, mostrato in un contesto reale di utilizzo' 
      : `progetto nella fase di ${stage}, mostrando i dettagli del processo di costruzione`;
    
    const styleDescriptions = [
      "stile fotografico professionale ad alta risoluzione",
      "stile da rivista di design contemporaneo",
      "fotografia artistica con illuminazione drammatica",
      "stile documentaristico con attenzione ai dettagli tecnici",
      "stile editoriale da pubblicazione di design sostenibile"
    ];
    
    const selectedStyle = styleDescriptions[Math.floor(Math.random() * styleDescriptions.length)];
    
    const backgroundDescriptions = [
      "ambiente naturale all'aperto con elementi verdi",
      "studio fotografico minimalista con illuminazione professionale",
      "ambiente domestico contemporaneo e luminoso",
      "spazio di lavoro creativo con strumenti e materiali visibili",
      "contesto urbano moderno con elementi architettonici"
    ];
    
    const selectedBackground = backgroundDescriptions[Math.floor(Math.random() * backgroundDescriptions.length)];
    
    // Compose la descrizione artistica
    const artisticDescription = `un'opera d'arte sostenibile che trasforma materiali riciclati in un design funzionale e sorprendente`;
    
    // Compose la prompt finale
    const prompt = `Crea un'immagine dettagliata e artistica di ${artisticDescription} per il seguente progetto di upcycling: "${projectDescription}".

Questo deve essere un ${stageDescription}.

L'immagine deve:
- Mostrare chiaramente i materiali riciclati utilizzati e la loro trasformazione creativa
- Evidenziare i dettagli tecnici della costruzione e le finiture
- Trasmettere una sensazione di design sofisticato e alta qualità
- Comunicare visivamente l'aspetto sostenibile e eco-friendly del progetto
- Presentare il progetto in un ${selectedBackground}

Stile visivo: ${selectedStyle}
Assicurati che l'immagine abbia una composizione bilanciata, colori vibranti ma naturali, e un'illuminazione che esalti la tridimensionalità e la texture dei materiali.

IMPORTANTE: Non includere testo, annotazioni, loghi o watermark nell'immagine. Concentrati esclusivamente sulla rappresentazione visiva del progetto.`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "natural",
      response_format: "b64_json"
    });

    if (response.data && response.data.length > 0 && response.data[0].b64_json) {
      return response.data[0].b64_json;
    }
    return '';
  } catch (error) {
    console.error("Error generating project image:", error);
    return '';
  }
}

// Function to create community event suggestions based on materials and participants
export async function generateCommunityEventIdeas(materials: string[], participants: number): Promise<any[]> {
  try {
    // Gather any existing successful community events from the knowledge base
    const knowledgeFiles = fs.readdirSync(KNOWLEDGE_DIR);
    const communityEvents: any[] = [];
    
    for (const file of knowledgeFiles) {
      if (file.includes('community_event')) {
        const filePath = path.join(KNOWLEDGE_DIR, file);
        try {
          const fileContent = fs.readFileSync(filePath, 'utf8');
          communityEvents.push(JSON.parse(fileContent));
        } catch (err) {
          console.error(`Error reading community event file ${file}:`, err);
        }
      }
    }
    
    // Format learned data for the prompt
    const eventReferences = communityEvents.map(event => 
      `Past Event: "${event.title}" with ${event.participants} participants - ${event.description?.substring(0, 150)}`
    ).join('\n\n');
    
    // Generate event ideas
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Sei un innovativo curatore di eventi comunitari e ambientali di fama internazionale, noto per la capacità di creare esperienze trasformative e memorabili. Le tue iniziative non sono semplici eventi, ma vere e proprie installazioni artistiche partecipative che:

1. Uniscono arte, scienza, tecnologia e sostenibilità in modo sorprendente
2. Creano potenti metafore visive attraverso la partecipazione collettiva
3. Trasformano materiali di scarto in spettacolari opere d'arte comunitarie
4. Generano esperienze multisensoriali ed emotive profonde
5. Lasciano un impatto duraturo sulla comunità e sull'ambiente

I tuoi eventi sono caratterizzati da:
- Strutture narrative complesse con introduzione, sviluppo e conclusione memorabile
- Metodologie di facilitazione innovative che attivano tutti i partecipanti
- Utilizzo creativo e inaspettato di materiali comuni in modalità sorprendenti
- Integrazione di tecnologia appropriata per amplificare l'impatto
- Documentazione strategica per massimizzare la diffusione del messaggio

Le tue iniziative richiedono:
- Preparazione dettagliata e logistica precisa
- Istruzioni chiare per i facilitatori divise in fasi progressive
- Utilizzo di MOLTI materiali diversi (almeno 10-15 tipi differenti)
- Coinvolgimento di esperti di vari settori
- Strategie di engagement multilivello per diverse tipologie di partecipanti

Past Successful Events:
${eventReferences}

Basandoti su questi eventi precedenti come ispirazione, crea esperienze comunitarie innovative e trasformative incentrate sul riciclo creativo e la sostenibilità.`
        },
        {
          role: "user",
          content: `Voglio organizzare un evento comunitario veramente straordinario con circa ${participants} partecipanti.
Abbiamo a disposizione i seguenti materiali: ${materials.join(", ")}.

Suggerisci 3 diverse idee per eventi comunitari spettacolari che funzionerebbero bene con questo numero di partecipanti e questi materiali, ma integra anche MOLTI altri materiali complementari che potrebbero essere facilmente reperibili.

Per ciascuna idea, includi:

1. Titolo evocativo dell'evento con un sottotitolo poetico e provocatorio
2. Descrizione dettagliata del concetto artistico e filosofico dell'evento
3. Durata complessiva e programma dettagliato suddiviso in fasi con tempistiche precise
4. Elenco COMPLETO dei materiali necessari (includi quelli già disponibili ma aggiungine molti altri complementari) con quantità specifiche e modalità creative di utilizzo
5. Guida dettagliata per i facilitatori con almeno 15-20 passaggi progressivi
6. Metriche di impatto ambientale sofisticate da monitorare (con metodologie di calcolo)
7. Strategie di coinvolgimento multilivello per diverse tipologie di partecipanti
8. Piano di comunicazione pre e post evento con elementi narrativi e visivi
9. Potenziali partnership strategiche con esperti, artisti o istituzioni
10. Attività di follow-up per prolungare l'impatto nel tempo
11. Budget indicativo e potenziali fonti di finanziamento
12. Rischi potenziali e strategie di mitigazione

Rispondi con una struttura JSON dettagliata per ciascuno dei tre eventi proposti.

Respond with structured JSON data only.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    
    // Store the generated events in the knowledge base
    const fileName = path.join(KNOWLEDGE_DIR, `community_event_ideas_${Date.now()}.json`);
    fs.writeFileSync(fileName, JSON.stringify({
      generatedAt: new Date().toISOString(),
      materials,
      participants,
      events: result.events || []
    }, null, 2));
    
    return result.events || [];
  } catch (error) {
    console.error("Error generating community event ideas:", error);
    return [];
  }
}

// Function to learn from user feedback and improve future suggestions
export async function learnFromUserFeedback(projectId: number, feedback: {
  rating: number;
  comments: string;
  successAreas: string[];
  improvementAreas: string[];
  photoUrls?: string[];
}): Promise<boolean> {
  try {
    const fileName = path.join(KNOWLEDGE_DIR, `feedback_${projectId}_${Date.now()}.json`);
    fs.writeFileSync(fileName, JSON.stringify({
      projectId,
      recordedAt: new Date().toISOString(),
      ...feedback
    }, null, 2));
    
    // Use OpenAI to extract learning points from the feedback
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI learning system that analyzes feedback on upcycling projects to identify patterns and improvement areas."
        },
        {
          role: "user",
          content: `Analyze this feedback on project #${projectId} and extract key learning points that could improve future project suggestions:
Rating: ${feedback.rating}/5
Comments: ${feedback.comments}
Success Areas: ${feedback.successAreas.join(', ')}
Improvement Areas: ${feedback.improvementAreas.join(', ')}
`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    
    // Store the learning points
    const learningFileName = path.join(KNOWLEDGE_DIR, `learnings_${Date.now()}.json`);
    fs.writeFileSync(learningFileName, JSON.stringify({
      source: `project_${projectId}`,
      extractedAt: new Date().toISOString(),
      learningPoints: result.learningPoints || [],
      improvements: result.improvements || [],
      successPatterns: result.successPatterns || []
    }, null, 2));
    
    return true;
  } catch (error) {
    console.error("Error learning from user feedback:", error);
    return false;
  }
}

// Funzione per gestire le conversazioni in stile ChatGPT con l'utente
interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ConversationResponse {
  response: string;
  generatedProject?: any;
}

export async function handleChatConversation(messages: ChatMessage[], availableMaterials: string[]): Promise<ConversationResponse> {
  try {
    // Aggiungiamo un potente messaggio di sistema per guidare l'AI
    const systemMessage: ChatMessage = {
      role: "system",
      content: `Sei un maestro progettista ecologico e creativo specializzato nell'upcycling. Hai una conoscenza enciclopedica di tutti i possibili materiali di scarto e del loro potenziale creativo. Il tuo compito è assistere l'utente nella creazione di progetti di riciclo creativo attraverso una conversazione naturale e informativa.

IMPORTANTE:
1. Rispondi sempre in italiano usando un linguaggio conversazionale ma esperto.
2. Comunica in modo immersivo e coinvolgente, proprio come farebbe un esperto designer di progetti di upcycling.
3. Fai domande per guidare la conversazione verso dettagli più specifici dei progetti.
4. Suggerisci sempre idee creative e innovative che utilizzino i materiali disponibili.
5. L'utente ha accesso ai seguenti materiali: ${availableMaterials.join(", ")}.
6. Se possibile, suggerisci SEMPRE di integrare altri materiali complementari rispetto a quelli elencati.
7. Quando suggerisci un progetto, includilo in formato elaborato con:
   - Nome creativo
   - Descrizione dettagliata
   - Livello di difficoltà
   - Tempo di realizzazione
   - Elenco preciso di materiali necessari (sia quelli disponibili che quelli aggiuntivi)
   - Strumenti necessari
   - Passaggi molto dettagliati (15-20 step)
   - Impatto ambientale stimato
8. Adatta i tuoi suggerimenti in base alla complessità richiesta dall'utente (facile, medio, avanzato).
9. Se l'utente chiede specificatamente di creare un progetto completo, formatta la risposta in modo dettagliato e specifico, evidenziando quando il progetto è pronto per essere salvato.
10. Se un'idea è troppo semplice, suggerisci come renderla più complessa, artistica o funzionale.

Comportati come un vero artista del riciclo, con idee sorprendenti ed entusiasmo per il potenziale creativo di tutti i materiali di scarto.`
    };

    // Prepariamo il contesto della conversazione
    const conversationContext: ChatMessage[] = [systemMessage];
    
    // Aggiungiamo i messaggi precedenti
    conversationContext.push(...messages);

    // Analizziamo se potrebbe essere una richiesta di creazione di progetto
    const lastUserMessage = messages.filter(m => m.role === "user").pop();
    const isProjectCreationRequest = lastUserMessage && (
      lastUserMessage.content.toLowerCase().includes("crea un progetto") ||
      lastUserMessage.content.toLowerCase().includes("salva questo progetto") ||
      lastUserMessage.content.toLowerCase().includes("voglio realizzare") ||
      lastUserMessage.content.toLowerCase().includes("progetto completo") ||
      lastUserMessage.content.toLowerCase().includes("genera il progetto")
    );

    // Inviamo la conversazione all'AI
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: conversationContext,
      temperature: 0.7,
      max_tokens: 2000
    });

    const aiResponseText = response.choices[0].message.content || "Mi dispiace, non sono riuscito a generare una risposta.";
    
    // Verifichiamo se dobbiamo generare un progetto completo
    if (isProjectCreationRequest) {
      try {
        // Estraiamo il progetto dal testo della conversazione
        const projectExtractionResponse = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `Sei un esperto nel formato dati dei progetti di upcycling. Analizza la seguente conversazione e il progetto descritto, ed estrai i dettagli in un formato strutturato JSON.

Estrai questi campi:
- name: il nome del progetto
- description: descrizione dettagliata
- difficulty: il livello di difficoltà (Facile, Medio, Avanzato)
- estimatedTime: numero che indica il tempo stimato
- timeUnit: unità di tempo (ore, giorni)
- requiredMaterials: array di oggetti con { name, quantity, unit }
- requiredTools: array di oggetti con { name, link (opzionale) }
- instructions: array di stringhe con i passaggi dettagliati
- environmentalImpact: oggetto con { materialsRecycled (in kg), moneySaved (in EUR), carbonFootprintReduction (in kg CO2e) }

Non inventare dettagli se non sono presenti nella conversazione. Se alcuni dettagli non sono chiari, utilizzare valori ragionevoli basati sul contesto.`
            },
            {
              role: "user",
              content: `Ecco la conversazione che include un progetto di upcycling. Estrai i dettagli del progetto in formato JSON strutturato:\n\n${messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n')}\n\nUltima risposta AI: ${aiResponseText}`
            }
          ],
          response_format: { type: "json_object" }
        });
        
        const generatedProject = JSON.parse(projectExtractionResponse.choices[0].message.content);
        
        try {
          // Genera un'immagine per il progetto creato
          console.log("Generating image for project:", generatedProject.name);
          const projectImage = await generateProjectImage(generatedProject.name, 'final');
          
          if (projectImage) {
            // Aggiungi l'immagine al progetto generato
            generatedProject.imageBase64 = projectImage;
            generatedProject.imageUrl = `data:image/png;base64,${projectImage}`;
            
            console.log("Project image generated successfully");
          }
        } catch (imgError) {
          console.error("Error generating project image:", imgError);
          // Continuiamo anche se la generazione dell'immagine fallisce
        }
        
        return {
          response: aiResponseText,
          generatedProject
        };
      } catch (error) {
        console.error("Error extracting project from conversation:", error);
        return { response: aiResponseText };
      }
    }
    
    return { response: aiResponseText };
  } catch (error: any) {
    console.error("Error handling chat conversation:", error);
    
    // Specifico messaggio per errori di quota OpenAI
    if (error && 
        (error.status === 429 || 
         (error.error && error.error.type === 'insufficient_quota') || 
         (error.message && error.message.includes('quota')))) {
      return { 
        response: "Mi dispiace, il servizio AI ha raggiunto il limite di utilizzo. Per informazioni dettagliate, contatta l'amministratore del sistema. Riprova più tardi quando la quota sarà disponibile."
      };
    } else if (error && (error.status === 500 || error.status === 503)) {
      // Errori di servizio
      return { 
        response: "Mi dispiace, il servizio OpenAI è temporaneamente non disponibile. Riprova tra qualche minuto."
      };
    } else {
      // Messaggio generico per altri errori
      return { 
        response: "Mi dispiace, si è verificato un errore durante l'elaborazione della tua richiesta. Riprova tra qualche istante."
      };
    }
  }
}

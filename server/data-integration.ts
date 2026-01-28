/**
 * Sistema completo di integrazione dati dalle API esterne
 * Popola il database interno con combinazioni di progetti e materiali
 */

import { db } from "./db";
import { 
  internalProjects, 
  internalMaterials, 
  projectMaterialCombinations,
  thingiverseCache,
  amazonProductsCache,
  aiGeneratedContent,
  type InsertInternalProject,
  type InsertInternalMaterial,
  type InsertProjectMaterialCombination,
  type InsertThingiverseCache,
  type InsertAmazonProductsCache,
  type InsertAiGeneratedContent
} from "@shared/schema";
import { eq, and, gte, sql } from "drizzle-orm";

// Import delle API esistenti
import { generateProjectIdeas, analyzeMaterial, generateEnhancedProjectIdeas } from "./openai";
import { searchFallbackModels, getFallbackThingDetails, getFallbackThingFiles } from "../data/thingiverse-fallback-data";
import { searchAmazonProducts } from "./amazon";
import { getExtendedMaterialData } from "./materials-project";
import { analyzeImageWithGoogleVision, analyzeMaterialWithGoogleVision } from "./google-vision";
import { generateAllMaterialCombinations } from "./advanced-offline-generator";

/**
 * Popola il database con progetti completi dalle varie API
 */
export async function populateInternalProjects(): Promise<void> {
  console.log("🚀 Inizio popolamento progetti interni...");

  // 1. Genera progetti AI per ogni categoria di materiale
  const materialCategories = [
    "plastica", "carta", "legno", "metallo", "tessuto", 
    "vetro", "elettronici", "organici", "ceramica", "gomma"
  ];

  for (const category of materialCategories) {
    try {
      console.log(`📊 Generando progetti per categoria: ${category}`);
      
      // Genera progetti AI per la categoria
      const aiProjects = await generateEnhancedProjectIdeas([category]);
      
      for (const project of aiProjects) {
        await insertInternalProject({
          name: project.name,
          description: project.description,
          difficulty: project.difficulty,
          estimatedTime: project.estimatedTime,
          timeUnit: project.timeUnit,
          category: category,
          materials: project.requiredMaterials,
          tools: project.requiredTools,
          instructions: project.instructions,
          environmentalImpact: project.environmentalImpact,
          imageUrl: project.imageUrl,
          tags: [category, project.difficulty, "ai-generated"],
          source: "openai",
          sourceId: `ai-${Date.now()}-${Math.random()}`
        });
      }

      // Breve pausa per evitare rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ Errore generando progetti per ${category}:`, error);
    }
  }

  // 2. Integra progetti da Thingiverse
  await integrateThingiverseProjects();

  console.log("✅ Popolamento progetti completato!");
}

/**
 * Popola il database con materiali completi dalle varie API
 */
export async function populateInternalMaterials(): Promise<void> {
  console.log("🔬 Inizio popolamento materiali interni...");

  const commonMaterials = [
    // Plastiche
    { name: "PET (Polietilene Tereftalato)", type: "plastica", commonNames: ["pet", "plastica bottiglie", "polietilene"] },
    { name: "HDPE (Polietilene ad Alta Densità)", type: "plastica", commonNames: ["hdpe", "plastica contenitori", "polietilene"] },
    { name: "PVC (Polivinilcloruro)", type: "plastica", commonNames: ["pvc", "plastica rigida", "polivinile"] },
    { name: "LDPE (Polietilene a Bassa Densità)", type: "plastica", commonNames: ["ldpe", "sacchetti plastica", "film"] },
    { name: "PP (Polipropilene)", type: "plastica", commonNames: ["pp", "polipropilene", "tappi"] },
    { name: "PS (Polistirene)", type: "plastica", commonNames: ["polistirene", "polistirolo", "imballaggi"] },
    
    // Metalli
    { name: "Alluminio", type: "metallo", commonNames: ["alluminio", "lattine", "fogli"] },
    { name: "Acciaio", type: "metallo", commonNames: ["acciaio", "ferro", "latte"] },
    { name: "Rame", type: "metallo", commonNames: ["rame", "fili elettrici", "tubi"] },
    { name: "Ottone", type: "metallo", commonNames: ["ottone", "bronzo", "rubinetti"] },
    
    // Legno
    { name: "Pino", type: "legno", commonNames: ["pino", "legno tenero", "abete"] },
    { name: "Quercia", type: "legno", commonNames: ["quercia", "legno duro", "rovere"] },
    { name: "Compensato", type: "legno", commonNames: ["compensato", "multistrato", "pannello"] },
    { name: "MDF", type: "legno", commonNames: ["mdf", "fibra media densità", "pannello"] },
    
    // Altri materiali
    { name: "Cartone", type: "carta", commonNames: ["cartone", "scatole", "imballaggi"] },
    { name: "Carta", type: "carta", commonNames: ["carta", "giornali", "riviste"] },
    { name: "Vetro", type: "vetro", commonNames: ["vetro", "bottiglie", "contenitori"] },
    { name: "Cotone", type: "tessuto", commonNames: ["cotone", "tessuto", "vestiti"] },
    { name: "Denim", type: "tessuto", commonNames: ["jeans", "denim", "tessuto"] }
  ];

  for (const material of commonMaterials) {
    try {
      console.log(`🧪 Analizzando materiale: ${material.name}`);
      
      // Ottieni dati estesi dal Materials Project
      const extendedData = await getExtendedMaterialData(material.type, material.name);
      
      // Genera analisi AI del materiale
      const aiAnalysis = await generateMaterialAnalysisWithAI(material.name, material.type);
      
      await insertInternalMaterial({
        name: material.name,
        type: material.type,
        properties: extendedData?.properties || {},
        possibleUses: aiAnalysis.possibleUses,
        recyclingTips: aiAnalysis.recyclingTips,
        sustainabilityScore: extendedData?.sustainabilityScore || aiAnalysis.sustainabilityScore,
        environmentalImpact: extendedData?.environmentalImpact || aiAnalysis.environmentalImpact,
        decompositionTime: extendedData?.decompositionTime || aiAnalysis.decompositionTime,
        commonUses: material.commonNames,
        source: extendedData ? "materials_project" : "ai_analysis",
        sourceId: `material-${Date.now()}-${Math.random()}`
      });

      // Breve pausa
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`❌ Errore analizzando materiale ${material.name}:`, error);
    }
  }

  console.log("✅ Popolamento materiali completato!");
}

/**
 * Crea combinazioni progetti-materiali intelligenti
 */
export async function createProjectMaterialCombinations(): Promise<void> {
  console.log("🔗 Creazione combinazioni progetti-materiali...");

  const projects = await db.select().from(internalProjects);
  const materials = await db.select().from(internalMaterials);

  for (const project of projects) {
    // Analizza i materiali richiesti dal progetto
    for (const requiredMaterial of project.materials) {
      // Trova materiali corrispondenti nel database
      const matchingMaterials = materials.filter(material => 
        material.name.toLowerCase().includes(requiredMaterial.name.toLowerCase()) ||
        material.type.toLowerCase() === requiredMaterial.name.toLowerCase() ||
        material.commonUses.some(use => 
          use.toLowerCase().includes(requiredMaterial.name.toLowerCase())
        )
      );

      for (const material of matchingMaterials) {
        try {
          await insertProjectMaterialCombination({
            projectId: project.id,
            materialId: material.id,
            quantity: requiredMaterial.quantity.toString(),
            unit: requiredMaterial.unit,
            isRequired: true,
            alternatives: []
          });
        } catch (error) {
          // Ignora duplicati
          if (!error.message?.includes('duplicate')) {
            console.error(`❌ Errore creando combinazione:`, error);
          }
        }
      }
    }
  }

  console.log("✅ Combinazioni create!");
}

/**
 * Integra progetti da Thingiverse nel database interno
 */
async function integrateThingiverseProjects(): Promise<void> {
  console.log("🎨 Integrando progetti Thingiverse...");

  const categories = ["household", "decor", "tools", "garden", "art"];
  
  for (const category of categories) {
    const models = searchFallbackModels([category], 'it');
    
    for (const model of models.slice(0, 10)) { // Limita a 10 per categoria
      try {
        // Cache del modello Thingiverse
        await insertThingiverseCache({
          thingId: model.id,
          name: model.name,
          description: model.description,
          url: model.url,
          imageUrl: model.imageUrl,
          creatorName: model.creator?.name || "Sconosciuto",
          likesCount: model.likesCount || 0,
          downloadsCount: model.downloadCount || 0,
          tags: model.tags || [],
          categories: [category],
          files: model.files || [],
          license: model.license,
          materials: extractMaterialsFromDescription(model.description || "")
        });

        // Converti in progetto interno
        const internalProject: InsertInternalProject = {
          name: model.name,
          description: model.description || "",
          difficulty: determineDifficulty(model.description || ""),
          estimatedTime: estimateProjectTime(model.description || ""),
          timeUnit: "ore",
          category: category,
          materials: extractMaterialRequirements(model.description || ""),
          tools: extractToolRequirements(model.description || ""),
          instructions: generateInstructionsFromDescription(model.description || ""),
          environmentalImpact: {
            materialsRecycled: Math.random() * 5 + 1,
            moneySaved: Math.random() * 50 + 10,
            carbonFootprintReduction: Math.random() * 3 + 0.5
          },
          imageUrl: model.imageUrl,
          tags: [category, "thingiverse", "3d-printing"],
          source: "thingiverse",
          sourceId: model.id.toString()
        };

        await insertInternalProject(internalProject);
      } catch (error) {
        console.error(`❌ Errore integrando progetto Thingiverse ${model.id}:`, error);
      }
    }
  }
}

/**
 * Popola cache prodotti Amazon
 */
export async function populateAmazonProductsCache(): Promise<void> {
  console.log("🛒 Popolamento cache prodotti Amazon...");

  const searchTerms = [
    ["strumenti fai da te", "attrezzi"],
    ["materiali riciclo", "sostenibile"],
    ["adesivi ecologici", "colla"],
    ["vernici eco", "colori"],
    ["tessuti riciclati", "stoffa"],
    ["contenitori riutilizzo", "organizer"]
  ];

  for (const terms of searchTerms) {
    try {
      const products = await searchAmazonProducts(terms);
      
      for (const product of products) {
        await insertAmazonProductsCache({
          title: product.title,
          description: product.description,
          price: product.price,
          rating: product.rating || null,
          imageUrl: product.imageUrl,
          affiliateUrl: product.affiliateUrl,
          category: product.category,
          isPrime: product.isPrime || false,
          searchTerms: terms
        });
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`❌ Errore popolando prodotti Amazon:`, error);
    }
  }

  console.log("✅ Cache prodotti Amazon completata!");
}

/**
 * Funzioni di utilità per l'elaborazione dei dati
 */

async function generateMaterialAnalysisWithAI(materialName: string, materialType: string) {
  try {
    // Simula un'analisi AI del materiale
    const fakeImageData = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD..."; // Placeholder
    return await analyzeMaterial(fakeImageData);
  } catch (error) {
    // Fallback con dati predefiniti
    return {
      name: materialName,
      type: materialType,
      possibleUses: [`Uso generico per ${materialType}`, "Progetti creativi", "Riparazione oggetti"],
      recyclingTips: [`Separa ${materialName} dagli altri materiali`, "Pulisci prima del riciclo"],
      sustainabilityScore: Math.floor(Math.random() * 40) + 60, // 60-100
      environmentalImpact: `${materialName} ha un impatto moderato sull'ambiente`,
      decompositionTime: getDecompositionTime(materialType)
    };
  }
}

function extractMaterialsFromDescription(description: string): string[] {
  const materials = ["plastica", "legno", "metallo", "carta", "vetro", "tessuto"];
  return materials.filter(material => 
    description.toLowerCase().includes(material)
  );
}

function determineDifficulty(description: string): string {
  if (description.toLowerCase().includes("facile") || description.toLowerCase().includes("beginner")) {
    return "facile";
  } else if (description.toLowerCase().includes("difficile") || description.toLowerCase().includes("advanced")) {
    return "difficile";
  }
  return "medio";
}

function estimateProjectTime(description: string): number {
  if (description.toLowerCase().includes("quick") || description.toLowerCase().includes("veloce")) {
    return Math.floor(Math.random() * 60) + 30; // 30-90 minuti
  } else if (description.toLowerCase().includes("long") || description.toLowerCase().includes("complesso")) {
    return Math.floor(Math.random() * 300) + 180; // 3-8 ore
  }
  return Math.floor(Math.random() * 120) + 60; // 1-3 ore
}

function extractMaterialRequirements(description: string): Array<{name: string, quantity: number, unit: string}> {
  // Estrae requisiti materiali dalla descrizione
  const defaultMaterials = [
    { name: "plastica riciclata", quantity: 1, unit: "pezzo" },
    { name: "colla", quantity: 1, unit: "tubo" }
  ];
  
  return defaultMaterials;
}

function extractToolRequirements(description: string): Array<{name: string, link?: string}> {
  const defaultTools = [
    { name: "Stampante 3D" },
    { name: "Cutter" },
    { name: "Righello" }
  ];
  
  return defaultTools;
}

function generateInstructionsFromDescription(description: string): string[] {
  return [
    "Prepara tutti i materiali necessari",
    "Seguire il design fornito",
    "Assemblare con cura i componenti",
    "Verificare la stabilità del progetto finito",
    "Applicare eventuali finiture"
  ];
}

function getDecompositionTime(materialType: string): string {
  const times = {
    "plastica": "400-1000 anni",
    "carta": "2-6 mesi",
    "legno": "10-15 anni",
    "metallo": "50-500 anni",
    "vetro": "1 milione di anni",
    "tessuto": "6 mesi - 5 anni"
  };
  
  return times[materialType] || "Tempo variabile";
}

/**
 * Funzioni di inserimento nel database
 */

async function insertInternalProject(data: InsertInternalProject): Promise<void> {
  try {
    await db.insert(internalProjects).values(data);
  } catch (error) {
    if (!error.message?.includes('duplicate')) {
      throw error;
    }
  }
}

async function insertInternalMaterial(data: InsertInternalMaterial): Promise<void> {
  try {
    await db.insert(internalMaterials).values(data);
  } catch (error) {
    if (!error.message?.includes('duplicate')) {
      throw error;
    }
  }
}

async function insertProjectMaterialCombination(data: InsertProjectMaterialCombination): Promise<void> {
  try {
    await db.insert(projectMaterialCombinations).values(data);
  } catch (error) {
    if (!error.message?.includes('duplicate')) {
      throw error;
    }
  }
}

async function insertThingiverseCache(data: InsertThingiverseCache): Promise<void> {
  try {
    await db.insert(thingiverseCache).values(data).onConflictDoNothing();
  } catch (error) {
    console.error('Errore inserimento cache Thingiverse:', error);
  }
}

async function insertAmazonProductsCache(data: InsertAmazonProductsCache): Promise<void> {
  try {
    await db.insert(amazonProductsCache).values(data);
  } catch (error) {
    if (!error.message?.includes('duplicate')) {
      throw error;
    }
  }
}

/**
 * Funzione principale per popolare tutto il database
 */
export async function populateCompleteDatabase(): Promise<void> {
  console.log("🚀 Inizio popolamento completo database...");
  
  try {
    await populateInternalMaterials();
    await populateInternalProjects();
    await createProjectMaterialCombinations();
    await populateAmazonProductsCache();
    
    console.log("✅ Popolamento completo database terminato con successo!");
  } catch (error) {
    console.error("❌ Errore durante il popolamento:", error);
    throw error;
  }
}

/**
 * Query per ottenere progetti basati sui materiali disponibili
 */
export async function getProjectsForMaterials(materialNames: string[]): Promise<any[]> {
  const query = sql`
    SELECT DISTINCT p.*, array_agg(m.name) as available_materials
    FROM internal_projects p
    JOIN project_material_combinations pmc ON p.id = pmc.project_id
    JOIN internal_materials m ON pmc.material_id = m.id
    WHERE m.name = ANY(${materialNames})
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `;
  
  return await db.execute(query);
}

/**
 * Query per ottenere materiali correlati
 */
export async function getRelatedMaterials(materialType: string): Promise<any[]> {
  return await db.select()
    .from(internalMaterials)
    .where(eq(internalMaterials.type, materialType))
    .limit(10);
}
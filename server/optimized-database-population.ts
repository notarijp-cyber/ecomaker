/**
 * Sistema ottimizzato per popolamento database con massimale 7 materiali
 * Completa indipendenza da API esterne per riconoscimento camera
 */

import { db } from "./db";
import { internalProjects, internalMaterials, type InsertInternalProject, type InsertInternalMaterial } from "@shared/schema";
import { populateMaterialRecognitionDatabase } from "./material-recognition-database";

/**
 * Popola il database con progetti ottimizzati per combinazioni 1-7 materiali
 */
export async function populateOptimizedDatabase(): Promise<void> {
  console.log("🚀 Avvio popolamento database ottimizzato (Max 7 materiali)...");
  
  try {
    // 1. Popola database riconoscimento materiali per camera
    await populateMaterialRecognitionDatabase();
    console.log("✅ Database riconoscimento camera popolato");
    
    // 2. Popola materiali base
    await populateBaseMaterials();
    console.log("✅ Materiali base popolati");
    
    // 3. Genera progetti per combinazioni 1-7 materiali
    await generateProjectsForMaterialCombinations();
    console.log("✅ Progetti per combinazioni materiali generati");
    
    console.log("🎉 Database ottimizzato popolato con successo!");
    
  } catch (error) {
    console.error("❌ Errore popolamento database ottimizzato:", error);
    throw error;
  }
}

/**
 * Popola materiali base per tutte le categorie
 */
async function populateBaseMaterials(): Promise<void> {
  const baseMaterials: InsertInternalMaterial[] = [
    // PLASTICA
    {
      source: "internal_optimized",
      name: "Bottiglia PET",
      type: "plastica",
      description: "Bottiglia trasparente per bevande",
      category: "contenitore",
      sustainabilityScore: 70,
      recyclable: true,
      biodegradable: false,
      co2Footprint: 3.2,
      renewableSource: false,
      toxicity: "low",
      decompositionTime: "450-1000 anni",
      commonUses: ["contenitori", "vasi", "organizzazione"],
      possibleUses: ["Vaso per piante", "Contenitore organizzazione", "Irrigazione automatica"],
      recyclingTips: ["Rimuovi etichette", "Separa tappo", "Pulisci accuratamente"]
    },
    {
      source: "internal_optimized",
      name: "Contenitore HDPE",
      type: "plastica",
      description: "Flacone per detergenti",
      category: "contenitore",
      sustainabilityScore: 75,
      recyclable: true,
      biodegradable: false,
      co2Footprint: 2.8,
      renewableSource: false,
      toxicity: "low",
      decompositionTime: "450-1000 anni",
      commonUses: ["detergenti", "contenitori", "storage"],
      possibleUses: ["Innaffiatore", "Contenitore multi-uso", "Organizer garage"],
      recyclingTips: ["Svuota completamente", "Rimuovi etichette", "Separa componenti"]
    },
    
    // CARTA
    {
      source: "internal_optimized",
      name: "Cartone ondulato",
      type: "carta",
      description: "Scatole di imballaggio",
      category: "imballaggio",
      sustainabilityScore: 85,
      recyclable: true,
      biodegradable: true,
      co2Footprint: 1.2,
      renewableSource: true,
      toxicity: "none",
      decompositionTime: "2-6 mesi",
      commonUses: ["imballaggio", "trasporto", "protezione"],
      possibleUses: ["Organizer scrivania", "Casa per gatti", "Compostaggio"],
      recyclingTips: ["Rimuovi nastro adesivo", "Appiattisci scatole", "Mantieni asciutto"]
    },
    {
      source: "internal_optimized",
      name: "Giornali e riviste",
      type: "carta",
      description: "Pubblicazioni cartacee",
      category: "pubblicazione",
      sustainabilityScore: 80,
      recyclable: true,
      biodegradable: true,
      co2Footprint: 1.1,
      renewableSource: true,
      toxicity: "none",
      decompositionTime: "2-6 settimane",
      commonUses: ["lettura", "informazione", "imballaggio"],
      possibleUses: ["Carta regalo", "Protezione superfici", "Avviafuoco"],
      recyclingTips: ["Rimuovi plastificazioni", "Separa inserti plastici", "Mantieni pulito"]
    },
    
    // VETRO
    {
      source: "internal_optimized",
      name: "Bottiglia di vetro",
      type: "vetro",
      description: "Bottiglia per bevande",
      category: "contenitore",
      sustainabilityScore: 90,
      recyclable: true,
      biodegradable: false,
      co2Footprint: 0.8,
      renewableSource: false,
      toxicity: "none",
      decompositionTime: "4000+ anni",
      commonUses: ["bevande", "conservazione", "decorazione"],
      possibleUses: ["Vaso decorativo", "Lampada", "Contenitore cucina"],
      recyclingTips: ["Rimuovi tappi", "Separa per colore", "Pulisci residui"]
    },
    {
      source: "internal_optimized",
      name: "Barattolo di vetro",
      type: "vetro",
      description: "Contenitore per conserve",
      category: "contenitore",
      sustainabilityScore: 92,
      recyclable: true,
      biodegradable: false,
      co2Footprint: 0.7,
      renewableSource: false,
      toxicity: "none",
      decompositionTime: "4000+ anni",
      commonUses: ["conserve", "storage", "organizzazione"],
      possibleUses: ["Portacandele", "Organizer", "Contenitore alimenti"],
      recyclingTips: ["Rimuovi coperchio", "Pulisci etichette", "Controlla scheggiature"]
    },
    
    // METALLO
    {
      source: "internal_optimized",
      name: "Lattina alluminio",
      type: "metallo",
      description: "Lattina per bevande",
      category: "contenitore",
      sustainabilityScore: 88,
      recyclable: true,
      biodegradable: false,
      co2Footprint: 1.5,
      renewableSource: false,
      toxicity: "none",
      decompositionTime: "50-200 anni",
      commonUses: ["bevande", "conservazione", "packaging"],
      possibleUses: ["Vaso per piante", "Organizer", "Amplificatore smartphone"],
      recyclingTips: ["Svuota completamente", "Rimuovi linguetta", "Compatta per trasporto"]
    },
    {
      source: "internal_optimized",
      name: "Barattolo di latta",
      type: "metallo",
      description: "Contenitore per conserve",
      category: "contenitore",
      sustainabilityScore: 85,
      recyclable: true,
      biodegradable: false,
      co2Footprint: 1.8,
      renewableSource: false,
      toxicity: "none",
      decompositionTime: "50-200 anni",
      commonUses: ["conserve", "alimenti", "storage"],
      possibleUses: ["Portapenne", "Lampada", "Contenitore sementi"],
      recyclingTips: ["Rimuovi etichetta", "Pulisci residui", "Attenzione bordi taglienti"]
    },
    
    // LEGNO
    {
      source: "internal_optimized",
      name: "Pallet di legno",
      type: "legno",
      description: "Supporto per trasporti",
      category: "imballaggio",
      sustainabilityScore: 82,
      recyclable: true,
      biodegradable: true,
      co2Footprint: 0.5,
      renewableSource: true,
      toxicity: "low",
      decompositionTime: "1-3 anni",
      commonUses: ["trasporti", "supporto", "costruzione"],
      possibleUses: ["Tavolo", "Fioriera", "Libreria"],
      recyclingTips: ["Controlla trattamenti chimici", "Rimuovi chiodi", "Leviga superfici"]
    },
    {
      source: "internal_optimized",
      name: "Cassetta della frutta",
      type: "legno",
      description: "Contenitore in legno",
      category: "contenitore",
      sustainabilityScore: 88,
      recyclable: true,
      biodegradable: true,
      co2Footprint: 0.3,
      renewableSource: true,
      toxicity: "none",
      decompositionTime: "6 mesi-2 anni",
      commonUses: ["trasporto frutta", "organizzazione", "decorazione"],
      possibleUses: ["Organizer", "Fioriera", "Scaffale"],
      recyclingTips: ["Controlla condizioni legno", "Pulisci residui", "Carteggia se necessario"]
    },
    
    // TESSILE
    {
      source: "internal_optimized",
      name: "Maglietta di cotone",
      type: "tessile",
      description: "Indumento in cotone",
      category: "abbigliamento",
      sustainabilityScore: 75,
      recyclable: true,
      biodegradable: true,
      co2Footprint: 2.1,
      renewableSource: true,
      toxicity: "none",
      decompositionTime: "1-5 anni",
      commonUses: ["abbigliamento", "pulizia", "stracci"],
      possibleUses: ["Borsa riutilizzabile", "Stracci pulizia", "Imbottitura"],
      recyclingTips: ["Rimuovi bottoni", "Separa fibre", "Controlla macchie"]
    },
    {
      source: "internal_optimized",
      name: "Jeans",
      type: "tessile",
      description: "Pantaloni in denim",
      category: "abbigliamento",
      sustainabilityScore: 70,
      recyclable: true,
      biodegradable: true,
      co2Footprint: 3.5,
      renewableSource: true,
      toxicity: "low",
      decompositionTime: "10-12 anni",
      commonUses: ["abbigliamento", "isolamento", "riparazioni"],
      possibleUses: ["Grembiule", "Borsa resistente", "Isolante termico"],
      recyclingTips: ["Rimuovi hardware metallico", "Separa cuciture", "Controlla tinture"]
    }
  ];
  
  for (const material of baseMaterials) {
    try {
      await db.insert(internalMaterials).values(material).onConflictDoNothing();
    } catch (error) {
      console.error(`Errore inserimento materiale ${material.name}:`, error);
    }
  }
}

/**
 * Genera progetti per tutte le combinazioni di materiali 1-7
 */
async function generateProjectsForMaterialCombinations(): Promise<void> {
  const difficulties = ["facile", "medio", "difficile"];
  const categories = ["decorazione", "utilità", "giardino", "organizzazione", "arte", "mobili"];
  
  // Progetti per singolo materiale (1)
  const singleMaterialProjects: InsertInternalProject[] = [
    {
      name: "Vaso da Bottiglia PET",
      description: "Trasforma una bottiglia di plastica in un elegante vaso per piante",
      difficulty: "facile",
      estimatedTime: 15,
      timeUnit: "minuti",
      category: "giardino",
      materials: [{ name: "Bottiglia PET", quantity: 1, unit: "pezzo" }],
      tools: [{ name: "Forbici" }, { name: "Pennarello" }],
      instructions: [
        "Pulisci accuratamente la bottiglia",
        "Segna la linea di taglio a metà altezza",
        "Taglia con le forbici seguendo la linea",
        "Leviga i bordi per sicurezza",
        "Decora a piacimento"
      ],
      environmentalImpact: {
        materialsRecycled: 1,
        moneySaved: 5,
        carbonFootprintReduction: 0.5
      },
      imageUrl: null,
      tags: ["riciclo", "giardino", "facile"],
      source: "internal_optimized",
      sourceId: "single-1"
    },
    {
      name: "Organizer da Barattolo",
      description: "Crea un pratico organizer da scrivania usando un barattolo di vetro",
      difficulty: "facile",
      estimatedTime: 10,
      timeUnit: "minuti",
      category: "organizzazione",
      materials: [{ name: "Barattolo di vetro", quantity: 1, unit: "pezzo" }],
      tools: [{ name: "Panno per pulizia" }],
      instructions: [
        "Rimuovi etichette dal barattolo",
        "Pulisci accuratamente interno ed esterno",
        "Asciuga completamente",
        "Posiziona sulla scrivania",
        "Riempi con penne, matite o piccoli oggetti"
      ],
      environmentalImpact: {
        materialsRecycled: 1,
        moneySaved: 8,
        carbonFootprintReduction: 0.3
      },
      imageUrl: null,
      tags: ["organizzazione", "ufficio", "facile"],
      source: "internal_optimized",
      sourceId: "single-2"
    }
  ];
  
  // Progetti per 2 materiali
  const twoMaterialProjects: InsertInternalProject[] = [
    {
      name: "Lampada Bottiglia e Cartone",
      description: "Combina bottiglia di vetro e cartone per creare una lampada unica",
      difficulty: "medio",
      estimatedTime: 45,
      timeUnit: "minuti",
      category: "decorazione",
      materials: [
        { name: "Bottiglia di vetro", quantity: 1, unit: "pezzo" },
        { name: "Cartone ondulato", quantity: 1, unit: "pezzo" }
      ],
      tools: [{ name: "Cutter" }, { name: "Colla" }, { name: "LED battery pack" }],
      instructions: [
        "Taglia la base dal cartone",
        "Crea un foro per inserire la bottiglia",
        "Inserisci LED nel collo della bottiglia",
        "Fissa la bottiglia alla base di cartone",
        "Testa il funzionamento"
      ],
      environmentalImpact: {
        materialsRecycled: 2,
        moneySaved: 15,
        carbonFootprintReduction: 1.2
      },
      imageUrl: null,
      tags: ["illuminazione", "decorazione", "medio"],
      source: "internal_optimized",
      sourceId: "double-1"
    }
  ];
  
  // Progetti per 3-7 materiali (esempi rappresentativi)
  const multiMaterialProjects: InsertInternalProject[] = [
    {
      name: "Centro Eco-Organizzazione Completo",
      description: "Sistema completo di organizzazione usando 7 materiali diversi",
      difficulty: "difficile",
      estimatedTime: 180,
      timeUnit: "minuti",
      category: "organizzazione",
      materials: [
        { name: "Pallet di legno", quantity: 1, unit: "pezzo" },
        { name: "Barattolo di vetro", quantity: 3, unit: "pezzo" },
        { name: "Lattina alluminio", quantity: 2, unit: "pezzo" },
        { name: "Cartone ondulato", quantity: 2, unit: "pezzo" },
        { name: "Maglietta di cotone", quantity: 1, unit: "pezzo" },
        { name: "Bottiglia PET", quantity: 2, unit: "pezzo" },
        { name: "Contenitore HDPE", quantity: 1, unit: "pezzo" }
      ],
      tools: [
        { name: "Trapano" }, 
        { name: "Viti" }, 
        { name: "Livella" }, 
        { name: "Forbici" },
        { name: "Colla forte" }
      ],
      instructions: [
        "Prepara la base dal pallet levigando e pulendo",
        "Crea scomparti superiori con i barattoli di vetro",
        "Trasforma le lattine in portapenne laterali",
        "Usa il cartone per creare divisori",
        "Taglia la maglietta per creare cuscinetti",
        "Modifica le bottiglie PET come contenitori sospesi",
        "Integra il contenitore HDPE come cassetto principale",
        "Assembla tutti i componenti sulla base",
        "Testa la stabilità e funzionalità"
      ],
      environmentalImpact: {
        materialsRecycled: 12,
        moneySaved: 85,
        carbonFootprintReduction: 8.5
      },
      imageUrl: null,
      tags: ["organizzazione", "completo", "7-materiali", "difficile"],
      source: "internal_optimized",
      sourceId: "multi-7"
    }
  ];
  
  // Inserisci tutti i progetti
  const allProjects = [...singleMaterialProjects, ...twoMaterialProjects, ...multiMaterialProjects];
  
  for (const project of allProjects) {
    try {
      await db.insert(internalProjects).values(project).onConflictDoNothing();
    } catch (error) {
      console.error(`Errore inserimento progetto ${project.name}:`, error);
    }
  }
  
  console.log(`✅ Inseriti ${allProjects.length} progetti ottimizzati per combinazioni 1-7 materiali`);
}

/**
 * Testa il sistema di riconoscimento camera
 */
export async function testCameraRecognitionSystem(): Promise<{
  success: boolean;
  materials: number;
  recognition: number;
}> {
  try {
    // Test con immagine simulata
    const testImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
    
    const { processCameraImage } = await import("./material-recognition-database");
    const result = await processCameraImage(testImage);
    
    // Conta materiali nel database
    const materialsCount = await db.select().from(internalMaterials);
    
    return {
      success: result.success,
      materials: materialsCount.length,
      recognition: result.materials.length
    };
  } catch (error) {
    console.error("Errore test camera recognition:", error);
    return {
      success: false,
      materials: 0,
      recognition: 0
    };
  }
}
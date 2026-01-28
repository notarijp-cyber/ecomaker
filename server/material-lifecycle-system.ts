/**
 * Sistema backend per Material Lifecycle Animator
 * Gestisce dati di ciclo di vita dei materiali e calcoli di impatto ambientale
 */

import { db } from "./db";
import { internalMaterials } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface LifecycleStageData {
  id: string;
  name: string;
  duration: number;
  description: string;
  environmentalImpact: {
    co2: number;
    water: number;
    energy: number;
    waste: number;
  };
  iconType: string;
  colorClass: string;
}

export interface MaterialLifecycleData {
  id: string;
  name: string;
  totalLifetime: number;
  recyclingPotential: number;
  biodegradable: boolean;
  stages: LifecycleStageData[];
  realTimeData?: {
    globalProduction: number;
    wasteGenerated: number;
    recyclingRate: number;
    environmentalCost: number;
  };
}

/**
 * Dati di ciclo di vita dei materiali con impatti ambientali reali
 */
const materialLifecycleDatabase: MaterialLifecycleData[] = [
  {
    id: "plastic_pet",
    name: "Plastica PET",
    totalLifetime: 450,
    recyclingPotential: 85,
    biodegradable: false,
    stages: [
      {
        id: "production",
        name: "Produzione",
        duration: 1,
        description: "Estrazione petrolio, raffinazione e produzione polimeri PET",
        environmentalImpact: { co2: 2.3, water: 5.2, energy: 8.1, waste: 1.2 },
        iconType: "factory",
        colorClass: "bg-red-500"
      },
      {
        id: "use",
        name: "Utilizzo",
        duration: 2,
        description: "Periodo di utilizzo attivo come contenitore per bevande",
        environmentalImpact: { co2: 0.1, water: 0.2, energy: 0.3, waste: 0.1 },
        iconType: "leaf",
        colorClass: "bg-green-500"
      },
      {
        id: "disposal",
        name: "Smaltimento",
        duration: 447,
        description: "Decomposizione lenta in discarica o dispersione ambientale",
        environmentalImpact: { co2: 0.8, water: 2.1, energy: 0.5, waste: 1.0 },
        iconType: "trash",
        colorClass: "bg-gray-500"
      }
    ],
    realTimeData: {
      globalProduction: 70000000, // tonnellate/anno
      wasteGenerated: 42000000,
      recyclingRate: 0.29,
      environmentalCost: 2.8 // USD per kg
    }
  },
  {
    id: "paper_cardboard",
    name: "Carta e Cartone",
    totalLifetime: 0.5,
    recyclingPotential: 95,
    biodegradable: true,
    stages: [
      {
        id: "production",
        name: "Produzione",
        duration: 0.1,
        description: "Taglio alberi, processo di polpaggio e produzione carta",
        environmentalImpact: { co2: 1.2, water: 15.3, energy: 4.2, waste: 2.1 },
        iconType: "tree",
        colorClass: "bg-amber-600"
      },
      {
        id: "use",
        name: "Utilizzo",
        duration: 0.2,
        description: "Periodo di utilizzo del prodotto cartaceo",
        environmentalImpact: { co2: 0.05, water: 0.1, energy: 0.1, waste: 0.05 },
        iconType: "leaf",
        colorClass: "bg-green-500"
      },
      {
        id: "decomposition",
        name: "Decomposizione",
        duration: 0.2,
        description: "Biodegradazione naturale in compost o ambiente",
        environmentalImpact: { co2: 0.3, water: 1.2, energy: 0.1, waste: 0.1 },
        iconType: "wind",
        colorClass: "bg-emerald-500"
      }
    ],
    realTimeData: {
      globalProduction: 400000000,
      wasteGenerated: 200000000,
      recyclingRate: 0.68,
      environmentalCost: 0.8
    }
  },
  {
    id: "glass_container",
    name: "Vetro",
    totalLifetime: 1000000,
    recyclingPotential: 100,
    biodegradable: false,
    stages: [
      {
        id: "production",
        name: "Produzione",
        duration: 1,
        description: "Fusione sabbia silicea, carbonato di sodio e calcare",
        environmentalImpact: { co2: 0.8, water: 2.1, energy: 12.5, waste: 0.5 },
        iconType: "factory",
        colorClass: "bg-blue-600"
      },
      {
        id: "use",
        name: "Utilizzo",
        duration: 10,
        description: "Utilizzo prolungato come contenitore riutilizzabile",
        environmentalImpact: { co2: 0.01, water: 0.05, energy: 0.02, waste: 0.01 },
        iconType: "leaf",
        colorClass: "bg-green-500"
      },
      {
        id: "persistence",
        name: "Persistenza",
        duration: 999989,
        description: "Resistenza praticamente eterna nell'ambiente",
        environmentalImpact: { co2: 0.02, water: 0.1, energy: 0.01, waste: 0.5 },
        iconType: "recycle",
        colorClass: "bg-cyan-500"
      }
    ],
    realTimeData: {
      globalProduction: 74000000,
      wasteGenerated: 28000000,
      recyclingRate: 0.76,
      environmentalCost: 0.5
    }
  },
  {
    id: "aluminum_can",
    name: "Alluminio",
    totalLifetime: 200,
    recyclingPotential: 100,
    biodegradable: false,
    stages: [
      {
        id: "mining",
        name: "Estrazione",
        duration: 0.5,
        description: "Estrazione bauxite e processo di raffinazione elettrolitica",
        environmentalImpact: { co2: 8.2, water: 3.5, energy: 15.7, waste: 2.8 },
        iconType: "factory",
        colorClass: "bg-orange-600"
      },
      {
        id: "use",
        name: "Utilizzo",
        duration: 0.5,
        description: "Utilizzo come lattina per bevande",
        environmentalImpact: { co2: 0.02, water: 0.05, energy: 0.01, waste: 0.02 },
        iconType: "leaf",
        colorClass: "bg-green-500"
      },
      {
        id: "corrosion",
        name: "Corrosione",
        duration: 199,
        description: "Ossidazione graduale nell'ambiente",
        environmentalImpact: { co2: 0.1, water: 0.5, energy: 0.02, waste: 0.8 },
        iconType: "recycle",
        colorClass: "bg-slate-500"
      }
    ],
    realTimeData: {
      globalProduction: 64000000,
      wasteGenerated: 20000000,
      recyclingRate: 0.67,
      environmentalCost: 1.2
    }
  },
  {
    id: "organic_waste",
    name: "Rifiuti Organici",
    totalLifetime: 0.25,
    recyclingPotential: 100,
    biodegradable: true,
    stages: [
      {
        id: "disposal",
        name: "Smaltimento",
        duration: 0.05,
        description: "Conferimento in compostiera o raccolta organico",
        environmentalImpact: { co2: 0.1, water: 0.5, energy: 0.2, waste: 0.0 },
        iconType: "leaf",
        colorClass: "bg-green-600"
      },
      {
        id: "decomposition",
        name: "Decomposizione",
        duration: 0.15,
        description: "Processo di compostaggio aerobico",
        environmentalImpact: { co2: 0.8, water: 2.0, energy: 0.1, waste: 0.0 },
        iconType: "wind",
        colorClass: "bg-emerald-600"
      },
      {
        id: "soil_enrichment",
        name: "Arricchimento Suolo",
        duration: 0.05,
        description: "Trasformazione in humus fertile",
        environmentalImpact: { co2: -1.2, water: 0.5, energy: 0.0, waste: -0.8 },
        iconType: "tree",
        colorClass: "bg-green-700"
      }
    ],
    realTimeData: {
      globalProduction: 1300000000,
      wasteGenerated: 931000000,
      recyclingRate: 0.17,
      environmentalCost: -0.3 // Valore negativo = beneficio ambientale
    }
  }
];

/**
 * Ottiene dati del ciclo di vita per un materiale specifico
 */
export async function getMaterialLifecycleData(materialId: string): Promise<MaterialLifecycleData | null> {
  const material = materialLifecycleDatabase.find(m => m.id === materialId);
  
  if (!material) {
    // Tenta di recuperare dal database interno
    const dbMaterial = await db.select().from(internalMaterials)
      .where(eq(internalMaterials.id, parseInt(materialId)))
      .limit(1);
    
    if (dbMaterial.length > 0) {
      // Genera dati di lifecycle per materiali dal database
      return generateLifecycleFromDatabaseMaterial(dbMaterial[0]);
    }
    
    return null;
  }
  
  // Aggiungi dati real-time simulati
  if (material.realTimeData) {
    material.realTimeData = {
      ...material.realTimeData,
      globalProduction: material.realTimeData.globalProduction * (0.98 + Math.random() * 0.04),
      wasteGenerated: material.realTimeData.wasteGenerated * (0.95 + Math.random() * 0.1),
      recyclingRate: Math.min(1, material.realTimeData.recyclingRate * (0.99 + Math.random() * 0.02)),
      environmentalCost: material.realTimeData.environmentalCost * (0.9 + Math.random() * 0.2)
    };
  }
  
  return material;
}

/**
 * Ottiene tutti i materiali disponibili per l'animazione
 */
export async function getAllMaterialLifecycles(): Promise<MaterialLifecycleData[]> {
  // Combina dati predefiniti con materiali dal database
  const dbMaterials = await db.select().from(internalMaterials).limit(10);
  const generatedLifecycles = dbMaterials.map(generateLifecycleFromDatabaseMaterial);
  
  return [...materialLifecycleDatabase, ...generatedLifecycles];
}

/**
 * Calcola l'impatto ambientale cumulativo per un materiale
 */
export function calculateCumulativeImpact(material: MaterialLifecycleData): {
  totalCO2: number;
  totalWater: number;
  totalEnergy: number;
  totalWaste: number;
  avgDailyImpact: any;
} {
  const totalImpact = material.stages.reduce((acc, stage) => ({
    totalCO2: acc.totalCO2 + stage.environmentalImpact.co2,
    totalWater: acc.totalWater + stage.environmentalImpact.water,
    totalEnergy: acc.totalEnergy + stage.environmentalImpact.energy,
    totalWaste: acc.totalWaste + stage.environmentalImpact.waste
  }), { totalCO2: 0, totalWater: 0, totalEnergy: 0, totalWaste: 0 });
  
  const totalDays = material.totalLifetime * 365;
  const avgDailyImpact = {
    co2: totalImpact.totalCO2 / totalDays,
    water: totalImpact.totalWater / totalDays,
    energy: totalImpact.totalEnergy / totalDays,
    waste: totalImpact.totalWaste / totalDays
  };
  
  return { ...totalImpact, avgDailyImpact };
}

/**
 * Genera benefici del riciclaggio per un materiale
 */
export function calculateRecyclingBenefits(material: MaterialLifecycleData): {
  co2Reduction: number;
  waterSaved: number;
  energySaved: number;
  wasteDiverted: number;
  economicValue: number;
} {
  const cumulativeImpact = calculateCumulativeImpact(material);
  const recyclingEfficiency = material.recyclingPotential / 100;
  
  return {
    co2Reduction: cumulativeImpact.totalCO2 * recyclingEfficiency * 0.7,
    waterSaved: cumulativeImpact.totalWater * recyclingEfficiency * 0.6,
    energySaved: cumulativeImpact.totalEnergy * recyclingEfficiency * 0.8,
    wasteDiverted: cumulativeImpact.totalWaste * recyclingEfficiency * 0.9,
    economicValue: (material.realTimeData?.environmentalCost || 1) * recyclingEfficiency * 0.6
  };
}

/**
 * Genera dati di lifecycle da materiale del database interno
 */
function generateLifecycleFromDatabaseMaterial(dbMaterial: any): MaterialLifecycleData {
  const materialType = dbMaterial.type || 'unknown';
  const baseLifetime = getBaseLifetimeForType(materialType);
  const recyclingPotential = dbMaterial.sustainabilityScore || 50;
  
  return {
    id: `db_${dbMaterial.id}`,
    name: dbMaterial.name,
    totalLifetime: baseLifetime,
    recyclingPotential: Math.min(100, recyclingPotential),
    biodegradable: dbMaterial.biodegradable || false,
    stages: generateStagesForType(materialType, baseLifetime),
    realTimeData: {
      globalProduction: Math.floor(Math.random() * 50000000 + 10000000),
      wasteGenerated: Math.floor(Math.random() * 20000000 + 5000000),
      recyclingRate: Math.random() * 0.6 + 0.2,
      environmentalCost: Math.random() * 3 + 0.5
    }
  };
}

/**
 * Ottiene durata base per tipo di materiale
 */
function getBaseLifetimeForType(materialType: string): number {
  const lifetimes = {
    'plastica': 450,
    'carta': 0.5,
    'vetro': 1000000,
    'metallo': 200,
    'legno': 10,
    'tessile': 5,
    'organico': 0.25
  };
  
  return lifetimes[materialType as keyof typeof lifetimes] || 50;
}

/**
 * Genera fasi del ciclo di vita per tipo di materiale
 */
function generateStagesForType(materialType: string, totalLifetime: number): LifecycleStageData[] {
  const templates = {
    'plastica': [
      { name: "Produzione", duration: 0.1, impact: { co2: 2.0, water: 4.0, energy: 6.0, waste: 1.0 }, icon: "factory", color: "bg-red-500" },
      { name: "Utilizzo", duration: 0.2, impact: { co2: 0.1, water: 0.2, energy: 0.1, waste: 0.1 }, icon: "leaf", color: "bg-green-500" },
      { name: "Smaltimento", duration: 99.7, impact: { co2: 0.5, water: 1.0, energy: 0.2, waste: 0.8 }, icon: "trash", color: "bg-gray-500" }
    ],
    'carta': [
      { name: "Produzione", duration: 20, impact: { co2: 1.0, water: 10.0, energy: 3.0, waste: 1.5 }, icon: "tree", color: "bg-amber-600" },
      { name: "Utilizzo", duration: 40, impact: { co2: 0.05, water: 0.1, energy: 0.05, waste: 0.05 }, icon: "leaf", color: "bg-green-500" },
      { name: "Decomposizione", duration: 40, impact: { co2: 0.2, water: 0.8, energy: 0.05, waste: 0.1 }, icon: "wind", color: "bg-emerald-500" }
    ]
  };
  
  const template = templates[materialType as keyof typeof templates] || templates['plastica'];
  
  return template.map((stage, index) => ({
    id: `stage_${index}`,
    name: stage.name,
    duration: (stage.duration / 100) * totalLifetime,
    description: `${stage.name} del materiale ${materialType}`,
    environmentalImpact: stage.impact,
    iconType: stage.icon,
    colorClass: stage.color
  }));
}

/**
 * Ottiene statistiche globali sui materiali
 */
export async function getGlobalMaterialStats(): Promise<{
  totalMaterialsTracked: number;
  totalWasteGenerated: number;
  averageRecyclingRate: number;
  totalEnvironmentalCost: number;
  topPollutingMaterials: string[];
  mostRecyclableMaterials: string[];
}> {
  const allMaterials = await getAllMaterialLifecycles();
  
  const totalWaste = allMaterials.reduce((sum, m) => sum + (m.realTimeData?.wasteGenerated || 0), 0);
  const avgRecyclingRate = allMaterials.reduce((sum, m) => sum + (m.realTimeData?.recyclingRate || 0), 0) / allMaterials.length;
  const totalCost = allMaterials.reduce((sum, m) => sum + (m.realTimeData?.environmentalCost || 0), 0);
  
  const topPolluting = allMaterials
    .filter(m => m.realTimeData)
    .sort((a, b) => (b.realTimeData!.environmentalCost * b.realTimeData!.wasteGenerated) - 
                    (a.realTimeData!.environmentalCost * a.realTimeData!.wasteGenerated))
    .slice(0, 3)
    .map(m => m.name);
  
  const mostRecyclable = allMaterials
    .sort((a, b) => b.recyclingPotential - a.recyclingPotential)
    .slice(0, 3)
    .map(m => m.name);
  
  return {
    totalMaterialsTracked: allMaterials.length,
    totalWasteGenerated: totalWaste,
    averageRecyclingRate: avgRecyclingRate,
    totalEnvironmentalCost: totalCost,
    topPollutingMaterials: topPolluting,
    mostRecyclableMaterials: mostRecyclable
  };
}
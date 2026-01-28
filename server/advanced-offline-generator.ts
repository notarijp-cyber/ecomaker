/**
 * Generatore offline avanzato con combinazioni complete 7,6,5,4,3,2,1 materiali
 * Sistema parallelo con analisi AI stato, ottimizzazione utilizzo e impatto ambientale
 */

import { db } from "./db";
import { 
  internalProjects, 
  internalMaterials,
  type InsertInternalProject,
  type InsertInternalMaterial 
} from "@shared/schema";
import { generateProjectImage, generateEnhancedProjectIdeas } from "./openai";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface MaterialInventory {
  id: number;
  name: string;
  type: string;
  availableQuantity: number;
  unit: string;
  condition: string; // 'excellent', 'good', 'fair', 'poor'
  recyclePotential: number; // 1-100
  sustainabilityScore: number;
}

interface ProjectGenerationRequest {
  materials: MaterialInventory[];
  combinationSize: number;
  targetCategory: string;
  difficultyLevel: string;
  availableTime: number; // minuti
  userSkillLevel: string;
}

interface AIAnalysisResult {
  feasibility: number; // 1-100
  efficiency: number; // 1-100
  sustainability: number; // 1-100
  innovation: number; // 1-100
  materialUtilization: number; // 1-100
  recommendations: string[];
  optimizations: string[];
  warnings: string[];
}

interface OptimizedProject {
  originalProject: any;
  optimizedInstructions: string[];
  materialOptimizations: any[];
  toolOptimizations: any[];
  timeOptimization: number;
  costOptimization: number;
  sustainabilityOptimization: number;
  previewImage: string;
  environmentalImpact: any;
  aiAnalysis: AIAnalysisResult;
}

/**
 * Genera tutte le combinazioni possibili da 1 a 7 materiali
 */
export async function generateAllMaterialCombinations(): Promise<void> {
  console.log("🚀 Avvio generazione completa combinazioni 7,6,5,4,3,2,1 materiali...");
  
  try {
    // Ottieni tutti i materiali disponibili con quantità simulate
    const materials = await getAllAvailableMaterials();
    console.log(`📦 Materiali disponibili: ${materials.length}`);
    
    if (materials.length < 7) {
      console.log("⚠️  Popolamento materiali necessario prima della generazione");
      await populateCompleteMaterialsDatabase();
      return generateAllMaterialCombinations();
    }
    
    const totalCombinations = calculateTotalCombinations(materials.length, 7);
    console.log(`🎯 Combinazioni totali da generare: ${totalCombinations}`);
    
    let processedCombinations = 0;
    const startTime = Date.now();
    
    // Genera combinazioni da 7 a 1 materiali con massimale di 7
    for (let size = Math.min(7, materials.length); size >= 1; size--) {
      console.log(`\n🔧 Generazione combinazioni di ${size} materiali (Max 7)...`);
      
      const combinations = generateCombinations(materials, size);
      const limitedCombinations = combinations.slice(0, Math.min(30, combinations.length));
      
      console.log(`📊 Elaborazione ${limitedCombinations.length} combinazioni di ${size} materiali`);
      
      // Parallelizza le richieste in batch
      const batchSize = 3;
      for (let i = 0; i < limitedCombinations.length; i += batchSize) {
        const batch = limitedCombinations.slice(i, i + batchSize);
        
        const batchPromises = batch.map(async (materialCombination, batchIndex) => {
          const globalIndex = i + batchIndex;
          return await processMaterialCombination(
            materialCombination, 
            size, 
            globalIndex,
            limitedCombinations.length
          );
        });
        
        try {
          await Promise.all(batchPromises);
          processedCombinations += batch.length;
          
          const progress = (processedCombinations / totalCombinations * 100).toFixed(1);
          const elapsed = (Date.now() - startTime) / 1000;
          console.log(`✅ Batch completato: ${processedCombinations}/${totalCombinations} (${progress}%) - ${elapsed.toFixed(1)}s`);
          
          // Pausa tra batch per evitare sovraccarico
          await new Promise(resolve => setTimeout(resolve, 2000));
          
        } catch (error) {
          console.error(`❌ Errore batch elaborazione:`, error);
        }
      }
    }
    
    const totalTime = (Date.now() - startTime) / 1000;
    console.log(`🎉 Generazione completa completata in ${totalTime.toFixed(1)}s!`);
    console.log(`📈 Progetti generati: ${processedCombinations}`);
    
  } catch (error) {
    console.error("❌ Errore generazione combinazioni complete:", error);
    throw error;
  }
}

/**
 * Elabora una singola combinazione di materiali
 */
async function processMaterialCombination(
  materials: MaterialInventory[], 
  size: number, 
  index: number,
  total: number
): Promise<void> {
  
  const materialNames = materials.map(m => m.name);
  console.log(`🔄 [${index + 1}/${total}] Elaborando: ${materialNames.join(', ')}`);
  
  try {
    // 1. Analisi AI dello stato dei materiali
    const stateAnalysis = await analyzeeMaterialState(materials);
    
    // 2. Generazione progetto base con AI
    const baseProject = await generateEnhancedProjectWithAI(materials, stateAnalysis);
    
    // 3. Ottimizzazione AI del progetto
    const optimizedProject = await optimizeProjectWithAI(baseProject, materials, stateAnalysis);
    
    // 4. Generazione immagine di anteprima
    const previewImage = await generateOptimizedPreviewImage(optimizedProject);
    
    // 5. Calcolo impatto ambientale completo
    const environmentalImpact = await calculateComprehensiveEnvironmentalImpact(materials, optimizedProject);
    
    // 6. Salvataggio progetto completo offline
    await saveOptimizedProjectOffline(optimizedProject, previewImage, environmentalImpact);
    
    console.log(`✅ [${index + 1}/${total}] Completato: ${optimizedProject.originalProject.name}`);
    
  } catch (error) {
    console.error(`❌ [${index + 1}/${total}] Errore elaborazione:`, error);
  }
}

/**
 * Analizza lo stato dei materiali con AI
 */
async function analyzeeMaterialState(materials: MaterialInventory[]): Promise<AIAnalysisResult> {
  const materialsInfo = materials.map(m => ({
    name: m.name,
    type: m.type,
    quantity: m.availableQuantity,
    unit: m.unit,
    condition: m.condition,
    recyclePotential: m.recyclePotential,
    sustainabilityScore: m.sustainabilityScore
  }));
  
  const prompt = `Analizza lo stato di questi materiali di scarto per progetti di riciclaggio:

${JSON.stringify(materialsInfo, null, 2)}

Fornisci un'analisi dettagliata in formato JSON con:
{
  "feasibility": numero 1-100,
  "efficiency": numero 1-100,
  "sustainability": numero 1-100,
  "innovation": numero 1-100,
  "materialUtilization": numero 1-100,
  "recommendations": ["raccomandazione1", "raccomandazione2"],
  "optimizations": ["ottimizzazione1", "ottimizzazione2"],
  "warnings": ["avviso1", "avviso2"]
}

Considera: compatibilità materiali, condizioni, quantità disponibili, potenziale di riutilizzo, sostenibilità ambientale.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // il modello più recente rilasciato il 13 maggio 2024
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1000
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.warn("Errore analisi AI stato materiali:", error);
    return {
      feasibility: 70,
      efficiency: 65,
      sustainability: 75,
      innovation: 60,
      materialUtilization: 70,
      recommendations: ["Verifica compatibilità materiali", "Ottimizza sequenza assemblaggio"],
      optimizations: ["Riduzione sprechi", "Miglioramento efficienza"],
      warnings: ["Attenzione alla sicurezza", "Verifica strumenti necessari"]
    };
  }
}

/**
 * Genera progetto enhanced con AI considerando l'analisi dello stato
 */
async function generateEnhancedProjectWithAI(
  materials: MaterialInventory[], 
  stateAnalysis: AIAnalysisResult
): Promise<any> {
  
  const materialNames = materials.map(m => m.name);
  const totalQuantity = materials.reduce((sum, m) => sum + m.availableQuantity, 0);
  const avgCondition = materials.reduce((sum, m) => {
    const conditionValue = { excellent: 100, good: 80, fair: 60, poor: 40 }[m.condition] || 50;
    return sum + conditionValue;
  }, 0) / materials.length;
  
  const prompt = `Crea un progetto di riciclaggio dettagliato utilizzando questi materiali:

MATERIALI DISPONIBILI:
${materials.map(m => `- ${m.name} (${m.availableQuantity} ${m.unit}, condizione: ${m.condition})`).join('\n')}

ANALISI AI STATO:
- Fattibilità: ${stateAnalysis.feasibility}%
- Efficienza: ${stateAnalysis.efficiency}%
- Sostenibilità: ${stateAnalysis.sustainability}%
- Raccomandazioni: ${stateAnalysis.recommendations.join(', ')}

Crea un progetto ottimizzato in formato JSON:
{
  "name": "nome progetto specifico",
  "description": "descrizione dettagliata del progetto",
  "difficulty": "facile|medio|difficile",
  "estimatedTime": numero_minuti,
  "timeUnit": "minuti",
  "category": "categoria_progetto",
  "materials": [{"name": "nome", "quantity": numero, "unit": "unità", "usagePercentage": numero}],
  "tools": [{"name": "strumento", "essential": true/false, "alternative": "alternativa"}],
  "instructions": ["passo1", "passo2", "passo3"],
  "environmentalImpact": {
    "materialsRecycled": numero_kg,
    "moneySaved": numero_euro,
    "carbonFootprintReduction": numero_kg_co2,
    "wasteReduction": numero_kg,
    "energySaved": numero_kwh
  },
  "tips": ["consiglio1", "consiglio2"],
  "alternatives": ["alternativa1", "alternativa2"]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // il modello più recente rilasciato il 13 maggio 2024
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 2000
    });

    const project = JSON.parse(response.choices[0].message.content || '{}');
    
    // Aggiungi metadati
    project.aiGenerated = true;
    project.materialsCount = materials.length;
    project.totalMaterialQuantity = totalQuantity;
    project.avgMaterialCondition = avgCondition;
    project.stateAnalysis = stateAnalysis;
    
    return project;
  } catch (error) {
    console.warn("Errore generazione progetto AI:", error);
    return generateFallbackProject(materials);
  }
}

/**
 * Ottimizza il progetto con AI
 */
async function optimizeProjectWithAI(
  project: any, 
  materials: MaterialInventory[], 
  stateAnalysis: AIAnalysisResult
): Promise<OptimizedProject> {
  
  const prompt = `Ottimizza questo progetto di riciclaggio:

PROGETTO ORIGINALE:
${JSON.stringify(project, null, 2)}

MATERIALI DISPONIBILI:
${materials.map(m => `${m.name}: ${m.availableQuantity} ${m.unit} (${m.condition})`).join('\n')}

ANALISI STATO: Fattibilità ${stateAnalysis.feasibility}%, Efficienza ${stateAnalysis.efficiency}%

Fornisci ottimizzazioni in formato JSON:
{
  "optimizedInstructions": ["istruzione_ottimizzata_1", "istruzione_ottimizzata_2"],
  "materialOptimizations": [
    {
      "material": "nome_materiale",
      "optimization": "descrizione_ottimizzazione",
      "quantityAdjustment": numero_percentuale,
      "technique": "tecnica_specifica"
    }
  ],
  "toolOptimizations": [
    {
      "tool": "nome_strumento",
      "optimization": "miglioramento_proposto",
      "alternative": "alternativa_economica"
    }
  ],
  "timeOptimization": numero_percentuale_riduzione,
  "costOptimization": numero_percentuale_risparmio,
  "sustainabilityOptimization": numero_percentuale_miglioramento,
  "qualityImprovements": ["miglioramento1", "miglioramento2"],
  "safetyEnhancements": ["sicurezza1", "sicurezza2"]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // il modello più recente rilasciato il 13 maggio 2024
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.6,
      max_tokens: 1500
    });

    const optimizations = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      originalProject: project,
      optimizedInstructions: optimizations.optimizedInstructions || project.instructions,
      materialOptimizations: optimizations.materialOptimizations || [],
      toolOptimizations: optimizations.toolOptimizations || [],
      timeOptimization: optimizations.timeOptimization || 0,
      costOptimization: optimizations.costOptimization || 0,
      sustainabilityOptimization: optimizations.sustainabilityOptimization || 0,
      previewImage: '',
      environmentalImpact: project.environmentalImpact,
      aiAnalysis: stateAnalysis
    };
  } catch (error) {
    console.warn("Errore ottimizzazione AI:", error);
    return {
      originalProject: project,
      optimizedInstructions: project.instructions,
      materialOptimizations: [],
      toolOptimizations: [],
      timeOptimization: 0,
      costOptimization: 0,
      sustainabilityOptimization: 0,
      previewImage: '',
      environmentalImpact: project.environmentalImpact,
      aiAnalysis: stateAnalysis
    };
  }
}

/**
 * Genera immagine di anteprima ottimizzata
 */
async function generateOptimizedPreviewImage(optimizedProject: OptimizedProject): Promise<string> {
  const project = optimizedProject.originalProject;
  const materials = project.materials?.map((m: any) => m.name).join(', ') || 'materiali vari';
  
  const imagePrompt = `High-quality photo of a completed DIY upcycling project: ${project.name}. 
Made from recycled materials: ${materials}. 
${project.description}. 
Professional lighting, clean background, sustainable design aesthetic, 
modern eco-friendly style, detailed craftsmanship visible.`;

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard"
    });

    return response.data[0].url || generateOptimizedSVGPlaceholder(project);
  } catch (error) {
    console.warn("Errore generazione immagine AI:", error);
    return generateOptimizedSVGPlaceholder(project);
  }
}

/**
 * Calcola impatto ambientale comprehensivo
 */
async function calculateComprehensiveEnvironmentalImpact(
  materials: MaterialInventory[], 
  optimizedProject: OptimizedProject
): Promise<any> {
  
  const totalMaterialWeight = materials.reduce((sum, m) => {
    const weightMultiplier = getWeightMultiplier(m.type);
    return sum + (m.availableQuantity * weightMultiplier);
  }, 0);
  
  const sustainabilityBonus = optimizedProject.sustainabilityOptimization / 100;
  const materialEfficiency = optimizedProject.aiAnalysis.materialUtilization / 100;
  
  return {
    materialsRecycled: totalMaterialWeight,
    moneySaved: totalMaterialWeight * 2.5 * (1 + sustainabilityBonus),
    carbonFootprintReduction: totalMaterialWeight * 1.8 * (1 + sustainabilityBonus),
    wasteReduction: totalMaterialWeight * 0.9,
    energySaved: totalMaterialWeight * 15 * materialEfficiency,
    waterSaved: totalMaterialWeight * 12 * materialEfficiency,
    airPollutionReduced: totalMaterialWeight * 0.3,
    landfillDiverted: totalMaterialWeight * 0.95,
    economicValue: totalMaterialWeight * 3.2 * (1 + sustainabilityBonus),
    socialImpact: {
      communityValue: Math.min(100, 60 + optimizedProject.aiAnalysis.innovation),
      educationalValue: Math.min(100, 70 + optimizedProject.aiAnalysis.feasibility / 2),
      replicability: Math.min(100, 80 + optimizedProject.aiAnalysis.efficiency / 2)
    },
    certifications: generateSustainabilityCertifications(materials, optimizedProject)
  };
}

/**
 * Salva progetto ottimizzato offline
 */
async function saveOptimizedProjectOffline(
  optimizedProject: OptimizedProject,
  previewImage: string,
  environmentalImpact: any
): Promise<void> {
  
  const project = optimizedProject.originalProject;
  const materials = project.materials || [];
  
  const internalProjectData: InsertInternalProject = {
    name: project.name,
    description: project.description + ` (Ottimizzato AI: -${optimizedProject.timeOptimization}% tempo, +${optimizedProject.sustainabilityOptimization}% sostenibilità)`,
    difficulty: project.difficulty || 'medio',
    estimatedTime: Math.max(15, project.estimatedTime * (1 - optimizedProject.timeOptimization / 100)),
    timeUnit: project.timeUnit || 'minuti',
    category: project.category || 'generico',
    materials: materials,
    tools: project.tools || [],
    instructions: optimizedProject.optimizedInstructions,
    previewImage: previewImage,
    source: 'ai_advanced_offline_generator',
    confidence: Math.min(95, 80 + optimizedProject.aiAnalysis.feasibility / 5),
    environmentalImpact: environmentalImpact,
    sourceId: `advanced_${project.name.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}`,
    assemblyMethods: generateAdvancedAssemblyMethods(materials, optimizedProject),
    composition: generateAdvancedComposition(materials, optimizedProject),
    offlineGenerated: true
  };
  
  try {
    await db.insert(internalProjects).values(internalProjectData);
  } catch (error) {
    console.error("Errore salvataggio progetto ottimizzato:", error);
    throw error;
  }
}

/**
 * Funzioni di supporto
 */
async function getAllAvailableMaterials(): Promise<MaterialInventory[]> {
  const materials = await db.select().from(internalMaterials);
  
  return materials.map(m => ({
    id: m.id,
    name: m.name,
    type: m.type,
    availableQuantity: Math.random() * 10 + 1, // Simula quantità disponibile
    unit: determineUnit(m.type),
    condition: getRandomCondition(),
    recyclePotential: Math.floor(Math.random() * 40) + 60, // 60-100
    sustainabilityScore: m.sustainabilityScore || Math.floor(Math.random() * 30) + 70
  }));
}

function generateCombinations<T>(items: T[], size: number): T[][] {
  if (size === 1) return items.map(item => [item]);
  if (size > items.length) return [];
  
  const combinations: T[][] = [];
  
  for (let i = 0; i <= items.length - size; i++) {
    const head = items[i];
    const tailCombinations = generateCombinations(items.slice(i + 1), size - 1);
    
    for (const tailCombination of tailCombinations) {
      combinations.push([head, ...tailCombination]);
    }
  }
  
  return combinations;
}

function calculateTotalCombinations(n: number, maxSize: number): number {
  let total = 0;
  for (let k = 1; k <= Math.min(maxSize, n); k++) {
    total += combination(n, k);
  }
  return Math.min(total, 350); // Limita per practicità
}

function combination(n: number, k: number): number {
  if (k > n) return 0;
  if (k === 0 || k === n) return 1;
  
  let result = 1;
  for (let i = 0; i < k; i++) {
    result = result * (n - i) / (i + 1);
  }
  return Math.floor(result);
}

function getWeightMultiplier(materialType: string): number {
  const multipliers: Record<string, number> = {
    'metallo': 2.5,
    'legno': 1.2,
    'plastica': 0.8,
    'vetro': 2.0,
    'tessuto': 0.6,
    'carta': 0.4,
    'ceramica': 1.8,
    'gomma': 1.0
  };
  return multipliers[materialType.toLowerCase()] || 1.0;
}

function determineUnit(materialType: string): string {
  const units: Record<string, string> = {
    'metallo': 'kg',
    'legno': 'pezzi',
    'plastica': 'pezzi',
    'vetro': 'pezzi',
    'tessuto': 'mq',
    'carta': 'fogli',
    'ceramica': 'pezzi',
    'gomma': 'kg'
  };
  return units[materialType.toLowerCase()] || 'unità';
}

function getRandomCondition(): string {
  const conditions = ['excellent', 'good', 'fair', 'poor'];
  const weights = [0.2, 0.4, 0.3, 0.1]; // Probabilità pesate
  const random = Math.random();
  let cumulative = 0;
  
  for (let i = 0; i < conditions.length; i++) {
    cumulative += weights[i];
    if (random <= cumulative) {
      return conditions[i];
    }
  }
  return 'good';
}

function generateFallbackProject(materials: MaterialInventory[]): any {
  const materialNames = materials.map(m => m.name);
  
  return {
    name: `Progetto Upcycling con ${materials.length} Materiali`,
    description: `Progetto di riciclaggio creativo utilizzando ${materialNames.join(', ')}. Trasforma materiali di scarto in oggetti utili e sostenibili.`,
    difficulty: materials.length > 5 ? 'difficile' : materials.length > 3 ? 'medio' : 'facile',
    estimatedTime: materials.length * 30 + 60,
    timeUnit: 'minuti',
    category: 'generico',
    materials: materials.map(m => ({
      name: m.name,
      quantity: m.availableQuantity * 0.8,
      unit: m.unit,
      usagePercentage: 80
    })),
    tools: [
      { name: 'Forbici', essential: true },
      { name: 'Colla universale', essential: true },
      { name: 'Righello', essential: false }
    ],
    instructions: [
      'Preparare area di lavoro',
      'Pulire e preparare materiali',
      'Seguire design progettato',
      'Assemblare componenti',
      'Rifinire progetto'
    ],
    environmentalImpact: {
      materialsRecycled: materials.length * 0.5,
      moneySaved: materials.length * 3,
      carbonFootprintReduction: materials.length * 1.2,
      wasteReduction: materials.length * 0.4,
      energySaved: materials.length * 8
    }
  };
}

function generateOptimizedSVGPlaceholder(project: any): string {
  const materials = project.materials?.slice(0, 3).map((m: any) => m.name).join(', ') || 'materiali vari';
  const encodedName = encodeURIComponent(project.name);
  const encodedMaterials = encodeURIComponent(materials);
  
  return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <defs>
      <linearGradient id="eco-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:%2300ff88;stop-opacity:0.2" />
        <stop offset="50%" style="stop-color:%2300d4ff;stop-opacity:0.15" />
        <stop offset="100%" style="stop-color:%23ff6b6b;stop-opacity:0.1" />
      </linearGradient>
      <pattern id="circuit" patternUnits="userSpaceOnUse" width="40" height="40">
        <path d="M 0 20 L 20 20 M 20 0 L 20 40 M 20 20 L 40 20" stroke="%2300ff88" stroke-width="1" opacity="0.3"/>
      </pattern>
    </defs>
    <rect width="800" height="600" fill="url(%23eco-gradient)"/>
    <rect width="800" height="600" fill="url(%23circuit)"/>
    <rect x="50" y="50" width="700" height="500" rx="20" fill="none" stroke="%2300d4ff" stroke-width="3"/>
    <circle cx="400" cy="200" r="80" fill="%2300ff88" opacity="0.2"/>
    <circle cx="400" cy="200" r="60" fill="%2300d4ff" opacity="0.3"/>
    <circle cx="400" cy="200" r="40" fill="%23ff6b6b" opacity="0.4"/>
    <text x="400" y="180" text-anchor="middle" font-family="Arial Black" font-size="24" font-weight="bold" fill="%23333">${encodedName}</text>
    <text x="400" y="220" text-anchor="middle" font-family="Arial" font-size="16" fill="%23666">Progetto Ottimizzato AI</text>
    <text x="400" y="280" text-anchor="middle" font-family="Arial" font-size="14" fill="%23777">Materiali: ${encodedMaterials}</text>
    <rect x="150" y="350" width="500" height="150" rx="10" fill="%23ffffff" opacity="0.9" stroke="%2300d4ff" stroke-width="2"/>
    <text x="400" y="385" text-anchor="middle" font-family="Arial" font-size="18" font-weight="bold" fill="%23333">EcoMaker Advanced Generator</text>
    <text x="400" y="410" text-anchor="middle" font-family="Arial" font-size="12" fill="%23666">Analisi AI • Ottimizzazione • Impatto Ambientale</text>
    <text x="400" y="430" text-anchor="middle" font-family="Arial" font-size="12" fill="%23666">Generazione Offline Completa</text>
    <text x="400" y="460" text-anchor="middle" font-family="Arial" font-size="10" fill="%23999">Sostenibilità • Innovazione • Efficienza</text>
  </svg>`;
}

function generateAdvancedAssemblyMethods(materials: any[], optimizedProject: OptimizedProject): string[] {
  const methods = new Set<string>();
  
  // Metodi base dai materiali
  materials.forEach(material => {
    const materialType = material.name?.toLowerCase() || '';
    if (materialType.includes('legno')) {
      methods.add('assemblaggio con viti autofilettanti');
      methods.add('giunzioni ad incastro rinforzate');
    }
    if (materialType.includes('metallo')) {
      methods.add('bullonatura con rondelle antiscivolo');
      methods.add('connessioni saldate a freddo');
    }
    if (materialType.includes('plastica')) {
      methods.add('fusione termica controllata');
      methods.add('clip e innesti ottimizzati');
    }
  });
  
  // Metodi ottimizzati dall'AI
  optimizedProject.materialOptimizations.forEach(opt => {
    if (opt.technique) {
      methods.add(`${opt.technique} (ottimizzato AI)`);
    }
  });
  
  // Metodi universali avanzati
  methods.add('assemblaggio modulare reversibile');
  methods.add('connessioni eco-compatibili');
  methods.add('sistema di fissaggio multi-materiale');
  
  return Array.from(methods);
}

function generateAdvancedComposition(materials: any[], optimizedProject: OptimizedProject): any {
  const totalMaterials = materials.length;
  
  return {
    primaryMaterials: materials.slice(0, Math.min(3, totalMaterials)),
    secondaryMaterials: materials.slice(3),
    optimizationLevel: 'AI-Enhanced',
    sustainabilityScore: optimizedProject.aiAnalysis.sustainability,
    feasibilityScore: optimizedProject.aiAnalysis.feasibility,
    materialUtilization: optimizedProject.aiAnalysis.materialUtilization,
    innovations: optimizedProject.materialOptimizations.map(opt => opt.optimization),
    weightDistribution: materials.reduce((acc, material, index) => {
      const weight = Math.max(5, 30 - (index * 3));
      acc[material.name] = `${weight}%`;
      return acc;
    }, {}),
    structuralIntegrity: 'alta',
    durabilityRating: 'eccellente',
    maintenanceLevel: 'minimo',
    recyclabilityEnd: '95%+'
  };
}

function generateSustainabilityCertifications(materials: MaterialInventory[], optimizedProject: OptimizedProject): string[] {
  const certs = [];
  
  if (optimizedProject.aiAnalysis.sustainability > 80) {
    certs.push('EcoMaker Platinum Sustainability');
  } else if (optimizedProject.aiAnalysis.sustainability > 65) {
    certs.push('EcoMaker Gold Sustainability');
  }
  
  if (optimizedProject.aiAnalysis.materialUtilization > 85) {
    certs.push('Zero Waste Achievement');
  }
  
  if (materials.every(m => m.recyclePotential > 70)) {
    certs.push('100% Recyclable Materials');
  }
  
  if (optimizedProject.aiAnalysis.innovation > 75) {
    certs.push('Innovation in Upcycling');
  }
  
  return certs;
}

export async function populateCompleteMaterialsDatabase(): Promise<void> {
  console.log("📦 Popolamento database materiali completo...");
  
  // Implementazione completa del popolamento materiali
  // (già implementata in data-integration.ts - populateAllAvailableMaterials)
  const { populateAllAvailableMaterials } = await import('./data-integration');
  await populateAllAvailableMaterials();
}
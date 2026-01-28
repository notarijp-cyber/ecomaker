// Copyright (c) 2026 Jacopo Primo Notari. All rights reserved.
// This code is proprietary and confidential. Unauthorized copying is prohibited.
import { GoogleGenerativeAI } from "@google/generative-ai";
import { classifyMaterial } from "@/lib/recycling-standards"; 

const API_KEY = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY || "AIzaSyBIDBN1xAhl29pZu45Ur1TdZ7RrTzGsElg"; 
const genAI = new GoogleGenerativeAI(API_KEY);

// --- MOTORE PROCEDURALE (Backup Intelligente) ---
const generateProceduralBackup = (materials: string[]) => {
    const mainMat = materials[0];
    const secondaryMat = materials[1] || "Supporto Generico";
    
    // VARIABILITÀ LIVELLO (1, 3, 5)
    const rand = Math.random();
    let level, difficulty, timeEstimate, numSteps;

    if (rand < 0.33) {
        level = 1;
        difficulty = "Principiante";
        timeEstimate = "1-2 ore";
        numSteps = 5;
    } else if (rand < 0.66) {
        level = 3;
        difficulty = "Esperto";
        timeEstimate = "2-4 ore";
        numSteps = 8;
    } else {
        level = 5;
        difficulty = "Master";
        timeEstimate = "4-8 ore";
        numSteps = 12;
    }

    // TITOLI DINAMICI BASATI SUL LIVELLO
    const titlesByLevel: any = {
        1: ["Organizer Semplice", "Vaso Decorativo", "Portapenne", "Sottobicchieri", "Cornice"],
        3: ["Lampada da Tavolo", "Fioriera Sospesa", "Scaffale Modulare", "Seduta Low-Cost", "Gioco per Bambini"],
        5: ["Sistema Idroponico", "Poltrona di Design", "Serra Automatizzata", "Scultura Cinetica", "Bio-Architettura"]
    };
    const randomTitle = `${titlesByLevel[level][Math.floor(Math.random() * titlesByLevel[level].length)]} in ${mainMat}`;
    
    const h = Math.floor(Math.random() * 50) + 20;
    const w = Math.floor(Math.random() * 40) + 15;
    
    // ISTRUZIONI VERE (Non placeholder)
    const steps = [
        `FASE 1 - PREPARAZIONE: Pulisci accuratamente i ${mainMat} con acqua calda e sapone sgrassante. Rimuovi etichette e residui di colla con aria calda.`,
        `FASE 2 - MISURAZIONE: Con un metro flessibile, segna i punti di taglio a ${Math.floor(h/3)}cm dalla base. Usa un pennarello indelebile a punta fine.`,
        `FASE 3 - TAGLIO PRIMARIO: Procedi al taglio lungo le linee tracciate. Per ${mainMat}, usa ${level > 3 ? "un utensile rotativo (Dremel)" : "forbici robuste o cutter"}.`,
        `FASE 4 - SICUREZZA BORDI: I bordi tagliati potrebbero essere taglienti. Leviga con carta vetrata grana 120 fino a renderli lisci al tatto.`,
        `FASE 5 - PREPARAZIONE UNIONE: Se usi ${secondaryMat}, taglialo in strisce o moduli compatibili con la struttura principale.`
    ];

    if (level >= 3) {
        steps.push(`FASE 6 - FORATURA: Esegui dei fori pilota da 3mm nei punti di giunzione. Questo eviterà crepe nel materiale durante l'assemblaggio.`);
        steps.push(`FASE 7 - ASSEMBLAGGIO A SECCO: Unisci le parti senza colla per verificare che le dimensioni finali (${h}x${w}cm) siano corrette.`);
        steps.push(`FASE 8 - FISSAGGIO: Applica ${level > 3 ? "colla epossidica bicomponente" : "colla a caldo"} sui punti di contatto e mantieni in pressione per 60 secondi.`);
    }

    if (level === 5) {
        steps.push(`FASE 9 - RINFORZO STRUTTURALE: Inserisci rivetti o viti autofilettanti nei fori pilota per garantire la massima tenuta meccanica.`);
        steps.push(`FASE 10 - RIFINITURA ESTETICA: Applica una mano di primer aggrappante spray, seguita da vernice protettiva resistente ai raggi UV.`);
        steps.push(`FASE 11 - INTEGRAZIONE TECNICA: Se il progetto lo richiede, installa ora eventuali componenti elettronici o meccanici nell'alloggiamento.`);
        steps.push(`FASE 12 - COLLAUDO FINALE: Verifica la stabilità applicando un carico di prova e posiziona l'oggetto nell'ambiente definitivo.`);
    } else if (level < 5) {
        steps.push(`FASE ULTIMA - FINITURA: Pulisci l'oggetto da eventuali residui di lavorazione e goditi la tua creazione!`);
    }

    return {
        title: randomTitle,
        description: `Progetto di upcycling livello ${difficulty}. Trasforma ${mainMat} in un oggetto funzionale.`,
        difficulty: difficulty,
        requiredLevel: level,
        quantumValue: level * 150,
        creditsCost: Math.floor(level * 150 * 0.3),
        timeEstimate: timeEstimate,
        finalDimensions: `H: ${h}cm | L: ${w}cm | P: ${Math.floor(w/1.5)}cm`,
        googleSearchTerm: `diy recycled ${mainMat} ${titlesByLevel[level][0]}`,
        materialsList: materials.map(m => ({ name: m, quantity: `${Math.floor(Math.random()*4)+2} unità` })),
        affiliateTools: level > 3 ? ["Dremel", "Rivettatrice", "Pistola Termica"] : ["Forbici", "Colla a Caldo", "Metro"],
        complementaryMaterials: ["Nastro Adesivo", "Carta Vetrata", "Pennarello"],
        safetyWarnings: ["Usare guanti protettivi", "Lavorare in area ventilata"],
        steps: steps
    };
};

// 1. ANALISI MATERIALE (Invariato)
export async function generateMaterialAnalysis(material: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const standard = classifyMaterial(material);
    const prompt = `Analisi Tecnica Rifiuto: "${material}". Categoria: ${standard.label}. JSON richiesto con: name, commonName, category, recycleColor, decomposition, pollutionRisk, disposalRule, description, standardDimensions.`;
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1));
  } catch (e) {
    const standard = classifyMaterial(material);
    return {
        name: material, category: standard.label, recycleColor: standard.color,
        decomposition: "Oltre 100 anni (Stimato)", pollutionRisk: "Rischio microplastiche/tossicità.",
        disposalRule: standard.rules, description: `Materiale ${standard.label} recuperato.`, standardDimensions: "Variabile"
    };
  }
}

// 2. GENERAZIONE PROGETTO COMBINATO
export async function generateCombinedProject(materials: string[]) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Crea progetto con: ${materials.join(", ")}. Livello casuale 1-5. Istruzioni tecniche dettagliate (NON placeholder). Calcola quantumValue e timeEstimate. Output JSON.`;
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    const json = JSON.parse(text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1));
    
    // Fallback valori se l'IA dimentica
    if(!json.quantumValue) json.quantumValue = 750;
    if(!json.timeEstimate) json.timeEstimate = "5-7 ore";
    if(!json.creditsCost) json.creditsCost = 150;

    return json;
  } catch (e) {
    console.warn("AI Offline. Uso Generatore Procedurale Potenziato v2.");
    return generateProceduralBackup(materials);
  }
}

export async function generateProjectBlueprint(material: string) {
    const proj = await generateCombinedProject([material]);
    return { ...proj, imageKeyword: material, imageUrl: "", technicalInfo: {} };
}
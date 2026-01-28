/**
 * Gestore automatico del database interno con controllo intelligente
 * Popola automaticamente il database al primo avvio e gestisce aggiornamenti
 */

import { db } from "./db";
import { internalProjects, internalMaterials } from "@shared/schema";
import { populateCompleteDatabase } from "./data-integration";
import { count } from "drizzle-orm";

/**
 * Controlla se il database è già popolato
 */
export async function isDatabasePopulated(): Promise<boolean> {
  try {
    const [projectCount] = await db.select({ count: count() }).from(internalProjects);
    const [materialCount] = await db.select({ count: count() }).from(internalMaterials);
    
    // Considera popolato se ha almeno 10 progetti e 10 materiali
    return projectCount.count >= 10 && materialCount.count >= 10;
  } catch (error) {
    console.error("Errore controllo popolamento database:", error);
    return false;
  }
}

/**
 * Inizializza il database se necessario
 */
export async function initializeDatabaseIfNeeded(): Promise<void> {
  console.log("🔍 Controllo stato database interno...");
  
  const isPopulated = await isDatabasePopulated();
  
  if (!isPopulated) {
    console.log("📦 Database vuoto, avvio popolamento automatico...");
    
    try {
      await populateCompleteDatabase();
      console.log("✅ Database popolato con successo!");
    } catch (error) {
      console.error("❌ Errore durante popolamento automatico:", error);
      // Non bloccare l'avvio dell'applicazione, ma logga l'errore
    }
  } else {
    console.log("✅ Database già popolato, pronto per l'uso");
  }
}

/**
 * Aggiorna periodicamente il database con nuovi dati
 */
export function schedulePeriodicUpdates(): void {
  // Aggiorna ogni 24 ore
  setInterval(async () => {
    console.log("🔄 Avvio aggiornamento periodico database...");
    
    try {
      // Popola solo nuovi dati senza duplicare
      await populateCompleteDatabase();
      console.log("✅ Aggiornamento periodico completato");
    } catch (error) {
      console.error("❌ Errore aggiornamento periodico:", error);
    }
  }, 24 * 60 * 60 * 1000); // 24 ore
}

/**
 * Statistiche del database interno
 */
export async function getDatabaseStats(): Promise<{
  projects: number;
  materials: number;
  combinations: number;
}> {
  try {
    const [projectCount] = await db.select({ count: count() }).from(internalProjects);
    const [materialCount] = await db.select({ count: count() }).from(internalMaterials);
    
    return {
      projects: projectCount.count,
      materials: materialCount.count,
      combinations: 0 // Sarà implementato quando necessario
    };
  } catch (error) {
    console.error("Errore recupero statistiche:", error);
    return { projects: 0, materials: 0, combinations: 0 };
  }
}
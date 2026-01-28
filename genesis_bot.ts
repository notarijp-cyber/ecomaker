import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./shared/schema"; // Assicurati che il percorso punti al tuo file schema.ts
import { eq } from "drizzle-orm";

// Configurazione Database (Usa le stesse credenziali del tuo server)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/ecomaker",
});
const db = drizzle(pool, { schema });

async function runGenesis() {
  console.log("🤖 GENESIS BOT ACTIVATED: Initializing EcoMaker Quantum Core...");

  try {
    // 1. PULIZIA (Opzionale, per evitare duplicati se lo lanci due volte)
    // console.log("🧹 Cleaning sector...");
    // await db.delete(schema.users);
    // await db.delete(schema.materialTypes);

    // 2. CREAZIONE UTENTE "MAKER ZERO"
    console.log("👤 Creating User Identity...");
    const [user] = await db.insert(schema.users).values({
      username: "maker_zero",
      password: "hashed_password_secret", // In produzione usiamo bcrypt
      displayName: "Eco Architect",
      email: "genesis@ecomaker.io",
    }).returning();
    console.log(`   ✅ User Created: ${user.username} (ID: ${user.id})`);

    // 3. DEFINIZIONE TIPI MATERIALI (La base della conoscenza)
    console.log("📚 Indexing Material Physics...");
    const types = await db.insert(schema.materialTypes).values([
      { name: "Plastica (PET)", description: "Polietilene tereftalato riciclabile", color: "#3b82f6", icon: "bottle" },
      { name: "Legno", description: "Legno di recupero, pallet, rami", color: "#854d0e", icon: "tree" },
      { name: "E-Waste", description: "Schede elettroniche, cavi, vecchi device", color: "#10b981", icon: "cpu" },
      { name: "Metallo", description: "Alluminio, acciaio, lattine", color: "#64748b", icon: "hammer" },
    ]).returning();
    
    // Mappa ID per uso futuro
    const plasticId = types.find(t => t.name.includes("Plastica"))!.id;
    const woodId = types.find(t => t.name.includes("Legno"))!.id;
    const ewasteId = types.find(t => t.name.includes("E-Waste"))!.id;

    // 4. SIMULAZIONE SCANSIONE MATERIALI (Inventario Utente)
    console.log("🔍 Simulating Quantum Scan of environment...");
    await db.insert(schema.materials).values([
      {
        userId: user.id,
        name: "Bottiglie di Plastica (1.5L)",
        description: "Scorta di bottiglie vuote raccolte in 2 settimane",
        typeId: plasticId,
        quantity: "15",
        unit: "pz",
        isAvailable: true,
        imageUrl: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80",
        location: "Garage Lab"
      },
      {
        userId: user.id,
        name: "Pallet Industriale Danneggiato",
        description: "Pallet EPAL standard, alcune assi rotte",
        typeId: woodId,
        quantity: "2",
        unit: "pz",
        isAvailable: true,
        imageUrl: "https://images.unsplash.com/photo-1586076920138-08f36894c219?auto=format&fit=crop&w=800&q=80",
        location: "Giardino"
      },
      {
        userId: user.id,
        name: "Vecchi Smartphone Rotti",
        description: "Modelli vari 2015-2018, schermi rotti",
        typeId: ewasteId,
        quantity: "3",
        unit: "pz",
        isAvailable: true,
        imageUrl: "https://images.unsplash.com/photo-1591196155985-8025251266b8?auto=format&fit=crop&w=800&q=80",
        location: "Scatola Componenti"
      }
    ]);
    console.log("   ✅ Materials Uploaded to Inventory");

    // 5. GENERAZIONE INTELLIGENZA (Internal Projects - Il "Cervello")
    console.log("🧠 Generating Quantum Recommendations...");
    
    // Progetto 1: High Tech
    const [intProj1] = await db.insert(schema.internalProjects).values({
      name: "Giardino Verticale Smart IoT",
      description: "Sistema idroponico verticale automatizzato costruito con bottiglie PET riciclate e controllato da microcontroller recuperati.",
      difficulty: "medio",
      estimatedTime: 180, // minuti
      category: "Agricoltura Urbana",
      source: "internal_quantum",
      materials: [
        { name: "Bottiglie PET", quantity: 10, unit: "pz" },
        { name: "Tubi irrigazione", quantity: 2, unit: "m" }
      ],
      tools: [{ name: "Forbici" }, { name: "Saldatore" }],
      instructions: ["Tagliare fondo bottiglie", "Collegare in serie", "Programmare ciclo acqua"],
      environmentalImpact: { materialsRecycled: 0.5, moneySaved: 120, carbonFootprintReduction: 5 },
      imageUrl: "https://images.unsplash.com/photo-1584302621932-349942a04870?auto=format&fit=crop&w=800&q=80",
      tags: ["iot", "giardinaggio", "plastica"]
    }).returning();

    // Progetto 2: Design Arredo
    const [intProj2] = await db.insert(schema.internalProjects).values({
      name: "Tavolo da Caffè Industrial",
      description: "Tavolino basso di design realizzato levigando e trattando pallet industriali.",
      difficulty: "facile",
      estimatedTime: 120,
      category: "Arredamento",
      source: "internal_quantum",
      materials: [{ name: "Pallet", quantity: 1, unit: "pz" }],
      tools: [{ name: "Levigatrice" }, { name: "Vernice" }],
      instructions: ["Levigare superfici", "Verniciare", "Montare ruote"],
      environmentalImpact: { materialsRecycled: 15, moneySaved: 80, carbonFootprintReduction: 12 },
      imageUrl: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=800&q=80",
      tags: ["legno", "arredo", "pallet"]
    }).returning();

    // 6. ATTIVAZIONE PROGETTI UTENTE (Popolamento Dashboard)
    console.log("🚀 Launching User Projects...");
    await db.insert(schema.projects).values([
      {
        userId: user.id,
        name: "Mio Giardino Verticale",
        description: "Sto iniziando la costruzione del sistema idroponico sul balcone.",
        difficulty: "medio",
        imageUrl: intProj1.imageUrl,
        isPublic: true,
        estimatedTime: "3",
        timeUnit: "hours",
        completionPercentage: "35", // Barra progresso al 35%
        isCrowdfunded: true,
        fundingGoal: "50",
        currentFunding: "15", // Qualcuno ha già donato!
        fundingDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 giorni
        instructions: intProj1.instructions,
        requiredMaterials: intProj1.materials,
        requiredTools: intProj1.tools
      },
      {
        userId: user.id,
        name: "Libreria Pallet",
        description: "Variante del progetto tavolo, faccio una libreria.",
        difficulty: "facile",
        imageUrl: intProj2.imageUrl,
        isPublic: true,
        estimatedTime: "2",
        timeUnit: "hours",
        completionPercentage: "90", // Quasi finito
        isCrowdfunded: false,
        instructions: intProj2.instructions,
        requiredMaterials: intProj2.materials,
        requiredTools: intProj2.tools
      }
    ]);

    // 7. CALCOLO IMPATTO AMBIENTALE (Aggiornamento Dashboard Stats)
    console.log("🌍 Calculating Global Impact...");
    await db.insert(schema.environmentalImpact).values({
      userId: user.id,
      materialsRecycled: "15.5", // kg
      projectsCompleted: 1,
      moneySaved: "125.00", // Euro
      carbonFootprint: "17.00" // kg CO2
    });

    console.log("\n✨ SYSTEM STATUS: ONLINE & POPULATED");
    console.log("-----------------------------------------");
    console.log("Login User:   maker_zero");
    console.log("Projects:     2 Active");
    console.log("Materials:    3 Scanned");
    console.log("AI Knowledge: Quantum Core Updated");
    console.log("-----------------------------------------");

  } catch (error) {
    console.error("❌ CRITICAL ERROR IN GENESIS SEQUENCE:", error);
  } finally {
    await pool.end();
  }
}

runGenesis();

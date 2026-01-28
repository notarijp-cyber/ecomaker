import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./shared/schema";
import { eq } from "drizzle-orm";

// Configurazione connessione
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/ecomaker" 
});
const db = drizzle(pool, { schema });

async function setMasterKey() {
  console.log("🔑 Impostazione Master Key per Maker Zero...");

  try {
    // Aggiorna l'utente ID 1 (Il "Padre" di tutti i dati del Bot)
    const result = await db.update(schema.users)
      .set({ 
        username: "1", 
        password: "1",     // In produzione useremmo l'hash, qui va bene testo semplice come da tua richiesta
        displayName: "Admin Maker Zero"
      })
      .where(eq(schema.users.id, 1))
      .returning();

    if (result.length > 0) {
      console.log("✅ Successo! Credenziali aggiornate.");
      console.log("   ------------------------");
      console.log("   User: 1");
      console.log("   Pass: 1");
      console.log("   ------------------------");
    } else {
      console.log("⚠️ Attenzione: Utente ID 1 non trovato. Hai lanciato il genesis_bot?");
    }

  } catch (error) {
    console.error("❌ Errore:", error);
  } finally {
    await pool.end();
  }
}

setMasterKey();

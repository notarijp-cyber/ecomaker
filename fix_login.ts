import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./shared/schema";
import { eq } from "drizzle-orm";

// Connessione Database
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/ecomaker" 
});
const db = drizzle(pool, { schema });

async function fixLogin() {
  console.log("🔧 AVVIO RIPARAZIONE LOGIN...");

  try {
    // 1. Cerca se esiste già un utente con nome "1"
    const existingUser = await db.query.users.findFirst({
      where: eq(schema.users.username, "1")
    });

    if (existingUser) {
      // AGGIORNA ESISTENTE
      console.log(`   Trovato utente esistente (ID: ${existingUser.id}). Resetto la password...`);
      await db.update(schema.users)
        .set({ password: "1", displayName: "Admin Maker Zero" })
        .where(eq(schema.users.username, "1"));
      console.log("   ✅ Password aggiornata a '1'");
    } else {
      // CREA NUOVO
      console.log("   Utente '1' non trovato. Lo creo da zero...");
      await db.insert(schema.users).values({
        username: "1",
        password: "1",
        displayName: "Admin Maker Zero",
        email: "admin@ecomaker.io"
      });
      console.log("   ✅ Utente '1' creato con successo");
    }

  } catch (error) {
    console.error("❌ ERRORE CRITICO:", error);
  } finally {
    await pool.end();
  }
}

fixLogin();
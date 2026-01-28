import React, { useEffect, useRef } from 'react';
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, limit } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { generateMaterialAnalysis, generateCombinedProject } from "@/lib/gemini";
import { useBotContext } from "@/context/bot-context";

const RAW_MATERIALS = ["Cavi elettrici", "Schede madri", "Copertoni", "Bottiglie PET", "Lattine", "Vetri finestra", "Scarti pelle", "Legno pallet", "Olio esausto", "Batterie litio", "Cartone", "Tetra Pak", "Jeans vecchi", "Tubi PVC", "Polistirolo", "Tappi sughero"];

export function EcoBotManager() {
  const { setStatus, addLog, setStats, setIsBotActive } = useBotContext();
  const botLoopRef = useRef<NodeJS.Timeout | null>(null);
  const isRunningRef = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email === "ecomakerteamtest@gmail.com") {
        setIsBotActive(true);
        startBotLoop(user.uid);
      } else {
        setIsBotActive(false);
        stopBotLoop();
      }
    });
    return () => unsubscribe();
  }, []);

  const stopBotLoop = () => { if (botLoopRef.current) clearTimeout(botLoopRef.current); isRunningRef.current = false; };

  const startBotLoop = async (uid: string) => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;

    const loop = async () => {
      try {
        const mode = Math.random() > 0.4 ? "MINING" : "CRAFTING"; 

        if (mode === "MINING") {
            setStatus("📡 Ricerca Nuovi Materiali...");
            const q = query(collection(db, "repository"), where("source", "==", "EcoBot_v3"));
            const snapshot = await getDocs(q);
            const existingNames = snapshot.docs.map(d => d.data().commonName || d.data().name);
            let target = RAW_MATERIALS.filter(m => !existingNames.includes(m));
            if (target.length === 0) target = RAW_MATERIALS; 
            const selectedMaterial = target[Math.floor(Math.random() * target.length)];

            setStatus(`🔬 Analisi: ${selectedMaterial}`);
            const analysis = await generateMaterialAnalysis(selectedMaterial);

            if (analysis) {
                await addDoc(collection(db, "repository"), {
                    ...analysis, source: "EcoBot_v3", scannedAt: new Date(), authorId: uid, quantity: Math.floor(Math.random() * 20) + 5
                });
                addLog(`Catalogato: ${analysis.name}`);
                setStats(prev => ({ ...prev, mined: snapshot.size + 1, lastAction: "Nuovo Materiale" }));
            }

        } else {
            setStatus("🛠️ Progettazione Combinata...");
            const q = query(collection(db, "repository"), limit(20));
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
                const docs = snapshot.docs;
                const shuffled = docs.sort(() => 0.5 - Math.random());
                const selectedDocs = shuffled.slice(0, Math.floor(Math.random() * 2) + 2); 
                const materialNames = selectedDocs.map(d => d.data().commonName || d.data().name);
                const mainMaterialId = selectedDocs[0].id; 

                setStatus(`🧠 Ingegneria: ${materialNames.join(" + ")}`);
                const projectData = await generateCombinedProject(materialNames);

                if (projectData) {
                    await addDoc(collection(db, "secret_projects_db"), {
                        ...projectData,
                        linkedMaterialId: mainMaterialId,
                        status: "LOCKED",
                        createdAt: new Date(),
                        source: "EcoBot_Combinator"
                    });
                    addLog(`Blueprint: ${projectData.title}`);
                    setStats(prev => ({ ...prev, complexity: projectData.requiredLevel, lastAction: "Progetto Combinato" }));
                }
            }
        }
      } catch (error) { console.error(error); setStatus("⚠️ Errore Ciclo"); }
      botLoopRef.current = setTimeout(loop, 10000); 
    };
    loop();
  };
  return null;
}
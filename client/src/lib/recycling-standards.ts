// STANDARD UNI 11686 (Colori Rifiuti Internazionali)
export const RECYCLE_STANDARDS = {
    PAPER: {
        id: "paper", label: "CARTA E CARTONE", color: "#3b82f6", icon: "Box",
        container: "Cassonetto Blu", rules: "Scatole appiattite, giornali. NO scontrini o carta unta.", destination: "Cartiera."
    },
    PLASTIC_METAL: {
        id: "plastic_metal", label: "PLASTICA E METALLO", color: "#eab308", icon: "Milk",
        container: "Sacco Giallo", rules: "Bottiglie schiacciate, lattine. NO giocattoli duri.", destination: "Riciclo polimeri."
    },
    GLASS: {
        id: "glass", label: "VETRO (IMBALLAGGI)", color: "#22c55e", icon: "GlassWater",
        container: "Campana Verde", rules: "Solo bottiglie e vasetti. NO bicchieri, NO finestre.", destination: "Vetreria."
    },
    SPECIAL_GLASS: { // NUOVA CATEGORIA PER FINESTRE/SPECCHI
        id: "special_glass", label: "VETRO SPECIALE / INERTI", color: "#10b981", icon: "GlassWater", // Verde smeraldo
        container: "Isola Ecologica", rules: "Vetri finestre, specchi, pyrex. Hanno punto di fusione diverso.", destination: "Recupero inerti."
    },
    ORGANIC: {
        id: "organic", label: "ORGANICO", color: "#854d0e", icon: "Apple",
        container: "Bidoncino Marrone", rules: "Scarti cibo. NO pannolini.", destination: "Compostaggio."
    },
    WEEE: {
        id: "weee", label: "RAEE (ELETTRONICA)", color: "#ef4444", icon: "Cpu",
        container: "Isola Ecologica", rules: "Elettronica, cavi, batterie.", destination: "Recupero metalli preziosi."
    },
    TEXTILE: {
        id: "textile", label: "TESSILI", color: "#ec4899", icon: "Shirt",
        container: "Cassonetto Abiti", rules: "Abiti puliti in buste chiuse.", destination: "Riutilizzo fibre."
    },
    GENERAL: {
        id: "general", label: "SECCO INDIFFERENZIATO", color: "#64748b", icon: "Trash2",
        container: "Sacco Grigio", rules: "Tutto ciò che non è riciclabile.", destination: "Termovalorizzatore."
    }
};

export const classifyMaterial = (materialName: string) => {
    const m = materialName.toLowerCase();
    if (m.includes("carton") || m.includes("giornal") || m.includes("carta") || m.includes("tetrapak")) return RECYCLE_STANDARDS.PAPER;
    if (m.includes("plastic") || m.includes("pet") || m.includes("lattin") || m.includes("alluminio") || m.includes("polistirolo")) return RECYCLE_STANDARDS.PLASTIC_METAL;
    
    // Distinzione Vetri
    if (m.includes("finestra") || m.includes("specchio") || m.includes("cristallo")) return RECYCLE_STANDARDS.SPECIAL_GLASS;
    if (m.includes("vetro") || m.includes("barattol") || m.includes("boccett")) return RECYCLE_STANDARDS.GLASS;
    
    if (m.includes("cibo") || m.includes("legno") || m.includes("sughero")) return RECYCLE_STANDARDS.ORGANIC;
    if (m.includes("elettr") || m.includes("cavi") || m.includes("sched") || m.includes("batteri")) return RECYCLE_STANDARDS.WEEE;
    if (m.includes("tessuto") || m.includes("lana") || m.includes("cotone") || m.includes("jeans")) return RECYCLE_STANDARDS.TEXTILE;
    
    return RECYCLE_STANDARDS.GENERAL;
};
export type AvatarType = 'EchoBot' | 'GreenGuardian' | 'TrashTitan';

export const AVATAR_LORE = {
  EchoBot: {
    name: "EchoBot",
    role: "Analista Rapido",
    desc: "Un'unità di ricognizione agile. Eccelle nel trovare materiali rari.",
    colors: { primary: "#06b6d4", secondary: "#22d3ee", glow: "rgba(6,182,212,0.5)" },
    evolution: [
      { lvl: 1, title: "Modulo Base", story: "Appena assemblato con scarti di vecchi droni. Curioso ma fragile." },
      { lvl: 2, title: "Sensore Ottico", story: "Ha integrato una lente di fotocamera reflex. Ora vede i dettagli molecolari." },
      { lvl: 3, title: "Nucleo Quantico", story: "Il cuore a batteria è stato sostituito da un mini-reattore a fusione fredda." },
      { lvl: 4, title: "Ali Gravitazionali", story: "Non tocca più terra. Fluttua silenzioso scansionando l'intera città." },
      { lvl: 5, title: "Echo Singularity", story: "È diventato pura energia cosciente. I materiali vengono catalogati prima ancora di essere toccati." }
    ]
  },
  GreenGuardian: {
    name: "Green Guardian",
    role: "Protettore",
    desc: "Un ibrido pianta-macchina. Trasforma la CO2 in carburante per la community.",
    colors: { primary: "#22c55e", secondary: "#4ade80", glow: "rgba(34,197,94,0.5)" },
    evolution: [
      { lvl: 1, title: "Germoglio Tech", story: "Un piccolo vaso smart con braccia robotiche. Timido." },
      { lvl: 2, title: "Radici Cablate", story: "Le radici sono entrate nella rete elettrica. Assorbe dati e nutrienti." },
      { lvl: 3, title: "Fioritura Solare", story: "Pannelli solari organici si sono aperti sulla schiena. Autosufficiente." },
      { lvl: 4, title: "Foresta Mobile", story: "Può purificare l'aria di un intero quartiere industriale." },
      { lvl: 5, title: "Gaia Interface", story: "La fusione perfetta tra biologia e silicio. Controlla la crescita urbana." }
    ]
  },
  TrashTitan: {
    name: "Trash Titan",
    role: "Costruttore",
    desc: "Un colosso fatto di metallo pressato. Costruisce progetti complessi da solo.",
    colors: { primary: "#f59e0b", secondary: "#fbbf24", glow: "rgba(245,158,11,0.5)" },
    evolution: [
      { lvl: 1, title: "Compattatore", story: "Una pressa idraulica con le gambe. Rozzo ma forte." },
      { lvl: 2, title: "Braccio Meccanico", story: "Ha trovato un braccio industriale in discarica. Ora può saldare." },
      { lvl: 3, title: "Fornace Interna", story: "Fonde i metalli direttamente nel suo petto. È una fonderia ambulante." },
      { lvl: 4, title: "Armatura in Titanio", story: "Rivestito con scarti aerospaziali. Indistruttibile." },
      { lvl: 5, title: "Omega Constructor", story: "Una fabbrica vivente. Può costruire un'intera casa in un giorno." }
    ]
  }
};
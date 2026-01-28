import {
  users, type User, type InsertUser,
  materialTypes, type MaterialType, type InsertMaterialType,
  materials, type Material, type InsertMaterial,
  projects, type Project, type InsertProject,
  events, type Event, type InsertEvent,
  eventParticipants, type EventParticipant, type InsertEventParticipant,
  companies, type Company, type InsertCompany,
  environmentalImpact, type EnvironmentalImpact, type InsertEnvironmentalImpact,
  projectParticipants, type ProjectParticipant, type InsertProjectParticipant
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Material Types
  getMaterialTypes(): Promise<MaterialType[]>;
  getMaterialType(id: number): Promise<MaterialType | undefined>;
  createMaterialType(materialType: InsertMaterialType): Promise<MaterialType>;
  
  // Materials
  getMaterials(): Promise<Material[]>;
  getMaterialsByUser(userId: number): Promise<Material[]>;
  getMaterialsByCompany(companyId: number): Promise<Material[]>;
  getMaterial(id: number): Promise<Material | undefined>;
  createMaterial(material: InsertMaterial): Promise<Material>;
  updateMaterial(id: number, material: Partial<InsertMaterial>): Promise<Material>;
  deleteMaterial(id: number): Promise<boolean>;
  
  // Projects
  getProjects(): Promise<Project[]>;
  getProjectsByUser(userId: number): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: number): Promise<boolean>;
  getCommunityProjects(): Promise<Project[]>;
  
  // Events
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event>;
  deleteEvent(id: number): Promise<boolean>;
  
  // Event Participants
  getEventParticipants(eventId: number): Promise<EventParticipant[]>;
  addEventParticipant(participant: InsertEventParticipant): Promise<EventParticipant>;
  removeEventParticipant(eventId: number, userId: number): Promise<boolean>;
  
  // Companies
  getCompanies(): Promise<Company[]>;
  getCompany(id: number): Promise<Company | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;
  
  // Environmental Impact
  getEnvironmentalImpact(userId: number): Promise<EnvironmentalImpact | undefined>;
  updateEnvironmentalImpact(userId: number, impact: Partial<InsertEnvironmentalImpact>): Promise<EnvironmentalImpact>;
  
  // Project Participants
  getProjectParticipants(projectId: number): Promise<ProjectParticipant[]>;
  addProjectParticipant(participant: InsertProjectParticipant): Promise<ProjectParticipant>;
  removeProjectParticipant(projectId: number, userId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private materialTypes: Map<number, MaterialType>;
  private materials: Map<number, Material>;
  private projects: Map<number, Project>;
  private events: Map<number, Event>;
  private eventParticipants: Map<number, EventParticipant>;
  private companies: Map<number, Company>;
  private environmentalImpacts: Map<number, EnvironmentalImpact>;
  private projectParticipants: Map<number, ProjectParticipant>;
  
  private userIdCounter: number;
  private materialTypeIdCounter: number;
  private materialIdCounter: number;
  private projectIdCounter: number;
  private eventIdCounter: number;
  private eventParticipantIdCounter: number;
  private companyIdCounter: number;
  private environmentalImpactIdCounter: number;
  private projectParticipantIdCounter: number;

  constructor() {
    this.users = new Map();
    this.materialTypes = new Map();
    this.materials = new Map();
    this.projects = new Map();
    this.events = new Map();
    this.eventParticipants = new Map();
    this.companies = new Map();
    this.environmentalImpacts = new Map();
    this.projectParticipants = new Map();
    
    this.userIdCounter = 1;
    this.materialTypeIdCounter = 1;
    this.materialIdCounter = 1;
    this.projectIdCounter = 1;
    this.eventIdCounter = 1;
    this.eventParticipantIdCounter = 1;
    this.companyIdCounter = 1;
    this.environmentalImpactIdCounter = 1;
    this.projectParticipantIdCounter = 1;
    
    // Initialize with some dummy data for development
    this.initializeData();
  }

  private initializeData() {
    // Create extended material types
    const plasticType = this.createMaterialType({
      name: "Plastica",
      description: "Materiali in plastica come bottiglie, contenitori, etc.",
      icon: "bell",
      color: "#1976D2"
    });
    
    const paperType = this.createMaterialType({
      name: "Carta",
      description: "Materiali in carta come cartoni, giornali, etc.",
      icon: "box",
      color: "#388E3C"
    });
    
    const glassType = this.createMaterialType({
      name: "Vetro",
      description: "Materiali in vetro come bottiglie, barattoli, etc.",
      icon: "circle",
      color: "#00ACC1"
    });
    
    const metalType = this.createMaterialType({
      name: "Metallo",
      description: "Materiali in metallo come lattine, scatolette, etc.",
      icon: "square",
      color: "#F57C00"
    });
    
    const woodType = this.createMaterialType({
      name: "Legno",
      description: "Materiali in legno come pallet, cassette, etc.",
      icon: "hexagon",
      color: "#6D4C41"
    });
    
    const textileType = this.createMaterialType({
      name: "Tessile",
      description: "Materiali tessili come vestiti, stoffe, etc.",
      icon: "triangle",
      color: "#9C27B0"
    });

    // Aggiungiamo nuove categorie di materiali
    const electronicType = this.createMaterialType({
      name: "Elettronica",
      description: "Componenti elettronici, dispositivi dismessi, schede, cavi, etc.",
      icon: "zap",
      color: "#FF5722"
    });

    const organicType = this.createMaterialType({
      name: "Organico",
      description: "Materiali organici come gusci d'uovo, bucce, fondi di caffè, etc.",
      icon: "leaf",
      color: "#8BC34A"
    });

    const rubberType = this.createMaterialType({
      name: "Gomma",
      description: "Materiali in gomma come pneumatici, guarnizioni, etc.",
      icon: "disc",
      color: "#212121"
    });

    const ceramicType = this.createMaterialType({
      name: "Ceramica",
      description: "Materiali in ceramica come tazze rotte, piastrelle, etc.",
      icon: "layers",
      color: "#E0E0E0"
    });

    const compositeType = this.createMaterialType({
      name: "Materiali compositi",
      description: "Materiali composti da più elementi come tetrapak, blister, etc.",
      icon: "grid",
      color: "#7E57C2"
    });

    const constructionType = this.createMaterialType({
      name: "Edilizia",
      description: "Scarti edilizi come mattoni, piastrelle, tubi, etc.",
      icon: "home",
      color: "#FFA000"
    });

    const automotiveType = this.createMaterialType({
      name: "Automotive",
      description: "Parti di veicoli come sedili, cruscotti, fari, etc.",
      icon: "truck",
      color: "#546E7A"
    });

    const furnitureType = this.createMaterialType({
      name: "Arredamento",
      description: "Mobili o parti di essi dismessi",
      icon: "box",
      color: "#795548"
    });

    const cosmeticType = this.createMaterialType({
      name: "Cosmetica",
      description: "Contenitori di prodotti cosmetici e per l'igiene personale",
      icon: "droplet",
      color: "#EC407A"
    });

    const medicalType = this.createMaterialType({
      name: "Medico",
      description: "Imballaggi medicinali e attrezzi medicali dismessi non pericolosi",
      icon: "activity",
      color: "#F44336"
    });

    // Create default user
    const demoUser = this.createUser({
      username: "demo",
      password: "password",
      displayName: "Demo User",
      email: "demo@example.com"
    });

    // Create default company
    const ecoCompany = this.createCompany({
      name: "EcoLegno srl",
      description: "Azienda di riciclo legno",
      location: "Milano, Italia",
      logoUrl: ""
    });

    const modaTex = this.createCompany({
      name: "ModaTex SpA",
      description: "Azienda di tessuti",
      location: "Roma, Italia",
      logoUrl: ""
    });

    // Creiamo più aziende specializzate in diversi materiali
    const techRecycle = this.createCompany({
      name: "TechRecycle",
      description: "Riciclo componenti elettronici",
      location: "Torino, Italia",
      logoUrl: ""
    });

    const ceramiArt = this.createCompany({
      name: "CeramiArt",
      description: "Laboratorio artistico specializzato in ceramica",
      location: "Firenze, Italia",
      logoUrl: ""
    });

    const autoRicambi = this.createCompany({
      name: "AutoRicambi Sostenibili",
      description: "Ricambi auto usati e rigenerati",
      location: "Napoli, Italia",
      logoUrl: ""
    });

    const ecoCosmesi = this.createCompany({
      name: "EcoCosmesi",
      description: "Prodotti cosmetici ecologici",
      location: "Bologna, Italia",
      logoUrl: ""
    });

    // Create a rich catalog of materials by category
    
    // PLASTICA
    this.createMaterial({
      name: "Bottiglie di plastica PET",
      description: "Bottiglie trasparenti di acqua e bevande",
      typeId: plasticType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 35,
      unit: "pezzo",
      isAvailable: true,
      location: "Casa"
    });

    this.createMaterial({
      name: "Contenitori di detersivi",
      description: "Flaconi HDPE colorati di varie dimensioni",
      typeId: plasticType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 12,
      unit: "pezzo",
      isAvailable: true,
      location: "Casa"
    });

    this.createMaterial({
      name: "Tappi di bottiglia",
      description: "Tappi in plastica di vari colori",
      typeId: plasticType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 150,
      unit: "pezzo",
      isAvailable: true,
      location: "Casa"
    });

    this.createMaterial({
      name: "Cannucce colorate",
      description: "Cannucce in plastica di vari colori",
      typeId: plasticType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 80,
      unit: "pezzo",
      isAvailable: true,
      location: "Casa"
    });

    this.createMaterial({
      name: "Reti frutta e verdura",
      description: "Reti in plastica per frutta e verdura",
      typeId: plasticType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 20,
      unit: "pezzo",
      isAvailable: true,
      location: "Casa"
    });

    this.createMaterial({
      name: "Blister medicine",
      description: "Confezioni in plastica per medicine",
      typeId: plasticType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 30,
      unit: "pezzo",
      isAvailable: true,
      location: "Casa"
    });

    // CARTA
    this.createMaterial({
      name: "Scatole di cartone",
      description: "Scatole di varie dimensioni da imballaggi",
      typeId: paperType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 15,
      unit: "pezzo",
      isAvailable: true,
      location: "Casa"
    });

    this.createMaterial({
      name: "Riviste vecchie",
      description: "Riviste di moda e design non più utili",
      typeId: paperType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 25,
      unit: "pezzo",
      isAvailable: true,
      location: "Casa"
    });

    this.createMaterial({
      name: "Sacchetti di carta",
      description: "Sacchetti di negozi e supermercati",
      typeId: paperType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 40,
      unit: "pezzo",
      isAvailable: true,
      location: "Casa"
    });

    this.createMaterial({
      name: "Rotoli carta igienica finiti",
      description: "Tubi in cartone dei rotoli di carta igienica",
      typeId: paperType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 28,
      unit: "pezzo",
      isAvailable: true,
      location: "Casa"
    });

    this.createMaterial({
      name: "Carte da regalo usate",
      description: "Carte da regalo recuperate da regali ricevuti",
      typeId: paperType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 10,
      unit: "pezzo",
      isAvailable: true,
      location: "Casa"
    });

    // VETRO
    this.createMaterial({
      name: "Bottiglie di vino",
      description: "Bottiglie di vino vuote di vari colori",
      typeId: glassType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 12,
      unit: "pezzo",
      isAvailable: true,
      location: "Casa"
    });

    this.createMaterial({
      name: "Barattoli di conserve",
      description: "Barattoli in vetro di varie dimensioni",
      typeId: glassType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 18,
      unit: "pezzo",
      isAvailable: true,
      location: "Casa"
    });

    this.createMaterial({
      name: "Bicchieri rotti",
      description: "Bicchieri in vetro danneggiati",
      typeId: glassType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 8,
      unit: "pezzo",
      isAvailable: true,
      location: "Casa"
    });

    this.createMaterial({
      name: "Bottiglie di profumo vuote",
      description: "Contenitori di profumo in vetro decorativo",
      typeId: glassType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 5,
      unit: "pezzo",
      isAvailable: true,
      location: "Casa"
    });

    // METALLO
    this.createMaterial({
      name: "Lattine bibite",
      description: "Lattine di alluminio di birra e bevande",
      typeId: metalType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 24,
      unit: "pezzo",
      isAvailable: true,
      location: "Casa"
    });

    this.createMaterial({
      name: "Tappi corona",
      description: "Tappi metallici di bottiglie di birra e bibite",
      typeId: metalType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 55,
      unit: "pezzo",
      isAvailable: true,
      location: "Casa"
    });

    this.createMaterial({
      name: "Barattoli di latta",
      description: "Barattoli di tonno, legumi e altri cibi in scatola",
      typeId: metalType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 15,
      unit: "pezzo",
      isAvailable: true,
      location: "Casa"
    });

    this.createMaterial({
      name: "Fil di ferro",
      description: "Filo metallico flessibile di vari spessori",
      typeId: metalType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 10,
      unit: "metro",
      isAvailable: true,
      location: "Casa"
    });

    this.createMaterial({
      name: "Chiavi vecchie",
      description: "Chiavi non più utilizzabili o senza serratura",
      typeId: metalType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 12,
      unit: "pezzo",
      isAvailable: true,
      location: "Casa"
    });

    // LEGNO
    this.createMaterial({
      name: "Palette di legno",
      description: "Palette di legno EUR standard",
      typeId: woodType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 8,
      unit: "pezzo",
      isAvailable: true,
      location: "Milano, Italia",
      companyId: ecoCompany.id
    });

    this.createMaterial({
      name: "Cassette della frutta",
      description: "Cassette in legno da frutta e verdura",
      typeId: woodType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 7,
      unit: "pezzo",
      isAvailable: true,
      location: "Casa"
    });

    this.createMaterial({
      name: "Bastoncini gelato",
      description: "Bastoncini in legno dei gelati",
      typeId: woodType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 65,
      unit: "pezzo",
      isAvailable: true,
      location: "Casa"
    });

    this.createMaterial({
      name: "Mollette bucato in legno",
      description: "Mollette tradizionali per bucato",
      typeId: woodType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 30,
      unit: "pezzo",
      isAvailable: true,
      location: "Casa"
    });

    this.createMaterial({
      name: "Rami caduti",
      description: "Rami e legni recuperati dal giardino",
      typeId: woodType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 15,
      unit: "pezzo",
      isAvailable: true,
      location: "Casa"
    });

    // TESSILE
    this.createMaterial({
      name: "Tessuti assortiti",
      description: "Tessuti di vari colori e dimensioni",
      typeId: textileType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 12,
      unit: "kg",
      isAvailable: true,
      location: "Roma, Italia",
      companyId: modaTex.id
    });

    this.createMaterial({
      name: "Jeans vecchi",
      description: "Jeans non più utilizzabili",
      typeId: textileType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 5,
      unit: "pezzo",
      isAvailable: true,
      location: "Casa"
    });

    this.createMaterial({
      name: "T-shirt vecchie",
      description: "Magliette di cotone non più utilizzabili",
      typeId: textileType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 10,
      unit: "pezzo",
      isAvailable: true,
      location: "Casa"
    });

    this.createMaterial({
      name: "Ritagli di stoffa",
      description: "Rimanenze di stoffa da progetti di cucito",
      typeId: textileType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 3,
      unit: "kg",
      isAvailable: true,
      location: "Casa"
    });

    this.createMaterial({
      name: "Lacci di scarpe",
      description: "Lacci di scarpe di vari colori e lunghezze",
      typeId: textileType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 14,
      unit: "pezzo",
      isAvailable: true,
      location: "Casa"
    });

    // ELETTRONICA
    this.createMaterial({
      name: "Circuiti stampati",
      description: "Schede elettroniche da apparecchi dismessi",
      typeId: electronicType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 8,
      unit: "pezzo",
      isAvailable: true,
      location: "Torino, Italia",
      companyId: techRecycle.id
    });

    this.createMaterial({
      name: "Cavi elettrici",
      description: "Cavi di vari colori e lunghezze",
      typeId: electronicType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 20,
      unit: "metro",
      isAvailable: true,
      location: "Casa"
    });

    this.createMaterial({
      name: "Tastiere rotte",
      description: "Tastiere di computer non funzionanti",
      typeId: electronicType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 3,
      unit: "pezzo",
      isAvailable: true,
      location: "Casa"
    });

    this.createMaterial({
      name: "CD/DVD usati",
      description: "Dischi ottici non più utilizzabili",
      typeId: electronicType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 25,
      unit: "pezzo",
      isAvailable: true,
      location: "Casa"
    });

    // ORGANICO
    this.createMaterial({
      name: "Gusci d'uovo",
      description: "Gusci d'uovo puliti e asciutti",
      typeId: organicType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 24,
      unit: "pezzo",
      isAvailable: true,
      location: "Casa"
    });

    this.createMaterial({
      name: "Fondi di caffè",
      description: "Fondi di caffè essiccati",
      typeId: organicType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 1,
      unit: "kg",
      isAvailable: true,
      location: "Casa"
    });

    this.createMaterial({
      name: "Noccioli di frutta",
      description: "Noccioli di pesche, albicocche, avocado",
      typeId: organicType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 15,
      unit: "pezzo",
      isAvailable: true,
      location: "Casa"
    });

    // GOMMA
    this.createMaterial({
      name: "Pneumatici usati",
      description: "Pneumatici di auto non più utilizzabili",
      typeId: rubberType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 4,
      unit: "pezzo",
      isAvailable: true,
      location: "Napoli, Italia",
      companyId: autoRicambi.id
    });

    this.createMaterial({
      name: "Camere d'aria bici",
      description: "Camere d'aria bucate o danneggiate",
      typeId: rubberType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 5,
      unit: "pezzo",
      isAvailable: true,
      location: "Casa"
    });

    // CERAMICA
    this.createMaterial({
      name: "Tazze sbeccate",
      description: "Tazze in ceramica con piccoli danni",
      typeId: ceramicType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 6,
      unit: "pezzo",
      isAvailable: true,
      location: "Casa"
    });

    this.createMaterial({
      name: "Piastrelle avanzate",
      description: "Piastrelle avanzate da lavori edilizi",
      typeId: ceramicType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 20,
      unit: "pezzo",
      isAvailable: true,
      location: "Firenze, Italia",
      companyId: ceramiArt.id
    });

    // COMPOSITI
    this.createMaterial({
      name: "Tetrapak",
      description: "Contenitori Tetrapak di latte e succhi",
      typeId: compositeType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 15,
      unit: "pezzo",
      isAvailable: true,
      location: "Casa"
    });

    // AUTOMOTIVE
    this.createMaterial({
      name: "Cinture di sicurezza",
      description: "Cinture di sicurezza da auto demolite",
      typeId: automotiveType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 3,
      unit: "pezzo",
      isAvailable: true,
      location: "Napoli, Italia",
      companyId: autoRicambi.id
    });

    // COSMETICA
    this.createMaterial({
      name: "Flaconi cosmetici",
      description: "Contenitori vuoti di shampoo, creme, etc",
      typeId: cosmeticType.id,
      imageUrl: "",
      userId: demoUser.id,
      quantity: 18,
      unit: "pezzo",
      isAvailable: true,
      location: "Bologna, Italia",
      companyId: ecoCosmesi.id
    });

    // Create some projects
    const project1 = this.createProject({
      name: "Lampada da bottiglia di vetro",
      description: "Trasforma una bottiglia di vetro in una lampada elegante con luci LED. Un progetto semplice ma di grande effetto che crea un'illuminazione d'atmosfera perfetta per il soggiorno o la camera da letto.",
      difficulty: "Facile",
      imageUrl: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80",
      userId: demoUser.id,
      isPublic: true,
      estimatedTime: 2,
      timeUnit: "ore",
      instructions: [
        "Pulisci accuratamente la bottiglia rimuovendo etichette e residui",
        "Fora il tappo per far passare il filo elettrico",
        "Inserisci la striscia LED nella bottiglia organizzandola in modo decorativo",
        "Collega il filo al trasformatore e testa il funzionamento",
        "Sigilla il tappo con colla a caldo per fissare il cavo"
      ],
      requiredMaterials: [
        { name: "Bottiglia di vetro", quantity: 1, unit: "pezzo" },
        { name: "Striscia LED", quantity: 1, unit: "metro" },
        { name: "Cavi elettrici", quantity: 1, unit: "metro" },
        { name: "Trasformatore 12V", quantity: 1, unit: "pezzo" }
      ],
      requiredTools: [
        { name: "Trapano", link: "https://www.amazon.com/dp/example1" },
        { name: "Cacciavite", link: "https://www.amazon.com/dp/example2" },
        { name: "Pistola colla a caldo", link: "https://www.amazon.com/dp/example6" }
      ],
      isCommunityProject: false,
      completionPercentage: 0,
      environmentalImpact: {
        materialsRecycled: 2.5,
        moneySaved: 25,
        carbonFootprintReduction: 1.8
      }
    });

    const project2 = this.createProject({
      name: "Vaso da pneumatico",
      description: "Dai nuova vita ai vecchi pneumatici trasformandoli in vasi per piante. Questo progetto non solo riutilizza un materiale difficile da riciclare, ma crea anche un elemento decorativo originale e resistente per il tuo giardino.",
      difficulty: "Medio",
      imageUrl: "https://images.unsplash.com/photo-1516992654410-9309d4587e94?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80",
      userId: demoUser.id,
      isPublic: true,
      estimatedTime: 3,
      timeUnit: "ore",
      instructions: [
        "Lava e pulisci accuratamente il pneumatico con acqua e sapone",
        "Dipingi l'esterno con vernice resistente all'acqua in 2-3 mani",
        "Avvolgi la corda decorativa attorno al pneumatico fissandola con colla",
        "Riempi il fondo con ghiaia per il drenaggio dell'acqua",
        "Aggiungi terriccio e pianta le tue piante preferite",
        "Applica un sigillante trasparente per proteggere la vernice"
      ],
      requiredMaterials: [
        { name: "Pneumatico usato", quantity: 1, unit: "pezzo" },
        { name: "Vernice per esterni", quantity: 0.5, unit: "litro" },
        { name: "Corda decorativa", quantity: 2, unit: "metro" },
        { name: "Ghiaia", quantity: 1, unit: "kg" },
        { name: "Terriccio", quantity: 5, unit: "litro" }
      ],
      requiredTools: [
        { name: "Pennello", link: "https://www.amazon.com/dp/example3" },
        { name: "Forbici", link: "https://www.amazon.com/dp/example4" },
        { name: "Pistola colla a caldo", link: "https://www.amazon.com/dp/example6" }
      ],
      isCommunityProject: false,
      completionPercentage: 0,
      environmentalImpact: {
        materialsRecycled: 8.5,
        moneySaved: 45,
        carbonFootprintReduction: 3.2
      }
    });

    const project3 = this.createProject({
      name: "Libreria da cassette",
      description: "Costruisci una libreria modulare usando vecchie cassette di legno. Un progetto versatile e personalizzabile che ti permette di creare un mobile funzionale con materiali di recupero, adattandolo esattamente alle tue esigenze.",
      difficulty: "Avanzato",
      imageUrl: "https://images.unsplash.com/photo-1593526411462-6fcd2a4de63f?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80",
      userId: demoUser.id,
      isPublic: true,
      estimatedTime: 5,
      timeUnit: "ore",
      instructions: [
        "Carteggia le cassette per eliminare schegge e irregolarità",
        "Applica la vernice o la tinta del colore desiderato in 2 mani",
        "Attendi che si asciughi completamente (almeno 24 ore)",
        "Disponi le cassette secondo il design scelto, valutando stabilità",
        "Fissa le cassette tra loro con le viti nei punti di contatto",
        "Aggiungi eventuali piedini o rotelle alla base per proteggere il pavimento",
        "Applica un prodotto protettivo finale come vernice trasparente"
      ],
      requiredMaterials: [
        { name: "Cassette di legno", quantity: 6, unit: "pezzo" },
        { name: "Viti per legno", quantity: 24, unit: "pezzo" },
        { name: "Vernice", quantity: 1, unit: "litro" },
        { name: "Carta vetrata grana media", quantity: 2, unit: "fogli" },
        { name: "Vernice trasparente protettiva", quantity: 0.5, unit: "litro" }
      ],
      requiredTools: [
        { name: "Trapano", link: "https://www.amazon.com/dp/example1" },
        { name: "Carta vetrata", link: "https://www.amazon.com/dp/example5" },
        { name: "Cacciavite", link: "https://www.amazon.com/dp/example2" },
        { name: "Metro", link: "https://www.amazon.com/dp/example7" }
      ],
      isCommunityProject: false,
      completionPercentage: 0,
      environmentalImpact: {
        materialsRecycled: 15.0,
        moneySaved: 150,
        carbonFootprintReduction: 8.5
      }
    });
    
    const project4 = this.createProject({
      name: "Giardino verticale con pallet",
      description: "Crea un giardino verticale utilizzando un pallet di legno riciclato. Un modo fantastico per coltivare piante in spazi ridotti, ideale per balconi o piccoli giardini urbani. Il risultato è un elemento decorativo vivente che purifica l'aria.",
      difficulty: "Medio",
      imageUrl: "https://images.unsplash.com/photo-1532570204997-d00b032756d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80",
      userId: demoUser.id,
      isPublic: true,
      estimatedTime: 4,
      timeUnit: "ore",
      instructions: [
        "Verifica che il pallet non sia trattato con sostanze tossiche (cerca il marchio HT)",
        "Carteggia la superficie per rimuovere schegge e irregolarità",
        "Applica l'impregnante protettivo per esterni su tutta la superficie",
        "Fissa il tessuto non tessuto all'interno per creare le tasche per le piante",
        "Posiziona il pallet nella sua sede finale (è pesante dopo il riempimento)",
        "Riempi le tasche con terriccio e pianta le tue piante preferite",
        "Installa un sistema di irrigazione a goccia (opzionale ma consigliato)"
      ],
      requiredMaterials: [
        { name: "Pallet di legno", quantity: 1, unit: "pezzo" },
        { name: "Tessuto non tessuto", quantity: 2, unit: "metro" },
        { name: "Terriccio", quantity: 10, unit: "litro" },
        { name: "Impregnante protettivo", quantity: 1, unit: "litro" },
        { name: "Piante varie", quantity: 8, unit: "pezzo" },
        { name: "Punti metallici", quantity: 30, unit: "pezzo" }
      ],
      requiredTools: [
        { name: "Graffettatrice", link: "https://www.amazon.com/dp/example8" },
        { name: "Carta vetrata", link: "https://www.amazon.com/dp/example5" },
        { name: "Pennello", link: "https://www.amazon.com/dp/example3" },
        { name: "Forbici", link: "https://www.amazon.com/dp/example4" }
      ],
      isCommunityProject: false,
      completionPercentage: 0
    });
    
    const project5 = this.createProject({
      name: "Pouf da pneumatici",
      description: "Trasforma vecchi pneumatici in comodi pouf per il soggiorno o il giardino. Una soluzione creativa al problema dei pneumatici usati che crea un elemento d'arredo funzionale, resistente e sorprendentemente confortevole.",
      difficulty: "Avanzato",
      imageUrl: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80",
      userId: demoUser.id,
      isPublic: true,
      estimatedTime: 6,
      timeUnit: "ore",
      instructions: [
        "Pulisci accuratamente il pneumatico rimuovendo sporco e residui",
        "Taglia il compensato in due cerchi delle dimensioni del pneumatico",
        "Fissa un cerchio alla base del pneumatico con le viti",
        "Avvolgi la corda attorno al pneumatico fino a coprirlo completamente",
        "Taglia la gommapiuma a misura per il cuscino superiore",
        "Crea una fodera con il tessuto per il cuscino e inserisci la gommapiuma",
        "Fissa il cuscino al cerchio di compensato superiore",
        "Posiziona e fissa il coperchio superiore con le cerniere"
      ],
      requiredMaterials: [
        { name: "Pneumatico usato", quantity: 1, unit: "pezzo" },
        { name: "Compensato", quantity: 1, unit: "metro quadro" },
        { name: "Corda spessa", quantity: 20, unit: "metro" },
        { name: "Gommapiuma", quantity: 1, unit: "metro quadro" },
        { name: "Tessuto resistente", quantity: 1.5, unit: "metro" },
        { name: "Viti per legno", quantity: 16, unit: "pezzo" },
        { name: "Cerniere", quantity: 2, unit: "pezzo" }
      ],
      requiredTools: [
        { name: "Trapano", link: "https://www.amazon.com/dp/example1" },
        { name: "Sega circolare", link: "https://www.amazon.com/dp/example9" },
        { name: "Pistola colla a caldo", link: "https://www.amazon.com/dp/example6" },
        { name: "Macchina da cucire", link: "https://www.amazon.com/dp/example10" }
      ],
      isCommunityProject: false,
      completionPercentage: 0
    });
    
    const project6 = this.createProject({
      name: "Lampada da tavolo con tubi idraulici",
      description: "Crea una lampada da tavolo industriale utilizzando tubi idraulici riciclati. Un progetto che combina funzionalità e stile, creando un elemento d'illuminazione unico che sarà sicuramente un punto focale nella tua stanza.",
      difficulty: "Medio",
      imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80",
      userId: demoUser.id,
      isPublic: true,
      estimatedTime: 3,
      timeUnit: "ore",
      instructions: [
        "Pulisci accuratamente tutti i tubi e i raccordi",
        "Taglia i tubi nelle lunghezze necessarie secondo il design scelto",
        "Assembla la struttura avvitando i tubi ai raccordi",
        "Installa il portalampada all'estremità superiore del tubo verticale",
        "Fai passare il cavo elettrico attraverso i tubi",
        "Collega il cavo all'interruttore e alla spina",
        "Fissa la base con il dado di fissaggio per garantire stabilità",
        "Installa la lampadina e testa il funzionamento"
      ],
      requiredMaterials: [
        { name: "Tubi idraulici", quantity: 3, unit: "pezzo" },
        { name: "Raccordi a T", quantity: 2, unit: "pezzo" },
        { name: "Raccordi a gomito", quantity: 2, unit: "pezzo" },
        { name: "Portalampada", quantity: 1, unit: "pezzo" },
        { name: "Cavo elettrico", quantity: 2, unit: "metro" },
        { name: "Interruttore", quantity: 1, unit: "pezzo" },
        { name: "Spina", quantity: 1, unit: "pezzo" },
        { name: "Lampadina Edison vintage", quantity: 1, unit: "pezzo" }
      ],
      requiredTools: [
        { name: "Chiave inglese", link: "https://www.amazon.com/dp/example11" },
        { name: "Tagliatubi", link: "https://www.amazon.com/dp/example12" },
        { name: "Cacciavite", link: "https://www.amazon.com/dp/example2" },
        { name: "Nastro isolante", link: "https://www.amazon.com/dp/example13" }
      ],
      isCommunityProject: false,
      completionPercentage: 0
    });
    
    const project7 = this.createProject({
      name: "Portavasi sospesi con macramè",
      description: "Crea eleganti portavasi sospesi utilizzando la tecnica del macramè. Questi supporti per piante aggiungeranno un tocco boho-chic alla tua casa, facendo sembrare le tue piante d'appartamento come vere opere d'arte fluttuanti.",
      difficulty: "Facile",
      imageUrl: "https://images.unsplash.com/photo-1615884241839-9a5a6e2b3a2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80",
      userId: demoUser.id,
      isPublic: true,
      estimatedTime: 2,
      timeUnit: "ore",
      instructions: [
        "Taglia la corda in 8 pezzi di lunghezza uguale (circa 3 metri ciascuno)",
        "Raggruppa le corde e piegale a metà per creare un anello in cima",
        "Inizia a realizzare i nodi di base del macramè sotto l'anello",
        "Continua a creare motivi alternando nodi quadrati e spirali",
        "Forma una rete che si stringe verso il basso per sostenere il vaso",
        "Termina con una serie di nodi alla base per fissare la struttura",
        "Inserisci il vaso nel supporto e regola l'altezza desiderata"
      ],
      requiredMaterials: [
        { name: "Corda di cotone", quantity: 24, unit: "metro" },
        { name: "Anello in legno o metallo", quantity: 1, unit: "pezzo" },
        { name: "Perle in legno (opzionali)", quantity: 10, unit: "pezzo" }
      ],
      requiredTools: [
        { name: "Forbici", link: "https://www.amazon.com/dp/example4" },
        { name: "Metro", link: "https://www.amazon.com/dp/example7" }
      ],
      isCommunityProject: false,
      completionPercentage: 0
    });
    
    const project8 = this.createProject({
      name: "Contenitori organizer da scatole di cereali",
      description: "Trasforma le scatole di cereali vuote in eleganti organizer per scrivania o cassetti. Un modo semplice ed economico per ridurre i rifiuti e organizzare piccoli oggetti, documenti o forniture per ufficio con stile personalizzato.",
      difficulty: "Facile",
      imageUrl: "https://images.unsplash.com/photo-1602329528682-aebeadd00c2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80",
      userId: demoUser.id,
      isPublic: true,
      estimatedTime: 1,
      timeUnit: "ore",
      instructions: [
        "Taglia la scatola di cereali all'altezza desiderata (solitamente in diagonale)",
        "Ricopri l'esterno e il bordo con carta decorativa o tessuto",
        "Fissa la carta/tessuto con colla per carta o nastro biadesivo",
        "Ricopri l'interno con carta colorata coordinata",
        "Aggiungi etichette o decorazioni personalizzate",
        "Applica una mano di colla vinilica diluita per sigillare la carta",
        "Lascia asciugare completamente prima dell'uso"
      ],
      requiredMaterials: [
        { name: "Scatole di cereali vuote", quantity: 3, unit: "pezzo" },
        { name: "Carta decorativa o tessuto", quantity: 2, unit: "fogli" },
        { name: "Colla per carta", quantity: 1, unit: "pezzo" },
        { name: "Carta colorata per interno", quantity: 2, unit: "fogli" },
        { name: "Etichette (opzionali)", quantity: 3, unit: "pezzo" }
      ],
      requiredTools: [
        { name: "Forbici", link: "https://www.amazon.com/dp/example4" },
        { name: "Righello", link: "https://www.amazon.com/dp/example14" },
        { name: "Matita", link: "https://www.amazon.com/dp/example15" }
      ],
      isCommunityProject: false,
      completionPercentage: 0
    });
    
    const project9 = this.createProject({
      name: "Borsa da vecchi jeans",
      description: "Trasforma un vecchio paio di jeans in una borsa pratica e alla moda. Un progetto perfetto per dare nuova vita a jeans consumati o passati di moda, creando un accessorio unico e personale che riduce i rifiuti tessili.",
      difficulty: "Medio",
      imageUrl: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80",
      userId: demoUser.id,
      isPublic: true,
      estimatedTime: 3,
      timeUnit: "ore",
      instructions: [
        "Taglia le gambe dei jeans sotto le tasche posteriori",
        "Cuci il fondo per chiudere la borsa, rovesciando il tessuto",
        "Usa una parte delle gambe per creare una tracolla o manici",
        "Cuci la tracolla/manici alla borsa, rinforzando con punti doppi",
        "Aggiungi una fodera interna con tasca usando stoffa di recupero",
        "Applica bottoni, patch o ricami per personalizzare la borsa",
        "Aggiungi una chiusura (cerniera, bottone o velcro) se desiderato"
      ],
      requiredMaterials: [
        { name: "Jeans vecchi", quantity: 1, unit: "pezzo" },
        { name: "Filo resistente", quantity: 1, unit: "rocchetto" },
        { name: "Stoffa per fodera", quantity: 0.5, unit: "metro" },
        { name: "Bottoni o decorazioni", quantity: 5, unit: "pezzo" }
      ],
      requiredTools: [
        { name: "Macchina da cucire", link: "https://www.amazon.com/dp/example10" },
        { name: "Forbici da stoffa", link: "https://www.amazon.com/dp/example16" },
        { name: "Aghi", link: "https://www.amazon.com/dp/example17" },
        { name: "Spilli", link: "https://www.amazon.com/dp/example18" }
      ],
      isCommunityProject: false,
      completionPercentage: 0
    });

    // Create a community project
    const communityProject = this.createProject({
      name: "Installazione \"Mare Pulito\"",
      description: "Un'installazione artistica collaborativa che utilizza plastica raccolta dalle spiagge per creare un'opera che sensibilizzi sul problema dell'inquinamento marino. Un progetto comunitario che unisce arte, ecologia e sensibilizzazione sociale per un impatto ambientale positivo.",
      difficulty: "Medio",
      imageUrl: "https://images.unsplash.com/photo-1534889196564-a6799df68403?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80",
      userId: demoUser.id,
      isPublic: true,
      estimatedTime: 40,
      timeUnit: "ore",
      instructions: [
        "Organizzare una giornata di pulizia della spiaggia con i volontari",
        "Raccogliere plastica e rifiuti dalle spiagge usando guanti e sacchi",
        "Pulire, sterilizzare e separare i materiali per tipo e colore",
        "Progettare l'installazione in gruppo attraverso un workshop collaborativo",
        "Creare elementi decorativi individuali con la plastica raccolta",
        "Fissare gli elementi decorativi alla struttura principale",
        "Assemblare l'installazione completa in uno spazio pubblico",
        "Organizzare un evento inaugurale con pannelli informativi sul problema dell'inquinamento"
      ],
      requiredMaterials: [
        { name: "Plastica raccolta", quantity: 50, unit: "kg" },
        { name: "Cavi metallici", quantity: 10, unit: "metro" },
        { name: "Supporti in legno riciclato", quantity: 5, unit: "pezzo" },
        { name: "Rete metallica", quantity: 8, unit: "metro quadro" },
        { name: "Colla resistente all'acqua", quantity: 3, unit: "litro" },
        { name: "Vernice acrilica", quantity: 5, unit: "litro" },
        { name: "Pannelli informativi", quantity: 4, unit: "pezzo" }
      ],
      requiredTools: [
        { name: "Forbici", link: "https://www.amazon.com/dp/example4" },
        { name: "Pistola per colla a caldo", link: "https://www.amazon.com/dp/example6" }
      ],
      isCommunityProject: true,
      completionPercentage: 68
    });

    // Add project participants
    this.addProjectParticipant({
      projectId: communityProject.id,
      userId: demoUser.id,
      role: "admin"
    });

    // Create another community project
    const communityProject2 = this.createProject({
      name: "Giardino comunitario",
      description: "Creazione di vasi e sistemi di irrigazione da materiali riciclati per il parco cittadino.",
      difficulty: "Facile",
      imageUrl: "",
      userId: demoUser.id,
      isPublic: true,
      estimatedTime: 20,
      timeUnit: "ore",
      instructions: [
        "Raccogliere contenitori per creare vasi",
        "Preparare il sistema di irrigazione",
        "Piantare piante e fiori",
        "Installare nel parco cittadino"
      ],
      requiredMaterials: [
        { name: "Contenitori di plastica", quantity: 20, unit: "pezzo" },
        { name: "Tubi per irrigazione", quantity: 15, unit: "metro" },
        { name: "Terriccio", quantity: 50, unit: "kg" }
      ],
      requiredTools: [
        { name: "Forbici", link: "https://www.amazon.com/dp/example4" },
        { name: "Pala", link: "https://www.amazon.com/dp/example7" }
      ],
      isCommunityProject: true,
      completionPercentage: 45
    });

    const communityProject3 = this.createProject({
      name: "Panchine da pallet",
      description: "Costruzione di panchine utilizzando pallet riciclati per la biblioteca comunale.",
      difficulty: "Medio",
      imageUrl: "",
      userId: demoUser.id,
      isPublic: true,
      estimatedTime: 30,
      timeUnit: "ore",
      instructions: [
        "Selezionare i pallet in buono stato",
        "Carteggiare e pulire i pallet",
        "Assemblare secondo il modello",
        "Verniciare e proteggere il legno"
      ],
      requiredMaterials: [
        { name: "Pallet", quantity: 8, unit: "pezzo" },
        { name: "Viti per legno", quantity: 40, unit: "pezzo" },
        { name: "Vernice protettiva", quantity: 2, unit: "litro" }
      ],
      requiredTools: [
        { name: "Trapano", link: "https://www.amazon.com/dp/example1" },
        { name: "Sega", link: "https://www.amazon.com/dp/example8" }
      ],
      isCommunityProject: true,
      completionPercentage: 78
    });

    // Create some events
    const event1 = this.createEvent({
      title: "Workshop di riciclo creativo",
      description: "Impara a creare oggetti d'arredo con materiali di recupero.",
      date: new Date("2023-06-15T14:00:00"),
      endDate: new Date("2023-06-15T17:00:00"),
      location: "Centro culturale, Milano",
      imageUrl: "",
      createdBy: demoUser.id,
      maxParticipants: 20
    });

    const event2 = this.createEvent({
      title: "Raccolta plastica in spiaggia",
      description: "Unisciti a noi per raccogliere plastica e realizzare un'installazione artistica.",
      date: new Date("2023-06-22T09:00:00"),
      endDate: new Date("2023-06-22T13:00:00"),
      location: "Spiaggia Libera, Rimini",
      imageUrl: "",
      createdBy: demoUser.id,
      projectId: communityProject.id,
      maxParticipants: 30
    });

    // Add event participants
    this.addEventParticipant({
      eventId: event1.id,
      userId: demoUser.id
    });

    this.addEventParticipant({
      eventId: event2.id,
      userId: demoUser.id
    });

    // Create environmental impact
    this.updateEnvironmentalImpact(demoUser.id, {
      userId: demoUser.id,
      materialsRecycled: 2.5,
      projectsCompleted: 3,
      moneySaved: 15,
      carbonFootprint: 5
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    
    // Create initial environmental impact record
    this.updateEnvironmentalImpact(id, {
      userId: id,
      materialsRecycled: 0,
      projectsCompleted: 0,
      moneySaved: 0,
      carbonFootprint: 0
    });
    
    return user;
  }

  // Material Types
  async getMaterialTypes(): Promise<MaterialType[]> {
    return Array.from(this.materialTypes.values());
  }

  async getMaterialType(id: number): Promise<MaterialType | undefined> {
    return this.materialTypes.get(id);
  }

  async createMaterialType(insertMaterialType: InsertMaterialType): Promise<MaterialType> {
    const id = this.materialTypeIdCounter++;
    const materialType: MaterialType = { ...insertMaterialType, id };
    this.materialTypes.set(id, materialType);
    return materialType;
  }

  // Materials
  async getMaterials(): Promise<Material[]> {
    return Array.from(this.materials.values());
  }

  async getMaterialsByUser(userId: number): Promise<Material[]> {
    return Array.from(this.materials.values()).filter(
      (material) => material.userId === userId
    );
  }

  async getMaterialsByCompany(companyId: number): Promise<Material[]> {
    return Array.from(this.materials.values()).filter(
      (material) => material.companyId === companyId
    );
  }

  async getMaterial(id: number): Promise<Material | undefined> {
    return this.materials.get(id);
  }

  async createMaterial(insertMaterial: InsertMaterial): Promise<Material> {
    const id = this.materialIdCounter++;
    const material: Material = { 
      ...insertMaterial, 
      id, 
      createdAt: new Date() 
    };
    this.materials.set(id, material);
    return material;
  }

  async updateMaterial(id: number, material: Partial<InsertMaterial>): Promise<Material> {
    const existingMaterial = this.materials.get(id);
    if (!existingMaterial) {
      throw new Error(`Material with id ${id} not found`);
    }
    
    const updatedMaterial: Material = { ...existingMaterial, ...material };
    this.materials.set(id, updatedMaterial);
    return updatedMaterial;
  }

  async deleteMaterial(id: number): Promise<boolean> {
    return this.materials.delete(id);
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProjectsByUser(userId: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.userId === userId
    );
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.projectIdCounter++;
    const project: Project = { 
      ...insertProject, 
      id, 
      createdAt: new Date()
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project> {
    const existingProject = this.projects.get(id);
    if (!existingProject) {
      throw new Error(`Project with id ${id} not found`);
    }
    
    const updatedProject: Project = { ...existingProject, ...project };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  async getCommunityProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.isCommunityProject
    );
  }

  // Events
  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.eventIdCounter++;
    const event: Event = { 
      ...insertEvent, 
      id, 
      createdAt: new Date() 
    };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event> {
    const existingEvent = this.events.get(id);
    if (!existingEvent) {
      throw new Error(`Event with id ${id} not found`);
    }
    
    const updatedEvent: Event = { ...existingEvent, ...event };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteEvent(id: number): Promise<boolean> {
    return this.events.delete(id);
  }

  // Event Participants
  async getEventParticipants(eventId: number): Promise<EventParticipant[]> {
    return Array.from(this.eventParticipants.values()).filter(
      (participant) => participant.eventId === eventId
    );
  }

  async addEventParticipant(insertParticipant: InsertEventParticipant): Promise<EventParticipant> {
    const id = this.eventParticipantIdCounter++;
    const participant: EventParticipant = { 
      ...insertParticipant, 
      id, 
      registeredAt: new Date() 
    };
    this.eventParticipants.set(id, participant);
    return participant;
  }

  async removeEventParticipant(eventId: number, userId: number): Promise<boolean> {
    const participantId = Array.from(this.eventParticipants.entries()).find(
      ([_, participant]) => participant.eventId === eventId && participant.userId === userId
    )?.[0];
    
    if (participantId) {
      return this.eventParticipants.delete(participantId);
    }
    
    return false;
  }

  // Companies
  async getCompanies(): Promise<Company[]> {
    return Array.from(this.companies.values());
  }

  async getCompany(id: number): Promise<Company | undefined> {
    return this.companies.get(id);
  }

  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const id = this.companyIdCounter++;
    const company: Company = { ...insertCompany, id };
    this.companies.set(id, company);
    return company;
  }

  // Environmental Impact
  async getEnvironmentalImpact(userId: number): Promise<EnvironmentalImpact | undefined> {
    return Array.from(this.environmentalImpacts.values()).find(
      (impact) => impact.userId === userId
    );
  }

  async updateEnvironmentalImpact(userId: number, impact: Partial<InsertEnvironmentalImpact>): Promise<EnvironmentalImpact> {
    const existingImpact = Array.from(this.environmentalImpacts.values()).find(
      (i) => i.userId === userId
    );
    
    if (existingImpact) {
      const updatedImpact: EnvironmentalImpact = { 
        ...existingImpact, 
        ...impact, 
        updatedAt: new Date() 
      };
      this.environmentalImpacts.set(existingImpact.id, updatedImpact);
      return updatedImpact;
    } else {
      const id = this.environmentalImpactIdCounter++;
      const newImpact: EnvironmentalImpact = { 
        id, 
        userId, 
        materialsRecycled: impact.materialsRecycled || 0, 
        projectsCompleted: impact.projectsCompleted || 0, 
        moneySaved: impact.moneySaved || 0, 
        carbonFootprint: impact.carbonFootprint || 0, 
        updatedAt: new Date() 
      };
      this.environmentalImpacts.set(id, newImpact);
      return newImpact;
    }
  }

  // Project Participants
  async getProjectParticipants(projectId: number): Promise<ProjectParticipant[]> {
    return Array.from(this.projectParticipants.values()).filter(
      (participant) => participant.projectId === projectId
    );
  }

  async addProjectParticipant(insertParticipant: InsertProjectParticipant): Promise<ProjectParticipant> {
    const id = this.projectParticipantIdCounter++;
    const participant: ProjectParticipant = { 
      ...insertParticipant, 
      id, 
      joinedAt: new Date() 
    };
    this.projectParticipants.set(id, participant);
    return participant;
  }

  async removeProjectParticipant(projectId: number, userId: number): Promise<boolean> {
    const participantId = Array.from(this.projectParticipants.entries()).find(
      ([_, participant]) => participant.projectId === projectId && participant.userId === userId
    )?.[0];
    
    if (participantId) {
      return this.projectParticipants.delete(participantId);
    }
    
    return false;
  }
}

export const storage = new MemStorage();

import {
  User, InsertUser, Material, InsertMaterial, MaterialType, InsertMaterialType,
  Project, InsertProject, Event, InsertEvent, EventParticipant, InsertEventParticipant,
  Company, InsertCompany, EnvironmentalImpact, InsertEnvironmentalImpact,
  ProjectParticipant, InsertProjectParticipant
} from "../shared/schema";

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

export class OptimizedMemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private materialTypes: Map<number, MaterialType> = new Map();
  private materials: Map<number, Material> = new Map();
  private projects: Map<number, Project> = new Map();
  private events: Map<number, Event> = new Map();
  private eventParticipants: Map<number, EventParticipant> = new Map();
  private companies: Map<number, Company> = new Map();
  private environmentalImpacts: Map<number, EnvironmentalImpact> = new Map();
  private projectParticipants: Map<number, ProjectParticipant> = new Map();

  private userIdCounter = 1;
  private materialTypeIdCounter = 1;
  private materialIdCounter = 1;
  private projectIdCounter = 1;
  private eventIdCounter = 1;
  private eventParticipantIdCounter = 1;
  private companyIdCounter = 1;
  private environmentalImpactIdCounter = 1;
  private projectParticipantIdCounter = 1;

  constructor() {
    this.initializeOptimizedData();
  }

  private initializeOptimizedData() {
    // Create material types efficiently
    const materialTypesData = [
      { name: "Plastica", description: "Bottiglie, contenitori, sacchetti", icon: "recycle", color: "#4CAF50" },
      { name: "Vetro", description: "Bottiglie, barattoli, bicchieri", icon: "wine", color: "#2196F3" },
      { name: "Carta", description: "Cartone, giornali, riviste", icon: "file", color: "#FF9800" },
      { name: "Metallo", description: "Lattine, componenti metallici", icon: "zap", color: "#9E9E9E" },
      { name: "Legno", description: "Mobili, pallet, scarti", icon: "tree", color: "#8BC34A" },
      { name: "Tessuto", description: "Abiti, tende, biancheria", icon: "shirt", color: "#E91E63" },
      { name: "Elettronica", description: "Componenti elettronici", icon: "cpu", color: "#9C27B0" },
      { name: "Organico", description: "Scarti compostabili", icon: "leaf", color: "#4CAF50" }
    ];

    const types: MaterialType[] = [];
    for (const typeData of materialTypesData) {
      const id = this.materialTypeIdCounter++;
      const type: MaterialType = { id, ...typeData };
      this.materialTypes.set(id, type);
      types.push(type);
    }

    // Create demo user
    const userId = this.userIdCounter++;
    const demoUser: User = {
      id: userId,
      username: "demo_user",
      password: "demo123",
      displayName: "Utente Demo",
      email: "demo@ecomaker.it",
      createdAt: new Date()
    };
    this.users.set(userId, demoUser);

    // Create companies
    const companiesData = [
      { name: "EcoLegno srl", description: "Azienda specializzata nel recupero del legno", location: "Milano, Italia", logoUrl: "" },
      { name: "PlasticaVerde", description: "Riciclo innovativo della plastica", location: "Roma, Italia", logoUrl: "" },
      { name: "VetroArt", description: "Creazioni artistiche con vetro riciclato", location: "Venezia, Italia", logoUrl: "" }
    ];

    for (const companyData of companiesData) {
      const id = this.companyIdCounter++;
      const company: Company = { id, ...companyData };
      this.companies.set(id, company);
    }

    // Create materials efficiently
    const materialsData = [
      { name: "Bottiglie PET", description: "Bottiglie trasparenti", typeId: types[0].id, quantity: "35", unit: "pezzo" },
      { name: "Barattoli vetro", description: "Barattoli vari formati", typeId: types[1].id, quantity: "20", unit: "pezzo" },
      { name: "Scatole cartone", description: "Cartone ondulato", typeId: types[2].id, quantity: "15", unit: "pezzo" },
      { name: "Lattine alluminio", description: "Lattine bevande", typeId: types[3].id, quantity: "50", unit: "pezzo" },
      { name: "Pallet legno", description: "Pallet dismessi", typeId: types[4].id, quantity: "8", unit: "pezzo" },
      { name: "T-shirt cotone", description: "Magliette usate", typeId: types[5].id, quantity: "25", unit: "pezzo" }
    ];

    for (const materialData of materialsData) {
      const id = this.materialIdCounter++;
      const material: Material = {
        id,
        userId: demoUser.id,
        imageUrl: "",
        createdAt: new Date(),
        isAvailable: true,
        location: "Magazzino",
        ...materialData
      };
      this.materials.set(id, material);
    }

    // Create projects with environmental impact
    const projectsData = [
      {
        name: "Lampada da bottiglia di vetro",
        description: "Trasforma bottiglie di vetro in eleganti lampade da tavolo",
        instructions: ["Pulire accuratamente la bottiglia", "Praticare foro per cavo", "Inserire kit elettrico", "Assemblare paralume"],
        difficulty: "Medio",
        estimatedTime: 120,
        timeUnit: "minuti",
        requiredMaterials: [{ name: "Bottiglia vetro", quantity: 1, unit: "pezzo" }],
        requiredTools: [{ name: "Trapano", link: "" }],
        environmentalImpact: { materialsRecycled: 1, moneySaved: 25, carbonFootprintReduction: 2.5 },
        imageUrl: "",
        isPublic: true,
        category: "Illuminazione"
      },
      {
        name: "Porta oggetti da contenitori plastica",
        description: "Organizzatori modulari da contenitori di detersivi",
        instructions: ["Tagliare contenitori", "Levigare bordi", "Decorare superficie", "Assemblare moduli"],
        difficulty: "Facile",
        estimatedTime: 90,
        timeUnit: "minuti",
        requiredMaterials: [{ name: "Contenitori plastica", quantity: 3, unit: "pezzo" }],
        requiredTools: [{ name: "Cutter", link: "" }],
        environmentalImpact: { materialsRecycled: 3, moneySaved: 15, carbonFootprintReduction: 1.8 },
        imageUrl: "",
        isPublic: true,
        category: "Organizzazione"
      }
    ];

    for (const projectData of projectsData) {
      const id = this.projectIdCounter++;
      const project: Project = {
        id,
        userId: demoUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...projectData
      };
      this.projects.set(id, project);
    }

    // Create events
    const eventsData = [
      {
        title: "Workshop di riciclo creativo",
        description: "Impara a creare oggetti d'arredo con materiali di recupero",
        date: new Date("2023-06-15T14:00:00.000Z"),
        endDate: new Date("2023-06-15T17:00:00.000Z"),
        location: "Centro culturale, Milano",
        imageUrl: "",
        maxParticipants: 20
      },
      {
        title: "Raccolta plastica in spiaggia",
        description: "Unisciti per raccogliere plastica e creare arte",
        date: new Date("2023-06-22T09:00:00.000Z"),
        endDate: new Date("2023-06-22T13:00:00.000Z"),
        location: "Spiaggia Libera, Rimini",
        imageUrl: "",
        maxParticipants: 30
      }
    ];

    for (const eventData of eventsData) {
      const id = this.eventIdCounter++;
      const event: Event = {
        id,
        createdAt: new Date(),
        ...eventData
      };
      this.events.set(id, event);
    }

    // Create environmental impact
    const impactId = this.environmentalImpactIdCounter++;
    const impact: EnvironmentalImpact = {
      id: impactId,
      userId: demoUser.id,
      materialsRecycled: 0,
      projectsCompleted: 0,
      moneySaved: 0,
      carbonFootprint: 0,
      updatedAt: new Date()
    };
    this.environmentalImpacts.set(userId, impact);
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
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
    return Array.from(this.materials.values()).filter(m => m.userId === userId);
  }

  async getMaterialsByCompany(companyId: number): Promise<Material[]> {
    return Array.from(this.materials.values()).filter(m => m.userId === companyId);
  }

  async getMaterial(id: number): Promise<Material | undefined> {
    return this.materials.get(id);
  }

  async createMaterial(insertMaterial: InsertMaterial): Promise<Material> {
    const id = this.materialIdCounter++;
    const material: Material = { 
      ...insertMaterial, 
      id, 
      createdAt: new Date(),
      isAvailable: insertMaterial.isAvailable ?? true
    };
    this.materials.set(id, material);
    return material;
  }

  async updateMaterial(id: number, material: Partial<InsertMaterial>): Promise<Material> {
    const existingMaterial = this.materials.get(id);
    if (!existingMaterial) throw new Error("Material not found");
    
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
    return Array.from(this.projects.values()).filter(p => p.userId === userId);
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.projectIdCounter++;
    const project: Project = { 
      ...insertProject, 
      id, 
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project> {
    const existingProject = this.projects.get(id);
    if (!existingProject) throw new Error("Project not found");
    
    const updatedProject: Project = { ...existingProject, ...project, updatedAt: new Date() };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  async getCommunityProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(p => p.isPublic);
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
    const event: Event = { ...insertEvent, id, createdAt: new Date() };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event> {
    const existingEvent = this.events.get(id);
    if (!existingEvent) throw new Error("Event not found");
    
    const updatedEvent: Event = { ...existingEvent, ...event };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteEvent(id: number): Promise<boolean> {
    return this.events.delete(id);
  }

  // Event Participants
  async getEventParticipants(eventId: number): Promise<EventParticipant[]> {
    return Array.from(this.eventParticipants.values()).filter(p => p.eventId === eventId);
  }

  async addEventParticipant(insertParticipant: InsertEventParticipant): Promise<EventParticipant> {
    const id = this.eventParticipantIdCounter++;
    const participant: EventParticipant = { ...insertParticipant, id, joinedAt: new Date() };
    this.eventParticipants.set(id, participant);
    return participant;
  }

  async removeEventParticipant(eventId: number, userId: number): Promise<boolean> {
    for (const [id, participant] of this.eventParticipants.entries()) {
      if (participant.eventId === eventId && participant.userId === userId) {
        return this.eventParticipants.delete(id);
      }
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
    return this.environmentalImpacts.get(userId);
  }

  async updateEnvironmentalImpact(userId: number, impact: Partial<InsertEnvironmentalImpact>): Promise<EnvironmentalImpact> {
    const existing = this.environmentalImpacts.get(userId);
    if (existing) {
      const updatedImpact: EnvironmentalImpact = { 
        ...existing, 
        ...impact, 
        updatedAt: new Date() 
      };
      this.environmentalImpacts.set(userId, updatedImpact);
      return updatedImpact;
    } else {
      const id = this.environmentalImpactIdCounter++;
      const newImpact: EnvironmentalImpact = { 
        id, 
        userId, 
        materialsRecycled: 0,
        projectsCompleted: 0,
        moneySaved: 0,
        carbonFootprint: 0,
        ...impact, 
        updatedAt: new Date() 
      };
      this.environmentalImpacts.set(userId, newImpact);
      return newImpact;
    }
  }

  // Project Participants
  async getProjectParticipants(projectId: number): Promise<ProjectParticipant[]> {
    return Array.from(this.projectParticipants.values()).filter(p => p.projectId === projectId);
  }

  async addProjectParticipant(insertParticipant: InsertProjectParticipant): Promise<ProjectParticipant> {
    const id = this.projectParticipantIdCounter++;
    const participant: ProjectParticipant = { ...insertParticipant, id, joinedAt: new Date() };
    this.projectParticipants.set(id, participant);
    return participant;
  }

  async removeProjectParticipant(projectId: number, userId: number): Promise<boolean> {
    for (const [id, participant] of this.projectParticipants.entries()) {
      if (participant.projectId === projectId && participant.userId === userId) {
        return this.projectParticipants.delete(id);
      }
    }
    return false;
  }
}

export const optimizedStorage = new OptimizedMemStorage();
export type User = {
  id: number;
  username: string;
  displayName?: string;
  email?: string;
};

export type MaterialType = {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
};

export type Material = {
  id: number;
  name: string;
  description?: string;
  typeId: number;
  imageUrl?: string;
  userId: number;
  quantity: number;
  unit: string;
  createdAt: string;
  isAvailable: boolean;
  location?: string;
  companyId?: number;
};

export type Project = {
  id: number;
  name: string;
  description?: string;
  difficulty: string;
  imageUrl?: string;
  beforeImageUrl?: string; // Immagine "prima" per la trasformazione AR
  userId: number;
  createdAt: string;
  isPublic: boolean;
  estimatedTime?: number;
  timeUnit?: string;
  instructions: any;
  requiredMaterials: any;
  requiredTools: any;
  isCommunityProject: boolean;
  completionPercentage: number;
  category?: string; // Categoria del progetto (lampada, vaso, ecc.)
  // Campi per AR
  modelUrl?: string; // URL del modello 3D se disponibile
  // Campi per crowdfunding
  isCrowdfunded?: boolean;
  fundingGoal?: number | string;
  currentFunding?: number | string;
  fundingMilestones?: CrowdfundingMilestone[];
  fundingDeadline?: string;
  // Impatto ambientale
  environmentalImpact?: {
    materialsRecycled: number;
    moneySaved: number;
    carbonFootprintReduction: number;
  };
};

export type Event = {
  id: number;
  title: string;
  description?: string;
  date: string;
  endDate?: string;
  location?: string;
  imageUrl?: string;
  createdBy: number;
  projectId?: number;
  createdAt: string;
  maxParticipants?: number;
};

export type EventParticipant = {
  id: number;
  eventId: number;
  userId: number;
  registeredAt: string;
};

export type Company = {
  id: number;
  name: string;
  description?: string;
  location?: string;
  logoUrl?: string;
};

export type EnvironmentalImpact = {
  id: number;
  userId: number;
  materialsRecycled: number;
  projectsCompleted: number;
  moneySaved: number;
  carbonFootprint: number;
  updatedAt: string;
};

export type ProjectParticipant = {
  id: number;
  projectId: number;
  userId: number;
  role: string;
  joinedAt: string;
};

export type AIProjectSuggestion = {
  name: string;
  description: string;
  difficulty: string;
  estimatedTime: number;
  timeUnit: string;
  requiredMaterials: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  requiredTools: Array<{
    name: string;
    link?: string;
  }>;
  instructions: string[];
  environmentalImpact: {
    materialsRecycled: number;
    moneySaved: number;
    carbonFootprintReduction: number;
  };
  imageUrl?: string;
};

export type MaterialPhysicalProperties = {
  density?: number;         // g/cm³
  electricalConductivity?: number;  // S/m
  thermalConductivity?: number;     // W/(m·K)
  meltingPoint?: number;    // K
  recyclable?: boolean;
  biodegradable?: boolean;
  renewableSource?: boolean;
  toxicity?: string;        // 'none' | 'low' | 'medium' | 'high'
  energyToProcess?: number; // MJ/kg
  co2Footprint?: number;    // kg CO2/kg
  waterUsage?: number;      // L/kg
  durabilityYears?: number;
  insulationRValue?: number;
  flammability?: string;    // 'non-flammable' | 'self-extinguishing' | 'flammable' | 'highly-flammable'
  uvResistance?: string;    // 'poor' | 'fair' | 'good' | 'excellent'
  acidResistance?: string;  // 'poor' | 'fair' | 'good' | 'excellent'
  alkalineResistance?: string; // 'poor' | 'fair' | 'good' | 'excellent'
};

export type MaterialAnalysisResult = {
  name: string;
  type: string;
  possibleUses: string[];
  recyclingTips: string[];
  // Nuovi campi scientifici da Materials Project API
  physicalProperties?: MaterialPhysicalProperties;
  sustainabilityScore?: number; // Da 0 a 100
  environmentalImpact?: string;
  decompositionTime?: string;
};

export enum DifficultyLevel {
  EASY = "Facile",
  MEDIUM = "Medio",
  ADVANCED = "Avanzato"
}

export enum ProjectStatus {
  NOT_STARTED = "Non iniziato",
  IN_PROGRESS = "In corso",
  COMPLETED = "Completato"
}

export type CrowdfundingMilestone = {
  id: string;
  title: string;
  description: string;
  amount: number;
  completed: boolean;
}

import { pgTable, text, serial, integer, boolean, timestamp, numeric, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ----------------------------------------------------------------------
// 1. UTENTI (AGGIORNATO CON RPG GAMIFICATION)
// ----------------------------------------------------------------------
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
  
  // --- NUOVI CAMPI RPG (Gamification) ---
  avatarType: text("avatar_type").default("solar_sprout"), // solar_sprout, quantum_shroom, etc.
  level: integer("level").default(1),
  xp: integer("xp").default(0),
  credits: integer("credits").default(100), // EcoCredits
  dailyMissions: json("daily_missions").$type<string[]>(), // Es: ["Scan", "Craft"]
  lastLogin: text("last_login"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  email: true,
  avatarType: true, // AGGIUNTO: Permette di scegliere l'avatar
});

// ----------------------------------------------------------------------
// DA QUI IN GIÙ È TUTTO IL TUO VECCHIO CODICE (INTATTO)
// ----------------------------------------------------------------------

// Material types
export const materialTypes = pgTable("material_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  icon: text("icon"),
  color: text("color"),
});

export const insertMaterialTypeSchema = createInsertSchema(materialTypes).pick({
  name: true, 
  description: true,
  icon: true,
  color: true,
});

// Materials
export const materials = pgTable("materials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  typeId: integer("type_id").notNull(),
  imageUrl: text("image_url"),
  userId: integer("user_id").notNull(),
  quantity: numeric("quantity").notNull(),
  unit: text("unit").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  isAvailable: boolean("is_available").default(true),
  location: text("location"),
  companyId: integer("company_id"),
});

export const insertMaterialSchema = createInsertSchema(materials).pick({
  name: true,
  description: true,
  typeId: true,
  imageUrl: true,
  userId: true,
  quantity: true,
  unit: true,
  isAvailable: true,
  location: true,
  companyId: true,
});

// Projects
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  difficulty: text("difficulty").notNull(),
  imageUrl: text("image_url"),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  isPublic: boolean("is_public").default(true),
  estimatedTime: numeric("estimated_time"),
  timeUnit: text("time_unit").default("hours"),
  instructions: json("instructions"),
  requiredMaterials: json("required_materials"),
  requiredTools: json("required_tools"),
  isCommunityProject: boolean("is_community_project").default(false),
  completionPercentage: numeric("completion_percentage").default("0"),
  // Aggiunta campi per crowdfunding
  isCrowdfunded: boolean("is_crowdfunded").default(false),
  fundingGoal: numeric("funding_goal"),
  currentFunding: numeric("current_funding").default("0"),
  fundingMilestones: json("funding_milestones"),
  fundingDeadline: timestamp("funding_deadline"),
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  name: true,
  description: true,
  difficulty: true,
  imageUrl: true,
  userId: true,
  isPublic: true,
  estimatedTime: true,
  timeUnit: true,
  instructions: true,
  requiredMaterials: true,
  requiredTools: true,
  isCommunityProject: true,
  completionPercentage: true,
  // Campi per crowdfunding
  isCrowdfunded: true,
  fundingGoal: true, 
  currentFunding: true,
  fundingMilestones: true,
  fundingDeadline: true,
});

// Events
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  endDate: timestamp("end_date"),
  location: text("location"),
  imageUrl: text("image_url"),
  createdBy: integer("created_by").notNull(),
  projectId: integer("project_id"),
  createdAt: timestamp("created_at").defaultNow(),
  maxParticipants: integer("max_participants"),
});

export const insertEventSchema = createInsertSchema(events).pick({
  title: true,
  description: true,
  date: true,
  endDate: true,
  location: true,
  imageUrl: true,
  createdBy: true,
  projectId: true,
  maxParticipants: true,
});

// Event participants
export const eventParticipants = pgTable("event_participants", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  userId: integer("user_id").notNull(),
  registeredAt: timestamp("registered_at").defaultNow(),
});

export const insertEventParticipantSchema = createInsertSchema(eventParticipants).pick({
  eventId: true,
  userId: true,
});

// Companies
export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  location: text("location"),
  logoUrl: text("logo_url"),
});

export const insertCompanySchema = createInsertSchema(companies).pick({
  name: true,
  description: true,
  location: true,
  logoUrl: true,
});

// Environmental impact
export const environmentalImpact = pgTable("environmental_impact", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  materialsRecycled: numeric("materials_recycled").default("0"),
  projectsCompleted: integer("projects_completed").default(0),
  moneySaved: numeric("money_saved").default("0"),
  carbonFootprint: numeric("carbon_footprint").default("0"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertEnvironmentalImpactSchema = createInsertSchema(environmentalImpact).pick({
  userId: true,
  materialsRecycled: true,
  projectsCompleted: true,
  moneySaved: true,
  carbonFootprint: true,
});

// Project participants for community projects
export const projectParticipants = pgTable("project_participants", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  userId: integer("user_id").notNull(),
  role: text("role").default("member"),
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const insertProjectParticipantSchema = createInsertSchema(projectParticipants).pick({
  projectId: true,
  userId: true,
  role: true,
});

// Kickstarter Files
export const kickstarterFiles = pgTable("kickstarter_files", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  size: integer("size").notNull(),
  format: text("format").notNull(),
  category: text("category").notNull(), // 'campaign', 'pdf', 'executive'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertKickstarterFileSchema = createInsertSchema(kickstarterFiles).pick({
  filename: true,
  title: true,
  description: true,
  content: true,
  size: true,
  format: true,
  category: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type MaterialType = typeof materialTypes.$inferSelect;
export type InsertMaterialType = z.infer<typeof insertMaterialTypeSchema>;

export type Material = typeof materials.$inferSelect;
export type InsertMaterial = z.infer<typeof insertMaterialSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type EventParticipant = typeof eventParticipants.$inferSelect;
export type InsertEventParticipant = z.infer<typeof insertEventParticipantSchema>;

export type Company = typeof companies.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;

export type EnvironmentalImpact = typeof environmentalImpact.$inferSelect;
export type InsertEnvironmentalImpact = z.infer<typeof insertEnvironmentalImpactSchema>;

export type ProjectParticipant = typeof projectParticipants.$inferSelect;
export type InsertProjectParticipant = z.infer<typeof insertProjectParticipantSchema>;

export type KickstarterFile = typeof kickstarterFiles.$inferSelect;
export type InsertKickstarterFile = z.infer<typeof insertKickstarterFileSchema>;

// New comprehensive tables for internal data integration
export const internalProjects = pgTable("internal_projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  difficulty: text("difficulty").notNull(), // "facile", "medio", "difficile"
  estimatedTime: integer("estimated_time").notNull(), // in minutes
  timeUnit: text("time_unit").default("minuti"),
  category: text("category").notNull(),
  materials: json("materials").$type<Array<{name: string, quantity: number, unit: string}>>().notNull(),
  tools: json("tools").$type<Array<{name: string, link?: string}>>().notNull(),
  instructions: json("instructions").$type<string[]>().notNull(),
  environmentalImpact: json("environmental_impact").$type<{
    materialsRecycled: number,
    moneySaved: number,
    carbonFootprintReduction: number
  }>().notNull(),
  imageUrl: text("image_url"),
  tags: json("tags").$type<string[]>().default([]),
  source: text("source").notNull(), // "thingiverse", "openai", "internal"
  sourceId: text("source_id"),
  createdAt: timestamp("created_at").defaultNow()
});

export const internalMaterials = pgTable("internal_materials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // "plastica", "legno", "metallo", etc.
  properties: json("properties").$type<{
    density?: number,
    electricalConductivity?: number,
    thermalConductivity?: number,
    meltingPoint?: number,
    recyclable?: boolean,
    biodegradable?: boolean,
    renewableSource?: boolean,
    toxicity?: string,
    energyToProcess?: number,
    co2Footprint?: number,
    waterUsage?: number,
    durabilityYears?: number
  }>(),
  possibleUses: json("possible_uses").$type<string[]>().notNull(),
  recyclingTips: json("recycling_tips").$type<string[]>().notNull(),
  sustainabilityScore: integer("sustainability_score"), // 0-100
  environmentalImpact: text("environmental_impact"),
  decompositionTime: text("decomposition_time"),
  commonUses: json("common_uses").$type<string[]>().default([]),
  source: text("source").notNull(), // "materials_project", "google_vision", "internal"
  sourceId: text("source_id"),
  createdAt: timestamp("created_at").defaultNow()
});

export const projectMaterialCombinations = pgTable("project_material_combinations", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => internalProjects.id),
  materialId: integer("material_id").references(() => internalMaterials.id),
  quantity: numeric("quantity").notNull(),
  unit: text("unit").notNull(),
  isRequired: boolean("is_required").default(true),
  alternatives: json("alternatives").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow()
});

export const thingiverseCache = pgTable("thingiverse_cache", {
  id: serial("id").primaryKey(),
  thingId: integer("thing_id").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  url: text("url").notNull(),
  imageUrl: text("image_url"),
  creatorName: text("creator_name"),
  likesCount: integer("likes_count").default(0),
  downloadsCount: integer("downloads_count").default(0),
  tags: json("tags").$type<string[]>().default([]),
  categories: json("categories").$type<string[]>().default([]),
  files: json("files").$type<Array<{
    id: number,
    name: string,
    url: string,
    size: number,
    downloadCount: number
  }>>().default([]),
  license: text("license"),
  materials: json("materials").$type<string[]>().default([]),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow()
});

export const amazonProductsCache = pgTable("amazon_products_cache", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  price: text("price").notNull(),
  rating: numeric("rating"),
  imageUrl: text("image_url"),
  affiliateUrl: text("affiliate_url").notNull(),
  category: text("category").notNull(),
  isPrime: boolean("is_prime").default(false),
  searchTerms: json("search_terms").$type<string[]>().notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow()
});

export const aiGeneratedContent = pgTable("ai_generated_content", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // "project", "material_analysis", "recommendation"
  inputData: json("input_data").notNull(),
  outputData: json("output_data").notNull(),
  confidence: numeric("confidence"), // 0-1
  source: text("source").notNull(), // "openai", "google_vision"
  promptUsed: text("prompt_used"),
  createdAt: timestamp("created_at").defaultNow()
});

// --- INCOLLA QUESTO PER RIPARARE IL FINALE DEL FILE ---

export const insertInternalProjectSchema = createInsertSchema(internalProjects).pick({
  name: true,
  description: true,
  difficulty: true,
  estimatedTime: true,
  timeUnit: true,
  category: true,
  materials: true,
  tools: true,
  instructions: true,
  environmentalImpact: true,
  imageUrl: true,
  tags: true,
  source: true,
  sourceId: true
});

export const insertInternalMaterialSchema = createInsertSchema(internalMaterials).pick({
  name: true,
  type: true,
  properties: true,
  possibleUses: true,
  recyclingTips: true,
  sustainabilityScore: true,
  environmentalImpact: true,
  decompositionTime: true,
  commonUses: true,
  source: true,
  sourceId: true
});

export const insertProjectMaterialCombinationSchema = createInsertSchema(projectMaterialCombinations).pick({
  projectId: true,
  materialId: true,
  quantity: true,
  unit: true,
  isRequired: true,
  alternatives: true
});

export const insertThingiverseCacheSchema = createInsertSchema(thingiverseCache).pick({
  thingId: true,
  name: true,
  description: true,
  url: true,
  imageUrl: true,
  creatorName: true,
  likesCount: true,
  downloadsCount: true,
  tags: true,
  categories: true,
  files: true,
  license: true,
  materials: true
});

export const insertAmazonProductsCacheSchema = createInsertSchema(amazonProductsCache).pick({
  title: true,
  description: true,
  price: true,
  rating: true,
  imageUrl: true,
  affiliateUrl: true,
  category: true,
  isPrime: true,
  searchTerms: true
});

export const insertAiGeneratedContentSchema = createInsertSchema(aiGeneratedContent).pick({
  type: true,
  inputData: true,
  outputData: true,
  confidence: true,
  source: true,
  promptUsed: true
});

// Extended types
export type InternalProject = typeof internalProjects.$inferSelect;
export type InternalMaterial = typeof internalMaterials.$inferSelect;
export type ProjectMaterialCombination = typeof projectMaterialCombinations.$inferSelect;
export type ThingiverseCache = typeof thingiverseCache.$inferSelect;
export type AmazonProductsCache = typeof amazonProductsCache.$inferSelect;
export type AiGeneratedContent = typeof aiGeneratedContent.$inferSelect;

export type InsertInternalProject = z.infer<typeof insertInternalProjectSchema>;
export type InsertInternalMaterial = z.infer<typeof insertInternalMaterialSchema>;
export type InsertProjectMaterialCombination = z.infer<typeof insertProjectMaterialCombinationSchema>;
export type InsertThingiverseCache = z.infer<typeof insertThingiverseCacheSchema>;
export type InsertAmazonProductsCache = z.infer<typeof insertAmazonProductsCacheSchema>;
export type InsertAiGeneratedContent = z.infer<typeof insertAiGeneratedContentSchema>;
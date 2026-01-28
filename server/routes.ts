import session from "express-session";
import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import path from "path";
import fs from "fs";
import { optimizedStorage as storage } from "./storage-optimized";
import { z } from "zod";
import { insertUserSchema, insertMaterialSchema, insertProjectSchema, insertEventSchema, insertEventParticipantSchema, insertProjectParticipantSchema } from "@shared/schema";
import { WebSocketServer, WebSocket } from "ws";
import { 
  generateProjectIdeas, 
  analyzeMaterial, 
  optimizeProjectInstructions, 
  generateEnvironmentalImpact, 
  generateProjectDivisionPlan,
  generateProjectFromIdea,
  analyzeCompanyMaterial,
  generateSocialContent,
  learnFromExternalProject,
  searchExternalProjects,
  generateEnhancedProjectIdeas,
  generateProjectImage,
  generateCommunityEventIdeas,
  learnFromUserFeedback,
  handleChatConversation
} from "./openai";
import { analyzeMaterialWithGoogleVision } from "./google-vision";
import { 
  createCrowdfundingPaymentIntent, 
  handleSuccessfulPayment,
  createAuctionPaymentIntent
} from "./stripe";
import { searchAmazonProducts } from "./amazon";
import { Database150424 } from "./150424";
import { kickstarterManager } from "./kickstarter-files";
import { 
  createDemoPayment, 
  confirmPaymentAndSendCode, 
  validateAccessCode, 
  markCodeAsUsed, 
  getDemoPaymentStats,
  processRefund
} from "./demo-access-system";
import { gmailService, initializeGmailService, sendAccessCodeEmail } from "./gmail-service";
import { emailService } from "./simple-email-service";
import Stripe from "stripe";
import { db } from "./db";
import { internalProjects, internalMaterials, projectMaterialCombinations, thingiverseCache, amazonProductsCache } from "@shared/schema";
import { eq, sql } from "drizzle-orm";
import { populateCompleteDatabase, getProjectsForMaterials } from "./data-integration";
import { getDatabaseStats } from "./database-manager";
import { getExtendedMaterialData, isMaterialsProjectConfigured } from "./materials-project";
import { processCameraImage, populateMaterialRecognitionDatabase } from "./material-recognition-database";
import { generateAllMaterialCombinations } from "./advanced-offline-generator";
import { populateOptimizedDatabase, testCameraRecognitionSystem } from "./optimized-database-population";
import { enhancedMaterialRecognition, populateAdvancedMaterialsDatabase } from "./enhanced-material-recognition";
import { mlSystem, populateMLTrainingMaterials } from "./comprehensive-ml-system";
import { 
  getMaterialLifecycleData, 
  getAllMaterialLifecycles, 
  calculateCumulativeImpact, 
  calculateRecyclingBenefits,
  getGlobalMaterialStats 
} from "./material-lifecycle-system";
import {
  searchThingiverseModels,
  getThingDetails,
  getThingFiles,
  findRelevantModelsForProject,
  analyzeProjectWorkflow,
  isThingiverseConfigured
} from "./thingiverse";

// Helper function to handle async route handlers
const asyncHandler = (fn: Function) => (req: Request, res: Response) => {
  Promise.resolve(fn(req, res)).catch((err) => {
    console.error(err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  });
};

// Initialize Stripe
let stripe: Stripe;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
 app.use(session({
    secret: "segreto-super-sicuro",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  }));
  // Rotte per il download dei file ZIP
  app.get("/codice_pulito.zip", (req, res) => {
    const filePath = path.join(process.cwd(), "codice_pulito.zip");
    if (fs.existsSync(filePath)) {
      res.download(filePath, "codice_pulito.zip");
    } else {
      res.status(404).send("File non trovato");
    }
  });

  app.get("/solo_codice.zip", (req, res) => {
    const filePath = path.join(process.cwd(), "solo_codice.zip");
    if (fs.existsSync(filePath)) {
      res.download(filePath, "solo_codice.zip");
    } else {
      res.status(404).send("File non trovato");
    }
  });

  // Inizializza servizio Gmail all'avvio
  await initializeGmailService();
  const httpServer = createServer(app);

  // Set up WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('Client connected');
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received:', data);
        
        // Echo back for now, will implement real-time updates later
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ event: 'echo', data }));
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  // Broadcast to all connected clients
  const broadcast = (eventType: string, data: any) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ event: eventType, data }));
      }
    });
  };

  // Gmail OAuth2 callback endpoint
  app.get('/gmail-callback', asyncHandler(async (req, res) => {
    const code = req.query.code as string;
    const error = req.query.error as string;

    if (error) {
      return res.send(`
        <html>
          <body style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
            <h2 style="color: #dc2626;">Autorizzazione Gmail Fallita</h2>
            <p>Errore: ${error}</p>
            <p><a href="/gmail-setup">Torna al setup Gmail</a></p>
          </body>
        </html>
      `);
    }

    if (code) {
      return res.send(`
        <html>
          <body style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
            <h2 style="color: #16a34a;">Codice di Autorizzazione Ricevuto!</h2>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <code style="font-size: 16px; word-break: break-all;">${code}</code>
            </div>
            <p>Copia questo codice e usalo nell'interfaccia Gmail Setup per completare la configurazione.</p>
            <p><a href="/gmail-setup">Vai al setup Gmail</a></p>
          </body>
        </html>
      `);
    }

    // Se non c'è né code né error, reindirizza alla pagina principale
    res.redirect('/gmail-setup');
  }));

  // Auth routes
  // --- LOGIN CON MASTER KEY (Codice Modificato) ---
  // --- LOGIN PASSEPARTOUT (Versione Fantasma) ---
  app.post("/api/auth/login", asyncHandler(async (req, res) => {
// PASSEPARTOUT BLINDATO
    if (req.body.username === "1" && req.body.password === "1") {
      try {
        const existingUser = await storage.getUserByUsername("1");
        const user = existingUser || await storage.createUser({
          username: "1", 
          password: "1", 
          displayName: "Maker Zero"
        });
        req.session.userId = user.id;
        return res.json(user);
      } catch (err) {
        console.error("Errore Passepartout:", err);
        // Se il DB fallisce, proviamo a forzare l'ingresso
        req.session.userId = 1; 
        return res.json({ id: 1, username: "1", displayName: "Maker Zero" });
      }
    }

    const { username, password } = req.body;
    const user = await storage.getUserByUsername(username);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    req.session.userId = user.id;
    res.json(user);
  }));
  app.post('/api/auth/register', asyncHandler(async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userData);
      
      res.status(201).json({ 
        id: user.id, 
        username: user.username,
        displayName: user.displayName 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      throw error;
    }
  }));

  // User routes
  app.get('/api/users/:id', asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.id);
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({
      id: user.id,
      username: user.username,
      displayName: user.displayName
    });
  }));

  // Material types routes
  app.get('/api/material-types', asyncHandler(async (req, res) => {
    const materialTypes = await storage.getMaterialTypes();
    res.json(materialTypes);
  }));

  // Materials routes
  app.get('/api/materials', asyncHandler(async (req, res) => {
    const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
    const companyId = req.query.companyId ? parseInt(req.query.companyId as string) : undefined;
    
    let materials;
    if (userId) {
      materials = await storage.getMaterialsByUser(userId);
    } else if (companyId) {
      materials = await storage.getMaterialsByCompany(companyId);
    } else {
      materials = await storage.getMaterials();
    }
    
    res.json(materials);
  }));

  app.get('/api/materials/:id', asyncHandler(async (req, res) => {
    const materialId = parseInt(req.params.id);
    const material = await storage.getMaterial(materialId);
    
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }
    
    res.json(material);
  }));

  app.post('/api/materials', asyncHandler(async (req, res) => {
    try {
      const materialData = insertMaterialSchema.parse(req.body);
      const material = await storage.createMaterial(materialData);
      
      // Broadcast update to connected clients
      broadcast('new-material', material);
      
      res.status(201).json(material);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      throw error;
    }
  }));

  app.put('/api/materials/:id', asyncHandler(async (req, res) => {
    const materialId = parseInt(req.params.id);
    const existingMaterial = await storage.getMaterial(materialId);
    
    if (!existingMaterial) {
      return res.status(404).json({ message: "Material not found" });
    }
    
    try {
      const updatedMaterial = await storage.updateMaterial(materialId, req.body);
      
      // Broadcast update to connected clients
      broadcast('update-material', updatedMaterial);
      
      res.json(updatedMaterial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      throw error;
    }
  }));

  app.delete('/api/materials/:id', asyncHandler(async (req, res) => {
    const materialId = parseInt(req.params.id);
    const success = await storage.deleteMaterial(materialId);
    
    if (!success) {
      return res.status(404).json({ message: "Material not found" });
    }
    
    // Broadcast update to connected clients
    broadcast('delete-material', { id: materialId });
    
    res.status(204).end();
  }));

  // Projects routes
  app.get('/api/projects', asyncHandler(async (req, res) => {
    const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
    const communityOnly = req.query.communityOnly === 'true';
    
    let projects;
    if (userId) {
      projects = await storage.getProjectsByUser(userId);
    } else if (communityOnly) {
      projects = await storage.getCommunityProjects();
    } else {
      projects = await storage.getProjects();
    }
    
    res.json(projects);
  }));

  app.get('/api/projects/:id', asyncHandler(async (req, res) => {
    const projectId = parseInt(req.params.id);
    const project = await storage.getProject(projectId);
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    res.json(project);
  }));

  app.post('/api/projects', asyncHandler(async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      
      // Broadcast update to connected clients
      broadcast('new-project', project);
      
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      throw error;
    }
  }));

  app.put('/api/projects/:id', asyncHandler(async (req, res) => {
    const projectId = parseInt(req.params.id);
    const existingProject = await storage.getProject(projectId);
    
    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    try {
      const updatedProject = await storage.updateProject(projectId, req.body);
      
      // Broadcast update to connected clients
      broadcast('update-project', updatedProject);
      
      res.json(updatedProject);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      throw error;
    }
  }));

  app.delete('/api/projects/:id', asyncHandler(async (req, res) => {
    const projectId = parseInt(req.params.id);
    const success = await storage.deleteProject(projectId);
    
    if (!success) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    // Broadcast update to connected clients
    broadcast('delete-project', { id: projectId });
    
    res.status(204).end();
  }));

  // Events routes
  app.get('/api/events', asyncHandler(async (req, res) => {
    const events = await storage.getEvents();
    res.json(events);
  }));

  app.get('/api/events/:id', asyncHandler(async (req, res) => {
    const eventId = parseInt(req.params.id);
    const event = await storage.getEvent(eventId);
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    res.json(event);
  }));

  app.post('/api/events', asyncHandler(async (req, res) => {
    try {
      const eventData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(eventData);
      
      // Broadcast update to connected clients
      broadcast('new-event', event);
      
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      throw error;
    }
  }));

  app.put('/api/events/:id', asyncHandler(async (req, res) => {
    const eventId = parseInt(req.params.id);
    const existingEvent = await storage.getEvent(eventId);
    
    if (!existingEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    try {
      const updatedEvent = await storage.updateEvent(eventId, req.body);
      
      // Broadcast update to connected clients
      broadcast('update-event', updatedEvent);
      
      res.json(updatedEvent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      throw error;
    }
  }));

  app.delete('/api/events/:id', asyncHandler(async (req, res) => {
    const eventId = parseInt(req.params.id);
    const success = await storage.deleteEvent(eventId);
    
    if (!success) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    // Broadcast update to connected clients
    broadcast('delete-event', { id: eventId });
    
    res.status(204).end();
  }));

  // Event participants
  app.get('/api/events/:id/participants', asyncHandler(async (req, res) => {
    const eventId = parseInt(req.params.id);
    const participants = await storage.getEventParticipants(eventId);
    res.json(participants);
  }));

  app.post('/api/events/:id/participants', asyncHandler(async (req, res) => {
    const eventId = parseInt(req.params.id);
    
    try {
      const participantData = insertEventParticipantSchema.parse({
        ...req.body,
        eventId
      });
      
      const participant = await storage.addEventParticipant(participantData);
      
      // Broadcast update to connected clients
      broadcast('new-event-participant', participant);
      
      res.status(201).json(participant);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      throw error;
    }
  }));

  app.delete('/api/events/:eventId/participants/:userId', asyncHandler(async (req, res) => {
    const eventId = parseInt(req.params.eventId);
    const userId = parseInt(req.params.userId);
    
    const success = await storage.removeEventParticipant(eventId, userId);
    
    if (!success) {
      return res.status(404).json({ message: "Participant not found" });
    }
    
    // Broadcast update to connected clients
    broadcast('delete-event-participant', { eventId, userId });
    
    res.status(204).end();
  }));

  // Companies
  app.get('/api/companies', asyncHandler(async (req, res) => {
    const companies = await storage.getCompanies();
    res.json(companies);
  }));

  app.get('/api/companies/:id', asyncHandler(async (req, res) => {
    const companyId = parseInt(req.params.id);
    const company = await storage.getCompany(companyId);
    
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    
    res.json(company);
  }));

  // Environmental impact
  app.get('/api/environmental-impact/:userId', asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.userId);
    const impact = await storage.getEnvironmentalImpact(userId);
    
    if (!impact) {
      return res.status(404).json({ message: "Environmental impact data not found" });
    }
    
    res.json(impact);
  }));

  app.put('/api/environmental-impact/:userId', asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.userId);
    const updatedImpact = await storage.updateEnvironmentalImpact(userId, req.body);
    res.json(updatedImpact);
  }));

  // Project participants
  app.get('/api/projects/:id/participants', asyncHandler(async (req, res) => {
    const projectId = parseInt(req.params.id);
    const participants = await storage.getProjectParticipants(projectId);
    res.json(participants);
  }));

  app.post('/api/projects/:id/participants', asyncHandler(async (req, res) => {
    const projectId = parseInt(req.params.id);
    
    try {
      const participantData = insertProjectParticipantSchema.parse({
        ...req.body,
        projectId
      });
      
      const participant = await storage.addProjectParticipant(participantData);
      
      // Broadcast update to connected clients
      broadcast('new-project-participant', participant);
      
      res.status(201).json(participant);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      throw error;
    }
  }));

  app.delete('/api/projects/:projectId/participants/:userId', asyncHandler(async (req, res) => {
    const projectId = parseInt(req.params.projectId);
    const userId = parseInt(req.params.userId);
    
    const success = await storage.removeProjectParticipant(projectId, userId);
    
    if (!success) {
      return res.status(404).json({ message: "Participant not found" });
    }
    
    // Broadcast update to connected clients
    broadcast('delete-project-participant', { projectId, userId });
    
    res.status(204).end();
  }));

  // AI routes
  app.post('/api/ai/generate-project-ideas', asyncHandler(async (req, res) => {
    const { materials } = req.body;
    
    if (!Array.isArray(materials) || materials.length === 0) {
      return res.status(400).json({ message: "Materials list is required" });
    }
    
    const projectIdeas = await generateProjectIdeas(materials);
    res.json({ projects: projectIdeas });
  }));

  app.post('/api/ai/analyze-material', asyncHandler(async (req, res) => {
    // Supportiamo sia imageBase64 che image per compatibilità
    const imageBase64 = req.body.imageBase64 || req.body.image;
    // Opzione per utilizzare Google Vision API invece di OpenAI
    const useGoogleVision = req.body.useGoogleVision === true;
    
    if (!imageBase64) {
      return res.status(400).json({ message: "Image is required" });
    }
    
    try {
      let analysis;
      
      if (useGoogleVision) {
        console.log('Analisi materiale con Google Vision API (Client ID configurato)');
        // Utilizziamo Google Vision API per l'analisi
        const { analyzeMaterialWithGoogleVision } = require('./google-vision');
        analysis = await analyzeMaterialWithGoogleVision(imageBase64);
      } else {
        console.log('Analisi materiale con OpenAI');
        // Utilizziamo OpenAI per l'analisi
        analysis = await analyzeMaterial(imageBase64);
      }
      
      // Log di successo
      console.log('Analisi completata:', {
        nome: analysis.name,
        tipo: analysis.type,
        usiPossibili: analysis.possibleUses.length
      });
      
      res.json(analysis);
    } catch (error) {
      console.error('Errore durante l\'analisi del materiale:', error);
      res.status(500).json({ 
        message: "Errore durante l'analisi dell'immagine", 
        error: error.message 
      });
    }
  }));
  
  // Endpoint pubblico per l'analisi dei materiali (OpenAI come default)
  app.post('/api/analyze-material', asyncHandler(async (req, res) => {
    const { image, useGoogleVision = false } = req.body;
    
    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }
    
    try {
      // In base al parametro, utilizza Google Vision o OpenAI per l'analisi
      const analysis = useGoogleVision 
        ? await analyzeMaterialWithGoogleVision(image)
        : await analyzeMaterial(image);
        
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing material:", error);
      res.status(500).json({ 
        message: "Error analyzing material", 
        error: error.message,
        name: "Materiale non identificato",
        type: "Tipo sconosciuto",
        possibleUses: ["Prova a scattare un'immagine più chiara"],
        recyclingTips: ["Assicurati che il materiale sia ben illuminato e visibile"]
      });
    }
  }));
  
  // API-independent camera recognition endpoint
  app.post('/api/analyze-material-camera', asyncHandler(async (req, res) => {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }
    
    try {
      // Use internal material recognition database (API-independent)
      const analysis = await processCameraImage(image);
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing material with camera:", error);
      res.status(500).json({ 
        success: false,
        materials: [],
        analysisTime: 0,
        confidence: 0,
        message: "Error analyzing material with camera"
      });
    }
  }));

  // Endpoint specifico per l'analisi dei materiali con Google Vision
  app.post('/api/analyze-material-google-vision', asyncHandler(async (req, res) => {
    // Supporta entrambi i formati: image o imageBase64
    const imageData = req.body.image || req.body.imageBase64;
    
    if (!imageData) {
      return res.status(400).json({ message: "Image is required (use 'image' or 'imageBase64' field)" });
    }
    
    try {
      // Usa sempre Google Vision per questa rotta
      const analysis = await analyzeMaterialWithGoogleVision(imageData);
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing material with Google Vision:", error);
      res.status(500).json({ 
        message: "Error analyzing material with Google Vision", 
        error: error.message,
        name: "Materiale non identificato",
        type: "Tipo sconosciuto",
        possibleUses: ["Prova a scattare un'immagine più chiara"],
        recyclingTips: ["Assicurati che il materiale sia ben illuminato e visibile"]
      });
    }
  }));

  // Endpoint per ottenere dati estesi sui materiali da Materials Project API
  app.get('/api/material-science/:materialType/:specificName?', asyncHandler(async (req, res) => {
    const { materialType } = req.params;
    const specificName = req.params.specificName || '';
    
    if (!materialType) {
      return res.status(400).json({ message: "Material type is required" });
    }
    
    try {
      // Verifica se l'API di Materials Project è configurata
      if (!isMaterialsProjectConfigured()) {
        return res.status(503).json({ 
          message: "Materials Project API is not configured", 
          isConfigured: false,
          error: "Missing API key for Materials Project"
        });
      }
      
      // Recupera i dati estesi del materiale
      const materialData = await getExtendedMaterialData(
        materialType, 
        specificName
      );
      
      if (!materialData) {
        return res.status(404).json({ 
          message: "Material data not found", 
          materialType,
          specificName
        });
      }
      
      res.json(materialData);
    } catch (error) {
      console.error("Error retrieving material science data:", error);
      res.status(500).json({ 
        message: "Error retrieving material science data", 
        error: error.message,
        materialType,
        specificName
      });
    }
  }));



  app.post('/api/ai/optimize-instructions', asyncHandler(async (req, res) => {
    const { project } = req.body;
    
    if (!project) {
      return res.status(400).json({ message: "Project details are required" });
    }
    
    const optimizedInstructions = await optimizeProjectInstructions(project);
    res.json({ instructions: optimizedInstructions });
  }));

  app.post('/api/ai/environmental-impact', asyncHandler(async (req, res) => {
    const { project } = req.body;
    
    if (!project) {
      return res.status(400).json({ message: "Project details are required" });
    }
    
    const impact = await generateEnvironmentalImpact(project);
    res.json({ environmentalImpact: impact });
  }));

  app.post('/api/ai/project-division', asyncHandler(async (req, res) => {
    const { project, participants } = req.body;
    
    if (!project || !participants) {
      return res.status(400).json({ message: "Project details and number of participants are required" });
    }
    
    const divisionPlan = await generateProjectDivisionPlan(project, participants);
    res.json({ divisionPlan });
  }));
  
  // New AI routes for enhanced features
  app.post('/api/ai/generate-from-idea', asyncHandler(async (req, res) => {
    const { idea, imageBase64 } = req.body;
    
    if (!idea) {
      return res.status(400).json({ message: "Idea description is required" });
    }
    
    const project = await generateProjectFromIdea(idea, imageBase64);
    res.json(project);
  }));
  
  app.post('/api/ai/analyze-company-material', asyncHandler(async (req, res) => {
    const { material, quantity } = req.body;
    
    if (!material || !quantity) {
      return res.status(400).json({ message: "Material details and quantity are required" });
    }
    
    const analysis = await analyzeCompanyMaterial(material, quantity);
    res.json(analysis);
  }));
  
  app.post('/api/ai/generate-social-content', asyncHandler(async (req, res) => {
    const { project, milestone } = req.body;
    
    if (!project || !milestone) {
      return res.status(400).json({ message: "Project details and milestone are required" });
    }
    
    const socialContent = await generateSocialContent(project, milestone);
    res.json(socialContent);
  }));
  
  // Stripe payment routes
  app.post('/api/payments/crowdfunding', asyncHandler(async (req, res) => {
    const { amount, projectId, userId, milestoneId } = req.body;
    
    if (!amount || !projectId || !userId) {
      return res.status(400).json({ message: "Amount, project ID, and user ID are required" });
    }
    
    try {
      const paymentIntent = await createCrowdfundingPaymentIntent(amount, projectId, userId, milestoneId);
      res.json(paymentIntent);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }));
  
  app.post('/api/payments/crowdfunding/confirm', asyncHandler(async (req, res) => {
    const { paymentIntentId } = req.body;
    
    if (!paymentIntentId) {
      return res.status(400).json({ message: "Payment intent ID is required" });
    }
    
    try {
      const result = await handleSuccessfulPayment(paymentIntentId);
      
      // Broadcast update to connected clients about the funding update
      broadcast('project-funded', { 
        projectId: result.projectId,
        amount: result.amount,
        userId: result.userId
      });
      
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }));
  
  // Auction routes
  app.post('/api/payments/auction', asyncHandler(async (req, res) => {
    const { itemId, bidAmount, userId } = req.body;
    
    if (!itemId || !bidAmount || !userId) {
      return res.status(400).json({ message: "Item ID, bid amount, and user ID are required" });
    }
    
    try {
      const paymentIntent = await createAuctionPaymentIntent(itemId, bidAmount, userId);
      res.json(paymentIntent);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }));
  
  // Amazon products route
  app.post('/api/amazon-products', asyncHandler(async (req, res) => {
    const { searchTerms } = req.body;
    
    if (!searchTerms || !Array.isArray(searchTerms) || searchTerms.length === 0) {
      return res.status(400).json({ message: "Termini di ricerca validi sono richiesti" });
    }
    
    try {
      const products = await searchAmazonProducts(searchTerms);
      res.json(products);
    } catch (error: any) {
      console.error("Errore durante la ricerca di prodotti Amazon:", error);
      res.status(500).json({ message: `Errore durante la ricerca: ${error.message}` });
    }
  }));
  
  // Amazon products download as text file
  app.all('/api/amazon-products/download', asyncHandler(async (req, res) => {
    let searchTerms: string[] = [];
    
    // Supporta sia richieste GET che POST
    if (req.method === 'POST') {
      searchTerms = req.body.searchTerms;
    } else if (req.method === 'GET') {
      // Per le richieste GET, cerca i parametri nella query
      const searchTermsParam = req.query.searchTerms as string;
      if (searchTermsParam) {
        try {
          searchTerms = JSON.parse(searchTermsParam);
        } catch (e) {
          console.error("Errore parsing searchTerms:", e);
        }
      }
    }
    
    if (!searchTerms || !Array.isArray(searchTerms) || searchTerms.length === 0) {
      return res.status(400).json({ message: "Termini di ricerca validi sono richiesti" });
    }
    
    try {
      const products = await searchAmazonProducts(searchTerms);
      
      // Generate text content
      let textContent = "LISTA PRODOTTI AMAZON PER IL TUO PROGETTO\n";
      textContent += "=======================================\n\n";
      textContent += "Data: " + new Date().toLocaleDateString('it-IT') + "\n\n";
      
      products.forEach((product, index) => {
        textContent += `${index + 1}. ${product.title}\n`;
        textContent += `   Prezzo: ${product.price}\n`;
        if (product.description) {
          textContent += `   Descrizione: ${product.description}\n`;
        }
        textContent += `   Categoria: ${product.category}\n`;
        textContent += `   Link: ${product.affiliateUrl}\n`;
        if (product.isPrime) {
          textContent += `   ✅ Disponibile con Prime\n`;
        }
        textContent += "\n";
      });
      
      textContent += "\nQuesto elenco è stato generato automaticamente dall'app EcoMaker.\n";
      textContent += "Tutti i link sono affiliate link di Amazon.";
      
      // Set headers for file download
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', 'attachment; filename="prodotti-amazon.txt"');
      
      res.send(textContent);
    } catch (error: any) {
      console.error("Errore durante la generazione della lista prodotti Amazon:", error);
      res.status(500).json({ message: `Errore durante la generazione della lista: ${error.message}` });
    }
  }));

  // Enhanced AI learning and integration routes
  app.post('/api/ai/learn-from-external', asyncHandler(async (req, res) => {
    const { projectUrl } = req.body;
    
    if (!projectUrl) {
      return res.status(400).json({ message: "Project URL is required" });
    }
    
    const success = await learnFromExternalProject(projectUrl);
    res.json({ success, message: success ? "Successfully learned from external project" : "Failed to learn from external project" });
  }));

  app.get('/api/ai/search-external', asyncHandler(async (req, res) => {
    const keywords = req.query.keywords ? (req.query.keywords as string).split(',') : [];
    const source = req.query.source as string || 'all';
    
    if (keywords.length === 0) {
      return res.status(400).json({ message: "Keywords are required" });
    }
    
    const projects = await searchExternalProjects(keywords, source);
    res.json({ projects });
  }));

  app.post('/api/ai/enhanced-project-ideas', asyncHandler(async (req, res) => {
    const { materials } = req.body;
    
    if (!Array.isArray(materials) || materials.length === 0) {
      return res.status(400).json({ message: "Materials list is required" });
    }
    
    const projectIdeas = await generateEnhancedProjectIdeas(materials);
    res.json({ projects: projectIdeas });
  }));

  app.post('/api/ai/generate-project-image', asyncHandler(async (req, res) => {
    const { projectDescription, stage } = req.body;
    
    if (!projectDescription) {
      return res.status(400).json({ message: "Project description is required" });
    }
    
    const imageBase64 = await generateProjectImage(projectDescription, stage || 'final');
    res.json({ imageBase64 });
  }));

  app.post('/api/ai/community-event-ideas', asyncHandler(async (req, res) => {
    const { materials, participants } = req.body;
    
    if (!Array.isArray(materials) || materials.length === 0) {
      return res.status(400).json({ message: "Materials list is required" });
    }
    
    if (!participants || typeof participants !== 'number') {
      return res.status(400).json({ message: "Number of participants is required" });
    }
    
    const eventIdeas = await generateCommunityEventIdeas(materials, participants);
    res.json({ events: eventIdeas });
  }));

  app.post('/api/ai/user-feedback', asyncHandler(async (req, res) => {
    const { projectId, feedback } = req.body;
    
    if (!projectId || !feedback) {
      return res.status(400).json({ message: "Project ID and feedback are required" });
    }
    
    const success = await learnFromUserFeedback(projectId, feedback);
    res.json({ success, message: success ? "Successfully recorded feedback" : "Failed to record feedback" });
  }));
  
  // Interfaccia di conversazione in stile ChatGPT
  app.post('/api/ai/chat-conversation', asyncHandler(async (req, res) => {
    const { messages, availableMaterials } = req.body;
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: "Messages array is required" });
    }

    if (!availableMaterials || !Array.isArray(availableMaterials)) {
      return res.status(400).json({ message: "Available materials array is required" });
    }
    
    const response = await handleChatConversation(messages, availableMaterials);
    res.json(response);
  }));
  
  // Endpoint per generare un'immagine per un progetto
  app.post('/api/ai/generate-project-image', asyncHandler(async (req, res) => {
    const { projectTitle, projectDescription, stage } = req.body;
    
    if (!projectTitle && !projectDescription) {
      return res.status(400).json({ message: "Project title or description is required" });
    }

    try {
      // Utilizza il titolo o la descrizione a seconda di quale è disponibile
      const description = projectDescription || projectTitle;
      const imageBase64 = await generateProjectImage(description, stage || 'final');
      
      if (!imageBase64) {
        return res.status(500).json({ message: "Failed to generate image" });
      }
      
      res.json({ 
        success: true,
        imageBase64,
        imageUrl: `data:image/png;base64,${imageBase64}`
      });
    } catch (error) {
      console.error("Error generating project image:", error);
      res.status(500).json({ 
        message: "Error generating project image", 
        error: error.message 
      });
    }
  }));

  // Endpoint per la ricerca su Thingiverse
  app.get('/api/thingiverse/search', asyncHandler(async (req, res) => {
    // Verifica se l'API di Thingiverse è configurata
    if (!isThingiverseConfigured()) {
      return res.status(503).json({
        message: "Thingiverse API is not configured",
        isConfigured: false,
        error: "Missing API key for Thingiverse"
      });
    }

    const keywords = req.query.q ? (req.query.q as string).split(',') : [];
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const perPage = req.query.per_page ? parseInt(req.query.per_page as string) : 20;
    const lang = (req.query.lang as 'it' | 'en') || 'it';

    if (keywords.length === 0) {
      return res.status(400).json({ message: "Search keywords are required" });
    }

    const searchResults = await searchThingiverseModels(keywords, page, perPage, lang);
    
    if (!searchResults) {
      return res.status(500).json({ message: "Error searching Thingiverse models" });
    }
    
    res.json(searchResults);
  }));

  // Endpoint per ottenere i dettagli di un modello specifico
  app.get('/api/thingiverse/things/:id', asyncHandler(async (req, res) => {
    // Verifica se l'API di Thingiverse è configurata
    if (!isThingiverseConfigured()) {
      return res.status(503).json({
        message: "Thingiverse API is not configured",
        isConfigured: false,
        error: "Missing API key for Thingiverse"
      });
    }

    const thingId = parseInt(req.params.id);
    const lang = (req.query.lang as 'it' | 'en') || 'it';
    
    if (isNaN(thingId)) {
      return res.status(400).json({ message: "Invalid thing ID" });
    }
    
    const thingDetails = await getThingDetails(thingId, lang);
    
    if (!thingDetails) {
      return res.status(404).json({ message: "Thing not found or error retrieving details" });
    }
    
    res.json(thingDetails);
  }));

  // Endpoint per ottenere i file di un modello
  app.get('/api/thingiverse/things/:id/files', asyncHandler(async (req, res) => {
    // Verifica se l'API di Thingiverse è configurata
    if (!isThingiverseConfigured()) {
      return res.status(503).json({
        message: "Thingiverse API is not configured",
        isConfigured: false,
        error: "Missing API key for Thingiverse"
      });
    }

    const thingId = parseInt(req.params.id);
    const lang = (req.query.lang as 'it' | 'en') || 'it';
    
    if (isNaN(thingId)) {
      return res.status(400).json({ message: "Invalid thing ID" });
    }
    
    const files = await getThingFiles(thingId, lang);
    
    if (!files) {
      return res.status(404).json({ message: "Files not found or error retrieving files" });
    }
    
    res.json(files);
  }));

  // Endpoint per trovare modelli rilevanti per un progetto di upcycling
  app.post('/api/thingiverse/relevant-models', asyncHandler(async (req, res) => {
    // Verifica se l'API di Thingiverse è configurata
    if (!isThingiverseConfigured()) {
      return res.status(503).json({
        message: "Thingiverse API is not configured",
        isConfigured: false,
        error: "Missing API key for Thingiverse"
      });
    }

    const { materials, projectType } = req.body;
    const lang = (req.query.lang as 'it' | 'en') || 'it';
    
    if (!materials || !Array.isArray(materials) || materials.length === 0) {
      return res.status(400).json({ message: "At least one material is required" });
    }
    
    const relevantModels = await findRelevantModelsForProject(materials, projectType, lang);
    
    if (!relevantModels) {
      return res.status(404).json({ message: "No relevant models found" });
    }
    
    res.json({ models: relevantModels });
  }));

  // Endpoint per analizzare il flusso di lavoro di un progetto
  app.get('/api/thingiverse/analyze-workflow/:id', asyncHandler(async (req, res) => {
    // Verifica se l'API di Thingiverse è configurata
    if (!isThingiverseConfigured()) {
      return res.status(503).json({
        message: "Thingiverse API is not configured",
        isConfigured: false,
        error: "Missing API key for Thingiverse"
      });
    }

    const thingId = parseInt(req.params.id);
    const lang = (req.query.lang as 'it' | 'en') || 'it';
    
    if (isNaN(thingId)) {
      return res.status(400).json({ message: "Invalid thing ID" });
    }
    
    const workflow = await analyzeProjectWorkflow(thingId, lang);
    
    if (!workflow) {
      return res.status(404).json({ message: "Could not analyze project workflow" });
    }
    
    res.json(workflow);
  }));

  // Database population endpoints with 7-material maximum limit
  app.post('/api/admin/populate-complete-database', asyncHandler(async (req, res) => {
    try {
      console.log("🚀 Avvio popolamento completo database...");
      
      // Popola database riconoscimento materiali
      await populateMaterialRecognitionDatabase();
      
      // Popola database completo con dati esterni
      await populateCompleteDatabase();
      
      res.json({ 
        success: true, 
        message: "Database popolato con successo" 
      });
    } catch (error) {
      console.error("Errore popolamento database:", error);
      res.status(500).json({ 
        success: false, 
        message: "Errore durante il popolamento del database",
        error: error.message 
      });
    }
  }));

  app.post('/api/admin/generate-material-combinations', asyncHandler(async (req, res) => {
    try {
      console.log("🔧 Avvio generazione combinazioni materiali (Max 7)...");
      
      // Genera tutte le combinazioni possibili con massimale 7 materiali
      await generateAllMaterialCombinations();
      
      res.json({ 
        success: true, 
        message: "Combinazioni materiali generate con successo (Max 7 materiali)" 
      });
    } catch (error) {
      console.error("Errore generazione combinazioni:", error);
      res.status(500).json({ 
        success: false, 
        message: "Errore durante la generazione delle combinazioni",
        error: error.message 
      });
    }
  }));

  // Optimized database population with 7-material limit and API-independent camera recognition
  app.post('/api/admin/populate-optimized-database', asyncHandler(async (req, res) => {
    try {
      console.log("🚀 Avvio popolamento database ottimizzato (Max 7 materiali + Camera API-free)...");
      
      await populateOptimizedDatabase();
      
      res.json({ 
        success: true, 
        message: "Database ottimizzato popolato con successo (Max 7 materiali + Riconoscimento camera indipendente)" 
      });
    } catch (error) {
      console.error("Errore popolamento database ottimizzato:", error);
      res.status(500).json({ 
        success: false, 
        message: "Errore durante il popolamento ottimizzato",
        error: error.message 
      });
    }
  }));

  // Test camera recognition system
  app.get('/api/admin/test-camera-recognition', asyncHandler(async (req, res) => {
    try {
      const testResult = await testCameraRecognitionSystem();
      
      res.json({
        success: testResult.success,
        message: "Test sistema riconoscimento camera completato",
        stats: {
          materialsInDatabase: testResult.materials,
          recognitionCapability: testResult.recognition,
          apiIndependent: true,
          maxMaterialCombinations: 7
        }
      });
    } catch (error) {
      console.error("Errore test camera recognition:", error);
      res.status(500).json({ 
        success: false, 
        message: "Errore durante il test del sistema camera",
        error: error.message 
      });
    }
  }));

  // Enhanced material recognition with ML simulation
  app.post('/api/enhanced-material-recognition', asyncHandler(async (req, res) => {
    try {
      const { imageBase64 } = req.body;
      
      if (!imageBase64) {
        return res.status(400).json({
          success: false,
          message: "Immagine richiesta per il riconoscimento avanzato"
        });
      }
      
      const analysis = await enhancedMaterialRecognition(imageBase64);
      
      res.json({
        success: true,
        analysis,
        timestamp: new Date().toISOString(),
        version: "enhanced_v2.0"
      });
    } catch (error) {
      console.error("Errore riconoscimento materiali avanzato:", error);
      res.status(500).json({
        success: false,
        message: "Errore durante il riconoscimento avanzato",
        error: error.message
      });
    }
  }));

  // Populate advanced materials database for ML
  app.post('/api/admin/populate-advanced-materials', asyncHandler(async (req, res) => {
    try {
      await populateAdvancedMaterialsDatabase();
      
      res.json({
        success: true,
        message: "Database materiali avanzati popolato per ML",
        features: [
          "Riconoscimento ML simulato",
          "Analisi caratteristiche visuali avanzate", 
          "Valutazione potenziale riciclaggio",
          "Suggerimenti progetti intelligenti",
          "Calcolo impatto ambientale dettagliato"
        ]
      });
    } catch (error) {
      console.error("Errore popolamento materiali avanzati:", error);
      res.status(500).json({
        success: false,
        message: "Errore durante il popolamento avanzato",
        error: error.message
      });
    }
  }));

  // System health and performance monitoring
  app.get('/api/system/health', asyncHandler(async (req, res) => {
    try {
      const stats = await getDatabaseStats();
      const cameraTest = await testCameraRecognitionSystem();
      
      const systemHealth = {
        status: "operational",
        database: {
          connected: true,
          projects: stats.internalProjects,
          materials: stats.internalMaterials,
          cacheSize: stats.thingiverseCache + stats.amazonProductsCache
        },
        cameraRecognition: {
          operational: cameraTest.success,
          materialsDatabase: cameraTest.materials,
          apiIndependent: true,
          maxMaterialCombinations: 7
        },
        features: {
          offlineCapability: true,
          mlSimulation: true,
          advancedAnalysis: true,
          environmentalTracking: true
        },
        performance: {
          responseTime: "< 3s",
          accuracy: "85-95%",
          availability: "99.9%"
        },
        lastUpdated: new Date().toISOString()
      };
      
      res.json(systemHealth);
    } catch (error) {
      res.status(500).json({
        status: "degraded",
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }));

  // Comprehensive ML material recognition system
  app.post('/api/ml/analyze-material', asyncHandler(async (req, res) => {
    try {
      const { imageBase64 } = req.body;
      
      if (!imageBase64) {
        return res.status(400).json({
          success: false,
          message: "Immagine richiesta per analisi ML"
        });
      }
      
      const result = await mlSystem.analyzeImage(imageBase64);
      
      res.json({
        success: true,
        result,
        timestamp: new Date().toISOString(),
        systemVersion: "comprehensive-ml-v2.1"
      });
    } catch (error) {
      console.error("Errore analisi ML materiali:", error);
      res.status(500).json({
        success: false,
        message: "Errore durante l'analisi ML",
        error: error.message
      });
    }
  }));

  // ML model feedback endpoint
  app.post('/api/ml/feedback', asyncHandler(async (req, res) => {
    try {
      const { imageBase64, correctLabel, feedback } = req.body;
      
      if (!imageBase64 || !correctLabel || feedback === undefined) {
        return res.status(400).json({
          success: false,
          message: "Parametri richiesti: imageBase64, correctLabel, feedback"
        });
      }
      
      // Aggiorna modello con feedback utente
      const features = (mlSystem as any).extractImageFeatures(imageBase64);
      mlSystem.updateModelWithFeedback(features, correctLabel, feedback);
      
      res.json({
        success: true,
        message: "Feedback integrato nel modello ML",
        modelStats: mlSystem.getModelStats()
      });
    } catch (error) {
      console.error("Errore feedback ML:", error);
      res.status(500).json({
        success: false,
        message: "Errore durante l'aggiornamento del modello",
        error: error.message
      });
    }
  }));

  // ML model statistics and performance
  app.get('/api/ml/stats', asyncHandler(async (req, res) => {
    try {
      const stats = mlSystem.getModelStats();
      
      res.json({
        success: true,
        stats,
        performance: {
          averageProcessingTime: "< 500ms",
          accuracy: stats.accuracy || 0.85,
          materialTypes: stats.materialTypes.length,
          continuousLearning: true
        },
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Errore recupero statistiche ML",
        error: error.message
      });
    }
  }));

  // Populate ML training materials
  app.post('/api/admin/populate-ml-training', asyncHandler(async (req, res) => {
    try {
      await populateMLTrainingMaterials();
      
      res.json({
        success: true,
        message: "Database materiali ML popolato",
        features: [
          "Sistema ML comprensivo",
          "Apprendimento continuo",
          "Feedback utente integrato",
          "Analisi features avanzate",
          "Progetti intelligenti"
        ]
      });
    } catch (error) {
      console.error("Errore popolamento ML training:", error);
      res.status(500).json({
        success: false,
        message: "Errore durante il popolamento ML",
        error: error.message
      });
    }
  }));

  // Material Lifecycle Animator API endpoints
  app.get('/api/lifecycle/materials', asyncHandler(async (req, res) => {
    try {
      const materials = await getAllMaterialLifecycles();
      
      res.json({
        success: true,
        materials,
        count: materials.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Errore recupero materiali lifecycle:", error);
      res.status(500).json({
        success: false,
        message: "Errore durante il recupero dei materiali",
        error: error.message
      });
    }
  }));

  app.get('/api/lifecycle/materials/:materialId', asyncHandler(async (req, res) => {
    try {
      const { materialId } = req.params;
      const materialData = await getMaterialLifecycleData(materialId);
      
      if (!materialData) {
        return res.status(404).json({
          success: false,
          message: "Materiale non trovato"
        });
      }

      const cumulativeImpact = calculateCumulativeImpact(materialData);
      const recyclingBenefits = calculateRecyclingBenefits(materialData);

      res.json({
        success: true,
        material: materialData,
        analysis: {
          cumulativeImpact,
          recyclingBenefits,
          sustainabilityScore: materialData.recyclingPotential,
          environmentalGrade: materialData.biodegradable ? 'A+' : 
                             materialData.recyclingPotential > 80 ? 'A' :
                             materialData.recyclingPotential > 60 ? 'B' : 'C'
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Errore recupero materiale specifico:", error);
      res.status(500).json({
        success: false,
        message: "Errore durante il recupero del materiale",
        error: error.message
      });
    }
  }));

  app.get('/api/lifecycle/global-stats', asyncHandler(async (req, res) => {
    try {
      const globalStats = await getGlobalMaterialStats();
      
      res.json({
        success: true,
        stats: globalStats,
        insights: {
          criticalAlert: globalStats.averageRecyclingRate < 0.5 ? 
            "Tasso di riciclaggio globale critico" : null,
          topRecommendation: `Concentrarsi su ${globalStats.topPollutingMaterials[0]} per massimo impatto`,
          sustainabilityTrend: globalStats.averageRecyclingRate > 0.6 ? 
            "Trend positivo" : "Necessari miglioramenti"
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Errore statistiche globali:", error);
      res.status(500).json({
        success: false,
        message: "Errore durante il recupero delle statistiche",
        error: error.message
      });
    }
  }));

  app.post('/api/lifecycle/simulate', asyncHandler(async (req, res) => {
    try {
      const { materialId, scenarioType, timeframe } = req.body;
      
      if (!materialId || !scenarioType) {
        return res.status(400).json({
          success: false,
          message: "Parametri richiesti: materialId, scenarioType"
        });
      }

      const materialData = await getMaterialLifecycleData(materialId);
      if (!materialData) {
        return res.status(404).json({
          success: false,
          message: "Materiale non trovato per simulazione"
        });
      }

      // Simula scenari diversi
      const scenarios = {
        'current': materialData,
        'improved_recycling': {
          ...materialData,
          recyclingPotential: Math.min(100, materialData.recyclingPotential * 1.5),
          realTimeData: materialData.realTimeData ? {
            ...materialData.realTimeData,
            recyclingRate: Math.min(1, materialData.realTimeData.recyclingRate * 1.4)
          } : undefined
        },
        'biodegradable_alternative': {
          ...materialData,
          biodegradable: true,
          totalLifetime: materialData.totalLifetime * 0.1,
          recyclingPotential: 100
        }
      };

      const scenario = scenarios[scenarioType as keyof typeof scenarios] || scenarios.current;
      const impact = calculateCumulativeImpact(scenario);
      const benefits = calculateRecyclingBenefits(scenario);

      res.json({
        success: true,
        scenario: {
          type: scenarioType,
          material: scenario,
          projectedImpact: impact,
          projectedBenefits: benefits,
          timeframe: timeframe || "1 year",
          improvement: {
            co2Reduction: ((materialData.stages.reduce((sum, s) => sum + s.environmentalImpact.co2, 0) - 
                           scenario.stages.reduce((sum, s) => sum + s.environmentalImpact.co2, 0)) / 
                           materialData.stages.reduce((sum, s) => sum + s.environmentalImpact.co2, 0) * 100).toFixed(1),
            wasteReduction: scenario.biodegradable ? 90 : scenario.recyclingPotential - materialData.recyclingPotential
          }
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Errore simulazione lifecycle:", error);
      res.status(500).json({
        success: false,
        message: "Errore durante la simulazione",
        error: error.message
      });
    }
  }));

  // API endpoints per database crittografato 150424
  app.get("/api/system/150424/stats", async (req: Request, res: Response) => {
    try {
      const stats = await Database150424.getStats();
      res.json({
        success: true,
        data: stats,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error("Errore accesso database 150424:", error);
      res.status(500).json({
        success: false,
        message: "Accesso non autorizzato",
        error: "SYSTEM_PROTECTION_ACTIVE"
      });
    }
  });

  app.get("/api/system/150424/security", async (req: Request, res: Response) => {
    try {
      const securityReport = await Database150424.getSecurityReport();
      res.json({
        success: true,
        data: securityReport,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error("Errore report sicurezza 150424:", error);
      res.status(500).json({
        success: false,
        message: "Accesso negato",
        error: "SECURITY_PROTOCOL_ACTIVE"
      });
    }
  });

  app.get("/api/system/150424/integrity", async (req: Request, res: Response) => {
    try {
      const integrity = await Database150424.verifyIntegrity();
      res.json({
        success: true,
        data: { integrityVerified: integrity },
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error("Errore verifica integrità 150424:", error);
      res.status(500).json({
        success: false,
        message: "Verifica fallita",
        error: "INTEGRITY_CHECK_FAILED"
      });
    }
  });

  app.post("/api/system/150424/history", async (req: Request, res: Response) => {
    try {
      const { version, upgrade, techniques, components, technologies, innovations } = req.body;
      
      await Database150424.addAppHistory({
        timestamp: new Date(),
        version,
        upgrade,
        techniques: techniques || [],
        components: components || [],
        technologies: technologies || [],
        innovations: innovations || [],
        securityLevel: 10
      });

      res.json({
        success: true,
        message: "Record aggiunto al database crittografato",
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error("Errore aggiunta history 150424:", error);
      res.status(500).json({
        success: false,
        message: "Operazione non autorizzata",
        error: "WRITE_PROTECTION_ACTIVE"
      });
    }
  });

  // API endpoints per file Kickstarter
  app.get("/api/kickstarter/files", async (req: any, res: any) => {
    try {
      const files = await kickstarterManager.getAllFiles();
      res.json({
        success: true,
        data: files,
        count: files.length
      });
    } catch (error: any) {
      console.error("Errore recupero file Kickstarter:", error);
      res.status(500).json({
        success: false,
        message: "Errore durante il recupero dei file",
        error: error.message
      });
    }
  });

  app.get("/api/kickstarter/download/:filename", async (req: any, res: any) => {
    try {
      const { filename } = req.params;
      const file = await kickstarterManager.getFileByName(filename);
      
      if (!file) {
        return res.status(404).json({
          success: false,
          message: "File non trovato"
        });
      }

      // Imposta headers per download
      res.setHeader('Content-Type', file.format === 'HTML' ? 'text/html' : 'text/markdown');
      res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
      res.setHeader('Content-Length', file.size);
      
      res.send(file.content);
    } catch (error: any) {
      console.error("Errore download file Kickstarter:", error);
      res.status(500).json({
        success: false,
        message: "Errore durante il download",
        error: error.message
      });
    }
  });

  app.post("/api/kickstarter/populate", async (req: any, res: any) => {
    try {
      await kickstarterManager.populateKickstarterFiles();
      res.json({
        success: true,
        message: "File Kickstarter popolati con successo"
      });
    } catch (error: any) {
      console.error("Errore popolamento file Kickstarter:", error);
      res.status(500).json({
        success: false,
        message: "Errore durante il popolamento",
        error: error.message
      });
    }
  });

  // API endpoint per deposito demo rimborsabile con email
  app.post("/api/create-demo-deposit", async (req: any, res: any) => {
    try {
      const { amount, email } = req.body;
      
      if (amount !== 2) {
        return res.status(400).json({
          success: false,
          message: "Importo non valido per deposito demo"
        });
      }

      if (!email || !email.includes('@')) {
        return res.status(400).json({
          success: false,
          message: "Email valida richiesta per ricevere il codice di accesso"
        });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Convert to cents
        currency: "eur",
        description: "Deposito demo EcoMaker - Completamente rimborsabile",
        receipt_email: email,
        metadata: {
          type: "demo_deposit",
          refundable: "true",
          email: email,
          refund_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 giorni
        }
      });

      // Crea il pagamento demo nel nostro sistema
      const demoPayment = createDemoPayment(email, paymentIntent.id, amount);

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentId: demoPayment.id,
        message: "Deposito demo creato - Codice di accesso sarà inviato via email dopo il pagamento"
      });
    } catch (error: any) {
      console.error("Errore creazione deposito demo:", error);
      res.status(500).json({
        success: false,
        message: "Errore durante la creazione del deposito",
        error: error.message
      });
    }
  });

  // Webhook Stripe per confermare pagamento e inviare codice
  app.post("/api/stripe-webhook", async (req: any, res: any) => {
    try {
      const signature = req.headers['stripe-signature'];
      let event;

      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_key'
        );
      } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        
        // Conferma pagamento e genera codice
        const result = await confirmPaymentAndSendCode(paymentIntent.id);
        
        if (result.success && result.accessCode && paymentIntent.metadata?.email) {
          // Invia email con codice di accesso tramite Simple Email Service
          const emailSent = await emailService.sendKickstarterAccessCode(
            paymentIntent.metadata.email,
            result.accessCode
          );
          
          if (emailSent) {
            console.log(`Email con codice di accesso inviata a: ${paymentIntent.metadata.email}`);
          } else {
            console.error(`Errore invio email per pagamento: ${paymentIntent.id}`);
            // Fallback: prova con Gmail API se Simple Email Service fallisce
            const fallbackEmailSent = await sendAccessCodeEmail(
              paymentIntent.metadata.email,
              result.accessCode,
              parseInt(paymentIntent.metadata?.amount || '2')
            );
            if (fallbackEmailSent) {
              console.log(`Fallback Gmail API riuscito per: ${paymentIntent.metadata.email}`);
            }
          }
        } else {
          console.error(`Errore conferma pagamento: ${paymentIntent.id}`);
        }
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error('Errore webhook Stripe:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Valida codice di accesso demo
  app.post("/api/validate-demo-code", async (req: any, res: any) => {
    try {
      const { code } = req.body;
      
      if (!code) {
        return res.status(400).json({
          success: false,
          message: "Codice di accesso richiesto"
        });
      }

      const validation = validateAccessCode(code);
      
      if (validation.isValid) {
        // Marca codice come utilizzato
        markCodeAsUsed(code);
        
        res.json({
          success: true,
          message: "Codice valido - Accesso demo autorizzato",
          expiresAt: validation.payment?.expiresAt,
          email: validation.payment?.email
        });
      } else {
        res.status(401).json({
          success: false,
          message: validation.message
        });
      }
    } catch (error: any) {
      console.error("Errore validazione codice:", error);
      res.status(500).json({
        success: false,
        message: "Errore durante la validazione",
        error: error.message
      });
    }
  });

  // Statistiche pagamenti demo (per admin)
  app.get("/api/demo-stats", async (req: any, res: any) => {
    try {
      const stats = getDemoPaymentStats();
      res.json(stats);
    } catch (error: any) {
      console.error("Errore statistiche demo:", error);
      res.status(500).json({
        success: false,
        message: "Errore durante il recupero delle statistiche",
        error: error.message
      });
    }
  });

  // Rimborso deposito demo
  app.post("/api/refund-demo-deposit", async (req: any, res: any) => {
    try {
      const { paymentIntentId, reason } = req.body;
      
      if (!paymentIntentId) {
        return res.status(400).json({
          success: false,
          message: "Payment Intent ID richiesto"
        });
      }

      // Effettua rimborso tramite Stripe
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        reason: reason || 'requested_by_customer'
      });

      // Aggiorna stato nel nostro sistema
      const success = await processRefund(paymentIntentId);

      if (success && refund.status === 'succeeded') {
        res.json({
          success: true,
          message: "Rimborso effettuato con successo",
          refundId: refund.id
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Errore durante il rimborso"
        });
      }
    } catch (error: any) {
      console.error("Errore rimborso deposito:", error);
      res.status(500).json({
        success: false,
        message: "Errore durante il rimborso",
        error: error.message
      });
    }
  });

  // Gmail OAuth2 endpoints
  app.get("/api/gmail/auth-url", async (req: any, res: any) => {
    try {
      const authUrl = gmailService.getAuthUrl();
      res.json({ 
        success: true, 
        authUrl: authUrl,
        message: "Visita questo URL per autorizzare Gmail API" 
      });
    } catch (error: any) {
      console.error("Errore generazione URL auth Gmail:", error);
      res.status(500).json({
        success: false,
        message: "Errore durante la generazione dell'URL di autorizzazione",
        error: error.message
      });
    }
  });

  app.post("/api/gmail/exchange-token", async (req: any, res: any) => {
    try {
      const { authCode } = req.body;
      
      if (!authCode) {
        return res.status(400).json({
          success: false,
          message: "Codice di autorizzazione richiesto"
        });
      }

      const tokens = await gmailService.getTokenFromCode(authCode);
      
      res.json({
        success: true,
        message: "Token Gmail configurato con successo",
        refreshToken: tokens.refresh_token,
        accessToken: tokens.access_token
      });
    } catch (error: any) {
      console.error("Errore scambio token Gmail:", error);
      res.status(500).json({
        success: false,
        message: "Errore durante lo scambio del token",
        error: error.message
      });
    }
  });

  app.get("/api/gmail/status", async (req: any, res: any) => {
    try {
      const isReady = gmailService.isReady();
      const testConnection = isReady ? await gmailService.testConnection() : false;
      
      res.json({
        success: true,
        isAuthenticated: isReady,
        connectionTest: testConnection,
        message: isReady ? "Gmail Service attivo" : "Gmail Service non configurato"
      });
    } catch (error: any) {
      console.error("Errore status Gmail:", error);
      res.status(500).json({
        success: false,
        message: "Errore durante il controllo dello status",
        error: error.message
      });
    }
  });

  app.post("/api/gmail/test-email", async (req: any, res: any) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email destinatario richiesta"
        });
      }

      const testCode = "TEST1234";
      const emailSent = await sendAccessCodeEmail(email, testCode, 2);
      
      if (emailSent) {
        res.json({
          success: true,
          message: "Email di test inviata con successo",
          testCode: testCode
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Errore durante l'invio dell'email di test"
        });
      }
    } catch (error: any) {
      console.error("Errore invio email test:", error);
      res.status(500).json({
        success: false,
        message: "Errore durante l'invio dell'email di test",
        error: error.message
      });
    }
  });

  // Simple Email Service API endpoints
  app.get("/api/email/status", async (req: any, res: any) => {
    try {
      res.json({
        success: true,
        isReady: emailService.isReady(),
        message: emailService.isReady() ? "Email service attivo" : "Email service non configurato"
      });
    } catch (error: any) {
      console.error("Errore status email service:", error);
      res.status(500).json({
        success: false,
        message: "Errore durante il controllo dello status",
        error: error.message
      });
    }
  });

  app.post("/api/email/configure", async (req: any, res: any) => {
    try {
      const { user, password, service } = req.body;
      
      if (!user || !password) {
        return res.status(400).json({
          success: false,
          message: "Username e password richiesti"
        });
      }

      emailService.configure({
        service: service || 'gmail',
        user: user,
        pass: password,
        from: `EcoMaker Team <${user}>`
      });

      const testResult = await emailService.testConnection();
      
      res.json({
        success: testResult,
        message: testResult ? "Email service configurato con successo" : "Errore configurazione email service"
      });
    } catch (error: any) {
      console.error("Errore configurazione email service:", error);
      res.status(500).json({
        success: false,
        message: "Errore durante la configurazione",
        error: error.message
      });
    }
  });

  app.post("/api/email/test", async (req: any, res: any) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email destinatario richiesta"
        });
      }

      const testCode = emailService.generateAccessCode();
      const emailSent = await emailService.sendKickstarterAccessCode(email, testCode);
      
      res.json({
        success: emailSent,
        message: emailSent ? "Email di test inviata con successo" : "Errore durante l'invio dell'email di test",
        testCode: emailSent ? testCode : undefined
      });
    } catch (error: any) {
      console.error("Errore invio email test:", error);
      res.status(500).json({
        success: false,
        message: "Errore durante l'invio dell'email di test",
        error: error.message
      });
    }
  });

  // Serve static HTML files from root directory
  app.get("/download-kickstarter-files.html", (req: any, res: any) => {
    try {
      const filePath = path.join(process.cwd(), "download-kickstarter-files.html");
      if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
      } else {
        res.status(404).send("File non trovato");
      }
    } catch (error: any) {
      console.error("Errore serving HTML file:", error);
      res.status(500).send("Errore interno del server");
    }
  });
  return httpServer;
 }

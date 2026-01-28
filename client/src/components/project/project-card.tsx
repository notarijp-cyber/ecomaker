import React from "react";
import { Link } from "wouter";
import { Project } from "@/lib/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Tag, ArrowUpRight, Users, Shield, Recycle } from "lucide-react";
import { AvatarGroup } from "@/components/ui/avatar-group";
import { Button } from "@/components/ui/button";
import { getDifficultyColor } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
}

// Array di default immagini correlate al tipo di progetto
const DEFAULT_PROJECT_IMAGES = [
  "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80", // Lampada bottiglia
  "https://images.unsplash.com/photo-1516992654410-9309d4587e94?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80", // Vaso pneumatico
  "https://images.unsplash.com/photo-1593526411462-6fcd2a4de63f?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80", // Libreria cassette
  "https://images.unsplash.com/photo-1534889196564-a6799df68403?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80", // Arte plastica
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80", // Mobile Palette
  "https://images.unsplash.com/photo-1526306063970-d5498ad00f1c?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80", // Tappeto tessile
  "https://images.unsplash.com/photo-1532570204997-d00b032756d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80", // Giardino verticale
  "https://images.unsplash.com/photo-1525713587156-9a4c6e561a7b?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80", // Eco gioielli
  "https://images.unsplash.com/photo-1602329528682-aebeadd00c2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80", // Contenitori riciclati
  "https://images.unsplash.com/photo-1517694840332-7ed1e82020c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80", // Strumento musicale
];

// Funzione per determinare un'immagine basata sull'ID del progetto o sul nome
const getProjectImage = (project: Project): string => {
  if (project.imageUrl && project.imageUrl.trim() !== '') {
    return project.imageUrl;
  }
  
  // Usa l'id del progetto per prendere un'immagine di default
  const imageIndex = (project.id || 0) % DEFAULT_PROJECT_IMAGES.length;
  return DEFAULT_PROJECT_IMAGES[imageIndex];
};

// Funzione per stimare il risparmio ambientale
const getEnvironmentalSavings = (project: Project): { co2: number, waste: number } => {
  // Calcoliamo valori basati sul numero di materiali e sulla difficoltà
  const materialsCount = Array.isArray(project.requiredMaterials) ? project.requiredMaterials.length : 1;
  
  // Più materiali = più riciclo
  const waste = materialsCount * 0.5; // kg
  
  // Difficoltà incide sull'impatto ambientale (progetti più complessi hanno più impatto)
  let difficultyMultiplier = 1;
  if (project.difficulty.toLowerCase().includes('medio')) difficultyMultiplier = 1.5;
  if (project.difficulty.toLowerCase().includes('avanzato') || 
      project.difficulty.toLowerCase().includes('difficile')) difficultyMultiplier = 2;
  
  const co2 = waste * difficultyMultiplier * 0.8; // kg CO2 equivalente
  
  return { co2, waste };
};

export function ProjectCard({ project }: ProjectCardProps) {
  const projectImage = getProjectImage(project);
  const { co2, waste } = getEnvironmentalSavings(project);
  
  return (
    <Card className="overflow-hidden border border-border/40 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full eco-card group">
      <div className="w-full h-48 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10"></div>
        <img
          src={projectImage}
          alt={project.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 z-20">
          <Badge className="font-medium text-xs px-2 py-1 shadow-sm" variant="secondary">
            {project.difficulty}
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3 z-20 flex gap-2">
          <Badge className="bg-primary/80 hover:bg-primary text-white font-medium text-xs px-2 py-1 shadow-sm flex items-center gap-1">
            <Recycle className="h-3 w-3" /> {waste.toFixed(1)}kg
          </Badge>
          <Badge className="bg-secondary/80 hover:bg-secondary text-white font-medium text-xs px-2 py-1 shadow-sm flex items-center gap-1">
            <Shield className="h-3 w-3" /> {co2.toFixed(1)}kg CO₂
          </Badge>
        </div>
      </div>
      <CardContent className="p-4 flex-1">
        <h3 className="font-heading font-semibold text-lg mb-2 line-clamp-1">{project.name}</h3>
        <p className="text-muted-foreground text-sm line-clamp-3 mb-3">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-1 mt-4 mb-2">
          {Array.isArray(project.requiredMaterials) && project.requiredMaterials.slice(0, 4).map((material: any, index: number) => (
            <Badge key={index} variant="outline" className="bg-secondary/10 text-xs hover:bg-secondary/15">
              {material.name}
            </Badge>
          ))}
          {Array.isArray(project.requiredMaterials) && project.requiredMaterials.length > 4 && (
            <Badge variant="outline" className="bg-secondary/5 text-xs">
              +{project.requiredMaterials.length - 4}
            </Badge>
          )}
        </div>
        
        <div className="mt-3 flex items-center text-xs text-muted-foreground gap-3">
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1 text-primary/80" />
            <span>{project.estimatedTime} {project.timeUnit}</span>
          </div>
          
          {project.isCommunityProject && (
            <div className="flex items-center">
              <Users className="h-3.5 w-3.5 mr-1 text-primary/80" />
              <span>Progetto comunitario</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Link href={`/project-detail/${project.id}`} className="w-full">
          <Button variant="default" className="w-full bg-primary hover:bg-primary/90 gap-1 group relative overflow-hidden">
            <span className="relative z-10">Visualizza progetto</span>
            <ArrowUpRight className="h-4 w-4 relative z-10 transform transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

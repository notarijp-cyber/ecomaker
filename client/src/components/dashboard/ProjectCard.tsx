import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface MaterialBadge {
  id?: number;
  name: string;
  quantity: number;
}

export interface ProjectCardProps {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  time: number;
  co2Savings: number;
  imageUrl: string;
  materials: MaterialBadge[];
  isCommunityProject?: boolean;
  progress?: number;
  participants?: React.ReactNode;
  className?: string;
}

export default function ProjectCard({
  id,
  title,
  description,
  difficulty,
  time,
  co2Savings,
  imageUrl,
  materials,
  isCommunityProject = false,
  progress,
  participants,
  className
}: ProjectCardProps) {
  const getDifficultyColor = (level: string) => {
    switch(level.toLowerCase()) {
      case 'easy':
      case 'facile':
        return 'text-primary';
      case 'medium':
      case 'intermedio':
        return 'text-orange-500';
      case 'hard':
      case 'difficile':
        return 'text-red-500';
      default:
        return 'text-primary';
    }
  };
  
  const difficultyColor = getDifficultyColor(difficulty);
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="relative h-48">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-3 left-3">
          <Badge className="bg-white text-xs font-semibold px-2 py-1 rounded-full">
            <span className={difficultyColor}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </span>
          </Badge>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-heading font-semibold text-lg mb-2">{title}</h3>
        <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
          {description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1 text-sm">
            <span className="material-icons text-green-500 text-base">eco</span>
            <span className="text-green-600 font-medium">Risparmio {co2Savings/1000}kg CO2</span>
          </div>
          <div className="flex items-center space-x-1 text-sm">
            <span className="material-icons text-neutral-600 text-base">schedule</span>
            <span>{time} min</span>
          </div>
        </div>
        
        {progress !== undefined && (
          <div className="bg-neutral-100 rounded-lg p-3 mb-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-sm">Completamento del progetto</h4>
              <span className="text-sm font-semibold">{progress}%</span>
            </div>
            <div className="h-1 bg-neutral-200 rounded-sm overflow-hidden">
              <div className="bg-primary h-full rounded-sm" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}
        
        {participants && (
          <div className="flex justify-between items-center mb-3">
            {participants}
          </div>
        )}
        
        <div className="flex items-center space-x-2 mb-4">
          {materials.slice(0, 3).map((material, index) => (
            <div 
              key={index} 
              className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-xs"
              title={material.name}
            >
              {material.name.charAt(0).toUpperCase()}
            </div>
          ))}
          {materials.length > 3 && (
            <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full">
              +{materials.length - 3}
            </span>
          )}
        </div>
        
        <Link href={`/projects/${id}`}>
          <Button className="w-full bg-primary hover:bg-primary-dark text-white font-medium">
            {isCommunityProject ? "Partecipa al Progetto" : "Inizia Progetto"}
          </Button>
        </Link>
      </div>
    </Card>
  );
}

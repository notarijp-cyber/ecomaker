import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Project, ProjectParticipant } from "@/lib/types";
import { useAIAssistant } from "@/hooks/use-ai-assistant";
import { 
  Users, 
  Brain, 
  Puzzle, 
  Loader2,
  UserCircle2,
  CalendarDays
} from "lucide-react";
import { AvatarGroup } from "@/components/ui/avatar-group";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface ProjectDivisionProps {
  project: Project;
  participants: ProjectParticipant[];
}

export function ProjectDivision({ project, participants }: ProjectDivisionProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const ai = useAIAssistant();
  
  const generateDivisionPlan = async () => {
    setIsGenerating(true);
    try {
      await ai.createProjectDivisionPlan(project, Array.isArray(participants) ? participants.length || 5 : 5);
    } catch (error) {
      console.error("Error generating division plan:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Sample division data (this would ideally come from the AI assistant)
  const divisionPlan = ai.projectDivisionPlan || [
    {
      name: "Sezione 1: Raccolta e Preparazione Materiali",
      description: "Raccolta e pulizia dei materiali necessari per il progetto",
      assignedTo: "Mario, Laura",
      deadline: "10 Giugno 2023",
      progress: 75
    },
    {
      name: "Sezione 2: Assemblaggio Base",
      description: "Creazione della struttura portante del progetto",
      assignedTo: "Giovanni, Andrea",
      deadline: "12 Giugno 2023",
      progress: 50
    },
    {
      name: "Sezione 3: Dettagli e Finiture",
      description: "Lavorazione dei dettagli estetici e finiture",
      assignedTo: "Lucia, Paolo",
      deadline: "14 Giugno 2023",
      progress: 30
    }
  ];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Partecipanti al Progetto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="mb-2">
                <AvatarGroup
                  items={[
                    { fallback: "M" },
                    { fallback: "L" },
                    { fallback: "G" },
                    { fallback: "A" },
                    { fallback: "P" }
                  ]}
                  max={5}
                  size="md"
                />
              </div>
              <p className="text-sm text-neutral-medium">
                {Array.isArray(participants) ? participants.length || 5 : 5} partecipanti attivi in questo progetto
              </p>
            </div>
            
            <Button
              onClick={generateDivisionPlan}
              disabled={isGenerating}
              className="bg-accent text-white"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generazione in corso...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Genera Piano con AI
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="puzzle">
        <TabsList className="w-full">
          <TabsTrigger value="puzzle" className="flex-1">
            <Puzzle className="h-4 w-4 mr-2" />
            Divisione Puzzle
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex-1">
            <UserCircle2 className="h-4 w-4 mr-2" />
            Assegnazioni
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex-1">
            <CalendarDays className="h-4 w-4 mr-2" />
            Timeline
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="puzzle" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-4">
                {divisionPlan.map((section: any, index: number) => (
                  <div 
                    key={index} 
                    className="border border-neutral-light rounded-lg bg-white p-4 flex flex-col h-full"
                    style={{ 
                      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
                      transform: `rotate(${Math.random() * 2 - 1}deg)`
                    }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <Badge className="bg-accent bg-opacity-20 text-accent">
                        Sezione {index + 1}
                      </Badge>
                      <div className="text-xs text-neutral-medium">
                        {section.progress}% completato
                      </div>
                    </div>
                    
                    <h3 className="font-heading font-medium mb-2">{section.name.split(":")[1]}</h3>
                    <p className="text-sm text-neutral-medium mb-3 flex-grow">{section.description}</p>
                    
                    <div className="mt-auto">
                      <div className="text-xs text-neutral-medium mb-1">Assegnato a:</div>
                      <div className="text-sm font-medium">{section.assignedTo}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-neutral-medium mb-2">
                  Ogni partecipante può prendere in carico un pezzo del puzzle del progetto
                </p>
                <Button variant="outline">
                  Prendi un pezzo
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="assignments" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sezione</TableHead>
                    <TableHead>Descrizione</TableHead>
                    <TableHead>Assegnato a</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Progresso</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {divisionPlan.map((section: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{section.name}</TableCell>
                      <TableCell>{section.description}</TableCell>
                      <TableCell>{section.assignedTo}</TableCell>
                      <TableCell>{section.deadline}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-full bg-neutral-light rounded-full h-2 mr-2">
                            <div 
                              className="bg-primary rounded-full h-2" 
                              style={{ width: `${section.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-neutral-medium">
                            {section.progress}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="timeline" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-neutral-light"></div>
                
                {divisionPlan.map((section: any, index: number) => (
                  <div key={index} className="relative flex mb-6 ml-8">
                    <div className="absolute -left-8 mt-1 w-4 h-4 rounded-full bg-primary-light flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    </div>
                    
                    <div className="bg-white border border-neutral-light rounded-lg p-4 w-full">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-heading font-medium">{section.name}</h3>
                        <Badge variant="outline">{section.deadline}</Badge>
                      </div>
                      <p className="text-sm text-neutral-medium mb-3">{section.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-neutral-medium">
                          Assegnato a: <span className="font-medium">{section.assignedTo}</span>
                        </div>
                        <div className="text-xs flex items-center">
                          <div className="w-20 bg-neutral-light rounded-full h-1.5 mr-2">
                            <div 
                              className="bg-primary rounded-full h-1.5" 
                              style={{ width: `${section.progress}%` }}
                            ></div>
                          </div>
                          <span>{section.progress}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="relative flex ml-8">
                  <div className="absolute -left-8 mt-1 w-4 h-4 rounded-full bg-secondary-light flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  </div>
                  
                  <div className="bg-white border border-neutral-light rounded-lg p-4 w-full border-dashed">
                    <h3 className="font-heading font-medium">Completamento Progetto</h3>
                    <p className="text-sm text-neutral-medium">
                      Data stimata di completamento: 18 Giugno 2023
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

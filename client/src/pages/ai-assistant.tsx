import React, { useState } from "react";
import AIProjectChat from "@/components/chat/AIProjectChat";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Project } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { PageLayout } from "@/components/layout/page-layout";

export default function AIAssistantPage() {
  const [createdProject, setCreatedProject] = useState<Project | null>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleProjectCreated = (project: Project) => {
    setCreatedProject(project);
    toast({
      title: "Progetto creato!",
      description: "Il tuo progetto è stato creato con successo nell'archivio personale.",
    });
  };

  const viewCreatedProject = () => {
    if (createdProject) {
      setLocation(`/project-detail/${createdProject.id}`);
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Assistente AI</h1>
          <p className="text-muted-foreground mt-2">
            Crea progetti personalizzati conversando con il nostro assistente AI specializzato in upcycling e riuso creativo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <AIProjectChat onProjectCreated={handleProjectCreated} />
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Progetto Creato</CardTitle>
                <CardDescription>
                  Quando crei un progetto tramite la chat, apparirà qui.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {createdProject ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{createdProject.name}</h3>
                      <p className="text-sm text-muted-foreground">{createdProject.description}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {createdProject.difficulty}
                        </span>
                        <span className="text-xs">
                          {createdProject.estimatedTime} {createdProject.timeUnit}
                        </span>
                      </div>
                      <button
                        onClick={viewCreatedProject}
                        className="text-sm font-medium text-primary hover:text-primary/80"
                      >
                        Visualizza dettagli
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>Nessun progetto creato</p>
                    <p className="text-sm mt-1">
                      Chiedi all'AI di creare un progetto completo per vederne i dettagli qui
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Suggerimenti</CardTitle>
                <CardDescription>
                  Come ottenere il massimo dall'assistente AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="materials">
                  <TabsList className="w-full">
                    <TabsTrigger value="materials" className="flex-1">Materiali</TabsTrigger>
                    <TabsTrigger value="projects" className="flex-1">Progetti</TabsTrigger>
                    <TabsTrigger value="instructions" className="flex-1">Istruzioni</TabsTrigger>
                  </TabsList>
                  <TabsContent value="materials" className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Specifica i materiali</h4>
                      <p className="text-sm text-muted-foreground">
                        Più materiali specifichi, più personalizzato sarà il progetto. L'AI può suggerire altri materiali complementari.
                      </p>
                    </div>
                    <div className="text-sm border rounded-md p-3 bg-muted/50">
                      <p className="font-medium">Esempi di prompt:</p>
                      <ul className="list-disc list-inside space-y-1 mt-1 text-muted-foreground">
                        <li>"Ho delle bottiglie di plastica e vecchie riviste, cosa posso creare?"</li>
                        <li>"Voglio riutilizzare dei pallet di legno, hai idee?"</li>
                      </ul>
                    </div>
                  </TabsContent>
                  <TabsContent value="projects" className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Specifica il tipo di progetto</h4>
                      <p className="text-sm text-muted-foreground">
                        Puoi chiedere progetti specifici per uso, dimensione, difficoltà o stile artistico.
                      </p>
                    </div>
                    <div className="text-sm border rounded-md p-3 bg-muted/50">
                      <p className="font-medium">Esempi di prompt:</p>
                      <ul className="list-disc list-inside space-y-1 mt-1 text-muted-foreground">
                        <li>"Voglio creare un'illuminazione con bottiglie di vetro"</li>
                        <li>"Puoi suggerirmi un progetto facile per bambini?"</li>
                        <li>"Ho bisogno di mobili da giardino fatti con materiali riciclati"</li>
                      </ul>
                    </div>
                  </TabsContent>
                  <TabsContent value="instructions" className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Richiedi un progetto completo</h4>
                      <p className="text-sm text-muted-foreground">
                        Quando sei soddisfatto di un'idea, chiedi all'AI di creare un progetto completo con istruzioni dettagliate.
                      </p>
                    </div>
                    <div className="text-sm border rounded-md p-3 bg-muted/50">
                      <p className="font-medium">Esempi di prompt:</p>
                      <ul className="list-disc list-inside space-y-1 mt-1 text-muted-foreground">
                        <li>"Mi piace questa idea! Puoi creare un progetto completo?"</li>
                        <li>"Genera un progetto dettagliato per questa lampada"</li>
                        <li>"Voglio salvare questo progetto, puoi elaborarlo in dettaglio?"</li>
                      </ul>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
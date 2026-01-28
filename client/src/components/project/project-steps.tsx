import React from "react";
import { Project } from "@/lib/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, Lightbulb } from "lucide-react";

interface ProjectStepsProps {
  project: Project;
}

export function ProjectSteps({ project }: ProjectStepsProps) {
  const estimatedTimePerStep = project?.estimatedTime 
    ? Math.round((project.estimatedTime / (Array.isArray(project?.instructions) ? project.instructions.length : 1)) * 100) / 100
    : 0;
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Istruzioni Passo-Passo Dettagliate</CardTitle>
        </CardHeader>
        <CardContent>
          {!Array.isArray(project?.instructions) || project?.instructions.length === 0 ? (
            <p className="text-neutral-medium">
              Nessuna istruzione disponibile per questo progetto.
            </p>
          ) : (
            <>
              <div className="mb-4 bg-amber-50 border border-amber-100 p-4 rounded-lg">
                <h3 className="text-amber-800 font-medium flex items-center mb-2">
                  <Clock className="h-5 w-5 mr-2 text-amber-500" />
                  Tempo Totale: {project?.estimatedTime || 1} {project?.timeUnit || 'ore'}
                </h3>
                <p className="text-sm text-amber-700">
                  Segui queste istruzioni nell'ordine indicato per completare il progetto. 
                  Ogni passaggio è progettato per guidarti dalla preparazione al risultato finale.
                </p>
              </div>
            
              <Accordion type="single" collapsible className="w-full">
                {project.instructions.map((instruction, index) => (
                  <AccordionItem key={index} value={`step-${index}`}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-3 w-8 h-8 rounded-full bg-primary-light bg-opacity-20 text-primary flex items-center justify-center font-medium">
                          {index + 1}
                        </div>
                        <span className="text-left font-medium">
                          {instruction && typeof instruction === 'string' && instruction.length > 60 
                            ? instruction.substring(0, 60) + "..." 
                            : instruction || `Passo ${index + 1}`}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-11">
                      <div className="space-y-3">
                        <p className="text-neutral-dark">{instruction || "Nessuna descrizione disponibile"}</p>
                        
                        <div className="flex items-center text-sm text-neutral-medium">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Tempo stimato: {estimatedTimePerStep} {project?.timeUnit || 'ore'}</span>
                        </div>
                        
                        {/* Sezione di materiali specifici per questo step, se disponibili */}
                        {project?.requiredMaterials && project.requiredMaterials.length > 0 && index === 0 && (
                          <div className="bg-blue-50 p-3 rounded-md mt-2">
                            <h4 className="text-sm font-medium text-blue-700 mb-1">Materiali necessari per questo passaggio:</h4>
                            <ul className="text-sm text-blue-600 ml-5 list-disc">
                              {project.requiredMaterials.slice(0, 3).map((material: any, midx: number) => (
                                <li key={midx}>{material.name} - {material.quantity} {material.unit}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {/* Strumenti specifici per questo step, se disponibili */}
                        {project?.requiredTools && project.requiredTools.length > 0 && index === 0 && (
                          <div className="bg-purple-50 p-3 rounded-md mt-2">
                            <h4 className="text-sm font-medium text-purple-700 mb-1">Strumenti necessari per questo passaggio:</h4>
                            <ul className="text-sm text-purple-600 ml-5 list-disc">
                              {project.requiredTools.slice(0, 3).map((tool: any, tidx: number) => (
                                <li key={tidx}>{tool.name}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {/* Consigli specifici per ogni step */}
                        {index === 0 && (
                          <div className="bg-primary-light bg-opacity-10 p-3 rounded-md mt-3">
                            <div className="flex items-start">
                              <Lightbulb className="h-5 w-5 text-primary flex-shrink-0 mt-0.5 mr-2" />
                              <p className="text-sm">
                                <span className="font-medium">Consiglio di preparazione:</span> Prima di iniziare, disponi tutti i materiali e gli strumenti su una superficie di lavoro pulita e ben illuminata. Proteggi l'area con giornali o un telo se lavori con materiali che potrebbero macchiare.
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {index === 1 && (
                          <div className="bg-primary-light bg-opacity-10 p-3 rounded-md mt-3">
                            <div className="flex items-start">
                              <Lightbulb className="h-5 w-5 text-primary flex-shrink-0 mt-0.5 mr-2" />
                              <p className="text-sm">
                                <span className="font-medium">Consiglio tecnico:</span> Misura due volte, taglia una volta! Verifica sempre le dimensioni prima di tagliare o modificare permanentemente i materiali. Scatta foto del tuo progresso per documentare ogni fase.
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {index === 2 && (
                          <div className="bg-primary-light bg-opacity-10 p-3 rounded-md mt-3">
                            <div className="flex items-start">
                              <Lightbulb className="h-5 w-5 text-primary flex-shrink-0 mt-0.5 mr-2" />
                              <p className="text-sm">
                                <span className="font-medium">Consiglio di sicurezza:</span> Se stai utilizzando attrezzi come coltelli, forbici o strumenti elettrici, fai sempre attenzione. Lavora in un'area ben ventilata se usi colle, vernici o prodotti chimici.
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {/* Esempio immagine di riferimento o miniatura per alcuni passaggi */}
                        {project?.imageUrl && [0, 3, 5].includes(index) && (
                          <div className="mt-3 border rounded-lg overflow-hidden">
                            <div className="text-xs text-neutral-medium bg-neutral-lightest px-3 py-1 border-b">
                              Immagine di riferimento
                            </div>
                            <img 
                              src={project.imageUrl} 
                              alt={`Riferimento per il passaggio ${index + 1}`} 
                              className="w-full h-32 object-cover object-center"
                            />
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Check className="h-5 w-5 mr-2 text-success" />
            Risultato Finale
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-neutral-medium">
              Al termine di questi passaggi, avrai realizzato {project?.name || 'un progetto sostenibile'} utilizzando materiali riciclati!
            </p>
            
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge className="bg-success bg-opacity-10 text-success">
                Progetto Sostenibile
              </Badge>
              <Badge className="bg-primary-light bg-opacity-10 text-primary">
                Materiali Riciclati
              </Badge>
              <Badge className="bg-secondary bg-opacity-10 text-secondary">
                Creatività
              </Badge>
            </div>
            
            <div className="bg-neutral-lightest p-4 rounded-md mt-4">
              <div className="text-sm">
                <span className="font-medium">Impatto ambientale positivo:</span> 
                <ul className="mt-1 space-y-1">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Riduzione dei rifiuti</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Risparmio economico</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Sensibilizzazione sulla sostenibilità</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
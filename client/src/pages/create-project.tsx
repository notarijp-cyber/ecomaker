import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PageLayout } from "@/components/layout/page-layout";
import { ProjectAISuggestions } from "@/components/project/project-ai-suggestions";
import { useAIAssistant } from "@/hooks/use-ai-assistant";
import { useMaterialInventory } from "@/hooks/use-material-inventory";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Check,
  Brain,
  Loader2,
  Sparkles,
  Lightbulb,
  Users,
  Plus,
  Trash2,
  FileText,
  ClipboardList
} from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { DifficultyLevel } from "@/lib/types";

// Define form schema
const projectSchema = z.object({
  name: z.string().min(3, { message: "Il nome deve contenere almeno 3 caratteri" }),
  description: z.string().min(10, { message: "La descrizione deve contenere almeno 10 caratteri" }),
  difficulty: z.string(),
  estimatedTime: z.coerce.number().min(0.1, { message: "Inserisci un tempo stimato valido" }),
  timeUnit: z.string(),
  isCommunityProject: z.boolean().default(false),
  instructions: z.array(z.string()).min(1, { message: "Aggiungi almeno un'istruzione" }),
  requiredMaterials: z.array(z.object({
    name: z.string().min(1, { message: "Il nome del materiale è obbligatorio" }),
    quantity: z.coerce.number().min(0.1, { message: "La quantità deve essere maggiore di 0" }),
    unit: z.string()
  })).min(1, { message: "Aggiungi almeno un materiale" }),
  requiredTools: z.array(z.object({
    name: z.string().min(1, { message: "Il nome dello strumento è obbligatorio" }),
    link: z.string().optional()
  })).min(1, { message: "Aggiungi almeno uno strumento" })
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function CreateProject() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { materials, materialTypes } = useMaterialInventory(1); // using demo user
  const ai = useAIAssistant();
  
  const [step, setStep] = useState(1);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedMaterialsQuantity, setSelectedMaterialsQuantity] = useState<Record<string, number>>({});
  
  // Setup form with default values
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      difficulty: DifficultyLevel.EASY,
      estimatedTime: 1,
      timeUnit: "ore",
      isCommunityProject: false,
      instructions: [""],
      requiredMaterials: [{ name: "", quantity: 1, unit: "pezzo" }],
      requiredTools: [{ name: "", link: "" }],
    },
  });
  
  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: async (data: ProjectFormValues) => {
      const response = await apiRequest('POST', '/api/projects', {
        ...data,
        userId: 1, // Demo user
        isPublic: true,
        imageUrl: "",
        completionPercentage: 0
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Progetto creato",
        description: "Il tuo progetto è stato creato con successo",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      setLocation("/my-projects");
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la creazione del progetto",
        variant: "destructive",
      });
      console.error("Error creating project:", error);
    }
  });
  
  // Function to add an instruction field
  const addInstruction = () => {
    const currentInstructions = form.getValues("instructions");
    form.setValue("instructions", [...currentInstructions, ""]);
  };
  
  // Function to remove an instruction field
  const removeInstruction = (index: number) => {
    const currentInstructions = form.getValues("instructions");
    form.setValue("instructions", currentInstructions.filter((_, i) => i !== index));
  };
  
  // Function to add a material field
  const addMaterial = () => {
    const currentMaterials = form.getValues("requiredMaterials");
    form.setValue("requiredMaterials", [...currentMaterials, { name: "", quantity: 1, unit: "pezzo" }]);
  };
  
  // Function to remove a material field
  const removeMaterial = (index: number) => {
    const currentMaterials = form.getValues("requiredMaterials");
    form.setValue("requiredMaterials", currentMaterials.filter((_, i) => i !== index));
  };
  
  // Function to add a tool field
  const addTool = () => {
    const currentTools = form.getValues("requiredTools");
    form.setValue("requiredTools", [...currentTools, { name: "", link: "" }]);
  };
  
  // Function to remove a tool field
  const removeTool = (index: number) => {
    const currentTools = form.getValues("requiredTools");
    form.setValue("requiredTools", currentTools.filter((_, i) => i !== index));
  };
  
  // Handle form submission
  const onSubmit = (data: ProjectFormValues) => {
    createProjectMutation.mutate(data);
  };
  
  // Handle material selection and generate AI ideas
  const handleGenerateIdeas = async () => {
    if (selectedMaterials.length === 0) {
      toast({
        title: "Nessun materiale selezionato",
        description: "Seleziona almeno un materiale per generare idee",
        variant: "destructive",
      });
      return;
    }
    
    // Creiamo una lista di materiali con la loro quantità per l'AI
    const materialsWithQuantity = selectedMaterials.map(materialName => {
      const quantity = selectedMaterialsQuantity[materialName] || 1;
      const material = materials?.find(m => m.name === materialName);
      const unit = material?.unit || 'pezzo';
      
      return `${materialName} (${quantity} ${unit})`;
    });
    
    setIsGeneratingIdeas(true);
    try {
      await ai.generateProjectIdeas(materialsWithQuantity);
      setShowAISuggestions(true);
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la generazione delle idee",
        variant: "destructive",
      });
      console.error("Error generating ideas:", error);
    } finally {
      setIsGeneratingIdeas(false);
    }
  };
  
  // Handle AI suggestion selection
  const handleSelectSuggestion = (suggestion: any) => {
    // Impostiamo valori sicuri con controlli per null/undefined
    form.setValue("name", suggestion.name || "Nuovo Progetto");
    form.setValue("description", suggestion.description || "");
    form.setValue("difficulty", suggestion.difficulty || DifficultyLevel.EASY);
    form.setValue("estimatedTime", suggestion.estimatedTime || 1);
    form.setValue("timeUnit", suggestion.timeUnit || "ore");
    
    // Controlli per array, assicurandoci che ci siano sempre valori validi
    if (Array.isArray(suggestion.instructions) && suggestion.instructions.length > 0) {
      form.setValue("instructions", suggestion.instructions);
    } else {
      form.setValue("instructions", ["Istruzioni da definire"]);
    }
    
    if (Array.isArray(suggestion.requiredMaterials) && suggestion.requiredMaterials.length > 0) {
      const validMaterials = suggestion.requiredMaterials.map((material: any) => ({
        name: material.name || "",
        quantity: material.quantity || 1,
        unit: material.unit || "pezzo"
      }));
      form.setValue("requiredMaterials", validMaterials);
    } else {
      form.setValue("requiredMaterials", [{ name: "", quantity: 1, unit: "pezzo" }]);
    }
    
    if (Array.isArray(suggestion.requiredTools) && suggestion.requiredTools.length > 0) {
      const validTools = suggestion.requiredTools.map((tool: any) => ({
        name: tool.name || "",
        link: tool.link || ""
      }));
      form.setValue("requiredTools", validTools);
    } else {
      form.setValue("requiredTools", [{ name: "", link: "" }]);
    }
    
    // Impostiamo il valore dell'immagine se presente
    if (suggestion.imageUrl) {
      // Aggiungiamo l'immagine senza usare setValue, poiché non fa parte dello schema ufficiale
      const formValues = form.getValues();
      (formValues as any).imageUrl = suggestion.imageUrl;
    }
    
    setShowAISuggestions(false);
    setStep(2);
  };
  
  // Toggle material selection
  const toggleMaterialSelection = (material: any) => {
    const materialName = material.name;
    
    if (selectedMaterials.includes(materialName)) {
      // Se il materiale è già selezionato, lo rimuoviamo
      setSelectedMaterials(prev => prev.filter(m => m !== materialName));
      
      // Rimuoviamo anche la quantità
      const newQuantities = {...selectedMaterialsQuantity};
      delete newQuantities[materialName];
      setSelectedMaterialsQuantity(newQuantities);
    } else {
      // Altrimenti lo aggiungiamo
      setSelectedMaterials(prev => [...prev, materialName]);
      
      // Impostiamo la quantità predefinita
      setSelectedMaterialsQuantity(prev => ({
        ...prev,
        [materialName]: material.quantity || 1
      }));
    }
  };
  
  // Update material quantity
  const updateMaterialQuantity = (materialName: string, quantity: number) => {
    if (quantity > 0) {
      setSelectedMaterialsQuantity(prev => ({
        ...prev,
        [materialName]: quantity
      }));
    }
  };
  
  return (
    <PageLayout showFab={false}>
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Link href="/my-projects">
            <Button variant="ghost" className="p-0 mr-2">
              <ArrowLeft className="h-5 w-5 mr-1" />
            </Button>
          </Link>
          <h2 className="text-2xl font-heading font-bold">Crea un nuovo progetto</h2>
        </div>
        <p className="text-neutral-medium">
          Crea un progetto personalizzato o lasciati ispirare dall'intelligenza artificiale.
        </p>
      </div>
      
      {showAISuggestions ? (
        <ProjectAISuggestions 
          suggestions={ai.projectSuggestions}
          isLoading={ai.isLoading}
          error={ai.error}
          onSelect={handleSelectSuggestion}
          onBack={() => setShowAISuggestions(false)}
        />
      ) : (
        <>
          {/* Step indicators */}
          <div className="mb-6">
            <div className="flex items-center">
              <div className={`flex-1 h-2 ${step >= 1 ? "bg-primary" : "bg-neutral-light"} rounded-l-full`}></div>
              <div className={`flex-1 h-2 ${step >= 2 ? "bg-primary" : "bg-neutral-light"}`}></div>
              <div className={`flex-1 h-2 ${step >= 3 ? "bg-primary" : "bg-neutral-light"} rounded-r-full`}></div>
            </div>
            <div className="flex justify-between mt-2">
              <span className={`text-xs ${step >= 1 ? "text-primary font-medium" : "text-neutral-medium"}`}>Materiali</span>
              <span className={`text-xs ${step >= 2 ? "text-primary font-medium" : "text-neutral-medium"}`}>Dettagli</span>
              <span className={`text-xs ${step >= 3 ? "text-primary font-medium" : "text-neutral-medium"}`}>Istruzioni</span>
            </div>
          </div>
          
          {step === 1 && (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="h-5 w-5 text-secondary mr-2" />
                    Generazione con AI
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-medium mb-4">
                    Seleziona i materiali che hai a disposizione e lascia che l'AI ti suggerisca idee per il tuo progetto.
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
                    {/* Material selection */}
                    {materials && materials.length > 0 ? (
                      materials.map((material) => (
                        <div
                          key={material.id}
                          className={`border rounded-md p-3 transition-colors ${
                            selectedMaterials.includes(material.name)
                              ? "border-primary bg-primary bg-opacity-5"
                              : "border-neutral-light hover:border-primary"
                          }`}
                        >
                          <div className="flex items-center cursor-pointer" onClick={() => toggleMaterialSelection(material)}>
                            {selectedMaterials.includes(material.name) && (
                              <Check className="h-4 w-4 text-primary mr-1" />
                            )}
                            <span className={selectedMaterials.includes(material.name) ? "font-medium" : ""}>
                              {material.name}
                            </span>
                          </div>
                          
                          {material.imageUrl && (
                            <div className="mt-2 mb-2">
                              <img 
                                src={material.imageUrl} 
                                alt={material.name}
                                className="w-full h-20 object-cover rounded-sm"
                              />
                            </div>
                          )}
                          
                          <div className="text-xs text-neutral-medium mt-1 flex justify-between items-center">
                            <span>Disponibile: {material.quantity} {material.unit}</span>
                          </div>
                          
                          {selectedMaterials.includes(material.name) && (
                            <div className="mt-2 pt-2 border-t border-border/30">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-neutral-medium">Quantità da utilizzare:</span>
                                <div className="flex items-center">
                                  <button
                                    type="button"
                                    className="w-6 h-6 flex items-center justify-center bg-background-secondary rounded-l-sm text-primary border border-border"
                                    onClick={() => {
                                      const currentQty = selectedMaterialsQuantity[material.name] || 1;
                                      if (currentQty > 1) {
                                        updateMaterialQuantity(material.name, currentQty - 1);
                                      }
                                    }}
                                  >
                                    -
                                  </button>
                                  <div className="w-10 h-6 flex items-center justify-center border-t border-b border-border bg-background">
                                    {selectedMaterialsQuantity[material.name] || 1}
                                  </div>
                                  <button
                                    type="button"
                                    className="w-6 h-6 flex items-center justify-center bg-background-secondary rounded-r-sm text-primary border border-border"
                                    onClick={() => {
                                      const currentQty = selectedMaterialsQuantity[material.name] || 1;
                                      if (currentQty < material.quantity) {
                                        updateMaterialQuantity(material.name, currentQty + 1);
                                      }
                                    }}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="col-span-4 p-4 text-center bg-background-secondary/30 rounded-md">
                        <p className="text-neutral-medium">Caricamento materiali in corso...</p>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    className="w-full bg-secondary text-white"
                    onClick={handleGenerateIdeas}
                    disabled={isGeneratingIdeas || selectedMaterials.length === 0}
                  >
                    {isGeneratingIdeas ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generando idee...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Genera idee con AI
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setLocation("/my-projects")}>
                  Annulla
                </Button>
                <Button onClick={() => setStep(2)}>
                  Continua manualmente
                </Button>
              </div>
            </>
          )}
          
          {step === 2 && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Dettagli del Progetto</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome del progetto</FormLabel>
                          <FormControl>
                            <Input placeholder="Es. Lampada da bottiglia di vetro" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrizione</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Descrivi brevemente il tuo progetto..."
                              className="min-h-24"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="difficulty"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Difficoltà</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleziona difficoltà" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value={DifficultyLevel.EASY}>{DifficultyLevel.EASY}</SelectItem>
                                <SelectItem value={DifficultyLevel.MEDIUM}>{DifficultyLevel.MEDIUM}</SelectItem>
                                <SelectItem value={DifficultyLevel.ADVANCED}>{DifficultyLevel.ADVANCED}</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex space-x-2">
                        <FormField
                          control={form.control}
                          name="estimatedTime"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Tempo stimato</FormLabel>
                              <FormControl>
                                <Input type="number" min="0.1" step="0.1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="timeUnit"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Unità</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleziona unità" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="minuti">minuti</SelectItem>
                                  <SelectItem value="ore">ore</SelectItem>
                                  <SelectItem value="giorni">giorni</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="isCommunityProject"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 mt-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="flex items-center">
                              <Users className="h-4 w-4 mr-2" />
                              Progetto comunitario
                            </FormLabel>
                            <p className="text-xs text-neutral-medium">
                              Consenti ad altri utenti di partecipare al tuo progetto
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Materiali e Strumenti</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-heading font-medium mb-3">Materiali Necessari</h3>
                      <div className="space-y-3">
                        {form.watch("requiredMaterials").map((_, index) => (
                          <div key={index} className="flex items-end space-x-2">
                            <FormField
                              control={form.control}
                              name={`requiredMaterials.${index}.name`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormLabel className={index !== 0 ? "sr-only" : ""}>Nome materiale</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Es. Bottiglia di vetro" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name={`requiredMaterials.${index}.quantity`}
                              render={({ field }) => (
                                <FormItem className="w-20">
                                  <FormLabel className={index !== 0 ? "sr-only" : ""}>Quantità</FormLabel>
                                  <FormControl>
                                    <Input type="number" min="0.1" step="0.1" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name={`requiredMaterials.${index}.unit`}
                              render={({ field }) => (
                                <FormItem className="w-24">
                                  <FormLabel className={index !== 0 ? "sr-only" : ""}>Unità</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Unità" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="pezzo">pezzo</SelectItem>
                                      <SelectItem value="kg">kg</SelectItem>
                                      <SelectItem value="g">g</SelectItem>
                                      <SelectItem value="metro">metro</SelectItem>
                                      <SelectItem value="cm">cm</SelectItem>
                                      <SelectItem value="litro">litro</SelectItem>
                                      <SelectItem value="ml">ml</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeMaterial(index)}
                              className="mb-0.5"
                              disabled={form.watch("requiredMaterials").length <= 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addMaterial}
                          className="mt-2"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Aggiungi materiale
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-heading font-medium mb-3">Strumenti Necessari</h3>
                      <div className="space-y-3">
                        {form.watch("requiredTools").map((_, index) => (
                          <div key={index} className="flex items-end space-x-2">
                            <FormField
                              control={form.control}
                              name={`requiredTools.${index}.name`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormLabel className={index !== 0 ? "sr-only" : ""}>Nome strumento</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Es. Forbici" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name={`requiredTools.${index}.link`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormLabel className={index !== 0 ? "sr-only" : ""}>Link Amazon (opzionale)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="https://www.amazon.it/..." {...field} value={field.value || ""} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeTool(index)}
                              className="mb-0.5"
                              disabled={form.watch("requiredTools").length <= 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addTool}
                          className="mt-2"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Aggiungi strumento
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    Indietro
                  </Button>
                  <Button type="button" onClick={() => setStep(3)}>
                    Continua
                  </Button>
                </div>
              </form>
            </Form>
          )}
          
          {step === 3 && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Istruzioni Passo-Passo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-neutral-medium mb-4">
                      Aggiungi le istruzioni dettagliate per completare il progetto.
                    </p>
                    
                    <div className="space-y-3">
                      {form.watch("instructions").map((_, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="mt-2 flex-shrink-0 w-6 h-6 rounded-full bg-primary-light bg-opacity-20 text-primary flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          
                          <FormField
                            control={form.control}
                            name={`instructions.${index}`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Textarea
                                    placeholder={`Passo ${index + 1}: Descrivi cosa fare...`}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeInstruction(index)}
                            className="mt-2"
                            disabled={form.watch("instructions").length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addInstruction}
                        className="mt-2"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Aggiungi passaggio
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lightbulb className="h-5 w-5 mr-2" />
                      Suggerimenti per il Progetto
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="bg-primary-light bg-opacity-10 p-3 rounded-md">
                        <p className="text-sm">
                          <span className="font-medium">Consiglio:</span> Ricorda di scattare foto durante la realizzazione per documentare il processo e condividerlo con la community.
                        </p>
                      </div>
                      
                      <div className="bg-primary-light bg-opacity-10 p-3 rounded-md">
                        <p className="text-sm">
                          <span className="font-medium">Consiglio:</span> Assicurati di avere tutti i materiali e gli strumenti necessari prima di iniziare.
                        </p>
                      </div>
                      
                      <div className="bg-primary-light bg-opacity-10 p-3 rounded-md">
                        <p className="text-sm">
                          <span className="font-medium">Consiglio:</span> Se è un progetto comunitario, assegna compiti specifici ai partecipanti per una migliore organizzazione.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setStep(2)}>
                    Indietro
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-primary text-white"
                    disabled={createProjectMutation.isPending}
                  >
                    {createProjectMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creazione in corso...
                      </>
                    ) : (
                      "Crea Progetto"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </>
      )}
    </PageLayout>
  );
}

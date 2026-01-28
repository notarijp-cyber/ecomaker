import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useMaterialInventory } from "@/hooks/use-material-inventory";
import { useAIAssistant } from "@/hooks/use-ai-assistant";
import { Calendar, Clock, Users, Trash2, Plus, CalendarClock, MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription 
} from "@/components/ui/card";

export function CommunityEventCreator() {
  const [open, setOpen] = useState<boolean>(false);
  const [participants, setParticipants] = useState<number>(5);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [generatingIdeas, setGeneratingIdeas] = useState<boolean>(false);
  const [selectedIdea, setSelectedIdea] = useState<number | null>(null);
  
  const { materials } = useMaterialInventory(1); // Using demo user id
  const { 
    communityEventIdeas, 
    generateCommunityEventIdeas,
    isLoading,
    error
  } = useAIAssistant();

  const handleGenerateIdeas = async () => {
    if (selectedMaterials.length === 0) return;
    
    setGeneratingIdeas(true);
    await generateCommunityEventIdeas(selectedMaterials, participants);
    setGeneratingIdeas(false);
  };

  const handleMaterialToggle = (material: string) => {
    if (selectedMaterials.includes(material)) {
      setSelectedMaterials(selectedMaterials.filter(m => m !== material));
    } else {
      setSelectedMaterials([...selectedMaterials, material]);
    }
  };

  const handleCreateEvent = () => {
    // Would create the event in the database
    setOpen(false);
    setSelectedMaterials([]);
    setParticipants(5);
    setSelectedIdea(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full py-8 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-blue-50 to-green-50 border-green-200 hover:bg-green-100"
        >
          <div className="rounded-full bg-green-100 p-3">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-medium text-green-800">Crea evento di comunità</h3>
          <p className="text-xs text-neutral-medium">Unisci le forze con altri per progetti più grandi</p>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crea un evento di comunità</DialogTitle>
          <DialogDescription>
            Organizza eventi per lavorare insieme su progetti di riciclo creativo utilizzando i materiali disponibili.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Seleziona i materiali disponibili</h3>
              <div className="border rounded-md p-3 max-h-[200px] overflow-y-auto">
                {materials && materials.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {materials.map((material) => (
                      <div key={material.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`material-${material.id}`} 
                          checked={selectedMaterials.includes(material.name)}
                          onCheckedChange={() => handleMaterialToggle(material.name)}
                        />
                        <Label 
                          htmlFor={`material-${material.id}`}
                          className="text-sm truncate cursor-pointer"
                        >
                          {material.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-medium text-center py-2">
                    Nessun materiale disponibile. Aggiungi materiali al tuo inventario.
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="participants" className="text-sm font-medium">
                Numero di partecipanti
              </Label>
              <div className="mt-1">
                <Slider
                  id="participants"
                  defaultValue={[5]}
                  max={20}
                  min={2}
                  step={1}
                  onValueChange={(value) => setParticipants(value[0])}
                />
                <div className="mt-1 flex justify-between text-xs text-neutral-medium">
                  <span>2</span>
                  <span>{participants} partecipanti</span>
                  <span>20</span>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleGenerateIdeas}
                disabled={selectedMaterials.length === 0 || isLoading}
              >
                {isLoading ? 'Generando...' : 'Genera idee per eventi'}
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium mb-2">Idee di eventi suggerite</h3>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : communityEventIdeas.length > 0 ? (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {communityEventIdeas.map((idea, index) => (
                  <Card 
                    key={index} 
                    className={`cursor-pointer transition border-l-4 ${selectedIdea === index ? 'border-l-green-600 bg-green-50' : 'border-l-transparent'}`}
                    onClick={() => setSelectedIdea(index)}
                  >
                    <CardHeader className="py-3 px-4">
                      <CardTitle className="text-base">{idea.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 text-xs">
                        <Users className="h-3 w-3" />
                        {idea.participants} partecipanti
                        <span className="mx-1">·</span>
                        <Clock className="h-3 w-3" />
                        {idea.duration}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="py-0 px-4 pb-3">
                      <p className="text-xs text-neutral-dark mb-2">
                        {idea.description.length > 100 
                          ? `${idea.description.substring(0, 100)}...` 
                          : idea.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {idea.materials.slice(0, 3).map((material, i) => (
                          <span key={i} className="text-xs bg-neutral-lightest rounded-full px-2 py-0.5">
                            {material}
                          </span>
                        ))}
                        {idea.materials.length > 3 && (
                          <span className="text-xs bg-neutral-lightest rounded-full px-2 py-0.5">
                            +{idea.materials.length - 3}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : selectedMaterials.length > 0 && !isLoading ? (
              <div className="bg-neutral-lightest rounded-lg p-4 text-center">
                <p className="text-neutral-medium text-sm">
                  Fai clic su "Genera idee per eventi" per ottenere suggerimenti
                </p>
              </div>
            ) : (
              <div className="bg-neutral-lightest rounded-lg p-4 text-center">
                <p className="text-neutral-medium text-sm">
                  Seleziona almeno un materiale e il numero di partecipanti
                </p>
              </div>
            )}
            
            {selectedIdea !== null && communityEventIdeas[selectedIdea] && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-green-800 flex items-center gap-1">
                  <CalendarClock className="h-4 w-4" />
                  Dettagli evento
                </h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-neutral-medium">Data</Label>
                    <Input 
                      type="date" 
                      className="mt-1" 
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-neutral-medium">Orario</Label>
                    <Input 
                      type="time" 
                      className="mt-1" 
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-xs text-neutral-medium">Luogo</Label>
                  <div className="flex gap-2 mt-1">
                    <Input 
                      placeholder="Indirizzo dell'evento" 
                      className="flex-grow"
                    />
                    <Button variant="outline" size="icon" className="shrink-0">
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annulla
          </Button>
          <Button 
            onClick={handleCreateEvent}
            disabled={selectedIdea === null}
            className="bg-green-600 hover:bg-green-700"
          >
            Crea evento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
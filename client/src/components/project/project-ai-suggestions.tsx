import React from "react";
import { AIProjectSuggestion } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag, Clock, ArrowLeft, Lightbulb, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getDifficultyColor } from "@/lib/utils";

interface ProjectAISuggestionsProps {
  suggestions: AIProjectSuggestion[];
  isLoading: boolean;
  error: string | null;
  onSelect: (suggestion: AIProjectSuggestion) => void;
  onBack: () => void;
}

export function ProjectAISuggestions({
  suggestions,
  isLoading,
  error,
  onSelect,
  onBack
}: ProjectAISuggestionsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-heading font-semibold flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-secondary" />
          Suggerimenti dell'AI
        </h3>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Torna indietro
        </Button>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="bg-neutral-lightest h-48 w-full">
                <Skeleton className="h-full w-full" />
              </div>
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter className="border-t p-4">
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      ) : suggestions.length === 0 ? (
        <div className="text-center py-12">
          <Lightbulb className="h-16 w-16 text-neutral-medium mx-auto mb-4" />
          <h3 className="text-xl font-heading font-medium mb-2">Nessun suggerimento disponibile</h3>
          <p className="text-neutral-medium mb-6">
            Prova a selezionare materiali diversi o aggiungi più materiali per ottenere suggerimenti.
          </p>
          <Button onClick={onBack}>
            Torna alla selezione dei materiali
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestions.map((suggestion, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="bg-neutral-lightest h-48 w-full overflow-hidden relative">
                {suggestion.imageUrl ? (
                  <img 
                    src={suggestion.imageUrl} 
                    alt={suggestion.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-center text-neutral-medium">
                    <div>
                      <Lightbulb className="h-12 w-12 mx-auto mb-2 text-secondary" />
                      <p className="text-sm">Preview del progetto</p>
                    </div>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-heading font-medium">{suggestion.name}</h3>
                  <Badge className={getDifficultyColor(suggestion.difficulty)}>
                    {suggestion.difficulty}
                  </Badge>
                </div>
                
                <p className="text-sm text-neutral-medium mb-3">
                  {suggestion.description.length > 100
                    ? suggestion.description.substring(0, 100) + "..."
                    : suggestion.description}
                </p>
                
                <div className="flex items-center text-sm text-neutral-medium mb-1">
                  <Tag className="h-4 w-4 mr-1" />
                  <span>
                    {Array.isArray(suggestion.requiredMaterials)
                      ? suggestion.requiredMaterials.slice(0, 2).map(m => m.name).join(", ") +
                        (suggestion.requiredMaterials.length > 2 ? "..." : "")
                      : "Materiali vari"}
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-neutral-medium">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>
                    {suggestion.estimatedTime} {suggestion.timeUnit}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="border-t p-4">
                <Button 
                  className="w-full bg-secondary text-white"
                  onClick={() => onSelect(suggestion)}
                >
                  Seleziona questo progetto
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

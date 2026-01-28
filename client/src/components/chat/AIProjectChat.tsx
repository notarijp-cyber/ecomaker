import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Zap, Send, Camera } from "lucide-react";
import { Project } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "assistant" | "user" | "system";
  content: string;
  timestamp: Date;
  isImage?: boolean;
}

interface AIProjectChatProps {
  onProjectCreated?: (project: Project) => void;
  initialMaterials?: string[];
}

export default function AIProjectChat({ onProjectCreated, initialMaterials = [] }: AIProjectChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(initialMaterials);
  const [availableMaterials, setAvailableMaterials] = useState<{name: string, id: number}[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch available materials
    const fetchMaterials = async () => {
      try {
        const response = await fetch('/api/materials');
        if (response.ok) {
          const materials = await response.json();
          setAvailableMaterials(materials.map((m: any) => ({ name: m.name, id: m.id })));
        }
      } catch (error) {
        console.error("Error fetching materials:", error);
      }
    };

    fetchMaterials();
  }, []);

  // Start conversation with the AI
  const startChat = async () => {
    if (selectedMaterials.length === 0) {
      toast({
        title: "Attenzione",
        description: "Seleziona almeno un materiale per iniziare la conversazione",
        variant: "destructive",
      });
      return;
    }

    setIsChatStarted(true);
    setIsLoading(true);

    // Add welcome message
    const welcomeMessage: Message = {
      role: "assistant",
      content: `Ciao! Sono il tuo assistente di progettazione creativa. Vedo che hai a disposizione i seguenti materiali: ${selectedMaterials.join(", ")}. 

Cosa vorresti creare con questi materiali? Puoi descrivermi la tua idea o chiedere suggerimenti. Posso aiutarti a:

1. Creare progetti specifici basati su un'idea che hai
2. Suggerire progetti creativi che utilizzano i materiali che hai selezionato
3. Aiutarti a espandere un progetto aggiungendo dettagli e istruzioni
4. Calcolare l'impatto ambientale dei tuoi progetti

Dimmi, come posso aiutarti oggi?`,
      timestamp: new Date()
    };

    setMessages([welcomeMessage]);
    setIsLoading(false);
  };

  // Send message to AI
  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    // Add user message to chat
    const userMessage: Message = {
      role: "user",
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Get all previous messages to maintain context
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Add current user message
      conversationHistory.push({
        role: "user",
        content: inputMessage
      });

      // Call AI conversation endpoint
      const response = await apiRequest(
        "POST",
        "/api/ai/chat-conversation", 
        {
          messages: conversationHistory,
          availableMaterials: selectedMaterials
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get response from AI");
      }

      const data = await response.json();
      
      // Add AI response to chat
      const aiMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);

      // If the AI generated a project, notify parent component
      if (data.generatedProject) {
        // Se il progetto ha un'immagine, aggiungiamola al messaggio
        if (data.generatedProject.imageUrl) {
          // Aggiungiamo un messaggio con l'immagine
          const imageMessage: Message = {
            role: "assistant",
            content: `Ecco un'anteprima di come potrebbe apparire il progetto "${data.generatedProject.name}" una volta completato:`,
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, imageMessage]);
          
          // Aggiungiamo un messaggio con l'immagine effettiva
          setTimeout(() => {
            const projectImageMessage: Message = {
              role: "assistant",
              content: `<img src="${data.generatedProject.imageUrl}" alt="${data.generatedProject.name}" class="w-full max-w-md rounded-md shadow-md" />`,
              timestamp: new Date(),
              isImage: true
            };
            
            setMessages(prev => [...prev, projectImageMessage]);
          }, 1000);
        }
        
        if (onProjectCreated) {
          onProjectCreated(data.generatedProject);
        }
        
        toast({
          title: "Progetto creato!",
          description: "Il tuo progetto è stato creato con successo",
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Add error message to chat
      const errorMessage: Message = {
        role: "assistant",
        content: "Mi dispiace, si è verificato un errore durante l'elaborazione della tua richiesta. Potrebbe essere dovuto a un problema temporaneo o a un limite di utilizzo del servizio AI. Riprova tra qualche istante.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Errore",
        description: "Si è verificato un errore nella comunicazione con l'AI. Potrebbero esserci limiti di utilizzo attivi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus input when chat starts
  useEffect(() => {
    if (isChatStarted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isChatStarted]);

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Render timestamp in Italian format
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("it-IT", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <Card className="w-full h-[600px] flex flex-col bg-background border-none shadow-lg">
      <CardHeader className="bg-background-gradient py-4 border-b border-muted/20">
        <CardTitle className="flex items-center">
          <Zap className="h-6 w-6 mr-2 text-primary" />
          Assistente di Progettazione Creativa
        </CardTitle>
        <CardDescription className="text-muted-foreground/80">
          Crea progetti eco-sostenibili partendo dai materiali che hai a disposizione
        </CardDescription>
      </CardHeader>

      {!isChatStarted ? (
        <CardContent className="flex-1 flex flex-col items-center justify-center py-6 bg-gradient-to-b from-background/50 to-background">
          <h3 className="text-lg font-medium mb-5 text-foreground">Materiali selezionati:</h3>
          <div className="flex flex-wrap gap-2 mb-6 justify-center max-w-lg">
            {selectedMaterials.length > 0 ? (
              selectedMaterials.map((material, index) => (
                <div 
                  key={index} 
                  className="bg-primary/20 text-primary px-3 py-1.5 rounded-md flex items-center shadow-sm"
                >
                  <span>{material}</span>
                  <button 
                    className="ml-2 text-primary/70 hover:text-primary"
                    onClick={() => setSelectedMaterials(prev => prev.filter(m => m !== material))}
                  >
                    ×
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground bg-background-secondary p-3 rounded-md">Seleziona alcuni materiali per iniziare</p>
            )}
          </div>

          <div className="mb-6 max-w-lg w-full px-4">
            <h3 className="text-lg font-medium mb-3 text-foreground">Materiali disponibili:</h3>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 bg-background-secondary/30 rounded-md border border-border/50">
              {availableMaterials.map((material) => (
                <TooltipProvider key={material.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          if (!selectedMaterials.includes(material.name)) {
                            setSelectedMaterials(prev => [...prev, material.name]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                          selectedMaterials.includes(material.name)
                            ? "bg-primary/10 text-primary/50 cursor-not-allowed"
                            : "bg-background-secondary hover:bg-primary/20 hover:text-primary text-foreground/90"
                        }`}
                        disabled={selectedMaterials.includes(material.name)}
                      >
                        {material.name}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{selectedMaterials.includes(material.name) ? "Già selezionato" : "Clicca per aggiungere"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>

          <Button 
            onClick={startChat} 
            className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 transition-all"
            disabled={selectedMaterials.length === 0}
            size="lg"
          >
            <Zap className="h-4 w-4 mr-2" /> Inizia conversazione
          </Button>
        </CardContent>
      ) : (
        <>
          <CardContent className="flex-1 p-0 overflow-hidden bg-gradient-to-b from-background/90 to-background">
            <ScrollArea className="h-full px-4">
              <div className="space-y-4 py-4">
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div 
                      className={`flex items-start max-w-[85%] ${
                        message.role === "user" 
                          ? "flex-row-reverse" 
                          : "flex-row"
                      }`}
                    >
                      <Avatar className={`h-8 w-8 ${message.role === "user" ? "ml-2" : "mr-2"} shadow-md`}>
                        <div className={`h-full w-full flex items-center justify-center ${
                          message.role === "user" 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-background-secondary text-foreground"
                        }`}>
                          {message.role === "user" ? "Tu" : "AI"}
                        </div>
                      </Avatar>
                      <div 
                        className={`rounded-md px-4 py-3 shadow-sm ${
                          message.role === "user" 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-background-secondary border border-border/30 text-primary-foreground"
                        }`}
                      >
                        {message.isImage ? (
                          <div 
                            className="text-sm leading-relaxed" 
                            dangerouslySetInnerHTML={{ __html: message.content }}
                          />
                        ) : (
                          <div className="text-sm whitespace-pre-wrap leading-relaxed">
                            {message.content}
                          </div>
                        )}
                        <div className={`text-xs mt-1.5 ${message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>

          <CardFooter className="border-t border-border/30 p-3 bg-background-secondary/50">
            <div className="flex w-full items-center space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="shrink-0 bg-background-secondary hover:bg-background-secondary/80"
                disabled={isLoading}
              >
                <Camera className="h-5 w-5 text-foreground/80" />
              </Button>
              <Input
                ref={inputRef}
                placeholder="Scrivi un messaggio..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isLoading}
                className="flex-1 bg-background border-border/50 focus-visible:ring-primary/50"
              />
              <Button 
                onClick={sendMessage} 
                size="icon" 
                disabled={isLoading || !inputMessage.trim()}
                className="shrink-0 bg-primary hover:bg-primary/90"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
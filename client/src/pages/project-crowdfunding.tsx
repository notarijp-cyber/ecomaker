import React, { useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PageLayout } from "@/components/layout/page-layout";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import type { Project, CrowdfundingMilestone } from "@/lib/types";

export default function ProjectCrowdfunding() {
  const { id } = useParams<{ id: string }>();
  const projectId = parseInt(id);
  const [amount, setAmount] = useState<string>("");
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>("general");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  
  // Fetch project details
  const { data: project, isLoading, error } = useQuery({
    queryKey: ['/api/projects', projectId],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/projects/${projectId}`);
      return response.json() as Promise<Project>;
    },
    enabled: !!projectId && !isNaN(projectId)
  });
  
  // Create payment intent
  const paymentMutation = useMutation({
    mutationFn: async ({ amount, projectId, userId, milestoneId }: { amount: number, projectId: number, userId: number, milestoneId?: string }) => {
      const response = await apiRequest("POST", "/api/payments/crowdfunding", {
        amount,
        projectId,
        userId,
        milestoneId
      });
      return response.json();
    },
    onError: (error: Error) => {
      toast({
        title: "Errore durante la creazione del pagamento",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Confirm payment
  const confirmPaymentMutation = useMutation({
    mutationFn: async (paymentIntentId: string) => {
      const response = await apiRequest("POST", "/api/payments/crowdfunding/confirm", {
        paymentIntentId
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId] });
      setPaymentSuccess(true);
      setIsProcessing(false);
      toast({
        title: "Finanziamento completato con successo!",
        description: "Grazie per aver contribuito a questo progetto.",
        variant: "default"
      });
    },
    onError: (error: Error) => {
      setPaymentError(error.message);
      setIsProcessing(false);
      toast({
        title: "Errore durante la conferma del pagamento",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }
    
    setIsProcessing(true);
    setPaymentError(null);
    
    try {
      // Simulated user ID for testing - in a real app, this would come from the authenticated user
      const userId = 1;
      
      // Create payment intent
      const paymentIntentResult = await paymentMutation.mutateAsync({
        amount: parseFloat(amount),
        projectId,
        userId,
        milestoneId: selectedMilestoneId
      });
      
      // Confirm card payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(paymentIntentResult.clientSecret, {
        payment_method: {
          card: cardElement
        }
      });
      
      if (error) {
        setPaymentError(error.message || "Si è verificato un errore durante il pagamento");
        setIsProcessing(false);
      } else if (paymentIntent?.status === "succeeded") {
        // Confirm payment on our server
        await confirmPaymentMutation.mutateAsync(paymentIntent.id);
      }
    } catch (error: any) {
      setPaymentError(error.message);
      setIsProcessing(false);
    }
  };
  
  // Calculate progress
  const calculateProgress = (current: number, goal: number) => {
    if (!goal) return 0;
    const progress = (current / goal) * 100;
    return Math.min(progress, 100);
  };
  
  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }
  
  if (error || !project) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
          <h2 className="text-xl font-bold">Errore nel caricamento del progetto</h2>
          <p className="text-muted-foreground">Non è stato possibile caricare i dettagli del progetto.</p>
        </div>
      </PageLayout>
    );
  }
  
  // Get current funding and goal
  const currentFunding = parseFloat(project.currentFunding?.toString() || '0');
  const fundingGoal = parseFloat(project.fundingGoal?.toString() || '0');
  const milestones = project.fundingMilestones as CrowdfundingMilestone[] || [];
  const progress = calculateProgress(currentFunding, fundingGoal);
  
  return (
    <PageLayout>
      <div className="container max-w-5xl py-8">
        <div className="flex flex-col gap-8">
          {/* Project header with progress */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">{project.name}</h1>
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
              >
                Torna al progetto
              </Button>
            </div>
            
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle>Stato finanziamento</CardTitle>
                <CardDescription>
                  Obiettivo: {fundingGoal.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Progress value={progress} className="h-4" />
                  <div className="flex justify-between">
                    <span className="font-medium">
                      Raccolti: {currentFunding.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
                    </span>
                    <span className="font-medium">{progress.toFixed(0)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Milestone list & Payment form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Milestone list */}
            <Card>
              <CardHeader>
                <CardTitle>Milestone del progetto</CardTitle>
                <CardDescription>Seleziona un milestone specifico da finanziare o contribuisci al finanziamento generale</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div 
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedMilestoneId === 'general' ? 'bg-primary/10 border-primary' : 'hover:bg-muted'}`}
                    onClick={() => setSelectedMilestoneId('general')}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Finanziamento generale</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Contribuisci al progetto senza specificare un milestone particolare
                    </p>
                  </div>
                  
                  {milestones.map((milestone) => (
                    <div 
                      key={milestone.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedMilestoneId === milestone.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted'}`}
                      onClick={() => setSelectedMilestoneId(milestone.id)}
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{milestone.title}</h3>
                        {milestone.completed && (
                          <span className="flex items-center text-green-600 text-sm">
                            <CheckCircle className="w-4 h-4 mr-1" /> Completato
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {milestone.description}
                      </p>
                      <div className="mt-2 flex justify-between items-center text-sm">
                        <span>Obiettivo: {parseFloat(milestone.amount.toString()).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Payment form */}
            <Card>
              <CardHeader>
                <CardTitle>Sostieni questo progetto</CardTitle>
                <CardDescription>I tuoi dati di pagamento sono protetti e gestiti in modo sicuro da Stripe</CardDescription>
              </CardHeader>
              <CardContent>
                {paymentSuccess ? (
                  <div className="p-6 text-center space-y-4">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                    <h3 className="text-xl font-medium">Pagamento completato con successo!</h3>
                    <p className="text-muted-foreground">
                      Grazie per il tuo contributo a questo progetto di upcycling.
                    </p>
                    <Button 
                      onClick={() => {
                        setPaymentSuccess(false);
                        setAmount("");
                      }}
                      className="mt-4"
                    >
                      Fai un'altra donazione
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Importo (€)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="10.00"
                        min="1"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground">Inserisci l'importo che desideri donare</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Dati della carta</Label>
                      <div className="p-3 border rounded-md">
                        <CardElement 
                          options={{
                            style: {
                              base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                  color: '#aab7c4',
                                },
                              },
                              invalid: {
                                color: '#9e2146',
                              },
                            },
                          }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Tutti i pagamenti sono gestiti in modo sicuro da Stripe</p>
                    </div>
                    
                    {paymentError && (
                      <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
                        {paymentError}
                      </div>
                    )}
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={!stripe || isProcessing || !amount || parseFloat(amount) <= 0}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Elaborazione...
                        </>
                      ) : (
                        `Contribuisci €${amount || '0'}`
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Project description */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Informazioni sul progetto</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{project.description}</p>
              
              <div className="mt-6">
                <h3 className="font-medium text-lg mb-2">Perché sostenere questo progetto?</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Promuovi il riutilizzo creativo di materiali che altrimenti sarebbero scartati</li>
                  <li>Contribuisci a ridurre l'impatto ambientale e l'inquinamento</li>
                  <li>Sostieni la comunità locale e la cultura del riciclo creativo</li>
                  <li>Aiuta a diffondere idee innovative per l'upcycling</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
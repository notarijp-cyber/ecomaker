import React from "react";
import { Info, Leaf, Recycle, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { EnvironmentalImpact } from "@/lib/types";

interface WelcomeSectionProps {
  userId: number;
}

export function WelcomeSection({ userId }: WelcomeSectionProps) {
  const { data: impact, isLoading } = useQuery<EnvironmentalImpact>({
    queryKey: [`/api/environmental-impact/${userId}`],
  });

  return (
    <div className="mb-12">
      {/* Banner di benvenuto con gradiente */}
      <div className="relative overflow-hidden rounded-2xl mb-8">
        <div className="absolute inset-0 eco-gradient-bg opacity-90"></div>
        <div className="absolute inset-0" style={{ 
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          backgroundSize: "30px 30px"
        }}></div>
        
        <div className="relative z-10 p-8">
          <div className="flex items-start gap-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-md">
              <Recycle className="h-12 w-12 text-primary" />
            </div>
            
            <div>
              <h2 className="text-3xl font-heading font-bold mb-2 text-white drop-shadow-sm">
                Ciao, benvenuto in EcoMaker
              </h2>
              <p className="text-white/90 text-lg font-light max-w-xl">
                Trasforma i tuoi scarti in progetti creativi e contribuisci alla sostenibilità ambientale con la nostra community.
              </p>
              
              {/* Badges row */}
              <div className="flex flex-wrap gap-3 mt-4">
                <div className="bg-white/20 backdrop-blur-sm py-1 px-3 rounded-full text-white text-sm flex items-center gap-1 shadow-sm">
                  <Leaf className="h-4 w-4" />
                  <span>Eco-friendly</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm py-1 px-3 rounded-full text-white text-sm flex items-center gap-1 shadow-sm">
                  <Zap className="h-4 w-4" />
                  <span>Sostenibile</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm py-1 px-3 rounded-full text-white text-sm flex items-center gap-1 shadow-sm">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 3.22l-.61-.6a5.5 5.5 0 0 0-7.78 7.77L10 18.78l8.39-8.4a5.5 5.5 0 0 0-7.78-7.77l-.61.61z" />
                  </svg>
                  <span>Creativo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Environmental Impact Summary */}
      <div className="eco-card overflow-hidden">
        <div className="relative p-6">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
            <div className="flex-shrink-0 mb-4 md:mb-0">
              <div className="inline-flex rounded-lg bg-primary/10 p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.64,3.64c-1.36-1.36-3.55-1.36-4.91,0l-1.37,1.37c-0.2,0.2-0.2,0.51,0,0.71L19.5,9.86c0.2,0.2,0.51,0.2,0.71,0 l1.43-1.43C23.16,6.91,23.16,4.72,21.64,3.64z"></path>
                  <path d="M17.15,6.15l-8.79,8.79c-0.14,0.14-0.25,0.33-0.28,0.54l-0.5,2.83c-0.06,0.35,0.08,0.7,0.36,0.89 c0.18,0.11,0.38,0.17,0.59,0.17c0.1,0,0.21-0.01,0.31-0.04l2.83-0.5c0.21-0.04,0.4-0.14,0.54-0.28l8.79-8.79L17.15,6.15z"></path>
                  <path d="M8.95,17.51L4.47,13.4c-0.15,0.15-0.34,0.26-0.54,0.3l-2.83,0.5c-0.36,0.06-0.73-0.07-0.93-0.36 c-0.2-0.29-0.21-0.68-0.02-0.98l3.29-5.39c0.1-0.17,0.25-0.29,0.42-0.37l2.83-1.32c0.36-0.17,0.8-0.1,1.08,0.18l3.94,3.94"></path>
                </svg>
              </div>
            </div>
            
            <div className="flex-grow">
              <h3 className="font-heading font-semibold text-xl text-neutral-900 mb-2">
                Il tuo impatto ambientale positivo
              </h3>
              <p className="text-neutral-600 mb-4">
                Ecco quanto hai contribuito alla sostenibilità ambientale attraverso i tuoi progetti di riciclo creativo.
              </p>
              
              {isLoading ? (
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div className="bg-neutral-100 rounded-lg p-4 text-center animate-pulse h-24"></div>
                  <div className="bg-neutral-100 rounded-lg p-4 text-center animate-pulse h-24"></div>
                  <div className="bg-neutral-100 rounded-lg p-4 text-center animate-pulse h-24"></div>
                </div>
              ) : (
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div className="eco-card p-4 text-center">
                    <div className="inline-flex rounded-full bg-green-100 p-3 mb-2">
                      <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                      </svg>
                    </div>
                    <span className="block text-3xl text-primary font-bold">
                      {impact?.materialsRecycled} kg
                    </span>
                    <span className="text-neutral-600 text-sm font-medium mt-1 block">
                      Materiali riciclati
                    </span>
                  </div>
                  
                  <div className="eco-card p-4 text-center">
                    <div className="inline-flex rounded-full bg-blue-100 p-3 mb-2">
                      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <span className="block text-3xl text-primary font-bold">
                      {impact?.projectsCompleted}
                    </span>
                    <span className="text-neutral-600 text-sm font-medium mt-1 block">
                      Progetti completati
                    </span>
                  </div>
                  
                  <div className="eco-card p-4 text-center">
                    <div className="inline-flex rounded-full bg-amber-100 p-3 mb-2">
                      <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="block text-3xl text-primary font-bold">
                      {impact?.moneySaved}€
                    </span>
                    <span className="text-neutral-600 text-sm font-medium mt-1 block">
                      Risparmiati
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

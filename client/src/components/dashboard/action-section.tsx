import React, { useState } from "react";
import { Camera, Plus, Leaf, Recycle, Camera as CameraIcon, PaintBucket, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { MaterialScanner } from "@/components/scanning/material-scanner";
import { Badge } from "@/components/ui/badge";
import { CommunityEventCreator } from "@/components/dashboard/community-event-creator";

export function ActionSection() {
  const [showScanner, setShowScanner] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
      {/* Scan Materials Card */}
      <Card className="overflow-hidden relative group forest-texture hover:shadow-lg transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-transparent opacity-30 transition-opacity duration-300 group-hover:opacity-50"></div>
        <div className="flex flex-col sm:flex-row relative">
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 transition-colors">
              <Recycle className="h-3 w-3 mr-1" />
              Eco-friendly
            </Badge>
          </div>
          
          <CardContent className="p-6 flex-grow relative z-10">
            <div className="flex items-center mb-3">
              <div className="bg-primary/20 p-2 rounded-lg mr-3 inline-flex">
                <Camera className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-xl text-neutral-900">
                Scansiona i tuoi materiali
              </h3>
            </div>
            
            <p className="text-neutral-700 text-sm mb-6 max-w-md">
              Utilizza la fotocamera del tuo dispositivo per riconoscere automaticamente e catalogare i tuoi oggetti riciclabili. Il nostro sistema di AI ti aiuterà a identificare i materiali e a suggerire possibili usi creativi.
            </p>
            
            <div className="flex items-center space-x-2">
              <Button
                className="bg-primary text-white flex items-center hover:bg-primary/90 transition-colors shadow-md"
                onClick={() => setShowScanner(true)}
              >
                <CameraIcon className="h-5 w-5 mr-2" />
                Avvia scanner materiali
              </Button>
              
              <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/5 transition-colors">
                Guida
              </Button>
            </div>
            
            <div className="mt-4 flex space-x-3">
              <div className="flex items-center text-xs text-emerald-700">
                <Sparkles className="h-3 w-3 mr-1" />
                <span>AI powered</span>
              </div>
              <div className="flex items-center text-xs text-emerald-700">
                <Leaf className="h-3 w-3 mr-1" />
                <span>Cataloga automaticamente</span>
              </div>
            </div>
          </CardContent>
          
          <div className="sm:w-1/3 h-auto md:h-full overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20 z-10"></div>
            <img
              src="https://images.unsplash.com/photo-1604187351574-c75ca79f5807?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Materiali riciclabili"
              className="object-cover h-60 sm:h-full w-full transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>
      </Card>

      {/* Create Project Card */}
      <Card className="overflow-hidden relative group leaf-pattern hover:shadow-lg transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-lime-500/20 to-transparent opacity-30 transition-opacity duration-300 group-hover:opacity-50"></div>
        <div className="flex flex-col sm:flex-row relative">
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-lime-100 text-lime-800 hover:bg-lime-200 transition-colors">
              <Leaf className="h-3 w-3 mr-1" />
              Creativo
            </Badge>
          </div>
          
          <CardContent className="p-6 flex-grow relative z-10">
            <div className="flex items-center mb-3">
              <div className="bg-lime-600/20 p-2 rounded-lg mr-3 inline-flex">
                <PaintBucket className="h-6 w-6 text-lime-700" />
              </div>
              <h3 className="font-heading font-semibold text-xl text-neutral-900">
                Crea un nuovo progetto
              </h3>
            </div>
            
            <p className="text-neutral-700 text-sm mb-6 max-w-md">
              Trasforma i tuoi materiali di riciclo in oggetti utili e creativi. L'assistente AI ti guiderà suggerendoti progetti su misura in base ai materiali che hai catalogato nel tuo inventario.
            </p>
            
            <div className="flex items-center space-x-2">
              <Link href="/create-project">
                <Button
                  className="bg-lime-600 text-white flex items-center hover:bg-lime-700 transition-colors shadow-md border-none"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Inizia nuovo progetto
                </Button>
              </Link>
              
              <Button variant="outline" className="border-lime-600/30 text-lime-700 hover:bg-lime-50 transition-colors">
                Esplora idee
              </Button>
            </div>
            
            <div className="mt-4 flex space-x-3">
              <div className="flex items-center text-xs text-lime-700">
                <Sparkles className="h-3 w-3 mr-1" />
                <span>Suggerimenti AI</span>
              </div>
              <div className="flex items-center text-xs text-lime-700">
                <Recycle className="h-3 w-3 mr-1" />
                <span>Eco sostenibile</span>
              </div>
            </div>
          </CardContent>
          
          <div className="sm:w-1/3 h-auto md:h-full overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20 z-10"></div>
            <img
              src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Progetto fai da te"
              className="object-cover h-60 sm:h-full w-full transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>
      </Card>

      {showScanner && (
        <MaterialScanner onClose={() => setShowScanner(false)} />
      )}
    </div>
  );
}

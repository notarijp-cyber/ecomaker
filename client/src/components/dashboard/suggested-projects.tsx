import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Lightbulb, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { Project } from "@/lib/types";
import { ProjectCard } from "@/components/project/project-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function SuggestedProjects() {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });
  
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerRow, setItemsPerRow] = useState(3);
  const itemsPerPage = 3; // Mostra solo 3 progetti alla volta per mantenere la pagina compatta
  
  // Get non-community projects
  const nonCommunityProjects = projects?.filter(project => !project.isCommunityProject) || [];
  
  // Calculate total pages
  const totalPages = Math.ceil(nonCommunityProjects.length / itemsPerPage);
  
  // Get current page projects
  const startIndex = currentPage * itemsPerPage;
  const suggestedProjects = nonCommunityProjects.slice(startIndex, startIndex + itemsPerPage);
  
  // Handle pagination
  const goToNextPage = () => {
    if (totalPages > 1) {
      setCurrentPage(prevPage => (prevPage + 1) % totalPages);
    }
  };
  
  const goToPrevPage = () => {
    if (totalPages > 1) {
      setCurrentPage(prevPage => (prevPage - 1 + totalPages) % totalPages);
    }
  };

  return (
    <Card className="mb-6 overflow-hidden shadow-sm">
      <CardHeader className="pb-3 border-b border-border/10">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-primary" />
            <CardTitle className="text-xl font-heading">
              Progetti suggeriti
            </CardTitle>
          </div>
          <Link href="/my-projects" className="text-primary text-sm font-medium hover:underline">
            Vedi tutti
          </Link>
        </div>
        <CardDescription>
          Scopri idee ecosostenibili per riciclare materiali di recupero
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-5 pb-2">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-72 w-full rounded-xl" />
            ))}
          </div>
        ) : nonCommunityProjects.length === 0 ? (
          <div className="text-center py-8">
            <Lightbulb className="h-10 w-10 text-muted-foreground/70 mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-2">Nessun progetto suggerito disponibile</h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              Crea nuovi progetti o esplora la sezione AI Assistant per generare idee.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/create-project">
                <Button variant="default" size="sm">Crea progetto</Button>
              </Link>
              <Link href="/ai-assistant">
                <Button variant="outline" size="sm">AI Assistant</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {suggestedProjects?.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </CardContent>
      
      {nonCommunityProjects.length > itemsPerPage && (
        <CardFooter className="flex justify-between items-center pt-2 pb-3 px-6 border-t border-border/10">
          <div className="text-xs text-muted-foreground">
            Pagina {currentPage + 1} di {totalPages}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToPrevPage} 
              className="h-8 w-8 p-0 rounded-full"
              disabled={currentPage === 0}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToNextPage} 
              className="h-8 w-8 p-0 rounded-full"
              disabled={currentPage === totalPages - 1}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

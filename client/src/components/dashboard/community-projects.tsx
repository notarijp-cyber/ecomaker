import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Project } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AvatarGroup } from "@/components/ui/avatar-group";
import { UserPlus, ArrowUpRight, Calendar, Users, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function CommunityProjects() {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects', { communityOnly: true }],
  });

  // Get the first community project for featured display
  const featuredProject = projects?.[0];
  
  // Get 2 more community projects for small display
  const otherProjects = projects?.slice(1, 3);

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h2 className="text-2xl font-heading font-semibold text-neutral-900">
            Progetti comunitari
          </h2>
          <div className="ml-3 bg-primary/10 text-primary text-xs font-medium py-1 px-2 rounded-full">
            {projects?.length || 0} progetti
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          className="text-primary hover:text-primary-dark text-sm font-medium flex items-center gap-1 hover:bg-primary/5"
          onClick={() => window.location.href = "/community"}
        >
          Vedi tutti
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {isLoading ? (
        <>
          <Skeleton className="w-full h-64 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="w-full h-36" />
            <Skeleton className="w-full h-36" />
          </div>
        </>
      ) : (
        <>
          {/* Featured Community Project */}
          {featuredProject && (
            <Card className="overflow-hidden mb-6 group garden-texture hover:shadow-lg transition-all duration-300">
              <div className="md:flex">
                <div className="md:w-2/5 relative overflow-hidden">
                  <div className="h-64 md:h-full">
                    {featuredProject.imageUrl ? (
                      <img
                        src={featuredProject.imageUrl}
                        alt={featuredProject.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <img
                        src="https://images.unsplash.com/photo-1569144157591-c60f3f82f137?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
                        alt="Installazione artistica comunitaria"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <Badge className="bg-lime-500 border-none text-white font-medium text-xs shadow-md">
                        Progetto comunitario
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6 md:w-3/5 relative">
                  <div className="flex justify-between items-start">
                    <h3 className="font-heading font-semibold text-xl text-neutral-900">
                      {featuredProject.name}
                    </h3>
                    <Badge className="bg-green-100 text-green-800 mt-1">
                      In corso
                    </Badge>
                  </div>
                  
                  <p className="text-neutral-600 mt-2 mb-5 line-clamp-2">
                    {featuredProject.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 mb-6">
                    <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 text-center">
                      <div className="text-sm text-neutral-600 mb-1 flex items-center justify-center">
                        <Calendar className="h-3 w-3 mr-1 inline" />
                        Deadline
                      </div>
                      <div className="font-medium text-neutral-900">15 Giugno</div>
                    </div>
                    
                    <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 text-center">
                      <div className="text-sm text-neutral-600 mb-1 flex items-center justify-center">
                        <Users className="h-3 w-3 mr-1 inline" />
                        Partecipanti
                      </div>
                      <div className="font-medium text-neutral-900">24 persone</div>
                    </div>
                    
                    <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 text-center">
                      <div className="text-sm text-neutral-600 mb-1">Completamento</div>
                      <div className="font-medium text-neutral-900">
                        {featuredProject.completionPercentage}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative bg-white/70 backdrop-blur-sm rounded-lg p-3 mt-5 mb-4">
                    <div className="absolute -top-3 left-3 bg-white px-2 py-1 rounded text-xs font-medium text-neutral-600">
                      Avanzamento
                    </div>
                    <div className="h-2.5 w-full bg-neutral-100 rounded-full">
                      <div
                        className="h-2.5 bg-gradient-to-r from-primary to-lime-500 rounded-full"
                        style={{ width: `${featuredProject.completionPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <AvatarGroup
                      items={[
                        { fallback: "A" },
                        { fallback: "B" },
                        { fallback: "C" },
                        { fallback: "D" },
                        { fallback: "E" },
                        { fallback: "F" },
                        { fallback: "G" },
                      ]}
                      max={3}
                    />
                    
                    <Button 
                      className="bg-primary text-white text-sm flex items-center hover:bg-primary/90 transition-colors shadow-sm"
                      onClick={() => window.location.href = `/project-detail/${featuredProject.id}`}
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Unisciti al progetto
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          )}

          {/* Small Community Projects */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {otherProjects?.map(project => (
              <Card key={project.id} className="overflow-hidden group naturewave-pattern hover:shadow-lg transition-all duration-300 relative">
                <CardContent className="p-5 relative">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-heading font-medium text-lg">{project.name}</h3>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                      In corso
                    </Badge>
                  </div>
                  
                  <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex justify-between mb-4">
                    <div className="flex items-center text-sm bg-white/50 backdrop-blur-sm rounded-md px-2 py-1">
                      <Calendar className="h-3.5 w-3.5 text-primary mr-1.5" />
                      <span className="text-neutral-800 font-medium">22 Maggio</span>
                    </div>
                    
                    <div className="flex items-center text-sm bg-white/50 backdrop-blur-sm rounded-md px-2 py-1">
                      <Users className="h-3.5 w-3.5 text-primary mr-1.5" />
                      <span className="text-neutral-800 font-medium">12 persone</span>
                    </div>
                  </div>
                  
                  <div className="h-2 w-full bg-neutral-100 rounded-full mb-4">
                    <div
                      className="h-2 bg-gradient-to-r from-primary to-lime-500 rounded-full"
                      style={{ width: `${project.completionPercentage}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center">
                    <AvatarGroup
                      items={[
                        { fallback: "A" },
                        { fallback: "B" },
                        { fallback: "C" },
                      ]}
                      size="sm"
                    />
                    
                    <Button 
                      variant="outline" 
                      className="border-primary/30 text-primary font-medium text-sm flex items-center gap-1 hover:bg-primary/5"
                      onClick={() => window.location.href = `/project-detail/${project.id}`}
                    >
                      Visualizza
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

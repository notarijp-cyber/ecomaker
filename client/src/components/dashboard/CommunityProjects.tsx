import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import ProjectCard from "./ProjectCard";
import { Card, CardContent } from "@/components/ui/card";

export default function CommunityProjects() {
  const { isLoading, data: communityProjects } = useQuery({
    queryKey: ['/api/projects/community'],
  });
  
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 bg-neutral-200 rounded w-1/3"></div>
          <div className="h-4 bg-neutral-200 rounded w-24"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="h-48 bg-neutral-200"></div>
            <div className="p-4">
              <div className="h-6 bg-neutral-200 rounded mb-2"></div>
              <div className="h-4 bg-neutral-200 rounded w-3/4 mb-3"></div>
              <div className="flex justify-between mb-3">
                <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
                <div className="h-4 bg-neutral-200 rounded w-16"></div>
              </div>
              <div className="h-16 bg-neutral-100 rounded-lg mb-4"></div>
              <div className="h-10 bg-neutral-200 rounded"></div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow">
            <div className="p-4 border-b border-neutral-200">
              <div className="h-6 bg-neutral-200 rounded"></div>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div className="p-3 bg-neutral-100 rounded-lg">
                  <div className="flex items-start space-x-3 mb-2">
                    <div className="w-10 h-10 bg-neutral-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-neutral-200 rounded w-24 mb-1"></div>
                      <div className="h-3 bg-neutral-200 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-neutral-200 rounded w-full mb-3"></div>
                  <div className="flex space-x-2">
                    <div className="h-6 bg-neutral-200 rounded w-24"></div>
                    <div className="h-6 bg-neutral-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="p-3 bg-neutral-100 rounded-lg">
                  <div className="flex items-start space-x-3 mb-2">
                    <div className="w-10 h-10 bg-neutral-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-neutral-200 rounded w-24 mb-1"></div>
                      <div className="h-3 bg-neutral-200 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-neutral-200 rounded w-full mb-3"></div>
                  <div className="flex space-x-2">
                    <div className="h-6 bg-neutral-200 rounded w-24"></div>
                    <div className="h-6 bg-neutral-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!communityProjects || communityProjects.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="font-heading font-semibold text-xl mb-4">Community e Progetti Collaborativi</h2>
          <div className="flex flex-col items-center justify-center py-8">
            <span className="material-icons text-4xl text-neutral-400 mb-2">groups</span>
            <h3 className="text-lg font-medium text-neutral-800 mb-1">Nessun progetto comunitario</h3>
            <p className="text-sm text-neutral-600 mb-4 text-center">
              Non ci sono progetti comunitari attivi al momento. Crea il primo progetto!
            </p>
            <Link href="/projects/create">
              <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition">
                Crea Progetto Comunitario
              </button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading font-semibold text-xl text-neutral-800">Community e Progetti Collaborativi</h2>
        <Link href="/community" className="text-primary font-medium hover:underline">
          Esplora la community
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Show first community project */}
        {communityProjects.length > 0 && (
          <ProjectCard
            id={communityProjects[0].id}
            title={communityProjects[0].title}
            description={communityProjects[0].description}
            difficulty={communityProjects[0].difficultyLevel}
            time={communityProjects[0].estimatedTime}
            co2Savings={communityProjects[0].co2Savings || 0}
            imageUrl={communityProjects[0].imageUrl || 'https://images.unsplash.com/photo-1582691440018-e991f4a6eeed?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=800&q=80'}
            materials={communityProjects[0].requiredMaterials as any[]}
            isCommunityProject={true}
            progress={communityProjects[0].progress}
            participants={
              <div className="flex -space-x-2">
                <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=40&h=40&q=80" 
                     alt="Membro 1" className="w-8 h-8 rounded-full border-2 border-white" />
                <img src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=40&h=40&q=80" 
                     alt="Membro 2" className="w-8 h-8 rounded-full border-2 border-white" />
                <img src="https://images.unsplash.com/photo-1548142813-c348350df52b?ixlib=rb-1.2.1&auto=format&fit=crop&w=40&h=40&q=80" 
                     alt="Membro 3" className="w-8 h-8 rounded-full border-2 border-white" />
                <span className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white bg-primary text-white text-xs font-medium">
                  +8
                </span>
              </div>
            }
          />
        )}
        
        {/* Forum preview component */}
        <ForumPreview />
      </div>
    </div>
  );
}

import ForumPreview from "./ForumPreview";

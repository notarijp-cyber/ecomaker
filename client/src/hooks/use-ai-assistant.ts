import { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { AIProjectSuggestion, Project } from '@/lib/types';

interface ExternalProject {
  title: string;
  description: string;
  source: string;
  url: string;
  materialsNeeded: string[];
  instructions: string[];
}

interface CommunityEventIdea {
  name: string;
  description: string;
  materials: string[];
  participants: number;
  duration: string;
  activities: string[];
  environmentalImpact: any;
}

interface UseAIAssistantReturn {
  isLoading: boolean;
  error: string | null;
  projectSuggestions: AIProjectSuggestion[];
  optimizedInstructions: string[] | null;
  environmentalImpact: any | null;
  projectDivisionPlan: any | null;
  externalProjects: ExternalProject[];
  projectImage: string | null;
  communityEventIdeas: CommunityEventIdea[];
  generateProjectIdeas: (materials: string[]) => Promise<void>;
  optimizeProjectInstructions: (project: Project) => Promise<void>;
  calculateEnvironmentalImpact: (project: Project) => Promise<void>;
  createProjectDivisionPlan: (project: Project, participants: number) => Promise<void>;
  learnFromExternalProject: (projectUrl: string) => Promise<boolean>;
  searchExternalProjects: (keywords: string[], source?: string) => Promise<void>;
  generateEnhancedProjectIdeas: (materials: string[]) => Promise<void>;
  generateProjectImage: (projectDescription: string, stage?: string) => Promise<void>;
  generateCommunityEventIdeas: (materials: string[], participants: number) => Promise<void>;
  submitUserFeedback: (projectId: number, feedback: any) => Promise<boolean>;
}

export function useAIAssistant(): UseAIAssistantReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectSuggestions, setProjectSuggestions] = useState<AIProjectSuggestion[]>([]);
  const [optimizedInstructions, setOptimizedInstructions] = useState<string[] | null>(null);
  const [environmentalImpact, setEnvironmentalImpact] = useState<any | null>(null);
  const [projectDivisionPlan, setProjectDivisionPlan] = useState<any | null>(null);
  const [externalProjects, setExternalProjects] = useState<ExternalProject[]>([]);
  const [projectImage, setProjectImage] = useState<string | null>(null);
  const [communityEventIdeas, setCommunityEventIdeas] = useState<CommunityEventIdea[]>([]);

  const generateProjectIdeas = async (materials: string[]): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest('POST', '/api/ai/generate-project-ideas', {
        materials
      });
      
      const result = await response.json();
      setProjectSuggestions(result.projects || []);
    } catch (err) {
      setError('Failed to generate project ideas. Please try again.');
      console.error('Error generating project ideas:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const optimizeProjectInstructions = async (project: Project): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest('POST', '/api/ai/optimize-instructions', {
        project
      });
      
      const result = await response.json();
      setOptimizedInstructions(result.instructions || []);
    } catch (err) {
      setError('Failed to optimize instructions. Please try again.');
      console.error('Error optimizing instructions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateEnvironmentalImpact = async (project: Project): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest('POST', '/api/ai/environmental-impact', {
        project
      });
      
      const result = await response.json();
      setEnvironmentalImpact(result.environmentalImpact || null);
    } catch (err) {
      setError('Failed to calculate environmental impact. Please try again.');
      console.error('Error calculating environmental impact:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createProjectDivisionPlan = async (project: Project, participants: number): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest('POST', '/api/ai/project-division', {
        project,
        participants
      });
      
      const result = await response.json();
      setProjectDivisionPlan(result.divisionPlan || null);
    } catch (err) {
      setError('Failed to create project division plan. Please try again.');
      console.error('Error creating project division plan:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const learnFromExternalProject = async (projectUrl: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest('POST', '/api/ai/learn-from-external', {
        projectUrl
      });
      
      const result = await response.json();
      return result.success;
    } catch (err) {
      setError('Failed to learn from external project. Please try again.');
      console.error('Error learning from external project:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const searchExternalProjects = async (keywords: string[], source: string = 'all'): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams({
        keywords: keywords.join(','),
        source
      });
      
      const response = await apiRequest('GET', `/api/ai/search-external?${queryParams}`);
      const result = await response.json();
      setExternalProjects(result.projects || []);
    } catch (err) {
      setError('Failed to search external projects. Please try again.');
      console.error('Error searching external projects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateEnhancedProjectIdeas = async (materials: string[]): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest('POST', '/api/ai/enhanced-project-ideas', {
        materials
      });
      
      const result = await response.json();
      setProjectSuggestions(result.projects || []);
    } catch (err) {
      setError('Failed to generate enhanced project ideas. Please try again.');
      console.error('Error generating enhanced project ideas:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateProjectImage = async (projectDescription: string, stage: string = 'final'): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest('POST', '/api/ai/generate-project-image', {
        projectDescription,
        stage
      });
      
      const result = await response.json();
      setProjectImage(result.imageBase64 || null);
    } catch (err) {
      setError('Failed to generate project image. Please try again.');
      console.error('Error generating project image:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateCommunityEventIdeas = async (materials: string[], participants: number): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest('POST', '/api/ai/community-event-ideas', {
        materials,
        participants
      });
      
      const result = await response.json();
      setCommunityEventIdeas(result.events || []);
    } catch (err) {
      setError('Failed to generate community event ideas. Please try again.');
      console.error('Error generating community event ideas:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const submitUserFeedback = async (projectId: number, feedback: any): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest('POST', '/api/ai/user-feedback', {
        projectId,
        feedback
      });
      
      const result = await response.json();
      return result.success;
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
      console.error('Error submitting feedback:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    projectSuggestions,
    optimizedInstructions,
    environmentalImpact,
    projectDivisionPlan,
    externalProjects,
    projectImage,
    communityEventIdeas,
    generateProjectIdeas,
    optimizeProjectInstructions,
    calculateEnvironmentalImpact,
    createProjectDivisionPlan,
    learnFromExternalProject,
    searchExternalProjects,
    generateEnhancedProjectIdeas,
    generateProjectImage,
    generateCommunityEventIdeas,
    submitUserFeedback
  };
}

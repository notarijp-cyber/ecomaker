import { useState } from 'react';
import axios from 'axios';

// Interfacce per i tipi di dati Thingiverse
export interface ThingiverseModel {
  id: number;
  name: string;
  thumbnail: string;
  url: string;
  public_url: string;
  creator: {
    name: string;
    thumbnail: string;
    url: string;
  };
  added: string;
  modified: string;
  description: string;
  instructions: string;
  license: string;
  files_count: number;
  like_count: number;
  download_count: number;
  view_count: number;
  make_count: number;
  tags: string[];
  is_featured: boolean;
  is_published: boolean;
  is_wip: boolean;
  categories: string[];
  file_formats: string[];
}

export interface ThingiverseSearchResponse {
  total: number;
  hits: ThingiverseModel[];
}

export interface ThingiverseFile {
  id: number;
  name: string;
  size: number;
  url: string;
  download_url: string;
  thumbnail: string;
  default_image: string;
  date: string;
  formatted_size: string;
  download_count: number;
}

export interface ThingiverseWorkflow {
  steps: string[];
  materials: string[];
  tools: string[];
  difficulty: string;
  estimatedTime: number;
}

export interface UseThingiverseResult {
  searchResults: ThingiverseModel[];
  totalResults: number;
  selectedModel: ThingiverseModel | null;
  modelFiles: ThingiverseFile[];
  modelWorkflow: ThingiverseWorkflow | null;
  isSearching: boolean;
  isLoading: boolean;
  error: string | null;
  isConfigured: boolean;
  searchModels: (keywords: string[], page?: number, perPage?: number) => Promise<void>;
  getModelDetails: (modelId: number) => Promise<ThingiverseModel | null>;
  getModelFiles: (modelId: number) => Promise<ThingiverseFile[] | null>;
  getModelWorkflow: (modelId: number) => Promise<ThingiverseWorkflow | null>;
  findRelevantModels: (materials: string[], projectType?: string) => Promise<ThingiverseModel[] | null>;
  setSelectedModel: (model: ThingiverseModel | null) => void;
}

export function useThingiverse(): UseThingiverseResult {
  const [searchResults, setSearchResults] = useState<ThingiverseModel[]>([]);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [selectedModel, setSelectedModel] = useState<ThingiverseModel | null>(null);
  const [modelFiles, setModelFiles] = useState<ThingiverseFile[]>([]);
  const [modelWorkflow, setModelWorkflow] = useState<ThingiverseWorkflow | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState<boolean>(true);

  // Funzione per cercare modelli su Thingiverse
  const searchModels = async (keywords: string[], page = 1, perPage = 20): Promise<void> => {
    try {
      setIsSearching(true);
      setError(null);

      const response = await axios.get<ThingiverseSearchResponse>('/api/thingiverse/search', {
        params: {
          q: keywords.join(','),
          page,
          per_page: perPage
        }
      });

      setSearchResults(response.data.hits || []);
      setTotalResults(response.data.total || 0);
    } catch (error: any) {
      console.error('Errore nella ricerca su Thingiverse:', error);
      
      if (error.response?.status === 503) {
        setIsConfigured(false);
        setError("L'API di Thingiverse non è configurata. Contatta l'amministratore.");
      } else {
        setError(`Errore nella ricerca: ${error.response?.data?.message || error.message}`);
      }
      
      setSearchResults([]);
      setTotalResults(0);
    } finally {
      setIsSearching(false);
    }
  };

  // Funzione per ottenere i dettagli di un modello
  const getModelDetails = async (modelId: number): Promise<ThingiverseModel | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get<ThingiverseModel>(`/api/thingiverse/things/${modelId}`);
      return response.data;
    } catch (error: any) {
      console.error('Errore nel recupero dei dettagli del modello:', error);
      
      if (error.response?.status === 503) {
        setIsConfigured(false);
        setError("L'API di Thingiverse non è configurata. Contatta l'amministratore.");
      } else {
        setError(`Errore nel recupero dei dettagli: ${error.response?.data?.message || error.message}`);
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Funzione per ottenere i file di un modello
  const getModelFiles = async (modelId: number): Promise<ThingiverseFile[] | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get<ThingiverseFile[]>(`/api/thingiverse/things/${modelId}/files`);
      setModelFiles(response.data || []);
      return response.data;
    } catch (error: any) {
      console.error('Errore nel recupero dei file del modello:', error);
      
      if (error.response?.status === 503) {
        setIsConfigured(false);
        setError("L'API di Thingiverse non è configurata. Contatta l'amministratore.");
      } else {
        setError(`Errore nel recupero dei file: ${error.response?.data?.message || error.message}`);
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Funzione per ottenere il workflow di un modello
  const getModelWorkflow = async (modelId: number): Promise<ThingiverseWorkflow | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get<ThingiverseWorkflow>(`/api/thingiverse/analyze-workflow/${modelId}`);
      setModelWorkflow(response.data);
      return response.data;
    } catch (error: any) {
      console.error('Errore nel recupero del workflow del modello:', error);
      
      if (error.response?.status === 503) {
        setIsConfigured(false);
        setError("L'API di Thingiverse non è configurata. Contatta l'amministratore.");
      } else {
        setError(`Errore nel recupero del workflow: ${error.response?.data?.message || error.message}`);
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Funzione per trovare modelli rilevanti in base ai materiali
  const findRelevantModels = async (materials: string[], projectType?: string): Promise<ThingiverseModel[] | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post<{ models: ThingiverseModel[] }>('/api/thingiverse/relevant-models', {
        materials,
        projectType
      });

      return response.data.models || null;
    } catch (error: any) {
      console.error('Errore nella ricerca di modelli rilevanti:', error);
      
      if (error.response?.status === 503) {
        setIsConfigured(false);
        setError("L'API di Thingiverse non è configurata. Contatta l'amministratore.");
      } else {
        setError(`Errore nella ricerca di modelli rilevanti: ${error.response?.data?.message || error.message}`);
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    searchResults,
    totalResults,
    selectedModel,
    modelFiles,
    modelWorkflow,
    isSearching,
    isLoading,
    error,
    isConfigured,
    searchModels,
    getModelDetails,
    getModelFiles,
    getModelWorkflow,
    findRelevantModels,
    setSelectedModel
  };
}
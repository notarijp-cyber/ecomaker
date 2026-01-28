import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import axios from 'axios';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Search, Filter, Download, Info, ExternalLink, Globe } from 'lucide-react';
import { getTranslations, detectBrowserLanguage, type Language } from '../../../data/translations';

// Interfacce per i tipi di dati
interface ThingiverseModel {
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
  description: string;
  instructions: string;
  license: string;
  like_count: number;
  download_count: number;
  make_count: number;
  tags: string[];
  categories: string[];
}

interface ThingiverseSearchResponse {
  total: number;
  hits: ThingiverseModel[];
}

interface ThingiverseWorkflow {
  steps: string[];
  materials: string[];
  tools: string[];
  difficulty: string;
  estimatedTime: number;
}

interface ThingiverseFile {
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

const ThingiverseModelsPage: React.FC = () => {
  // Stati per la ricerca e paginazione
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchTerms, setSearchTerms] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [results, setResults] = useState<ThingiverseModel[]>([]);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedModel, setSelectedModel] = useState<ThingiverseModel | null>(null);
  const [modelFiles, setModelFiles] = useState<ThingiverseFile[]>([]);
  const [modelWorkflow, setModelWorkflow] = useState<ThingiverseWorkflow | null>(null);
  const [isModelLoading, setIsModelLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState<boolean>(true);
  const [, setLocation] = useLocation();
  const [language, setLanguage] = useState<Language>(detectBrowserLanguage());
  const translations = getTranslations(language);
  const itemsPerPage = 20;

  // Effettua la ricerca quando la pagina cambia
  useEffect(() => {
    if (searchTerms.length > 0) {
      searchModels(searchTerms, currentPage);
    }
  }, [currentPage]);

  // Funzione per effettuare una ricerca
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setError("Inserisci un termine di ricerca");
      return;
    }

    const terms = searchQuery
      .split(',')
      .map(term => term.trim())
      .filter(term => term.length > 0);

    if (terms.length === 0) {
      setError("Inserisci almeno un termine di ricerca valido");
      return;
    }

    setSearchTerms(terms);
    setCurrentPage(1);
    setSelectedModel(null);
    searchModels(terms, 1);
  };

  // Funzione per cercare modelli Thingiverse
  const searchModels = async (terms: string[], page: number) => {
    try {
      setIsSearching(true);
      setError(null);

      const response = await axios.get<ThingiverseSearchResponse>('/api/thingiverse/search', {
        params: {
          q: terms.join(','),
          page,
          per_page: itemsPerPage,
          lang: language
        }
      });

      setResults(response.data.hits || []);
      setTotalResults(response.data.total || 0);
    } catch (error: any) {
      console.error(language === 'it' ? "Errore nella ricerca su Thingiverse:" : "Error searching Thingiverse:", error);
      
      if (error.response?.status === 503) {
        setIsConfigured(false);
        setError(language === 'it' 
          ? "API Thingiverse non disponibile - Utilizzando dati locali di fallback" 
          : "Thingiverse API unavailable - Using local fallback data");
      } else if (error.response?.status === 401) {
        setIsConfigured(false);
        setError(language === 'it'
          ? "API Thingiverse non configurata o non autorizzata"
          : "Thingiverse API not configured or unauthorized");
      } else {
        setError(language === 'it'
          ? `Errore nella ricerca: ${error.response?.data?.message || error.message}`
          : `Search error: ${error.response?.data?.message || error.message}`);
      }
      
      setResults([]);
      setTotalResults(0);
    } finally {
      setIsSearching(false);
    }
  };

  // Funzione per visualizzare i dettagli di un modello
  const showModelDetails = async (model: ThingiverseModel) => {
    try {
      setIsModelLoading(true);
      setSelectedModel(model);
      setError(null);

      // Ottieni i file del modello
      const filesResponse = await axios.get<ThingiverseFile[]>(`/api/thingiverse/things/${model.id}/files`, {
        params: { lang: language }
      });
      setModelFiles(filesResponse.data || []);

      // Ottieni l'analisi del workflow
      const workflowResponse = await axios.get<ThingiverseWorkflow>(`/api/thingiverse/analyze-workflow/${model.id}`, {
        params: { lang: language }
      });
      setModelWorkflow(workflowResponse.data || null);
    } catch (error: any) {
      console.error(language === 'it' ? "Errore nel recupero dei dettagli del modello:" : "Error retrieving model details:", error);
      setError(language === 'it' 
        ? `Errore nel recupero dei dettagli: ${error.response?.data?.message || error.message}`
        : `Error retrieving details: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsModelLoading(false);
    }
  };

  // Usa questo modello per un progetto
  const useModelForProject = () => {
    if (!selectedModel) return;
    
    // Redirigi alla pagina di creazione del progetto con i dati del modello
    const modelData = encodeURIComponent(JSON.stringify({
      thingiverseId: selectedModel.id,
      name: selectedModel.name,
      description: selectedModel.description,
      materials: modelWorkflow?.materials || [],
      steps: modelWorkflow?.steps || [],
      tools: modelWorkflow?.tools || [],
      difficulty: modelWorkflow?.difficulty || 'Medio',
      estimatedTime: modelWorkflow?.estimatedTime || 60,
      thumbnail: selectedModel.thumbnail
    }));
    
    setLocation(`/create-project?thingiverseModel=${modelData}`);
  };

  // Calcola il numero totale di pagine
  const totalPages = Math.ceil(totalResults / itemsPerPage);

  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{language === 'it' ? 'Modelli Thingiverse' : 'Thingiverse Models'}</h1>
            <p className="text-muted-foreground mt-2">
              {language === 'it'
                ? 'Cerca e usa modelli 3D da Thingiverse per i tuoi progetti di upcycling.'
                : 'Search and use 3D models from Thingiverse for your upcycling projects.'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <Select
              value={language}
              onValueChange={(value) => {
                setLanguage(value as Language);
                // Reload search if there are search terms
                if (searchTerms.length > 0) {
                  searchModels(searchTerms, currentPage);
                }
                // Reload model details if a model is selected
                if (selectedModel) {
                  showModelDetails(selectedModel);
                }
              }}
            >
              <SelectTrigger className="h-8 w-[110px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="it">Italiano</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {!isConfigured && (
          <Alert variant="destructive">
            <AlertTitle>{language === 'it' ? 'API Thingiverse non configurata' : 'Thingiverse API not configured'}</AlertTitle>
            <AlertDescription>
              {language === 'it' 
                ? "L'API di Thingiverse non è configurata correttamente. Contatta l'amministratore per impostare le credenziali API."
                : 'The Thingiverse API is not properly configured. Contact the administrator to set up API credentials.'}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTitle>{language === 'it' ? 'Errore' : 'Error'}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <div className="flex-1">
            <Input 
              placeholder={translations.ui.search.placeholder} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch} disabled={isSearching}>
            {isSearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
            {translations.ui.search.button}
          </Button>
        </div>

        {searchTerms.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {searchTerms.map((term, index) => (
              <Badge key={index} variant="secondary">
                {term}
              </Badge>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {selectedModel ? (
            <div className="md:col-span-2 lg:col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{selectedModel.name}</CardTitle>
                      <CardDescription>
                        {language === 'it' ? 'Creato da' : 'Created by'}: {selectedModel.creator.name} &middot; 
                        {new Date(selectedModel.added).toLocaleDateString(language === 'it' ? 'it-IT' : 'en-US')}
                      </CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => setSelectedModel(null)}>
                      {language === 'it' ? 'Torna ai risultati' : 'Back to results'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isModelLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : (
                    <Tabs defaultValue="details">
                      <TabsList>
                        <TabsTrigger value="details">{language === 'it' ? 'Dettagli' : 'Details'}</TabsTrigger>
                        <TabsTrigger value="files">{language === 'it' ? 'File' : 'Files'} ({modelFiles.length})</TabsTrigger>
                        <TabsTrigger value="workflow">Workflow</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="details" className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="md:w-1/3">
                            <img 
                              src={selectedModel.thumbnail} 
                              alt={selectedModel.name}
                              className="w-full rounded-lg object-cover"
                            />
                            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                              <span>👍 {selectedModel.like_count}</span>
                              <span>⬇️ {selectedModel.download_count}</span>
                              <span>🔨 {selectedModel.make_count}</span>
                            </div>
                          </div>
                          <div className="md:w-2/3">
                            <h3 className="text-lg font-medium">{language === 'it' ? 'Descrizione' : 'Description'}</h3>
                            <p className="mt-2 whitespace-pre-line">{selectedModel.description}</p>
                            
                            <h3 className="text-lg font-medium mt-4">Tag</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {selectedModel.tags && selectedModel.tags.map((tag, index) => (
                                <Badge key={index} variant="outline">{tag}</Badge>
                              ))}
                            </div>
                            
                            <div className="mt-6">
                              <Button onClick={useModelForProject}>
                                {language === 'it' ? 'Usa per un Progetto' : 'Use for a Project'}
                              </Button>
                              <Button variant="outline" className="ml-2" asChild>
                                <a href={selectedModel.public_url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  {language === 'it' ? 'Vedi su Thingiverse' : 'View on Thingiverse'}
                                </a>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="files">
                        <div className="space-y-4">
                          {modelFiles.length > 0 ? (
                            modelFiles.map((file) => (
                              <Card key={file.id}>
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <h4 className="font-medium">{file.name}</h4>
                                      <p className="text-sm text-muted-foreground">
                                        {file.formatted_size} &middot; {language === 'it' 
                                          ? `Scaricato ${file.download_count} volte` 
                                          : `Downloaded ${file.download_count} times`}
                                      </p>
                                    </div>
                                    <Button variant="outline" size="sm" asChild>
                                      <a 
                                        href={file.download_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        download
                                      >
                                        <Download className="mr-2 h-4 w-4" />
                                        {language === 'it' ? 'Scarica' : 'Download'}
                                      </a>
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))
                          ) : (
                            <p>{language === 'it' 
                              ? 'Nessun file disponibile per questo modello.' 
                              : 'No files available for this model.'}</p>
                          )}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="workflow">
                        {modelWorkflow ? (
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-lg font-medium">
                                {language === 'it' ? 'Difficoltà e Tempo' : 'Difficulty and Time'}
                              </h3>
                              <div className="flex gap-4 mt-2">
                                <div className="flex gap-2 items-center">
                                  <strong>{language === 'it' ? 'Difficoltà:' : 'Difficulty:'}</strong> 
                                  <Badge variant={
                                    modelWorkflow.difficulty === 'Facile' || modelWorkflow.difficulty === 'Easy' ? 'secondary' : 
                                    modelWorkflow.difficulty === 'Medio' || modelWorkflow.difficulty === 'Medium' ? 'outline' : 'destructive'
                                  }>
                                    {language === 'it' 
                                      ? (modelWorkflow.difficulty === 'Easy' ? 'Facile' : 
                                         modelWorkflow.difficulty === 'Medium' ? 'Medio' : 
                                         modelWorkflow.difficulty === 'Hard' ? 'Difficile' : 
                                         modelWorkflow.difficulty)
                                      : (modelWorkflow.difficulty === 'Facile' ? 'Easy' : 
                                         modelWorkflow.difficulty === 'Medio' ? 'Medium' : 
                                         modelWorkflow.difficulty === 'Difficile' ? 'Hard' : 
                                         modelWorkflow.difficulty)
                                    }
                                  </Badge>
                                </div>
                                <div>
                                  <strong>{language === 'it' ? 'Tempo stimato:' : 'Estimated time:'}</strong> {modelWorkflow.estimatedTime} {language === 'it' ? 'minuti' : 'minutes'}
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-lg font-medium">
                                {language === 'it' ? 'Materiali necessari' : 'Required Materials'}
                              </h3>
                              <ul className="list-disc list-inside mt-2">
                                {modelWorkflow.materials.length > 0 ? (
                                  modelWorkflow.materials.map((material, index) => (
                                    <li key={index}>{material}</li>
                                  ))
                                ) : (
                                  <li>{language === 'it' ? 'Nessun materiale specificato' : 'No materials specified'}</li>
                                )}
                              </ul>
                            </div>
                            
                            <div>
                              <h3 className="text-lg font-medium">
                                {language === 'it' ? 'Strumenti necessari' : 'Required Tools'}
                              </h3>
                              <ul className="list-disc list-inside mt-2">
                                {modelWorkflow.tools.length > 0 ? (
                                  modelWorkflow.tools.map((tool, index) => (
                                    <li key={index}>{tool}</li>
                                  ))
                                ) : (
                                  <li>{language === 'it' ? 'Nessuno strumento specificato' : 'No tools specified'}</li>
                                )}
                              </ul>
                            </div>
                            
                            <div>
                              <h3 className="text-lg font-medium">
                                {language === 'it' ? 'Passaggi' : 'Steps'}
                              </h3>
                              <ol className="list-decimal list-inside mt-2 space-y-2">
                                {modelWorkflow.steps.map((step, index) => (
                                  <li key={index}>{step}</li>
                                ))}
                              </ol>
                            </div>
                          </div>
                        ) : (
                          <p>
                            {language === 'it' 
                              ? 'Impossibile analizzare il workflow di questo modello.' 
                              : 'Unable to analyze the workflow for this model.'}
                          </p>
                        )}
                      </TabsContent>
                    </Tabs>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            results.map((model) => (
              <Card key={model.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <img 
                    src={model.thumbnail} 
                    alt={model.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{model.name}</CardTitle>
                  <CardDescription>
                    {language === 'it' ? 'da' : 'by'} {model.creator.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-2">{model.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex gap-3 text-sm text-muted-foreground">
                    <span>👍 {model.like_count}</span>
                    <span>⬇️ {model.download_count}</span>
                  </div>
                  <Button onClick={() => showModelDetails(model)}>
                    {language === 'it' ? 'Dettagli' : 'Details'}
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>

        {isSearching && results.length === 0 && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}

        {!isSearching && searchTerms.length > 0 && results.length === 0 && !error && (
          <div className="text-center py-12">
            <Info className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">
              {language === 'it' ? 'Nessun risultato trovato' : 'No results found'}
            </h3>
            <p className="mt-2 text-muted-foreground">
              {language === 'it' 
                ? 'Prova a cercare con termini diversi o più generici.' 
                : 'Try searching with different or more generic terms.'}
            </p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination>
              <Button 
                variant="outline" 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || isSearching}
              >
                {language === 'it' ? 'Precedente' : 'Previous'}
              </Button>
              <div className="px-4 py-2">
                {language === 'it' ? 'Pagina' : 'Page'} {currentPage} {language === 'it' ? 'di' : 'of'} {totalPages}
              </div>
              <Button 
                variant="outline" 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || isSearching}
              >
                {language === 'it' ? 'Successiva' : 'Next'}
              </Button>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThingiverseModelsPage;
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { PageLayout } from "@/components/layout/page-layout";
import { EnvironmentalImpact } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Leaf, Recycle, Euro, TreePine } from "lucide-react";

// Mock data for visualization
const monthlyRecycling = [
  { name: 'Gen', value: 1.2 },
  { name: 'Feb', value: 1.8 },
  { name: 'Mar', value: 2.3 },
  { name: 'Apr', value: 2.5 },
  { name: 'Mag', value: 3.1 },
  { name: 'Giu', value: 2.9 },
];

const materialTypes = [
  { name: 'Plastica', value: 35 },
  { name: 'Carta', value: 25 },
  { name: 'Vetro', value: 15 },
  { name: 'Metallo', value: 10 },
  { name: 'Legno', value: 10 },
  { name: 'Altro', value: 5 },
];

const projectsImpact = [
  { name: 'Lampada', materials: 0.5, money: 10, carbon: 2 },
  { name: 'Libreria', materials: 3.5, money: 45, carbon: 8 },
  { name: 'Fioriera', materials: 1.2, money: 15, carbon: 3 },
  { name: 'Vaso', materials: 0.8, money: 12, carbon: 1.5 },
];

const COLORS = ['#4CAF50', '#FFB74D', '#26C6DA', '#F44336', '#9C27B0', '#757575'];

export default function EnvironmentalImpactPage() {
  const userId = 1; // Placeholder for now
  
  const { data: impact, isLoading } = useQuery<EnvironmentalImpact>({
    queryKey: [`/api/environmental-impact/${userId}`],
  });
  
  return (
    <PageLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-heading font-bold mb-2">Impatto Ambientale</h2>
        <p className="text-neutral-medium">
          Visualizza l'impatto positivo che hai generato riciclando e upcyclando i materiali.
        </p>
      </div>
      
      {/* Impact summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-md font-medium">Materiali Riciclati</CardTitle>
              <Recycle className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-3xl font-bold text-primary">
                {impact?.materialsRecycled || 0} kg
              </div>
            )}
            <p className="text-xs text-neutral-medium mt-1">
              Hai salvato questo materiale dalla discarica
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-md font-medium">Progetti Completati</CardTitle>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-3xl font-bold text-secondary">
                {impact?.projectsCompleted || 0}
              </div>
            )}
            <p className="text-xs text-neutral-medium mt-1">
              Progetti realizzati con materiali riciclati
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-md font-medium">Risparmio Economico</CardTitle>
              <Euro className="h-5 w-5 text-warning" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-3xl font-bold text-warning">
                {impact?.moneySaved || 0}€
              </div>
            )}
            <p className="text-xs text-neutral-medium mt-1">
              Denaro risparmiato grazie all'upcycling
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-md font-medium">CO₂ Risparmiata</CardTitle>
              <TreePine className="h-5 w-5 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-3xl font-bold text-accent">
                {impact?.carbonFootprint || 0} kg
              </div>
            )}
            <p className="text-xs text-neutral-medium mt-1">
              Equivalente a {((impact?.carbonFootprint || 0) / 20).toFixed(1)} alberi piantati
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="overview">Panoramica</TabsTrigger>
          <TabsTrigger value="materials">Materiali</TabsTrigger>
          <TabsTrigger value="projects">Progetti</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Andamento Materiali Riciclati</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyRecycling}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis unit=" kg" />
                    <Tooltip 
                      formatter={(value: number) => [`${value} kg`, 'Materiali Riciclati']}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      name="Materiali Riciclati"
                      stroke="#4CAF50" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Tipi di Materiali Riciclati</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={materialTypes}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {materialTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentuale']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Risparmio per Progetto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={projectsImpact}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis unit="€" />
                      <Tooltip formatter={(value) => [`${value}€`, 'Risparmio']} />
                      <Legend />
                      <Bar dataKey="money" name="Risparmio (€)" fill="#FFB74D" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Materials Tab */}
        <TabsContent value="materials" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Composizione dei Materiali Riciclati</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={materialTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      outerRadius={130}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {materialTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentuale']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Dettaglio Materiali Riciclati</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Materiale</th>
                      <th className="text-right py-3 px-4">Quantità</th>
                      <th className="text-right py-3 px-4">Impatto CO₂ Risparmiato</th>
                      <th className="text-right py-3 px-4">Risparmio</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4">Bottiglie di plastica</td>
                      <td className="text-right py-3 px-4">1.2 kg</td>
                      <td className="text-right py-3 px-4">2.4 kg</td>
                      <td className="text-right py-3 px-4">6€</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Cartone</td>
                      <td className="text-right py-3 px-4">0.8 kg</td>
                      <td className="text-right py-3 px-4">1.2 kg</td>
                      <td className="text-right py-3 px-4">3€</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Lattine di alluminio</td>
                      <td className="text-right py-3 px-4">0.3 kg</td>
                      <td className="text-right py-3 px-4">1.8 kg</td>
                      <td className="text-right py-3 px-4">4€</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Bottiglie di vetro</td>
                      <td className="text-right py-3 px-4">0.2 kg</td>
                      <td className="text-right py-3 px-4">0.1 kg</td>
                      <td className="text-right py-3 px-4">2€</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Impatto dei Progetti</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={projectsImpact}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="materials" name="Materiali Riciclati (kg)" fill="#4CAF50" />
                    <Bar dataKey="money" name="Risparmio (€)" fill="#FFB74D" />
                    <Bar dataKey="carbon" name="CO₂ Risparmiata (kg)" fill="#26C6DA" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Dettaglio Progetti</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Progetto</th>
                      <th className="text-center py-3 px-4">Data Completamento</th>
                      <th className="text-center py-3 px-4">Materiali Utilizzati</th>
                      <th className="text-right py-3 px-4">Impatto Ambientale</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4">Lampada da bottiglia</td>
                      <td className="text-center py-3 px-4">12 Maggio 2023</td>
                      <td className="text-center py-3 px-4">Bottiglia di vetro, LED</td>
                      <td className="text-right py-3 px-4">
                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 rounded-full">
                          Alto
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Libreria da cassette</td>
                      <td className="text-center py-3 px-4">3 Aprile 2023</td>
                      <td className="text-center py-3 px-4">Cassette di legno, Viti</td>
                      <td className="text-right py-3 px-4">
                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 rounded-full">
                          Alto
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Vaso da pneumatico</td>
                      <td className="text-center py-3 px-4">28 Marzo 2023</td>
                      <td className="text-center py-3 px-4">Pneumatico, Corda, Vernice</td>
                      <td className="text-right py-3 px-4">
                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 rounded-full">
                          Medio
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}

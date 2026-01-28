import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Material, MaterialType } from '@/lib/types';

interface UseMaterialInventoryReturn {
  materials: Material[] | undefined;
  materialTypes: MaterialType[] | undefined;
  isLoading: boolean;
  error: Error | null;
  addMaterial: (material: Omit<Material, 'id' | 'createdAt'>) => Promise<Material>;
  updateMaterial: (id: number, material: Partial<Material>) => Promise<Material>;
  deleteMaterial: (id: number) => Promise<void>;
  getMaterialsByType: (typeId: number) => Material[] | undefined;
}

export function useMaterialInventory(userId?: number): UseMaterialInventoryReturn {
  const queryClient = useQueryClient();
  const [error, setError] = useState<Error | null>(null);

  // Fetch user's materials
  const { data: materials, isLoading: materialsLoading } = useQuery({
    queryKey: userId ? ['/api/materials', { userId }] : ['/api/materials'],
    enabled: !!userId
  });

  // Fetch material types
  const { data: materialTypes, isLoading: typesLoading } = useQuery({
    queryKey: ['/api/material-types']
  });

  // Add new material
  const addMaterialMutation = useMutation({
    mutationFn: async (material: Omit<Material, 'id' | 'createdAt'>) => {
      const response = await apiRequest('POST', '/api/materials', material);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/materials'] });
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['/api/materials', { userId }] });
      }
    },
    onError: (error: Error) => {
      setError(error);
    }
  });

  // Update material
  const updateMaterialMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number, updates: Partial<Material> }) => {
      const response = await apiRequest('PUT', `/api/materials/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/materials'] });
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['/api/materials', { userId }] });
      }
    },
    onError: (error: Error) => {
      setError(error);
    }
  });

  // Delete material
  const deleteMaterialMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/materials/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/materials'] });
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['/api/materials', { userId }] });
      }
    },
    onError: (error: Error) => {
      setError(error);
    }
  });

  const addMaterial = async (material: Omit<Material, 'id' | 'createdAt'>): Promise<Material> => {
    return addMaterialMutation.mutateAsync(material);
  };

  const updateMaterial = async (id: number, updates: Partial<Material>): Promise<Material> => {
    return updateMaterialMutation.mutateAsync({ id, updates });
  };

  const deleteMaterial = async (id: number): Promise<void> => {
    return deleteMaterialMutation.mutateAsync(id);
  };

  const getMaterialsByType = (typeId: number): Material[] | undefined => {
    return materials?.filter((material) => material.typeId === typeId);
  };

  return {
    materials,
    materialTypes,
    isLoading: materialsLoading || typesLoading,
    error,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    getMaterialsByType
  };
}

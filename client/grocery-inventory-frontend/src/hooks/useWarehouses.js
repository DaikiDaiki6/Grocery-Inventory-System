import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { warehousesService } from "../api/services";

export const useGetAllWarehouses = () => {
  return useQuery({
    queryKey: ["warehouses"],
    queryFn: async () => {
      const response = await warehousesService.getAllWarehouses();
      return response.data;
    },
  });
};

export const useGetSpecificWarehouse = (id) => {
  return useQuery({
    queryKey: ["warehouses", id],
    queryFn: async () => {
      const response = await warehousesService.getSpecificWarehouse(id);
      return response.data;
    },
    enabled: !!id, // only run if id exists
  });
};

export const usePostWarehouse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await warehousesService.postWarehouse(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
    },
  });
};

export const usePatchWarehouse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({id, data}) => {
      const response = await warehousesService.patchWarehouse(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
    },
  });
};

export const useDeleteWarehouse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
        await warehousesService.deleteWarehouse(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
    },
  });
};
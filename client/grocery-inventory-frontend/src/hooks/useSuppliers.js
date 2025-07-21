import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { suppliersService } from "../api/services";

export const useGetAllSuppliers = () => {
  return useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const response = await suppliersService.getAllSuppliers();
      return response.data;
    },
  });
};

export const useGetSpecificSupplier = (id) => {
  return useQuery({
    queryKey: ["suppliers", id],
    queryFn: async () => {
      const response = await suppliersService.getSpecificSupplier(id);
      return response.data;
    },
    enabled: !!id, // only run if id exists
  });
};

export const usePostSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await suppliersService.postSupplier(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
};

export const usePatchSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({id, data}) => {
      const response = await suppliersService.patchSupplier(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
};

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
        await suppliersService.deleteSupplier(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
};
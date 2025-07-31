import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoriesService } from "../api/services";

export const useGetAllInventories = (pageNumber = 1, pageSize = 20) => {
  return useQuery({
    queryKey: ["inventories", pageNumber, pageSize],
    queryFn: async () => {
      const response = await inventoriesService.getAllInventories(
        pageNumber,
        pageSize
      );
      return response.data;
    },
  });
};

export const useGetSpecificInventory = (id) => {
  return useQuery({
    queryKey: ["inventories", id],
    queryFn: async () => {
      const response = await inventoriesService.getSpecificInventory(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const usePostInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await inventoriesService.postInventory(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
    },
  });
};

export const usePutInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await inventoriesService.putInventory(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
    },
  });
};

export const usePatchInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await inventoriesService.patchInventory(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
    },
  });
};

export const useDeleteInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await inventoriesService.deleteInventory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
    },
  });
};

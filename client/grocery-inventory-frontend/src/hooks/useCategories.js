import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesService } from "../api/services";

export const useGetAllCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await categoriesService.getAllCategories();
      return response.data;
    },
  });
};

export const useGetSpecificCategory = (id) => {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: async () => {
      const response = await categoriesService.getSpecificCategory(id);
      return response.data;
    },
    enabled: !!id, // only run if id exists
  });
};

export const usePostCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await categoriesService.postCategory(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const usePatchCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({id, data}) => {
      const response = await categoriesService.patchCategory(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
        await categoriesService.deleteCategory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

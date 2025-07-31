import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsService } from "../api/services";

export const useGetAllProducts = (pageNumber = 1, pageSize = 20) => {
  return useQuery({
    queryKey: ["products", pageNumber, pageSize],
    queryFn: async () => {
      const response = await productsService.getAllProducts(
        pageNumber,
        pageSize
      );
      return response.data;
    },
  });
};

export const useGetSpecificProduct = (id) => {
  return useQuery({
    queryKey: ["products", id],
    queryFn: async () => {
      const response = await productsService.getSpecificProduct(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const usePostProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await productsService.postProduct(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const usePutProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await productsService.putProduct(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const usePatchProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await productsService.patchProduct(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await productsService.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

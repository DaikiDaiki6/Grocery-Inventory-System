import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useFetchForeignKeys() {
  const {
    data: products = [],
    isLoading: loadingProducts,
    error: productsError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:5221/api/products");
      return response.data;
    },
  });

  const {
    data: warehouses = [],
    isLoading: loadingWarehouses,
    error: warehousesError,
  } = useQuery({
    queryKey: ["warehouses"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:5221/api/warehouses");
      return response.data;
    },
  });

  return {
    products,
    warehouses,
    isLoading: loadingProducts || loadingWarehouses,
    error: productsError || warehousesError,
  };
}
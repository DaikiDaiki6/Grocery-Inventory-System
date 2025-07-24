import { useEffect, useState } from "react";
import axios from "axios";

export function useFetchForeignKeys() {
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [categoryRes, supplierRes] = await Promise.all([
          axios.get("http://localhost:5221/api/categories"),
          axios.get("http://localhost:5221/api/suppliers"),
        ]);
        setCategories(categoryRes.data);
        setSuppliers(supplierRes.data);
      } catch (err) {
        setError(err);
        console.error("Error fetching categories or suppliers:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOptions();
  }, []);
  return { categories, suppliers, isLoading, error };
}

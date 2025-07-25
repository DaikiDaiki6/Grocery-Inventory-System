import { useState } from "react";
import { usePostProduct } from "../../hooks/useProducts";
import {useFetchForeignKeys} from "./useFetchForeignKeys";

function PostProduct() {
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [supplier, setSupplier] = useState("");
  const {categories, suppliers, isLoading, error} = useFetchForeignKeys();

  const postProduct = usePostProduct();


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !productId.trim() &&
      !productName.trim() &&
      !category.trim() &&
      !supplier.trim()
    )
      return;

    try {
      await postProduct.mutateAsync({
        productID: productId,
        productName: productName,
        categoryID: parseInt(category),
        supplierID: supplier,
      });
      setProductId("");
      setProductName("");
      setCategory("");
      setSupplier("");
      console.log("Product created successfully!");
    } catch (error) {
      console.error("Failed to create category: ", error);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name == "productId") {
      setProductId(e.target.value);
    }
    if (e.target.name == "productName") {
      setProductName(e.target.value);
    }
  };

  return (
    <div className="product">
      <h1>Create Product</h1>
      {isLoading ? (
        <p>Loading categories and suppliers...</p>
      ) : error ? (
        <p>Error loading options</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="productId"
            value={productId}
            onChange={handleInputChange}
            placeholder="Enter product Id eg.12-123-1233"
          />
          <input
            type="text"
            name="productName"
            value={productName}
            onChange={handleInputChange}
            placeholder="Enter product name"
          />
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option key="" value="">Select Category</option>
            {categories.map((w) => (
              <option key={w.categoryID} value={w.categoryID}>
                {w.categoryName}
              </option>
            ))}
          </select>
          <label>Supplier</label>
          <select value={supplier} onChange={(e) => setSupplier(e.target.value)}>
            <option key="" value="">Select Supplier</option>
            {suppliers.map((w) => (
              <option key={w.supplierID} value={w.supplierID}>
                {w.supplierName}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={
              postProduct.isPending ||
              (!productId.trim() &&
                !productName.trim() &&
                !category.trim() &&
                !supplier.trim())
            }
          >
            {postProduct.isPending ? "Creating... " : "Create Product"}
          </button>
        </form>
      )}
    </div>
  );
}

export default PostProduct;

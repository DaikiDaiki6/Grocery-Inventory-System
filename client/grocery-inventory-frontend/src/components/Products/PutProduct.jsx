import { useState } from "react";
import { usePutProduct } from "../../hooks/useProducts";
import {useFetchForeignKeys} from "./useFetchForeignKeys";


function PutProduct() {
  const [putId, setPutId] = useState("");
  const [productName, setProductName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const putProduct = usePutProduct();
  const { categories, suppliers, isLoading, error } = useFetchForeignKeys();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !putId.trim() &&
      !productName.trim() &&
      !categoryId.trim() &&
      !supplierId.trim()
    )
      return;
    try {
      await putProduct.mutateAsync({
        id: putId.trim(),
        data: {
          productName: productName,
          categoryID: categoryId,
          supplierID: supplierId,
        },
      });
      setPutId("");
      setProductName("");
      setCategoryId("");
      setSupplierId("");
      console.log("Product updated successfully!");
    } catch (error) {
      console.error("Error in updating product: ", error);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name == "putId") {
      setPutId(e.target.value);
    }
    if (e.target.name == "productName") {
      setProductName(e.target.value);
    }
  };

  return (
    <div className="product">
      <h1>Put Product</h1>
      {isLoading ? (
        <p>Loading categories and suppliers...</p>
      ) : error ? (
        <p>Error loading options</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="putId"
            value={putId}
            onChange={handleInputChange}
            placeholder="Enter product Id"
          />
          <input
            type="text"
            name="productName"
            value={productName}
            onChange={handleInputChange}
            placeholder="Enter product name"
          />
          <label>Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((w) => (
              <option key={w.categoryID} value={w.categoryID}>
                {w.categoryName}
              </option>
            ))}
          </select>
          <label>Supplier</label>
          <select
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
          >
            <option value="">Select Supplier</option>
            {suppliers.map((w) => (
              <option key={w.supplierID} value={w.supplierID}>
                {w.supplierName}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={
              putProduct.isPending ||
              (!putId.trim() &&
                !productName.trim() &&
                !categoryId.trim() &&
                !supplierId.trim())
            }
          >
            {putProduct.isPending ? "Updating product" : "Update Product"}{" "}
          </button>
        </form>
      )}
      {putProduct.isSuccess && (
        <div>
          <h1>Product Successfully Updated</h1>
          {putProduct.data && (
            <p>
              Product ID: {putProduct.data.productID} Product Name:{" "}
              {putProduct.data.productName} Category:{" "}
              {putProduct.data.categoryID} Supplier:{" "}
              {putProduct.data.supplierID}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default PutProduct;

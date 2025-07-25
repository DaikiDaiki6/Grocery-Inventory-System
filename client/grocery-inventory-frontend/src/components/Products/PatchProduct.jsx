import { useState } from "react";
import { usePatchProduct } from "../../hooks/useProducts";
import { useFetchForeignKeys } from "./useFetchForeignKeys";

function PatchProduct() {
  const [patchId, setPatchId] = useState("");
  const [productName, setProductName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [supplierId, setSupplierId] = useState("");

  const patchProduct = usePatchProduct();
  const { categories, suppliers, isLoading, error } = useFetchForeignKeys();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !patchId.trim() &&
      !productName.trim() &&
      !categoryId.trim() &&
      !supplierId.trim()
    )
      return;

    try {
      await patchProduct.mutateAsync({
        id: patchId.trim(),
        data: {
          ...(productName && { productName }),
          ...(categoryId && { categoryID: categoryId }),
          ...(supplierId && { supplierID: supplierId }),
        },
      });

      setPatchId("");
      setProductName("");
      setCategoryId("");
      setSupplierId("");
      console.log("Product patched successfully!");
    } catch (error) {
      console.error("Error patching product:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "patchId") setPatchId(value);
    if (name === "productName") setProductName(value);
  };

  return (
    <div className="product">
      <h1>Patch Product</h1>
      {isLoading ? (
        <p>Loading categories and suppliers...</p>
      ) : error ? (
        <p>Error loading options</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="patchId"
            value={patchId}
            onChange={handleInputChange}
            placeholder="Enter product ID to patch"
          />
          <input
            type="text"
            name="productName"
            value={productName}
            onChange={handleInputChange}
            placeholder="Enter new product name"
          />
          <label>Category</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option key="" value="">Select Category</option>
            {categories.map((w) => (
              <option key={w.categoryID} value={w.categoryID}>
                {w.categoryName}
              </option>
            ))}
          </select>
          <label>Supplier</label>
          <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)}>
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
              patchProduct.isPending ||
              (!patchId.trim() &&
                !productName.trim() &&
                !categoryId.trim() &&
                !supplierId.trim())
            }
          >
            {patchProduct.isPending ? "Patching..." : "Patch Product"}
          </button>
        </form>
      )}
      {patchProduct.isSuccess && (
        <div>
          <h1>Product Patched Successfully</h1>
          {patchProduct.data && (
            <p>
              Product ID: {patchProduct.data.productID}, Name:{" "}
              {patchProduct.data.productName}, Category:{" "}
              {patchProduct.data.categoryID}, Supplier:{" "}
              {patchProduct.data.supplierID}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default PatchProduct;

import { useState } from "react";
import { usePatchProduct } from "../../hooks/useProducts";

function PatchProduct() {
  const [patchId, setPatchId] = useState("");
  const [productName, setProductName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const patchProduct = usePatchProduct();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patchId.trim()) {
      alert("Product ID is required to update a product.");
      return;
    }
    if (!productName.trim() && !categoryId.trim() && !supplierId.trim()) {
      alert(
        "At least one field (name, category, or supplier) must be provided to update."
      );
      return;
    }
    try {
      const data = {};
      if (productName.trim()) data.productName = productName;
      if (categoryId.trim()) data.categoryID = categoryId;
      if (supplierId.trim()) data.supplierID = supplierId;
      await patchProduct.mutateAsync({
        id: patchId.trim(),
        data,
      });
      setPatchId("");
      setProductName("");
      setCategoryId("");
      setSupplierId("");
      console.log("Product updated successfully!");
    } catch (error) {
      console.error("Error in updating product: ", error);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name == "patchId") {
      setPatchId(e.target.value);
    }
    if (e.target.name == "productName") {
      setProductName(e.target.value);
    }
    if (e.target.name == "categoryId") {
      setCategoryId(e.target.value);
    }
    if (e.target.name == "supplierId") {
      setSupplierId(e.target.value);
    }
  };

  return (
    <div className="product">
      <h1>Patch Product</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="patchId"
          value={patchId}
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
        <input
          type="number"
          name="categoryId"
          value={categoryId}
          onChange={handleInputChange}
          placeholder="Enter category Id"
        />
        <input
          type="text"
          name="supplierId"
          value={supplierId}
          onChange={handleInputChange}
          placeholder="Enter supplier Id"
        />
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
          {patchProduct.isPending ? "Updating product" : "Update Product"}{" "}
        </button>
      </form>

      {patchProduct.isSuccess && (
        <div>
          <h1>Product Successfully Updated</h1>
          {patchProduct.data && (
            <p>
              Product ID: {patchProduct.data.productID} Product Name:{" "}
              {patchProduct.data.productName} Category:{" "}
              {patchProduct.data.categoryID} Supplier:{" "}
              {patchProduct.data.supplierID}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default PatchProduct;

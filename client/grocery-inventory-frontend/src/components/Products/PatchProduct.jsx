import { useState } from "react";
import { usePatchProduct } from "../../hooks/useProducts";
import { useFetchForeignKeys } from "./useFetchForeignKeys";

function PatchProduct() {
  const [productID, setProductID] = useState("");
  const [productName, setProductName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [errorID, setErrorID] = useState("");
  const [errorName, setErrorName] = useState("");
  const patchProduct = usePatchProduct();
  const { categories, suppliers, isLoading, error } = useFetchForeignKeys();

  const getCategoryNameFromID = (c) => {
    const cInt = parseInt(c);
    const category = categories.find((e) => e.categoryID === cInt);
    return category ? category.categoryName : "Unknown Category";
  };

  const getSupplierNameFromID = (s) => {
    const supplier = suppliers.find((n) => n.supplierID === s);
    return supplier ? supplier.supplierName : "Unknown Warehouse";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !productID.trim() &&
      !productName.trim() &&
      !categoryId.trim() &&
      !supplierId.trim()
    )
      return;

    try {
      await patchProduct.mutateAsync({
        id: productID.trim(),
        data: {
          ...(productName && { productName }),
          ...(categoryId && { categoryID: categoryId }),
          ...(supplierId && { supplierID: supplierId }),
        },
      });
      setProductID("");
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
    if (name === "productID") {
      setProductID(value);
      if (value === "") {
        setErrorID("");
      } else if (value.length !== 11) {
        setErrorID("⚠️ ID must be exactly 11 characters");
      } else {
        setErrorID("");
      }
    }
    if (name === "productName") {
      setProductName(value);
      if (value === "") {
        setErrorName("");
      } else if (value.length < 2) {
        setErrorName("⚠️ Name must be at least 2 characters");
      } else if (value.length > 100) {
        setErrorName("⚠️ Name cannot exceed 100 characters");
      } else {
        setErrorName("");
      }
    }
  };

  return (
    <div className="product">
      <h1>✏️ Patch Product</h1>
      {isLoading ? (
        <p>Loading categories and suppliers...</p>
      ) : error ? (
        <p>Error loading options</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="productID"
            value={productID}
            minLength={11}
            maxLength={11}
            onChange={handleInputChange}
            placeholder="Enter product Id (eg.12-123-1233)"
          />
          {errorID && <div className="error-details">{errorID}</div>}
          <input
            type="text"
            name="productName"
            minLength={2}
            maxLength={100}
            value={productName}
            onChange={handleInputChange}
            placeholder="Enter product name"
          />
          {errorName && <div className="error-details">{errorName}</div>}
          <label>Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option key="" value="">
              Select Category
            </option>
            {categories.map((w) => (
              <option key={w.categoryID} value={w.categoryID}>
                {w.categoryName} (ID: {w.categoryID})
              </option>
            ))}
          </select>
          <label>Supplier</label>
          <select
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
          >
            <option key="" value="">
              Select Supplier
            </option>
            {suppliers.map((w) => (
              <option key={w.supplierID} value={w.supplierID}>
                {w.supplierName} (ID: {w.supplierID})
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={
              patchProduct.isPending ||
              (!productID.trim() &&
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
          <strong>✅ Product Patched Successfully</strong>
          {patchProduct.data && (
            <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>ID</th>
                  <th>Category</th>
                  <th>Supplier</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>{patchProduct.data.productName}</strong>
                  </td>
                  <td>{patchProduct.data.productID}</td>
                   <td>{patchProduct.data.categoryID} - {getCategoryNameFromID(patchProduct.data.categoryID)}</td>
                  <td>{patchProduct.data.supplierID} - {getSupplierNameFromID(patchProduct.data.supplierID)}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      )}

      {patchProduct.isError && (
        <div className="product-error">
          <p>
            Error updating product :{" "}
            {typeof patchProduct.error?.response?.data === "string"
              ? patchProduct.error.response.data
              : patchProduct.error?.response?.data?.title ||
                patchProduct.error?.message}
          </p>
        </div>
      )}
    </div>
  );
}

export default PatchProduct;

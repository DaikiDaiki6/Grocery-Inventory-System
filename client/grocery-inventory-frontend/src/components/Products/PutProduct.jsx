import { useState } from "react";
import { usePutProduct } from "../../hooks/useProducts";
import { useFetchForeignKeys } from "./useFetchForeignKeys";

function PutProduct() {
  const [productID, setProductID] = useState("");
  const [productName, setProductName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [errorID, setErrorID] = useState("");
  const [errorName, setErrorName] = useState("");
  const putProduct = usePutProduct();
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
      await putProduct.mutateAsync({
        id: productID.trim(),
        data: {
          productName: productName,
          categoryID: categoryId,
          supplierID: supplierId,
        },
      });
      setProductID("");
      setProductName("");
      setCategoryId("");
      setSupplierId("");
      console.log("Product updated successfully!");
    } catch (error) {
      console.error("Error in updating product: ", error);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name == "productID") {
      setProductID(e.target.value);
      if (e.target.value === "") {
        setErrorID("");
      } else if (e.target.value.length !== 11) {
        setErrorID("⚠️ ID must be exactly 11 characters");
      } else {
        setErrorID("");
      }
    }
    if (e.target.name == "productName") {
      setProductName(e.target.value);
      if (e.target.value === "") {
        setErrorName("");
      } else if (e.target.value.length < 2) {
        setErrorName("⚠️ Name must be at least 2 characters");
      } else if (e.target.value.length > 100) {
        setErrorName("⚠️ Name cannot exceed 100 characters");
      } else {
        setErrorName("");
      }
    }
  };

  return (
    <div className="product">
      <h1>✏️ Put Product</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="productID"
          value={productID}
          minLength={11}
          maxLength={11}
          onChange={handleInputChange}
          placeholder="Enter product Id"
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
              {w.categoryName}
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
              {w.supplierName}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={
            putProduct.isPending ||
            (!productID.trim() &&
              !productName.trim() &&
              !categoryId.trim() &&
              !supplierId.trim())
          }
        >
          {putProduct.isPending ? "Updating..." : "Update Product"}{" "}
        </button>
      </form>

      {putProduct.isSuccess && (
        <div className="product-details">
          <strong>✅ Product updated successfully!</strong>
          {putProduct.data && (
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
                    <strong>{putProduct.data.productName}</strong>
                  </td>
                  <td>{putProduct.data.productID}</td>
                   <td>{putProduct.data.categoryID} - {getCategoryNameFromID(putProduct.data.categoryID)}</td>
                  <td>{putProduct.data.supplierID} - {getSupplierNameFromID(putProduct.data.supplierID)}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      )}

      {putProduct.isError && (
        <div className="product-error">
          <p>
            Error updating product:{" "}
            {typeof putProduct.error?.response?.data === "string"
              ? putProduct.error.response.data
              : putProduct.error?.response?.data?.title ||
                putProduct.error?.message}
          </p>
        </div>
      )}
    </div>
  );
}

export default PutProduct;

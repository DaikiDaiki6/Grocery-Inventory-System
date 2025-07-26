import { useState } from "react";
import { usePostProduct } from "../../hooks/useProducts";
import { useFetchForeignKeys } from "./useFetchForeignKeys";

function PostProduct() {
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [supplier, setSupplier] = useState("");
  const [errorID, setErrorID] = useState("");
  const [errorName, setErrorName] = useState("");
  const { categories, suppliers, isLoading, error } = useFetchForeignKeys();
  const postProduct = usePostProduct();

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
      console.error("Failed to create product: ", error);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name == "productId") {
      setProductId(e.target.value);
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
      <h1>➕ Create Product</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="productId"
          value={productId}
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
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
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
        <select value={supplier} onChange={(e) => setSupplier(e.target.value)}>
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

      {postProduct.isSuccess && (
        <div className="product-details">
          <strong>✅ Product created successfully!</strong>
          {postProduct.data && (
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
                    <strong>{postProduct.data.productName}</strong>
                  </td>
                  <td>{postProduct.data.productID}</td>
                  <td>{postProduct.data.categoryID} - {getCategoryNameFromID(postProduct.data.categoryID)}</td>
                  <td>{postProduct.data.supplierID} - {getSupplierNameFromID(postProduct.data.supplierID)}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      )}

      {postProduct.isError && (
        <div className="product-error">
          <p>
            Error creating product:{" "}
            {typeof postProduct.error?.response?.data === "string"
              ? postProduct.error.response.data
              : postProduct.error?.response?.data?.title ||
                postProduct.error?.message}
          </p>
        </div>
      )}
    </div>
  );
}

export default PostProduct;

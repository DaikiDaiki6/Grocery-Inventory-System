import { useState } from "react";
import { usePostProduct } from "../../hooks/useProducts";
import { useFetchForeignKeys } from "./useFetchForeignKeys";
import { getErrorMessage, getErrorStyling } from "../../utils/errorHandler";
import { isUserAdmin } from "../../utils/authUtils";

function PostProduct() {
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [supplier, setSupplier] = useState("");
  const [errorID, setErrorID] = useState("");
  const [errorName, setErrorName] = useState("");
  const { categories, suppliers, isLoading, error } = useFetchForeignKeys();
  const postProduct = usePostProduct();
  const isAdmin = isUserAdmin();

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
    <div
      className={`max-w-xl mx-auto bg-white shadow-md rounded-2xl p-6 mt-6 ${
        !isAdmin ? "opacity-50" : ""
      }`}
    >
      <h1 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        ➕ Create Product
        {!isAdmin && (
          <span className="text-sm text-gray-500 font-normal">
            (Admin Only)
          </span>
        )}
      </h1>

      {!isAdmin && (
        <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-lg text-yellow-800 mb-4">
          <p className="flex items-center gap-2">
            🔒 This action requires administrator privileges. Only admins can
            create products.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product ID
          </label>
          <input
            type="text"
            name="productId"
            value={productId}
            onChange={handleInputChange}
            placeholder="Enter product ID (e.g., 12-123-1233)"
            className={`w-full px-4 py-2 border ${
              errorID ? "border-red-500" : "border-gray-300"
            } rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
              !isAdmin ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
            minLength={11}
            maxLength={11}
            disabled={!isAdmin}
          />
          {errorID && <p className="text-red-600 text-sm mt-1">{errorID}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name
          </label>
          <input
            type="text"
            name="productName"
            value={productName}
            onChange={handleInputChange}
            placeholder="Enter product name (e.g., Organic Milk)"
            className={`w-full px-4 py-2 border ${
              errorName ? "border-red-500" : "border-gray-300"
            } rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
              !isAdmin ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
            minLength={2}
            maxLength={100}
            disabled={!isAdmin}
          />
          {errorName && (
            <p className="text-red-600 text-sm mt-1">{errorName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={!isAdmin}
            className={`w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
              !isAdmin ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.categoryID} value={cat.categoryID}>
                {cat.categoryName} (ID: {cat.categoryID})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Supplier
          </label>
          <select
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            disabled={!isAdmin}
            className={`w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
              !isAdmin ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          >
            <option value="">Select Supplier</option>
            {suppliers.map((sup) => (
              <option key={sup.supplierID} value={sup.supplierID}>
                {sup.supplierName} (ID: {sup.supplierID})
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={
            !isAdmin ||
            postProduct.isPending ||
            (!productId.trim() &&
              !productName.trim() &&
              !category.trim() &&
              !supplier.trim()) ||
            errorID ||
            errorName
          }
          className={`w-full py-2 px-4 rounded-lg transition ${
            isAdmin
              ? "bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              : "bg-gray-400 text-gray-600 cursor-not-allowed"
          }`}
        >
          {postProduct.isPending ? "Creating..." : "Create Product"}
        </button>
      </form>

      {postProduct.isSuccess && (
        <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded-lg shadow-sm">
          <strong className="text-green-800 text-base flex items-center gap-2">
            ✅ Product created successfully!
          </strong>
        </div>
      )}

      {postProduct.isError && (
        <div
          className={`p-4 border rounded-lg mt-6 ${
            getErrorStyling(postProduct.error).container
          }`}
        >
          <p className="flex items-center gap-2">
            {getErrorStyling(postProduct.error).icon} Error creating product:{" "}
            {getErrorMessage(postProduct.error, "creating", "product")}
          </p>
        </div>
      )}
    </div>
  );
}

export default PostProduct;

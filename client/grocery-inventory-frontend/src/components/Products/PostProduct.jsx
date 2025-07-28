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
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-2xl p-6 mt-6">
      <h1 className="text-xl font-bold text-gray-800 mb-4">
        ➕ Create Product
      </h1>
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
            } rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500`}
            minLength={11}
            maxLength={11}
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
            placeholder="Enter product name (e.g., Brewery Mass)"
            className={`w-full px-4 py-2 border ${
              errorName ? "border-red-500" : "border-gray-300"
            } rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500`}
            minLength={2}
            maxLength={100}
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
            className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select Category</option>
            {categories.map((w) => (
              <option key={w.categoryID} value={w.categoryID}>
                {w.categoryName} (ID: {w.categoryID})
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
            className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select Supplier</option>
            {suppliers.map((w) => (
              <option key={w.supplierID} value={w.supplierID}>
                {w.supplierName} (ID: {w.supplierID})
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={
            postProduct.isPending ||
            errorID ||
            errorName ||
            !productId.trim() ||
            !productName.trim() ||
            !category.trim() ||
            !supplier.trim()
          }
          className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition"
        >
          {postProduct.isPending ? "Creating..." : "Create Product"}
        </button>
      </form>

      {postProduct.isSuccess && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-5 shadow-sm">
          <h2 className="font-semibold text-green-800 text-base mb-4 flex items-center gap-2">
            ✅ Product created successfully!
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700 bg-white border border-gray-200 rounded-xl">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">Product Name</th>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Supplier</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {postProduct.data.productName}
                  </td>
                  <td className="px-4 py-3 text-gray-800">
                    {postProduct.data.productID}
                  </td>
                  <td className="px-4 py-3">
                    {postProduct.data.categoryID} —{" "}
                    {getCategoryNameFromID(postProduct.data.categoryID)}
                  </td>
                  <td className="px-4 py-3">
                    {postProduct.data.supplierID} —{" "}
                    {getSupplierNameFromID(postProduct.data.supplierID)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {postProduct.isError && (
        <div className="mt-4 p-4 border border-red-200 bg-red-50 text-red-700 rounded-lg">
          Error creating product:{" "}
          {typeof postProduct.error?.response?.data === "string"
            ? postProduct.error.response.data
            : postProduct.error?.response?.data?.message ||
              postProduct.error?.message}
        </div>
      )}
    </div>
  );
}

export default PostProduct;

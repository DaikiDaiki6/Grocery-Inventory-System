import { useState } from "react";
import { usePatchProduct } from "../../hooks/useProducts";
import { useFetchForeignKeys } from "./useFetchForeignKeys";
import { getErrorMessage, getErrorStyling } from "../../utils/errorHandler";
import { isUserAdmin } from "../../utils/authUtils";

function PatchProduct() {
  const [productID, setProductID] = useState("");
  const [productName, setProductName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [errorID, setErrorID] = useState("");
  const [errorName, setErrorName] = useState("");
  const patchProduct = usePatchProduct();
  const { categories, suppliers, isLoading, error } = useFetchForeignKeys();
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
    <div
      className={`max-w-xl mx-auto bg-white shadow-md rounded-xl p-6 mt-8 border border-gray-200 space-y-6 ${
        !isAdmin ? "opacity-50" : ""
      }`}
    >
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        ✏️ Patch Product
        {!isAdmin && (
          <span className="text-sm text-gray-500 font-normal">
            (Admin Only)
          </span>
        )}
      </h1>

      {!isAdmin && (
        <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-lg text-yellow-800">
          <p className="flex items-center gap-2">
            🔒 This action requires administrator privileges. Only admins can
            modify products.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="productID"
            className="block text-sm font-medium text-gray-700"
          >
            Product ID
          </label>
          <input
            type="text"
            name="productID"
            value={productID}
            minLength={11}
            maxLength={11}
            onChange={handleInputChange}
            placeholder="Enter Product ID (e.g. 11-111-1111)"
            disabled={!isAdmin}
            className={`w-full px-4 py-2 border ${
              errorID ? "border-red-500" : "border-gray-300"
            } rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
              !isAdmin ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
          {errorID && <p className="text-sm text-red-600 mt-1">{errorID}</p>}
        </div>

        <div>
          <label
            htmlFor="productName"
            className="block text-sm font-medium text-gray-700"
          >
            Product Name
          </label>
          <input
            type="text"
            name="productName"
            minLength={2}
            maxLength={100}
            value={productName}
            onChange={handleInputChange}
            placeholder="Enter Product Name (e.g. Milk)"
            disabled={!isAdmin}
            className={`w-full px-4 py-2 border ${
              errorName ? "border-red-500" : "border-gray-300"
            } rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
              !isAdmin ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
          {errorName && (
            <p className="text-sm text-red-600 mt-1">{errorName}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="categoryId"
            className="block text-sm font-medium text-gray-700"
          >
            Category ID
          </label>
          <select
            name="categoryId"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            disabled={!isAdmin}
            className={`w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
              !isAdmin ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.categoryID} value={category.categoryID}>
                {category.categoryID} - {category.categoryName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="supplierId"
            className="block text-sm font-medium text-gray-700"
          >
            Supplier ID
          </label>
          <select
            name="supplierId"
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
            disabled={!isAdmin}
            className={`w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
              !isAdmin ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          >
            <option value="">Select Supplier</option>
            {suppliers.map((supplier) => (
              <option key={supplier.supplierID} value={supplier.supplierID}>
                {supplier.supplierID} - {supplier.supplierName}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={
            !isAdmin ||
            patchProduct.isPending ||
            (!productID.trim() &&
              !productName.trim() &&
              !categoryId.trim() &&
              !supplierId.trim()) ||
            errorID ||
            errorName
          }
          className={`w-full py-2 px-4 rounded-lg transition ${
            isAdmin
              ? "bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              : "bg-gray-400 text-gray-600 cursor-not-allowed"
          }`}
        >
          {patchProduct.isPending ? "Patching..." : "Patch Product"}
        </button>
      </form>

      {patchProduct.isSuccess && (
        <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded-lg shadow-sm">
          <strong className="text-green-800 text-base flex items-center gap-2">
            ✅ Product patched successfully!
          </strong>
        </div>
      )}

      {patchProduct.isError && (
        <div
          className={`p-4 border rounded-lg mt-6 ${
            getErrorStyling(patchProduct.error).container
          }`}
        >
          <p className="flex items-center gap-2">
            {getErrorStyling(patchProduct.error).icon} Error updating product:{" "}
            {getErrorMessage(patchProduct.error, "updating", "product")}
          </p>
        </div>
      )}
    </div>
  );
}

export default PatchProduct;

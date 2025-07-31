import { useState } from "react";
import { usePutProduct } from "../../hooks/useProducts";
import { useFetchForeignKeys } from "./useFetchForeignKeys";
import { getErrorMessage, getErrorStyling } from "../../utils/errorHandler";
import { isUserAdmin } from "../../utils/authUtils";

function PutProduct() {
  const [productID, setProductID] = useState("");
  const [productName, setProductName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [errorID, setErrorID] = useState("");
  const [errorName, setErrorName] = useState("");
  const putProduct = usePutProduct();
  const { categories, suppliers } = useFetchForeignKeys();
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
    // console.log(12121, !categoryId.trim() && !supplierId.trim());
    if (
      !productID.trim() ||
      (!productName.trim() && !categoryId.trim() && !supplierId.trim())
    ) {
      return;
    }

    try {
      await putProduct.mutateAsync({
        id: productID.trim(),
        data: {
          productName,
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
        ✏️ Update Product
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
            update products.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
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
          <label className="block text-sm font-medium text-gray-700">
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
          <label className="block text-sm font-medium text-gray-700">
            Category ID
          </label>
          <select
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
          <label className="block text-sm font-medium text-gray-700">
            Supplier ID
          </label>
          <select
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
            putProduct.isPending ||
            !productID.trim() ||
            (!productName.trim() && !categoryId.trim() && !supplierId.trim()) ||
            errorID ||
            errorName
          }
          className={`w-full py-2 px-4 rounded-lg transition ${
            isAdmin
              ? "bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              : "bg-gray-400 text-gray-600 cursor-not-allowed"
          }`}
        >
          {putProduct.isPending ? "Updating..." : "Update Product"}
        </button>
      </form>

      {putProduct.isSuccess && (
        <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded-lg shadow-sm">
          <strong className="text-green-800 text-base flex items-center gap-2">
            ✅ Product updated successfully!
          </strong>
        </div>
      )}

      {putProduct.isError && (
        <div
          className={`p-4 border rounded-lg mt-6 ${
            getErrorStyling(putProduct.error).container
          }`}
        >
          <p className="flex items-center gap-2">
            {getErrorStyling(putProduct.error).icon} Error updating product:{" "}
            {getErrorMessage(putProduct.error, "updating", "product")}
          </p>
        </div>
      )}
    </div>
  );
}

export default PutProduct;

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
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-6 mt-8 border border-gray-200 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        ✏️ Patch Product
      </h1>

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
            placeholder="Enter product Id (eg.12-123-1233)"
            className={`w-full px-4 py-2 border ${
              errorID ? "border-red-500" : "border-gray-300"
            } rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500`}
          />
          {errorID && <div className="error-details">{errorID}</div>}
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
            placeholder="Enter product name (eg. Brewery Mass)"
            className={`w-full px-4 py-2 border ${
              errorName ? "border-red-500" : "border-gray-300"
            } rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500`}
          />
          {errorName && <div className="error-details">{errorName}</div>}
        </div>
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            name="category"
            className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
        </div>
        <div>
          <label
            htmlFor="supplier"
            className="block text-sm font-medium text-gray-700"
          >
            Suplier
          </label>
          <select
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
            name="supplier"
            className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
        </div>
        <button
          type="submit"
          disabled={
            patchProduct.isPending ||
            !productID.trim()||
            errorID ||
            errorName
          }
          className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          {patchProduct.isPending ? "Patching..." : "Patch Product"}
        </button>
      </form>

      {patchProduct.isSuccess && (
        <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded-lg shadow-sm">
          <strong className="text-green-800 text-base flex items-center gap-2">
            ✅ Category updated successfully!
          </strong>

          {patchProduct.data && (
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full text-sm text-left border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-green-100 text-green-900 uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-4 py-3 border-b border-gray-300">
                      Product Name
                    </th>
                    <th className="px-4 py-3 border-b border-gray-300">ID</th>
                    <th className="px-4 py-3 border-b border-gray-300">
                      Category
                    </th>
                    <th className="px-4 py-3 border-b border-gray-300">
                      Supplier
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr className="hover:bg-green-50 transition">
                    <td className="px-4 py-3 border-b border-gray-200 font-medium text-gray-800">
                      <strong>{patchProduct.data.productName}</strong>
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 text-gray-700">
                      {patchProduct.data.productID}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 text-gray-700">
                      {patchProduct.data.categoryID} -{" "}
                      {getCategoryNameFromID(patchProduct.data.categoryID)}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 text-gray-700">
                      {patchProduct.data.supplierID} -{" "}
                      {getSupplierNameFromID(patchProduct.data.supplierID)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {patchProduct.isError && (
        <div className="p-4 bg-red-50 border border-red-300 rounded-lg text-red-800 mt-6">
          <p>
            ❌ Error updating category:{" "}
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

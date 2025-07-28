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
  const { categories, suppliers } = useFetchForeignKeys();

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
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-6 mt-8 border border-gray-200 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        ✏️ Update Product
      </h1>

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
            placeholder="Enter product ID (e.g. 11-111-1111)"
            className={`w-full px-4 py-2 border ${
              errorID ? "border-red-500" : "border-gray-300"
            } rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500`}
          />
          {errorID && (
            <div className="text-red-600 text-sm mt-1">{errorID}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            name="productName"
            value={productName}
            onChange={handleInputChange}
            placeholder="Enter product name (e.g. Brewery Mass)"
            className={`w-full px-4 py-2 border ${
              errorName ? "border-red-500" : "border-gray-300"
            } rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500`}
          />
          {errorName && (
            <div className="text-red-600 text-sm mt-1">{errorName}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            name="category"
            className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
          <label className="block text-sm font-medium text-gray-700">
            Supplier
          </label>
          <select
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
            name="supplier"
            className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
            putProduct.isPending ||
            !productID.trim() ||
            (!productName.trim() || !categoryId.trim() || !supplierId.trim()) ||
            errorID ||
            errorName
          }
          className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          {putProduct.isPending ? "Updating..." : "Update Product"}
        </button>
      </form>

      {putProduct.isSuccess && (
        <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded-lg shadow-sm">
          <strong className="text-green-800 text-base flex items-center gap-2">
            ✅ Product updated successfully!
          </strong>

          {putProduct.data && (
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
                      {putProduct.data.productName}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 text-gray-700">
                      {putProduct.data.productID}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 text-gray-700">
                      {putProduct.data.categoryID} -{" "}
                      {getCategoryNameFromID(putProduct.data.categoryID)}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 text-gray-700">
                      {putProduct.data.supplierID} -{" "}
                      {getSupplierNameFromID(putProduct.data.supplierID)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {putProduct.isError && (
        <div className="p-4 bg-red-50 border border-red-300 rounded-lg text-red-800 mt-6">
          <p>
            ❌ Error updating product:{" "}
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

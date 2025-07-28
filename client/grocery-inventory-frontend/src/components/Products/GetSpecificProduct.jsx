import { useState } from "react";
import { useGetSpecificProduct } from "../../hooks/useProducts";

function GetSpecificProduct() {
  const [searchId, setSearchId] = useState("");
  const [currentId, setCurrentId] = useState(null);
  const [errorID, setErrorID] = useState("");
  const { data: product, isLoading, error } = useGetSpecificProduct(currentId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchId.trim()) {
      setCurrentId(searchId);
    }
  };

  const handleInputChange = (e) => {
    setSearchId(e.target.value);
    if (e.target.value === "") {
      setErrorID("");
    } else if (e.target.value.length !== 11) {
      setErrorID("⚠️ ID must be exactly 11 characters.");
    } else {
      setErrorID("");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-6 mt-8 border border-gray-200 space-y-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">🥫🔍 Search Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="productID" className="block text-sm font-medium text-gray-700">
            Product ID
          </label>
          <input
            type="text"
            id="productID"
            name="productID"
            minLength={11}
            maxLength={11}
            value={searchId}
            onChange={handleInputChange}
            placeholder="Enter Product ID (e.g. 12-222-2112)"
            className={`w-full px-4 py-2 border ${
              errorID ? "border-red-500" : "border-gray-300"
            } rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500`}
          />
          {errorID && <p className="text-red-600 text-sm mt-1">{errorID}</p>}
        </div>

        <button
          type="submit"
          disabled={!searchId.trim()}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md disabled:opacity-50"
        >
          Search Product
        </button>
      </form>

      {currentId && (
        <div className="mt-6">
          {isLoading && <p className="text-gray-600">Loading product...</p>}

          {error && (
            <div className="text-red-600 bg-red-50 p-3 mt-4 rounded-md border border-red-300">
              <p className="font-semibold">Error loading product:</p>
              <p>
                {typeof error.response?.data === "string"
                  ? error.response.data
                  : error.response?.data?.title || error.message}
              </p>
            </div>
          )}

          {!isLoading && !error && product && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-green-700 mb-2">
                ✅ Product Found:
              </h2>
              <table className="w-full table-auto border-collapse border border-gray-300 rounded overflow-hidden text-left text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Product Name</th>
                    <th className="border border-gray-300 px-4 py-2">ID</th>
                    <th className="border border-gray-300 px-4 py-2">Category</th>
                    <th className="border border-gray-300 px-4 py-2">Supplier</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-medium">{product.productName}</td>
                    <td className="border border-gray-300 px-4 py-2">{product.productID}</td>
                    <td className="border border-gray-300 px-4 py-2">{product.category}</td>
                    <td className="border border-gray-300 px-4 py-2">{product.supplier}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GetSpecificProduct;

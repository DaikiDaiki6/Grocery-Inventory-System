import { useState } from "react";
import { useDeleteProduct } from "../../hooks/useProducts";

function DeleteProduct() {
  const [productID, setProductID] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errorID, setErrorID] = useState("");
  const deleteProduct = useDeleteProduct();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!productID.trim()) return;
    setShowConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteProduct.mutateAsync(productID);
      setProductID("");
      setShowConfirmation(false);
    } catch (error) {
      console.error("Failed to delete product: ", error);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setProductID(value);
    if (value === "") {
      setErrorID("");
    } else if (value.length !== 11) {
      setErrorID("⚠️ ID must be exactly 11 characters");
    } else {
      setErrorID("");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">🗑️ Delete Product</h1>

      {!showConfirmation ? (
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
              onChange={handleInputChange}
              placeholder="Enter product ID (e.g. 11-111-1111)"
              minLength={11}
              maxLength={11}
              className={`w-full px-4 py-2 border ${
                errorID ? "border-red-500" : "border-gray-300"
              } rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
            {errorID && (
              <p className="text-sm text-red-600 font-medium">{errorID}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={deleteProduct.isPending || !productID.trim()}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
          >
            Delete Product
          </button>
        </form>
      ) : (
        <div className="bg-yellow-50 p-4 rounded-xl space-y-4 border border-yellow-300">
          <h2 className="text-lg font-semibold text-yellow-800">
            ⚠️ Confirm Deletion
          </h2>
          <p className="text-sm text-gray-700">
            Are you sure you want to delete product with ID{" "}
            <strong>{productID}</strong>? This action cannot be undone.
          </p>

          <div className="flex justify-end space-x-3">
            <button
              onClick={handleConfirmDelete}
              disabled={deleteProduct.isPending}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200 disabled:opacity-50"
            >
              {deleteProduct.isPending ? "Deleting..." : "Yes, Delete"}
            </button>
            <button
              onClick={handleCancelDelete}
              disabled={deleteProduct.isPending}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {deleteProduct.isSuccess && (
        <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg">
          ✅ Product deleted successfully!
        </div>
      )}

      {deleteProduct.isError && (
        <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg">
          <strong>Error deleting product: </strong>
          {typeof deleteProduct.error?.response?.data === "string"
            ? deleteProduct.error.response.data
            : deleteProduct.error?.response?.data?.title ||
              deleteProduct.error?.message}
        </div>
      )}
    </div>
  );
}

export default DeleteProduct;

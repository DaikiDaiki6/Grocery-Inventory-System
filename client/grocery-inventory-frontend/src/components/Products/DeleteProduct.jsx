import { useState } from "react";
import { useDeleteProduct } from "../../hooks/useProducts";
import { getErrorMessage, getErrorStyling } from "../../utils/errorHandler";
import { isUserAdmin } from "../../utils/authUtils";

function DeleteProduct() {
  const [productID, setProductID] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errorID, setErrorID] = useState("");
  const deleteProduct = useDeleteProduct();
  const isAdmin = isUserAdmin();

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
    <div
      className={`max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md space-y-6 ${
        !isAdmin ? "opacity-50" : ""
      }`}
    >
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        🗑️ Delete Product
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
            delete products.
          </p>
        </div>
      )}

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
              disabled={!isAdmin}
              className={`w-full px-4 py-2 border ${
                errorID ? "border-red-500" : "border-gray-300"
              } rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                !isAdmin ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
            {errorID && (
              <p className="text-sm text-red-600 font-medium">{errorID}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={
              !isAdmin ||
              deleteProduct.isPending ||
              !productID.trim() ||
              errorID
            }
            className={`w-full font-semibold py-2 px-4 rounded-lg transition duration-200 ${
              isAdmin
                ? "bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                : "bg-gray-400 text-gray-600 cursor-not-allowed"
            }`}
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
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {deleteProduct.isSuccess && (
        <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded-lg shadow-sm">
          <strong className="text-green-800 text-base flex items-center gap-2">
            ✅ Product deleted successfully!
          </strong>
        </div>
      )}

      {deleteProduct.isError && (
        <div
          className={`p-4 border rounded-lg mt-6 ${
            getErrorStyling(deleteProduct.error).container
          }`}
        >
          <p className="flex items-center gap-2">
            {getErrorStyling(deleteProduct.error).icon} Error deleting product:{" "}
            {getErrorMessage(deleteProduct.error, "deleting", "product")}
          </p>
        </div>
      )}
    </div>
  );
}

export default DeleteProduct;

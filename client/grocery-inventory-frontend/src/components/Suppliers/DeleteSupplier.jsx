import { useState } from "react";
import { useDeleteSupplier } from "../../hooks/useSuppliers";

function DeleteSupplier() {
  const [supplierID, setSupplierID] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errorID, setErrorID] = useState("");
  const deleteSupplier = useDeleteSupplier();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!supplierID.trim()) return;
    setShowConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteSupplier.mutateAsync(supplierID);
      setSupplierID("");
      setShowConfirmation(false);
    } catch (error) {
      console.error("Failed to delete supplier: ", error);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  const handleInputChange = (e) => {
    setSupplierID(e.target.value);
    if (e.target.value === "") {
      setErrorID("");
    } else if (e.target.value.length !== 11) {
      setErrorID("⚠️ ID must be exactly 11 characters");
    } else {
      setErrorID("");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">🗑️ Delete Supplier</h1>

      {!showConfirmation ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="supplierID"
              className="block text-sm font-medium text-gray-700"
            >
              Supplier ID
            </label>
            <input
              type="text"
              name="supplierID"
              value={supplierID}
              onChange={handleInputChange}
              placeholder="Enter supplier ID (e.g. 12-222-2112)"
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
            disabled={deleteSupplier.isPending || !supplierID.trim()}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
          >
            Delete Supplier
          </button>
        </form>
      ) : (
        <div className="bg-yellow-50 p-4 rounded-xl space-y-4 border border-yellow-300">
          <h2 className="text-lg font-semibold text-yellow-800">
            ⚠️ Confirm Deletion
          </h2>
          <p className="text-sm text-gray-700">
            Are you sure you want to delete supplier with ID{" "}
            <strong>{supplierID}</strong>? This action cannot be undone.
          </p>

          <div className="flex justify-end space-x-3">
            <button
              onClick={handleConfirmDelete}
              disabled={deleteSupplier.isPending}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200 disabled:opacity-50"
            >
              {deleteSupplier.isPending ? "Deleting..." : "Yes, Delete"}
            </button>
            <button
              onClick={handleCancelDelete}
              disabled={deleteSupplier.isPending}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {deleteSupplier.isSuccess && (
        <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg">
          ✅ Supplier deleted successfully!
        </div>
      )}

      {deleteSupplier.isError && (
        <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg">
          <strong>Error deleting supplier: </strong>
          {typeof deleteSupplier.error?.response?.data === "string"
            ? deleteSupplier.error.response.data
            : deleteSupplier.error?.response?.data?.title ||
              deleteSupplier.error?.message}
        </div>
      )}
    </div>
  );
}

export default DeleteSupplier;

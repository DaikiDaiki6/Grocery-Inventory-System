import { useState } from "react";
import { useDeleteWarehouse } from "../../hooks/useWarehouses";

function DeleteWarehouse() {
  const [warehouseID, setWarehouseID] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errorID, setErrorID] = useState("");
  const deleteWarehouse = useDeleteWarehouse();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!warehouseID.trim()) return;
    setShowConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteWarehouse.mutateAsync(parseInt(warehouseID));
      setWarehouseID("");
      setShowConfirmation(false);
    } catch (error) {
      console.error("Failed to delete warehouse", error);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  const handleInputChange = (e) => {
    setWarehouseID(e.target.value);
    if (e.target.value === "") {
      setErrorID("");
    } else if (e.target.value <= 0) {
      setErrorID("⚠️ ID must be 1 or greater.");
    } else {
      setErrorID("");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">🗑️ Delete Warehouse</h1>

      {!showConfirmation ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="warehouseID"
              className="block text-sm font-medium text-gray-700"
            >
              Warehouse ID
            </label>
            <input
              type="number"
              name="warehouseID"
              value={warehouseID}
              onChange={handleInputChange}
              placeholder="Enter warehouse ID (e.g. 12)"
              min={1}
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
            disabled={deleteWarehouse.isPending || !warehouseID.trim()}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
          >
            Delete Warehouse
          </button>
        </form>
      ) : (
        <div className="bg-yellow-50 p-4 rounded-xl space-y-4 border border-yellow-300">
          <h2 className="text-lg font-semibold text-yellow-800">
            ⚠️ Confirm Deletion
          </h2>
          <p className="text-sm text-gray-700">
            Are you sure you want to delete warehouse with ID{" "}
            <strong>{warehouseID}</strong>? This action cannot be undone.
          </p>

          <div className="flex justify-end space-x-3">
            <button
              onClick={handleConfirmDelete}
              disabled={deleteWarehouse.isPending}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200 disabled:opacity-50"
            >
              {deleteWarehouse.isPending ? "Deleting..." : "Yes, Delete"}
            </button>
            <button
              onClick={handleCancelDelete}
              disabled={deleteWarehouse.isPending}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {deleteWarehouse.isSuccess && (
        <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg">
          ✅ Warehouse deleted successfully!
        </div>
      )}

      {deleteWarehouse.isError && (
        <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg">
          <strong>Error deleting warehouse: </strong>
          {typeof deleteWarehouse.error?.response?.data === "string"
            ? deleteWarehouse.error.response.data
            : deleteWarehouse.error?.response?.data?.title ||
              deleteWarehouse.error?.message}
        </div>
      )}
    </div>
  );
}

export default DeleteWarehouse;

import { useState } from "react";
import { useDeleteInventory } from "../../hooks/useInventories";
import { getErrorMessage, getErrorStyling } from "../../utils/errorHandler";
import { isUserAdmin } from "../../utils/authUtils";

function DeleteInventory() {
  const [inventoryID, setInventoryID] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errorID, setErrorID] = useState("");
  const deleteInventory = useDeleteInventory();
  const isAdmin = isUserAdmin();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inventoryID.trim()) return;
    setShowConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteInventory.mutateAsync(parseInt(inventoryID));
      setInventoryID("");
      setShowConfirmation(false);
    } catch (error) {
      console.error("Failed to delete inventory: ", error);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  const handleInputChange = (e) => {
    setInventoryID(e.target.value);
    if (e.target.value === "") {
      setErrorID("");
    } else if (e.target.value <= 0) {
      setErrorID("⚠️ ID must be 1 or greater.");
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
        🗑️ Delete Inventory
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
            delete inventories.
          </p>
        </div>
      )}

      {!showConfirmation ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="inventoryID"
              className="block text-sm font-medium text-gray-700"
            >
              Inventory ID
            </label>
            <input
              type="number"
              name="inventoryID"
              value={inventoryID}
              onChange={handleInputChange}
              placeholder="Enter inventory ID (e.g. 12)"
              min={1}
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
              deleteInventory.isPending ||
              !inventoryID.trim() ||
              errorID
            }
            className={`w-full font-semibold py-2 px-4 rounded-lg transition duration-200 ${
              isAdmin
                ? "bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                : "bg-gray-400 text-gray-600 cursor-not-allowed"
            }`}
          >
            Delete Inventory
          </button>
        </form>
      ) : (
        <div className="bg-yellow-50 p-4 rounded-xl space-y-4 border border-yellow-300">
          <h2 className="text-lg font-semibold text-yellow-800">
            ⚠️ Confirm Deletion
          </h2>
          <p className="text-sm text-gray-700">
            Are you sure you want to delete inventory with ID{" "}
            <strong>{inventoryID}</strong>? This action cannot be undone.
          </p>

          <div className="flex justify-end space-x-3">
            <button
              onClick={handleConfirmDelete}
              disabled={deleteInventory.isPending}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200 disabled:opacity-50"
            >
              {deleteInventory.isPending ? "Deleting..." : "Yes, Delete"}
            </button>
            <button
              onClick={handleCancelDelete}
              disabled={deleteInventory.isPending}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {deleteInventory.isSuccess && (
        <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded-lg shadow-sm">
          <strong className="text-green-800 text-base flex items-center gap-2">
            ✅ Inventory deleted successfully!
          </strong>
        </div>
      )}

      {deleteInventory.isError && (
        <div
          className={`p-4 border rounded-lg mt-6 ${
            getErrorStyling(deleteInventory.error).container
          }`}
        >
          <p className="flex items-center gap-2">
            {getErrorStyling(deleteInventory.error).icon} Error deleting
            inventory:{" "}
            {getErrorMessage(deleteInventory.error, "deleting", "inventory")}
          </p>
        </div>
      )}
    </div>
  );
}

export default DeleteInventory;

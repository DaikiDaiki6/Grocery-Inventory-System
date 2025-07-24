import { useState } from "react";
import { useDeleteInventory } from "../../hooks/useInventories";

function DeleteInventory() {
  const [deleteId, setDeleteId] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const deleteInventory = useDeleteInventory();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!deleteId.trim()) return;
    setShowConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteInventory.mutateAsync(parseInt(deleteId));
      setDeleteId("");
      setShowConfirmation(false);
      console.log("Inventory deleted successfully!");
    } catch (error) {
      console.error("Failed to delete inventory: ", error);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  const handleInputChange = (e) => {
    setDeleteId(e.target.value);
  };

  return (
    <div className="inventory">
      <h1>🗑️ Delete Inventory</h1>

      {!showConfirmation ? (
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            name="deleteId"
            value={deleteId}
            onChange={handleInputChange}
            placeholder="Enter inventory ID"
            min="1"
          />
          <button
            type="submit"
            disabled={deleteInventory.isPending || !deleteId.trim()}
          >
            Delete Inventory
          </button>
        </form>
      ) : (
        <div className="confirmation-dialog">
          <h2>⚠️ Confirm Deletion</h2>
          <p>
            Are you sure you want to delete inventory with ID{" "}
            <strong>{deleteId}</strong>?
          </p>
          <p style={{ color: "red" }}>This action cannot be undone!</p>
          <div className="button-group">
            <button
              onClick={handleConfirmDelete}
              disabled={deleteInventory.isPending}
              style={{ backgroundColor: "red", color: "white" }}
            >
              {deleteInventory.isPending ? "Deleting..." : "Yes, Delete"}
            </button>
            <button
              onClick={handleCancelDelete}
              disabled={deleteInventory.isPending}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {deleteInventory.isSuccess && (
        <div style={{ color: "green", marginTop: "1rem" }}>
          <h3>Success!</h3>
          <p>✅ Inventory deleted successfully!</p>
        </div>
      )}

      {deleteInventory.isError && (
        <div style={{ color: "red", marginTop: "1rem" }}>
          <h3>Error</h3>
          <p>
            Error deleting inventory:{" "}
            {typeof deleteInventory.error?.response?.data === "string"
              ? deleteInventory.error.response.data
              : deleteInventory.error?.response?.data?.title ||
                deleteInventory.error?.message}
          </p>
        </div>
      )}
    </div>
  );
}

export default DeleteInventory;

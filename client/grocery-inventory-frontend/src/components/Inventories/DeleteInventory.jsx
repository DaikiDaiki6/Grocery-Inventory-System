import { useState } from "react";
import { useDeleteInventory } from "../../hooks/useInventories";

function DeleteInventory() {
  const [inventoryID, setInventoryID] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errorID, setErrorID] = useState("");
  const deleteInventory = useDeleteInventory();

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
      console.log("Inventory deleted successfully!");
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
    <div className="inventory">
      <h1>🗑️ Delete Inventory</h1>

      {!showConfirmation ? (
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            name="deleteId"
            value={inventoryID}
            onChange={handleInputChange}
            placeholder="Enter inventory ID (eg. 12)"
            min={1}
          />
          {errorID && <div className="error-details">{errorID}</div>}
          <button
            type="submit"
            disabled={deleteInventory.isPending || !inventoryID.trim()}
          >
            Delete Inventory
          </button>
        </form>
      ) : (
        <div className="confirmation-dialog">
          <h2>⚠️ Confirm Deletion</h2>
          <p>
            Are you sure you want to delete inventory with ID{" "}
            <strong>{inventoryID}</strong>?
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

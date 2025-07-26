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
      console.log("Warehouse deleted successfully!");
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
    <div className="warehouse">
      <h1>🗑️ Delete Warehouse</h1>

      {!showConfirmation ? (
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            name="deleteId"
            value={warehouseID}
            onChange={handleInputChange}
            placeholder="Enter warehouse ID (eg. 12)"
            min={1}
          />
          {errorID && <div className="error-details">{errorID}</div>}
          <button
            type="submit"
            disabled={deleteWarehouse.isPending || !warehouseID.trim()}
          >
            Delete Warehouse
          </button>
        </form>
      ) : (
        <div className="confirmation-dialog">
          <h2>⚠️ Confirm Deletion</h2>
          <p>
            Are you sure you want to delete warehouse with ID{" "}
            <strong>{warehouseID}</strong>?
          </p>
          <p style={{ color: "red" }}>This action cannot be undone!</p>
          <div className="button-group">
            <button
              onClick={handleConfirmDelete}
              disabled={deleteWarehouse.isPending}
              style={{ backgroundColor: "red", color: "white" }}
            >
              {deleteWarehouse.isPending ? "Deleting..." : "Yes, Delete"}
            </button>
            <button
              onClick={handleCancelDelete}
              disabled={deleteWarehouse.isPending}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {deleteWarehouse.isSuccess && (
        <div style={{ color: "green", marginTop: "1rem" }}>
          <h3>Success!</h3>
          <p>✅ Warehouse deleted successfully!</p>
        </div>
      )}

      {deleteWarehouse.isError && (
        <div style={{ color: "red", marginTop: "1rem" }}>
          <h3>Error</h3>
          <p>
            Error deleting warehouse:{" "}
            {typeof deleteWarehouse.error?.response?.data === "string"
              ? deleteWarehouse.error.response.data
              : deleteWarehouse.error?.response?.data?.title ||
                deleteWarehouse.error?.message}
          </p>
        </div>
      )}
    </div>
  );
}

export default DeleteWarehouse;

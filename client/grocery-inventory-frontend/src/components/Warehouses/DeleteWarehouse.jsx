import { useState } from "react";
import { useDeleteWarehouse } from "../../hooks/useWarehouses";

function DeleteWarehouse() {
  const [deleteId, setDeleteId] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const deleteWarehouse = useDeleteWarehouse();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!deleteId.trim()) return;
    setShowConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    try {
        await deleteWarehouse.mutateAsync(parseInt(deleteId));
        setDeleteId("");
        setShowConfirmation(false);
        console.log("Warehouse deleted successfully!");
    } catch (error) {
        console.error("Failed to delete warehouse", error);
    }
  };

  const handleCancelDelete = () =>{
    setShowConfirmation(false);
  };

  const handleInputChange = (e) => {
    setDeleteId(e.target.value);
  };

  return (
    <div className="warehouse">
      <h1>🗑️ Delete Warehouse</h1>

      {!showConfirmation ? (
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            name="deleteId"
            value={deleteId}
            onChange={handleInputChange}
            placeholder="Enter warehouse ID"
            min="1"
          />
          <button
            type="submit"
            disabled={deleteWarehouse.isPending || !deleteId.trim()}
          >
            Delete Warehouse
          </button>
        </form>
      ) : (
        <div className="confirmation-dialog">
          <h2>⚠️ Confirm Deletion</h2>
          <p>
            Are you sure you want to delete warehouse with ID{" "}
            <strong>{deleteId}</strong>?
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
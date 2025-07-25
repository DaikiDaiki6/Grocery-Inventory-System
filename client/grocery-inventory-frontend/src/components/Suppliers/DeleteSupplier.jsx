import { useState } from "react";
import { useDeleteSupplier } from "../../hooks/useSuppliers";

function DeleteSupplier() {
  const [deleteId, setDeleteId] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const deleteSupplier = useDeleteSupplier();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!deleteId.trim()) return;
    setShowConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteSupplier.mutateAsync(deleteId);
      setDeleteId("");
      setShowConfirmation(false);
      console.log("Supplier deleted successfully!");
    } catch (error) {
      console.error("Failed to delete supplier", error);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  const handleInputChange = (e) => {
    setDeleteId(e.target.value);
  };

  return (
    <div className="supplier">
      <h1>🗑️ Delete Supplier</h1>

      {!showConfirmation ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="deleteId"
            value={deleteId}
            onChange={handleInputChange}
            placeholder="Enter supplier ID"
            min={1}
          />
          <button
            type="submit"
            disabled={deleteSupplier.isPending || !deleteId.trim()}
          >
            Delete Supplier
          </button>
        </form>
      ) : (
        <div className="confirmation-dialog">
          <h2>⚠️ Confirm Deletion</h2>
          <p>
            Are you sure you want to delete supplier with ID{" "}
            <strong>{deleteId}</strong>?
          </p>
          <p style={{ color: "red" }}>This action cannot be undone!</p>
          <div className="button-group">
            <button
              onClick={handleConfirmDelete}
              disabled={deleteSupplier.isPending}
              style={{ backgroundColor: "red", color: "white" }}
            >
              {deleteSupplier.isPending ? "Deleting..." : "Yes, Delete"}
            </button>
            <button
              onClick={handleCancelDelete}
              disabled={deleteSupplier.isPending}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {deleteSupplier.isSuccess && (
        <div style={{ color: "green", marginTop: "1rem" }}>
          <h3>Success!</h3>
          <p>✅ Supplier deleted successfully!</p>
        </div>
      )}

      {deleteSupplier.isError && (
        <div style={{ color: "red", marginTop: "1rem" }}>
          <h3>Error</h3>
          <p>
            Error deleting supplier:{" "}
            {typeof deleteSupplier.error?.response?.data === "string"
              ? deleteSupplier.error.response.data
              : deleteSupplier.error?.response?.data?.title ||
                deleteSupplier.error?.message}
          </p>
        </div>
      )}
    </div>
  );
}

export default DeleteSupplier;

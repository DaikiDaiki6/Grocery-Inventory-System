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
      console.log("Supplier deleted successfully!");
    } catch (error) {
      console.error("Failed to delete supplier", error);
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
    <div className="supplier">
      <h1>🗑️ Delete Supplier</h1>

      {!showConfirmation ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="deleteId"
            minLength={11}
            maxLength={11}
            value={supplierID}
            onChange={handleInputChange}
            placeholder="Enter supplier ID (eg. 12-222-2112)"
          />
          {errorID && <div className="error-details">{errorID}</div>}
          <button
            type="submit"
            disabled={deleteSupplier.isPending || !supplierID.trim()}
          >
            Delete Supplier
          </button>
        </form>
      ) : (
        <div className="confirmation-dialog">
          <h2>⚠️ Confirm Deletion</h2>
          <p>
            Are you sure you want to delete supplier with ID{" "}
            <strong>{supplierID}</strong>?
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

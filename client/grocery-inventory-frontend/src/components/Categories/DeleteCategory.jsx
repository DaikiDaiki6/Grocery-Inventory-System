import { useState } from "react";
import { useDeleteCategory } from "../../hooks/useCategories";

function DeleteCategory() {
  const [deleteId, setDeleteId] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const deleteCategory = useDeleteCategory();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!deleteId.trim()) return;
    setShowConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteCategory.mutateAsync(parseInt(deleteId));
      setDeleteId("");
      setShowConfirmation(false);
      console.log("Category deleted successfully!");
    } catch (error) {
      console.error("Failed to delete category: ", error);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  const handleInputChange = (e) => {
    setDeleteId(e.target.value);
  };

  return (
    <div className="category">
      <h1>🗑️ Delete Category</h1>

      {!showConfirmation ? (
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            name="deleteId"
            value={deleteId}
            onChange={handleInputChange}
            placeholder="Enter category ID"
            min="1"
          />
          <button
            type="submit"
            disabled={deleteCategory.isPending || !deleteId.trim()}
          >
            Delete Category
          </button>
        </form>
      ) : (
        <div className="confirmation-dialog">
          <h2>⚠️ Confirm Deletion</h2>
          <p>
            Are you sure you want to delete category with ID{" "}
            <strong>{deleteId}</strong>?
          </p>
          <p style={{ color: "red" }}>This action cannot be undone!</p>
          <div className="button-group">
            <button
              onClick={handleConfirmDelete}
              disabled={deleteCategory.isPending}
              style={{ backgroundColor: "red", color: "white" }}
            >
              {deleteCategory.isPending ? "Deleting..." : "Yes, Delete"}
            </button>
            <button
              onClick={handleCancelDelete}
              disabled={deleteCategory.isPending}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {deleteCategory.isSuccess && (
        <div style={{ color: "green", marginTop: "1rem" }}>
          <h3>Success!</h3>
          <p>✅ Category deleted successfully!</p>
        </div>
      )}

      {deleteCategory.isError && (
        <div style={{ color: "red", marginTop: "1rem" }}>
          <h3>Error</h3>
          <p>
            Error deleting categories:{" "}
            {typeof deleteCategory.error?.response?.data === "string"
              ? deleteCategory.error.response.data
              : deleteCategory.error?.response?.data?.title ||
                deleteCategory.error?.message}
          </p>
        </div>
      )}
    </div>
  );
}

export default DeleteCategory;

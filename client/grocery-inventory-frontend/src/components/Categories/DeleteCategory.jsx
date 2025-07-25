import { useState } from "react";
import { useDeleteCategory } from "../../hooks/useCategories";

function DeleteCategory() {
  const [categoryID, setCategoryID] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errorID, setErrorID] = useState("");
  const deleteCategory = useDeleteCategory();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!categoryID.trim()) return;
    setShowConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteCategory.mutateAsync(parseInt(categoryID));
      setCategoryID("");
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
    setCategoryID(e.target.value);
    if (e.target.value === "") {
      setErrorID("");
    } else if (e.target.value <= 0) {
      setErrorID("⚠️ ID must be 1 or greater.");
    } else {
      setErrorID("");
    }
  };

  return (
    <div className="component-main-div">
      <h1>🗑️ Delete Category</h1>

      {!showConfirmation ? (
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            name="deleteId"
            value={categoryID}
            onChange={handleInputChange}
            placeholder="Enter category ID (eg. 12)"
            min={1}
          />
          {errorID && <div className="error-details">{errorID}</div>}
          <button
            type="submit"
            disabled={deleteCategory.isPending || !categoryID.trim()}
          >
            Delete Category
          </button>
        </form>
      ) : (
        <div className="confirmation-dialog">
          <h2>⚠️ Confirm Deletion</h2>
          <p>
            Are you sure you want to delete category with ID{" "}
            <strong>{categoryID}</strong>?
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

import { useState } from "react";
import { useDeleteCategory } from "../../hooks/useCategories";
import { getErrorMessage, getErrorStyling } from "../../utils/errorHandler";
import { isUserAdmin } from "../../utils/authUtils";

function DeleteCategory() {
  const [categoryID, setCategoryID] = useState("");
  const [errorID, setErrorID] = useState("");
  const deleteCategory = useDeleteCategory();
  const isAdmin = isUserAdmin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryID.trim()) return;
    try {
      await deleteCategory.mutateAsync(parseInt(categoryID));
      setCategoryID("");
      console.log("Category deleted successfully!");
    } catch (error) {
      console.error("Failed to delete category: ", error);
    }
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setCategoryID(value);
    if (!value) setErrorID("");
    else if (value <= 0) setErrorID("⚠️ ID must be 1 or greater.");
    else setErrorID("");
  };

  return (
    <div
      className={`max-w-xl mx-auto bg-white shadow-md rounded-xl p-6 mt-8 border border-gray-200 space-y-6 ${
        !isAdmin ? "opacity-50" : ""
      }`}
    >
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        🗑️ Delete Category
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
            delete categories.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="categoryID"
            className="block text-sm font-medium text-gray-700"
          >
            Category ID
          </label>
          <input
            type="number"
            name="categoryID"
            value={categoryID}
            onChange={handleInputChange}
            placeholder="Enter Category ID to delete (e.g. 12)"
            min={1}
            disabled={!isAdmin}
            className={`w-full px-4 py-2 border ${
              errorID ? "border-red-500" : "border-gray-300"
            } rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
              !isAdmin ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
          {errorID && <p className="text-sm text-red-600 mt-1">{errorID}</p>}
        </div>

        <button
          type="submit"
          disabled={
            !isAdmin ||
            deleteCategory.isPending ||
            !categoryID.trim() ||
            errorID
          }
          className={`w-full py-2 px-4 rounded-lg transition ${
            isAdmin
              ? "bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              : "bg-gray-400 text-gray-600 cursor-not-allowed"
          }`}
        >
          {deleteCategory.isPending ? "Deleting..." : "Delete Category"}
        </button>
      </form>

      {deleteCategory.isSuccess && (
        <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded-lg shadow-sm">
          <strong className="text-green-800 text-base flex items-center gap-2">
            ✅ Category deleted successfully!
          </strong>
        </div>
      )}

      {deleteCategory.isError && (
        <div
          className={`p-4 border rounded-lg mt-6 ${
            getErrorStyling(deleteCategory.error).container
          }`}
        >
          <p className="flex items-center gap-2">
            {getErrorStyling(deleteCategory.error).icon} Error deleting
            category:{" "}
            {getErrorMessage(deleteCategory.error, "deleting", "category")}
          </p>
        </div>
      )}
    </div>
  );
}

export default DeleteCategory;

import { useState } from "react";
import { usePostCategory } from "../../hooks/useCategories";
import { getErrorMessage, getErrorStyling } from "../../utils/errorHandler";
import { isUserAdmin } from "../../utils/authUtils";

function PostCategory() {
  const [categoryName, setCategoryName] = useState("");
  const [errorName, setErrorName] = useState("");
  const postCategory = usePostCategory();
  const isAdmin = isUserAdmin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    try {
      await postCategory.mutateAsync({
        categoryName: categoryName.trim(),
      });
      setCategoryName("");
      console.log("Category posted successfully!");
    } catch (error) {
      console.error("Failed to post category: ", error);
    }
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setCategoryName(value);
    if (!value) setErrorName("");
    else if (value.length < 2)
      setErrorName("⚠️ Name must be at least 2 characters");
    else if (value.length > 100)
      setErrorName("⚠️ Name cannot exceed 100 characters");
    else setErrorName("");
  };

  return (
    <div
      className={`max-w-xl mx-auto bg-white shadow-md rounded-xl p-6 mt-8 border border-gray-200 space-y-6 ${
        !isAdmin ? "opacity-50" : ""
      }`}
    >
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        ➕ Post Category
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
            create categories.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="categoryName"
            className="block text-sm font-medium text-gray-700"
          >
            Category Name
          </label>
          <input
            type="text"
            name="categoryName"
            minLength={2}
            maxLength={100}
            value={categoryName}
            onChange={handleInputChange}
            placeholder="Enter Category Name (e.g. Milk)"
            disabled={!isAdmin}
            className={`w-full px-4 py-2 border ${
              errorName ? "border-red-500" : "border-gray-300"
            } rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
              !isAdmin ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
          {errorName && (
            <p className="text-sm text-red-600 mt-1">{errorName}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={
            !isAdmin ||
            postCategory.isPending ||
            !categoryName.trim() ||
            errorName
          }
          className={`w-full py-2 px-4 rounded-lg transition ${
            isAdmin
              ? "bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              : "bg-gray-400 text-gray-600 cursor-not-allowed"
          }`}
        >
          {postCategory.isPending ? "Posting..." : "Post Category"}
        </button>
      </form>

      {postCategory.isSuccess && (
        <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded-lg shadow-sm">
          <strong className="text-green-800 text-base flex items-center gap-2">
            ✅ Category created successfully!
          </strong>

          {postCategory.data && (
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full text-sm text-left border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-green-100 text-green-900 uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-4 py-3 border-b border-gray-300">
                      Category Name
                    </th>
                    <th className="px-4 py-3 border-b border-gray-300">ID</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr className="hover:bg-green-50 transition">
                    <td className="px-4 py-3 border-b border-gray-200 font-medium text-gray-800">
                      {postCategory.data.categoryName}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 text-gray-700">
                      {postCategory.data.categoryID}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {postCategory.isError && (
        <div
          className={`p-4 border rounded-lg mt-6 ${
            getErrorStyling(postCategory.error).container
          }`}
        >
          <p className="flex items-center gap-2">
            {getErrorStyling(postCategory.error).icon} Error creating category:{" "}
            {getErrorMessage(postCategory.error, "creating", "category")}
          </p>
        </div>
      )}
    </div>
  );
}

export default PostCategory;

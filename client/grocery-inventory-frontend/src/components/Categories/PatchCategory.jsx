import { useState } from "react";
import { usePatchCategory } from "../../hooks/useCategories";
import { getErrorMessage, getErrorStyling } from "../../utils/errorHandler";
import { isUserAdmin } from "../../utils/authUtils";

function PatchCategory() {
  const [categoryID, setCategoryID] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [errorName, setErrorName] = useState("");
  const [errorID, setErrorID] = useState("");
  const patchCategory = usePatchCategory();
  const isAdmin = isUserAdmin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryID.trim() || !categoryName.trim()) return;
    try {
      await patchCategory.mutateAsync({
        id: parseInt(categoryID),
        data: {
          categoryName: categoryName.trim(),
        },
      });
      setCategoryID("");
      setCategoryName("");
      console.log("Category patched successfully!");
    } catch (error) {
      console.error("Failed to patch category: ", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "categoryName") {
      setCategoryName(value);
      if (!value) setErrorName("");
      else if (value.length < 2)
        setErrorName("⚠️ Name must be at least 2 characters");
      else if (value.length > 100)
        setErrorName("⚠️ Name cannot exceed 100 characters");
      else setErrorName("");
    }

    if (name === "categoryID") {
      setCategoryID(value);
      if (!value) setErrorID("");
      else if (value <= 0) setErrorID("⚠️ ID must be 1 or greater.");
      else setErrorID("");
    }
  };

  return (
    <div
      className={`max-w-xl mx-auto bg-white shadow-md rounded-xl p-6 mt-8 border border-gray-200 space-y-6 ${
        !isAdmin ? "opacity-50" : ""
      }`}
    >
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        ✏️ Patch Category
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
            modify categories.
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
            placeholder="Enter Category ID (e.g. 12)"
            min={1}
            disabled={!isAdmin}
            className={`w-full px-4 py-2 border ${
              errorID ? "border-red-500" : "border-gray-300"
            } rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
              !isAdmin ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
          {errorID && <p className="text-sm text-red-600 mt-1">{errorID}</p>}
        </div>

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
            patchCategory.isPending ||
            !categoryID.trim() ||
            !categoryName.trim() ||
            errorID ||
            errorName
          }
          className={`w-full py-2 px-4 rounded-lg transition ${
            isAdmin
              ? "bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              : "bg-gray-400 text-gray-600 cursor-not-allowed"
          }`}
        >
          {patchCategory.isPending ? "Patching..." : "Patch Category"}
        </button>
      </form>

      {patchCategory.isSuccess && (
        <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded-lg shadow-sm">
          <strong className="text-green-800 text-base flex items-center gap-2">
            ✅ Category updated successfully!
          </strong>

          {patchCategory.data && (
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
                      {patchCategory.data.categoryName}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 text-gray-700">
                      {patchCategory.data.categoryID}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {patchCategory.isError && (
        <div
          className={`p-4 border rounded-lg mt-6 ${
            getErrorStyling(patchCategory.error).container
          }`}
        >
          <p className="flex items-center gap-2">
            {getErrorStyling(patchCategory.error).icon} Error updating category:{" "}
            {getErrorMessage(patchCategory.error, "updating", "category")}
          </p>
        </div>
      )}
    </div>
  );
}

export default PatchCategory;

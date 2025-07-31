import { useState } from "react";
import { useGetSpecificCategory } from "../../hooks/useCategories";
import { getErrorMessage, getErrorStyling } from "../../utils/errorHandler";

function GetSpecificCategory() {
  const [searchId, setSearchId] = useState("");
  const [currentId, setCurrentId] = useState(null);
  const [errorID, setErrorID] = useState("");
  const {
    data: category,
    isLoading,
    error,
  } = useGetSpecificCategory(currentId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchId.trim()) {
      setCurrentId(parseInt(searchId));
    }
  };

  const handleInputChange = (e) => {
    setSearchId(e.target.value);
    if (e.target.value === "") {
      setErrorID("");
    } else if (e.target.value <= 0) {
      setErrorID("⚠️ ID must be 1 or greater.");
    } else {
      setErrorID("");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-6 mt-8 border border-gray-200 space-y-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">
        🔍 Search Category
      </h1>
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
            id="categoryID"
            name="categoryID"
            value={searchId}
            onChange={handleInputChange}
            placeholder="e.g. 12"
            min={1}
            className={`w-full px-4 py-2 border ${
              errorID ? "border-red-500" : "border-gray-300"
            } rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500`}
          />
          {errorID && <p className="text-red-600 text-sm mt-1">{errorID}</p>}
        </div>

        <button
          type="submit"
          disabled={!searchId.trim()}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md disabled:opacity-50"
        >
          Search Category
        </button>
      </form>

      {currentId && (
        <div className="mt-6">
          {isLoading && <p className="text-gray-600">Loading category...</p>}

          {error && (
            <div
              className={`p-3 mt-4 rounded-md border ${
                getErrorStyling(error).container
              }`}
            >
              <p className="font-semibold">Error loading category:</p>
              <p>{getErrorMessage(error, "loading", "category")}</p>
            </div>
          )}

          {!isLoading && !error && category && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-green-700 mb-2">
                ✅ Category Found:
              </h2>
              <table className="w-full table-auto border-collapse border border-gray-300 rounded overflow-hidden text-left text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">
                      Category Name
                    </th>
                    <th className="border border-gray-300 px-4 py-2">ID</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-medium">
                      {category.categoryName}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {category.categoryID}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GetSpecificCategory;

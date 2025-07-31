import { useState } from "react";
import { useGetAllCategories } from "../../hooks/useCategories";
import { getErrorMessage, getErrorStyling } from "../../utils/errorHandler";
import { isUserAuthenticated } from "../../utils/authUtils";

function GetAllCategories() {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const {
    data: paginatedData,
    isLoading,
    error,
  } = useGetAllCategories(pageNumber, pageSize);

  // Debug logging
  console.log("GetAllCategories Debug:", {
    pageNumber,
    pageSize,
    paginatedData,
    isLoading,
    error,
    hasToken: !!localStorage.getItem("token"),
    isAuthenticated: isUserAuthenticated(),
  });

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const handleNextPage = () => {
    if (paginatedData?.hasNextPage) {
      setPageNumber(pageNumber + 1);
    }
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPageNumber(1); // Reset to first page when changing page size
  };

  // Check if user is authenticated
  if (!isUserAuthenticated()) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-300 rounded-2xl shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
          📦 All Categories
        </h1>
        <div className="text-yellow-800">
          <p className="mb-2">🔐 You need to log in to view categories.</p>
          <p className="text-sm mb-4">
            The API requires authentication. Please log in first.
          </p>
          <a
            href="/auth-test"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Go to Login Page
          </a>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-2xl shadow-md text-gray-700">
        <p>🔄 Loading categories...</p>
      </div>
    );
  }

  if (error) {
    const errorStyling = getErrorStyling(error);
    return (
      <div
        className={`p-6 border rounded-2xl shadow-md ${errorStyling.container}`}
      >
        <p>
          {errorStyling.icon} Error loading categories:{" "}
          {getErrorMessage(error, "loading", "category")}
        </p>
        {/* Debug error details */}
        <details className="mt-2 text-xs">
          <summary>Debug Info</summary>
          <pre className="mt-1 p-2 bg-gray-100 rounded overflow-auto">
            {JSON.stringify(error, null, 2)}
          </pre>
        </details>
      </div>
    );
  }

  // Extract data and pagination info from the response
  const categories = paginatedData?.data || [];
  const pagination = {
    totalCount: paginatedData?.totalCount || 0,
    pageNumber: paginatedData?.pageNumber || 1,
    pageSize: paginatedData?.pageSize || 20,
    totalPages: paginatedData?.totalPages || 1,
    hasPreviousPage: paginatedData?.hasPreviousPage || false,
    hasNextPage: paginatedData?.hasNextPage || false,
    previousPageNumber: paginatedData?.previousPageNumber || 0,
    nextPageNumber: paginatedData?.nextPageNumber || 0,
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md space-y-4">
      <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
        📦 All Categories
      </h1>

      {/* Page Size Selector */}
      <div className="flex items-center gap-4">
        <label className="text-sm text-gray-600">Items per page:</label>
        <select
          value={pageSize}
          onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      {/* Pagination Info */}
      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
        <p>
          Showing {categories.length} of {pagination.totalCount} categories
          (Page {pagination.pageNumber} of {pagination.totalPages})
        </p>
      </div>

      {categories.length === 0 ? (
        <p className="text-gray-600 italic">
          No categories found in the database.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-xl overflow-hidden text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-800 text-sm uppercase">
              <tr>
                <th className="px-4 py-3 border-b">Category Name</th>
                <th className="px-4 py-3 border-b">ID</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr
                  key={category.categoryID}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 border-b font-medium">
                    {category.categoryName}
                  </td>
                  <td className="px-4 py-3 border-b">{category.categoryID}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Page {pagination.pageNumber} of {pagination.totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={!pagination.hasPreviousPage}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={!pagination.hasNextPage}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GetAllCategories;

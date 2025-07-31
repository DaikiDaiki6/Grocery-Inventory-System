import { useState } from "react";
import { useGetAllInventories } from "../../hooks/useInventories";
import { getErrorMessage, getErrorStyling } from "../../utils/errorHandler";

function GetAllInventories() {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const {
    data: paginatedData,
    isLoading,
    error,
  } = useGetAllInventories(pageNumber, pageSize);

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

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-2xl shadow-md text-gray-700">
        <p>🔄 Loading inventories...</p>
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
          {errorStyling.icon} Error loading inventories:{" "}
          {getErrorMessage(error, "loading", "inventory")}
        </p>
      </div>
    );
  }

  // Extract data and pagination info from the response
  const inventories = paginatedData?.data || [];
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
        📦 All Inventories
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
          Showing {inventories.length} of {pagination.totalCount} inventories
          (Page {pagination.pageNumber} of {pagination.totalPages})
        </p>
      </div>

      {inventories.length === 0 ? (
        <p className="text-gray-600 italic">
          No inventories found in the database.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-xl overflow-hidden text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-800 text-sm uppercase">
              <tr>
                <th className="px-4 py-3 border-b">ID</th>
                <th className="px-4 py-3 border-b">Stock Qty</th>
                <th className="px-4 py-3 border-b">Reorder Lvl</th>
                <th className="px-4 py-3 border-b">Unit Price</th>
                <th className="px-4 py-3 border-b">Status</th>
                <th className="px-4 py-3 border-b">Product</th>
                <th className="px-4 py-3 border-b">Warehouse</th>
              </tr>
            </thead>
            <tbody>
              {inventories.map((inv) => (
                <tr
                  key={inv.inventoryID}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 border-b font-medium">
                    {inv.inventoryID}
                  </td>
                  <td className="px-4 py-3 border-b">{inv.stockQuantity}</td>
                  <td className="px-4 py-3 border-b">{inv.reorderLevel}</td>
                  <td className="px-4 py-3 border-b">{inv.unitPrice}</td>
                  <td className="px-4 py-3 border-b">{inv.status}</td>
                  <td className="px-4 py-3 border-b">
                    {inv.productName} ({inv.productID})
                  </td>
                  <td className="px-4 py-3 border-b">
                    {inv.warehouseName} ({inv.warehouseID})
                  </td>
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

export default GetAllInventories;

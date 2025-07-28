import { useGetAllInventories } from "../../hooks/useInventories";

function GetAllInventories() {
  const { data: inventories, isLoading, error } = useGetAllInventories();

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-2xl shadow-md text-gray-700">
        <p>🔄 Loading inventories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-100 text-red-700 rounded-2xl shadow-md">
        <p>
          ❌ Error loading inventories:{" "}
          {typeof error?.response?.data === "string"
            ? error.response.data
            : error?.response?.data?.title || error?.message}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md space-y-4">
      <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
        📋 All Inventories
      </h1>

      {inventories?.length === 0 ? (
        <p className="text-gray-600 italic">No inventories found in the database.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-xl overflow-hidden text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-800 text-sm uppercase">
              <tr>
                <th className="px-4 py-3 border-b">Inventory ID</th>
                <th className="px-4 py-3 border-b">Stock Quantity</th>
                <th className="px-4 py-3 border-b">Reorder Level</th>
                <th className="px-4 py-3 border-b">Reorder Qty</th>
                <th className="px-4 py-3 border-b">Unit Price</th>
                <th className="px-4 py-3 border-b">Date Received</th>
                <th className="px-4 py-3 border-b">Last Order</th>
                <th className="px-4 py-3 border-b">Expiry</th>
                <th className="px-4 py-3 border-b">Sales Volume</th>
                <th className="px-4 py-3 border-b">Turnover Rate</th>
                <th className="px-4 py-3 border-b">Status</th>
                <th className="px-4 py-3 border-b">Product</th>
                <th className="px-4 py-3 border-b">Warehouse</th>
              </tr>
            </thead>
            <tbody>
              {inventories.map((inv) => (
                <tr key={inv.inventoryID} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 border-b font-medium">{inv.inventoryID}</td>
                  <td className="px-4 py-3 border-b">{inv.stockQuantity}</td>
                  <td className="px-4 py-3 border-b">{inv.reorderLevel}</td>
                  <td className="px-4 py-3 border-b">{inv.reorderQuantity}</td>
                  <td className="px-4 py-3 border-b">{inv.unitPrice}</td>
                  <td className="px-4 py-3 border-b">{inv.dateReceived}</td>
                  <td className="px-4 py-3 border-b">{inv.lastOrderDate}</td>
                  <td className="px-4 py-3 border-b">{inv.expirationDate}</td>
                  <td className="px-4 py-3 border-b">{inv.salesVolume}</td>
                  <td className="px-4 py-3 border-b">{inv.inventoryTurnoverRate}</td>
                  <td className="px-4 py-3 border-b">{inv.status}</td>
                  <td className="px-4 py-3 border-b">{inv.productName} ({inv.productID})</td>
                  <td className="px-4 py-3 border-b">{inv.warehouseName} ({inv.warehouseID})</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default GetAllInventories;

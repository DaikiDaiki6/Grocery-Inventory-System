import { useState } from "react";
import { useGetSpecificInventory } from "../../hooks/useInventories";

function GetSpecificInventory() {
  const [searchId, setSearchId] = useState("");
  const [currentId, setCurrentId] = useState(null);
  const [errorID, setErrorID] = useState("");
  const {
    data: inventory,
    isLoading,
    error,
  } = useGetSpecificInventory(currentId);

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
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6 mt-8 border border-gray-200 space-y-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">📦 Search Inventory</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="inventoryID" className="block text-sm font-medium text-gray-700">
            Inventory ID
          </label>
          <input
            type="number"
            id="inventoryID"
            name="inventoryID"
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
          Search Inventory
        </button>
      </form>

      {currentId && (
        <div className="mt-6">
          {isLoading && <p className="text-gray-600">Loading inventory...</p>}

          {error && (
            <div className="text-red-600 bg-red-50 p-3 mt-4 rounded-md border border-red-300">
              <p className="font-semibold">Error loading inventory:</p>
              <p>
                {typeof error.response?.data === "string"
                  ? error.response.data
                  : error.response?.data?.title || error.message}
              </p>
            </div>
          )}

          {!isLoading && !error && inventory && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-green-700 mb-2">
                ✅ Inventory Found:
              </h2>
              <table className="w-full table-auto border-collapse border border-gray-300 rounded overflow-hidden text-left text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Field</th>
                    <th className="border border-gray-300 px-4 py-2">Value</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr><td className="border px-4 py-2">ID</td><td className="border px-4 py-2">{inventory.inventoryID}</td></tr>
                  <tr><td className="border px-4 py-2">Stock Qty</td><td className="border px-4 py-2">{inventory.stockQuantity}</td></tr>
                  <tr><td className="border px-4 py-2">Reorder Lvl</td><td className="border px-4 py-2">{inventory.reorderLevel}</td></tr>
                  <tr><td className="border px-4 py-2">Reorder Qty</td><td className="border px-4 py-2">{inventory.reorderQuantity}</td></tr>
                  <tr><td className="border px-4 py-2">Unit Price</td><td className="border px-4 py-2">{inventory.unitPrice}</td></tr>
                  <tr><td className="border px-4 py-2">Date Received</td><td className="border px-4 py-2">{inventory.dateReceived}</td></tr>
                  <tr><td className="border px-4 py-2">Last Order</td><td className="border px-4 py-2">{inventory.lastOrderDate}</td></tr>
                  <tr><td className="border px-4 py-2">Expiration</td><td className="border px-4 py-2">{inventory.expirationDate}</td></tr>
                  <tr><td className="border px-4 py-2">Sales Volume</td><td className="border px-4 py-2">{inventory.salesVolume}</td></tr>
                  <tr><td className="border px-4 py-2">Turnover Rate</td><td className="border px-4 py-2">{inventory.inventoryTurnoverRate}</td></tr>
                  <tr><td className="border px-4 py-2">Status</td>
                    <td className="border px-4 py-2">
                      {inventory.status === 0 && "Active"}
                      {inventory.status === 1 && "BackOrdered"}
                      {inventory.status === 2 && "Discontinued"}
                    </td>
                  </tr>
                  <tr><td className="border px-4 py-2">Product</td>
                    <td className="border px-4 py-2">
                      {inventory.product
                        ? `${inventory.product.productID} - ${inventory.product.productName}`
                        : "N/A"}
                    </td>
                  </tr>
                  <tr><td className="border px-4 py-2">Warehouse</td>
                    <td className="border px-4 py-2">
                      {inventory.warehouse
                        ? `${inventory.warehouse.warehouseID} - ${inventory.warehouse.warehouseName}`
                        : "N/A"}
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

export default GetSpecificInventory;

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
    <div className="inventory">
      <h1>📦 Search Inventory</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="inventoryID"
          value={searchId}
          onChange={handleInputChange}
          placeholder="Enter Inventory ID (eg. 12)"
          min={1}
        />
        {errorID && <div className="error-details">{errorID}</div>}
        <button type="submit" disabled={!searchId.trim()}>
          Search Inventory
        </button>
      </form>

      {currentId && (
        <div className="inventory-details">
          {isLoading && <p>Loading inventory...</p>}
          {error && (
            <p>
              Error Loading inventory:{" "}
              {typeof error.response?.data === "string"
                ? error.response.data
                : error.response?.data?.title || error.message}
            </p>
          )}

          {!isLoading && !error && inventory && (
            <div className="inventory-info">
              <table>
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>ID</td>
                    <td>{inventory.inventoryID}</td>
                  </tr>
                  <tr>
                    <td>Stock Qty</td>
                    <td>{inventory.stockQuantity}</td>
                  </tr>
                  <tr>
                    <td>Reorder Lvl</td>
                    <td>{inventory.reorderLevel}</td>
                  </tr>
                  <tr>
                    <td>Reorder Qty</td>
                    <td>{inventory.reorderQuantity}</td>
                  </tr>
                  <tr>
                    <td>Unit Price</td>
                    <td>{inventory.unitPrice}</td>
                  </tr>
                  <tr>
                    <td>Date Received</td>
                    <td>{inventory.dateReceived}</td>
                  </tr>
                  <tr>
                    <td>Last Order</td>
                    <td>{inventory.lastOrderDate}</td>
                  </tr>
                  <tr>
                    <td>Expiration</td>
                    <td>{inventory.expirationDate}</td>
                  </tr>
                  <tr>
                    <td>Sales Volume</td>
                    <td>{inventory.salesVolume}</td>
                  </tr>
                  <tr>
                    <td>Turnover Rate</td>
                    <td>{inventory.inventoryTurnoverRate}</td>
                  </tr>
                  <tr>
                    <td>Status</td>
                    <td>
                      {inventory.status === 0 && "Active"}
                      {inventory.status === 1 && "BackOrdered"}
                      {inventory.status === 2 && "Discontinued"}
                    </td>
                  </tr>
                  <tr>
                    <td>Product</td>
                    <td>
                      {inventory.product
                        ? `${inventory.product.productID} - ${inventory.product.productName}`
                        : "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td>Warehouse</td>
                    <td>
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

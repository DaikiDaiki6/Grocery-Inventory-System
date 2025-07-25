import { useState } from "react";
import { useGetSpecificInventory } from "../../hooks/useInventories";

function GetSpecificInventory() {
  const [searchId, setSearchId] = useState("");
  const [currentId, setCurrentId] = useState(null);
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
          placeholder="Enter Inventory ID..."
          min={1}
        />
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
              {error.message || error.response?.data?.title}
            </p>
          )}

          {!isLoading && !error && inventory && (
            <div className="inventory-info">
              <p>
                <strong>ID:</strong> {inventory.inventoryID}
              </p>
              <p>
                <strong>Stock Quantity:</strong> {inventory.stockQuantity}
              </p>
              <p>
                <strong>Reorder Level:</strong> {inventory.reorderLevel}
              </p>
              <p>
                <strong>Reorder Quantity:</strong> {inventory.reorderQuantity}
              </p>
              <p>
                <strong>Unit Price:</strong> {inventory.unitPrice}
              </p>
              <p>
                <strong>Date Received:</strong> {inventory.dateReceived}
              </p>
              <p>
                <strong>Last Order Date:</strong> {inventory.lastOrderDate}
              </p>
              <p>
                <strong>Expiration Date:</strong> {inventory.expirationDate}
              </p>
              <p>
                <strong>Sales Volume:</strong> {inventory.salesVolume}
              </p>
              <p>
                <strong>Inventory Turnover Rate:</strong>{" "}
                {inventory.inventoryTurnoverRate}
              </p>
              <p>
                <strong>Status:</strong> {inventory.status}
              </p>
              <p>
                <strong>Product:</strong>{" "}
                {inventory.product
                  ? `${inventory.product.productID} - ${inventory.product.productName}`
                  : "N/A"}
              </p>
              <p>
                <strong>Warehouse:</strong>{" "}
                {inventory.warehouse
                  ? `${inventory.warehouse.warehouseID} - ${inventory.warehouse.warehouseName}`
                  : "N/A"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GetSpecificInventory;

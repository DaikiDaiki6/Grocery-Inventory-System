import { useGetAllInventories } from "../../hooks/useInventories";

function GetAllInventories() {
  const { data: inventories, isLoading, error } = useGetAllInventories();

  if (isLoading) {
    return <div>Loading inventories...</div>;
  }

  if (error) {
    return <div>Error Loading inventories: {error.message}</div>;
  }

  return (
    <div className="inventories">
      <h1>📦 Inventories</h1>

      <div className="list">
        {inventories?.length === 0 ? (
          <p>No inventories found in the database.</p>
        ) : (
          inventories?.map((inv) => (
            <div key={inv.inventoryID} className="list-item">
              <div>
                <strong>ID:</strong> {inv.inventoryID} <br />
                <strong>Stock Quantity:</strong> {inv.stockQuantity} <br />
                <strong>Reorder Level:</strong> {inv.reorderLevel} <br />
                <strong>Reorder Quantity:</strong> {inv.reorderQuantity} <br />
                <strong>Unit Price:</strong> {inv.unitPrice} <br />
                <strong>Date Received:</strong> {inv.dateReceived} <br />
                <strong>Last Order Date:</strong> {inv.lastOrderDate} <br />
                <strong>Expiration Date:</strong> {inv.expirationDate} <br />
                <strong>Sales Volume:</strong> {inv.salesVolume} <br />
                <strong>Inventory Turnover Rate:</strong>{" "}
                {inv.inventoryTurnoverRate} <br />
                <strong>Status:</strong> {inv.status} <br />
                <strong>Product ID:</strong> {inv.productID} <br />
                <strong>Warehouse ID:</strong> {inv.warehouseID} <br />
                <strong>Product Name:</strong> {inv.productName} <br />
                <strong>Warehouse Name:</strong> {inv.warehouseName}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default GetAllInventories;

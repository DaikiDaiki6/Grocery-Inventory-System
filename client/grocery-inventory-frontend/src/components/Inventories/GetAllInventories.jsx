import { useGetAllInventories } from "../../hooks/useInventories";

function GetAllInventories() {
  const { data: inventories, isLoading, error } = useGetAllInventories();

  if (isLoading) {
    return <div>Loading inventories...</div>;
  }

  if (error) {
    return (
      <div>
        Error Loading inventories:{" "}
        {typeof error?.response?.data === "string"
          ? error.response.data
          : error?.response?.data?.title ||
            error?.message}
      </div>
    );
  }

  return (
    <div className="inventories">
      <h1>📋 All Inventories</h1>

      <div className="list">
        <table>
          <thead>
            <tr>
              <th>Inventory ID</th>
              <th>Stock Quantity</th>
              <th>Reorder Level</th>
              <th>Reorder Quantity</th>
              <th>Unit Price</th>
              <th>Date Received</th>
              <th>Last Order Date</th>
              <th>Expiration Date</th>
              <th>Sales Volume</th>
              <th>Turnover Rate</th>
              <th>Status</th>
              <th>Product ID</th>
              <th>Warehouse ID</th>
              <th>Product Name</th>
              <th>Warehouse Name</th>
            </tr>
          </thead>
          <tbody>
            {inventories?.length === 0 ? (
              <tr>
                <td>No inventories found in the database.</td>
              </tr>
            ) : (
              inventories.map((inv) => (
                <tr key={inv.inventoryID}>
                  <td>{inv.inventoryID}</td>
                  <td>{inv.stockQuantity}</td>
                  <td>{inv.reorderLevel}</td>
                  <td>{inv.reorderQuantity}</td>
                  <td>{inv.unitPrice}</td>
                  <td>{inv.dateReceived}</td>
                  <td>{inv.lastOrderDate}</td>
                  <td>{inv.expirationDate}</td>
                  <td>{inv.salesVolume}</td>
                  <td>{inv.inventoryTurnoverRate}</td>
                  <td>{inv.status}</td>
                  <td>{inv.productID}</td>
                  <td>{inv.warehouseID}</td>
                  <td>{inv.productName}</td>
                  <td>{inv.warehouseName}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GetAllInventories;

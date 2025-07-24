import { useState } from "react";
import { usePostInventory } from "../../hooks/useInventories";

function PostInventory() {
  const [formData, setFormData] = useState({
    stockQuantity: "",
    reorderLevel: "",
    reorderQuantity: "",
    unitPrice: "",
    dateReceived: "",
    lastOrderDate: "",
    expirationDate: "",
    salesVolume: "",
    inventoryTurnoverRate: "",
    status: "",
    productID: "",
    warehouseID: "",
  });

  const createInventory = usePostInventory();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Optionally validate all fields here
    if (!formData.productID.trim() || !formData.warehouseID) return;

    try {
      await createInventory.mutateAsync({
        ...formData,
        stockQuantity: parseInt(formData.stockQuantity),
        reorderLevel: parseInt(formData.reorderLevel),
        reorderQuantity: parseInt(formData.reorderQuantity),
        unitPrice: parseFloat(formData.unitPrice),
        salesVolume: parseInt(formData.salesVolume),
        inventoryTurnoverRate: parseInt(formData.inventoryTurnoverRate),
        status: parseInt(formData.status),
        warehouseID: parseInt(formData.warehouseID),
      });
      console.log("Inventory created!");
      setFormData({
        stockQuantity: "",
        reorderLevel: "",
        reorderQuantity: "",
        unitPrice: "",
        dateReceived: "",
        lastOrderDate: "",
        expirationDate: "",
        salesVolume: "",
        inventoryTurnoverRate: "",
        status: "",
        productID: "",
        warehouseID: "",
      });
    } catch (error) {
      console.error("Failed to create inventory: ", error);
    }
  };

  return (
    <div className="inventory">
      <h1>📦 Create Inventory</h1>
      <form onSubmit={handleSubmit}>
        {[
          "stockQuantity",
          "reorderLevel",
          "reorderQuantity",
          "unitPrice",
          "dateReceived",
          "lastOrderDate",
          "expirationDate",
          "salesVolume",
          "inventoryTurnoverRate",
          "status",
          "productID",
          "warehouseID",
        ].map((field) => (
          <input
            key={field}
            type={
              field.includes("Date") || field.includes("date")
                ? "date"
                : field === "unitPrice"
                ? "number"
                : "text"
            }
            name={field}
            value={formData[field]}
            onChange={handleChange}
            placeholder={field}
          />
        ))}

        <button
          type="submit"
          disabled={
            createInventory.isPending ||
            !formData.productID.trim() ||
            !formData.warehouseID
          }
        >
          {createInventory.isPending ? "Creating..." : "Create Inventory"}
        </button>
      </form>

      {createInventory.isSuccess && (
        <div className="inventory-details">
          <h1>✅ Inventory Created</h1>
          <p>
            <strong>Inventory ID:</strong> {createInventory.data.inventoryID}
          </p>
          <p>
            <strong>Stock Quantity:</strong>{" "}
            {createInventory.data.stockQuantity}
          </p>
          <p>
            <strong>Reorder Level:</strong> {createInventory.data.reorderLevel}
          </p>
          <p>
            <strong>Reorder Quantity:</strong>{" "}
            {createInventory.data.reorderQuantity}
          </p>
          <p>
            <strong>Unit Price:</strong> ${createInventory.data.unitPrice}
          </p>
          <p>
            <strong>Date Received:</strong> {createInventory.data.dateReceived}
          </p>
          <p>
            <strong>Last Order Date:</strong>{" "}
            {createInventory.data.lastOrderDate}
          </p>
          <p>
            <strong>Expiration Date:</strong>{" "}
            {createInventory.data.expirationDate}
          </p>
          <p>
            <strong>Sales Volume:</strong> {createInventory.data.salesVolume}
          </p>
          <p>
            <strong>Inventory Turnover Rate:</strong>{" "}
            {createInventory.data.inventoryTurnoverRate}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {createInventory.data.status === 1 ? "In Stock" : "Out of Stock"}
          </p>
          <p>
            <strong>Product ID:</strong> {createInventory.data.productID}
          </p>
          <p>
            <strong>Warehouse ID:</strong> {createInventory.data.warehouseID}
          </p>
        </div>
      )}

      {createInventory.isError && (
        <div className="inventory-error">
          <h1>Error</h1>
          <p>
            {createInventory.error?.response?.data ||
              createInventory.error?.message}
          </p>
        </div>
      )}
    </div>
  );
}

export default PostInventory;

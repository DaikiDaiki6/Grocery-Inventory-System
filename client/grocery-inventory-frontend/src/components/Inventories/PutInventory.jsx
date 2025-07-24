import { useState } from "react";
import { usePutInventory } from "../../hooks/useInventories"; // New PUT hook

function PutInventory() {
  const [inventoryId, setInventoryId] = useState("");
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

  const putInventory = usePutInventory();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inventoryId.trim()) {
      alert("Inventory ID is required for PUT.");
      return;
    }

    for (const key in formData) {
      if (formData[key].toString().trim() === "") {
        alert(`Field "${key}" is required for PUT.`);
        return;
      }
    }

    const dataToSend = {};
    for (const key in formData) {
      dataToSend[key] = isNaN(formData[key])
        ? formData[key]
        : Number(formData[key]);
    }

    try {
      const result = await putInventory.mutateAsync({
        id: inventoryId.trim(),
        data: dataToSend,
      });

      setInventoryId("");
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

      console.log("Inventory replaced:", result);
    } catch (error) {
      console.error("PUT update failed:", error);
    }
  };

  return (
    <div className="inventory">
      <h1>Put Inventory</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="inventoryId"
          value={inventoryId}
          onChange={(e) => setInventoryId(e.target.value)}
          placeholder="Enter inventory ID"
        />
        {Object.entries(formData).map(([key, value]) => (
          <input
            key={key}
            type={key.includes("Date") || key.includes("date") ? "date" : key === "unitPrice" ? "number" : "text"}
            step={key === "unitPrice" ? "0.01" : undefined}
            name={key}
            value={value}
            onChange={handleChange}
            placeholder={`Enter ${key}`}
          />
        ))}
        <button
          type="submit"
          disabled={putInventory.isPending || !inventoryId.trim()}
        >
          {putInventory.isPending ? "Replacing inventory..." : "Replace Inventory"}
        </button>
      </form>

      {putInventory.isSuccess && (
        <div className="inventory-details">
          <h1>✅ Inventory Replaced</h1>
          <p><strong>Inventory ID:</strong> {putInventory.data.inventoryID}</p>
          <p><strong>Stock Quantity:</strong> {putInventory.data.stockQuantity}</p>
          <p><strong>Reorder Level:</strong> {putInventory.data.reorderLevel}</p>
          <p><strong>Reorder Quantity:</strong> {putInventory.data.reorderQuantity}</p>
          <p><strong>Unit Price:</strong> ${putInventory.data.unitPrice}</p>
          <p><strong>Date Received:</strong> {putInventory.data.dateReceived}</p>
          <p><strong>Last Order Date:</strong> {putInventory.data.lastOrderDate}</p>
          <p><strong>Expiration Date:</strong> {putInventory.data.expirationDate}</p>
          <p><strong>Sales Volume:</strong> {putInventory.data.salesVolume}</p>
          <p><strong>Inventory Turnover Rate:</strong> {putInventory.data.inventoryTurnoverRate}</p>
          <p><strong>Status:</strong> {putInventory.data.status === 1 ? "In Stock" : "Out of Stock"}</p>
          <p><strong>Product ID:</strong> {putInventory.data.productID}</p>
          <p><strong>Warehouse ID:</strong> {putInventory.data.warehouseID}</p>
        </div>
      )}
    </div>
  );
}

export default PutInventory;

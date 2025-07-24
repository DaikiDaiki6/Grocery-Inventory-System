import { useState } from "react";
import { usePatchInventory } from "../../hooks/useInventories"; 

function PatchInventory() {
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

  const patchInventory = usePatchInventory();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inventoryId.trim()) {
      alert("Inventory ID is required to update.");
      return;
    }

    const dataToSend = {};
    for (const key in formData) {
      if (formData[key].toString().trim() !== "") {
        dataToSend[key] = isNaN(formData[key])
          ? formData[key]
          : Number(formData[key]);
      }
    }

    try {
      const result = await patchInventory.mutateAsync({
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

      console.log("Inventory updated:", result);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="inventory">
      <h1>Patch Inventory</h1>
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
          disabled={patchInventory.isPending || !inventoryId.trim()}
        >
          {patchInventory.isPending ? "Updating inventory..." : "Update Inventory"}
        </button>
      </form>

      {patchInventory.isSuccess && (
        <div className="inventory-details">
          <h1>✅ Inventory Updated</h1>
          <p>
            <strong>Inventory ID:</strong> {patchInventory.data.inventoryID}
          </p>
          <p>
            <strong>Stock Quantity:</strong>{" "}
            {patchInventory.data.stockQuantity}
          </p>
          <p>
            <strong>Reorder Level:</strong> {patchInventory.data.reorderLevel}
          </p>
          <p>
            <strong>Reorder Quantity:</strong>{" "}
            {patchInventory.data.reorderQuantity}
          </p>
          <p>
            <strong>Unit Price:</strong> ${patchInventory.data.unitPrice}
          </p>
          <p>
            <strong>Date Received:</strong> {patchInventory.data.dateReceived}
          </p>
          <p>
            <strong>Last Order Date:</strong>{" "}
            {patchInventory.data.lastOrderDate}
          </p>
          <p>
            <strong>Expiration Date:</strong>{" "}
            {patchInventory.data.expirationDate}
          </p>
          <p>
            <strong>Sales Volume:</strong> {patchInventory.data.salesVolume}
          </p>
          <p>
            <strong>Inventory Turnover Rate:</strong>{" "}
            {patchInventory.data.inventoryTurnoverRate}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {patchInventory.data.status === 1 ? "In Stock" : "Out of Stock"}
          </p>
          <p>
            <strong>Product ID:</strong> {patchInventory.data.productID}
          </p>
          <p>
            <strong>Warehouse ID:</strong> {patchInventory.data.warehouseID}
          </p>
        </div>
      )}
    </div>
  );
}

export default PatchInventory;

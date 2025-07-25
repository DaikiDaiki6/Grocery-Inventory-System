import { useState } from "react";
import { usePutInventory } from "../../hooks/useInventories";
import { useFetchForeignKeys } from "./useFetchForeignKeys";

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
  const { products, warehouses, isLoading, error } = useFetchForeignKeys();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (!name.toLowerCase().includes("date")){
      if(Number(value) < 1) return;
    }
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
      dataToSend[key] =
        key === "status" || key === "inventoryTurnoverRate"
          ? Number(formData[key])
          : isNaN(formData[key])
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

      {error && (
        <p style={{ color: "red" }}>Failed to load foreign key data.</p>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="inventoryId"
          value={inventoryId}
          onChange={(e) => setInventoryId(e.target.value)}
          placeholder="Enter inventory ID"
        />

        {Object.entries(formData).map(([key, value]) => {
          if (key === "productID") {
            return (
              <select
                key={key}
                name="productID"
                value={formData.productID}
                onChange={handleChange}
              >
                <option key="" value="">
                  Select a product
                </option>
                {products.map((p) => (
                  <option key={p.productID} value={p.productID}>
                    {p.productName}
                  </option>
                ))}
              </select>
            );
          }

          if (key === "warehouseID") {
            return (
              <select
                key={key}
                name="warehouseID"
                value={formData.warehouseID}
                onChange={handleChange}
              >
                <option value="">Select a warehouse</option>
                {warehouses.map((w) => (
                  <option key={w.warehouseID} value={w.warehouseID}>
                    {w.warehouseName}
                  </option>
                ))}
              </select>
            );
          }

          if (key === "status") {
            return (
              <select
                key={key}
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="">Select status</option>
                <option value="0">Active</option>
                <option value="1">BackOrdered</option>
                <option value="2">Discontinued</option>
              </select>
            );
          }

          return (
            <input
              key={key}
              type={
                key.includes("Date") || key.includes("date") ? "date" : "number"
              }
              step={key === "unitPrice" ? "0.01" : undefined}
              min={key.toLowerCase().includes("date") ? undefined : 1}
              name={key}
              value={value}
              onChange={handleChange}
              placeholder={`Enter ${key}`}
            />
          );
        })}

        <button
          type="submit"
          disabled={putInventory.isPending || !inventoryId.trim()}
        >
          {putInventory.isPending
            ? "Replacing inventory..."
            : "Replace Inventory"}
        </button>
      </form>

      {putInventory.isSuccess && (
        <div className="inventory-details">
          <h1>✅ Inventory Replaced</h1>
          <p>
            <strong>Inventory ID:</strong> {putInventory.data.inventoryID}
          </p>
          <p>
            <strong>Stock Quantity:</strong> {putInventory.data.stockQuantity}
          </p>
          <p>
            <strong>Reorder Level:</strong> {putInventory.data.reorderLevel}
          </p>
          <p>
            <strong>Reorder Quantity:</strong>{" "}
            {putInventory.data.reorderQuantity}
          </p>
          <p>
            <strong>Unit Price:</strong> ${putInventory.data.unitPrice}
          </p>
          <p>
            <strong>Date Received:</strong> {putInventory.data.dateReceived}
          </p>
          <p>
            <strong>Last Order Date:</strong> {putInventory.data.lastOrderDate}
          </p>
          <p>
            <strong>Expiration Date:</strong> {putInventory.data.expirationDate}
          </p>
          <p>
            <strong>Sales Volume:</strong> {putInventory.data.salesVolume}
          </p>
          <p>
            <strong>Inventory Turnover Rate:</strong>{" "}
            {putInventory.data.inventoryTurnoverRate}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {putInventory.data.status === 0 && "Active"}
            {putInventory.data.status === 1 && "BackOrdered"}
            {putInventory.data.status === 2 && "Discontinued"}
          </p>
          <p>
            <strong>Product ID:</strong> {putInventory.data.productID}
          </p>
          <p>
            <strong>Warehouse ID:</strong> {putInventory.data.warehouseID}
          </p>
        </div>
      )}
    </div>
  );
}

export default PutInventory;

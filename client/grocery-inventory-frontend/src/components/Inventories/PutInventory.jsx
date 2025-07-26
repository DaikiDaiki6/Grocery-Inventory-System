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
  const [validationErrors, setValidationErrors] = useState([]);
  const putInventory = usePutInventory();
  const { products, warehouses, isLoading, error } = useFetchForeignKeys();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);

    const errors = [];

    if (!inventoryId.trim()) {
      errors.push("⚠️ Inventory ID is required to update.");
    }

    if (
      updatedFormData.stockQuantity !== "" &&
      (isNaN(updatedFormData.stockQuantity) ||
        Number(updatedFormData.stockQuantity) < 0)
    ) {
      errors.push("⚠️ Stock Quantity must be 0 or greater");
    }

    if (
      updatedFormData.reorderLevel !== "" &&
      (isNaN(updatedFormData.reorderLevel) ||
        Number(updatedFormData.reorderLevel) < 0)
    ) {
      errors.push("⚠️ Reorder Level must be 0 or greater");
    }

    if (
      updatedFormData.reorderQuantity !== "" &&
      (isNaN(updatedFormData.reorderQuantity) ||
        Number(updatedFormData.reorderQuantity) < 1)
    ) {
      errors.push("⚠️ Reorder Quantity must be greater than 0");
    }

    if (
      updatedFormData.unitPrice !== "" &&
      (isNaN(updatedFormData.unitPrice) ||
        Number(updatedFormData.unitPrice) <= 0)
    ) {
      errors.push("⚠️ Unit Price must be greater than 0");
    }

    if (
      updatedFormData.salesVolume !== "" &&
      (isNaN(updatedFormData.salesVolume) ||
        Number(updatedFormData.salesVolume) < 0)
    ) {
      errors.push("⚠️ Sales Volume must be 0 or greater");
    }

    if (
      updatedFormData.inventoryTurnoverRate !== "" &&
      (isNaN(updatedFormData.inventoryTurnoverRate) ||
        Number(updatedFormData.inventoryTurnoverRate) < 0)
    ) {
      errors.push("⚠️ Inventory Turnover Rate must be 0 or greater");
    }

    if (
      updatedFormData.status !== "" &&
      (isNaN(updatedFormData.status) ||
        ![0, 1, 2].includes(Number(updatedFormData.status)))
    ) {
      errors.push(
        "⚠️ Status must be 0 (Active), 1 (BackOrdered), or 2 (Discontinued)"
      );
    }

    if (
      updatedFormData.productID !== "" &&
      updatedFormData.productID.length !== 11
    ) {
      errors.push("⚠️ Product ID must be exactly 11 characters");
    }

    if (
      updatedFormData.warehouseID !== "" &&
      (isNaN(updatedFormData.warehouseID) ||
        Number(updatedFormData.warehouseID) < 1)
    ) {
      errors.push("⚠️ Warehouse ID must be greater than 0");
    }

    setValidationErrors(errors);
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
      <h1>✏️ Put Inventory</h1>
      {validationErrors.length > 0 && (
        <div className="validation-errors">
          {validationErrors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
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
                min={1}
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
              step={key === "unitPrice" || key === "inventoryTurnoverRate" ? "0.01" : undefined}
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
          <table>
            <thead>
              <tr>
                <th>Field</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Inventory ID</th>
                <td>{putInventory.data.inventoryID}</td>
              </tr>
              <tr>
                <th>Stock Quantity</th>
                <td>{putInventory.data.stockQuantity}</td>
              </tr>
              <tr>
                <th>Reorder Level</th>
                <td>{putInventory.data.reorderLevel}</td>
              </tr>
              <tr>
                <th>Reorder Quantity</th>
                <td>{putInventory.data.reorderQuantity}</td>
              </tr>
              <tr>
                <th>Unit Price</th>
                <td>${putInventory.data.unitPrice}</td>
              </tr>
              <tr>
                <th>Date Received</th>
                <td>{putInventory.data.dateReceived}</td>
              </tr>
              <tr>
                <th>Last Order Date</th>
                <td>{putInventory.data.lastOrderDate}</td>
              </tr>
              <tr>
                <th>Expiration Date</th>
                <td>{putInventory.data.expirationDate}</td>
              </tr>
              <tr>
                <th>Sales Volume</th>
                <td>{putInventory.data.salesVolume}</td>
              </tr>
              <tr>
                <th>Inventory Turnover Rate</th>
                <td>{putInventory.data.inventoryTurnoverRate}</td>
              </tr>
              <tr>
                <th>Status</th>
                <td>
                  {putInventory.data.status === 0 && "Active"}
                  {putInventory.data.status === 1 && "BackOrdered"}
                  {putInventory.data.status === 2 && "Discontinued"}
                </td>
              </tr>
              <tr>
                <th>Product ID</th>
                <td>{putInventory.data.productID}</td>
              </tr>
              <tr>
                <th>Warehouse ID</th>
                <td>{putInventory.data.warehouseID}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PutInventory;

import { useState } from "react";
import { usePatchInventory } from "../../hooks/useInventories";
import { useFetchForeignKeys } from "../Inventories/useFetchForeignKeys";

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
  const [validationErrors, setValidationErrors] = useState([]);
  const patchInventory = usePatchInventory();
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
      <h1>✏️ Patch Inventory</h1>
      {validationErrors.length > 0 && (
        <div className="validation-errors">
          {validationErrors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
      {isLoading ? (
        <p>Loading products and warehouses...</p>
      ) : error ? (
        <p>Error loading options: {error.message}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="inventoryId"
            min={1}
            value={inventoryId}
            onChange={(e) => setInventoryId(e.target.value)}
            placeholder="Enter inventory ID"
          />

          {Object.entries(formData)
            .filter(([key]) => key !== "productID" && key !== "warehouseID")
            .map(([key, value]) => {
              if (key === "status") {
                return (
                  <select
                    key={key}
                    name="status"
                    value={value}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: Number(e.target.value),
                      }))
                    }
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
                  type={key.toLowerCase().includes("date") ? "date" : "number"}
                  min={key.toLowerCase().includes("date") ? undefined : 1}
                  step={key === "unitPrice" ? "0.01" : undefined}
                  name={key}
                  value={value}
                  onChange={handleChange}
                  placeholder={`Enter ${key}`}
                />
              );
            })}

          <label>Product</label>
          <select
            name="productID"
            value={formData.productID}
            onChange={handleChange}
          >
            <option key="placeholder-product" value="">
              Select a product
            </option>
            {products.map((p) => (
              <option key={p.productID} value={p.productID}>
                {p.productName} (ID: {p.productID})
              </option>
            ))}
          </select>

          <label>Warehouse</label>
          <select
            name="warehouseID"
            value={formData.warehouseID}
            onChange={handleChange}
          >
            <option key="placeholder-warehouse" value="">
              Select a warehouse
            </option>
            {warehouses.map((w) => (
              <option key={w.warehouseID} value={w.warehouseID}>
                {w.warehouseName} (ID: {w.warehouseID})
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={patchInventory.isPending || !inventoryId.trim()}
          >
            {patchInventory.isPending
              ? "Updating inventory..."
              : "Update Inventory"}
          </button>
        </form>
      )}

      {patchInventory.isSuccess && (
        <div className="inventory-details">
          <strong>✅ Inventory Updated</strong>
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
                <td>{patchInventory.data.inventoryID}</td>
              </tr>
              <tr>
                <th>Stock Quantity</th>
                <td>{patchInventory.data.stockQuantity}</td>
              </tr>
              <tr>
                <th>Reorder Level</th>
                <td>{patchInventory.data.reorderLevel}</td>
              </tr>
              <tr>
                <th>Reorder Quantity</th>
                <td>{patchInventory.data.reorderQuantity}</td>
              </tr>
              <tr>
                <th>Unit Price</th>
                <td>${patchInventory.data.unitPrice}</td>
              </tr>
              <tr>
                <th>Date Received</th>
                <td>{patchInventory.data.dateReceived}</td>
              </tr>
              <tr>
                <th>Last Order Date</th>
                <td>{patchInventory.data.lastOrderDate}</td>
              </tr>
              <tr>
                <th>Expiration Date</th>
                <td>{patchInventory.data.expirationDate}</td>
              </tr>
              <tr>
                <th>Sales Volume</th>
                <td>{patchInventory.data.salesVolume}</td>
              </tr>
              <tr>
                <th>Inventory Turnover Rate</th>
                <td>{patchInventory.data.inventoryTurnoverRate}</td>
              </tr>
              <tr>
                <th>Status</th>
                <td>
                  {patchInventory.data.status === 0 && "Active"}
                  {patchInventory.data.status === 1 && "BackOrdered"}
                  {patchInventory.data.status === 2 && "Discontinued"}
                </td>
              </tr>
              <tr>
                <th>Product ID</th>
                <td>{patchInventory.data.productID}</td>
              </tr>
              <tr>
                <th>Warehouse ID</th>
                <td>{patchInventory.data.warehouseID}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PatchInventory;

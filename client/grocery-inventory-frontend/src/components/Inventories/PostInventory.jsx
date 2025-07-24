import { useState } from "react";
import { usePostInventory } from "../../hooks/useInventories";
import { useFetchForeignKeys } from "./useFetchForeignKeys";

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
  const { products, warehouses, isLoading, error } = useFetchForeignKeys();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      {isLoading ? (
        <p>Loading products and warehouses...</p>
      ) : error ? (
        <p>Error loading options: {error.message}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Input fields */}
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
          ].map((field) => (
            <input
              key={field}
              type={
                field.toLowerCase().includes("date")
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

          <label>Product</label>
          <select
            name="productID"
            value={formData.productID}
            onChange={handleChange}
          >
            <option key="" value="">Select a product</option>
            {products.map((p) => (
              <option key={p.productID} value={p.productID}>
                {p.productName}
              </option>
            ))}
          </select>

          <label>Warehouse</label>
          <select
            name="warehouseID"
            value={formData.warehouseID}
            onChange={handleChange}
          >
            <option key="" value="">Select a warehouse</option>
            {warehouses.map((w) => (
              <option key={w.warehouseID} value={w.warehouseID}>
                {w.warehouseName}
              </option>
            ))}
          </select>

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
      )}

      {createInventory.isSuccess && (
        <div className="inventory-details">
          <h1>✅ Inventory Created</h1>
          <p>
            <strong>Inventory ID:</strong> {createInventory.data.inventoryID}
          </p>
          {/* Add more fields here if needed */}
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

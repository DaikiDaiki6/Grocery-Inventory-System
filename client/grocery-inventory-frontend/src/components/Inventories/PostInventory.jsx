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

  const [validationErrors, setValidationErrors] = useState([]);
  const postInventory = usePostInventory();
  const { products, warehouses, isLoading, error } = useFetchForeignKeys();

  const getProductNameFromID = (p) => {

    const product = products.find((e) => e.productID === p);
    return product ? product.productName : "Unknown Product";
  };

  const getWarehouseNameFromID = (w) => {
    const wInt = parseInt(w);
    const warehouse = warehouses.find((w) => w.warehouseID === wInt);
    return warehouse ? warehouse.warehouseName : "Unknown Warehouse";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);

    const errors = [];

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

    if (!formData.productID.trim() || !formData.warehouseID) return;

    try {
      await postInventory.mutateAsync({
        ...formData,
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        reorderLevel: parseInt(formData.reorderLevel) || 0,
        reorderQuantity: parseInt(formData.reorderQuantity) || 0,
        unitPrice: parseFloat(formData.unitPrice) || 0,
        salesVolume: parseInt(formData.salesVolume) || 0,
        inventoryTurnoverRate: parseInt(formData.inventoryTurnoverRate) || 0,
        status: parseInt(formData.status),
        warehouseID: parseInt(formData.warehouseID),
      });

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

      setValidationErrors([]);
    } catch (error) {
      console.error("Failed to create inventory:", error);
    }
  };

  return (
    <div>
      <h1>➕ Create Inventory</h1>

      {validationErrors.length > 0 && (
        <div>
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
          ].map((field) =>
            field === "status" ? (
              <select
                key={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
              >
                <option value="">Select status</option>
                <option value="0">Active</option>
                <option value="1">BackOrdered</option>
                <option value="2">Discontinued</option>
              </select>
            ) : (
              <input
                key={field}
                type={field.toLowerCase().includes("date") ? "date" : "number"}
                step={
                  field === "unitPrice" || field === "inventoryTurnoverRate"
                    ? "0.01"
                    : "1"
                }
                min={field.toLowerCase().includes("date") ? undefined : "0"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={field}
              />
            )
          )}

          <label>Product</label>
          <select
            name="productID"
            value={formData.productID}
            onChange={handleChange}
          >
            <option value="">Select a product</option>
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
            <option value="">Select a warehouse</option>
            {warehouses.map((w) => (
              <option key={w.warehouseID} value={w.warehouseID}>
                {w.warehouseName} (ID: {w.warehouseID})
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={
              postInventory.isPending ||
              !formData.productID.trim() ||
              !formData.warehouseID
            }
          >
            {postInventory.isPending ? "Creating..." : "Create Inventory"}
          </button>
        </form>
      )}

      {postInventory.isSuccess && (
        <div>
          <h2>✅ Inventory Created</h2>
          <table>
            <thead>
              <tr>
                <th>Field</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(postInventory.data).map(([key, value]) =>
                key !== "product" && key !== "warehouse" ? (
                  <tr key={key}>
                    <th>{key}</th>
                    <td>
                      {key === "status"
                        ? value === 0
                          ? "Active"
                          : value === 1
                          ? "BackOrdered"
                          : value === 2
                          ? "Discontinued"
                          : value
                        : key === "productID"
                          ? `${value} - ${getProductNameFromID(value)}`
                          : key === "warehouseID"
                            ? `${value} - ${getWarehouseNameFromID(value)}`
                            : value}
                    </td>
                  </tr>
                ) : null
              )}
            </tbody>
          </table>
        </div>
      )}

      {postInventory.isError && (
        <div>
          <p>
            Error creating inventory:{" "}
            {typeof postInventory.error?.response?.data === "string"
              ? postInventory.error.response.data
              : postInventory.error?.response?.data?.message ||
                postInventory.error?.message}
          </p>
        </div>
      )}
    </div>
  );
}

export default PostInventory;

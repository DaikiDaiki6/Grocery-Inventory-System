import { useState } from "react";
import { usePostInventory } from "../../hooks/useInventories";
import { useFetchForeignKeys } from "./useFetchForeignKeys";
import { getErrorMessage, getErrorStyling } from "../../utils/errorHandler";
import { isUserAdmin } from "../../utils/authUtils";

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
  const isAdmin = isUserAdmin();

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
        Number(updatedFormData.warehouseID) <= 0)
    ) {
      errors.push("⚠️ Warehouse ID must be greater than 0");
    }

    setValidationErrors(errors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validationErrors.length > 0) return;

    try {
      const dataToSend = {};
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== "") {
          if (key === "unitPrice") {
            dataToSend[key] = parseFloat(formData[key]);
          } else if (
            [
              "stockQuantity",
              "reorderLevel",
              "reorderQuantity",
              "salesVolume",
              "inventoryTurnoverRate",
              "status",
              "warehouseID",
            ].includes(key)
          ) {
            dataToSend[key] = parseInt(formData[key]);
          } else {
            dataToSend[key] = formData[key];
          }
        }
      });

      await postInventory.mutateAsync(dataToSend);

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
      console.log("Inventory created successfully!");
    } catch (error) {
      console.error("Failed to create inventory: ", error);
    }
  };

  return (
    <div
      className={`max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6 mt-8 border border-gray-200 space-y-6 ${
        !isAdmin ? "opacity-50" : ""
      }`}
    >
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        ➕ Create Inventory
        {!isAdmin && (
          <span className="text-sm text-gray-500 font-normal">
            (Admin Only)
          </span>
        )}
      </h1>

      {!isAdmin && (
        <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-lg text-yellow-800">
          <p className="flex items-center gap-2">
            🔒 This action requires administrator privileges. Only admins can
            create inventories.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Stock Quantity
            </label>
            <input
              type="number"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleChange}
              placeholder="Enter stock quantity"
              min={0}
              disabled={!isAdmin}
              className={`w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                !isAdmin ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Reorder Level
            </label>
            <input
              type="number"
              name="reorderLevel"
              value={formData.reorderLevel}
              onChange={handleChange}
              placeholder="Enter reorder level"
              min={0}
              disabled={!isAdmin}
              className={`w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                !isAdmin ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Reorder Quantity
            </label>
            <input
              type="number"
              name="reorderQuantity"
              value={formData.reorderQuantity}
              onChange={handleChange}
              placeholder="Enter reorder quantity"
              min={1}
              disabled={!isAdmin}
              className={`w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                !isAdmin ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Unit Price
            </label>
            <input
              type="number"
              name="unitPrice"
              value={formData.unitPrice}
              onChange={handleChange}
              placeholder="Enter unit price"
              step="0.01"
              min={0.01}
              disabled={!isAdmin}
              className={`w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                !isAdmin ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date Received
            </label>
            <input
              type="date"
              name="dateReceived"
              value={formData.dateReceived}
              onChange={handleChange}
              disabled={!isAdmin}
              className={`w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                !isAdmin ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Order Date
            </label>
            <input
              type="date"
              name="lastOrderDate"
              value={formData.lastOrderDate}
              onChange={handleChange}
              disabled={!isAdmin}
              className={`w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                !isAdmin ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Expiration Date
            </label>
            <input
              type="date"
              name="expirationDate"
              value={formData.expirationDate}
              onChange={handleChange}
              disabled={!isAdmin}
              className={`w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                !isAdmin ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sales Volume
            </label>
            <input
              type="number"
              name="salesVolume"
              value={formData.salesVolume}
              onChange={handleChange}
              placeholder="Enter sales volume"
              min={0}
              disabled={!isAdmin}
              className={`w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                !isAdmin ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Inventory Turnover Rate
            </label>
            <input
              type="number"
              name="inventoryTurnoverRate"
              value={formData.inventoryTurnoverRate}
              onChange={handleChange}
              placeholder="Enter turnover rate"
              min={0}
              disabled={!isAdmin}
              className={`w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                !isAdmin ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={!isAdmin}
              className={`w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                !isAdmin ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            >
              <option value="">Select Status</option>
              <option value="0">Active</option>
              <option value="1">BackOrdered</option>
              <option value="2">Discontinued</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product ID
            </label>
            <select
              name="productID"
              value={formData.productID}
              onChange={handleChange}
              disabled={!isAdmin}
              className={`w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                !isAdmin ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            >
              <option value="">Select Product</option>
              {products.map((product) => (
                <option key={product.productID} value={product.productID}>
                  {product.productID} - {product.productName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Warehouse ID
            </label>
            <select
              name="warehouseID"
              value={formData.warehouseID}
              onChange={handleChange}
              disabled={!isAdmin}
              className={`w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                !isAdmin ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            >
              <option value="">Select Warehouse</option>
              {warehouses.map((warehouse) => (
                <option
                  key={warehouse.warehouseID}
                  value={warehouse.warehouseID}
                >
                  {warehouse.warehouseID} - {warehouse.warehouseName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {validationErrors.length > 0 && (
          <div className="p-4 bg-red-50 border border-red-300 rounded-lg">
            <ul className="text-red-800 text-sm space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          disabled={
            !isAdmin || postInventory.isPending || validationErrors.length > 0
          }
          className={`w-full py-2 px-4 rounded-lg transition ${
            isAdmin
              ? "bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              : "bg-gray-400 text-gray-600 cursor-not-allowed"
          }`}
        >
          {postInventory.isPending ? "Creating..." : "Create Inventory"}
        </button>
      </form>

      {postInventory.isSuccess && (
        <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded-lg shadow-sm">
          <strong className="text-green-800 text-base flex items-center gap-2">
            ✅ Inventory created successfully!
          </strong>
        </div>
      )}

      {postInventory.isError && (
        <div
          className={`p-4 border rounded-lg mt-6 ${
            getErrorStyling(postInventory.error).container
          }`}
        >
          <p className="flex items-center gap-2">
            {getErrorStyling(postInventory.error).icon} Error creating
            inventory:{" "}
            {getErrorMessage(postInventory.error, "creating", "inventory")}
          </p>
        </div>
      )}
    </div>
  );
}

export default PostInventory;

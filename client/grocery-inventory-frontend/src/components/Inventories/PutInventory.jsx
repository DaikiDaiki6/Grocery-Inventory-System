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
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-2xl p-6 mt-6">
      <h1 className="text-xl font-bold text-gray-800 mb-4">✏️ Put Inventory</h1>

      {validationErrors.length > 0 && (
        <div className="bg-red-100 border border-red-300 text-red-800 p-4 rounded-xl space-y-2 shadow-sm">
          {validationErrors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}

      {error && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg">
          ❌ Failed to load foreign key data.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Inventory ID
        </label>
        <input
          type="text"
          name="inventoryId"
          value={inventoryId}
          onChange={(e) => setInventoryId(e.target.value)}
          placeholder="Enter inventory ID (eg. 12)"
          className={`w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500`}
        />

        {Object.entries(formData).map(([key, value]) => {
          if (key === "productID") {
            return (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ">
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (c) => c.toUpperCase())}
                </label>
                <select
                  key={key}
                  name="productID"
                  value={formData.productID}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500`}
                >
                  <option key="" value="">
                    Select a product
                  </option>
                  {products.map((p) => (
                    <option key={p.productID} value={p.productID}>
                      {p.productName} (ID: {p.productID})
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          if (key === "warehouseID") {
            return (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ">
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (c) => c.toUpperCase())}
                </label>
                <select
                  key={key}
                  name="warehouseID"
                  min={1}
                  value={formData.warehouseID}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500`}
                >
                  <option value="">Select a warehouse</option>
                  {warehouses.map((w) => (
                    <option key={w.warehouseID} value={w.warehouseID}>
                      {w.warehouseName} (ID: {w.warehouseID})
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          if (key === "status") {
            return (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ">
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (c) => c.toUpperCase())}
                </label>
                <select
                  key={key}
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500`}
                >
                  <option value="">Select status</option>
                  <option value="0">Active</option>
                  <option value="1">BackOrdered</option>
                  <option value="2">Discontinued</option>
                </select>
              </div>
            );
          }

          return (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ">
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (c) => c.toUpperCase())}
              </label>
              <input
                key={key}
                type={
                  key.includes("Date") || key.includes("date")
                    ? "date"
                    : "number"
                }
                step={
                  key === "unitPrice" || key === "inventoryTurnoverRate"
                    ? "0.01"
                    : undefined
                }
                min={key.toLowerCase().includes("date") ? undefined : 1}
                name={key}
                value={value}
                onChange={handleChange}
                placeholder={`Enter ${key}`}
                className={`w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500`}
              />
            </div>
          );
        })}

        <button
          type="submit"
          disabled={
            putInventory.isPending ||
            !inventoryId.trim() ||
            !formData.productID.trim() ||
            !formData.warehouseID ||
            !formData.reorderLevel.trim() ||
            !formData.reorderQuantity.trim() ||
            !formData.unitPrice.trim() ||
            !formData.dateReceived.trim() ||
            !formData.lastOrderDate.trim() ||
            !formData.expirationDate.trim() ||
            !formData.salesVolume.trim() ||
            !formData.inventoryTurnoverRate.trim() ||
            !formData.status.trim()
          }
          className="w-full py-2 mt-4 px-4 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition"
        >
          {putInventory.isPending
            ? "Replacing inventory..."
            : "Replace Inventory"}
        </button>
      </form>

      {putInventory.isSuccess && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-5 shadow-sm">
          <h2 className="font-semibold text-green-800 text-base mb-4 flex items-center gap-2">
            ✅ Inventory Replaced
          </h2>
          <table className="min-w-full text-sm text-gray-700 bg-white border border-gray-200 rounded-xl">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">Field</th>
                <th className="px-4 py-3 text-left">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-100 hover:bg-gray-50 transition">
                <th className="px-4 py-3 text-left">Inventory ID</th>
                <td className="px-4 py-3">{putInventory.data.inventoryID}</td>
              </tr>
              <tr className="border-t border-gray-100 hover:bg-gray-50 transition">
                <th className="px-4 py-3 text-left">Stock Quantity</th>
                <td className="px-4 py-3">{putInventory.data.stockQuantity}</td>
              </tr>
              <tr className="border-t border-gray-100 hover:bg-gray-50 transition">
                <th className="px-4 py-3 text-left">Reorder Level</th>
                <td className="px-4 py-3">{putInventory.data.reorderLevel}</td>
              </tr>
              <tr className="border-t border-gray-100 hover:bg-gray-50 transition">
                <th className="px-4 py-3 text-left">Reorder Quantity</th>
                <td className="px-4 py-3">
                  {putInventory.data.reorderQuantity}
                </td>
              </tr>
              <tr className="border-t border-gray-100 hover:bg-gray-50 transition">
                <th className="px-4 py-3 text-left">Unit Price</th>
                <td className="px-4 py-3">${putInventory.data.unitPrice}</td>
              </tr>
              <tr className="border-t border-gray-100 hover:bg-gray-50 transition">
                <th className="px-4 py-3 text-left">Date Received</th>
                <td className="px-4 py-3">{putInventory.data.dateReceived}</td>
              </tr>
              <tr className="border-t border-gray-100 hover:bg-gray-50 transition">
                <th className="px-4 py-3 text-left">Last Order Date</th>
                <td className="px-4 py-3">{putInventory.data.lastOrderDate}</td>
              </tr>
              <tr className="border-t border-gray-100 hover:bg-gray-50 transition">
                <th className="px-4 py-3 text-left">Expiration Date</th>
                <td className="px-4 py-3">
                  {putInventory.data.expirationDate}
                </td>
              </tr>
              <tr className="border-t border-gray-100 hover:bg-gray-50 transition">
                <th className="px-4 py-3 text-left">Sales Volume</th>
                <td className="px-4 py-3">{putInventory.data.salesVolume}</td>
              </tr>
              <tr className="border-t border-gray-100 hover:bg-gray-50 transition">
                <th className="px-4 py-3 text-left">Inventory Turnover Rate</th>
                <td className="px-4 py-3">
                  {putInventory.data.inventoryTurnoverRate}
                </td>
              </tr>
              <tr className="border-t border-gray-100 hover:bg-gray-50 transition">
                <th className="px-4 py-3 text-left">Status</th>
                <td className="px-4 py-3">
                  {putInventory.data.status === 0 && "Active"}
                  {putInventory.data.status === 1 && "BackOrdered"}
                  {putInventory.data.status === 2 && "Discontinued"}
                </td>
              </tr>
              <tr className="border-t border-gray-100 hover:bg-gray-50 transition">
                <th className="px-4 py-3 text-left">Product ID</th>
                <td className="px-4 py-3">{putInventory.data.productID}</td>
              </tr>
              <tr className="border-t border-gray-100 hover:bg-gray-50 transition">
                <th className="px-4 py-3 text-left">Warehouse ID</th>
                <td className="px-4 py-3">{putInventory.data.warehouseID}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {putInventory.isError && (
        <div className="p-4 bg-red-50 border border-red-300 rounded-lg text-red-800 mt-6">
          <p>
            ❌ Error updating inventory:{" "}
            {typeof putInventory.error?.response?.data === "string"
              ? putInventory.error.response.data
              : putInventory.error?.response?.data?.title ||
                putInventory.error?.message}
          </p>
        </div>
      )}
    </div>
  );
}

export default PutInventory;

import { useState } from "react";
import { usePatchWarehouse } from "../../hooks/useWarehouses";
import { getErrorMessage, getErrorStyling } from "../../utils/errorHandler";
import { isUserAdmin } from "../../utils/authUtils";

function PatchWarehouse() {
  const [warehouseID, setWarehouseID] = useState("");
  const [warehouseName, setWarehouseName] = useState("");
  const [errorName, setErrorName] = useState("");
  const [errorID, setErrorID] = useState("");
  const patchWarehouse = usePatchWarehouse();
  const isAdmin = isUserAdmin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!warehouseID.trim() || !warehouseName.trim()) return;
    try {
      await patchWarehouse.mutateAsync({
        id: parseInt(warehouseID),
        data: { warehouseName: warehouseName.trim() },
      });
      setWarehouseID("");
      setWarehouseName("");
      console.log("Warehouse patched successfully!");
    } catch (error) {
      console.error("Failed to patch warehouse: ", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "warehouseName") {
      setWarehouseName(value);
      if (!value) setErrorName("");
      else if (value.length < 2)
        setErrorName("⚠️ Name must be at least 2 characters");
      else if (value.length > 150)
        setErrorName("⚠️ Name cannot exceed 150 characters");
      else setErrorName("");
    }

    if (name === "warehouseID") {
      setWarehouseID(value);
      if (!value) setErrorID("");
      else if (parseInt(value) <= 0) setErrorID("⚠️ ID must be 1 or greater.");
      else setErrorID("");
    }
  };

  return (
    <div
      className={`max-w-xl mx-auto bg-white shadow-md rounded-xl p-6 mt-8 border border-gray-200 space-y-6 ${
        !isAdmin ? "opacity-50" : ""
      }`}
    >
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        ✏️ Patch Warehouse
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
            modify warehouses.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="warehouseID"
            className="block text-sm font-medium text-gray-700"
          >
            Warehouse ID
          </label>
          <input
            type="number"
            name="warehouseID"
            value={warehouseID}
            onChange={handleInputChange}
            placeholder="Enter Warehouse ID (e.g. 12)"
            min={1}
            disabled={!isAdmin}
            className={`w-full px-4 py-2 border ${
              errorID ? "border-red-500" : "border-gray-300"
            } rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
              !isAdmin ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
          {errorID && <p className="text-sm text-red-600 mt-1">{errorID}</p>}
        </div>

        <div>
          <label
            htmlFor="warehouseName"
            className="block text-sm font-medium text-gray-700"
          >
            Warehouse Name
          </label>
          <input
            type="text"
            name="warehouseName"
            value={warehouseName}
            onChange={handleInputChange}
            placeholder="Enter Warehouse Name (e.g. Grove Street)"
            minLength={2}
            maxLength={150}
            disabled={!isAdmin}
            className={`w-full px-4 py-2 border ${
              errorName ? "border-red-500" : "border-gray-300"
            } rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
              !isAdmin ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
          {errorName && (
            <p className="text-sm text-red-600 mt-1">{errorName}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={
            !isAdmin ||
            patchWarehouse.isPending ||
            !warehouseID.trim() ||
            !warehouseName.trim() ||
            errorID ||
            errorName
          }
          className={`w-full py-2 px-4 rounded-lg transition ${
            isAdmin
              ? "bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              : "bg-gray-400 text-gray-600 cursor-not-allowed"
          }`}
        >
          {patchWarehouse.isPending ? "Patching..." : "Patch Warehouse"}
        </button>
      </form>

      {patchWarehouse.isSuccess && (
        <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded-lg shadow-sm">
          <strong className="text-green-800 text-base flex items-center gap-2">
            ✅ Warehouse patched successfully!
          </strong>
        </div>
      )}

      {patchWarehouse.isError && (
        <div
          className={`p-4 border rounded-lg mt-6 ${
            getErrorStyling(patchWarehouse.error).container
          }`}
        >
          <p className="flex items-center gap-2">
            {getErrorStyling(patchWarehouse.error).icon} Error updating
            warehouse:{" "}
            {getErrorMessage(patchWarehouse.error, "updating", "warehouse")}
          </p>
        </div>
      )}
    </div>
  );
}

export default PatchWarehouse;

import { useState } from "react";
import { usePostWarehouse } from "../../hooks/useWarehouses";
import { getErrorMessage, getErrorStyling } from "../../utils/errorHandler";
import { isUserAdmin } from "../../utils/authUtils";

function PostWarehouse() {
  const [warehouseName, setWarehouseName] = useState("");
  const [errorName, setErrorName] = useState("");
  const postWarehouse = usePostWarehouse();
  const isAdmin = isUserAdmin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!warehouseName.trim()) return;
    try {
      await postWarehouse.mutateAsync({
        warehouseName: warehouseName.trim(),
      });
      setWarehouseName("");
      console.log("Warehouse created successfully!");
    } catch (error) {
      console.error("Failed to create warehouse: ", error);
    }
  };

  const handleInputChange = (e) => {
    setWarehouseName(e.target.value);
    if (e.target.value === "") {
      setErrorName("");
    } else if (e.target.value.length < 2) {
      setErrorName("⚠️ Name must be at least 2 characters");
    } else if (e.target.value.length > 100) {
      setErrorName("⚠️ Name cannot exceed 100 characters");
    } else {
      setErrorName("");
    }
  };

  return (
    <div
      className={`max-w-xl mx-auto bg-white shadow-md rounded-xl p-6 mt-8 border border-gray-200 space-y-6 ${
        !isAdmin ? "opacity-50" : ""
      }`}
    >
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        🏠 Create Warehouse
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
            create warehouses.
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
            type="text"
            name="warehouseID"
            disabled
            placeholder="Warehouse ID will be auto-generated..."
            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded text-sm"
          />
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
            minLength={2}
            maxLength={100}
            value={warehouseName}
            onChange={handleInputChange}
            placeholder="Enter Warehouse Name (e.g., Grove Street)"
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
            postWarehouse.isPending ||
            !warehouseName.trim() ||
            errorName
          }
          className={`w-full py-2 px-4 rounded-lg transition ${
            isAdmin
              ? "bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              : "bg-gray-400 text-gray-600 cursor-not-allowed"
          }`}
        >
          {postWarehouse.isPending ? "Creating..." : "Create Warehouse"}
        </button>
      </form>

      {postWarehouse.isSuccess && (
        <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded-lg shadow-sm">
          <strong className="text-green-800 text-base flex items-center gap-2">
            ✅ Warehouse created successfully!
          </strong>
        </div>
      )}

      {postWarehouse.isError && (
        <div
          className={`p-4 border rounded-lg mt-6 ${
            getErrorStyling(postWarehouse.error).container
          }`}
        >
          <p className="flex items-center gap-2">
            {getErrorStyling(postWarehouse.error).icon} Error creating
            warehouse:{" "}
            {getErrorMessage(postWarehouse.error, "creating", "warehouse")}
          </p>
        </div>
      )}
    </div>
  );
}

export default PostWarehouse;

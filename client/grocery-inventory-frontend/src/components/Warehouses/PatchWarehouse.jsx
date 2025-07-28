import { useState } from "react";
import { usePatchWarehouse } from "../../hooks/useWarehouses";

function PatchWarehouse() {
  const [warehouseID, setWarehouseID] = useState("");
  const [warehouseName, setWarehouseName] = useState("");
  const [errorName, setErrorName] = useState("");
  const [errorID, setErrorID] = useState("");
  const patchWarehouse = usePatchWarehouse();

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
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-6 mt-8 border border-gray-200 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        ✏️ Patch Warehouse
      </h1>

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
            className={`w-full px-4 py-2 border ${
              errorID ? "border-red-500" : "border-gray-300"
            } rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500`}
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
            className={`w-full px-4 py-2 border ${
              errorName ? "border-red-500" : "border-gray-300"
            } rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500`}
          />
          {errorName && (
            <p className="text-sm text-red-600 mt-1">{errorName}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={
            patchWarehouse.isPending ||
            !warehouseID.trim() ||
            !warehouseName.trim() ||
            errorID ||
            errorName
          }
          className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          {patchWarehouse.isPending ? "Patching..." : "Patch Warehouse"}
        </button>
      </form>

      {patchWarehouse.isSuccess && (
        <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded-lg shadow-sm">
          <strong className="text-green-800 text-base flex items-center gap-2">
            ✅ Warehouse updated successfully!
          </strong>

          {patchWarehouse.data && (
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full text-sm text-left border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-green-100 text-green-900 uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-4 py-3 border-b border-gray-300">
                      Warehouse Name
                    </th>
                    <th className="px-4 py-3 border-b border-gray-300">ID</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr className="hover:bg-green-50 transition">
                    <td className="px-4 py-3 border-b border-gray-200 font-medium text-gray-800">
                      {patchWarehouse.data.warehouseName}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 text-gray-700">
                      {patchWarehouse.data.warehouseID}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {patchWarehouse.isError && (
        <div className="p-4 bg-red-50 border border-red-300 rounded-lg text-red-800 mt-6">
          <p>
            ❌ Error updating warehouse:{" "}
            {typeof patchWarehouse.error?.response?.data === "string"
              ? patchWarehouse.error.response.data
              : patchWarehouse.error?.response?.data?.title ||
                patchWarehouse.error?.message}
          </p>
        </div>
      )}
    </div>
  );
}

export default PatchWarehouse;

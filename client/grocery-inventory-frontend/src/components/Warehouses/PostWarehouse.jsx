import { useState } from "react";
import { usePostWarehouse } from "../../hooks/useWarehouses";

function PostWarehouse() {
  const [warehouseName, setWarehouseName] = useState("");
  const [errorName, setErrorName] = useState("");
  const postWarehouse = usePostWarehouse();

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
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-6 mt-8 border border-gray-200 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        🏠 Create Warehouse
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="warehouseID" className="block text-sm font-medium text-gray-700">
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
          <label htmlFor="warehouseName" className="block text-sm font-medium text-gray-700">
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
          disabled={postWarehouse.isPending || !warehouseName.trim()}
          className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition"
        >
          {postWarehouse.isPending ? "Creating..." : "Create Warehouse"}
        </button>
      </form>

      {postWarehouse.isSuccess && (
        <div className="mt-6 p-6 bg-green-50 border border-green-300 rounded-lg shadow-sm">
          <strong className="text-green-800 text-base flex items-center gap-2">
            ✅ Warehouse created successfully!
          </strong>

          {postWarehouse.data && (
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
                      {postWarehouse.data.warehouseName}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 text-gray-700">
                      {postWarehouse.data.warehouseID}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {postWarehouse.isError && (
        <div className="mt-6 p-4 bg-red-50 border border-red-300 rounded text-red-700">
          <p>
            ❌ Error in creating warehouse:{" "}
            {typeof postWarehouse.error?.response?.data === "string"
              ? postWarehouse.error.response.data
              : postWarehouse.error?.response?.data?.message ||
                postWarehouse.error?.message}
          </p>
        </div>
      )}
    </div>
  );
}

export default PostWarehouse;

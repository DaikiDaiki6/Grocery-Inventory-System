import { useState } from "react";
import { usePatchWarehouse } from "../../hooks/useWarehouses";

function PatchWarehouse() {
  const [patchId, setPatchId] = useState("");
  const [warehouseName, setWarehouseName] = useState("");
  const patchWarehouse = usePatchWarehouse();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patchId.trim() || warehouseName == "") return;
    try {
      await patchWarehouse.mutateAsync({
        id: parseInt(patchId),
        data: {
          warehouseName: warehouseName,
        },
      });
      setPatchId("");
      setWarehouseName("");
      console.log("Warehouse patched successfully!");
    } catch (error) {
      console.error("Failed to patch warehouse: ", error);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name == "warehouseName") {
      setWarehouseName(e.target.value);
    }
    if (e.target.name == "patchId") {
      setPatchId(e.target.value);
    }
  };

  return (
    <div className="warehouse">
      <h1>📦 Patch Warehouse</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="patchId"
          value={patchId}
          onChange={handleInputChange}
          placeholder="Enter warehouse Id"
          min={1}
        />
        <input
          type="text"
          name="warehouseName"
          value={warehouseName}
          onChange={handleInputChange}
          placeholder="Enter warehouse name"
        />
        <button
          type="submit"
          disabled={
            patchWarehouse.isPending || !patchId.trim() || warehouseName == ""
          }
        >
          {patchWarehouse.isPending ? "Patching..." : "Patch Warehouse"}
        </button>
      </form>

      {patchWarehouse.isSuccess && (
        <div className="warehouse-details">
          <h1>Warehouse Details</h1>
          <p>✅ Warehouse updated successfully!</p>
          {patchWarehouse.data && (
            <p>
              Updated: {patchWarehouse.data.warehouseName} (ID:{" "}
              {patchWarehouse.data.warehouseID})
            </p>
          )}
        </div>
      )}

      {patchWarehouse.isError && (
        <div className="warehouse-error">
          <h1>Warehouse error</h1>
          <p>
            Error updating warehouse :{" "}
            {patchWarehouse.error?.response?.data ||
              patchWarehouse.error?.message}
          </p>
        </div>
      )}
    </div>
  );
}

export default PatchWarehouse;

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
    if (!warehouseID.trim() || warehouseName == "") return;
    try {
      await patchWarehouse.mutateAsync({
        id: parseInt(warehouseID),
        data: {
          warehouseName: warehouseName,
        },
      });
      setWarehouseID("");
      setWarehouseName("");
      console.log("Warehouse patched successfully!");
    } catch (error) {
      console.error("Failed to patch warehouse: ", error);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name == "warehouseName") {
      setWarehouseName(e.target.value);
      if (e.target.value === "") {
        setErrorName("");
      } else if (e.target.value.length < 2) {
        setErrorName("⚠️ Name must be at least 2 characters");
      } else if (e.target.value.length > 100) {
        setErrorName("⚠️ Name cannot exceed 150 characters");
      } else {
        setErrorName("");
      }
    }
    if (e.target.name == "patchId") {
      setWarehouseID(e.target.value);
      if (e.target.value === "") {
        setErrorID("");
      } else if (e.target.value <= 0) {
        setErrorID("⚠️ ID must be 1 or greater.");
      } else {
        setErrorID("");
      }
    }
  };

  return (
    <div className="warehouse">
      <h1>✏️ Patch Warehouse</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="patchId"
          value={warehouseID}
          onChange={handleInputChange}
          placeholder="Enter warehouse Id"
          min={1}
        />
        {errorID && <div className="error-details">{errorID}</div>}
        <input
          type="text"
          name="warehouseName"
          minLength={2}
          maxLength={150}
          value={warehouseName}
          onChange={handleInputChange}
          placeholder="Enter warehouse name"
        />
        {errorName && <div className="error-details">{errorName}</div>}
        <button
          type="submit"
          disabled={
            patchWarehouse.isPending || !warehouseID.trim() || warehouseName == ""
          }
        >
          {patchWarehouse.isPending ? "Patching..." : "Patch Warehouse"}
        </button>
      </form>

      {patchWarehouse.isSuccess && (
        <div className="warehouse-details">
          <strong>✅ Warehouse updated successfully!</strong>
          {patchWarehouse.data && (
            <table>
              <thead>
                <tr>
                  <th>Warehouse Name</th>
                  <th>ID</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>{patchWarehouse.data.warehouseName}</strong>
                  </td>
                  <td>{patchWarehouse.data.warehouseID}</td>
                </tr>
              </tbody>
            </table>
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

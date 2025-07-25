import { useState } from "react";
import { usePatchSupplier } from "../../hooks/useSuppliers";

function PatchSupplier() {
  const [patchId, setPatchId] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const patchSupplier = usePatchSupplier();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patchId.trim() || supplierName === "") return;
    try {
      await patchSupplier.mutateAsync({
        id: patchId,
        data: {
          supplierName: supplierName,
        },
      });
      setPatchId("");
      setSupplierName("");
      console.log("Supplier patched successfully!");
    } catch (error) {
      console.error("Failed to patch supplier: ", error);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name === "supplierName") {
      setSupplierName(e.target.value);
    }
    if (e.target.name === "patchId") {
      setPatchId(e.target.value);
    }
  };

  return (
    <div className="supplier">
      <h1>📦 Patch Supplier</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="patchId"
          value={patchId}
          onChange={handleInputChange}
          placeholder="Enter supplier Id (e.g. 00-023-6666)"
          min={1}
        />
        <input
          type="text"
          name="supplierName"
          value={supplierName}
          onChange={handleInputChange}
          placeholder="Enter supplier name"
        />
        <button
          type="submit"
          disabled={
            patchSupplier.isPending || !patchId.trim() || supplierName === ""
          }
        >
          {patchSupplier.isPending ? "Patching..." : "Patch Supplier"}
        </button>
      </form>

      {patchSupplier.isSuccess && (
        <div className="supplier-details">
          <h1>Supplier Details</h1>
          <p>✅ Supplier updated successfully!</p>
          {patchSupplier.data && (
            <p>
              Updated: {patchSupplier.data.supplierName} (ID:{" "}
              {patchSupplier.data.supplierID})
            </p>
          )}
        </div>
      )}

      {patchSupplier.isError && (
        <div className="supplier-error">
          <h1>Supplier error</h1>
          <p>
            Error updating supplier:{" "}
            {patchSupplier.error?.response?.data ||
              patchSupplier.error?.message}
          </p>
        </div>
      )}
    </div>
  );
}

export default PatchSupplier;

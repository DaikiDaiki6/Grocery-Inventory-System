import { useState } from "react";
import { usePatchSupplier } from "../../hooks/useSuppliers";

function PatchSupplier() {
  const [supplierID, setSupplierID] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [errorName, setErrorName] = useState("");
  const [errorID, setErrorID] = useState("");
  const patchSupplier = usePatchSupplier();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supplierID.trim() || supplierName === "") return;
    try {
      await patchSupplier.mutateAsync({
        id: supplierID,
        data: {
          supplierName: supplierName,
        },
      });
      setSupplierID("");
      setSupplierName("");
      console.log("Supplier patched successfully!");
    } catch (error) {
      console.error("Failed to patch supplier: ", error);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name === "supplierName") {
      setSupplierName(e.target.value);
      if (e.target.value === "") {
        setErrorName("");
      } else if (e.target.value.length < 2) {
        setErrorName("⚠️ Name must be at least 2 characters");
      } else if (e.target.value.length > 100) {
        setErrorName("⚠️ Name cannot exceed 100 characters");
      } else {
        setErrorName("");
      }
    }
    if (e.target.name === "supplierID") {
      setSupplierID(e.target.value);
      if (e.target.value === "") {
        setErrorID("");
      } else if (e.target.value.length !== 11) {
        setErrorID("⚠️ ID must be exactly 11 characters");
      } else {
        setErrorID("");
      }
    }
  };

  return (
    <div className="supplier">
      <h1>✏️ Patch Supplier</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="supplierID"
          value={supplierID}
          onChange={handleInputChange}
          placeholder="Enter supplier Id (e.g. 00-023-6666)"
          minLength={11}
          maxLength={11}
        />
        {errorID && <div className="error-details">{errorID}</div>}
        <input
          type="text"
          name="supplierName"
          minLength={2}
          maxLength={100}
          value={supplierName}
          onChange={handleInputChange}
          placeholder="Enter supplier name (eg. Kamba)"
        />
        {errorName && <div className="error-details">{errorName}</div>}
        <button
          type="submit"
          disabled={
            patchSupplier.isPending || !supplierID.trim() || supplierName === ""
          }
        >
          {patchSupplier.isPending ? "Patching..." : "Patch Supplier"}
        </button>
      </form>

      {patchSupplier.isSuccess && (
        <div className="supplier-details">
          <strong>✅ Supplier updated successfully!</strong>
          {patchSupplier.data && (
            <table>
              <thead>
                <tr>
                  <th>Supplier Name</th>
                  <th>ID</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>{patchSupplier.data.supplierID}</strong>
                  </td>
                  <td>{patchSupplier.data.supplierName}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      )}

      {patchSupplier.isError && (
        <div className="supplier-error">
          <p>
            Error updating supplier:{" "}
            {typeof patchSupplier.error?.response?.data === "string"
              ? patchSupplier.error.response.data
              : patchSupplier.error?.response?.data?.title ||
                patchSupplier.error?.message}
          </p>
        </div>
      )}
    </div>
  );
}

export default PatchSupplier;

import { useState } from "react";
import { usePatchSupplier } from "../../hooks/useSuppliers";
import { getErrorMessage, getErrorStyling } from "../../utils/errorHandler";
import { isUserAdmin } from "../../utils/authUtils";

function PatchSupplier() {
  const [supplierID, setSupplierID] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [errorName, setErrorName] = useState("");
  const [errorID, setErrorID] = useState("");
  const patchSupplier = usePatchSupplier();
  const isAdmin = isUserAdmin();

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
    const { name, value } = e.target;

    if (name === "supplierName") {
      setSupplierName(value);
      if (!value) setErrorName("");
      else if (value.length < 2)
        setErrorName("⚠️ Name must be at least 2 characters");
      else if (value.length > 100)
        setErrorName("⚠️ Name cannot exceed 100 characters");
      else setErrorName("");
    }

    if (name === "supplierID") {
      setSupplierID(value);
      if (!value) setErrorID("");
      else if (value.length !== 11)
        setErrorID("⚠️ ID must be exactly 11 characters");
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
        ✏️ Patch Supplier
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
            modify suppliers.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="supplierID"
            className="block text-sm font-medium text-gray-700"
          >
            Supplier ID
          </label>
          <input
            type="text"
            name="supplierID"
            value={supplierID}
            onChange={handleInputChange}
            placeholder="Enter Supplier ID (e.g. 00-023-6666)"
            minLength={11}
            maxLength={11}
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
            htmlFor="supplierName"
            className="block text-sm font-medium text-gray-700"
          >
            Supplier Name
          </label>
          <input
            type="text"
            name="supplierName"
            value={supplierName}
            minLength={2}
            maxLength={100}
            onChange={handleInputChange}
            placeholder="Enter Supplier Name (e.g. Kamba)"
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
            patchSupplier.isPending ||
            !supplierID.trim() ||
            supplierName === "" ||
            errorID ||
            errorName
          }
          className={`w-full py-2 px-4 rounded-lg transition ${
            isAdmin
              ? "bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              : "bg-gray-400 text-gray-600 cursor-not-allowed"
          }`}
        >
          {patchSupplier.isPending ? "Patching..." : "Patch Supplier"}
        </button>
      </form>

      {patchSupplier.isSuccess && (
        <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded-lg shadow-sm">
          <strong className="text-green-800 text-base flex items-center gap-2">
            ✅ Supplier patched successfully!
          </strong>
        </div>
      )}

      {patchSupplier.isError && (
        <div
          className={`p-4 border rounded-lg mt-6 ${
            getErrorStyling(patchSupplier.error).container
          }`}
        >
          <p className="flex items-center gap-2">
            {getErrorStyling(patchSupplier.error).icon} Error updating supplier:{" "}
            {getErrorMessage(patchSupplier.error, "updating", "supplier")}
          </p>
        </div>
      )}
    </div>
  );
}

export default PatchSupplier;

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
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-6 mt-8 border border-gray-200 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        ✏️ Patch Supplier
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="supplierID" className="block text-sm font-medium text-gray-700">
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
            className={`w-full px-4 py-2 border ${
              errorID ? "border-red-500" : "border-gray-300"
            } rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500`}
          />
          {errorID && <p className="text-sm text-red-600 mt-1">{errorID}</p>}
        </div>

        <div>
          <label htmlFor="supplierName" className="block text-sm font-medium text-gray-700">
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
            className={`w-full px-4 py-2 border ${
              errorName ? "border-red-500" : "border-gray-300"
            } rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500`}
          />
          {errorName && <p className="text-sm text-red-600 mt-1">{errorName}</p>}
        </div>

        <button
          type="submit"
          disabled={
            patchSupplier.isPending || !supplierID.trim() || supplierName === "" || errorID || errorName
          }
          className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          {patchSupplier.isPending ? "Patching..." : "Patch Supplier"}
        </button>
      </form>

      {patchSupplier.isSuccess && (
        <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded-lg shadow-sm">
          <strong className="text-green-800 text-base flex items-center gap-2">
            ✅ Supplier updated successfully!
          </strong>

          {patchSupplier.data && (
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full text-sm text-left border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-green-100 text-green-900 uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-4 py-3 border-b border-gray-300">Supplier Name</th>
                    <th className="px-4 py-3 border-b border-gray-300">ID</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr className="hover:bg-green-50 transition">
                    <td className="px-4 py-3 border-b border-gray-200 font-medium text-gray-800">
                      {patchSupplier.data.supplierName}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 text-gray-700">
                      {patchSupplier.data.supplierID}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {patchSupplier.isError && (
        <div className="p-4 bg-red-50 border border-red-300 rounded-lg text-red-800 mt-6">
          <p>
            ❌ Error updating supplier:{" "}
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

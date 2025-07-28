import { useState } from "react";
import { usePostSupplier } from "../../hooks/useSuppliers";

function PostSupplier() {
  const [supplierName, setSupplierName] = useState("");
  const [supplierID, setSupplierID] = useState("");
  const [errorID, setErrorID] = useState("");
  const [errorName, setErrorName] = useState("");
  const postSupplier = usePostSupplier();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (supplierName === "" || supplierID === "") return;
    try {
      await postSupplier.mutateAsync({
        supplierID: supplierID.trim(),
        supplierName: supplierName.trim(),
      });
      setSupplierID("");
      setSupplierName("");
      console.log("Supplier created successfully!");
    } catch (error) {
      console.error("Failed to create supplier: ", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "supplierId") {
      setSupplierID(value);
      if (value === "") setErrorID("");
      else if (value.length !== 11)
        setErrorID("⚠️ ID must be exactly 11 characters");
      else setErrorID("");
    }
    if (name === "supplierName") {
      setSupplierName(value);
      if (value === "") setErrorName("");
      else if (value.length < 2)
        setErrorName("⚠️ Name must be at least 2 characters");
      else if (value.length > 100)
        setErrorName("⚠️ Name cannot exceed 100 characters");
      else setErrorName("");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-6 mt-8 border border-gray-200 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        ➕ Create Supplier
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="supplierId" className="block text-sm font-medium text-gray-700">
            Supplier ID
          </label>
          <input
            type="text"
            name="supplierId"
            minLength={11}
            maxLength={11}
            value={supplierID}
            onChange={handleInputChange}
            placeholder="Enter supplier ID (e.g. 00-023-6666)"
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
            minLength={2}
            maxLength={100}
            value={supplierName}
            onChange={handleInputChange}
            placeholder="Enter supplier name (e.g. Kamba)"
            className={`w-full px-4 py-2 border ${
              errorName ? "border-red-500" : "border-gray-300"
            } rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500`}
          />
          {errorName && <p className="text-sm text-red-600 mt-1">{errorName}</p>}
        </div>

        <button
          type="submit"
          disabled={
            postSupplier.isPending ||
            !supplierName.trim() ||
            !supplierID.trim()
          }
          className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition"
        >
          {postSupplier.isPending ? "Creating..." : "Create Supplier"}
        </button>
      </form>

      {postSupplier.isSuccess && (
        <div className="mt-6 p-6 bg-green-50 border border-green-300 rounded-lg shadow-sm">
          <strong className="text-green-800 text-base flex items-center gap-2">
            ✅ Supplier created successfully!
          </strong>

          {postSupplier.data && (
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
                      {postSupplier.data.supplierName}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-200 text-gray-700">
                      {postSupplier.data.supplierID}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {postSupplier.isError && (
        <div className="mt-6 p-4 bg-red-50 border border-red-300 rounded text-red-700">
          <p>
            Error creating supplier:{" "}
            {typeof postSupplier.error?.response?.data === "string"
              ? postSupplier.error.response.data
              : postSupplier.error?.response?.data?.message ||
                postSupplier.error?.message}
          </p>
        </div>
      )}
    </div>
  );
}

export default PostSupplier;

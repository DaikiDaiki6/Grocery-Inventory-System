import { useState } from "react";
import { usePostSupplier } from "../../hooks/useSuppliers";
import { getErrorMessage, getErrorStyling } from "../../utils/errorHandler";
import { isUserAdmin } from "../../utils/authUtils";

function PostSupplier() {
  const [supplierName, setSupplierName] = useState("");
  const [supplierID, setSupplierID] = useState("");
  const [errorID, setErrorID] = useState("");
  const [errorName, setErrorName] = useState("");
  const postSupplier = usePostSupplier();
  const isAdmin = isUserAdmin();

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
    <div
      className={`max-w-xl mx-auto bg-white shadow-md rounded-xl p-6 mt-8 border border-gray-200 space-y-6 ${
        !isAdmin ? "opacity-50" : ""
      }`}
    >
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        ➕ Create Supplier
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
            create suppliers.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="supplierId"
            className="block text-sm font-medium text-gray-700"
          >
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
            minLength={2}
            maxLength={100}
            value={supplierName}
            onChange={handleInputChange}
            placeholder="Enter supplier name (e.g. Kamba)"
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
            postSupplier.isPending ||
            !supplierName.trim() ||
            !supplierID.trim() ||
            errorID ||
            errorName
          }
          className={`w-full py-2 px-4 rounded-lg transition ${
            isAdmin
              ? "bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              : "bg-gray-400 text-gray-600 cursor-not-allowed"
          }`}
        >
          {postSupplier.isPending ? "Creating..." : "Create Supplier"}
        </button>
      </form>

      {postSupplier.isSuccess && (
        <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded-lg shadow-sm">
          <strong className="text-green-800 text-base flex items-center gap-2">
            ✅ Supplier created successfully!
          </strong>
        </div>
      )}

      {postSupplier.isError && (
        <div
          className={`p-4 border rounded-lg mt-6 ${
            getErrorStyling(postSupplier.error).container
          }`}
        >
          <p className="flex items-center gap-2">
            {getErrorStyling(postSupplier.error).icon} Error creating supplier:{" "}
            {getErrorMessage(postSupplier.error, "creating", "supplier")}
          </p>
        </div>
      )}
    </div>
  );
}

export default PostSupplier;

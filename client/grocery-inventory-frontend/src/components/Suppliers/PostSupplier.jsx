import { useState } from "react";
import { usePostSupplier } from "../../hooks/useSuppliers";

function PostSupplier() {
  const [supplierName, setSupplierName] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const postSupplier = usePostSupplier();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (supplierName === "") return;
    try {
      await postSupplier.mutateAsync({
        supplierID: supplierId,
        supplierName: supplierName,
      });
      setSupplierId("");
      setSupplierName("");
      console.log("Supplier created successfully!");
    } catch (error) {
      console.error("Failed to create supplier: ", error);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name == "supplierId"){
        setSupplierId(e.target.value);
    }
    if (e.target.name == "supplierName"){
        setSupplierName(e.target.value);
    }
  };

  return (
    <div className="supplier">
      <h1>📦 Create Supplier</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="supplierId"
          value={supplierId}
          onChange={handleInputChange}
          placeholder="Enter supplier ID..."
        />
        <input
          type="text"
          name="supplierName"
          value={supplierName}
          onChange={handleInputChange}
          placeholder="Enter supplier name..."
        />
        <button
          type="submit"
          disabled={postSupplier.isPending || supplierName === ""}
        >
          {postSupplier.isPending ? "Creating..." : "Create Supplier"}
        </button>
      </form>

      {postSupplier.isSuccess && (
        <div className="supplier-details">
          <h1>Supplier Details</h1>
          <p>✅ Supplier created successfully!</p>
          {postSupplier.data && (
            <p>
              Created: {postSupplier.data.supplierName} (ID:{" "}
              {postSupplier.data.supplierID})
            </p>
          )}
        </div>
      )}

      {postSupplier.isError && (
        <div className="supplier-error">
          <h1>Supplier error</h1>
          <p>
            Error in creating supplier:{" "}
            {postSupplier.error?.response?.data ||
              postSupplier.error?.message}
          </p>
        </div>
      )}
    </div>
  );
}

export default PostSupplier;
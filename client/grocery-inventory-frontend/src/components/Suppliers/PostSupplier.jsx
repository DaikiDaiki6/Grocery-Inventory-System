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
    if (supplierName === "") return;
    try {
      await postSupplier.mutateAsync({
        supplierID: supplierID,
        supplierName: supplierName,
      });
      setSupplierID("");
      setSupplierName("");
      console.log("Supplier created successfully!");
    } catch (error) {
      console.error("Failed to create supplier: ", error);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name == "supplierId") {
      setSupplierID(e.target.value);
      if (e.target.value === "") {
        setErrorID("");
      } else if (e.target.value.length !== 11) {
        setErrorID("⚠️ ID must be exactly 11 characters");
      } else {
        setErrorID("");
      }
    }
    if (e.target.name == "supplierName") {
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
  };

  return (
    <div className="supplier">
      <h1>➕ Create Supplier</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="supplierId"
          value={supplierID}
          minLength={11}
          maxLength={11}
          onChange={handleInputChange}
          placeholder="Enter supplier ID (e.g. 00-023-6666)"
        />
        {errorID && <div className="error-details">{errorID}</div>}
        <input
          type="text"
          name="supplierName"
          minLength={2}
          maxLength={100}
          value={supplierName}
          onChange={handleInputChange}
          placeholder="Enter supplier name (eg. supplier name (eg. Kamba)"
        />
        {errorName && <div className="error-details">{errorName}</div>}
        <button
          type="submit"
          disabled={postSupplier.isPending || supplierName === ""}
        >
          {postSupplier.isPending ? "Creating..." : "Create Supplier"}
        </button>
      </form>

      {postSupplier.isSuccess && (
        <div className="supplier-details">
          <strong>✅ Supplier created successfully!</strong>
          {postSupplier.data && (
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
                    <strong>{postSupplier.data.supplierName}</strong>
                  </td>
                  <td>{postSupplier.data.supplierID}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      )}

      {postSupplier.isError && (
        <div className="supplier-error">
          <h1>Supplier error</h1>
          <p>
            Error in creating supplier:{" "}
            {postSupplier.error?.response?.data || postSupplier.error?.message}
          </p>
        </div>
      )}
    </div>
  );
}

export default PostSupplier;

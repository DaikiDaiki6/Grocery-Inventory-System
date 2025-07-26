import { useState } from "react";
import { useGetSpecificSupplier } from "../../hooks/useSuppliers";

function GetSpecificSupplier() {
  const [searchId, setSearchId] = useState("");
  const [currentId, setCurrentId] = useState(null);
  const [errorID, setErrorID] = useState("");
  const {
    data: supplier,
    isLoading,
    error,
  } = useGetSpecificSupplier(currentId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchId.trim()) {
      setCurrentId(searchId);
    }
  };

  const handleInputChange = (e) => {
    setSearchId(e.target.value);
    if (e.target.value === "") {
      setErrorID("");
    } else if (e.target.value.length !== 11) {
      setErrorID("⚠️ ID must be exactly 11 characters");
    } else {
      setErrorID("");
    }
  };

  return (
    <div className="supplier">
      <h1>🚚🔍 Search Supplier</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="supplierID"
          minLength={11}
          maxLength={11}
          value={searchId}
          onChange={handleInputChange}
          placeholder="Enter Supplier ID (eg. 12-222-2112)"
        />
        {errorID && <div className="error-details">{errorID}</div>}
        <button type="submit" disabled={!searchId.trim()}>
          Search Supplier
        </button>
      </form>

      {currentId && (
        <div className="supplier-details">
          {isLoading && <p>Loading supplier...</p>}
          {error && (
            <p>
              Error Loading supplier:{" "}
              {typeof error.response?.data === "string"
                ? error.response.data
                : error.response?.data?.title || error.message}
            </p>
          )}

          {!isLoading && !error && supplier && (
            <div className="supplier-info">
              <table>
                <thead>
                  <tr>
                    <th>Suplier Name</th>
                    <th>ID</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>{supplier.supplierName}</strong>
                    </td>
                    <td>{supplier.supplierID}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GetSpecificSupplier;

import { useState } from "react";
import { useGetSpecificSupplier } from "../../hooks/useSuppliers";

function GetSpecificSupplier() {
  const [searchId, setSearchId] = useState("");
  const [currentId, setCurrentId] = useState(null);
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
  };

  return (
    <div className="supplier">
      <h1>🏬 Search Supplier</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="supplierID"
          value={searchId}
          onChange={handleInputChange}
          placeholder="Enter Supplier ID..."
          min={1}
        />
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
              <p>
                <strong>ID:</strong> {supplier.supplierID}
              </p>
              <p>
                <strong>Name:</strong> {supplier.supplierName}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GetSpecificSupplier;

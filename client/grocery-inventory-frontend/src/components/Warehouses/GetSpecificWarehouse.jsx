import { useState } from "react";
import { useGetSpecificWarehouse } from "../../hooks/useWarehouses";

function GetSpecificWarehouse() {
  const [searchId, setSearchId] = useState("");
  const [currentId, setCurrentId] = useState(null);
  const {
    data: warehouse,
    isLoading,
    error,
  } = useGetSpecificWarehouse(currentId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchId.trim()) {
      setCurrentId(parseInt(searchId));
    }
  };

  const handleInputChange = (e) => {
    setSearchId(e.target.value);
  };

  return (
    <div className="warehouse">
      <h1>🏬 Search Warehouse</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="warehouseID"
          value={searchId}
          onChange={handleInputChange}
          placeholder="Enter Warehouse ID..."
          min="1"
        />
        <button type="submit" disabled={!searchId.trim()}>
          Search Warehouse
        </button>
      </form>

      {currentId && (
        <div className="warehouse-details">
          {isLoading && <p>Loading warehouse...</p>}
          {error && (
            <p>
              Error Loading warehouse:{" "}
              {typeof error.response?.data === "string"
                ? error.response.data
                : error.response?.data?.title || error.message}
            </p>
          )}

          {!isLoading && !error && warehouse && (
            <div className="category-info">
              <p>
                <strong>ID:</strong> {warehouse.warehouseID}
              </p>
              <p>
                <strong>Name:</strong> {warehouse.warehouseName}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GetSpecificWarehouse;

import { useState } from "react";
import { useGetSpecificWarehouse } from "../../hooks/useWarehouses";

function GetSpecificWarehouse() {
  const [searchId, setSearchId] = useState("");
  const [currentId, setCurrentId] = useState(null);
  const [errorID, setErrorID] = useState("");
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
    if (e.target.value === "") {
      setErrorID("");
    } else if (e.target.value <= 0) {
      setErrorID("⚠️ ID must be 1 or greater.");
    } else {
      setErrorID("");
    }
  };

  return (
    <div className="warehouse">
      <h1>🏬🔍 Search Warehouse</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="warehouseID"
          value={searchId}
          onChange={handleInputChange}
          placeholder="Enter Warehouse ID (eg. 12)"
          min={1}
        />
        {errorID && <div className="error-details"> {errorID}</div>}
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
            <div className="warehouse-info">
              <table>
                <thead>
                  <tr>
                    <th>Warehouse Name</th>
                    <th>ID</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>{warehouse.warehouseName}</strong>
                    </td>
                    <td>{warehouse.warehouseID}</td>
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

export default GetSpecificWarehouse;

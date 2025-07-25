import { useState } from "react";
import { usePostWarehouse } from "../../hooks/useWarehouses";

function PostWarehouse() {
  const [warehouseName, setWarehouseName] = useState("");
  const [errorName, setErrorName] = useState("");
  const postWarehouse = usePostWarehouse();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (warehouseName == "") return;
    try {
      await postWarehouse.mutateAsync({
        warehouseName: warehouseName,
      });
      setWarehouseName("");
      console.log("Warehouse created successfully!");
    } catch (error) {
      console.error("Failed to create warehouse: ", error);
    }
  };

  const handleInputChange = (e) =>{
    setWarehouseName(e.target.value);
     if (e.target.value === "") {
      setErrorName("");
    } else if (e.target.value.length < 2) {
      setErrorName("⚠️ Name must be at least 2 characters");
    } else if (e.target.value.length > 100) {
      setErrorName("⚠️ Name cannot exceed 150 characters");
    } else {
      setErrorName("");
    }
  }

  return(
    <div className="warehouse">
      <h1>➕ Create Warehouse</h1>
    <form onSubmit={handleSubmit}>
        <input
          type="text"
          disabled
          placeholder="Warehouse ID will be auto-generated by the system..."
        />
        <input
          type="text"
          name="warehouseName"
          minLength={2}
          maxLength={100}
          value={warehouseName}
          onChange={handleInputChange}
          placeholder="Enter warehouse name (eg. Grove Street)"
        />
        {errorName && <div className="error-details">{errorName}</div>}
        <button
          type="submit"
          disabled={postWarehouse.isPending || warehouseName == ""}
        >
          {postWarehouse.isPending ? "Creating..." : "Create Warehouse"}
        </button>
      </form>

      {postWarehouse.isSuccess && (
        <div className="warehouse-details">
          <p>✅ Warehouse created successfully!</p>
          {postWarehouse.data && (
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
                    <strong>{postWarehouse.data.warehouseName}</strong>
                  </td>
                  <td>{postWarehouse.data.warehouseID}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      )}

      {postWarehouse.isError && (
        <div className="warehouse-error">
          <p>
            Error creating warehouse:{" "}
            {typeof postWarehouse.error?.response?.data === "string"
              ? postWarehouse.error.response.data
              : postWarehouse.error?.response?.data?.message ||
                postWarehouse.error?.message}
          </p>
        </div>
      )}

    </div>
  ) 
}

export default PostWarehouse;
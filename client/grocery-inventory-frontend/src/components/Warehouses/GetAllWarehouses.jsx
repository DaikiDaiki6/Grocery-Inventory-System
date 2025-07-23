import { useGetAllWarehouses } from "../../hooks/useWarehouses";

function GetAllWarehouses() {
  const { data: warehouses, isLoading, error } = useGetAllWarehouses();

  if (isLoading) {
    return <div>Loading warehouses...</div>;
  }

  if (error) {
    return <div>Error Loading warehouses: {error.message} </div>;
  }

  return (
    <div className="warehouses">
      <h1>📦 Warehouses</h1>

      <div className="list">
        {warehouses?.length === 0 ? (
          <p>No warehouses found in the database.</p>
        ) : (
          warehouses?.map((warehouse) => (
            <div key={warehouse.warehouseID} className="list-item">
              <div>
                <strong>ID:</strong> {warehouse.warehouseID}
                <strong> Name: </strong> {warehouse.warehouseName}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default GetAllWarehouses;

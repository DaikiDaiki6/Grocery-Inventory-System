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
      <h1>🏬 All Warehouses</h1>

      <div className="list">
        <table>
          <thead>
            <tr>
              <th>Warehouse Name</th>
              <th>ID</th>
            </tr>
          </thead>
          {warehouses?.length === 0 ? (
            <p>No warehouses found in the database.</p>
          ) : (
            warehouses?.map((warehouse) => (
              <tbody key={warehouse.warehouseID}>
                <tr>
                  <td>
                    <strong>{warehouse.warehouseName}</strong>
                  </td>
                  <td>{warehouse.warehouseID}</td>
                </tr>
              </tbody>
            ))
          )}
        </table>
      </div>
    </div>
  );
}

export default GetAllWarehouses;

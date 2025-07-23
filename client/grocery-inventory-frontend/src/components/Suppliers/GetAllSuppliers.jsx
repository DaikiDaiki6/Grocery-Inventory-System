import { useGetAllSuppliers } from "../../hooks/useSuppliers";

function GetAllSuppliers() {
  const { data: suppliers, isLoading, error } = useGetAllSuppliers();

  if (isLoading) {
    return <div>Loading suppliers...</div>;
  }

  if (error) {
    return <div>Error Loading suppliers: {error.message} </div>;
  }

  return (
    <div className="suppliers">
      <h1>📦 Suppliers</h1>

      <div className="list">
        {suppliers?.length === 0 ? (
          <p>No suppliers found in the database.</p>
        ) : (
          suppliers?.map((supplier) => (
            <div key={supplier.supplierID} className="list-item">
              <div>
                <strong>ID:</strong> {supplier.supplierID}
                <strong> Name: </strong> {supplier.supplierName}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default GetAllSuppliers;
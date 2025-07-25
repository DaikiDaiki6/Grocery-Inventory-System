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
      <h1>📦 All Suppliers</h1>

      <div className="list">
        <table>
          <thead>
            <tr>
              <th>Category Name</th>
              <th>ID</th>
            </tr>
          </thead>
          {suppliers?.length === 0 ? (
            <p>No suppliers found in the database.</p>
          ) : (
            suppliers?.map((supplier) => (
              <tbody key={supplier.supplierID}>
                <tr> 
                  <td><strong>{supplier.supplierName}</strong></td>
                  <td>{supplier.supplierID}</td>
                </tr>
                
              </tbody>
            ))
          )}
        </table>
      </div>
    </div>
  );
}

export default GetAllSuppliers;
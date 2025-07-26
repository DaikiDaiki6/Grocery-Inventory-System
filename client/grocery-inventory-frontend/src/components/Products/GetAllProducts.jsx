import { useGetAllProducts } from "../../hooks/useProducts";

function GetAllProducts() {
  const { data: products, isLoading, error } = useGetAllProducts();

  if (isLoading) {
    return <div>Loading Products...</div>;
  }
  if (error) {
    return <div>Error loading products: {error.message}</div>;
  }

  return (
    <div className="products">
      <h1>🥫 All Products</h1>

      <div className="list">
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>ID</th>
              <th>Category</th>
              <th>Supplier</th>
            </tr>
          </thead>
          {products?.length === 0 ? (
            <p>No suppliers found in the database.</p>
          ) : (
            products?.map((product) => (
              <tbody key={product.productID}>
                <tr>
                  <td>
                    <strong>{product.productName}</strong>
                  </td>
                  <td>{product.productID}</td>
                  <td>{product.category}</td>
                  <td>{product.supplier}</td>
                </tr>
              </tbody>
            ))
          )}
        </table>
      </div>
    </div>
  );
}

export default GetAllProducts;

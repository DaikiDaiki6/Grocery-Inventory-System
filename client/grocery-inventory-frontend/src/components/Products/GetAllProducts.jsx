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
      <h1>📦 Products</h1>

      <div className="list">
        {products?.length === 0 ? (
          <p>No products found in the database.</p>
        ) : (
          products?.map((product) => (
            <div key={product.productID} className="list-item">
              <div>
                <strong>ID: </strong> {product.productID}
                <strong>Product: </strong> {product.productName}
                <strong>Category: </strong> {product.category}
                <strong>Product: </strong> {product.supplier}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default GetAllProducts;

import { useState } from "react";
import { useGetSpecificProduct } from "../../hooks/useProducts";

function GetSpecificProduct() {
  const [searchId, setSearchId] = useState("");
  const [currentId, setCurrentId] = useState(null);
  const { data: product, isLoading, error } = useGetSpecificProduct(currentId);

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
    <div className="product">
      <h1> Search Product</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          // name = "searchId"
          value={searchId}
          onChange={handleInputChange}
          placeholder="Enter Product Id..."
        />
        <button type="submit" disabled={!searchId.trim()}>
          Search Product
        </button>
      </form>

      {currentId && (
        <div className="product-details">
          {isLoading && <p>Loading product...</p>}
          {error && (
            <p>
              Error Loading product:{" "}
              {error.message || error.response?.data?.title}
            </p>
          )}

          {!isLoading && !error && product && (
            <div className="product-info">
              <p>
                <strong>ID:</strong> {product.productID}
              </p>
              <p>
                <strong>Name:</strong> {product.productName}
              </p>
              <p>
                <strong>Category:</strong> {product.category}
              </p>
              <p>
                <strong>Supplier:</strong> {product.supplier}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GetSpecificProduct;

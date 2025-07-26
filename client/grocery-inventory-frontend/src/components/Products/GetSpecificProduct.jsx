import { useState } from "react";
import { useGetSpecificProduct } from "../../hooks/useProducts";

function GetSpecificProduct() {
  const [searchId, setSearchId] = useState("");
  const [currentId, setCurrentId] = useState(null);
  const [errorID, setErrorID] = useState("");
  const { data: product, isLoading, error } = useGetSpecificProduct(currentId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchId.trim()) {
      setCurrentId(searchId);
    }
  };

  const handleInputChange = (e) => {
    setSearchId(e.target.value);
    if (e.target.value === "") {
      setErrorID("");
    } else if (e.target.value.length !== 11) {
      setErrorID("⚠️ ID must be exactly 11 characters");
    } else {
      setErrorID("");
    }
  };

  return (
    <div className="product">
      <h1>🥫🔍 Search Product</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="searchId"
          minLength={11}
          maxLength={11}
          value={searchId}
          onChange={handleInputChange}
          placeholder="Enter Product Id (eg. 12-222-2112)"
        />
        {errorID && <div className="error-details">{errorID}</div>}
        <button type="submit" disabled={!searchId.trim()}>
          Search Product
        </button>
      </form>

      {currentId && (
        <div className="product-details">
          {isLoading && <p>Loading product...</p>}
          {error && (
            <p>
              Error Loading supplier:{" "}
              {typeof error.response?.data === "string"
                ? error.response.data
                : error.response?.data?.title || error.message}
            </p>
          )}

          {!isLoading && !error && product && (
            <div className="product-info">
              <table>
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>ID</th>
                    <th>Category</th>
                    <th>Supplier</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>{product.productName}</strong>
                    </td>
                    <td>{product.productID}</td>
                    <td>{product.category}</td>
                    <td>{product.supplier}</td>
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

export default GetSpecificProduct;

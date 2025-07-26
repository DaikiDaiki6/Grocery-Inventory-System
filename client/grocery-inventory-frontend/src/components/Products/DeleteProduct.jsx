import { useState } from "react";
import { useDeleteProduct } from "../../hooks/useProducts";

function DeleteProduct() {
  const [productID, setProductID] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errorID, setErrorID] = useState("");
  const deleteProduct = useDeleteProduct();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (productID.trim()) {
      if (!productID.trim()) return;
      setShowConfirmation(true);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteProduct.mutateAsync(productID);
      setProductID("");
      console.log("Product created successfully!");
    } catch (error) {
      console.error("Failed to delete product: ", error);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  const handleInputChange = (e) => {
    setProductID(e.target.value);
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
      <h1>🗑️ Delete Product</h1>

      {!showConfirmation ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="deleteId"
            minLength={11}
            maxLength={11}
            value={productID}
            onChange={handleInputChange}
            placeholder="Enter Product Id to delete..."
          />
          {errorID && <div className="error-details">{errorID}</div>}
          <button
            type="submit"
            disabled={deleteProduct.isPending || !productID.trim()}
          >
            Delete Product
          </button>
        </form>
      ) : (
        <div className="confirmation-dialog">
          <h2>⚠️ Confirm Deletion</h2>
          <p>
            Are you sure you want to delete product with ID{" "}
            <strong>{productID}</strong>?
          </p>
          <p style={{ color: "red" }}>This action cannot be undone!</p>
          <div className="button-group">
            <button
              onClick={handleConfirmDelete}
              disabled={deleteProduct.isPending}
              style={{ backgroundColor: "red", color: "white" }}
            >
              {deleteProduct.isPending ? "Deleting..." : "Yes, Delete"}
            </button>
            <button
              onClick={handleCancelDelete}
              disabled={deleteProduct.isPending}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {deleteProduct.isSuccess && (
        <div style={{ color: "green", marginTop: "1rem" }}>
          <h3>Success!</h3>
          <p>✅ Product deleted successfully!</p>
        </div>
      )}

      {deleteProduct.isError && (
        <div style={{ color: "red", marginTop: "1rem" }}>
          <h3>Error</h3>
          <p>
            Error deleting product:{" "}
            {typeof deleteProduct.error?.response?.data === "string"
              ? deleteProduct.error.response.data
              : deleteProduct.error?.response?.data?.title ||
                deleteProduct.error?.message}
          </p>
        </div>
      )}
    </div>
  );
}

export default DeleteProduct;

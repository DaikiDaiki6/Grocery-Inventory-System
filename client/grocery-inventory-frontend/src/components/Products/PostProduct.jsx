import { useState } from "react";
import { usePostProduct } from "../../hooks/useProducts";

function PostProduct() {
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [supplier, setSupplier] = useState("");
  const postProduct = usePostProduct();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !productId.trim() &&
      !productName.trim() &&
      !category.trim() &&
      !supplier.trim()
    )
      return;

    try {
      await postProduct.mutateAsync({
        productID: productId,
        productName: productName,
        categoryID: parseInt(category),
        supplierID: supplier,
      });
      setProductId("");
      setProductName("");
      setCategory("");
      setSupplier("");
      console.log("Product created successfully!");
    } catch (error) {
      console.error("Failed to create category: ", error);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name == "productId") {
      setProductId(e.target.value);
    }
    if (e.target.name == "productName") {
      setProductName(e.target.value);
    }
    if (e.target.name == "category") {
      setCategory(e.target.value);
    }
    if (e.target.name == "supplier") {
      setSupplier(e.target.value);
    }
  };

  return (
    <div className="product">
      <h1>Create Product</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name = "productId"
          value={productId}
          onChange={handleInputChange}
          placeholder="Enter product Id eg.12-123-1233"
        />
        <input
          type="text"
          name = "productName"
          value={productName}
          onChange={handleInputChange}
          placeholder="Enter product name"
        />
        <input
          type="number"
          name = "category"
          value={category}
          onChange={handleInputChange}
          placeholder="Enter category"
        />
        <input
          type="text"
          name = "supplier"
          value={supplier}
          onChange={handleInputChange}
          placeholder="Enter supplier Id eg.12-123-1233"
        />

        <button
          type="submit"
          disabled={
            postProduct.isPending ||
            (!productId.trim() &&
              !productName.trim() &&
              !category.trim() &&
              !supplier.trim())
          }
        >
          {postProduct.isPending ? "Creating... " : "Create Product"}
        </button>
      </form>

      {postProduct.isSuccess && (
        <div className="product-details">
          <h1>Product Details</h1>
          <p>Product created successfully!</p>
          {postProduct.data && (
            <p>
              Created: {postProduct.data.productName} (ID:{" "}
              {postProduct.data.productID} Category:{" "}
              {postProduct.data.categoryID} Supplier:{" "}
              {postProduct.data.supplierID})
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default PostProduct;

import { useState } from "react";
import { useDeleteProduct } from "../../hooks/useProducts";

function DeleteProduct() {
  const [deleteId, setDeleteId] = useState("");
  const deleteProduct = useDeleteProduct();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (deleteId.trim()) {
      try {
        await deleteProduct.mutateAsync(deleteId);
        setDeleteId("");
        console.log("Product created successfully!");
      } catch (error) {
        console.log("Failed to create product: ", error);
      }
    }
  };
  const handleInputChange = (e) => {
    setDeleteId(e.target.value);
  }

  return (
    <div className="product">
        <h1>Delete Product</h1>
        <form onSubmit={handleSubmit}>
            <input type="text"
            name = "deleteId"
            value = {deleteId}
            onChange = {handleInputChange}
            placeholder="Enter Product Id to delete..." />

            <button type="submit" disabled = {deleteProduct.isPending || !deleteId.trim()}>
                {deleteProduct.isPending ? "Deleting..." : "Delete Product"}
            </button>
        </form>
        {deleteProduct.isSuccess && (
            <div>
                <h1>Successfully deleted the product!</h1>
            </div>
        )}
    </div>
  )
}

export default DeleteProduct;

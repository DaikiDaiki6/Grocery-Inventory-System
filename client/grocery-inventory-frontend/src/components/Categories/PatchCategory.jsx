import { useState } from "react";
import { usePatchCategory } from "../../hooks/useCategories";

function PatchCategory() {
  const [patchId, setPatchId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const patchCategory = usePatchCategory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patchId.trim() || !categoryName.trim()) return;
    try {
      await patchCategory.mutateAsync({
        id: parseInt(patchId),
        data: {
          categoryName: categoryName.trim(),
        },
      });
      setPatchId("");
      setCategoryName("");
      console.log("Category patched successfully!");
    } catch (error) {
      console.error("Failed to patch category: ", error);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name == "categoryName") {
      setCategoryName(e.target.value);
    }
    if (e.target.name == "patchId") {
      setPatchId(e.target.value);
    }
  };

  return (
    <div className="category">
      <h1>📦 Patch Category</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="patchId"
          value={patchId}
          onChange={handleInputChange}
          placeholder="Enter category Id"
          min={1}
        />
        <input
          type="text"
          name="categoryName"
          value={categoryName}
          onChange={handleInputChange}
          placeholder="Enter category name"
        />
        <button
          type="submit"
          disabled={
            patchCategory.isPending || !patchId.trim() || !categoryName.trim()
          }
        >
          {patchCategory.isPending ? "Patching..." : "Patch Category"}
        </button>
      </form>

      {patchCategory.isSuccess && (
        <div className="category-details">
          <h1>Category Details</h1>
          <p>✅ Category updated successfully!</p>
          {patchCategory.data && (
            <p>
              Updated: {patchCategory.data.categoryName} (ID:{" "}
              {patchCategory.data.categoryID})
            </p>
          )}
        </div>
      )}

      {patchCategory.isError && (
        <div className="category-error">
          <h1>Category error</h1>
          <p>
            Error updating category :{" "}
            {patchCategory.error?.response?.data ||
              patchCategory.error?.message}
          </p>
        </div>
      )}
    </div>
  );
}

export default PatchCategory;

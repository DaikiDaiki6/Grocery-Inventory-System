import { useState } from "react";
import { usePatchCategory } from "../../hooks/useCategories";

function PatchCategory() {
  const [categoryID, setCategoryID] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [errorName, setErrorName] = useState("");
  const [errorID, setErrorID] = useState("");
  const patchCategory = usePatchCategory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryID.trim() || !categoryName.trim()) return;
    try {
      await patchCategory.mutateAsync({
        id: parseInt(categoryID),
        data: {
          categoryName: categoryName.trim(),
        },
      });
      setCategoryID("");
      setCategoryName("");
      console.log("Category patched successfully!");
    } catch (error) {
      console.error("Failed to patch category: ", error);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name == "categoryName") {
      setCategoryName(e.target.value);
      if (e.target.value === "") {
        setErrorName("");
      } else if (e.target.value.length < 2) {
        setErrorName("⚠️ Name must be at least 2 characters");
      } else if (e.target.value.length > 100) {
        setErrorName("⚠️ Name cannot exceed 100 characters");
      } else {
        setErrorName("");
      }
    }
    if (e.target.name == "categoryID") {
      setCategoryID(e.target.value);
      if (e.target.value === "") {
        setErrorID("");
      } else if (e.target.value <= 0) {
        setErrorID("⚠️ ID must be 1 or greater.");
      } else {
        setErrorID("");
      }
    }
  };

  return (
    <div className="category">
      <h1>✏️ Patch Category</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="categoryID"
          value={categoryID}
          onChange={handleInputChange}
          placeholder="Enter Category ID (eg. 12)"
          min={1}
        />
        {errorID && <div className="error-details">{errorID}</div>}
        <input
          type="text"
          name="categoryName"
          minLength={2}
          maxLength={100}
          value={categoryName}
          onChange={handleInputChange}
          placeholder="Enter Category Name (eg. Milk)"
        />
        {errorName && <div className="error-details">{errorName}</div>}
        <button
          type="submit"
          disabled={
            patchCategory.isPending ||
            !categoryID.trim() ||
            !categoryName.trim()
          }
        >
          {patchCategory.isPending ? "Patching..." : "Patch Category"}
        </button>
      </form>

      {patchCategory.isSuccess && (
        <div className="category-details">
          <strong>✅ Category updated successfully!</strong>
          {patchCategory.data && (
            <table>
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>ID</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>{patchCategory.data.categoryName}</strong>
                  </td>
                  <td>{patchCategory.data.categoryID}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      )}

      {patchCategory.isError && (
        <div className="category-error">
          <p>
            Error updating category :{" "}
            {typeof patchCategory.error?.response?.data === "string"
              ? patchCategory.error.response.data
              : patchCategory.error?.response?.data?.title ||
                patchCategory.error?.message}
          </p>
        </div>
      )}
    </div>
  );
}

export default PatchCategory;

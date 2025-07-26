import { useState } from "react";
import { useGetSpecificCategory } from "../../hooks/useCategories";

function GetSpecificCategory() {
  const [searchId, setSearchId] = useState("");
  const [currentId, setCurrentId] = useState(null);
  const [errorID, setErrorID] = useState("");
  const {
    data: category,
    isLoading,
    error,
  } = useGetSpecificCategory(currentId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchId.trim()) {
      setCurrentId(parseInt(searchId));
    }
  };

  const handleInputChange = (e) => {
    setSearchId(e.target.value);
    if (e.target.value === "") {
      setErrorID("");
    } else if (e.target.value <= 0) {
      setErrorID("⚠️ ID must be 1 or greater.");
    } else {
      setErrorID("");
    }
  };

  return (
    <div className="category">
      <h1>📦🔍 Search Category</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="categoryID"
          value={searchId}
          onChange={handleInputChange}
          placeholder="Enter Category ID (eg.12)"
          min={1}
        />
        {errorID && <div className="error-details"> {errorID}</div>}
        <button type="submit" disabled={!searchId.trim()}>
          Search Category
        </button>
      </form>

      {currentId && (
        <div className="category-details">
          {isLoading && <p>Loading category...</p>}
          {error && (
            <p>
              Error Loading category:{" "}
              {typeof error.response?.data === "string"
                ? error.response.data
                : error.response?.data?.title || error.message}
            </p>
          )}

          {!isLoading && !error && category && (
            <div className="category-info">
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
                      <strong>{category.categoryName}</strong>
                    </td>
                    <td>{category.categoryID}</td>
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

export default GetSpecificCategory;

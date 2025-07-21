import { useState } from "react";
import { useGetSpecificCategory } from "../../hooks/useCategories";

function GetSpecificCategory() {
  const [searchId, setSearchId] = useState("");
  const [currentId, setCurrentId] = useState(null);
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
  };

  return (
    <div className="category">
      <h1>📦 Search Category</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="categoryID"
          value={searchId}
          onChange={handleInputChange}
          placeholder="Enter Category ID..."
          min="1"
        />
        <button type="submit" disabled={!searchId.trim()}>
          Search Category
        </button>
      </form>

      {currentId && (
        <div className="category-details">
          {isLoading && <p>Loading category...</p>}
          {error && <p>Error Loading category: {error.response?.data || error.message}</p>}

          {!isLoading && !error && category && (
            <div className="category-info">
              <p>
                <strong>ID:</strong> {category.categoryID}
              </p>
              <p>
                <strong>Name:</strong> {category.categoryName}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GetSpecificCategory;

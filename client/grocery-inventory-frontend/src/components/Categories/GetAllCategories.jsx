import { useGetAllCategories } from "../../hooks/useCategories";

function GetAllCategories() {
  const { data: categories, isLoading, error } = useGetAllCategories();

  if (isLoading) {
    return <div>Loading categories...</div>;
  }

  if (error) {
    return <div>Error Loading categories: {error.message}</div>;
  }

  return (
    <div className="component-main-div">
      <h1>📦 All Categories</h1>

      <div className="list">
        <table>
          <thead>
            <tr>
              <th>Category Name</th>
              <th>ID</th>
            </tr>
          </thead>
          {categories?.length === 0 ? (
            <p>No categories found in the database.</p>
          ) : (
            categories?.map((category) => (
              <tbody key={category.categoryID}>
                <tr> 
                  <td><strong>{category.categoryName}</strong></td>
                  <td>{category.categoryID}</td>
                </tr>
                
              </tbody>
            ))
          )}
        </table>
      </div>
    </div>
  );
}

export default GetAllCategories;

import { useGetAllCategories } from "../../hooks/useCategories";

function GetAllCategories() {
  const { data: categories, isLoading, error } = useGetAllCategories();

  if (isLoading){
    return <div>Loading categories...</div>
  }

  if(error){
    return <div>Error Loading categories: {error.message}</div>
  }

  return(
    <div className="categories">
        <h1>📦 Categories</h1>

        <div className="list">
            {categories?.length === 0 ? (
                <p>No categories found in the database.</p>
            ) : (
                categories?.map((category) => (
                    <div key={category.categoryID} className="list-item">
                        <div>
                            <strong>ID:</strong> {category.categoryID}
                            <strong> Name: </strong> {category.categoryName}
                        </div>
                    </div>
                ))
            )}
        </div>



    </div>
  )
}

export default GetAllCategories

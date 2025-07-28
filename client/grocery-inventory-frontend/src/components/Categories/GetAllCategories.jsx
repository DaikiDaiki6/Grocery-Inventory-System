import { useGetAllCategories } from "../../hooks/useCategories";

function GetAllCategories() {
  const { data: categories, isLoading, error } = useGetAllCategories();

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-2xl shadow-md text-gray-700">
        <p>🔄 Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-100 text-red-700 rounded-2xl shadow-md">
        <p>
          ❌ Error loading categories:{" "}
          {typeof error.response?.data === "string"
            ? error.response.data
            : error.response?.data?.title || error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md space-y-4">
      <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
        📦 All Categories
      </h1>

      {categories?.length === 0 ? (
        <p className="text-gray-600 italic">No categories found in the database.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-xl overflow-hidden text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-800 text-sm uppercase">
              <tr>
                <th className="px-4 py-3 border-b">Category Name</th>
                <th className="px-4 py-3 border-b">ID</th>
              </tr>
            </thead>
            <tbody>
              {categories?.map((category) => (
                <tr key={category.categoryID} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 border-b font-medium">
                    {category.categoryName}
                  </td>
                  <td className="px-4 py-3 border-b">{category.categoryID}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default GetAllCategories;

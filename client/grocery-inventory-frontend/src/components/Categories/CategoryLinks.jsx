import { Link } from "@tanstack/react-router";

export default function CategoryLinks() {
  return (
    <nav className="bg-gray-100 border border-gray-300 rounded-lg shadow-sm my-4 mx-auto max-w-5xl">
      <ul className="flex flex-wrap justify-center gap-4 p-4 text-sm font-medium text-gray-700">
        <li>
          <Link
            to="/category/create"
            className="px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            Create Category
          </Link>
        </li>
        <li>
          <Link
            to="/category/update"
            className="px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            Update Category
          </Link>
        </li>
        <li>
          <Link
            to="/category/delete"
            className="px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            Delete Category
          </Link>
        </li>
        <li>
          <Link
            to="/category/search"
            className="px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            Search by ID
          </Link>
        </li>
        <li>
          <Link
            to="/category/all"
            className="px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            All Categories
          </Link>
        </li>
      </ul>
    </nav>
  );
}

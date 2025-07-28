import { Link } from "@tanstack/react-router";

export default function ProductLinks() {
  return (
    <nav className="bg-gray-100 border border-gray-300 rounded-lg shadow-sm my-4 mx-auto max-w-5xl">
      <ul className="flex flex-wrap justify-center gap-4 p-4 text-sm font-medium text-gray-700">
        <li>
          <Link
            to="/product/create"
            className="px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            Create Product
          </Link>
        </li>
        <li>
          <Link
            to="/product/update"
            className="px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            Update Product
          </Link>
        </li>
        <li>
          <Link
            to="/product/replace"
            className="px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            Replace Product
          </Link>
        </li>
        <li>
          <Link
            to="/product/delete"
            className="px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            Delete Product
          </Link>
        </li>
        <li>
          <Link
            to="/product/search"
            className="px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            Search by ID
          </Link>
        </li>
        <li>
          <Link
            to="/product/all"
            className="px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            All Products
          </Link>
        </li>
      </ul>
    </nav>
  );
}

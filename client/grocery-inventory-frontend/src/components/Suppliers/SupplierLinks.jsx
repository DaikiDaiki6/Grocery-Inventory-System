import { Link } from "@tanstack/react-router";

export default function SupplierLinks() {
  return (
    <nav className="bg-gray-100 border border-gray-300 rounded-lg shadow-sm my-4 mx-auto max-w-5xl">
      <ul className="flex flex-wrap justify-center gap-4 p-4 text-sm font-medium text-gray-700">
        <li>
          <Link
            to="/supplier/create"
            className="px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            Create Supplier
          </Link>
        </li>
        <li>
          <Link
            to="/supplier/update"
            className="px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            Update Supplier
          </Link>
        </li>
        <li>
          <Link
            to="/supplier/delete"
            className="px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            Delete Supplier
          </Link>
        </li>
        <li>
          <Link
            to="/supplier/search"
            className="px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            Search by ID
          </Link>
        </li>
        <li>
          <Link
            to="/supplier/all"
            className="px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            All Suppliers
          </Link>
        </li>
      </ul>
    </nav>
  );
}

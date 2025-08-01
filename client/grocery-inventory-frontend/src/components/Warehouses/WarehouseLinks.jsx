import { Link } from "@tanstack/react-router";

export default function WarehouseLinks() {
  return (
    <nav className="bg-gray-100 border border-gray-300 rounded-lg shadow-sm my-4 mx-auto max-w-5xl">
      <ul className="flex flex-wrap justify-center gap-4 p-4 text-sm font-medium text-gray-700">
        <li>
          <Link
            to="/warehouse/create"
            className="px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            Create Warehouse
          </Link>
        </li>
        <li>
          <Link
            to="/warehouse/update"
            className="px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            Update Warehouse
          </Link>
        </li>
        <li>
          <Link
            to="/warehouse/delete"
            className="px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            Delete Warehouse
          </Link>
        </li>
        <li>
          <Link
            to="/warehouse/search"
            className="px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            Search by ID
          </Link>
        </li>
        <li>
          <Link
            to="/warehouse/all"
            className="px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            All Warehouses
          </Link>
        </li>
      </ul>
    </nav>
  );
}

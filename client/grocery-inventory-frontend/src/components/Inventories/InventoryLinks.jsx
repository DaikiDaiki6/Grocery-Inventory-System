import { Link } from "@tanstack/react-router";

export default function InventoryLinks() {
  return (
    <nav className="bg-gray-100 border border-gray-300 rounded-lg shadow-sm my-4 mx-auto max-w-5xl">
      <ul className="flex flex-wrap justify-center gap-4 p-4 text-sm font-medium text-gray-700">
        <li>
          <Link
            to="/inventory/create"
            className="px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            Create Inventory
          </Link>
        </li>
        <li>
          <Link
            to="/inventory/update"
            className="px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            Update Inventory
          </Link>
        </li>
        <li>
          <Link
            to="/inventory/replace"
            className="px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            Replace Inventory
          </Link>
        </li>
        <li>
          <Link
            to="/inventory/delete"
            className="px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            Delete Inventory
          </Link>
        </li>
        <li>
          <Link
            to="/inventory/search"
            className="px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            Search by ID
          </Link>
        </li>
        <li>
          <Link
            to="/inventory/all"
            className="px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            All Inventories
          </Link>
        </li>
      </ul>
    </nav>
  );
}

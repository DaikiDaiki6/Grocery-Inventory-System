import { Link } from "@tanstack/react-router";

export default function Links() {
  return (
    <div className="flex justify-center items-start gap-8 p-6">
      {/* Left side: Welcome message */}
      <div className="max-w-md text-left space-y-2">
        <div className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full uppercase tracking-wide">
          Inventory Made Simple
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
          Welcome to{" "}
          <span className="text-green-700">Grocery Inventory System</span>
        </h1>

        <p className="text-gray-600 text-base">
          Organize and monitor your categories, products, suppliers,
          inventories, and warehouses from one easy-to-use dashboard.
        </p>
      </div>

      {/* Vertical Divider */}
      <div className="border-l border-gray-300 h-auto"></div>

      {/* Right side: Navigation links as buttons */}
      <div>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link
                to="/category"
                className="inline-block w-full px-4 py-2 bg-gray-900 text-white text-center rounded hover:bg-gray-700 transition"
              >
                Category
              </Link>
            </li>
            <li>
              <Link
                to="/product"
                className="inline-block w-full px-4 py-2 bg-gray-900 text-white text-center rounded hover:bg-gray-700 transition"
              >
                Product
              </Link>
            </li>
            <li>
              <Link
                to="/supplier"
                className="inline-block w-full px-4 py-2 bg-gray-900 text-white text-center rounded hover:bg-gray-700 transition"
              >
                Supplier
              </Link>
            </li>
            <li>
              <Link
                to="/inventory"
                className="inline-block w-full px-4 py-2 bg-gray-900 text-white text-center rounded hover:bg-gray-700 transition"
              >
                Inventory
              </Link>
            </li>
            <li>
              <Link
                to="/warehouse"
                className="inline-block w-full px-4 py-2 bg-gray-900 text-white text-center rounded hover:bg-gray-700 transition"
              >
                Warehouses
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

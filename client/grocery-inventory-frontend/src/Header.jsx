import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <Link
            to="/"
            className="text-2xl font-bold tracking-wide hover:text-gray-300 transition flex"
          >
            <img src="/vite.svg" alt="logo" className="h-8 w-auto pr-4" />
            Grocery Inventory
          </Link>
        </div>

        <nav className="space-x-6 text-sm font-medium">
          <Link to="/" className="hover:text-gray-400 transition">
            Home
          </Link>
          <Link to="#" className="hover:text-gray-400 transition">
            Sign In
          </Link>
          <Link to="#" className="hover:text-gray-400 transition">
            Logout
          </Link>
        </nav>
      </div>
    </header>
  );
}

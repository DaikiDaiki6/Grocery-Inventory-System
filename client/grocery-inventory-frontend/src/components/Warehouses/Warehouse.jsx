import { Link } from "@tanstack/react-router";


export default function Layout() {
  return (
    <div>
      <nav>
            <ul>
              <li>
                <Link to="/create">Create Warehouse</Link>
              </li>
              <li>
                <Link to="/delete">Delete Warehouse</Link>
              </li>
              <li>
                <Link to="/search">Search Warehouse by ID</Link>
              </li>
              <li>
                <Link to="/all">All Warehouse</Link>
              </li>
              <li>
                <Link to="/update">Update Warehouse</Link>
              </li>
            </ul>
          </nav>
    </div>
  );
}

import { Link, Outlet } from "@tanstack/react-router";

export default function SuppliersLayout() {
  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/supplier/create">Create Supplier</Link></li>
          <li><Link to="/supplier/update">Update Supplier</Link></li>
          <li><Link to="/supplier/delete">Delete Supplier</Link></li>
          <li><Link to="/supplier/search">Search Supplier by ID</Link></li>
          <li><Link to="/supplier/all">All Suppliers</Link></li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
}

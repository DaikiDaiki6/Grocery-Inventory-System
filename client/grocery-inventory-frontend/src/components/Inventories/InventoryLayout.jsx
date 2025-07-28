import { Link, Outlet } from "@tanstack/react-router";

export default function InventoryLayout() {
  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/inventory/create">Create Inventory</Link></li>
          <li><Link to="/inventory/update">Update Inventory</Link></li>
          <li><Link to="/inventory/replace">Replace Inventory</Link></li>
          <li><Link to="/inventory/delete">Delete Inventory</Link></li>
          <li><Link to="/inventory/search">Search Inventory by ID</Link></li>
          <li><Link to="/inventory/all">All Inventories</Link></li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
}

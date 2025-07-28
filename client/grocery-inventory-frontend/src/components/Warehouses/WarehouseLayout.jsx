import { Link, Outlet } from "@tanstack/react-router";

export default function WarehouseLayout() {
  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/warehouse/create">Create Warehouse</Link></li>
          <li><Link to="/warehouse/update">Update Warehouse</Link></li>
          <li><Link to="/warehouse/delete">Delete Warehouse</Link></li>
          <li><Link to="/warehouse/search">Search Warehouse by ID</Link></li>
          <li><Link to="/warehouse/all">All Warehouses</Link></li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
}

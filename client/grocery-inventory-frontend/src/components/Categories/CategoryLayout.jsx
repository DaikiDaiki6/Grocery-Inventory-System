import { Link, Outlet } from "@tanstack/react-router";

export default function CategoryLayout() {
  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/category/create">Create Category</Link></li>
          <li><Link to="/category/update">Update Category</Link></li>
          <li><Link to="/category/delete">Delete Category</Link></li>
          <li><Link to="/category/search">Search Category by ID</Link></li>
          <li><Link to="/category/all">All Categories</Link></li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
}

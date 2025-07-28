import { Link, Outlet } from "@tanstack/react-router";

export default function ProductLayout() {
  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/product/create">Create Product</Link></li>
          <li><Link to="/product/update">Update Product</Link></li>
          <li><Link to="/product/replace">Replace Product</Link></li>
          <li><Link to="/product/delete">Delete Product</Link></li>
          <li><Link to="/product/search">Search Product by ID</Link></li>
          <li><Link to="/product/all">All Products</Link></li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
}

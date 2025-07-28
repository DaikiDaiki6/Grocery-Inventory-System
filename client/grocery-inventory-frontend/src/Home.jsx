import { Link } from "@tanstack/react-router";

export default function Links() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/category">Category</Link>
        </li>
        <li>
          <Link to="/product">Product</Link>
        </li>
        <li>
          <Link to="/supplier">Supplier</Link>
        </li>
        <li>
          <Link to="/inventory">Inventory</Link>
        </li>
        <li>
          <Link to="/warehouse">Warehouses</Link>
        </li>
      </ul>
    </nav>
  );
}

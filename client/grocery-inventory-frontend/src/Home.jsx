import { Link } from '@tanstack/react-router';

export default function Links(){
    return (
        <nav>
      <ul>
        <li>
          <Link to="/create-warehouse">Create Warehouse</Link>
        </li>
        <li>
          <Link to="/update-warehouse">Update Warehouse</Link>
        </li>
        <li>
          <Link to="/delete-warehouse">Delete Warehouse</Link>
        </li>
        <li>
          <Link to="/search-warehouse">Search Warehouse</Link>
        </li>
        <li>
          <Link to="/all-warehouses">All Warehouses</Link>
        </li>
      </ul>
    </nav>
    )
}
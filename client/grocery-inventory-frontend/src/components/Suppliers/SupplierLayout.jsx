import { Outlet } from "@tanstack/react-router";
import SupplierLinks from "./SupplierLinks";

export default function SuppliersLayout() {
  return (
    <div>
      <SupplierLinks />
      <Outlet />
    </div>
  );
}

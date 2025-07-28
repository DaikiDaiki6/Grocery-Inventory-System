import { Outlet } from "@tanstack/react-router";
import InventoryLinks from "./InventoryLinks";

export default function InventoryLayout() {
  return (
    <div>
      <InventoryLinks />
      <Outlet />
    </div>
  );
}

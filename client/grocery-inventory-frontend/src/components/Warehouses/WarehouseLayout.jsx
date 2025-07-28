import { Outlet } from "@tanstack/react-router";
import WarehouseLinks from "./WarehouseLinks";
export default function WarehouseLayout() {
  return (
    <div>
      <WarehouseLinks />
      <Outlet />
    </div>
  );
}

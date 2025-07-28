import { Outlet } from "@tanstack/react-router";
import ProductLinks from "./ProductLinks";
export default function ProductLayout() {
  return (
    <div>
      <ProductLinks/>
      <Outlet />
    </div>
  );
}

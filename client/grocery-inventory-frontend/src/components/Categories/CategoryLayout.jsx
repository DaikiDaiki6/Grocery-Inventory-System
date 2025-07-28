import { Outlet } from "@tanstack/react-router";
import CategoryLinks from "./CategoryLinks";

export default function CategoryLayout() {
  return (
    <div>
      <CategoryLinks/>
      <Outlet />
    </div>
  );
}

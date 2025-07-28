import { createRootRoute, createRoute } from "@tanstack/react-router";
import DeleteWarehouse from "../components/Warehouses/DeleteWarehouse";
import GetAllWarehouses from "../components/Warehouses/GetAllWarehouses";
import GetSpecificWarehouse from "../components/Warehouses/GetSpecificWarehouse";
import PatchWarehouse from "../components/Warehouses/PatchWarehouse";
import PostWarehouse from "../components/Warehouses/PostWarehouse";
import WarehouseLayout from "../components/Warehouses/WarehouseLayout";
import { rootRoute } from "./router";
import NotFound from "../components/NotFound";

export const warehouseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/warehouse",
  component: WarehouseLayout,
  notFoundComponent: NotFound,
});

const postWarehouseRoute = createRoute({
  getParentRoute: () => warehouseRoute,
  path: "/create",
  component: PostWarehouse,
});

const getAllWarehousesRoute = createRoute({
  getParentRoute: () => warehouseRoute,
  path: "/all",
  component: GetAllWarehouses,
});

const getSpecificWarehouseRoute = createRoute({
  getParentRoute: () => warehouseRoute,
  path: "/search",
  component: GetSpecificWarehouse,
});

const patchWarehouseRoute = createRoute({
  getParentRoute: () => warehouseRoute,
  path: "/update",
  component: PatchWarehouse,
});

const deleteWarehouseRoute = createRoute({
  getParentRoute: () => warehouseRoute,
  path: "/delete",
  component: DeleteWarehouse,
});

warehouseRoute.addChildren([
  postWarehouseRoute,
  getAllWarehousesRoute,
  getSpecificWarehouseRoute,
  patchWarehouseRoute,
  deleteWarehouseRoute,
]);

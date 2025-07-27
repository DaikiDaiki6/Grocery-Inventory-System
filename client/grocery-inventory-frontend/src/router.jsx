import {
  createRootRoute,
  createRouter,
  createRoute,
} from "@tanstack/react-router";
import Layout from "./Layout";
import PostWarehouse from "./components/Warehouses/PostWarehouse";
import PatchWarehouse from "./components/Warehouses/PatchWarehouse";
import DeleteWarehouse from "./components/Warehouses/DeleteWarehouse";
import GetSpecificWarehouse from "./components/Warehouses/GetSpecificWarehouse";
import GetAllWarehouses from "./components/Warehouses/GetAllWarehouses";
import NotFound from './components/NotFound';

const rootRoute = createRootRoute({
  component: Layout,
  notFoundComponent: NotFound,
});

const postWarehouseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/create-warehouse",
  component: PostWarehouse,
});

const patchWarehouseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/update-warehouse",
  component: PatchWarehouse,
});

const deleteWarehouseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/delete-warehouse",
  component: DeleteWarehouse,
});

const getSpecificWarehouseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/search-warehouse",
  component: GetSpecificWarehouse,
});

const getAllWarehousesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/all-warehouses",
  component: GetAllWarehouses,
});


const routeTree = rootRoute.addChildren([
  postWarehouseRoute,
  patchWarehouseRoute,
  deleteWarehouseRoute,
  getAllWarehousesRoute,
  getSpecificWarehouseRoute,
]);

export const router = createRouter({ routeTree });

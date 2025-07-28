import {
  createRootRoute,
  createRouter,
  createRoute,
} from "@tanstack/react-router";
import Layout from "../Layout";
import NotFound from "../components/NotFound";
import Warehouse from "../components/Warehouses/Warehouse";

const rootRoute = createRootRoute({
  component: Layout,
  notFoundComponent: NotFound,
});

const warehouseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/warehouse",
  component: Warehouse,
});

const routeTree = rootRoute.addChildren([
  warehouseRoute
]);

export const router = createRouter({ routeTree });

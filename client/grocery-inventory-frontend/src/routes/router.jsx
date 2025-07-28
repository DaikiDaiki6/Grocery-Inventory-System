import {
  createRootRoute,
  createRouter,
  createRoute,
} from "@tanstack/react-router";
import Layout from "../Layout";
import NotFound from "../components/NotFound";
import { warehouseRoute } from "./warehouseRouter";
import { categoryRoute } from "./categoryRouter";
import { productRoute } from "./productRouter";
import { inventoryRoute } from "./inventoryRouter";
import { supplierRoute } from "./supplierRouter";

export const rootRoute = createRootRoute({
  component: Layout,
  notFoundComponent: NotFound,
});

const routeTree = rootRoute.addChildren([
  warehouseRoute,
  categoryRoute,
  productRoute,
  inventoryRoute,
  supplierRoute,
]);

export const router = createRouter({ routeTree });

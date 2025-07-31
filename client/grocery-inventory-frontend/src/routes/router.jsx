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
import Home from "../Home";
import AuthTest from "../components/AuthTest";
import SessionManager from "../components/SessionManager";

export const rootRoute = createRootRoute({
  component: Layout,
  notFoundComponent: NotFound,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const authTestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth-test",
  component: AuthTest,
});

const sessionManagerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/session",
  component: SessionManager,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  authTestRoute,
  sessionManagerRoute,
  warehouseRoute,
  categoryRoute,
  productRoute,
  inventoryRoute,
  supplierRoute,
]);

export const router = createRouter({ routeTree });

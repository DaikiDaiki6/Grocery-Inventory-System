import { createRoute } from "@tanstack/react-router";
import InventoryLayout from "../components/Inventories/InventoryLayout";
import PostInventory from "../components/Inventories/PostInventory";
import PatchInventory from "../components/Inventories/PatchInventory";
import PutInventory from "../components/Inventories/PutInventory";
import DeleteInventory from "../components/Inventories/DeleteInventory";
import GetAllInventories from "../components/Inventories/GetAllInventories";
import GetSpecificInventory from "../components/Inventories/GetSpecificInventory";
import { rootRoute } from "./router";
import NotFound from "../components/NotFound";

export const inventoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/inventory",
  component: InventoryLayout,
  notFoundComponent: NotFound,
});

const postInventoryRoute = createRoute({
  getParentRoute: () => inventoryRoute,
  path: "/create",
  component: PostInventory,
});

const patchInventoryRoute = createRoute({
  getParentRoute: () => inventoryRoute,
  path: "/update",
  component: PatchInventory,
});

const putInventoryRoute = createRoute({
  getParentRoute: () => inventoryRoute,
  path: "/replace",
  component: PutInventory,
});

const deleteInventoryRoute = createRoute({
  getParentRoute: () => inventoryRoute,
  path: "/delete",
  component: DeleteInventory,
});

const getAllInventoriesRoute = createRoute({
  getParentRoute: () => inventoryRoute,
  path: "/all",
  component: GetAllInventories,
});

const getSpecificInventoryRoute = createRoute({
  getParentRoute: () => inventoryRoute,
  path: "/search",
  component: GetSpecificInventory,
});

inventoryRoute.addChildren([
  postInventoryRoute,
  patchInventoryRoute,
  putInventoryRoute,
  deleteInventoryRoute,
  getAllInventoriesRoute,
  getSpecificInventoryRoute,
]);

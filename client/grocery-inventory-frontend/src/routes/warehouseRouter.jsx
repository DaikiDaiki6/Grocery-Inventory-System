import { createRootRoute, createRoute } from "@tanstack/react-router";
import DeleteWarehouse from "../components/Warehouses/DeleteWarehouse";
import GetAllWarehouses from '../components/Warehouses/GetAllWarehouses';
import GetSpecificWarehouse from '../components/Warehouses/GetSpecificWarehouse';
import PatchWarehouse from '../components/Warehouses/PatchWarehouse';
import PostWarehouse from '../components/Warehouses/PostWarehouse';
import Warehouse from '../components/Warehouses/Warehouse'

const warehouseRoute = createRoute({
  getParentRoute: () => Warehouse,
  path: "/warehouse",
  component: Warehouse,
});

const postWarehouseRoute = createRoute({
  getParentRoute: () => Warehouse,
  path: "/create",
  component: Warehouse,
});

const getAllWarehousesRoute = createRoute({
  getParentRoute: () => Warehouse,
  path: "/all",
  component: Warehouse,
});

const getSpecificWarehouseRoute = createRoute({
  getParentRoute: () => Warehouse,
  path: "/search",
  component: Warehouse,
});

const patchWarehouseRoute = createRoute({
  getParentRoute: () => Warehouse,
  path: "/update",
  component: Warehouse,
});

const deleteWarehouseRoute = createRoute({
  getParentRoute: () => Warehouse,
  path: "/delete",
  component: Warehouse,
});
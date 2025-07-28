import { createRoute } from "@tanstack/react-router";
import SupplierLayout from "../components/Suppliers/SupplierLayout";
import PostSupplier from "../components/Suppliers/PostSupplier";
import PatchSupplier from "../components/Suppliers/PatchSupplier";
import DeleteSupplier from "../components/Suppliers/DeleteSupplier";
import GetAllSuppliers from "../components/Suppliers/GetAllSuppliers";
import GetSpecificSupplier from "../components/Suppliers/GetSpecificSupplier";
import { rootRoute } from "./router";
import NotFound from "../components/NotFound";

export const supplierRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/supplier",
  component: SupplierLayout,
  notFoundComponent: NotFound,
});

const postSupplierRoute = createRoute({
  getParentRoute: () => supplierRoute,
  path: "/create",
  component: PostSupplier,
});

const patchSupplierRoute = createRoute({
  getParentRoute: () => supplierRoute,
  path: "/update",
  component: PatchSupplier,
});

const deleteSupplierRoute = createRoute({
  getParentRoute: () => supplierRoute,
  path: "/delete",
  component: DeleteSupplier,
});

const getAllSuppliersRoute = createRoute({
  getParentRoute: () => supplierRoute,
  path: "/all",
  component: GetAllSuppliers,
});

const getSpecificSupplierRoute = createRoute({
  getParentRoute: () => supplierRoute,
  path: "/search",
  component: GetSpecificSupplier,
});

supplierRoute.addChildren([
  postSupplierRoute,
  patchSupplierRoute,
  deleteSupplierRoute,
  getAllSuppliersRoute,
  getSpecificSupplierRoute,
]);

import { createRoute } from "@tanstack/react-router";
import ProductLayout from "../components/Products/ProductLayout";
import PostProduct from "../components/Products/PostProduct";
import PatchProduct from "../components/Products/PatchProduct";
import PutProduct from "../components/Products/PutProduct";
import DeleteProduct from "../components/Products/DeleteProduct";
import GetAllProducts from "../components/Products/GetAllProducts";
import GetSpecificProduct from "../components/Products/GetSpecificProduct";
import { rootRoute } from "./router";
import NotFound from "../components/NotFound";

export const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/product",
  component: ProductLayout,
  notFoundComponent: NotFound,
});

const postProductRoute = createRoute({
  getParentRoute: () => productRoute,
  path: "/create",
  component: PostProduct,
});

const patchProductRoute = createRoute({
  getParentRoute: () => productRoute,
  path: "/update",
  component: PatchProduct,
});

const putProductRoute = createRoute({
  getParentRoute: () => productRoute,
  path: "/replace",
  component: PutProduct,
});

const deleteProductRoute = createRoute({
  getParentRoute: () => productRoute,
  path: "/delete",
  component: DeleteProduct,
});

const getAllProductsRoute = createRoute({
  getParentRoute: () => productRoute,
  path: "/all",
  component: GetAllProducts,
});

const getSpecificProductRoute = createRoute({
  getParentRoute: () => productRoute,
  path: "/search",
  component: GetSpecificProduct,
});

productRoute.addChildren([
  postProductRoute,
  patchProductRoute,
  putProductRoute,
  deleteProductRoute,
  getAllProductsRoute,
  getSpecificProductRoute,
]);

import { createRoute } from "@tanstack/react-router";
import CategoryLayout from "../components/Categories/CategoryLayout";
import PostCategory from "../components/Categories/PostCategory";
import PatchCategory from "../components/Categories/PatchCategory";
import DeleteCategory from "../components/Categories/DeleteCategory";
import GetAllCategories from "../components/Categories/GetAllCategories";
import GetSpecificCategory from "../components/Categories/GetSpecificCategory";
import { rootRoute } from "./router";
import NotFound from "../components/NotFound";

export const categoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/category",
  component: CategoryLayout,
  notFoundComponent: NotFound,
});

const postCategoryRoute = createRoute({
  getParentRoute: () => categoryRoute,
  path: "/create",
  component: PostCategory,
});

const patchCategoryRoute = createRoute({
  getParentRoute: () => categoryRoute,
  path: "/update",
  component: PatchCategory,
});

const deleteCategoryRoute = createRoute({
  getParentRoute: () => categoryRoute,
  path: "/delete",
  component: DeleteCategory,
});

const getAllCategoriesRoute = createRoute({
  getParentRoute: () => categoryRoute,
  path: "/all",
  component: GetAllCategories,
});

const getSpecificCategoryRoute = createRoute({
  getParentRoute: () => categoryRoute,
  path: "/search",
  component: GetSpecificCategory,
});

categoryRoute.addChildren([
  postCategoryRoute,
  patchCategoryRoute,
  deleteCategoryRoute,
  getAllCategoriesRoute,
  getSpecificCategoryRoute,
]);

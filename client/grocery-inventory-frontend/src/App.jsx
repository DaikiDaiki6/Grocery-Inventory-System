import { useState } from "react";
import GetAllCategories from "./components/Categories/GetAllCategories";
import PostCategory from "./components/Categories/PostCategory";
import GetSpecificCategory from "./components/Categories/GetSpecificCategory";
import PatchCategory from "./components/Categories/PatchCategory";
import DeleteCategory from "./components/Categories/DeleteCategory";

import GetAllInventories from "./components/Inventories/GetAllInventories";
import PostInventory from "./components/Inventories/PostInventory";
import GetSpecificInventory from "./components/Inventories/GetSpecificInventory";
import PatchInventory from "./components/Inventories/PatchInventory";
import PutInventory from "./components/Inventories/PutInventory";
import DeleteInventory from "./components/Inventories/DeleteInventory";

import GetAllProducts from "./components/Products/GetAllProducts";
import PostProduct from "./components/Products/PostProduct";
import GetSpecificProduct from "./components/Products/GetSpecificProduct";
import PatchProduct from "./components/Products/PatchProduct";
import PutProduct from "./components/Products/PutProduct";
import DeleteProduct from "./components/Products/DeleteProduct";

import GetAllSuppliers from "./components/Suppliers/GetAllSuppliers";
import PostSupplier from "./components/Suppliers/PostSupplier";
import GetSpecificSupplier from "./components/Suppliers/GetSpecificSupplier";
import PatchSupplier from "./components/Suppliers/PatchSupplier";
import DeleteSupplier from "./components/Suppliers/DeleteSupplier";

import GetAllWarehouses from "./components/Warehouses/GetAllWarehouses";
import PostWarehouse from "./components/Warehouses/PostWarehouse";
import GetSpecificWarehouse from "./components/Warehouses/GetSpecificWarehouse";
import PatchWarehouse from "./components/Warehouses/PatchWarehouse";
import DeleteWarehouse from "./components/Warehouses/DeleteWarehouse";

function App() {

  return (
    <>
      {/* <GetAllCategories />
      <PostCategory />
      <GetSpecificCategory />
      <PatchCategory />
      <DeleteCategory /> */}

      {/* <GetAllInventories /> */}
      <PostInventory />
      <GetSpecificInventory />
      <PutInventory />
      <PatchInventory />
      <DeleteInventory />

      {/* <GetAllProducts /> */}
      {/* <PostProduct />
      <GetSpecificProduct />
      <PutProduct />
      <PatchProduct />
      <DeleteProduct /> */}

      {/* <GetAllSuppliers />
      <PostSupplier />
      <GetSpecificSupplier />
      <PatchSupplier />
      <DeleteSupplier /> */}

      {/* <GetAllWarehouses />
      <PostWarehouse />
      <GetSpecificWarehouse />
      <PatchWarehouse />
      <DeleteWarehouse /> */}
    </>
  );
}

export default App;

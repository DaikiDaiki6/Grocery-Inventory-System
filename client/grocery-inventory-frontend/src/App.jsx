import { useState } from "react";
import GetAllSuppliers from "./components/Products/GetAllProducts";
import GetSpecificSupplier from "./components/Suppliers/GetSpecificSupplier";
import PostSupplier from "./components/Suppliers/PostSupplier";
import PatchSupplier from "./components/Suppliers/PatchSupplier";
import DeleteSupplier from "./components/Suppliers/DeleteSupplier";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* <GetAllProducts /> */}
      <GetSpecificSupplier />
      <PostSupplier />
      <PatchSupplier />
      <DeleteSupplier />
    </>
  );
}

export default App;

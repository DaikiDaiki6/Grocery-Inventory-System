import { useState } from "react";
import GetAllSuppliers from "./components/Suppliers/GetAllSuppliers";
import GetSpecificSupplier from "./components/Suppliers/GetSpecificSupplier";
import PostSupplier from "./components/Suppliers/PostSupplier";
import PatchSupplier from "./components/Suppliers/PatchSupplier";
import DeleteSupplier from "./components/Suppliers/DeleteSupplier";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* <GetAllSuppliers /> */}
      <GetSpecificSupplier />
      <PostSupplier />
      <PatchSupplier />
      <DeleteSupplier />
    </>
  );
}

export default App;

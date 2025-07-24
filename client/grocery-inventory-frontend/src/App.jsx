import { useState } from "react";
import GetAllProducts from "./components/Products/GetAllProducts";
import PostProduct from "./components/Products/PostProduct";
import GetSpecificProduct from "./components/Products/GetSpecificProduct";
// import PatchProduct from "./components/Products/PatchProduct";
import DeleteProduct from "./components/Products/DeleteProduct";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <GetAllProducts />
      <PostProduct />
       <GetSpecificProduct />
      {/*
      <PatchProduct /> */}
      <DeleteProduct /> 
    </>
  );
}

export default App;

import { useState } from "react";
import GetAllInventories from "./components/Inventories/GetAllInventories";
import PostInventory from "./components/Inventories/PostInventory";
import GetSpecificInventory from "./components/Inventories/GetSpecificInventory";
import PatchInventory from "./components/Inventories/PatchInventory";
import PutInventory from "./components/Inventories/PutInventory";
import DeleteInventory from "./components/Inventories/DeleteInventory";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* <GetAllInventories /> */}
       <PostInventory />
       <GetSpecificInventory />
      <PutInventory />
      <PatchInventory />
      <DeleteInventory />
    </>
  );
}

export default App;

import { RouterProvider } from "@tanstack/react-router";
import { router } from "./routes/router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

function App() {
  return (
    <>
      <RouterProvider router={router}/>
      <TanStackRouterDevtools router={router} />
    </>
  );
}

export default App;

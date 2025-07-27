import { Outlet } from "@tanstack/react-router";
import Home from "./Home";

export default function Layout() {
    return(
        <div>
            <Home />
            <Outlet />
        </div>
    )
}
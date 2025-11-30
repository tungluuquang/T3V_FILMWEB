import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";

export default function DefaultLayout() {
    return (
        <div>
            <Navbar />
            <Outlet />
        </div>
    )
}

import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../authContext/AuthContext";
import Home from "../pages/home/Home"

export default function NonAuthed() {
    const { user } = useContext(AuthContext)

    if (user) {
        return <Navigate to="/home" />
    }
    return (
        <div>
            <Outlet />
        </div>
    )
}

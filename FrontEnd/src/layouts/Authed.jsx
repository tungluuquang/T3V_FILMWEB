import { useContext } from "react"
import { AuthContext } from "../authContext/AuthContext"
import Register from "../pages/register/Register"
import { Outlet, Navigate } from "react-router-dom"

export default function Authed() {
    const { user } = useContext(AuthContext)

    if (!user) {
        return <Navigate to="/" />

    }
    return (
        <div>
            <Outlet />
        </div>
    )
}

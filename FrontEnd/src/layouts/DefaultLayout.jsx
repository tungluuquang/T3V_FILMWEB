import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Chatbot from "../Chatbot/Chatbot"

export default function DefaultLayout() {
    return (
        <div>
            <Navbar />
            <Outlet />
            <Chatbot />
        </div>
    )
}

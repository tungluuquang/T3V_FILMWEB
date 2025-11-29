import { useContext, useState } from "react"
import "./login.css"
import { AuthContext } from "../../context/authContext/AuthContext";
import { login } from "../../context/authContext/apiCalls";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState('');
    const { isFetching, dispatch } = useContext(AuthContext);

    const handleLogin = (e) => {
        e.preventDefault();
        login({ email, password }, dispatch);
    }

    return (
        <div className="login">
            <form className="loginForm">
                <input type="text" onChange={(e) => setEmail(e.target.value)} placeholder="email" className="loginInput" />
                <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="password" className="loginInput" />
                <button
                    className="loginButton"
                    onClick={handleLogin}
                    disabled={isFetching}
                >
                    Login</button>
            </form>
        </div>
    )
}

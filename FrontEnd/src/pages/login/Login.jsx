import { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./login.scss";
import { AuthContext } from "../../authContext/AuthContext";
import { login } from "../../authContext/apiCalls";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
    const location = useLocation();
    const message = location.state?.message
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { dispatch } = useContext(AuthContext);

    useEffect(() => {
        if (message) {
            toast.success(message, { autoClose: 2000 })
        }
    }, [])

    const handleLogin = (e) => {
        e.preventDefault();
        login({ email, password }, dispatch);
        dispatch({ type: 'LOGIN', payload: { email, password } });
    };

    return (
        <div className="login">
            <div className="top">
                <div className="wrapper">
                    {/* <p className="logo">T3V</p> */}
                    <img src="../../public/favicon.png" className='logo' alt="" />
                </div>
            </div>
            <div className="container">
                <form role="form">
                    <h1>Sign In</h1>
                    <input
                        type="email"
                        placeholder="Email of phone number"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="loginButton" onClick={handleLogin}>
                        Sign In
                    </button>
                    <span className="sign-up-now">
                        New to Netflix? <b>Sign up now.</b>
                    </span>
                    <small>
                        This page is protected by Google reCAPTCHA to ensure you're not a
                        bot. <b>Learn more</b>.
                    </small>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

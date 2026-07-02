import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/Login.css";
import Background from "../components/Background";

function Login() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    async function handleLogin() {

        try {

            const res = await axios.post(
                "https://snapverse-api26.onrender.com/login",
                {
                    username,
                    password,
                }
            );

            localStorage.setItem(
                "token",
                res.data.access_token
            );

            localStorage.setItem(
                "username",
                username
            );

            toast.success("Login Successful!");

            window.location.href = "/dashboard";

        }

        catch (err) {

            console.log(err);

            toast.error("Invalid username or password");

        }

    }

    return (

        <>
            <Background />

            <div className="login-page">

                <div className="login-card">

                    <h1>Snapverse</h1>

                    <p>Welcome Back 👋</p>

                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e)=>setUsername(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    />

                    <button onClick={handleLogin}>
                        Login
                    </button>

                    <div className="divider"></div>

                    <p>
                        Don't have an account?
                    </p>

                    <Link to="/signup">

                        <button className="secondary-btn">
                            Create Account
                        </button>

                    </Link>

                </div>

            </div>

        </>

    );

}

export default Login;
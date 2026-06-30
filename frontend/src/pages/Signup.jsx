import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/Login.css";
import Background from "../components/Background";

function Signup() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    async function handleSignup() {

        try {

            await axios.post(
                "http://127.0.0.1:8000/signup",
                {
                    username,
                    password,
                }
            );

            toast.success("Account Created!");

            navigate("/login");

        }

        catch (err) {

            console.log(err);

            toast.error("Signup failed");

        }

    }

    return (

        <>
            <Background />

            <div className="login-page">

                <div className="login-card">

                    <h1>Create Account</h1>

                    <p>Join Snapverse 🚀</p>

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

                    <button onClick={handleSignup}>
                        Create Account
                    </button>

                    <div className="divider"></div>

                    <p>
                        Already have an account?
                    </p>

                    <Link to="/login">

                        <button className="secondary-btn">
                            Login
                        </button>

                    </Link>

                </div>

            </div>

        </>

    );

}

export default Signup;
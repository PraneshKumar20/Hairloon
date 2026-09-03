import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImg from "../assets/Gemini_Generated_Image_8d1uvz8d1uvz8d1u-removebg-preview.png";
import "./Login.css";

function Login() {
    const navigate = useNavigate();

    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        if (isSignUp && !name.trim()) {
            setError("Please enter your full name");
            return;
        }

        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        setError("");

        try {
            const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';
            const body = isSignUp ? { name, email, password } : { email, password };
            
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Authentication failed");
                return;
            }

            const userObj = {
                id: data.id,
                name: data.name,
                email: data.email,
                loggedInAt: new Date().toISOString()
            };

            localStorage.setItem("hairloon_user", JSON.stringify(userObj));
            navigate("/home");
        } catch (err) {
            setError("Failed to connect to the server");
            console.error(err);
        }
    }

    return (
        <main className="login-page">
            <section className="login-card">
                <div className="login-brand">
                    <img src={logoImg} alt="Hairloon Logo" className="login-logo-img" />
                </div>

                <h1>{isSignUp ? "Create Account" : "Welcome back"}</h1>

                <p className="login-subtitle">
                    {isSignUp 
                        ? "Join Hairloon to unlock personalized AI hairstyle matches."
                        : "Sign in to continue your Hairloon experience."}
                </p>

                <form onSubmit={handleSubmit}>
                    {isSignUp && (
                        <>
                            <label>Full Name</label>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </>
                    )}

                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && <p className="login-error">{error}</p>}

                    <button type="submit">
                        {isSignUp ? "Create Account" : "Sign In"}
                    </button>
                </form>

                <p className="signup-text">
                    {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                    <span onClick={() => { setIsSignUp(!isSignUp); setError(""); }}>
                        {isSignUp ? "Sign In" : "Sign Up"}
                    </span>
                </p>
            </section>
        </main>
    );
}

export default Login;
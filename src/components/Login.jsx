import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, AlertCircle, X, Check } from "lucide-react";
import logoImg from "../assets/Gemini_Generated_Image_8d1uvz8d1uvz8d1u-removebg-preview.png";
import LoadingScreen from "./LoadingScreen";
import "./Login.css";

function Login() {
    const navigate = useNavigate();

    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showLoaderScreen, setShowLoaderScreen] = useState(false);

    // Email validation
    const isValidEmail = (str) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(str.trim());
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 1. Email format check
        if (!email.trim() || !isValidEmail(email)) {
            setErrorMsg("Please enter a valid email address (e.g. name@domain.com).");
            return;
        }

        // 2. If Sign Up, optional name check or fallback
        if (isSignUp && !name.trim()) {
            setErrorMsg("Please enter your name to create an account.");
            return;
        }

        setErrorMsg("");
        setIsSubmitting(true);

        const computedName = isSignUp && name.trim() 
            ? name.trim() 
            : email.trim().split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, l => l.toUpperCase());

        const sessionUser = {
            name: computedName || "Guest Stylist",
            email: email.trim(),
            loggedInAt: new Date().toISOString()
        };

        try {
            localStorage.setItem("hairloon_user", JSON.stringify(sessionUser));
        } catch (err) {
            console.error("Storage error:", err);
        }

        // Brief tactile button feedback before launching the custom loading screen
        setTimeout(() => {
            setShowLoaderScreen(true);
        }, 350);
    };

    const handleQuickFill = () => {
        setEmail("alex.style@hairloon.com");
        setPassword("hairloon2026");
        if (isSignUp) setName("Alex Mercer");
        setErrorMsg("");
    };

    if (showLoaderScreen) {
        return <LoadingScreen onComplete={() => navigate("/home")} />;
    }

    return (
        <div className="auth-viewport">
            {/* Minimalist Error Toast */}
            {errorMsg && (
                <div className="auth-toast-wrapper" role="alert">
                    <div className="auth-toast">
                        <AlertCircle size={15} className="auth-toast-icon" />
                        <span className="auth-toast-text">{errorMsg}</span>
                        <button 
                            type="button" 
                            className="auth-toast-dismiss"
                            onClick={() => setErrorMsg("")}
                            aria-label="Dismiss error"
                        >
                            <X size={13} />
                        </button>
                    </div>
                </div>
            )}

            <main className="auth-card-container">
                <div className="auth-card">
                    {/* 1. Hairloon Brand Emblem */}
                    <div className="auth-brand-row stagger-1">
                        <img src={logoImg} alt="Hairloon" className="auth-brand-logo" />
                    </div>

                    {/* 2. Headline & Subtitle */}
                    <header className="auth-header">
                        <h1 className="auth-headline stagger-2">
                            {isSignUp ? "Create your account" : "Welcome back"}
                        </h1>
                        <p className="auth-subtitle stagger-3">
                            {isSignUp 
                                ? "Join Hairloon to experience data-driven facial style recommendations."
                                : "Sign in to access your personalized hairstyle diagnostic studio."}
                        </p>
                    </header>

                    {/* 3. Demo Helper Tag */}
                    <div 
                        className="auth-demo-pill stagger-4"
                        onClick={handleQuickFill}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && handleQuickFill()}
                        title="Click to auto-fill sample credentials"
                    >
                        <span className="demo-tag">DEMO</span>
                        <span className="demo-text">Quick fill demo credentials</span>
                    </div>

                    {/* 4. Form */}
                    <form onSubmit={handleSubmit} className="auth-form" noValidate>
                        {isSignUp && (
                            <div className="auth-field-group stagger-5">
                                <label htmlFor="user-name" className="auth-label">Full Name</label>
                                <div className="auth-input-shell">
                                    <input
                                        id="user-name"
                                        type="text"
                                        placeholder="Alex Mercer"
                                        value={name}
                                        onChange={(e) => {
                                            setName(e.target.value);
                                            if (errorMsg) setErrorMsg("");
                                        }}
                                        autoFocus
                                    />
                                </div>
                            </div>
                        )}

                        <div className="auth-field-group stagger-5">
                            <div className="auth-label-row">
                                <label htmlFor="user-email" className="auth-label">Email Address</label>
                                {isValidEmail(email) && (
                                    <span className="valid-pill">
                                        <Check size={12} /> Valid
                                    </span>
                                )}
                            </div>
                            <div className={`auth-input-shell ${errorMsg && !isValidEmail(email) ? "input-has-error" : ""}`}>
                                <input
                                    id="user-email"
                                    type="email"
                                    placeholder="name@domain.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (errorMsg) setErrorMsg("");
                                    }}
                                    autoComplete="email"
                                    autoFocus={!isSignUp}
                                />
                            </div>
                        </div>

                        <div className="auth-field-group stagger-6">
                            <div className="auth-label-row">
                                <label htmlFor="user-password" className="auth-label">Password</label>
                                <span className="auth-label-hint">Any password accepted</span>
                            </div>
                            <div className="auth-input-shell">
                                <input
                                    id="user-password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete={isSignUp ? "new-password" : "current-password"}
                                />
                                <button
                                    type="button"
                                    className="auth-password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        {/* 5. Submit Button */}
                        <div className="stagger-7">
                            <button 
                                type="submit" 
                                className={`auth-submit-btn ${isSubmitting ? "is-loading" : ""}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="btn-loading-state">
                                        <span className="btn-dot-pulse"></span>
                                        Authenticating...
                                    </span>
                                ) : (
                                    <>
                                        <span>{isSignUp ? "Create Account" : "Sign In"}</span>
                                        <ArrowRight size={14} className="btn-arrow-icon" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* 6. Switch Sign In / Register Mode */}
                    <footer className="auth-footer stagger-7">
                        <p className="auth-toggle-prompt">
                            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                            <button
                                type="button"
                                className="auth-toggle-btn"
                                onClick={() => {
                                    setIsSignUp(!isSignUp);
                                    setErrorMsg("");
                                }}
                            >
                                {isSignUp ? "Sign In" : "Create one"}
                            </button>
                        </p>
                    </footer>
                </div>
            </main>
        </div>
    );
}

export default Login;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, X, AlertCircle } from "lucide-react";
import logoImg from "../assets/Gemini_Generated_Image_8d1uvz8d1uvz8d1u-removebg-preview.png";
import LoadingScreen from "./LoadingScreen";
import "./Login.css";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorPopup, setErrorPopup] = useState("");
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Standard RFC-compliant email validation
    const isValidEmail = (str) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(str.trim());
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();

        // Email validation rule
        if (!email.trim() || !isValidEmail(email)) {
            setErrorPopup("Invalid email address. Please enter a valid email format (e.g. name@domain.com).");
            return;
        }

        // Valid email: accept any user and any password
        setErrorPopup("");

        const username = email.trim().split("@")[0].replace(/[._-]/g, " ");
        const formattedName = username.charAt(0).toUpperCase() + username.slice(1);

        const sessionUser = {
            name: formattedName || "Guest Stylist",
            email: email.trim(),
            loggedInAt: new Date().toISOString()
        };

        try {
            localStorage.setItem("hairloon_user", JSON.stringify(sessionUser));
        } catch (err) {
            console.error("Session storage error:", err);
        }

        // Trigger cinematic loading transition
        setIsTransitioning(true);
    };

    const handleQuickFill = () => {
        setEmail("alex.style@hairloon.com");
        setPassword("hairloon2026");
        setErrorPopup("");
    };

    if (isTransitioning) {
        return <LoadingScreen onComplete={() => navigate("/home")} />;
    }

    return (
        <div className="editorial-login-page">
            {/* Minimalist Error Notification Toast */}
            {errorPopup && (
                <aside 
                    className="editorial-error-toast"
                    role="alert"
                    aria-live="assertive"
                >
                    <div className="error-toast-inner">
                        <AlertCircle size={16} className="error-toast-icon" />
                        <span className="error-toast-message">{errorPopup}</span>
                        <button 
                            type="button"
                            className="error-toast-close"
                            onClick={() => setErrorPopup("")}
                            aria-label="Dismiss error"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </aside>
            )}

            <main className="editorial-login-grid">
                {/* -------------------------------------------------------------
                    COLUMN 1: BRAND IDENTITY & ARCHITECTURAL VISUAL CANVAS
                    ------------------------------------------------------------- */}
                <section className="login-visual-panel">
                    {/* Top Brand Tag */}
                    <header className="visual-brand-top">
                        <img src={logoImg} alt="Hairloon" className="visual-logo-mark" />
                        <span className="visual-brand-label">HAIRLOON // STUDIO</span>
                    </header>

                    {/* Central Manifesto & Architectural Geometry */}
                    <div className="visual-content-center">
                        <p className="visual-kicker">AUTONOMOUS FACIAL DIAGNOSTICS</p>
                        <h1 className="visual-headline">
                            The architecture<br />of personal style.
                        </h1>
                        <p className="visual-subtext">
                            Data-driven facial topology mapping paired with verified master barbering standards. Designed for those who demand absolute precision.
                        </p>

                        {/* Minimalist Hairline Geometric Graphic */}
                        <div className="architectural-graphic" aria-hidden="true">
                            <svg viewBox="0 0 440 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="graphic-svg">
                                <path d="M10 90C90 20 180 160 260 90C340 20 400 120 430 90" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
                                <path d="M10 110C90 40 180 180 260 110C340 40 400 140 430 110" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                                <path d="M10 70C90 0 180 140 260 70C340 0 400 100 430 70" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                                <circle cx="260" cy="90" r="3" fill="#ffffff" />
                                <circle cx="180" cy="160" r="2" fill="rgba(255,255,255,0.5)" />
                                <circle cx="90" cy="20" r="2" fill="rgba(255,255,255,0.5)" />
                                <line x1="260" y1="0" x2="260" y2="180" stroke="rgba(255,255,255,0.06)" strokeDasharray="2 4" strokeWidth="1" />
                                <line x1="0" y1="90" x2="440" y2="90" stroke="rgba(255,255,255,0.06)" strokeDasharray="2 4" strokeWidth="1" />
                            </svg>
                        </div>
                    </div>

                    {/* Bottom Metadata Ledger */}
                    <footer className="visual-footer-metadata">
                        <div className="meta-item">
                            <span className="meta-key">FRAMEWORK</span>
                            <span className="meta-val">STANDALONE V2.4</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-key">SECURITY</span>
                            <span className="meta-val">ZERO PERSISTENCE</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-key">SPECIFICATION</span>
                            <span className="meta-val">CRANIAL RATIO ISO-01</span>
                        </div>
                    </footer>
                </section>

                {/* -------------------------------------------------------------
                    COLUMN 2: MINIMAL EDITORIAL AUTHENTICATION FORM
                    ------------------------------------------------------------- */}
                <section className="login-form-panel">
                    <div className="form-panel-container">
                        <header className="form-panel-header">
                            <span className="form-step-number">01 / ACCESS</span>
                            <h2 className="form-panel-title">Sign In</h2>
                            <p className="form-panel-description">
                                Enter your credentials to initialize studio face analysis.
                            </p>
                        </header>

                        {/* Quick Fill One-Click Demonstration */}
                        <div 
                            className="demo-trigger-card"
                            onClick={handleQuickFill}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === "Enter" && handleQuickFill()}
                            title="Click to populate demo credentials"
                        >
                            <span className="demo-badge">QUICK FILL</span>
                            <span className="demo-email-preview">alex.style@hairloon.com</span>
                        </div>

                        {/* Input Form */}
                        <form onSubmit={handleLoginSubmit} className="editorial-form" noValidate>
                            <div className="form-field-wrapper">
                                <label htmlFor="auth-email" className="field-label">
                                    <span>EMAIL ADDRESS</span>
                                    {isValidEmail(email) && <span className="valid-label">VALID FORMAT</span>}
                                </label>
                                <div className={`field-input-box ${errorPopup ? "field-error-border" : ""}`}>
                                    <input
                                        id="auth-email"
                                        type="email"
                                        placeholder="name@domain.com"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (errorPopup) setErrorPopup("");
                                        }}
                                        autoComplete="email"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="form-field-wrapper">
                                <div className="field-label-split">
                                    <label htmlFor="auth-password" className="field-label">
                                        PASSWORD
                                    </label>
                                    <span className="field-meta-hint">Any password accepted</span>
                                </div>
                                <div className="field-input-box">
                                    <input
                                        id="auth-password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        className="field-toggle-btn"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </div>

                            {/* Solid White Luxury Inversion Button */}
                            <button type="submit" className="editorial-submit-btn">
                                <span>ENTER STUDIO</span>
                                <ArrowRight size={15} className="submit-arrow" />
                            </button>
                        </form>

                        <footer className="form-panel-footer">
                            <p>© 2026 HAIRLOON STUDIO. ALL RIGHTS RESERVED.</p>
                        </footer>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Login;

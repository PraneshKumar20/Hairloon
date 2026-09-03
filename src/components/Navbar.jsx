import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User } from "lucide-react";
import logoImg from "../assets/Gemini_Generated_Image_8d1uvz8d1uvz8d1u-removebg-preview.png";

function Navbar() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeLink, setActiveLink] = useState("Home");
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("hairloon_user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error(e);
            }
        }

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (sectionId) => {
        setActiveLink(sectionId);
        setMenuOpen(false);

        const targetId = sectionId.toLowerCase();
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("hairloon_user");
        navigate("/login");
    };

    return (
        <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
            <div className="logo" onClick={() => scrollToSection("Home")} style={{ cursor: "pointer" }}>
                <img src={logoImg} alt="Hairloon Logo" className="logo-image" />
            </div>

            <div className={`nav-links ${menuOpen ? "open" : ""}`}>
                {[
                    { label: "Home", id: "analysis" },
                    { label: "Discover", id: "discover" },
                    { label: "Salons", id: "salons" },
                    { label: "About", id: "about" }
                ].map((item) => (
                    <a
                        key={item.label}
                        href={`#${item.id}`}
                        className={activeLink === item.label ? "active" : ""}
                        onClick={(e) => {
                            e.preventDefault();
                            scrollToSection(item.id);
                        }}
                    >
                        {item.label}
                    </a>
                ))}

                {user && (
                    <div className="mobile-user-actions">
                        <span className="user-name-tag"><User size={14} /> {user.name}</span>
                        <button className="nav-logout-btn" onClick={handleLogout}>
                            <LogOut size={14} /> Sign Out
                        </button>
                    </div>
                )}
            </div>

            <div className="nav-actions">
                {user ? (
                    <div className="user-profile-pill">
                        <span className="user-greeting">Hi, {user.name}</span>
                        <button className="nav-logout-btn" onClick={handleLogout} title="Sign Out">
                            <LogOut size={16} />
                        </button>
                    </div>
                ) : (
                    <button className="nav-button" onClick={() => navigate("/login")}>
                        Sign In
                    </button>
                )}
            </div>

            <button
                className="menu-toggle"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle Navigation Menu"
            >
                {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
        </nav>
    );
}

export default Navbar;
import { useState, useEffect } from "react";
import { Sparkles, Menu, X } from "lucide-react";
import logoImg from "../assets/Gemini_Generated_Image_8d1uvz8d1uvz8d1u-removebg-preview.png";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeLink, setActiveLink] = useState("Home");
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleNavClick = (link) => {
        setActiveLink(link);
        setMenuOpen(false);
    };

    return (
        <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
            <div className="logo">
                <img src={logoImg} alt="Hairloon Logo" className="logo-image" />
            </div>

            <div className={`nav-links ${menuOpen ? "open" : ""}`}>
                {["Home", "Discover", "Salons", "About"].map((link) => (
                    <a
                        key={link}
                        href="#"
                        className={activeLink === link ? "active" : ""}
                        onClick={(e) => { e.preventDefault(); handleNavClick(link); }}
                    >
                        {link}
                    </a>
                ))}
            </div>

            <button className="nav-button">
                Get Started
            </button>
            <button
                className="menu-toggle"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
        </nav>
    );
}

export default Navbar;
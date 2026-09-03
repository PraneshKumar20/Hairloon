import { useState, useEffect } from "react";
import logoImg from "../assets/Gemini_Generated_Image_8d1uvz8d1uvz8d1u-removebg-preview.png";
import "./LoadingScreen.css";

const PHASES = [
    { threshold: 0, code: "PHASE 01", title: "INITIALIZING CLIENT PROTOCOL", detail: "Securing local session sandbox" },
    { threshold: 28, code: "PHASE 02", title: "CALIBRATING FACIAL TOPOLOGY", detail: "Aligning cranial geometry presets" },
    { threshold: 60, code: "PHASE 03", title: "SYNCHRONIZING VERIFIED ATELIERS", detail: "Mapping bespoke salon availability" },
    { threshold: 88, code: "PHASE 04", title: "STUDIO READY", detail: "Entering precision grooming catalog" }
];

function LoadingScreen({ onComplete, duration = 2200 }) {
    const [progress, setProgress] = useState(0);
    const [currentPhase, setCurrentPhase] = useState(PHASES[0]);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const intervalTime = 25;
        const step = 100 / (duration / intervalTime);

        const timer = setInterval(() => {
            setProgress((prev) => {
                const next = prev + step;
                if (next >= 100) {
                    clearInterval(timer);
                    setIsExiting(true);
                    setTimeout(() => {
                        if (onComplete) onComplete();
                    }, 450);
                    return 100;
                }

                const matched = [...PHASES].reverse().find(p => next >= p.threshold);
                if (matched) {
                    setCurrentPhase(matched);
                }

                return next;
            });
        }, intervalTime);

        return () => clearInterval(timer);
    }, [duration, onComplete]);

    const formattedPercent = Math.min(Math.round(progress), 100).toString().padStart(2, "0");

    return (
        <aside 
            className={`cinematic-loader ${isExiting ? "loader-exit" : ""}`}
            aria-label="Hairloon is preparing your experience"
            aria-live="polite"
        >
            {/* Minimal Editorial Corner Annotations */}
            <div className="loader-corner top-left">HAIRLOON // STUDIO</div>
            <div className="loader-corner top-right">SYS // AUTONOMOUS 2.4</div>
            <div className="loader-corner bottom-left">LAT 40.7128° N — LON 74.0060° W</div>
            <div className="loader-corner bottom-right">PRECISION GROOMING</div>

            {/* Central Monochromatic Composition */}
            <div className="loader-core">
                {/* Wordmark & Brand Seal */}
                <div className="loader-brand-header">
                    <img src={logoImg} alt="Hairloon" className="loader-brand-mark" />
                    <div className="loader-wordmark">HAIRLOON</div>
                    <div className="loader-submark">PRECISION GROOMING ARCHITECTURE</div>
                </div>

                {/* Expanding Thin Hairline Progress Indicator */}
                <div className="loader-hairline-track">
                    <div 
                        className="loader-hairline-fill" 
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                </div>

                {/* Status Ticker & Monospace Percent Counter */}
                <div className="loader-status-row">
                    <div className="loader-status-info">
                        <span className="loader-phase-tag">{currentPhase.code}</span>
                        <span className="loader-phase-title">{currentPhase.title}</span>
                    </div>
                    <div className="loader-counter">
                        <span className="counter-num">{formattedPercent}</span>
                        <span className="counter-unit">%</span>
                    </div>
                </div>

                <div className="loader-detail-text">
                    {currentPhase.detail}
                </div>
            </div>
        </aside>
    );
}

export default LoadingScreen;

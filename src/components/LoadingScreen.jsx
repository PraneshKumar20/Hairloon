import { useState, useEffect } from "react";
import logoImg from "../assets/Gemini_Generated_Image_8d1uvz8d1uvz8d1u-removebg-preview.png";
import "./LoadingScreen.css";

const STATUS_STAGES = [
    { threshold: 0, title: "INITIALIZING DIAGNOSTIC SUITE", desc: "Setting up your personal profile" },
    { threshold: 30, title: "CALIBRATING FACIAL GEOMETRY", desc: "Preparing AI hair topology models" },
    { threshold: 65, title: "SYNCHRONIZING SALON ATELIERS", desc: "Retrieving verified partner stylist availability" },
    { threshold: 90, title: "FINALIZING BESPOKE CATALOG", desc: "Welcome to Hairloon" }
];

function LoadingScreen({ onComplete, duration = 2000 }) {
    const [progress, setProgress] = useState(0);
    const [currentStage, setCurrentStage] = useState(STATUS_STAGES[0]);
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        const intervalTime = 20;
        const step = 100 / (duration / intervalTime);

        const timer = setInterval(() => {
            setProgress((prev) => {
                const next = prev + step;
                if (next >= 100) {
                    clearInterval(timer);
                    setIsFadingOut(true);
                    setTimeout(() => {
                        if (onComplete) onComplete();
                    }, 400);
                    return 100;
                }

                const stage = [...STATUS_STAGES].reverse().find(s => next >= s.threshold);
                if (stage) {
                    setCurrentStage(stage);
                }

                return next;
            });
        }, intervalTime);

        return () => clearInterval(timer);
    }, [duration, onComplete]);

    const formattedPercent = Math.min(Math.round(progress), 100).toString().padStart(2, "0");

    return (
        <div 
            className={`hairloon-loader-root ${isFadingOut ? "loader-fade-out" : ""}`}
            role="status" 
            aria-live="polite"
        >
            <div className="loader-center-content">
                {/* Brand Identity */}
                <div className="loader-brand-wrapper">
                    <img src={logoImg} alt="Hairloon" className="loader-brand-emblem" />
                    <h1 className="loader-brand-title">HAIRLOON</h1>
                    <p className="loader-brand-tagline">PRECISION GROOMING PLATFORM</p>
                </div>

                {/* Minimal Precision Gauge */}
                <div className="loader-gauge-container">
                    <div className="loader-gauge-rail">
                        <div 
                            className="loader-gauge-fill" 
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                    </div>

                    <div className="loader-meta-row">
                        <span className="loader-stage-name">{currentStage.title}</span>
                        <span className="loader-percentage">{formattedPercent}%</span>
                    </div>

                    <p className="loader-subtext">{currentStage.desc}</p>
                </div>
            </div>

            {/* Subtle Editorial Footer Line */}
            <div className="loader-bottom-note">
                <span>PREPARING YOUR PERSONALIZED EXPERIENCE</span>
            </div>
        </div>
    );
}

export default LoadingScreen;

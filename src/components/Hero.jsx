import { useState } from "react";
import { Sparkles } from "lucide-react";
import { useTilt } from "../hooks/useTilt";
import "../App.css";

function Hero() {
  const [analysisStarted, setAnalysisStarted] = useState(false);
  const tiltRef = useTilt({ maxTilt: 16, yOffset: -4 });

  const handleAnalyseClick = () => {
    setAnalysisStarted(true);
    const analysisElement = document.getElementById("analysis");
    if (analysisElement) {
      analysisElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="hero" id="hero">
      <div className="hero-content">
        <p className="hero-eyebrow">
          YOUR STYLE. YOUR CONFIDENCE.
        </p>

        <h1 className="hero-title">
          Find the hairstyle
          <br />
          that fits you.
        </h1>

        <p className="hero-description">
          Discover hairstyles that match your features
          and find top-rated salons near you.
        </p>

        <button
          className="hero-button"
          onClick={handleAnalyseClick}
        >
          {analysisStarted ? "Scroll to Analysis" : "Analyse My Face"}
        </button>
      </div>

      <div className="hero-visual">
        <div className="analysis-card" ref={tiltRef}>
          <div className="analysis-icon">
            <Sparkles size={24} />
          </div>

          <p className="analysis-label">
            AI FACE ANALYSIS
          </p>

          <h2>
            Discover your
            <br />
            best style.
          </h2>

          <div className="analysis-line"></div>

          <p className="analysis-status">
            {analysisStarted ? "Analysis started" : "Ready to analyse"}
          </p>
        </div>
      </div>
    </section>
  );
}

export default Hero;
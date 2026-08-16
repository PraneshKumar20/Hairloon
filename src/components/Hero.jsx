import { useState } from "react";
import "../App.css";
function Hero() {

  const [analysisStarted, setAnalysisStarted] = useState(false);

  return (
    <section className="hero">

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
          and find salons near you.
        </p>

        <button
          className="hero-button"
          onClick={() => setAnalysisStarted(true)}
        >
          {analysisStarted ? "Analysis Started" : "Analyse My Face"}
        </button>

      </div>


      <div className="hero-visual">

        <div className="analysis-card">

          <div className="analysis-icon">
            ✦
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
            {analysisStarted
              ? "Analysis started"
              : "Ready to analyse"}
          </p>

        </div>

      </div>

    </section>
  );
}

export default Hero;
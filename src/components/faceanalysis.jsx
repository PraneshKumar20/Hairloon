import { useState, useEffect } from "react";
import { Sparkles, Upload, Sun, UserSquare2, ShieldCheck, CheckCircle2, ScanFace, Scissors } from "lucide-react";
import "../faceanalysis.css";

const SAMPLE_AVATARS = [
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
];

const HAIRSTYLES = [
    { name: "Textured Fringe", match: 98, img: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=300&q=80" },
    { name: "Modern Quiff", match: 94, img: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=300&q=80" },
    { name: "Classic Taper", match: 89, img: "https://images.unsplash.com/photo-1582230208018-b468ce484b96?auto=format&fit=crop&w=300&q=80" }
];

function FaceAnalysis() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scanComplete, setScanComplete] = useState(false);

    const handleUpload = (fileOrUrl) => {
        setSelectedImage(typeof fileOrUrl === 'string' ? fileOrUrl : URL.createObjectURL(fileOrUrl));
        setIsScanning(true);
        setScanComplete(false);
    };

    useEffect(() => {
        if (isScanning) {
            const timer = setTimeout(() => {
                setIsScanning(false);
                setScanComplete(true);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isScanning]);

    return (
        <section className="face-analysis">
            <div className="analysis-grid">
                <div className="analysis-content">
                    <div className="analysis-badge">
                        <Sparkles size={16} /> AI-guided style discovery
                    </div>
                    <h1 className="analysis-title">
                        Discover the style<br />that fits you.
                    </h1>
                    <p className="analysis-description">
                        Upload a clear photo and Hairloon reveals hairstyles suited to your facial features — then helps you find the right salon to make it happen.
                    </p>
                    
                    {!selectedImage && (
                        <div className="sample-avatars">
                            <p>Or try a sample photo:</p>
                            <div className="avatar-group">
                                {SAMPLE_AVATARS.map((url, i) => (
                                    <button key={i} onClick={() => handleUpload(url)} className="avatar-btn">
                                        <img src={url} alt={`Sample ${i}`} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="upload-area-wrapper">
                    <div className={`upload-area ${selectedImage ? 'has-image' : ''}`}>
                        {selectedImage ? (
                            <div className="preview-area">
                                <div className="image-container">
                                    <img src={selectedImage} alt="Selected" className="preview-image" />
                                    
                                    {isScanning && (
                                        <>
                                            <div className="scan-line"></div>
                                            <div className="face-hud">
                                                <div className="hud-corner top-left"></div>
                                                <div className="hud-corner top-right"></div>
                                                <div className="hud-corner bottom-left"></div>
                                                <div className="hud-corner bottom-right"></div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                
                                {isScanning && (
                                    <div className="scanning-status">
                                        <ScanFace className="spinning-icon" size={20} />
                                        <span>Analyzing facial geometry...</span>
                                    </div>
                                )}

                                {scanComplete && (
                                    <div className="upload-success">
                                        <CheckCircle2 size={20} />
                                        <span>Analysis Complete</span>
                                        <div className="metrics-tags">
                                            <span className="metric-tag">Shape: Oval</span>
                                            <span className="metric-tag">Density: Medium</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="upload-icon-wrapper">
                                    <Upload className="upload-icon" size={32} />
                                </div>
                                <h2 className="upload-title">Drag & drop your photo</h2>
                                <p className="upload-or">or</p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="photo-upload"
                                    hidden
                                    onChange={(e) => handleUpload(e.target.files[0])}
                                />
                                <label htmlFor="photo-upload" className="upload-button">
                                    Choose Photo
                                </label>
                                <p className="upload-hint">Use a clear, front-facing photo in good lighting.</p>
                            </>
                        )}
                    </div>
                    
                    {!selectedImage && (
                        <div className="analysis-features">
                            <span className="feature-item"><Sun size={16} /> Natural lighting</span>
                            <span className="feature-item"><UserSquare2 size={16} /> Face the camera</span>
                            <span className="feature-item"><ShieldCheck size={16} /> Secure local processing</span>
                        </div>
                    )}
                </div>
            </div>

            {scanComplete && (
                <div className="results-section fade-in">
                    <div className="results-header">
                        <h2>Top Matches For You</h2>
                        <p>Based on your oval face shape and balanced proportions.</p>
                    </div>
                    <div className="results-grid">
                        {HAIRSTYLES.map((style, i) => (
                            <div className="result-card" key={i}>
                                <div className="result-image">
                                    <img src={style.img} alt={style.name} />
                                    <div className="match-badge">{style.match}% Match</div>
                                </div>
                                <div className="result-info">
                                    <h3>{style.name}</h3>
                                    <button className="book-salon-btn">
                                        <Scissors size={14} /> Find Salon
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}

export default FaceAnalysis;
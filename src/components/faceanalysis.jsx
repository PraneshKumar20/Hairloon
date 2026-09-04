import { useState, useEffect, useRef } from "react";
import { Sparkles, Upload, Sun, UserSquare2, ShieldCheck, CheckCircle2, ScanFace, Scissors, X, MapPin, Star, Calendar, Clock } from "lucide-react";
import { INITIAL_HAIRSTYLES, INITIAL_SALONS } from "../data/mockData";
import { useTilt } from "../hooks/useTilt";
import "../faceanalysis.css";

const SAMPLE_AVATARS = [
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
];

function ResultCardItem({ styleData, onBook }) {
    const tiltRef = useTilt({ maxTilt: 16, yOffset: -4 });
    return (
        <div className="result-card" ref={tiltRef}>
            <div className="result-image">
                <img src={styleData.img} alt={styleData.name} />
                <div className="match-badge">{styleData.match}% Match</div>
            </div>
            <div className="result-info">
                <div>
                    <h3>{styleData.name}</h3>
                    <span className="style-category">{styleData.category}</span>
                </div>
                <button 
                    className="book-salon-btn"
                    onClick={onBook}
                >
                    <Scissors size={14} /> Find Salon
                </button>
            </div>
        </div>
    );
}

function CatalogCardItem({ styleData }) {
    const tiltRef = useTilt({ maxTilt: 16, yOffset: -4 });
    return (
        <div className="catalog-card" ref={tiltRef}>
            <img src={styleData.img} alt={styleData.name} />
            <div className="catalog-overlay">
                <h4>{styleData.name}</h4>
                <span>{styleData.category} Look</span>
            </div>
        </div>
    );
}

function SalonCardItem({ salon, onBook }) {
    const tiltRef = useTilt({ maxTilt: 16, yOffset: -4 });
    return (
        <div className="salon-showcase-card" ref={tiltRef}>
            <div className="salon-card-header">
                <h3>{salon.name}</h3>
                <div className="salon-rating">
                    <Star size={16} className="star-filled" /> {salon.rating} ({salon.reviews})
                </div>
            </div>
            <p className="salon-address"><MapPin size={14} /> {salon.address} • {salon.distance}</p>
            <div className="salon-card-footer">
                <span className="salon-price">{salon.price}</span>
                <button 
                    className="secondary-btn"
                    onClick={onBook}
                >
                    Book Visit
                </button>
            </div>
        </div>
    );
}

function FaceAnalysis() {
    const [hairstyles] = useState(INITIAL_HAIRSTYLES);
    const [nearbySalons] = useState(INITIAL_SALONS);

    const [selectedImage, setSelectedImage] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scanComplete, setScanComplete] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    
    // Salon Modal State
    const [selectedStyle, setSelectedStyle] = useState(null);
    const [bookingSalon, setBookingSalon] = useState(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [bookingDay, setBookingDay] = useState(0);
    const [bookingTime, setBookingTime] = useState("10:00 AM");

    const DATES = [
        { label: "Today", date: "12" },
        { label: "Wed", date: "13" },
        { label: "Thu", date: "14" },
        { label: "Fri", date: "15" },
        { label: "Sat", date: "16" }
    ];

    const TIMES = ["9:00 AM", "10:00 AM", "11:30 AM", "1:00 PM", "2:30 PM", "4:00 PM", "5:30 PM"];

    const createdUrlRef = useRef(null);

    const handleUpload = (fileOrUrl) => {
        if (createdUrlRef.current) {
            URL.revokeObjectURL(createdUrlRef.current);
            createdUrlRef.current = null;
        }

        let newUrl = "";
        if (typeof fileOrUrl === "string") {
            newUrl = fileOrUrl;
        } else if (fileOrUrl instanceof File) {
            newUrl = URL.createObjectURL(fileOrUrl);
            createdUrlRef.current = newUrl;
        }

        if (newUrl) {
            setSelectedImage(newUrl);
            setIsScanning(true);
            setScanComplete(false);
        }
    };

    const handleReset = () => {
        if (createdUrlRef.current) {
            URL.revokeObjectURL(createdUrlRef.current);
            createdUrlRef.current = null;
        }
        setSelectedImage(null);
        setIsScanning(false);
        setScanComplete(false);
    };

    // Drag & Drop handlers
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleUpload(e.dataTransfer.files[0]);
        }
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
        <section className="face-analysis" id="analysis">
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
                    <div 
                        className={`upload-area ${selectedImage ? 'has-image' : ''} ${isDragging ? 'is-dragging' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
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
                                        <div className="success-header">
                                            <CheckCircle2 size={20} />
                                            <span>Analysis Complete</span>
                                        </div>
                                        <div className="metrics-tags">
                                            <span className="metric-tag">Shape: Oval</span>
                                            <span className="metric-tag">Density: Medium</span>
                                            <span className="metric-tag">Symmetry: 98%</span>
                                        </div>
                                        <button className="reset-photo-btn" onClick={handleReset}>
                                            Scan Another Photo
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="upload-icon-wrapper">
                                    <Upload className="upload-icon" size={32} />
                                </div>
                                <h2 className="upload-title">
                                    {isDragging ? "Drop your photo now!" : "Drag & drop your photo"}
                                </h2>
                                <p className="upload-or">or</p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="photo-upload"
                                    hidden
                                    onChange={(e) => e.target.files[0] && handleUpload(e.target.files[0])}
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
                        {hairstyles.map((style) => (
                            <ResultCardItem 
                                key={style.id}
                                styleData={style}
                                onBook={() => {
                                    setSelectedStyle(style);
                                    setBookingSalon(null);
                                    setBookingSuccess(false);
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Discover Catalog Section */}
            <div className="section-block" id="discover">
                <div className="section-title-wrap">
                    <span className="section-eyebrow">EXPLORE CATALOG</span>
                    <h2>Trending Hairstyle Trends</h2>
                    <p>Curated looks suited for every hair density and texture.</p>
                </div>
                <div className="catalog-grid">
                    {hairstyles.map((style) => (
                        <CatalogCardItem 
                            key={`cat-${style.id}`}
                            styleData={style}
                        />
                    ))}
                </div>
            </div>

            {/* Salons Showcase Section */}
            <div className="section-block" id="salons">
                <div className="section-title-wrap">
                    <span className="section-eyebrow">TOP PARTNERS</span>
                    <h2>Verified Salons Near You</h2>
                    <p>Book with expert stylists specialized in AI precision cuts.</p>
                </div>
                <div className="salons-showcase-grid">
                    {nearbySalons.map((salon) => (
                        <SalonCardItem 
                            key={`salon-${salon.id}`}
                            salon={salon}
                            onBook={() => {
                                setSelectedStyle(hairstyles[0]);
                                setBookingSalon(salon);
                                setBookingSuccess(false);
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* About Section */}
            <div className="section-block" id="about">
                <div className="about-card">
                    <div className="about-content">
                        <span className="section-eyebrow">ABOUT HAIRLOON</span>
                        <h2>AI Precision Meets Master Barbering</h2>
                        <p>
                            Hairloon was built to replace guesswork with data-driven style confidence.
                            Our proprietary algorithm evaluates facial ratios, cheekbone width, and hair growth patterns to unlock your personal aesthetic potential.
                        </p>
                    </div>
                </div>
            </div>

            {/* Salon Booking Modal */}
            {selectedStyle && (
                <div className="modal-backdrop" onClick={() => setSelectedStyle(null)}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedStyle(null)}>
                            <X size={20} />
                        </button>

                        {!bookingSalon ? (
                            <>
                                <div className="modal-header">
                                    <h2>Find Salon for {selectedStyle.name}</h2>
                                    <p>Select a verified partner salon to execute this style.</p>
                                </div>
                                <div className="salons-list">
                                    {nearbySalons.map((salon) => (
                                        <div className="salon-item" key={salon.id}>
                                            <div className="salon-details">
                                                <h4>{salon.name}</h4>
                                                <div className="salon-meta">
                                                    <span><Star size={14} className="star-filled" /> {salon.rating} ({salon.reviews})</span>
                                                    <span><MapPin size={14} /> {salon.distance}</span>
                                                </div>
                                                <p className="salon-subtext">{salon.address} • {salon.price}</p>
                                            </div>
                                            <button 
                                                className="book-btn"
                                                onClick={() => setBookingSalon(salon)}
                                            >
                                                Select
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="booking-form-area">
                                {!bookingSuccess ? (
                                    <>
                                        <div className="booking-summary-card">
                                            <img src={selectedStyle.img} alt={selectedStyle.name} className="booking-summary-img" />
                                            <div className="booking-summary-info">
                                                <h4>{selectedStyle.name}</h4>
                                                <p>at {bookingSalon.name}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="booking-section-title">
                                            <Calendar size={16} /> Choose Date
                                        </div>
                                        <div className="booking-dates">
                                            {DATES.map((d, index) => (
                                                <div 
                                                    key={index} 
                                                    className={`date-pill ${bookingDay === index ? 'selected' : ''}`}
                                                    onClick={() => setBookingDay(index)}
                                                >
                                                    <span>{d.label}</span>
                                                    <span>{d.date}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="booking-section-title">
                                            <Clock size={16} /> Available Times
                                        </div>
                                        <div className="time-slots">
                                            {TIMES.map((time, index) => (
                                                <div 
                                                    key={index} 
                                                    className={`time-pill ${bookingTime === time ? 'selected' : ''}`}
                                                    onClick={() => setBookingTime(time)}
                                                >
                                                    {time}
                                                </div>
                                            ))}
                                        </div>

                                        <button 
                                            className="confirm-booking-btn"
                                            onClick={() => {
                                                const selectedDateStr = `${DATES[bookingDay].label}, ${DATES[bookingDay].date} at ${bookingTime}`;
                                                const newAppointment = {
                                                    id: Date.now(),
                                                    salon: bookingSalon.name,
                                                    style: selectedStyle.name,
                                                    date: selectedDateStr,
                                                    bookedAt: new Date().toISOString()
                                                };
                                                try {
                                                    const existing = JSON.parse(localStorage.getItem('hairloon_appointments') || '[]');
                                                    localStorage.setItem('hairloon_appointments', JSON.stringify([...existing, newAppointment]));
                                                } catch (e) {
                                                    console.error(e);
                                                }
                                                setBookingSuccess(true);
                                            }}
                                        >
                                            Confirm Appointment
                                        </button>
                                    </>
                                ) : (
                                    <div className="booking-success-view">
                                        <CheckCircle2 size={48} className="success-icon-lg" />
                                        <h2>Appointment Confirmed!</h2>
                                        <p>You're booked at <strong>{bookingSalon.name}</strong> for <strong>{selectedStyle.name}</strong> on {DATES[bookingDay].label}, {DATES[bookingDay].date} at {bookingTime}.</p>
                                        <button 
                                            className="confirm-booking-btn"
                                            onClick={() => setSelectedStyle(null)}
                                        >
                                            Done
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}

export default FaceAnalysis;
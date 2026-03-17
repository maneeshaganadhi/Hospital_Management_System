import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LocationOn, Phone, LocalHospital, Instagram, Facebook, YouTube } from '@mui/icons-material';
import Rating from '@mui/material/Rating';
import "./ContactUs.css";

const ContactUs = () => {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [name, setName] = useState('');
    const [recentFeedbacks, setRecentFeedbacks] = useState([]);

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const res = await axios.get("/api/getfeedbacks");
            setRecentFeedbacks(res.data);
        } catch (error) {
            console.error("Error fetching feedbacks:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/addfeedback", {
                name: name || "Anonymous",
                rating,
                feedback
            });
            alert("Thank you for your feedback!");
            setRating(0);
            setFeedback('');
            setName('');
            fetchFeedbacks();
        } catch (error) {
            console.error("Error submitting feedback:", error);
            alert("Failed to submit feedback. Please try again.");
        }
    };

    return (
        <div className="contact-container">
            {/* Hero Section */}
            <div className="contact-hero">
                <h1>Get in Touch</h1>
                <p>We are here to help and answer any question you might have. We look forward to hearing from you.</p>
            </div>

            {/* Info Grid */}
            <div className="info-grid">
                <div className="info-card">
                    <div className="icon-wrapper">
                        <LocationOn fontSize="large" />
                    </div>
                    <h3>Our Location</h3>
                    <p>
                        123 Health Care Avenue,<br />
                        Medical District, City,<br />
                        State, 500001
                    </p>
                </div>

                <div className="info-card emergency">
                    <div className="icon-wrapper">
                        <LocalHospital fontSize="large" />
                    </div>
                    <h3>Emergency Cases</h3>
                    <p>
                        24/7 Ambulance: <strong>108</strong><br />
                        Emergency Ward: <strong>+91 98765 43210</strong>
                    </p>
                </div>

                <div className="info-card">
                    <div className="icon-wrapper">
                        <Phone fontSize="large" />
                    </div>
                    <h3>Customer Support</h3>
                    <p>
                        Call: 040-12345678<br />
                        Email: help@hospital.com
                    </p>
                    <div className="social-links">
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-btn" style={{ background: '#E1306C' }}>
                            <Instagram />
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-btn" style={{ background: '#1877F2' }}>
                            <Facebook />
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-btn" style={{ background: '#FF0000' }}>
                            <YouTube />
                        </a>
                    </div>
                </div>
            </div>

            {/* Content Wrapper for Form and Reviews */}
            <div className="content-wrapper">
                {/* Feedback Form */}
                <div className="feedback-box">
                    <h2>We Value Your Feedback</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '10px', color: '#64748b' }}>Rate your experience</label>
                            <Rating
                                name="simple-controlled"
                                value={rating}
                                onChange={(event, newValue) => {
                                    setRating(newValue);
                                }}
                                size="large"
                                className="feedback-rating-stars"
                                sx={{ fontSize: '4rem', color: '#fbbf24' }}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-input-custom"
                                placeholder="Your Name (Optional)"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <textarea
                                className="form-input-custom"
                                rows="5"
                                placeholder="Share your thoughts..."
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="submit-btn-custom">Submit Feedback</button>
                    </form>
                </div>

                {/* Reviews Display */}
                <div className="reviews-panel">
                    <h2>Recent Reviews</h2>
                    <div className="review-list">
                        {recentFeedbacks.length > 0 ? (
                            recentFeedbacks.map((fb, index) => (
                                <div key={fb._id || index} className="review-item">
                                    <div className="review-header">
                                        <span className="reviewer-name">{fb.name || "Anonymous"}</span>
                                        <Rating value={fb.rating} readOnly />
                                    </div>
                                    <p className="review-text">"{fb.feedback}"</p>
                                    <span className="review-date">{new Date(fb.date).toLocaleDateString()}</span>
                                </div>
                            ))
                        ) : (
                            <p style={{ textAlign: 'center', color: '#94a3b8' }}>No reviews yet. Be the first!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;

import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>Hospital Location</h3>
                    <p>123 Health St, Wellness City</p>
                    <p>Medical District, 500001</p>
                </div>

                <div className="footer-section">
                    <h3><a href="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>Contact Us</a></h3>
                    <p>Email: info@hospital.com</p>
                    <p>Phone: +1 234 567 890</p>
                    <p><a href="/contact" style={{ color: '#fff', textDecoration: 'underline' }}>View Full Details</a></p>
                </div>

                <div className="footer-section emergency">
                    <h3>🚨 Emergency</h3>
                    <p className="emergency-number">Call: 108</p>
                    <p>Or: +1 999 888 777</p>
                </div>

                <div className="footer-section">
                    <h3>Need Help?</h3>
                    <p><a href="/faq">FAQs</a></p>
                    <p><a href="/support">Support Center</a></p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Hospital Management System. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;

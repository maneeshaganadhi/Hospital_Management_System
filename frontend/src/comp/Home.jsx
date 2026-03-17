import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import Ct from "./Ct";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const { state } = useContext(Ct);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get("/api/getdoctors");
        setDoctors(res.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  const handleDoctorClick = (doctor) => {
    navigate("/doctor-details", { state: doctor });
  };
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section" style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80&w=2000")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '100px 20px',
        color: 'white',
        textAlign: 'center'
      }}>
        <div className="hero-content">
          <h1 className="hero-title" style={{ fontSize: '3.5rem', marginBottom: '20px' }}>Your Health, Our Priority</h1>
          <p className="hero-subtitle" style={{ fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto 30px' }}>
            Experience world-class healthcare management with our streamlined patient portal
            and advanced administrative tools. Managing your hospital journey has never been easier.
          </p>
          <div className="hero-buttons">
            <Link to="/login" className="btn btn-primary">
              Login to Portal
            </Link>
            <Link to="/register" className="btn btn-outline" style={{ marginLeft: '20px' }}>
              Book Appointment
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2 className="section-title">Why Choose Us?</h2>
        <p className="section-subtitle">
          We combine technology and care to provide the best possible experience.
        </p>

        <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginTop: '40px' }}>
          <div className="feature-card">
            <span className="feature-icon">🏥</span>
            <h3>Advanced Facility</h3>
            <p>State-of-the-art infrastructure designed for comfort and efficiency in patient care.</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">👨‍⚕️</span>
            <h3>Expert Doctors</h3>
            <p>Connect with top specialists in various fields with valid certifications and experience.</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">📅</span>
            <h3>Easy Booking</h3>
            <p>Seamless appointment scheduling system that saves time and reduces waiting periods.</p>
          </div>
        </div>
      </section>

      {/* Meet Our Specialists Section */}
      <section className="specialists-section" style={{ padding: '60px 20px', backgroundColor: '#f8f9fa' }}>
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '40px' }}>Meet Our Specialists</h2>
        <div className="specialists-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
          {doctors.slice(0, 3).map((doctor, index) => (
            <div
              key={index}
              className="doctor-card"
              onClick={() => handleDoctorClick(doctor)}
              style={{ backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.2s' }}
            >
              <img
                src={doctor.image || "https://via.placeholder.com/300"}
                alt={doctor.name}
                style={{ width: '100%', height: '300px', objectFit: 'cover' }}
              />
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <h3 style={{ color: '#1976d2', marginBottom: '5px' }}>{doctor.name}</h3>
                <p style={{ color: '#666', fontWeight: 'bold' }}>{doctor.specialization}</p>
                <div style={{ marginTop: '10px', color: '#555' }}>
                  Experience: {doctor.experience} years<br />
                  {state.uid && (
                    <p style={{ marginTop: '5px', color: '#555' }}>
                      Fee: {doctor.consultationfee ? `₹${doctor.consultationfee}` : "Not specified"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <button onClick={() => navigate("/all-doctors")} className="btn btn-primary">
            View All Doctors
          </button>
        </div>
      </section>

      {/* Facilities Showcase */}
      <section className="facilities-section" style={{ padding: '60px 20px' }}>
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '40px' }}>Our Facilities</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', maxWidth: '1000px', margin: '0 auto' }}>
          <img src="https://tse2.mm.bing.net/th/id/OIP.ucuHM29Hfq-jvBy04UqRjwHaE8?cb=defcachec2&rs=1&pid=ImgDetMain&o=7&rm=3" alt="Hospital Hallway" style={{ width: '100%', borderRadius: '8px', height: '250px', objectFit: 'cover' }} />
          <img src="https://www.bing.com/th/id/OIP.XHBWg0nBJYpbbqLGd6S2YgHaE8?w=264&h=211&c=8&rs=1&qlt=90&o=6&cb=defcachec1&pid=3.1&rm=2" alt="Medical Equipment" style={{ width: '100%', borderRadius: '8px', height: '250px', objectFit: 'cover' }} />
        </div>
      </section>
    </div>
  );
};

export default Home;

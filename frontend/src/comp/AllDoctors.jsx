import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Ct from "./Ct";
import "./Home.css"; // Reuse Home CSS for consistent styling

const AllDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const navigate = useNavigate();
    const { state } = useContext(Ct);

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
        <div className="home-container" style={{ paddingTop: "80px" }}> {/* Added padding for fixed nav if applicable */}
            <h2 className="section-title" style={{ textAlign: "center", marginBottom: "40px" }}>All Specialists</h2>
            <div className="specialists-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto', padding: '0 20px 60px' }}>
                {doctors.map((doctor, index) => (
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
        </div>
    );
};

export default AllDoctors;

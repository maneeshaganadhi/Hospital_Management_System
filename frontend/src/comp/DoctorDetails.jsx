import React, { useContext } from "react";
import Ct from "./Ct";
import { useLocation, useNavigate } from "react-router-dom";
import "./Home.css"; // Reusing Home css for consistency

const DoctorDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { state } = useContext(Ct);
    const doctor = location.state;

    if (!doctor) {
        return (
            <div className="dashboard-container" style={{ textAlign: "center", marginTop: "50px" }}>
                <h2>Doctor not found</h2>
                <button onClick={() => navigate("/")} className="btn btn-primary" style={{ marginTop: "20px" }}>
                    Go Home
                </button>
            </div>
        );
    }

    return (
        <div className="home-container" style={{ backgroundColor: "var(--bg-light)", padding: "40px" }}>
            <div className="feature-card" style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "30px", padding: "40px" }}>
                <button
                    onClick={() => navigate("/")}
                    style={{ alignSelf: "flex-start", border: "none", background: "none", color: "var(--primary)", cursor: "pointer", fontSize: "1rem", fontWeight: "600" }}
                >
                    &larr; Back to Home
                </button>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
                    <div style={{
                        background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
                        padding: "40px",
                        color: "white",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        gap: "20px",
                        borderRadius: "12px",
                        width: "100%",
                        boxShadow: "var(--shadow-md)"
                    }}>
                        <img
                            src={doctor.image}
                            alt={doctor.name}
                            style={{ width: "150px", height: "100px", borderRadius: "50%", objectFit: "cover", border: "4px solid rgba(255,255,255,0.3)" }}
                        />
                        <div style={{ textAlign: "center" }}>
                            <h1 style={{ margin: 0, fontSize: "2.5rem", fontWeight: "700" }}>{doctor.name}</h1>
                            <p style={{ margin: "10px 0 0 0", opacity: 0.9, fontSize: "1.2rem" }}>{doctor.specialization}</p>
                        </div>
                    </div>

                    <div style={{ width: "100%", padding: "30px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "25px" }}>
                        <div style={{ padding: "20px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                            <label style={{ display: "block", color: "var(--text-muted)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Experience</label>
                            <div style={{ fontSize: "1.1rem", fontWeight: "500", color: "var(--text-main)" }}>{doctor.experience ? `${doctor.experience} Years` : "Experienced"}</div>
                        </div>
                        <div style={{ padding: "20px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                            <label style={{ display: "block", color: "var(--text-muted)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>About</label>
                            <div style={{ fontSize: "1.1rem", fontWeight: "500", color: "var(--text-main)", lineHeight: "1.6" }}>Specialist in {doctor.specialization}</div>
                        </div>
                        {state.uid && (
                            <div style={{ padding: "20px", background: "#f0fdf4", borderRadius: "10px", border: "1px solid #dcfce7" }}>
                                <label style={{ display: "block", color: "#15803d", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Consultation Fee</label>
                                <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#16a34a" }}>₹{doctor.consultationfee || "Free"}</div>
                            </div>
                        )}
                    </div>

                    <button onClick={() => navigate("/register")} className="btn btn-primary" style={{ marginTop: "20px" }}>
                        Book Appointment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DoctorDetails;
